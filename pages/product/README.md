# Product Page — /pages/product

## Purpose
Detail page for FLEXFIT 01 Midnight Navy (and future products). Primary conversion page.

## Sections (render order)
1. **Breadcrumb** — Home / Shop / Product name
2. **Product gallery** — Thumbnail strip (7 images) + main image viewer
3. **Product info** — Brand eyebrow, name, price, colour swatch, size selector, quantity, CTA buttons
4. **Shipping/returns strip** — Free Shipping Across India | Easy Returns
5. **Accordions** — Description, Fabric & Specifications (placeholder), Wash Care (placeholder), Shipping & Delivery, Returns & Exchange
6. **Mobile sticky ATB** — Fixed bottom bar on mobile with ADD TO BAG
7. **Complete the Look** — 3 related product cards
8. **JSON-LD** — Product structured data

## Files
- `server.js` → `buildProductPage()` (source of render)
- `sections/main-product.liquid` (Shopify reference)

## Images Used
| File | Status |
|------|--------|
| `assets/mock/product-front.svg` | MOCK placeholder — 4:5 light grey bg |
| `assets/mock/product-back.svg` | MOCK placeholder — 4:5 light grey bg |
| `assets/mock/product-side.svg` | MOCK placeholder — 4:5 light grey bg |
| `assets/mock/model-wearing.svg` | MOCK placeholder — lifestyle |
| `assets/mock/fabric-macro.svg` | MOCK placeholder — 1:1 detail |
| `assets/mock/pocket-detail.svg` | MOCK placeholder — 1:1 detail |
| `assets/mock/stitching-detail.svg` | MOCK placeholder — 1:1 detail |

## Placeholders
- Price: ₹2,299 — configurable via mock-products.json and Shopify admin
- Fabric & Specifications: "Pending verification"
- Wash Care: "Pending verification"
- Delivery times: "5–8 business days (Shiprocket integration)" — awaiting confirmation

## Integration Status
- Add to Cart: ✅ Working (mock cart API)
- Size guide modal: ✅ Working (JS)
- Mobile sticky ATB: ✅ Working (CSS + JS)
- Shopify cart API: ⏳ Pending real store

## Test Checklist
- [ ] ADD TO BAG blocked until a size is selected
- [ ] "Please select a size" message shown on attempt without selection
- [ ] XL shows as unavailable / strikethrough
- [ ] Gallery thumbnails all load (no broken images)
- [ ] Accordions open/close correctly
- [ ] Mobile sticky ATB visible at 375px, hidden on desktop
- [ ] Fit guide modal opens from "Size Guide" link
- [ ] No ₹2,799 compare-at price visible
- [ ] No "30-Day Returns" invented policy visible
- [ ] No horizontal overflow at 375, 390, 768, 1440, 1920px
