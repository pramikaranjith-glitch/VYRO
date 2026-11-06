# Cart Page & Drawer — /pages/cart

## Purpose
Full cart page (/cart) and the slide-in cart drawer accessible from the bag icon.

## Sections
- **Cart drawer** — Slides in from right, shows line items, subtotal, checkout CTA, empty state
- **Cart page** — Full-width cart with order summary sidebar

## Empty State
Both cart page and drawer show a branded empty state with "Your bag is empty" and a "Shop the Collection" CTA.

## Integration Status
- Cart AJAX (add, change, remove): ✅ Working (mock server)
- Quantity controls: ✅ Working
- Shopify checkout redirect: ⏳ Pending real store

## Test Checklist
- [ ] Empty state renders correctly
- [ ] Adding a product updates the bag icon count
- [ ] Quantity +/- works
- [ ] Remove item removes from list
- [ ] Subtotal updates correctly
- [ ] "Checkout" links to /checkout (mock info page)
- [ ] Cart drawer closes on overlay click or X
- [ ] No horizontal overflow at 375, 390, 768, 1440px
