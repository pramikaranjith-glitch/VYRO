# Homepage — /pages/home

## Purpose
The VYRO homepage. Entry point for all traffic (mobile-first, Instagram referrals, India).

## Sections (render order)
1. **hero** — Full-bleed 3-slide crossfade carousel, eyebrow + headline + CTA
2. **featured-product** — 3-column split: front/back images | info + size selector | pocket bleed image
3. **feature-strip** — 5 feature icons with editable labels (all pending verification)
4. **anatomy-section** — Interactive hotspot diagram of FLEXFIT 01
5. **scentshift-section** — "In Development" textile tech panel
6. **philosophy-section** — Diagonal-cut editorial image + brand statement
7. **shift-journal** — 3-article editorial grid
8. **reviews-section** — Empty state (awaiting real reviews)
9. **newsletter-section** — Email opt-in

## Files
- `server.js` → `buildHomepage()` (source of render)
- `sections/hero.liquid` (Shopify reference)
- `sections/featured-product.liquid`
- `sections/feature-strip.liquid`
- `sections/philosophy-section.liquid`
- `sections/reviews-section.liquid`
- `sections/newsletter-section.liquid`

## Images Used
| File | Status |
|------|--------|
| `assets/mock/hero-slide-1.jpg` | MOCK — replace with real photography |
| `assets/mock/hero-slide-2.jpg` | MOCK — replace with real photography |
| `assets/mock/hero-slide-3.jpg` | MOCK — replace with real photography |
| `assets/mock/product-front.svg` | MOCK placeholder |
| `assets/mock/product-back.svg` | MOCK placeholder |
| `assets/mock/pocket-detail.svg` | MOCK placeholder |
| `assets/mock/philosophy-editorial.jpg` | MOCK — replace with real photography |
| `assets/mock/journal-1.svg` | MOCK placeholder |
| `assets/mock/journal-2.svg` | MOCK placeholder |
| `assets/mock/journal-3.svg` | MOCK placeholder |

## Placeholders
- Feature strip labels: "pending verification" — awaiting client confirmation
- Review cards: empty state — awaiting real reviews
- ScentShift: "In Development" — no commercial claims made

## Integration Status
- Cart AJAX: ✅ Working (mock server)
- Shopify Sections API: ⏳ Pending real Shopify store
- Analytics: ⏳ Pending (see /docs/INTEGRATIONS.md)

## Test Checklist
- [ ] Hero slides auto-advance every 5s, manual indicator works
- [ ] "SHOP THE COLLECTION" CTA links to /collections/all
- [ ] Size chips block ADD TO BAG until selected
- [ ] Feature strip labels visible and not overflowing at 375px
- [ ] Reviews empty state renders correctly
- [ ] No horizontal overflow at 375, 390, 768, 1440, 1920px
