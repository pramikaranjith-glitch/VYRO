/**
 * VYRO — Zero-Dependency Local Development & Preview Server
 * Built with native Node.js HTTP/FS/PATH modules.
 * Renders the Shopify OS2.0 Theme, mock products, cart AJAX API, and static assets.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

// In-memory cart state for live AJAX interaction
let cartState = {
  item_count: 0,
  total_price: 0,
  items: []
};

// Load mock catalog
let mockData = {};
try {
  mockData = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'mock-products.json'), 'utf8'));
} catch (e) {
  console.warn('Could not read mock-products.json:', e.message);
}

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
};

// Helper: Read a file safely
function readFile(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  if (fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath, 'utf8');
  }
  return '';
}

// Render SVG Logo snippet
function renderLogo(variant = 'navy') {
  const fill = variant === 'ivory' ? '#F4F1E9' : '#101E35';
  return `<svg width="80" height="22" viewBox="0 0 80 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="VYRO" role="img">
    <path d="M2 2L9 20L16 2" stroke="${fill}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M22 2L28 11M34 2L28 11V20" stroke="${fill}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M40 2H48C50.2 2 52 3.8 52 6C52 8.2 50.2 10 48 10H40M40 2V20M40 10L52 20" stroke="${fill}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <ellipse cx="66" cy="11" rx="10" ry="9" stroke="${fill}" stroke-width="1.5" fill="none"/>
  </svg>`;
}

// Render Announcement Bar
function renderAnnouncementBar() {
  return `
    <div class="announcement-bar" role="banner" aria-label="Site announcement">
      <div class="announcement-bar__inner">
        <div class="announcement-bar__brand" aria-hidden="true">
          <span class="vyro-mark">VYRO</span>
        </div>
        <div class="announcement-bar__message" aria-live="polite" aria-atomic="true">
          <span class="announcement-bar__message-rotate js-ann-message">
            Free Shipping Across India | Easy Returns
          </span>
        </div>
        <div class="announcement-bar__links">
          <a href="/pages/contact">Track Order</a>
          <a href="/pages/contact">Support</a>
        </div>
      </div>
    </div>
    <script>
      (function(){
        var msgs = ["Free Shipping Across India | Easy Returns"];
        var el = document.querySelector('.js-ann-message');
        if (!el) return;
        var idx = 0;
        setInterval(function(){
          idx = (idx + 1) % msgs.length;
          el.style.opacity = '0';
          setTimeout(function(){
            el.textContent = msgs[idx];
            el.style.opacity = '1';
          }, 300);
        }, 4000);
        el.style.transition = 'opacity 0.3s ease';
      })();
    </script>
  `;
}

// Render Header Navigation (Ivory navbar)
function renderHeader() {
  return `
    <header class="site-header js-site-header" role="banner">
      <div class="site-header__inner">
        <div class="site-header__left">
          <button
            class="hamburger js-hamburger"
            aria-label="Open navigation menu"
            aria-expanded="false"
            aria-controls="mobile-drawer"
          >
            <span class="hamburger__line"></span>
            <span class="hamburger__line"></span>
            <span class="hamburger__line"></span>
          </button>
        </div>

        <div class="site-logo">
          <a href="/" class="site-logo__link" aria-label="VYRO Home">
            ${renderLogo('navy')}
          </a>
        </div>

        <nav class="site-nav" aria-label="Main navigation">
          <div class="site-nav__item js-mega-trigger" data-menu="shop">
            <button
              class="site-nav__link"
              aria-haspopup="true"
              aria-expanded="false"
              aria-controls="mega-menu-shop"
            >
              Shop
              <svg class="site-nav__chevron" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <div class="mega-menu" id="mega-menu-shop" role="region" aria-label="Shop navigation">
              <div>
                <div class="mega-menu__group-label">Collections</div>
                <a href="/collections/all" class="mega-menu__link">Shop All</a>
                <a href="/collections/all" class="mega-menu__link">Men's Collection</a>
                <a href="/collections/all" class="mega-menu__link">Women's Collection</a>
              </div>
              <div>
                <div class="mega-menu__group-label">Products</div>
                <a href="/products/flexfit-01-midnight-navy" class="mega-menu__link">FLEXFIT 01</a>
                <a href="/collections/all" class="mega-menu__link">Shop by Colour</a>
              </div>
              <div>
                <div class="mega-menu__group-label">Help & Fit</div>
                <a href="#" class="mega-menu__link js-open-fit-guide">Size Guide</a>
                <a href="/#anatomy" class="mega-menu__link">Shift Index</a>
              </div>
            </div>
          </div>

          <div class="site-nav__item">
            <a href="/pages/our-story" class="site-nav__link">Our Story</a>
          </div>

          <div class="site-nav__item">
            <a href="/pages/technology" class="site-nav__link">Technology</a>
          </div>

          <div class="site-nav__item">
            <a href="/pages/contact" class="site-nav__link">Contact</a>
          </div>
        </nav>

        <div class="site-header__actions">
          <button class="nav-icon-btn js-search-open" aria-label="Search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21L16.65 16.65" stroke-linecap="round"/>
            </svg>
          </button>

          <button type="button" class="nav-icon-btn nav-icon-btn--account js-account-open" aria-label="Account" aria-expanded="false" aria-controls="account-drawer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke-linecap="round"/>
            </svg>
          </button>

          <button class="nav-icon-btn js-cart-open" aria-label="Open cart" aria-controls="cart-drawer">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0" stroke-linecap="round"/>
            </svg>
            <span class="cart-badge js-cart-badge" aria-label="Cart items" style="${cartState.item_count > 0 ? 'display:flex;' : 'display:none;'}">${cartState.item_count}</span>
          </button>
        </div>
      </div>
    </header>

    <div class="account-drawer" id="account-drawer" role="dialog" aria-modal="false" aria-label="Account">
      <div class="account-drawer__inner">
        <div class="account-drawer__title">Account</div>
        <a href="/account/login" class="btn btn--primary btn--full" style="margin-top:var(--space-2);">Sign In</a>
        <a href="/account/register" class="btn btn--outline btn--full">Create Account</a>
        <p class="account-drawer__note">Authentication will connect to Shopify customer accounts once the store is set up.</p>
      </div>
    </div>
  `;
}

// Render Hero Section
function renderHero() {
  return `
    <section class="hero" aria-label="Hero campaign">
      <div class="hero__slides">
        <div class="hero__slide is-active" aria-hidden="false">
          <img
            class="hero__slide-img"
            src="/assets/mock/hero-slide-1.jpg"
            alt="Two healthcare professionals in athletic-fit midnight navy medical apparel"
            fetchpriority="high"
            width="1920"
            height="840"
          >
          <div class="hero__gradient" aria-hidden="true"></div>
        </div>

        <div class="hero__slide" aria-hidden="true">
          <img
            class="hero__slide-img"
            src="/assets/mock/hero-slide-2.jpg"
            alt="Healthcare professional in midnight navy scrubs walking through sunlit corridor"
            loading="lazy"
            width="1920"
            height="840"
          >
          <div class="hero__gradient" aria-hidden="true"></div>
        </div>

        <div class="hero__slide" aria-hidden="true">
          <img
            class="hero__slide-img"
            src="/assets/mock/hero-slide-3.jpg"
            alt="Seated portrait of clinician wearing midnight navy medical wear"
            loading="lazy"
            width="1920"
            height="840"
          >
          <div class="hero__gradient" aria-hidden="true"></div>
        </div>

        <div class="hero__content">
          <span class="eyebrow eyebrow--light">
            Premium Medical Apparel
          </span>

          <h1 class="hero__headline">
            BUILT FOR THE LONG SHIFT.
          </h1>

          <p class="hero__subline">
            Engineered for the Shift. Designed for You.
          </p>

          <a href="/products/flexfit-01-midnight-navy" class="btn btn--ivory btn--lg">
            SHOP THE COLLECTION
            <span class="btn__arrow" aria-hidden="true">→</span>
          </a>
        </div>

        <div class="hero__indicators" role="tablist" aria-label="Slide navigation">
          <button class="hero__indicator is-active" role="tab" aria-selected="true" aria-label="Slide 1" data-slide="0">
            <span class="hero__indicator-line" aria-hidden="true"></span>
            <span>01</span>
          </button>
          <button class="hero__indicator" role="tab" aria-selected="false" aria-label="Slide 2" data-slide="1">
            <span class="hero__indicator-line" aria-hidden="true"></span>
            <span>02</span>
          </button>
          <button class="hero__indicator" role="tab" aria-selected="false" aria-label="Slide 3" data-slide="2">
            <span class="hero__indicator-line" aria-hidden="true"></span>
            <span>03</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

// Render Featured Product Section (3-column split)
function renderFeaturedProduct() {
  return `
    <section class="featured-product reveal" aria-label="Featured product: FLEXFIT 01">
      <div class="featured-product__side-index" aria-hidden="true">
        <span>01</span>
        <span style="opacity:0.3">02</span>
        <span style="opacity:0.3">03</span>
      </div>

      <div class="featured-product__images">
        <img
          class="featured-product__img-front"
          src="/assets/mock/product-front.svg"
          alt="FLEXFIT 01 Midnight Navy — Front view"
          loading="lazy"
          width="400"
          height="500"
        >
        <img
          class="featured-product__img-back"
          src="/assets/mock/product-back.svg"
          alt="FLEXFIT 01 Midnight Navy — Back view"
          loading="lazy"
          width="400"
          height="500"
        >
      </div>

      <div class="featured-product__info">
        <div class="featured-product__collection eyebrow">
          The First Collection
        </div>

        <h2 class="featured-product__name">
          FLEXFIT 01
        </h2>

        <p class="featured-product__tagline">
          Move. Perform. Excel.
        </p>

        <div class="featured-product__price">
          ₹2,299
        </div>

        <div style="margin-bottom:var(--space-3);">
          <span class="featured-product__collection" style="display:block;margin-bottom:4px;">Colour</span>
          <span style="font-size:var(--text-sm);font-weight:600;">Midnight Navy</span>
        </div>

        <div style="margin-bottom:var(--space-2);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2);">
            <span class="featured-product__collection" style="display:block;">Size</span>
            <button type="button" class="size-guide-link js-open-fit-guide" aria-label="Open size guide">Size Guide</button>
          </div>

          <div class="size-selector" role="group" aria-label="Select a size">
            <button type="button" class="size-chip" data-size="S" data-variant-id="10101" aria-pressed="false">S</button>
            <button type="button" class="size-chip" data-size="M" data-variant-id="10102" aria-pressed="false">M</button>
            <button type="button" class="size-chip" data-size="L" data-variant-id="10103" aria-pressed="false">L</button>
            <button type="button" class="size-chip" data-size="XL" data-variant-id="10104" data-unavailable="true" aria-disabled="true" title="XL — Out of stock">XL</button>
          </div>
          <div class="size-error" role="alert">Please select a size to continue.</div>
        </div>

        <div class="featured-product__actions">
          <button type="button" class="btn btn--primary js-add-to-cart" data-original-text="ADD TO BAG" style="flex:1;">
            ADD TO BAG
          </button>
          <button type="button" class="btn btn--outline js-buy-now" style="flex:1;">
            BUY NOW
          </button>
        </div>

        <a href="/products/flexfit-01-midnight-navy" class="link-underline" style="margin-top:var(--space-3);font-size:var(--text-xs);color:var(--sage);">
          View full details <span aria-hidden="true">→</span>
        </a>
      </div>

      <img
        class="featured-product__pocket"
        src="/assets/mock/pocket-detail.svg"
        alt="FLEXFIT 01 — Concealed zippered pocket detail"
        loading="lazy"
        width="400"
        height="500"
      >
    </section>
  `;
}

// Render Feature Strip (5 items with line icons)
function renderFeatureStrip() {
  return `
    <section class="feature-strip" aria-label="FLEXFIT 01 features">
      <div class="feature-strip__inner container">
        <div class="feature-strip__item">
          <div class="feature-strip__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5l6.74-6.76zM16 8L2 22M17.5 15H9"/></svg>
          </div>
          <span class="feature-strip__label">Ultra-Light Fabric</span>
          <span class="feature-strip__pending">◎ Pending verification</span>
        </div>

        <div class="feature-strip__item">
          <div class="feature-strip__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/></svg>
          </div>
          <span class="feature-strip__label">4-Way Stretch</span>
          <span class="feature-strip__pending">◎ Pending verification</span>
        </div>

        <div class="feature-strip__item">
          <div class="feature-strip__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"/></svg>
          </div>
          <span class="feature-strip__label">Breathable Design</span>
          <span class="feature-strip__pending">◎ Pending verification</span>
        </div>

        <div class="feature-strip__item">
          <div class="feature-strip__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <span class="feature-strip__label">All-Day Comfort</span>
          <span class="feature-strip__pending">◎ Pending verification</span>
        </div>

        <div class="feature-strip__item">
          <div class="feature-strip__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <span class="feature-strip__label">Long-Lasting Quality</span>
          <span class="feature-strip__pending">◎ Pending verification</span>
        </div>
      </div>
    </section>
  `;
}

// Render Anatomy Section
function renderAnatomy() {
  return `
    <section class="anatomy-section section reveal" id="anatomy" aria-label="FLEXFIT 01 Anatomy">
      <div class="container">
        <div class="anatomy-section__inner">
          <div class="anatomy-image-wrap" aria-label="FLEXFIT 01 garment diagram with labelled features">
            <div style="width:100%;aspect-ratio:4/5;background:linear-gradient(135deg,#0d1826 0%,#1a2f52 100%);border:1px solid rgba(244,241,233,0.1);border-radius:var(--radius-sm);position:relative;display:flex;align-items:center;justify-content:center;">
              <svg width="220" height="280" viewBox="0 0 220 280" fill="none" aria-hidden="true" style="opacity:0.85;">
                <path d="M110 30 C80 30 55 45 55 45 L15 95 L40 125 L65 110 V250 H155 V110 L180 125 L205 95 L165 45 S140 30 110 30 Z" stroke="#F4F1E9" stroke-width="1.5" fill="rgba(244,241,233,0.03)"/>
                <path d="M85 30 L110 75 L135 30" stroke="#84958C" stroke-width="1.5"/>
                <rect x="70" y="90" width="35" height="40" rx="2" stroke="#84958C" stroke-width="1.5" stroke-dasharray="2 2" fill="none"/>
                <line x1="110" y1="75" x2="110" y2="250" stroke="rgba(244,241,233,0.15)" stroke-width="1" stroke-dasharray="3 3"/>
              </svg>

              <!-- Hotspot 1: Neckline -->
              <div class="hotspot" style="left:50%;top:18%;" data-hotspot-num="1">
                <div class="hotspot__dot" role="button" tabindex="0" aria-label="Feature 1: Contoured V-Neckline" aria-expanded="false">
                  <span class="hotspot__number" aria-hidden="true">1</span>
                </div>
                <div class="hotspot__tooltip" role="tooltip">
                  <div class="hotspot__tooltip-label">Contoured V-Neckline</div>
                  <div class="hotspot__tooltip-desc">Engineered bonded facing that lies flat against the collarbone without chafing during long procedures.</div>
                </div>
              </div>

              <!-- Hotspot 2: Shoulder -->
              <div class="hotspot" style="left:26%;top:30%;" data-hotspot-num="2">
                <div class="hotspot__dot" role="button" tabindex="0" aria-label="Feature 2: Articulated Shoulder Panel" aria-expanded="false">
                  <span class="hotspot__number" aria-hidden="true">2</span>
                </div>
                <div class="hotspot__tooltip" role="tooltip">
                  <div class="hotspot__tooltip-label">Articulated Shoulder Yoke</div>
                  <div class="hotspot__tooltip-desc">Forward-shifted shoulder seams prevent compression under heavy lead aprons and stethoscopes.</div>
                </div>
              </div>

              <!-- Hotspot 3: Pocket -->
              <div class="hotspot" style="left:40%;top:42%;" data-hotspot-num="3">
                <div class="hotspot__dot" role="button" tabindex="0" aria-label="Feature 3: Concealed Pen & Chest Pocket" aria-expanded="false">
                  <span class="hotspot__number" aria-hidden="true">3</span>
                </div>
                <div class="hotspot__tooltip" role="tooltip">
                  <div class="hotspot__tooltip-label">Drop-In Chest Pocket</div>
                  <div class="hotspot__tooltip-desc">Deep-welded pocket sized for clinical pagers, smartphones, and diagnostic penlights with zero sag.</div>
                </div>
              </div>

              <!-- Hotspot 4: Stitching -->
              <div class="hotspot" style="left:72%;top:56%;" data-hotspot-num="4">
                <div class="hotspot__dot" role="button" tabindex="0" aria-label="Feature 4: Reinforced Flatlock Stitching" aria-expanded="false">
                  <span class="hotspot__number" aria-hidden="true">4</span>
                </div>
                <div class="hotspot__tooltip" role="tooltip">
                  <div class="hotspot__tooltip-label">Bar-Tack Reinforcement</div>
                  <div class="hotspot__tooltip-desc">Double-needle flatlock construction tested for high-stress torsional pull and industrial laundering.</div>
                </div>
              </div>

              <!-- Hotspot 5: Fabric -->
              <div class="hotspot" style="left:50%;top:74%;" data-hotspot-num="5">
                <div class="hotspot__dot" role="button" tabindex="0" aria-label="Feature 5: 4-Way Performance Weave" aria-expanded="false">
                  <span class="hotspot__number" aria-hidden="true">5</span>
                </div>
                <div class="hotspot__tooltip" role="tooltip">
                  <div class="hotspot__tooltip-label">4-Way Mechanical Stretch</div>
                  <div class="hotspot__tooltip-desc">Poly-elastane micro-weave providing rapid thermal moisture management and silent stretch.</div>
                </div>
              </div>
            </div>
          </div>

          <div class="anatomy-info">
            <span class="eyebrow eyebrow--light" style="margin-bottom:var(--space-4);">
              The Anatomy of FLEXFIT
            </span>
            <h2 class="h2" style="color:var(--ivory);margin-bottom:var(--space-6);">
              ENGINEERED IN DETAIL.
            </h2>

            <div class="anatomy-callout-list">
              <div class="anatomy-callout-item" data-hotspot-num="1" tabindex="0" role="button">
                <div class="anatomy-callout-item__num">01</div>
                <div>
                  <div class="anatomy-callout-item__title">Contoured V-Neckline</div>
                  <div class="anatomy-callout-item__desc">Structured flat-lay collar prevents friction against surgical scrubs and diagnostic leads.</div>
                </div>
              </div>

              <div class="anatomy-callout-item" data-hotspot-num="2" tabindex="0" role="button">
                <div class="anatomy-callout-item__num">02</div>
                <div>
                  <div class="anatomy-callout-item__title">Articulated Shoulder Yoke</div>
                  <div class="anatomy-callout-item__desc">Zero-seam shoulder summit eliminates strap pressure points during long operative shifts.</div>
                </div>
              </div>

              <div class="anatomy-callout-item" data-hotspot-num="3" tabindex="0" role="button">
                <div class="anatomy-callout-item__num">03</div>
                <div>
                  <div class="anatomy-callout-item__title">Drop-In Chest Pocket</div>
                  <div class="anatomy-callout-item__desc">Reinforced pen slot and internal divider for clinical tools with zero external bulge.</div>
                </div>
              </div>

              <div class="anatomy-callout-item" data-hotspot-num="4" tabindex="0" role="button">
                <div class="anatomy-callout-item__num">04</div>
                <div>
                  <div class="anatomy-callout-item__title">Bar-Tack Reinforcement</div>
                  <div class="anatomy-callout-item__desc">Triple-stitched side splits designed to withstand hospital-grade industrial drying.</div>
                </div>
              </div>

              <div class="anatomy-callout-item" data-hotspot-num="5" tabindex="0" role="button">
                <div class="anatomy-callout-item__num">05</div>
                <div>
                  <div class="anatomy-callout-item__title">4-Way Mechanical Stretch</div>
                  <div class="anatomy-callout-item__desc">Micro-denier performance yarn engineered for silent mobility and wrinkle resistance.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Render ScentShift Technology Section
function renderScentShift() {
  return `
    <section class="scentshift-section section reveal" id="scentshift" aria-label="ScentShift Technology">
      <div class="container">
        <div class="scentshift-section__grid">
          <div>
            <span class="eyebrow eyebrow--light" style="margin-bottom:var(--space-5);color:var(--sage);">
              VYRO Technology
            </span>

            <div class="scentshift-section__status" role="note" aria-label="Development status">
              <span class="scentshift-section__status-dot" aria-hidden="true"></span>
              CURRENTLY IN DEVELOPMENT.
            </div>

            <h2 class="scentshift-section__headline">
              INTRODUCING SCENTSHIFT.
            </h2>

            <p class="scentshift-section__desc">
              Exploring the next generation of fragrance-release textile technology.
            </p>

            <div class="scentshift-section__dev-label" role="note">
              CURRENTLY IN DEVELOPMENT.
            </div>

            <p style="margin-top:var(--space-4);font-size:var(--text-xs);letter-spacing:0.08em;color:rgba(244,241,233,0.3);line-height:1.7;max-width:380px;">
              ScentShift is an exploratory research concept. No claims are made regarding proven performance, commercial availability, or specific functional mechanisms. All details are subject to change.
            </p>
          </div>

          <div class="scentshift-images reveal">
            <img
              src="/assets/mock/scentshift-macro-1.svg"
              alt="Extreme close-up of woven midnight navy textile fibre with sage highlights"
              loading="lazy"
              width="600"
              height="400"
            >
            <img
              src="/assets/mock/scentshift-macro-2.svg"
              alt="Close-up of FLEXFIT fabric weave structure under laboratory lighting"
              loading="lazy"
              width="600"
              height="400"
            >
          </div>
        </div>
      </div>
    </section>
  `;
}

// Render Philosophy Section (diagonal panel)
function renderPhilosophy() {
  return `
    <section class="philosophy-section reveal" aria-label="Our philosophy">
      <div class="philosophy-section__image">
        <img
          src="/assets/mock/philosophy-editorial.jpg"
          alt="Two healthcare professionals in discussion in a minimal architectural space"
          loading="lazy"
          width="1000"
          height="667"
        >
      </div>

      <div class="philosophy-section__text">
        <span class="eyebrow eyebrow--sage" style="margin-bottom:var(--space-4);">
          Our Philosophy
        </span>

        <h2 class="philosophy-section__headline">
          MORE THAN JUST MEDICAL WEAR.
        </h2>

        <p class="philosophy-section__body">
          At VYRO, we blend professional identity with modern design, creating premium medical apparel for the people who never stop.
        </p>

        <a href="/pages/our-story" class="link-underline">
          OUR STORY
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  `;
}

// Render Shift Journal Section
function renderShiftJournal() {
  return `
    <section class="shift-journal section" aria-label="VYRO Shift Journal">
      <div class="container">
        <div class="section__header">
          <span class="eyebrow eyebrow--sage" style="margin-bottom:var(--space-3);">
            The Shift Journal
          </span>
          <h2 class="h2" style="margin-bottom:0;">
            STORIES FROM THE SHIFT.
          </h2>
        </div>

        <div class="shift-journal__grid reveal-stagger">
          <article class="journal-card">
            <div class="journal-card__img-wrap">
              <img src="/assets/mock/journal-1.svg" alt="The Art of the Long Shift editorial photograph" loading="lazy" width="800" height="533">
            </div>
            <div class="journal-card__meta">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span class="journal-card__category">Professional Life</span>
                <span class="journal-card__issue">Issue 01</span>
              </div>
              <h3 class="journal-card__title">The Art of the Long Shift: Focus, Fatigue, and the Anatomy of Endurance</h3>
              <a href="/pages/our-story" class="journal-card__read link-underline">Read <span aria-hidden="true">→</span></a>
            </div>
          </article>

          <article class="journal-card">
            <div class="journal-card__img-wrap">
              <img src="/assets/mock/journal-2.svg" alt="What Your Scrubs Say About You editorial photograph" loading="lazy" width="800" height="533">
            </div>
            <div class="journal-card__meta">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span class="journal-card__category">Identity & Style</span>
                <span class="journal-card__issue">Issue 02</span>
              </div>
              <h3 class="journal-card__title">What Your Scrubs Say About You in the Operating Theatre</h3>
              <a href="/pages/our-story" class="journal-card__read link-underline">Read <span aria-hidden="true">→</span></a>
            </div>
          </article>

          <article class="journal-card">
            <div class="journal-card__img-wrap">
              <img src="/assets/mock/journal-3.svg" alt="Designing for Comfort and Performance editorial photograph" loading="lazy" width="800" height="533">
            </div>
            <div class="journal-card__meta">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <span class="journal-card__category">Design & Textile</span>
                <span class="journal-card__issue">Issue 03</span>
              </div>
              <h3 class="journal-card__title">Designing for Mobility: Why 4-Way Mechanical Stretch Matters</h3>
              <a href="/pages/our-story" class="journal-card__read link-underline">Read <span aria-hidden="true">→</span></a>
            </div>
          </article>
        </div>

        <p style="margin-top:var(--space-6);font-size:var(--text-xs);color:var(--sage);opacity:0.6;text-align:center;letter-spacing:0.06em;">
          All Shift Journal articles and imagery are editorial wireframes pending author production.
        </p>
      </div>
    </section>
  `;
}

// Render Customer Reviews Section (EMPTY STATE)
function renderReviews() {
  return `
    <section class="reviews-section section" aria-label="Customer reviews">
      <div class="container">
        <div class="section__header section__header--center reveal">
          <span class="eyebrow eyebrow--sage" style="margin-bottom:var(--space-3);">
            Real Stories
          </span>
          <h2 class="h2" style="margin-bottom:0;">
            TRUSTED BY PROFESSIONALS.
          </h2>
        </div>

        <div class="reviews-empty" role="status" aria-live="polite">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <path d="M24 8L28.5 17.5L39 19L31.5 26.5L33.5 37L24 32L14.5 37L16.5 26.5L9 19L19.5 17.5L24 8Z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="font-heading" style="font-size:var(--text-lg);font-weight:800;text-transform:uppercase;letter-spacing:-0.01em;opacity:0.6;">
            Reviews Coming Soon
          </p>
          <p style="font-size:var(--text-sm);max-width:420px;text-align:center;line-height:1.65;color:var(--muted);">
            Verified customer stories will appear here after launch. We never publish unverified or fabricated reviews.
          </p>
        </div>
      </div>
    </section>
  `;
}

// Render Newsletter Section
function renderNewsletter() {
  return `
    <section class="newsletter-section section" aria-label="Newsletter sign-up">
      <div class="container container--narrow" style="text-align:center;">
        <span class="eyebrow eyebrow--light" style="margin-bottom:var(--space-4);color:var(--sage);">
          The Shift Journal
        </span>

        <h2 class="newsletter-section__headline">
          STAY IN THE SHIFT.
        </h2>

        <p class="newsletter-section__sub">
          Stories, launches, and updates from VYRO. For the people who never clock out.
        </p>

        <form
          class="newsletter-form js-newsletter-form"
          action="#"
          method="post"
          novalidate
          aria-label="Newsletter sign-up form"
        >
          <input
            type="email"
            class="newsletter-form__input"
            name="email"
            placeholder="Enter your email address"
            aria-label="Email address"
            required
            autocomplete="email"
          >
          <button type="submit" class="newsletter-form__submit" aria-label="Subscribe to newsletter">
            <span>Subscribe</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
              <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round"/>
              <polyline points="12 5 19 12 12 19" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </form>

        <div class="newsletter-form__message js-newsletter-msg" role="alert" aria-live="polite" aria-atomic="true"></div>
        <span class="newsletter-integration-note">Newsletter Integration Pending</span>
        <p style="margin-top:var(--space-4);font-size:var(--text-xs);color:rgba(244,241,233,0.3);letter-spacing:0.06em;">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  `;
}

// Render Footer
function renderFooter() {
  const year = new Date().getFullYear();
  return `
    <footer class="site-footer" role="contentinfo" aria-label="Site footer">
      <div class="container">
        <div class="site-footer__grid">
          <div class="footer-col">
            <div style="margin-bottom: var(--space-3);">
              ${renderLogo('ivory')}
            </div>
            <p class="site-footer__brand-tagline">WEAR THE PROFESSIONAL YOU.</p>
          </div>

          <div class="footer-col">
            <div class="footer-col__label">Quick Links</div>
            <ul class="footer-col__links">
              <li><a href="/collections/all">Shop</a></li>
              <li><a href="/pages/our-story">Our Story</a></li>
              <li><a href="/pages/technology">Technology</a></li>
              <li><a href="/pages/contact">Contact</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <div class="footer-col__label">Policies</div>
            <ul class="footer-col__links">
              <li><a href="/pages/contact">Shipping Policy</a></li>
              <li><a href="/pages/contact">Return &amp; Exchange</a></li>
              <li><a href="/pages/contact">Privacy Policy</a></li>
              <li><a href="/pages/contact">Terms &amp; Conditions</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <div class="footer-col__label">Stay in Touch</div>
            <p style="font-size:var(--text-sm);opacity:0.65;margin-bottom:var(--space-3);line-height:1.6;">
              Get the latest updates and offers.
            </p>

            <div class="footer-newsletter">
              <form class="footer-newsletter__input-wrap js-footer-newsletter-form" action="#" method="post" novalidate aria-label="Footer newsletter sign-up">
                <input type="email" class="footer-newsletter__input" placeholder="your@email.com" aria-label="Email address" name="email" required autocomplete="email">
                <button type="submit" class="footer-newsletter__submit" aria-label="Subscribe">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round"/>
                    <polyline points="12 5 19 12 12 19" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </form>
              <div class="newsletter-form__message js-footer-nl-msg" role="alert" aria-live="polite"></div>
              <div class="newsletter-integration-note">Integration Pending</div>
            </div>

            <div class="footer-socials" style="margin-top:var(--space-4);">
              <a href="#" class="footer-social-btn" aria-label="VYRO on Instagram">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="#" class="footer-social-btn" aria-label="VYRO on WhatsApp">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <a href="#" class="footer-social-btn" aria-label="VYRO on YouTube">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" stroke-linecap="round" stroke-linejoin="round"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div class="site-footer__bottom">
          <span>&copy; <span class="js-copyright-year">${year}</span> VYRO. All rights reserved.</span>
          <span>Made for Healthcare Professionals.</span>
        </div>
      </div>
    </footer>
  `;
}

// Render Mobile Navigation Drawer
function renderMobileDrawer() {
  return `
    <div class="mobile-drawer" id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation menu" tabindex="-1">
      <div class="mobile-drawer__header">
        <a href="/" class="site-logo__link" aria-label="VYRO Home">
          ${renderLogo('navy')}
        </a>
        <button type="button" class="mobile-drawer__close js-drawer-close" aria-label="Close navigation menu" data-drawer="mobile-drawer">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" stroke-linecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <nav class="mobile-drawer__nav" aria-label="Mobile navigation">
        <ul>
          <li class="mobile-nav__item">
            <button type="button" class="mobile-nav__link js-mobile-subnav-toggle" aria-expanded="false" aria-controls="mobile-subnav-shop">
              Shop
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <ul class="mobile-subnav" id="mobile-subnav-shop" aria-hidden="true">
              <li><a href="/collections/all" class="mobile-subnav__link">Shop All</a></li>
              <li><a href="/collections/all" class="mobile-subnav__link">Men's Collection</a></li>
              <li><a href="/collections/all" class="mobile-subnav__link">Women's Collection</a></li>
              <li><a href="/products/flexfit-01-midnight-navy" class="mobile-subnav__link">FLEXFIT 01</a></li>
              <li><a href="#" class="mobile-subnav__link js-open-fit-guide">Size Guide</a></li>
            </ul>
          </li>

          <li class="mobile-nav__item">
            <a href="/pages/our-story" class="mobile-nav__link">Our Story <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          </li>

          <li class="mobile-nav__item">
            <a href="/pages/technology" class="mobile-nav__link">Technology <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          </li>

          <li class="mobile-nav__item">
            <a href="/pages/contact" class="mobile-nav__link">Contact <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          </li>
        </ul>
      </nav>

      <div class="mobile-drawer__footer">
        <a href="/account" class="mobile-drawer__action">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke-linecap="round"/></svg>
          Account
        </a>
        <a href="/pages/contact" class="mobile-drawer__action">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke-linecap="round"/><circle cx="12" cy="10" r="3"/></svg>
          Track Order
        </a>
        <a href="/pages/contact" class="mobile-drawer__action">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.0 1.19 2 2 0 012 .0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" stroke-linecap="round"/></svg>
          Support
        </a>
      </div>
    </div>
  `;
}

// Render Cart Drawer
function renderCartDrawerSection() {
  const isCartEmpty = cartState.items.length === 0;
  
  let itemsHtml = '';
  if (isCartEmpty) {
    itemsHtml = `
      <div class="cart-drawer__empty js-cart-empty-state">
        <svg class="cart-drawer__empty-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" fill="none" stroke="currentColor"/>
          <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="1"/>
          <path d="M16 10a4 4 0 01-8 0" stroke-currentColor stroke-width="1" fill="none" stroke-linecap="round"/>
        </svg>
        <p class="font-heading" style="font-size:var(--text-md);font-weight:800;text-transform:uppercase;letter-spacing:-0.01em;">Your bag is empty</p>
        <p class="body-sm text-muted">When you add products, they'll appear here.</p>
        <button type="button" class="btn btn--outline js-cart-close" style="margin-top:var(--space-2);">Start Shopping</button>
      </div>
    `;
  } else {
    itemsHtml = cartState.items.map(item => `
      <div class="cart-item" data-item-key="${item.id}">
        <img class="cart-item__img" src="${item.image}" alt="${item.title}" width="80" height="100">
        <div class="cart-item__info">
          <div class="cart-item__name">${item.title}</div>
          <div class="cart-item__meta">${item.size ? `Size: ${item.size}` : ''} | Midnight Navy</div>
          <div class="cart-item__price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
          <div class="cart-item__qty">
            <button type="button" class="qty-btn js-qty-minus" data-key="${item.id}" data-qty="${item.quantity - 1}" aria-label="Decrease quantity">−</button>
            <span class="qty-value js-qty-value">${item.quantity}</span>
            <button type="button" class="qty-btn js-qty-plus" data-key="${item.id}" data-qty="${item.quantity + 1}" aria-label="Increase quantity">+</button>
            <button type="button" class="cart-item__remove js-remove-item" data-key="${item.id}">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  return `
    <div class="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart" tabindex="-1">
      <div class="cart-drawer__header">
        <h2 class="cart-drawer__title">Your Bag (<span class="js-cart-count">${cartState.item_count}</span>)</h2>
        <button type="button" class="cart-drawer__close js-drawer-close" aria-label="Close cart" data-drawer="cart-drawer">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" stroke-linecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="cart-drawer__body js-cart-drawer-body">
        ${itemsHtml}
      </div>
      <div class="cart-drawer__footer js-cart-footer" style="${isCartEmpty ? 'display:none;' : ''}">
        <div class="cart-subtotal">
          <span class="cart-subtotal__label">Subtotal</span>
          <span class="cart-subtotal__amount js-cart-subtotal">₹${cartState.total_price.toLocaleString('en-IN')}</span>
        </div>
        <p class="body-sm text-muted" style="font-size:var(--text-xs);opacity:0.6;text-align:center;">Shipping &amp; taxes calculated at checkout</p>
        <a href="/checkout" class="btn btn--primary btn--full btn--lg">
          Checkout <span class="btn__arrow">→</span>
        </a>
        <button type="button" class="btn btn--outline btn--full js-cart-close">Continue Shopping</button>
      </div>
    </div>
  `;
}

// Render Fit Guide Modal
function renderFitGuideModal() {
  const sectionContent = readFile('sections/fit-guide-modal.liquid');
  return sectionContent
    .replace(/\{%\s*schema\s*%\}[\s\S]*?\{%\s*endschema\s*%\}/g, '')
    .replace(/\{%\s*comment\s*%\}[\s\S]*?\{%\s*endcomment\s*%\}/g, '');
}

// Assemble full HTML page using layout/theme.liquid
function renderPage(contentHtml, pageTitle = 'WEAR THE PROFESSIONAL YOU.', templateName = 'index') {
  let layout = readFile('layout/theme.liquid');

  // Title replacement
  layout = layout.replace(
    /\{%-?\s*if\s+page_title\s*==\s*blank\s*-?%\}[\s\S]*?\{%-?\s*endif\s*-?%\}/,
    `<title>VYRO — ${pageTitle}</title>`
  );

  // Description replacement
  layout = layout.replace(
    /\{%-?\s*if\s+page_description\s*-?%\}[\s\S]*?\{%-?\s*endif\s*-?%\}/g,
    '<meta name="description" content="Luxury Performance Medical Wear. Built for the long shift.">'
  );

  // Open Graph & Shop Name
  layout = layout.replace(/\{\{\s*shop\.name\s*\}\}/g, 'VYRO');
  layout = layout.replace(/\{\{\s*canonical_url\s*\}\}/g, 'http://localhost:3000');
  layout = layout.replace(/\{\{\s*page_title\s*\|\s*default:\s*shop\.name\s*\}\}/g, `VYRO — ${pageTitle}`);
  layout = layout.replace(/\{%-?\s*if\s+page_image\s*-?%\}[\s\S]*?\{%-?\s*endif\s*-?%\}/g, '');
  layout = layout.replace(/\{%-?\s*if\s+settings\.google_analytics_id[\s\S]*?\{%-?\s*endif\s*-?%\}/g, '');
  layout = layout.replace(/\{%-?\s*if\s+settings\.meta_pixel_id[\s\S]*?\{%-?\s*endif\s*-?%\}/g, '');
  layout = layout.replace(/\{\{\s*content_for_header\s*\}\}/g, '');

  // Critical Asset Links
  layout = layout.replace(/\{\{\s*'theme\.css'\s*\|\s*asset_url\s*\|\s*stylesheet_tag\s*\}\}/g, '<link rel="stylesheet" href="/assets/theme.css">');
  layout = layout.replace(/\{\{\s*'theme\.js'\s*\|\s*asset_url\s*\}\}/g, '/assets/theme.js');
  layout = layout.replace(/\{\{\s*'favicon\.svg'\s*\|\s*asset_url\s*\}\}/g, '/assets/mock/favicon.svg');

  // TARGET BODY TAG ONLY: Prevents destroying the <head>
  layout = layout.replace(/<body\s+class="[^"]*"/, `<body class="template-${templateName}"`);

  // MOCK DATA Badge
  layout = layout.replace(
    /\{%[-]?\s*if\s*settings\.show_mock_badge\s*[-]?%\}[\s\S]*?\{%[-]?\s*endif\s*[-]?%\}/g, 
    '<div class="mock-badge" aria-hidden="true" title="Mock data layer active. Configure in settings_schema.json">⚠ MOCK DATA</div>'
  );

  // Persistent Sections
  layout = layout.replace(/\{%[-]?\s*section\s*'announcement-bar'\s*[-]?%\}/g, renderAnnouncementBar());
  layout = layout.replace(/\{%[-]?\s*section\s*'header'\s*[-]?%\}/g, renderHeader());
  layout = layout.replace(/\{%[-]?\s*section\s*'footer'\s*[-]?%\}/g, renderFooter());
  layout = layout.replace(/\{%[-]?\s*section\s*'mobile-drawer'\s*[-]?%\}/g, renderMobileDrawer());
  layout = layout.replace(/\{%[-]?\s*section\s*'cart-drawer'\s*[-]?%\}/g, renderCartDrawerSection());
  layout = layout.replace(/\{%[-]?\s*section\s*'fit-guide-modal'\s*[-]?%\}/g, renderFitGuideModal());

  // Main Content
  layout = layout.replace(/\{\{\s*content_for_layout\s*\}\}/g, contentHtml);

  return layout;
}

// Build Homepage HTML by stitching sections in exact order
function buildHomepage() {
  const fullContent = [
    renderHero(),
    renderFeaturedProduct(),
    renderFeatureStrip(),
    renderAnatomy(),
    renderScentShift(),
    renderPhilosophy(),
    renderShiftJournal(),
    renderReviews(),
    renderNewsletter()
  ].join('\n');

  return renderPage(fullContent, 'WEAR THE PROFESSIONAL YOU.', 'index');
}

// Build Product Detail Page HTML
function buildProductPage() {
  const content = `
    <div class="container">
      <nav aria-label="Breadcrumb" style="padding-top:var(--space-4);padding-bottom:var(--space-2);">
        <ol style="display:flex;gap:8px;font-size:var(--text-xs);letter-spacing:0.08em;text-transform:uppercase;color:var(--sage);">
          <li><a href="/" style="color:var(--sage);">Home</a></li>
          <li aria-hidden="true" style="opacity:0.4;">/</li>
          <li><a href="/collections/all" style="color:var(--sage);">Shop</a></li>
          <li aria-hidden="true" style="opacity:0.4;">/</li>
          <li style="color:var(--navy);font-weight:600;">FLEXFIT 01 — Midnight Navy</li>
        </ol>
      </nav>

      <div class="product-page">
        <!-- Gallery -->
        <div class="product-gallery" aria-label="Product images">
          <div class="product-gallery__thumbnails" role="listbox" aria-label="Product image thumbnails">
            <img class="product-gallery__thumb is-active" src="/assets/mock/product-front.svg" data-full="/assets/mock/product-front.svg" alt="Front view" tabindex="0" role="option">
            <img class="product-gallery__thumb" src="/assets/mock/product-back.svg" data-full="/assets/mock/product-back.svg" alt="Back view" tabindex="0" role="option">
            <img class="product-gallery__thumb" src="/assets/mock/product-side.svg" data-full="/assets/mock/product-side.svg" alt="Side profile" tabindex="0" role="option">
            <img class="product-gallery__thumb" src="/assets/mock/model-wearing.svg" data-full="/assets/mock/model-wearing.svg" alt="Model wearing in clinic" tabindex="0" role="option">
            <img class="product-gallery__thumb" src="/assets/mock/fabric-macro.svg" data-full="/assets/mock/fabric-macro.svg" alt="Fabric close-up" tabindex="0" role="option">
            <img class="product-gallery__thumb" src="/assets/mock/pocket-detail.svg" data-full="/assets/mock/pocket-detail.svg" alt="Pocket construction" tabindex="0" role="option">
            <img class="product-gallery__thumb" src="/assets/mock/stitching-detail.svg" data-full="/assets/mock/stitching-detail.svg" alt="Bar-tack stitching" tabindex="0" role="option">
          </div>

          <div class="product-gallery__main-wrap">
            <img class="product-gallery__main" id="product-main-image" src="/assets/mock/product-front.svg" alt="FLEXFIT 01 Midnight Navy" width="600" height="750" fetchpriority="high">
          </div>
        </div>

        <!-- Product info -->
        <div class="product-info">
          <div>
            <h1 class="product-info__name">FLEXFIT 01 — Midnight Navy</h1>
            <p style="font-size:var(--text-xs);letter-spacing:0.1em;text-transform:uppercase;color:var(--sage);margin-bottom:var(--space-2);">VYRO Medical Wear</p>
            <div class="product-info__price" id="product-price">
              ₹2,299
            </div>
            <p style="font-size:var(--text-xs);letter-spacing:0.08em;color:var(--sage);margin-top:4px;">Two-piece performance scrub set</p>
          </div>

          <div>
            <div class="product-info__colour-label">Colour: <span>Midnight Navy</span></div>
            <div class="colour-swatches" role="group" aria-label="Colour options">
              <button type="button" class="colour-swatch is-active" style="background-color:#101E35;" aria-label="Midnight Navy" title="Midnight Navy"></button>
            </div>
          </div>

          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2);">
              <div class="product-info__colour-label">Size: <span class="js-selected-size" style="font-weight:700;"></span></div>
              <button type="button" class="size-guide-link js-open-fit-guide" aria-label="Open size guide">Size Guide</button>
            </div>

            <div class="size-selector" role="group" aria-label="Select a size">
              <button type="button" class="size-chip" data-size="S" data-variant-id="10101" aria-pressed="false">S</button>
              <button type="button" class="size-chip" data-size="M" data-variant-id="10102" aria-pressed="false">M</button>
              <button type="button" class="size-chip" data-size="L" data-variant-id="10103" aria-pressed="false">L</button>
              <button type="button" class="size-chip" data-size="XL" data-variant-id="10104" data-unavailable="true" aria-disabled="true" title="XL — Out of stock">XL</button>
            </div>
            <div class="size-error" role="alert">Please select a size to continue.</div>
          </div>

          <div>
            <div class="product-info__colour-label" style="margin-bottom:var(--space-2);">Quantity</div>
            <div class="qty-selector" role="group" aria-label="Select quantity">
              <button type="button" class="qty-btn js-product-qty-minus" aria-label="Decrease quantity">−</button>
              <span class="qty-value js-qty-display">1</span>
              <button type="button" class="qty-btn js-product-qty-plus" aria-label="Increase quantity">+</button>
            </div>
          </div>

          <div class="featured-product__actions js-main-atb">
            <button type="button" class="btn btn--primary btn--full btn--lg js-add-to-cart" data-original-text="ADD TO BAG" aria-label="Add FLEXFIT 01 to bag">
              ADD TO BAG
            </button>
            <button type="button" class="btn btn--outline btn--full btn--lg js-buy-now" aria-label="Buy FLEXFIT 01 now">
              BUY NOW
            </button>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);padding:var(--space-3);border:var(--border-hairline);border-radius:var(--radius-sm);font-size:var(--text-xs);letter-spacing:0.06em;">
            <div style="display:flex;gap:8px;align-items:flex-start;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" stroke-width="1.5" aria-hidden="true"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <div>
                <div style="font-weight:600;text-transform:uppercase;margin-bottom:2px;">Free Shipping</div>
                <div style="color:var(--sage);">Across India</div>
              </div>
            </div>
            <div style="display:flex;gap:8px;align-items:flex-start;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" stroke-width="1.5" aria-hidden="true"><path d="M3 12A9 9 0 1021 12 9 9 0 003 12M12 8V12L15 15" stroke-linecap="round"/></svg>
              <div>
                <div style="font-weight:600;text-transform:uppercase;margin-bottom:2px;">Easy Returns</div>
                <div style="color:var(--sage);">Free Shipping Across India</div>
              </div>
            </div>
          </div>

          <!-- Accordions -->
          <div class="product-accordion" role="list">
            <div class="product-accordion__item is-open" role="listitem">
              <button type="button" class="product-accordion__trigger" aria-expanded="true">
                Description
                <svg class="product-accordion__icon" viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <div class="product-accordion__body">
                <div class="product-accordion__content">
                  <p>The FLEXFIT 01 Midnight Navy Two-Piece Scrub Set is designed for healthcare professionals who demand both performance and presence. Built for the long shift.</p>
                  <p style="margin-top:var(--space-2);">Features deep functional pockets, reinforced stress points, four-way mechanical stretch, and tailored athletic drape.</p>
                </div>
              </div>
            </div>

            <div class="product-accordion__item" role="listitem">
              <button type="button" class="product-accordion__trigger" aria-expanded="false">
                Fabric & Specifications
                <svg class="product-accordion__icon" viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <div class="product-accordion__body">
                <div class="product-accordion__content">
                  <p style="color:var(--sage);font-size:var(--text-xs);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:var(--space-2);">◎ Pending verification</p>
                  <p>High-grade performance poly-elastane micro-weave. Precise fabric blend and GSM specification awaiting final production lab certification. See <code>/docs/PLACEHOLDERS.md</code>.</p>
                </div>
              </div>
            </div>

            <div class="product-accordion__item" role="listitem">
              <button type="button" class="product-accordion__trigger" aria-expanded="false">
                Wash Care
                <svg class="product-accordion__icon" viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <div class="product-accordion__body">
                <div class="product-accordion__content">
                  <p style="color:var(--sage);font-size:var(--text-xs);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:var(--space-2);">◎ Pending verification</p>
                  <p>Machine wash cold with similar colours. Tumble dry low. Do not bleach. Cool iron if needed.</p>
                </div>
              </div>
            </div>

            <div class="product-accordion__item" role="listitem">
              <button type="button" class="product-accordion__trigger" aria-expanded="false">
                Shipping & Delivery
                <svg class="product-accordion__icon" viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <div class="product-accordion__body">
                <div class="product-accordion__content">
                  <ul style="display:flex;flex-direction:column;gap:var(--space-2);list-style:disc;padding-left:1.2em;">
                    <li>Free shipping across India on all orders.</li>
                    <li>Estimated delivery: 5–8 business days (Shiprocket integration).</li>
                    <li>Cash on Delivery available in serviceable pincodes.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Complete the Look (Related Products) -->
    <section class="section reveal" aria-label="Complete the look" style="padding-top:var(--space-8);padding-bottom:var(--space-10);border-top:var(--border-hairline);margin-top:var(--space-10);">
      <div class="container">
        <div class="section__header" style="text-align:left;margin-bottom:var(--space-6);">
          <span class="eyebrow eyebrow--sage">Complete the Look</span>
          <h2 class="h3" style="margin-top:var(--space-1);">You May Also Like</h2>
        </div>
        <div class="products-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:var(--space-6);">
          <article class="product-card" aria-label="FLEXFIT 01 — Sage">
            <a href="/products/flexfit-01-midnight-navy" class="product-card__img-wrap" tabindex="-1">
              <img class="product-card__img product-card__img--default" src="/assets/mock/product-front-sage.svg" alt="FLEXFIT 01 Sage" width="400" height="500">
              <img class="product-card__img product-card__img--hover" src="/assets/mock/product-back-sage.svg" alt="FLEXFIT 01 Sage back" width="400" height="500">
              <button type="button" class="product-card__quick-add js-add-to-cart" data-variant-id="10202" aria-label="Quick add to bag">QUICK ADD</button>
            </a>
            <div class="product-card__name"><a href="/products/flexfit-01-midnight-navy">FLEXFIT 01 — Sage<span class="mock-indicator" aria-hidden="true">MOCK</span></a></div>
            <div class="product-card__price">₹2,299</div>
            <div class="product-card__swatches">
              <span class="product-card__swatch is-active" style="background:#84958C;" title="Sage"></span>
            </div>
            <div class="product-card__sizes">
              <span class="product-card__size-label">S</span>
              <span class="product-card__size-label">M</span>
              <span class="product-card__size-label" style="text-decoration:line-through;opacity:0.3;">L</span>
            </div>
          </article>

          <article class="product-card" aria-label="FLEXFIT 01 Women's — Midnight Navy">
            <a href="/products/flexfit-01-midnight-navy" class="product-card__img-wrap" tabindex="-1">
              <img class="product-card__img product-card__img--default" src="/assets/mock/product-front-womens.svg" alt="FLEXFIT 01 Women's" width="400" height="500">
              <img class="product-card__img product-card__img--hover" src="/assets/mock/product-back-womens.svg" alt="FLEXFIT 01 Women's back" width="400" height="500">
              <button type="button" class="product-card__quick-add js-add-to-cart" data-variant-id="10302" aria-label="Quick add to bag">QUICK ADD</button>
            </a>
            <div class="product-card__name"><a href="/products/flexfit-01-midnight-navy">FLEXFIT 01 Women's<span class="mock-indicator" aria-hidden="true">MOCK</span></a></div>
            <div class="product-card__price">₹2,299</div>
            <div class="product-card__swatches">
              <span class="product-card__swatch is-active" style="background:#101E35;" title="Midnight Navy"></span>
            </div>
            <div class="product-card__sizes">
              <span class="product-card__size-label">XS</span>
              <span class="product-card__size-label">S</span>
              <span class="product-card__size-label">M</span>
              <span class="product-card__size-label">L</span>
            </div>
          </article>

          <article class="product-card" aria-label="FLEXFIT 01 — Midnight Navy">
            <a href="/products/flexfit-01-midnight-navy" class="product-card__img-wrap" tabindex="-1">
              <img class="product-card__img product-card__img--default" src="/assets/mock/product-front.svg" alt="FLEXFIT 01 Midnight Navy" width="400" height="500">
              <img class="product-card__img product-card__img--hover" src="/assets/mock/product-back.svg" alt="FLEXFIT 01 Midnight Navy back" width="400" height="500">
              <button type="button" class="product-card__quick-add js-add-to-cart" data-variant-id="10102" aria-label="Quick add to bag">QUICK ADD</button>
            </a>
            <div class="product-card__name"><a href="/products/flexfit-01-midnight-navy">FLEXFIT 01 — Midnight Navy</a></div>
            <div class="product-card__price">₹2,299</div>
            <div class="product-card__swatches">
              <span class="product-card__swatch is-active" style="background:#101E35;" title="Midnight Navy"></span>
            </div>
            <div class="product-card__sizes">
              <span class="product-card__size-label">S</span>
              <span class="product-card__size-label">M</span>
              <span class="product-card__size-label">L</span>
              <span class="product-card__size-label" style="text-decoration:line-through;opacity:0.3;">XL</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Mobile Sticky ATB -->
    <div class="mobile-sticky-atb" role="complementary" aria-label="Quick add to bag">
      <div style="flex:1;">
        <div style="font-size:var(--text-xs);font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">FLEXFIT 01</div>
        <div style="font-size:var(--text-sm);color:var(--sage);" id="sticky-selected-size">Select a size</div>
      </div>
      <button type="button" class="btn btn--primary js-add-to-cart" data-original-text="ADD TO BAG" style="flex-shrink:0;">
        ADD TO BAG
      </button>
    </div>

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "FLEXFIT 01 — Midnight Navy",
      "description": "Luxury Performance Medical Wear. Two-Piece Scrub Set built for the long shift.",
      "brand": { "@type": "Brand", "name": "VYRO" },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": "2299",
        "availability": "https://schema.org/InStock"
      }
    }
    </script>
  `;
  return renderPage(content, 'FLEXFIT 01 — Midnight Navy', 'product');
}

// Build Collection Page HTML
function buildCollectionPage() {
  const content = `
    <div class="container">
      <div style="padding-block:var(--space-5);border-bottom:var(--border-hairline);margin-bottom:var(--space-5);">
        <span class="eyebrow eyebrow--sage" style="margin-bottom:var(--space-2);">VYRO Collection</span>
        <h1 class="h2" style="margin-bottom:0;">All Products</h1>
        <p style="margin-top:var(--space-2);font-size:var(--text-md);color:var(--sage);max-width:600px;">
          Engineered for the shift. Explore the full performance medical apparel collection.
        </p>
      </div>

      <div class="collection-page">
        <!-- Desktop Sidebar -->
        <aside class="filter-sidebar" aria-label="Product filters">
          <div class="filter-sidebar__title">Filter</div>

          <div class="filter-group">
            <div class="filter-group__label">Size</div>
            <label class="filter-option" role="checkbox" aria-checked="false" tabindex="0" data-filter="size" data-value="S"><span class="filter-checkbox"></span> S (3)</label>
            <label class="filter-option" role="checkbox" aria-checked="false" tabindex="0" data-filter="size" data-value="M"><span class="filter-checkbox"></span> M (3)</label>
            <label class="filter-option" role="checkbox" aria-checked="false" tabindex="0" data-filter="size" data-value="L"><span class="filter-checkbox"></span> L (3)</label>
            <label class="filter-option" role="checkbox" aria-checked="false" tabindex="0" data-filter="size" data-value="XL"><span class="filter-checkbox"></span> XL (1)</label>
          </div>

          <div class="filter-group">
            <div class="filter-group__label">Colour</div>
            <label class="filter-option" role="checkbox" aria-checked="false" tabindex="0" data-filter="colour" data-value="Midnight Navy"><span class="filter-checkbox"></span> Midnight Navy (2)</label>
            <label class="filter-option" role="checkbox" aria-checked="false" tabindex="0" data-filter="colour" data-value="Sage"><span class="filter-checkbox"></span> Sage (1)</label>
          </div>

          <div class="filter-group">
            <div class="filter-group__label">Gender</div>
            <label class="filter-option" role="checkbox" aria-checked="false" tabindex="0" data-filter="gender" data-value="Men's"><span class="filter-checkbox"></span> Men's (2)</label>
            <label class="filter-option" role="checkbox" aria-checked="false" tabindex="0" data-filter="gender" data-value="Women's"><span class="filter-checkbox"></span> Women's (1)</label>
          </div>
        </aside>

        <!-- Product Grid -->
        <div>
          <div class="collection-toolbar">
            <div class="collection-count">3 products</div>
            <div style="display:flex;align-items:center;gap:var(--space-3);">
              <button type="button" class="btn btn--outline js-filter-open" style="display:none;" id="mobile-filter-btn">
                Filters
              </button>
              <select class="sort-select" aria-label="Sort products">
                <option value="featured">Sort: Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div class="active-filter-chips" id="active-chips" style="display:none; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
            <!-- chips added by JS -->
          </div>

          <div class="products-grid">
            <!-- Card 1 -->
            <article class="product-card" aria-label="FLEXFIT 01 — Midnight Navy">
              <a href="/products/flexfit-01-midnight-navy" class="product-card__img-wrap" tabindex="-1">
                <img class="product-card__img product-card__img--default" src="/assets/mock/product-front.svg" alt="FLEXFIT 01 Midnight Navy" width="400" height="500">
                <img class="product-card__img product-card__img--hover" src="/assets/mock/product-back.svg" alt="FLEXFIT 01 Midnight Navy back" width="400" height="500">
                <button type="button" class="product-card__quick-add js-add-to-cart" data-variant-id="10102" aria-label="Quick add to bag">QUICK ADD</button>
              </a>
              <div class="product-card__name"><a href="/products/flexfit-01-midnight-navy">FLEXFIT 01 — Midnight Navy</a></div>
              <div class="product-card__price">₹2,299</div>
              <div class="product-card__swatches">
                <span class="product-card__swatch is-active" style="background:#101E35;" title="Midnight Navy"></span>
              </div>
              <div class="product-card__sizes">
                <span class="product-card__size-label">S</span>
                <span class="product-card__size-label">M</span>
                <span class="product-card__size-label">L</span>
                <span class="product-card__size-label" style="text-decoration:line-through;opacity:0.3;">XL</span>
              </div>
            </article>

            <!-- Card 2 -->
            <article class="product-card" aria-label="FLEXFIT 01 — Sage">
              <a href="/products/flexfit-01-midnight-navy" class="product-card__img-wrap" tabindex="-1">
                <img class="product-card__img product-card__img--default" src="/assets/mock/product-front-sage.svg" alt="FLEXFIT 01 Sage" width="400" height="500">
                <img class="product-card__img product-card__img--hover" src="/assets/mock/product-back-sage.svg" alt="FLEXFIT 01 Sage back" width="400" height="500">
                <button type="button" class="product-card__quick-add js-add-to-cart" data-variant-id="10202" aria-label="Quick add to bag">QUICK ADD</button>
              </a>
              <div class="product-card__name"><a href="/products/flexfit-01-midnight-navy">FLEXFIT 01 — Sage<span class="mock-indicator" aria-hidden="true">MOCK</span></a></div>
              <div class="product-card__price">₹2,299</div>
              <div class="product-card__swatches">
                <span class="product-card__swatch is-active" style="background:#84958C;" title="Sage"></span>
              </div>
              <div class="product-card__sizes">
                <span class="product-card__size-label">S</span>
                <span class="product-card__size-label">M</span>
                <span class="product-card__size-label" style="text-decoration:line-through;opacity:0.3;">L</span>
              </div>
            </article>

            <!-- Card 3 -->
            <article class="product-card" aria-label="FLEXFIT 01 Women's — Midnight Navy">
              <a href="/products/flexfit-01-midnight-navy" class="product-card__img-wrap" tabindex="-1">
                <img class="product-card__img product-card__img--default" src="/assets/mock/product-front-womens.svg" alt="FLEXFIT 01 Women's" width="400" height="500">
                <img class="product-card__img product-card__img--hover" src="/assets/mock/product-back-womens.svg" alt="FLEXFIT 01 Women's back" width="400" height="500">
                <button type="button" class="product-card__quick-add js-add-to-cart" data-variant-id="10302" aria-label="Quick add to bag">QUICK ADD</button>
              </a>
              <div class="product-card__name"><a href="/products/flexfit-01-midnight-navy">FLEXFIT 01 Women's<span class="mock-indicator" aria-hidden="true">MOCK</span></a></div>
              <div class="product-card__price">₹2,299</div>
              <div class="product-card__swatches">
                <span class="product-card__swatch is-active" style="background:#101E35;" title="Midnight Navy"></span>
              </div>
              <div class="product-card__sizes">
                <span class="product-card__size-label">XS</span>
                <span class="product-card__size-label">S</span>
                <span class="product-card__size-label">M</span>
                <span class="product-card__size-label">L</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Filter Drawer -->
    <div class="filter-drawer" id="filter-drawer" role="dialog" aria-modal="true" aria-label="Product filters" tabindex="-1">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);">
        <h2 style="font-family:var(--font-heading);font-size:var(--text-md);font-weight:800;text-transform:uppercase;">Filters</h2>
        <button type="button" class="mobile-drawer__close js-filter-close" aria-label="Close filters">
          <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      <div class="filter-group">
        <div class="filter-group__label">Size</div>
        <label class="filter-option" role="checkbox" aria-checked="false" tabindex="0"><span class="filter-checkbox"></span> S</label>
        <label class="filter-option" role="checkbox" aria-checked="false" tabindex="0"><span class="filter-checkbox"></span> M</label>
        <label class="filter-option" role="checkbox" aria-checked="false" tabindex="0"><span class="filter-checkbox"></span> L</label>
        <label class="filter-option" role="checkbox" aria-checked="false" tabindex="0"><span class="filter-checkbox"></span> XL</label>
      </div>

      <div class="filter-drawer__actions">
        <button type="button" class="btn btn--outline btn--full js-filter-clear">Clear</button>
        <button type="button" class="btn btn--primary btn--full js-filter-apply">Apply</button>
      </div>
    </div>
  `;
  return renderPage(content, 'All Products', 'collection');
}

// Build Cart Page HTML
function buildCartPage() {
  const isCartEmpty = cartState.items.length === 0;
  let bodyContent = '';

  if (isCartEmpty) {
    bodyContent = `
      <div class="cart-drawer__empty" style="min-height:50vh;">
        <svg class="cart-drawer__empty-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round"/>
          <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="1"/>
          <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round"/>
        </svg>
        <p class="font-heading" style="font-size:var(--text-xl);font-weight:800;text-transform:uppercase;">Your bag is empty</p>
        <p class="body-sm text-muted">Explore our medical performance apparel collection.</p>
        <a href="/collections/all" class="btn btn--primary" style="margin-top:var(--space-4);">Shop the Collection</a>
      </div>
    `;
  } else {
    const itemsList = cartState.items.map(item => `
      <div class="cart-item" data-item-key="${item.id}" style="grid-template-columns:120px 1fr;">
        <img class="cart-item__img" src="${item.image}" alt="${item.title}" width="120" height="150" style="width:120px;height:150px;">
        <div class="cart-item__info">
          <div class="cart-item__name">${item.title}</div>
          <div class="cart-item__meta">${item.size ? `Size: ${item.size}` : ''} | Midnight Navy</div>
          <div class="cart-item__price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
          <div class="cart-item__qty">
            <button type="button" class="qty-btn js-qty-minus" data-key="${item.id}" data-qty="${item.quantity - 1}">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button type="button" class="qty-btn js-qty-plus" data-key="${item.id}" data-qty="${item.quantity + 1}">+</button>
            <button type="button" class="cart-item__remove js-remove-item" data-key="${item.id}">Remove</button>
          </div>
        </div>
      </div>
    `).join('');

    bodyContent = `
      <div style="display:grid;grid-template-columns:1fr 360px;gap:var(--space-10);align-items:start;">
        <div>${itemsList}</div>
        <div style="border:var(--border-hairline);border-radius:var(--radius-sm);padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-3);position:sticky;top:calc(var(--ann-height)+var(--nav-height)+var(--space-4));">
          <h2 class="h4" style="margin-bottom:0;">Order Summary</h2>
          <div class="cart-subtotal">
            <span class="cart-subtotal__label">Subtotal</span>
            <span class="cart-subtotal__amount">₹${cartState.total_price.toLocaleString('en-IN')}</span>
          </div>
          <p style="font-size:var(--text-xs);color:var(--sage);">Shipping &amp; taxes calculated at checkout</p>
          <a href="/checkout" class="btn btn--primary btn--full btn--lg">Checkout <span class="btn__arrow">→</span></a>
          <a href="/collections/all" class="btn btn--outline btn--full">Continue Shopping</a>
        </div>
      </div>
    `;
  }

  const content = `
    <div class="container section">
      <h1 class="h2" style="margin-bottom:var(--space-8);">Your Bag</h1>
      ${bodyContent}
    </div>
  `;
  return renderPage(content, 'Your Bag', 'cart');
}

// Build 404 Page HTML
function build404Page() {
  const content = `
    <section class="error-page">
      <div class="error-page__code" aria-hidden="true">404</div>
      <h1 class="error-page__title">Page Not Found</h1>
      <p style="font-size:var(--text-md);color:var(--sage);max-width:400px;text-align:center;line-height:1.65;">
        The page you're looking for has moved, or never existed. Let's get you back to the shift.
      </p>
      <div style="display:flex;gap:var(--space-2);flex-wrap:wrap;justify-content:center;margin-top:var(--space-4);">
        <a href="/" class="btn btn--primary">Back to Home</a>
        <a href="/collections/all" class="btn btn--outline">Shop All</a>
      </div>
    </section>
  `;
  return renderPage(content, 'Page Not Found', '404');
}

// Build Editorial Pages
function buildEditorialPage(title, headline, bodyText) {
  const content = `
    <div class="container section" style="max-width:800px;min-height:50vh;">
      <span class="eyebrow eyebrow--sage" style="margin-bottom:var(--space-3);">${title}</span>
      <h1 class="h2" style="margin-bottom:var(--space-6);">${headline}</h1>
      <div style="font-size:var(--text-md);line-height:1.75;color:var(--navy);opacity:0.85;">
        ${bodyText}
      </div>
      <div style="margin-top:var(--space-8);">
        <a href="/collections/all" class="btn btn--primary">Shop FLEXFIT 01 <span class="btn__arrow">→</span></a>
      </div>
    </div>
  `;
  return renderPage(content, title, 'page');
}

// Build Login Page
function buildLoginPage() {
  const content = `
    <!-- Shopify customer accounts note: Classic customer templates are utilized here for full bespoke UI parity; Shopify hosted customer accounts restrict custom design tokens. -->
    <div class="auth-page">
      <div class="auth-page__image">
        <img src="/assets/mock/login-editorial.svg" alt="VYRO Performance Medical Apparel" width="600" height="800">
      </div>
      <div class="auth-page__form-side">
        <form class="auth-form js-auth-login" novalidate>
          <div>
            <div class="auth-form__eyebrow">VYRO Account</div>
            <h1 class="auth-form__title">Sign In</h1>
          </div>

          <div class="form-field">
            <label class="form-field__label" for="login-email">Email Address</label>
            <input class="form-field__input" type="email" id="login-email" name="email" autocomplete="email" required placeholder="doctor@hospital.in">
            <div class="form-field__error" id="login-email-error">Please enter a valid email address.</div>
          </div>

          <div class="form-field form-field--password">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <label class="form-field__label" for="login-password">Password</label>
              <a href="/account/forgot-password" class="auth-form__link" style="font-size:var(--text-xs);">Forgot password?</a>
            </div>
            <div class="form-field__password-wrap">
              <input class="form-field__input" type="password" id="login-password" name="password" autocomplete="current-password" required placeholder="••••••••">
              <button type="button" class="form-field__password-toggle js-pwd-toggle" aria-label="Toggle password visibility">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div class="form-field__error" id="login-password-error">Password is required.</div>
          </div>

          <button type="submit" class="btn btn--primary btn--full btn--lg" style="margin-top:var(--space-2);">
            SIGN IN
          </button>

          <div class="auth-form__links" style="justify-content:center;gap:var(--space-1);margin-top:var(--space-1);">
            <span style="color:var(--sage);">Don't have an account?</span>
            <a href="/account/register" class="auth-form__link">Create account</a>
          </div>

          <div class="auth-form__note">
            Authentication will connect to Shopify customer accounts once the store is set up.
          </div>
        </form>
      </div>
    </div>
  `;
  return renderPage(content, 'Sign In — VYRO', 'account-login');
}

// Build Register Page
function buildRegisterPage() {
  const content = `
    <!-- Shopify customer accounts note: Classic customer templates are utilized here for full bespoke UI parity; Shopify hosted customer accounts restrict custom design tokens. -->
    <div class="auth-page">
      <div class="auth-page__image">
        <img src="/assets/mock/login-editorial.svg" alt="VYRO Performance Medical Apparel" width="600" height="800">
      </div>
      <div class="auth-page__form-side">
        <form class="auth-form js-auth-register" novalidate>
          <div>
            <div class="auth-form__eyebrow">Join VYRO</div>
            <h1 class="auth-form__title">Create Account</h1>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);">
            <div class="form-field">
              <label class="form-field__label" for="reg-fname">First Name</label>
              <input class="form-field__input" type="text" id="reg-fname" name="first_name" autocomplete="given-name" required placeholder="Pramika">
              <div class="form-field__error" id="reg-fname-error">First name required.</div>
            </div>
            <div class="form-field">
              <label class="form-field__label" for="reg-lname">Last Name</label>
              <input class="form-field__input" type="text" id="reg-lname" name="last_name" autocomplete="family-name" required placeholder="Ranjith">
              <div class="form-field__error" id="reg-lname-error">Last name required.</div>
            </div>
          </div>

          <div class="form-field">
            <label class="form-field__label" for="reg-email">Email Address</label>
            <input class="form-field__input" type="email" id="reg-email" name="email" autocomplete="email" required placeholder="doctor@hospital.in">
            <div class="form-field__error" id="reg-email-error">Please enter a valid email address.</div>
          </div>

          <div class="form-field form-field--password">
            <label class="form-field__label" for="reg-password">Password</label>
            <div class="form-field__password-wrap">
              <input class="form-field__input" type="password" id="reg-password" name="password" autocomplete="new-password" required placeholder="At least 6 characters">
              <button type="button" class="form-field__password-toggle js-pwd-toggle" aria-label="Toggle password visibility">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
            <div class="form-field__error" id="reg-password-error">Password must be at least 6 characters.</div>
          </div>

          <div class="form-field form-field--password">
            <label class="form-field__label" for="reg-confirm">Confirm Password</label>
            <div class="form-field__password-wrap">
              <input class="form-field__input" type="password" id="reg-confirm" name="confirm_password" autocomplete="new-password" required placeholder="Confirm password">
            </div>
            <div class="form-field__error" id="reg-confirm-error">Passwords must match.</div>
          </div>

          <label class="form-checkbox">
            <input type="checkbox" name="marketing_opt_in" id="reg-optin">
            <span>Keep me informed on new performance colourways, sizing drops, and clinical apparel innovations.</span>
          </label>

          <button type="submit" class="btn btn--primary btn--full btn--lg" style="margin-top:var(--space-2);">
            CREATE ACCOUNT
          </button>

          <div class="auth-form__links" style="justify-content:center;gap:var(--space-1);margin-top:var(--space-1);">
            <span style="color:var(--sage);">Already registered?</span>
            <a href="/account/login" class="auth-form__link">Sign in</a>
          </div>

          <div class="auth-form__note">
            Authentication will connect to Shopify customer accounts once the store is set up.
          </div>
        </form>
      </div>
    </div>
  `;
  return renderPage(content, 'Create Account — VYRO', 'account-register');
}

// Build Forgot Password Page
function buildForgotPasswordPage() {
  const content = `
    <!-- Shopify customer accounts note: Classic customer templates are utilized here for full bespoke UI parity; Shopify hosted customer accounts restrict custom design tokens. -->
    <div class="auth-page">
      <div class="auth-page__image">
        <img src="/assets/mock/login-editorial.svg" alt="VYRO Performance Medical Apparel" width="600" height="800">
      </div>
      <div class="auth-page__form-side">
        <form class="auth-form js-auth-forgot" novalidate>
          <div>
            <div class="auth-form__eyebrow">Recovery</div>
            <h1 class="auth-form__title">Reset Password</h1>
            <p style="font-size:var(--text-xs);color:var(--sage);margin-top:var(--space-1);line-height:1.6;">
              Enter your registered clinical email to receive recovery instructions.
            </p>
          </div>

          <div class="form-field">
            <label class="form-field__label" for="forgot-email">Email Address</label>
            <input class="form-field__input" type="email" id="forgot-email" name="email" autocomplete="email" required placeholder="doctor@hospital.in">
            <div class="form-field__error" id="forgot-email-error">Please enter a valid email address.</div>
          </div>

          <div class="form-field__note js-forgot-success" style="display:none;padding:var(--space-3);background:var(--ivory-grey);border:var(--border-hairline);border-radius:var(--radius-sm);color:var(--navy);font-size:var(--text-xs);line-height:1.6;">
            If an account exists with this email address, password reset instructions have been dispatched.
          </div>

          <button type="submit" class="btn btn--primary btn--full btn--lg">
            SEND RESET LINK
          </button>

          <div class="auth-form__links" style="justify-content:center;margin-top:var(--space-1);">
            <a href="/account/login" class="auth-form__link">Back to Sign In</a>
          </div>

          <div class="auth-form__note">
            Authentication will connect to Shopify customer accounts once the store is set up.
          </div>
        </form>
      </div>
    </div>
  `;
  return renderPage(content, 'Reset Password — VYRO', 'account-forgot');
}

// Build Account Dashboard Page
function buildAccountPage() {
  const content = `
    <!-- Shopify customer accounts note: Classic customer templates are utilized here for full bespoke UI parity; Shopify hosted customer accounts restrict custom design tokens. -->
    <div class="container section">
      <div style="border-bottom:var(--border-hairline);padding-bottom:var(--space-6);margin-bottom:var(--space-8);">
        <span class="eyebrow eyebrow--sage">Clinical Concierge</span>
        <h1 class="h2" style="margin-top:var(--space-1);margin-bottom:0;">My Account</h1>
      </div>

      <div class="account-dashboard">
        <aside class="account-sidebar" aria-label="Account navigation">
          <div class="account-sidebar__title">Navigation</div>
          <nav class="account-nav">
            <a href="#orders" class="account-nav__link is-active js-account-tab-btn" data-tab="orders">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              Orders
            </a>
            <a href="#addresses" class="account-nav__link js-account-tab-btn" data-tab="addresses">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Addresses
            </a>
            <a href="#profile" class="account-nav__link js-account-tab-btn" data-tab="profile">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              Profile
            </a>
            <a href="/account/login" class="account-nav__link account-nav__link--signout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              Sign Out
            </a>
          </nav>
        </aside>

        <main class="account-main">
          <!-- Orders Tab -->
          <div class="js-account-tab" id="tab-orders">
            <h2 class="h4" style="margin-bottom:var(--space-4);">Order History</h2>
            <div class="account-content__empty">
              <svg class="account-content__empty-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              <div class="account-content__empty-title">No Orders Yet</div>
              <p style="font-size:var(--text-sm);color:var(--sage);max-width:440px;line-height:1.6;">
                You haven't placed any orders yet. Once you make your first order, tracking and details will appear here.
              </p>
              <a href="/collections/all" class="btn btn--primary" style="margin-top:var(--space-2);">
                Explore Collection <span class="btn__arrow">→</span>
              </a>
            </div>
          </div>

          <!-- Addresses Tab -->
          <div class="js-account-tab" id="tab-addresses" style="display:none;">
            <h2 class="h4" style="margin-bottom:var(--space-4);">Saved Addresses</h2>
            <div class="account-content__empty">
              <div class="account-content__empty-title">No Addresses Saved</div>
              <p style="font-size:var(--text-sm);color:var(--sage);max-width:440px;line-height:1.6;">
                No addresses saved yet. Your shipping details will be stored securely during your first checkout.
              </p>
            </div>
          </div>

          <!-- Profile Tab -->
          <div class="js-account-tab" id="tab-profile" style="display:none;">
            <h2 class="h4" style="margin-bottom:var(--space-4);">Profile Details</h2>
            <div style="max-width:440px;display:flex;flex-direction:column;gap:var(--space-3);">
              <div>
                <span style="font-size:var(--text-xs);letter-spacing:0.08em;text-transform:uppercase;color:var(--sage);">Status</span>
                <p style="font-weight:600;margin-top:2px;">Guest / Preview Session</p>
              </div>
              <div>
                <span style="font-size:var(--text-xs);letter-spacing:0.08em;text-transform:uppercase;color:var(--sage);">Integration Status</span>
                <p style="font-size:var(--text-xs);color:var(--sage);margin-top:2px;line-height:1.6;">
                  Sign in to access your account. Authentication connects to Shopify once the store is live.
                </p>
              </div>
            </div>
          </div>

          <div class="auth-form__note" style="margin-top:var(--space-8);">
            Sign in to access your account. Authentication connects to Shopify once the store is live.
          </div>
        </main>
      </div>
    </div>
  `;
  return renderPage(content, 'Account Dashboard — VYRO', 'account');
}

// Request Handler
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Static Assets
  if (pathname.startsWith('/assets/')) {
    let filePath = path.join(ROOT, pathname);

    // If a .webp is requested but an .svg counterpart exists, serve the .svg
    if (!fs.existsSync(filePath) && pathname.endsWith('.webp')) {
      const svgPath = filePath.replace('.webp', '.svg');
      if (fs.existsSync(svgPath)) filePath = svgPath;
    }

    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // Favicon fallback
  if (pathname === '/favicon.ico' || pathname === '/favicon.svg') {
    const favPath = path.join(ROOT, 'assets', 'mock', 'favicon.svg');
    if (fs.existsSync(favPath)) {
      res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
      fs.createReadStream(favPath).pipe(res);
      return;
    }
  }

  // Shopify Cart AJAX API Endpoints
  if (pathname === '/cart.js') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(cartState));
    return;
  }

  if (pathname === '/cart/add.js' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const variantId = payload.id;
        const qty = parseInt(payload.quantity || 1, 10);

        let sizeName = 'M';
        if (variantId == 10101) sizeName = 'S';
        else if (variantId == 10102) sizeName = 'M';
        else if (variantId == 10103) sizeName = 'L';
        else if (variantId == 10104) sizeName = 'XL';

        const existing = cartState.items.find(i => String(i.id) === String(variantId));
        if (existing) {
          existing.quantity += qty;
        } else {
          cartState.items.push({
            id: variantId || 10102,
            title: 'FLEXFIT 01 — Midnight Navy',
            size: sizeName,
            price: 2299,
            quantity: qty,
            image: '/assets/mock/product-front.svg'
          });
        }

        cartState.item_count = cartState.items.reduce((sum, i) => sum + i.quantity, 0);
        cartState.total_price = cartState.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cartState));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (pathname === '/cart/change.js' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const key = payload.id;
        const qty = parseInt(payload.quantity || 0, 10);

        if (qty <= 0) {
          cartState.items = cartState.items.filter(i => String(i.id) !== String(key));
        } else {
          const item = cartState.items.find(i => String(i.id) === String(key));
          if (item) item.quantity = qty;
        }

        cartState.item_count = cartState.items.reduce((sum, i) => sum + i.quantity, 0);
        cartState.total_price = cartState.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(cartState));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Section Rendering API: /?sections=cart-drawer
  if (parsedUrl.query && parsedUrl.query.sections === 'cart-drawer') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      'cart-drawer': renderCartDrawerSection()
    }));
    return;
  }

  // HTML Page Routes
  if (pathname === '/' || pathname === '/index') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(buildHomepage());
    return;
  }

  if (pathname.startsWith('/products/')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(buildProductPage());
    return;
  }

  if (pathname.startsWith('/collections/')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(buildCollectionPage());
    return;
  }

  if (pathname === '/cart') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(buildCartPage());
    return;
  }

  if (pathname === '/pages/our-story') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(buildEditorialPage(
      'Our Story',
      'ENGINEERED FOR THE PEOPLE WHO NEVER CLOCK OUT.',
      `
      <p>Healthcare professionals spend 12 to 36 continuous hours on their feet. Yet for decades, medical apparel has remained boxy, stiff, synthetic, and utilitarian.</p>
      <br>
      <p><strong>VYRO</strong> was born from a singular conviction: those who perform high-stakes clinical work deserve apparel engineered to the standards of luxury activewear and tailored bespoke tailoring. We blend technical fabrics with clean minimalist aesthetics, creating medical wear that honors your professional identity.</p>
      <br>
      <p>Our inaugural collection, <strong>FLEXFIT 01</strong> in Midnight Navy, represents eighteen months of ergonomic pattern design, reinforced construction testing, and fabric curation.</p>
      `
    ));
    return;
  }

  if (pathname === '/pages/technology') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(buildEditorialPage(
      'Technology & Innovation',
      'TEXTILE SCIENCE MEETS CLINICAL MOBILITY.',
      `
      <p>Every seam, pocket angle, and yarn selection in the FLEXFIT system is designed with specific clinical purpose.</p>
      <br>
      <h3 class="h4" style="margin-top:var(--space-4);margin-bottom:var(--space-2);">Four-Way Mechanical Stretch</h3>
      <p>Engineered flexibility through the shoulder yoke and back pleats permits unrestricted range of motion during emergency procedures and CPR.</p>
      <br>
      <h3 class="h4" style="margin-top:var(--space-4);margin-bottom:var(--space-2);">ScentShift Research (In Development)</h3>
      <p style="color:var(--sage);font-weight:600;letter-spacing:0.08em;text-transform:uppercase;font-size:var(--text-xs);">◎ CURRENTLY IN DEVELOPMENT</p>
      <p>We are actively researching micro-encapsulated fragrance-release textile treatments designed to withstand hospital-grade thermal disinfection while maintaining long-term wear freshness. All research is exploratory; no commercial claims are made prior to clinical validation.</p>
      `
    ));
    return;
  }

  if (pathname === '/pages/contact') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(buildEditorialPage(
      'Support & Concierge',
      'WE ARE HERE FOR YOUR SHIFT.',
      `
      <p>Have inquiries regarding bulk hospital orders, custom embroidery, sizing advice, or exchange requests? Our team is available 24/7.</p>
      <br>
      <div style="border:var(--border-hairline);padding:var(--space-5);border-radius:var(--radius-sm);background:var(--white);">
        <p><strong>Email Concierge:</strong> concierge@vyro.in</p>
        <p style="margin-top:var(--space-2);"><strong>WhatsApp Support:</strong> +91 (Available via footer button)</p>
        <p style="margin-top:var(--space-2);"><strong>Corporate Inquiries:</strong> Mumbai &amp; Bengaluru, India</p>
      </div>
      `
    ));
    return;
  }

  if (pathname === '/checkout') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(buildEditorialPage(
      'Shopify Checkout',
      'SECURE SHOPIFY CHECKOUT',
      `
      <p>In a production Shopify store, clicking "Checkout" securely transfers your cart to Shopify's PCI-DSS Level 1 compliant checkout platform (<code>https://checkout.shopify.com</code>).</p>
      <br>
      <p>Payments via <strong>UPI (Google Pay, PhonePe, Paytm), Netbanking, Credit/Debit Cards, and Cash on Delivery (COD)</strong> are processed through Razorpay / Cashfree integrations.</p>
      <br>
      <p style="color:var(--sage);font-weight:600;">Subtotal in Bag: ₹${cartState.total_price.toLocaleString('en-IN')}</p>
      `
    ));
    return;
  }

  // Customer Account Routes
  if (pathname === '/account/login') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(buildLoginPage());
    return;
  }

  if (pathname === '/account/register') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(buildRegisterPage());
    return;
  }

  if (pathname === '/account/forgot-password') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(buildForgotPasswordPage());
    return;
  }

  if (pathname === '/account') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(buildAccountPage());
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(build404Page());
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  VYRO — LUXURY PERFORMANCE MEDICAL WEAR`);
  console.log(`  WEAR THE PROFESSIONAL YOU.`);
  console.log(`======================================================`);
  console.log(`  Preview Server running live at:`);
  console.log(`  ➜  http://localhost:${PORT}`);
  console.log(`\n  Routes:`);
  console.log(`  • Homepage:         http://localhost:${PORT}/`);
  console.log(`  • Product (FLEXFIT): http://localhost:${PORT}/products/flexfit-01-midnight-navy`);
  console.log(`  • Collections:      http://localhost:${PORT}/collections/all`);
  console.log(`  • Cart:             http://localhost:${PORT}/cart`);
  console.log(`  • Login:            http://localhost:${PORT}/account/login`);
  console.log(`  • Register:         http://localhost:${PORT}/account/register`);
  console.log(`  • Account:          http://localhost:${PORT}/account`);
  console.log(`  • Our Story:        http://localhost:${PORT}/pages/our-story`);
  console.log(`  • Technology:       http://localhost:${PORT}/pages/technology`);
  console.log(`  • Contact:          http://localhost:${PORT}/pages/contact`);
  console.log(`======================================================\n`);
});
