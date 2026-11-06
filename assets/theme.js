/**
 * VYRO Theme — theme.js
 * Vanilla JS, no framework dependencies.
 * Covers: drawer system, mega menu, hero slider, cart AJAX, accordion,
 *         hotspots, fit guide modal, reviews carousel, scroll reveals,
 *         size selector, newsletter, filter drawer, mobile subnav.
 */

'use strict';

/* ============================================================
   UTILS
   ============================================================ */

function $(selector, context) {
  return (context || document).querySelector(selector);
}

function $$(selector, context) {
  return Array.from((context || document).querySelectorAll(selector));
}

function on(el, event, handler, options) {
  if (!el) return;
  el.addEventListener(event, handler, options);
}

function getFocusableElements(container) {
  return $$([
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(','), container).filter(function(el){
    return !el.closest('[aria-hidden="true"]') && getComputedStyle(el).display !== 'none';
  });
}

function trapFocus(container) {
  var focusable = getFocusableElements(container);
  if (!focusable.length) return;
  var first = focusable[0];
  var last  = focusable[focusable.length - 1];

  function handler(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  container.addEventListener('keydown', handler);
  container._trapFocusHandler = handler;
  first.focus();
}

function releaseFocus(container) {
  if (container._trapFocusHandler) {
    container.removeEventListener('keydown', container._trapFocusHandler);
    delete container._trapFocusHandler;
  }
}

/* ============================================================
   DRAWER SYSTEM
   ============================================================ */

var Drawers = {
  _open: null,
  _previouslyFocused: null,

  open: function(id) {
    var drawer  = $('#' + id);
    var overlay = $('#drawer-overlay');
    if (!drawer) return;

    // Close any open drawer first
    if (this._open && this._open !== id) this.close(this._open);

    this._previouslyFocused = document.activeElement;
    this._open = id;

    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (overlay) {
      overlay.classList.add('is-visible');
      overlay.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
    trapFocus(drawer);

    // Hamburger sync
    if (id === 'mobile-drawer') {
      var hbg = $('.js-hamburger');
      if (hbg) hbg.setAttribute('aria-expanded', 'true');
    }
  },

  close: function(id) {
    var drawer  = id ? $('#' + id) : null;
    var overlay = $('#drawer-overlay');

    if (!drawer && this._open) drawer = $('#' + this._open);
    if (!drawer) return;

    var closingId = id || this._open;

    releaseFocus(drawer);
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');

    if (overlay) {
      overlay.classList.remove('is-visible');
      overlay.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
    this._open = null;

    if (this._previouslyFocused && this._previouslyFocused.focus) {
      this._previouslyFocused.focus();
      this._previouslyFocused = null;
    }

    // Hamburger sync
    if (closingId === 'mobile-drawer') {
      var hbg = $('.js-hamburger');
      if (hbg) hbg.setAttribute('aria-expanded', 'false');
    }
  }
};

// Open triggers
on($('.js-hamburger'), 'click', function() {
  Drawers.open('mobile-drawer');
});

on($('.js-cart-open'), 'click', function() {
  Drawers.open('cart-drawer');
});

// Close triggers (all .js-drawer-close buttons + overlay)
document.addEventListener('click', function(e) {
  if (e.target.matches('.js-drawer-close, .js-cart-close, .js-cart-close *')) {
    Drawers.close();
  }
});

on($('#drawer-overlay'), 'click', function() {
  Drawers.close();
});

// Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && Drawers._open) {
    Drawers.close();
  }
});

/* ============================================================
   MEGA MENU
   ============================================================ */

$$('.js-mega-trigger').forEach(function(trigger) {
  var btn  = $('button[aria-haspopup]', trigger);
  var menu = trigger.querySelector('.mega-menu');
  if (!btn || !menu) return;

  var openTimer, closeTimer;

  function open() {
    clearTimeout(closeTimer);
    openTimer = setTimeout(function() {
      btn.setAttribute('aria-expanded', 'true');
      menu.classList.add('is-open');
    }, 100); // slight delay to avoid flicker
  }

  function close() {
    clearTimeout(openTimer);
    closeTimer = setTimeout(function() {
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    }, 150);
  }

  trigger.addEventListener('mouseenter', open);
  trigger.addEventListener('mouseleave', close);
  menu.addEventListener('mouseenter', function() { clearTimeout(closeTimer); });
  menu.addEventListener('mouseleave', close);

  btn.addEventListener('click', function() {
    var isOpen = btn.getAttribute('aria-expanded') === 'true';
    if (isOpen) close(); else { clearTimeout(closeTimer); open(); }
  });

  btn.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') close();
  });
});

/* ============================================================
   MOBILE SUBNAV
   ============================================================ */

$$('.js-mobile-subnav-toggle').forEach(function(btn) {
  var targetId = btn.getAttribute('aria-controls');
  var target   = $('#' + targetId);
  if (!target) return;

  btn.addEventListener('click', function() {
    var expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    target.classList.toggle('is-open', !expanded);
    target.setAttribute('aria-hidden', String(expanded));
  });
});

/* ============================================================
   HERO SLIDER
   ============================================================ */

(function() {
  var hero       = $('.hero');
  if (!hero) return;
  var slides     = $$('.hero__slide', hero);
  var indicators = $$('.hero__indicator', hero);
  if (slides.length < 2) return;

  var current  = 0;
  var timer    = null;
  var interval = 5000;

  function goTo(idx) {
    slides[current].classList.remove('is-active');
    indicators[current] && indicators[current].classList.remove('is-active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    indicators[current] && indicators[current].classList.add('is-active');
  }

  function start() {
    timer = setInterval(function() { goTo(current + 1); }, interval);
  }

  function reset() {
    clearInterval(timer);
    start();
  }

  indicators.forEach(function(btn, idx) {
    btn.addEventListener('click', function() {
      goTo(idx);
      reset();
    });
  });

  // Keyboard support on indicators
  indicators.forEach(function(btn, idx) {
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', 'Slide ' + (idx + 1));
  });

  start();

  // Pause on reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    clearInterval(timer);
  }
})();

/* ============================================================
   SCROLL REVEAL
   ============================================================ */

(function() {
  var revealEls = $$('.reveal, .reveal-stagger');
  if (!revealEls.length || !('IntersectionObserver' in window)) {
    revealEls.forEach(function(el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  revealEls.forEach(function(el) { observer.observe(el); });
})();

/* ============================================================
   PRODUCT ACCORDIONS
   ============================================================ */

$$('.product-accordion__trigger').forEach(function(trigger) {
  var item = trigger.closest('.product-accordion__item');
  if (!item) return;

  trigger.addEventListener('click', function() {
    var isOpen = item.classList.contains('is-open');

    // Close siblings (optional: accordion behaviour)
    // var siblings = $$(`.product-accordion__item`, item.closest('.product-accordion'));
    // siblings.forEach(function(s) { s.classList.remove('is-open'); s.querySelector('.product-accordion__trigger').setAttribute('aria-expanded','false'); });

    item.classList.toggle('is-open', !isOpen);
    trigger.setAttribute('aria-expanded', String(!isOpen));
  });
});

/* ============================================================
   SIZE SELECTOR
   ============================================================ */

function initSizeSelector(context) {
  var chips = $$('.size-chip', context || document);
  chips.forEach(function(chip) {
    if (chip.dataset.unavailable === 'true') {
      chip.setAttribute('aria-disabled', 'true');
      chip.tabIndex = -1;
      return;
    }

    chip.addEventListener('click', function() {
      var group = chip.closest('.size-selector') || chip.closest('[data-size-group]');
      var siblings = group ? $$('.size-chip', group) : chips;
      siblings.forEach(function(s) {
        s.classList.remove('is-selected');
        s.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('is-selected');
      chip.setAttribute('aria-pressed', 'true');

      // Update any size-dependent states (e.g., selected size display)
      var display = document.querySelector('.js-selected-size');
      if (display) display.textContent = chip.dataset.size || chip.textContent.trim();

      // Hide size error
      var err = document.querySelector('.size-error');
      if (err) err.classList.remove('is-visible');
    });

    chip.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chip.click();
      }
    });

    chip.setAttribute('role', 'button');
    chip.setAttribute('aria-pressed', 'false');
    chip.tabIndex = 0;
  });
}

initSizeSelector();

/* ============================================================
   ADD TO CART (AJAX)
   ============================================================ */

function getSelectedSize() {
  var chip = $('.size-chip.is-selected');
  return chip ? (chip.dataset.variantId || null) : null;
}

function showSizeError() {
  var err = $('.size-error');
  if (err) {
    err.classList.add('is-visible');
    err.focus();
  }
}

function updateCartBadge(count) {
  $$('.js-cart-badge').forEach(function(badge) {
    badge.textContent = count || '';
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

function fetchCart() {
  return fetch('/cart.js', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).then(function(r) { return r.json(); });
}

function addToCart(variantId, quantity) {
  return fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: variantId, quantity: quantity || 1 })
  }).then(function(r) {
    if (!r.ok) return r.json().then(function(d) { throw new Error(d.description || 'Error adding to cart'); });
    return r.json();
  });
}

function updateCartItem(key, quantity) {
  return fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: key, quantity: quantity })
  }).then(function(r) { return r.json(); });
}

function refreshCartDrawer() {
  fetchCart().then(function(cart) {
    updateCartBadge(cart.item_count);
    // For a full refresh, we'd re-render via Liquid — in a Shopify context,
    // use sections API: fetch('/?sections=cart-drawer')
    // Here we'll reload the drawer section
    fetch('/?sections=cart-drawer').then(function(r) { return r.json(); })
      .then(function(data) {
        if (data['cart-drawer']) {
          var temp = document.createElement('div');
          temp.innerHTML = data['cart-drawer'];
          var newDrawer = temp.querySelector('#cart-drawer');
          var oldDrawer = $('#cart-drawer');
          if (newDrawer && oldDrawer) {
            // Preserve open state
            var wasOpen = oldDrawer.classList.contains('is-open');
            oldDrawer.innerHTML = newDrawer.innerHTML;
            if (wasOpen) {
              // Re-attach event listeners for new content
              initCartDrawerListeners();
            }
          }
        }
      }).catch(function() {
        // Fallback: just update badge
      });
  });
}

// Add to bag buttons
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.js-add-to-cart');
  if (!btn || btn.classList.contains('product-card__quick-add')) return;

  var variantId = getSelectedSize();
  if (!variantId) {
    showSizeError();
    return;
  }

  var qty = parseInt($('.js-qty-display') && $('.js-qty-display').textContent || '1', 10) || 1;

  btn.disabled = true;
  btn.textContent = 'Adding…';

  addToCart(variantId, qty)
    .then(function() {
      refreshCartDrawer();
      setTimeout(function() {
        Drawers.open('cart-drawer');
        btn.disabled = false;
        btn.textContent = 'Added!';
        setTimeout(function() { btn.textContent = btn.dataset.originalText || 'ADD TO BAG'; }, 2000);
      }, 300);
    })
    .catch(function(err) {
      btn.disabled = false;
      btn.textContent = 'Error — Try Again';
      setTimeout(function() { btn.textContent = btn.dataset.originalText || 'ADD TO BAG'; }, 2500);
      console.warn('VYRO Cart Error:', err.message);
    });
});

// Save original button text
$$('.js-add-to-cart').forEach(function(btn) {
  btn.dataset.originalText = btn.textContent.trim();
});

// Cart drawer quantity updates
function initCartDrawerListeners() {
  $$('.js-qty-minus, .js-qty-plus').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var key = btn.dataset.key;
      var qty = parseInt(btn.dataset.qty, 10);
      if (!key) return;
      updateCartItem(key, Math.max(0, qty)).then(function() {
        refreshCartDrawer();
      });
    });
  });

  $$('.js-remove-item').forEach(function(btn) {
    btn.addEventListener('click', function() {
      updateCartItem(btn.dataset.key, 0).then(function() {
        refreshCartDrawer();
      });
    });
  });
}

initCartDrawerListeners();

/* ============================================================
   PRODUCT GALLERY
   ============================================================ */

(function() {
  var thumbs = $$('.product-gallery__thumb');
  var mainImg = $('.product-gallery__main');
  if (!thumbs.length || !mainImg) return;

  thumbs.forEach(function(thumb, idx) {
    thumb.addEventListener('click', function() {
      thumbs.forEach(function(t) { t.classList.remove('is-active'); });
      thumb.classList.add('is-active');
      mainImg.src = thumb.dataset.full || thumb.src;
      mainImg.srcset = thumb.dataset.srcset || '';
      mainImg.alt = thumb.alt;
    });

    thumb.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); thumb.click(); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        thumbs[(idx + 1) % thumbs.length].focus();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        thumbs[(idx - 1 + thumbs.length) % thumbs.length].focus();
      }
    });
  });
})();

/* ============================================================
   ANATOMY HOTSPOTS
   ============================================================ */

(function() {
  var hotspots = $$('.hotspot');
  if (!hotspots.length) return;

  var calloutItems = $$('.anatomy-callout-item');

  function activateHotspot(hs) {
    hotspots.forEach(function(h) { h.classList.remove('is-active'); });
    hs.classList.add('is-active');

    var num = hs.dataset.hotspotNum;
    calloutItems.forEach(function(item) {
      item.classList.toggle('is-active', item.dataset.hotspotNum === num);
    });
  }

  hotspots.forEach(function(hs) {
    var dot = hs.querySelector('.hotspot__dot');
    if (!dot) return;
    dot.setAttribute('role', 'button');
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-expanded', 'false');
    var label = hs.querySelector('.hotspot__tooltip-label');
    if (label) dot.setAttribute('aria-label', label.textContent);

    dot.addEventListener('click', function() {
      var isActive = hs.classList.contains('is-active');
      if (isActive) {
        hs.classList.remove('is-active');
        dot.setAttribute('aria-expanded', 'false');
      } else {
        activateHotspot(hs);
        dot.setAttribute('aria-expanded', 'true');
      }
    });

    dot.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dot.click(); }
      if (e.key === 'Escape') { hs.classList.remove('is-active'); dot.setAttribute('aria-expanded', 'false'); }
    });
  });

  calloutItems.forEach(function(item) {
    item.setAttribute('tabindex', '0');
    item.addEventListener('click', function() {
      var num = item.dataset.hotspotNum;
      var hs  = document.querySelector('.hotspot[data-hotspot-num="' + num + '"]');
      if (hs) activateHotspot(hs);
    });
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });
  });
})();

/* ============================================================
   FIT GUIDE MODAL
   ============================================================ */

(function() {
  var modal   = $('#fit-guide-modal');
  if (!modal) return;
  var overlay = modal.querySelector('.fit-guide-modal__overlay');
  var closeBtns = $$('.js-fit-guide-close', modal);

  function openFitGuide() {
    modal.classList.add('is-open');
    modal.style.display = 'flex';
    trapFocus(modal);
  }

  function closeFitGuide() {
    modal.classList.remove('is-open');
    setTimeout(function() { modal.style.display = 'none'; }, 300);
    releaseFocus(modal);
  }

  $$('.js-open-fit-guide').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openFitGuide();
    });
  });

  closeBtns.forEach(function(btn) {
    btn.addEventListener('click', closeFitGuide);
  });

  if (overlay) overlay.addEventListener('click', closeFitGuide);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeFitGuide();
  });
})();

/* ============================================================
   REVIEWS CAROUSEL
   ============================================================ */

(function() {
  var track    = $('.reviews-track');
  var prevBtn  = $('.reviews-nav__btn--prev');
  var nextBtn  = $('.reviews-nav__btn--next');
  if (!track) return;

  var cardWidth = 320 + 16; // card width + gap

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
  }
})();

/* ============================================================
   FILTER DRAWER (mobile)
   ============================================================ */

(function() {
  var openBtn  = $('.js-filter-open');
  var drawer   = $('#filter-drawer');
  var closeBtn = $('.js-filter-close');
  var applyBtn = $('.js-filter-apply');
  var clearBtn = $('.js-filter-clear');
  var overlay  = $('#drawer-overlay');

  if (!openBtn || !drawer) return;

  openBtn.addEventListener('click', function() {
    drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    trapFocus(drawer);
  });

  function closeFilter() {
    drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
    releaseFocus(drawer);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeFilter);
  if (applyBtn) applyBtn.addEventListener('click', function() { closeFilter(); /* apply filters */ });
  if (clearBtn) clearBtn.addEventListener('click', function() { /* clear filters */ });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeFilter();
  });
})();

/* ============================================================
   SHIFT INDEX — progress bar animation
   ============================================================ */

(function() {
  var fills = $$('.shift-index__fill');
  if (!fills.length || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var fill = entry.target;
        fill.style.width = (fill.dataset.value || '0') + '%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(function(fill) {
    var target = fill.dataset.value || '0';
    fill.style.width = '0%';
    observer.observe(fill);
  });
})();

/* ============================================================
   COLLECTION FILTERS (front-end simulation)
   ============================================================ */

(function() {
  var filterOptions = $$('.filter-option');
  filterOptions.forEach(function(opt) {
    opt.addEventListener('click', function() {
      opt.classList.toggle('is-active');
      var checkbox = opt.querySelector('.filter-checkbox');
      if (checkbox) {
        var checked = opt.classList.contains('is-active');
        opt.setAttribute('aria-checked', String(checked));
      }
    });
    opt.setAttribute('role', 'checkbox');
    opt.setAttribute('aria-checked', 'false');
    opt.tabIndex = 0;
    opt.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); opt.click(); }
    });
  });
})();

/* ============================================================
   NEWSLETTER SECTION
   ============================================================ */

(function() {
  var form = $('.js-newsletter-form');
  var msg  = $('.js-newsletter-msg');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var email = form.querySelector('input[type="email"]').value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (msg) {
        msg.textContent = 'Please enter a valid email address.';
        msg.className = 'newsletter-form__message newsletter-form__message--error js-newsletter-msg';
      }
      return;
    }

    // INTEGRATION PENDING — no fake success without a real endpoint
    var endpoint = form.dataset.endpoint;
    if (!endpoint) {
      if (msg) {
        msg.textContent = 'Newsletter integration is pending. We\'ll notify you at launch.';
        msg.className = 'newsletter-form__message js-newsletter-msg';
        msg.style.color = 'rgba(244,241,233,0.5)';
      }
      return;
    }

    // Real submission when endpoint is configured
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    }).then(function(r) {
      if (r.ok) {
        if (msg) {
          msg.textContent = 'You\'re on the list. Talk soon.';
          msg.className = 'newsletter-form__message newsletter-form__message--success js-newsletter-msg';
        }
        form.reset();
      } else {
        throw new Error('Subscription failed');
      }
    }).catch(function() {
      if (msg) {
        msg.textContent = 'Something went wrong. Please try again.';
        msg.className = 'newsletter-form__message newsletter-form__message--error js-newsletter-msg';
      }
    });
  });
})();

/* ============================================================
   FEATURED PRODUCT — image gallery dots (mobile swipe)
   ============================================================ */

(function() {
  var gallery = $('.js-featured-gallery');
  if (!gallery) return;
  var dots = $$('.js-featured-dot');

  gallery.addEventListener('scroll', function() {
    var scrollPos = gallery.scrollLeft;
    var width = gallery.offsetWidth;
    var idx = Math.round(scrollPos / width);
    dots.forEach(function(dot, i) {
      dot.classList.toggle('is-active', i === idx);
    });
  });
})();

/* ============================================================
   BUY NOW — redirect to checkout with item
   ============================================================ */

document.addEventListener('click', function(e) {
  var btn = e.target.closest('.js-buy-now');
  if (!btn) return;

  var variantId = getSelectedSize();
  if (!variantId) {
    showSizeError();
    return;
  }

  window.location.href = '/checkout?variant=' + variantId + '&quantity=1';
});

/* ============================================================
   MOBILE STICKY ADD TO BAG
   ============================================================ */

(function() {
  var stickyBar = $('.mobile-sticky-atb');
  var productForm = $('.product-info');
  if (!stickyBar || !productForm) return;

  var observer = new IntersectionObserver(function(entries) {
    var visible = entries[0].isIntersecting;
    stickyBar.style.display = visible ? 'none' : 'flex';
  }, { threshold: 0.1 });

  // Observe the main product CTA section
  var mainCta = $('.product-info .featured-product__actions, .js-main-atb');
  if (mainCta) observer.observe(mainCta);
})();

/* ============================================================
   QUICK ADD (collection page)
   ============================================================ */

document.addEventListener('click', function(e) {
  var btn = e.target.closest('.product-card__quick-add');
  if (!btn) return;

  var variantId = btn.dataset.variantId;
  if (!variantId) return;

  btn.disabled = true;
  var orig = btn.textContent;
  btn.textContent = 'Adding…';

  addToCart(variantId, 1).then(function() {
    refreshCartDrawer();
    btn.textContent = 'Added!';
    setTimeout(function() {
      Drawers.open('cart-drawer');
      btn.disabled = false;
      btn.textContent = orig;
    }, 800);
  }).catch(function() {
    btn.disabled = false;
    btn.textContent = orig;
  });
});

/* ============================================================
   SEARCH (placeholder — Shopify Predictive Search API ready)
   ============================================================ */

on($('.js-search-open'), 'click', function() {
  // TODO: Implement search overlay using Shopify Predictive Search API
  // For now, alert is replaced by a no-op for production readiness
  console.log('VYRO: Search overlay — INTEGRATION PENDING');
});

/* ============================================================
   ACCOUNT DRAWER TOGGLE
   ============================================================ */

(function() {
  var trigger = $('.js-account-open');
  var drawer = $('#account-drawer');
  if (!trigger || !drawer) return;

  function toggleDrawer(open) {
    var isOpen = open !== undefined ? open : !drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', isOpen);
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  on(trigger, 'click', function(e) {
    e.stopPropagation();
    toggleDrawer();
  });

  document.addEventListener('click', function(e) {
    if (drawer.classList.contains('is-open') && !drawer.contains(e.target) && !trigger.contains(e.target)) {
      toggleDrawer(false);
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      toggleDrawer(false);
      trigger.focus();
    }
  });
})();

/* ============================================================
   AUTH PAGES & VALIDATION (Login, Register, Forgot Password)
   ============================================================ */

(function() {
  // Password Visibility Toggles
  $$('.js-pwd-toggle').forEach(function(toggle) {
    on(toggle, 'click', function() {
      var input = toggle.closest('.form-field__password-wrap').querySelector('input');
      if (!input) return;
      var isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      toggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });

  // Helper function for field errors
  function setFieldError(field, errorEl, hasError) {
    if (field) field.classList.toggle('is-error', hasError);
    if (errorEl) errorEl.classList.toggle('is-visible', hasError);
  }

  // Email validator
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Login Form
  var loginForm = $('.js-auth-login');
  if (loginForm) {
    on(loginForm, 'submit', function(e) {
      e.preventDefault();
      var email = $('#login-email');
      var password = $('#login-password');
      var emailErr = $('#login-email-error');
      var pwdErr = $('#login-password-error');

      var valid = true;
      if (!email.value.trim() || !isValidEmail(email.value.trim())) {
        setFieldError(email, emailErr, true);
        valid = false;
      } else {
        setFieldError(email, emailErr, false);
      }

      if (!password.value.trim()) {
        setFieldError(password, pwdErr, true);
        valid = false;
      } else {
        setFieldError(password, pwdErr, false);
      }

      if (valid) {
        // Never simulate successful sign-in; keep Shopify note visible
        console.log('VYRO Auth: Validation passed. Connecting to Shopify customer accounts.');
      }
    });
  }

  // Register Form
  var regForm = $('.js-auth-register');
  if (regForm) {
    on(regForm, 'submit', function(e) {
      e.preventDefault();
      var fname = $('#reg-fname');
      var lname = $('#reg-lname');
      var email = $('#reg-email');
      var pwd = $('#reg-password');
      var confirm = $('#reg-confirm');

      var fnameErr = $('#reg-fname-error');
      var lnameErr = $('#reg-lname-error');
      var emailErr = $('#reg-email-error');
      var pwdErr = $('#reg-password-error');
      var confirmErr = $('#reg-confirm-error');

      var valid = true;

      if (!fname.value.trim()) { setFieldError(fname, fnameErr, true); valid = false; }
      else { setFieldError(fname, fnameErr, false); }

      if (!lname.value.trim()) { setFieldError(lname, lnameErr, true); valid = false; }
      else { setFieldError(lname, lnameErr, false); }

      if (!email.value.trim() || !isValidEmail(email.value.trim())) { setFieldError(email, emailErr, true); valid = false; }
      else { setFieldError(email, emailErr, false); }

      if (!pwd.value || pwd.value.length < 6) { setFieldError(pwd, pwdErr, true); valid = false; }
      else { setFieldError(pwd, pwdErr, false); }

      if (!confirm.value || confirm.value !== pwd.value) { setFieldError(confirm, confirmErr, true); valid = false; }
      else { setFieldError(confirm, confirmErr, false); }

      if (valid) {
        console.log('VYRO Auth: Register form validated. Connecting to Shopify customer accounts.');
      }
    });
  }

  // Forgot Password Form
  var forgotForm = $('.js-auth-forgot');
  if (forgotForm) {
    on(forgotForm, 'submit', function(e) {
      e.preventDefault();
      var email = $('#forgot-email');
      var err = $('#forgot-email-error');
      var successNotice = $('.js-forgot-success');

      if (!email.value.trim() || !isValidEmail(email.value.trim())) {
        setFieldError(email, err, true);
        if (successNotice) successNotice.style.display = 'none';
      } else {
        setFieldError(email, err, false);
        if (successNotice) {
          successNotice.style.display = 'block';
          successNotice.setAttribute('role', 'alert');
        }
      }
    });
  }

  // Account Dashboard Tab Switching
  $$('.js-account-tab-btn').forEach(function(btn) {
    on(btn, 'click', function(e) {
      e.preventDefault();
      var tabId = btn.dataset.tab;
      $$('.js-account-tab-btn').forEach(function(b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');

      $$('.js-account-tab').forEach(function(tab) {
        tab.style.display = tab.id === 'tab-' + tabId ? 'block' : 'none';
      });
    });
  });
})();

/* ============================================================
   COLLECTION SORTING & FILTERING
   ============================================================ */

(function() {
  var sortSelect = $('.sort-select');
  var grid = $('.products-grid');
  var chipsBar = $('#active-chips');
  if (!grid) return;

  // Sorting
  if (sortSelect) {
    on(sortSelect, 'change', function() {
      var val = sortSelect.value;
      var cards = Array.from(grid.querySelectorAll('.product-card'));
      if (cards.length === 0) return;

      cards.sort(function(a, b) {
        var priceA = parseInt((a.querySelector('.product-card__price') || {}).textContent.replace(/[^0-9]/g, '') || '0', 10);
        var priceB = parseInt((b.querySelector('.product-card__price') || {}).textContent.replace(/[^0-9]/g, '') || '0', 10);
        var nameA = ((a.querySelector('.product-card__name') || {}).textContent || '').trim();
        var nameB = ((b.querySelector('.product-card__name') || {}).textContent || '').trim();

        if (val === 'price-asc') return priceA - priceB;
        if (val === 'price-desc') return priceB - priceA;
        if (val === 'newest') return nameB.localeCompare(nameA);
        return 0; // featured default
      });

      cards.forEach(function(card) { grid.appendChild(card); });
    });
  }

  // Filter options and active chips
  var filterOptions = $$('.filter-sidebar .filter-option');
  if (filterOptions.length > 0) {
    filterOptions.forEach(function(opt) {
      on(opt, 'click', function() {
        var isActive = opt.classList.toggle('is-active');
        opt.setAttribute('aria-checked', isActive ? 'true' : 'false');
        updateFilterChips();
      });

      on(opt, 'keydown', function(e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          opt.click();
        }
      });
    });
  }

  function updateFilterChips() {
    if (!chipsBar) return;
    var activeOpts = $$('.filter-sidebar .filter-option.is-active');
    if (activeOpts.length === 0) {
      chipsBar.style.display = 'none';
      chipsBar.innerHTML = '';
      return;
    }

    chipsBar.style.display = 'flex';
    chipsBar.innerHTML = '';
    activeOpts.forEach(function(opt) {
      var labelText = opt.textContent.trim().replace(/\s*\(\d+\)$/, '');
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'btn btn--outline';
      chip.style.cssText = 'padding:4px 10px;font-size:11px;height:auto;gap:6px;';
      chip.innerHTML = '<span>' + labelText + '</span> <span aria-hidden="true" style="font-weight:700;">×</span>';
      chip.setAttribute('aria-label', 'Remove filter ' + labelText);
      on(chip, 'click', function() {
        opt.click();
      });
      chipsBar.appendChild(chip);
    });
  }
})();

console.log('%cVYRO Theme loaded. WEAR THE PROFESSIONAL YOU.', 'color:#84958C;font-weight:700;font-size:12px;');
