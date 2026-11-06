# VYRO — Premium Medical Apparel D2C Architecture & Documentation

## 1. Overview
**VYRO** is an upcoming luxury performance medical wear brand in India.  
**Tagline:** *WEAR THE PROFESSIONAL YOU.*  
**First Collection:** FLEXFIT 01, Midnight Navy (`#101E35`), Two-Piece Performance Scrub Set.

This repository contains a production-oriented custom Shopify Online Store 2.0 theme built from first principles (Liquid, JSON templates, modular sections and blocks, CSS custom properties, and accessible vanilla JavaScript). It features zero external framework dependencies, fluid typography, an Apple-grade typographic hierarchy, restrained activewear minimalism, and an isolated mock data layer (`/data/mock-products.json`).

---

## 2. Directory Structure

```
/VYRO/
├── assets/
│   ├── theme.css            # Complete design system tokens, layout, typography, components
│   ├── theme.js             # Vanilla JS: drawer, cart AJAX, hero crossfade, hotspots, modal
│   └── mock/                # Mock campaign & product imagery (pre-launch placeholder assets)
├── config/
│   ├── settings_schema.json # Theme settings (Analytics, Pixel, Integrations, Mock Badge)
│   └── settings_data.json   # Active configuration values
├── data/
│   └── mock-products.json   # Standalone mock data layer with isMock: true flag
├── docs/
│   ├── README.md            # This documentation & setup guide
│   ├── DEPLOYMENT.md        # Deployment instructions for Shopify store
│   ├── CLIENT_GUIDE.md      # Non-technical client guide for managing products & content
│   ├── PLACEHOLDERS.md      # Register of all mock images, copy, and unverified claims
│   └── INTEGRATIONS.md      # Integration status, credentials safety, and setup steps
├── layout/
│   └── theme.liquid         # Primary HTML5 shell, SEO metadata, JSON-LD, fonts, header/footer
├── locales/
│   └── en.default.json      # Internationalization strings
├── sections/
│   ├── announcement-bar.liquid
│   ├── header.liquid
│   ├── footer.liquid
│   ├── hero.liquid
│   ├── featured-product.liquid
│   ├── feature-strip.liquid
│   ├── anatomy-section.liquid
│   ├── scentshift-section.liquid
│   ├── philosophy-section.liquid
│   ├── shift-journal.liquid
│   ├── reviews-section.liquid
│   ├── newsletter-section.liquid
│   ├── fit-guide-modal.liquid
│   ├── main-product.liquid
│   ├── main-collection.liquid
│   ├── main-cart.liquid
│   ├── mobile-drawer.liquid
│   ├── cart-drawer.liquid
│   └── not-found.liquid
├── snippets/
│   ├── icon-logo.liquid     # Inline SVG VYRO wordmark (Navy & Ivory variants)
│   └── product-card.liquid  # Collection product card with hover swap & quick add
├── templates/
│   ├── index.json           # Homepage JSON template (15 section hierarchy)
│   ├── product.json         # Product details JSON template
│   ├── collection.json      # Collection grid & filter JSON template
│   ├── cart.json            # Full page cart JSON template
│   └── 404.json             # 404 error page JSON template
├── package.json             # Development scripts
└── server.js                # Built-in zero-dependency local preview server
```

---

## 3. How to Run Locally

### Option A: Built-in Zero-Dependency Preview Server
Run the local Node.js server to preview the site, test responsive layouts, inspect interactive features, and simulate cart AJAX without any third-party npm packages:

```bash
node server.js
```

Then open your browser at:
```
http://localhost:3000
```

Available preview routes:
- `/` — Homepage (Hero, Featured Product, Anatomy hotspots, ScentShift, Philosophy, Journal, Reviews empty state, Newsletter)
- `/products/flexfit-01-midnight-navy` — Product Detail Page (7-image gallery, size selector guard, accordions, mobile sticky ATB)
- `/collections/all` — Collection Page (Filter sidebar, sorting, hover swap cards, quick add)
- `/cart` — Full Page Bag view
- `/pages/our-story` — Brand philosophy & story
- `/pages/technology` — Technical construction & ScentShift R&D disclosure
- `/pages/contact` — Support and customer inquiries

### Option B: Shopify CLI (When Shopify Dev Store is Available)
When connecting to a live or development Shopify store:

```bash
# 1. Authenticate with Shopify
shopify auth login

# 2. Start local theme development server against remote store
shopify theme dev --store your-store.myshopify.com
```

---

## 4. Key Design System Tokens (`assets/theme.css`)

- **Palette:**
  - Navy (`--navy: #101E35`): Headers, primary buttons, footers, typography, dark sections.
  - Ivory (`--ivory: #F4F1E9`): Site background, primary navigation bar, clean surfaces.
  - Silver (`--silver: #D5D9DF`): Hairline 1px borders, subtle separators.
  - Sage (`--sage: #84958C`): Restrained technical accents and eyebrow indicators.
  - White (`--white: #FFFFFF`): Product card backgrounds and container highlights.
  - Ivory-Grey (`--ivory-grey: #E8E5DD`): Derived diagonal philosophy panel tint.
- **Typography:** Manrope (Headings: 800 weight, uppercase, tight leading 1.02–1.1) + Inter (Body: 15–17px, line height 1.6). Loaded via Google Fonts with `font-display: swap` and Latin subsetting.
- **Rhythm:** 8px base spacing scale (`--space-1` to `--space-20`). Section gaps: 96–160px desktop, 64–96px mobile.
- **Motion:** 200–400ms duration with `cubic-bezier(0.33, 1, 0.68, 1)` easing. Respects `prefers-reduced-motion`.

---

## 5. Architectural Safeguards & Hard Constraints
1. **Zero Fabricated Content:** Customer reviews ship with an empty state. No fake reviews, names, ratings, or AI-generated portraits are present.
2. **Explicit Verification Notice:** All unverified product features and technical attributes are flagged in the UI with `◎ Pending verification` and logged in `/docs/PLACEHOLDERS.md`.
3. **ScentShift Technology Disclosure:** ScentShift is labeled "CURRENTLY IN DEVELOPMENT." It is never claimed as proven, commercially available, or sweat-activated.
4. **Size Selection Guard:** Add to Bag and Buy Now are strictly blocked until an available size variant is selected. Out-of-stock sizes (e.g. XL) are rendered with disabled/struck-through states.
5. **No Hard-Coded Credentials:** All payment (Razorpay/UPI), logistics (Shiprocket), analytics (GA4/Meta), and newsletter endpoints are configured via Shopify admin settings and documented in `/docs/INTEGRATIONS.md`. Dynamic copyright years never hard-code calendar years.
