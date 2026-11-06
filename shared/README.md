# Shared — Layout, Components, Scripts, Tokens

This directory is the developer source-of-truth for reusable code.

## /shared/tokens
- `tokens.css` — All CSS custom properties (colours, typography, spacing, motion, z-index, layout).
  This is the SINGLE SOURCE for all design tokens. Import into page-specific CSS files.

## /shared/layout
Reference directory for global layout sections:
- Announcement bar → `sections/announcement-bar.liquid`
- Header (ivory nav) → `sections/header.liquid`
- Mega menu → part of header
- Mobile drawer → `sections/mobile-drawer.liquid`
- Cart drawer → `sections/cart-drawer.liquid`
- Footer (navy) → `sections/footer.liquid`

## /shared/components
Reference directory for reusable components:
- Buttons (`.btn`, `.btn--primary`, `.btn--outline`, `.btn--ivory`)
- Size chips (`.size-chip`)
- Colour swatches (`.colour-swatch`)
- Product card (`.product-card`) → `snippets/product-card.liquid`
- Modal (`.modal-overlay`)
- Cart drawer
- Accordions (`.product-accordion`)
- Form fields (`.form-field`)

## /shared/scripts
Reference directory for shared JavaScript:
- Cart interactions → `assets/theme.js` (sections: cart)
- Drawer open/close → `assets/theme.js` (sections: drawers)
- Filter + sort → `assets/theme.js` (section: collection)
- Scroll reveal → `assets/theme.js` (section: animations)
- Utilities → `assets/theme.js` (section: utilities)

## Shopify Deployment
See `/scripts/sync.js` for the naming convention when deploying to Shopify.
Shopify theme directories: `sections/`, `snippets/`, `assets/`, `config/`, `locales/`, `layout/`, `templates/`.
