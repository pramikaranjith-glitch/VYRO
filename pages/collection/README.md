# Collection Page — /pages/collection

## Purpose
Browse and filter all VYRO products. Primary discovery page.

## Sections
1. **Page header** — Eyebrow, H1, description
2. **Active filter chips** — Shown when filters are applied
3. **Filter sidebar** (desktop) — Size, Colour, Gender filters with counts
4. **Collection toolbar** — Product count, sort dropdown, mobile filter button
5. **Product grid** — 3 product cards (mock)
6. **Mobile filter drawer** — Slide-in panel

## Files
- `server.js` → `buildCollectionPage()` (source of render)
- `sections/main-collection.liquid` (Shopify reference)

## Mock Products
| Product | Colour | Sizes | Status |
|---------|--------|-------|--------|
| FLEXFIT 01 — Midnight Navy | Navy | S, M, L (XL OOS) | Real SKU |
| FLEXFIT 01 — Sage | Sage | S, M (L OOS) | MOCK — pending |
| FLEXFIT 01 Women's | Navy | XS, S, M, L | MOCK — pending |

## Placeholders
- All product cards: MOCK SVG images — replace with real photography
- Sage colourway: mock only — not yet in production
- Women's fit: mock only — not yet in production
- Filter counts are static mock values

## Integration Status
- Client-side filter toggle: ✅ Working (JS)
- Sort dropdown: ✅ Working (JS DOM reorder)
- Shopify collection API: ⏳ Pending real store

## Test Checklist
- [ ] No active filter on initial load (3 products shown)
- [ ] Clicking a colour filter hides non-matching products
- [ ] Active filter chips appear when filter is applied
- [ ] "Clear" removes all filters
- [ ] Product count updates to match visible products
- [ ] Sort dropdown re-orders cards
- [ ] Mobile filter drawer opens/closes at 375px
- [ ] Product card hover shows back image
- [ ] Quick Add button visible on hover
- [ ] No [MOCK] text visible in product names
- [ ] No horizontal overflow at 375, 390, 768, 1440, 1920px
