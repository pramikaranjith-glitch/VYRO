# Account Dashboard — /pages/account

## Purpose
Customer account dashboard shell. Orders, Addresses, Profile, Sign Out.

## Sections
- Sidebar navigation: Orders | Addresses | Profile | Sign Out
- Orders tab: empty state ("No orders yet")
- Addresses tab: empty state ("No addresses saved")
- Profile tab: empty state ("Profile available after sign-in")

## Note
All tabs show empty states only — no fake orders, no fake profile data.
Full account functionality requires Shopify customer account integration.
See /docs/INTEGRATIONS.md for the Shopify customer API setup.

## Test Checklist
- [ ] Tab navigation switches content area
- [ ] All tabs show empty states
- [ ] "Sign Out" link goes to /account/login
- [ ] No fake orders, no fake data visible
- [ ] No horizontal overflow at 375, 390, 768, 1440px
