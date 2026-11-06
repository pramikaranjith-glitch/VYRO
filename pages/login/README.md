# Login / Account Pages — /pages/login

## Purpose
Customer authentication flow. Classic Shopify customer templates (not the new hosted customer accounts).

## Pages
1. `/account/login` — Email + password sign-in, forgot password link, create account link
2. `/account/register` — Registration form with marketing opt-in
3. `/account/forgot-password` — Email reset form + confirmation state
4. Account drawer — Triggered from header account icon (sign-in links when logged out)

## Files
- `server.js` → `buildLoginPage()`, `buildRegisterPage()`, `buildForgotPasswordPage()`
- `sections/account-drawer.liquid` (Shopify reference)

## Shopify Customer Accounts Note
> **Classic templates** (`templates/customers/*.liquid`) are used here because they allow
> full theme-level customisation of the sign-in, register, and account pages.
>
> Shopify's newer **hosted customer accounts** (available in Shopify admin → Settings →
> Customer accounts) are managed by Shopify and limit theme customisation significantly.
> VYRO should decide which system to use before store launch. See /docs/INTEGRATIONS.md.

## Rules
- Forms validate client-side with accessible inline errors
- Forms NEVER simulate a successful sign-in in mock mode
- All pages display: *"Authentication will connect to Shopify customer accounts once the store is set up."*
- No fake account data, no fake orders

## Placeholders
- `login-editorial.jpg` — MOCK placeholder, replace with real VYRO editorial image (4:5)

## Test Checklist
- [ ] Empty email field shows inline error "Email is required"
- [ ] Invalid email format shows "Please enter a valid email"
- [ ] Empty password shows "Password is required"
- [ ] Submit never fakes a successful login
- [ ] "Forgot password?" links to /account/forgot-password
- [ ] "Create account" links to /account/register
- [ ] Register form: confirm password mismatch shows error
- [ ] Marketing checkbox is unchecked by default
- [ ] Password show/hide toggle works
- [ ] Desktop: editorial image visible left, form right
- [ ] Mobile: single column, image hidden
- [ ] No horizontal overflow at 375, 390, 768, 1440px
