# Shared Layout Components

This directory documents the global layout components used across all VYRO pages.

## Layout Structure
In accordance with Shopify Online Store 2.0 theme conventions, the global layout files reside in:
- `layout/theme.liquid` — Base HTML shell, fonts, meta tags, and content injection points.
- `sections/announcement-bar.liquid` — Top global announcement bar (`#101E35` Navy, 36px height).
- `sections/header.liquid` — Sticky site header (`#F4F1E9` Ivory, 72px height) with wordmark, navigation links, and action icons.
- `sections/mobile-drawer.liquid` — Slide-out navigation drawer for mobile viewports.
- `sections/cart-drawer.liquid` — Slide-out side cart drawer with free shipping progress bar.
- `sections/footer.liquid` — Full-width global footer (`#101E35` Navy) with brand column, navigation groups, and newsletter signup.

## Local Preview Implementation
In `server.js`, these layout components are rendered via:
- `renderAnnouncementBar()`
- `renderHeader()`
- `renderFooter()`
- `renderMobileDrawer()`
- `renderCartDrawer()`
- `renderAccountDrawer()`
