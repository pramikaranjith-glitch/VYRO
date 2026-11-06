# VYRO — THIRD-PARTY INTEGRATIONS & SERVICES DIRECTORY
**Document version:** 1.0.0  
**Security Classification:** Public Reference (No Credentials Stored Here)

> **HARD SECURITY RULE:**  
> Never commit API keys, secrets, webhooks, or merchant credentials to this repository. All production credentials must be entered securely through the Shopify Admin Dashboard or official app channels.

---

## 1. Integrations Status Summary

| Integration | Category | Current Status | Gateway / Provider | Setup Location |
|---|---|---|---|---|
| **UPI & Netbanking** | Payments (India) | INTEGRATION PENDING | Razorpay / Cashfree / Shopify Payments | Shopify Admin > Settings > Payments |
| **Credit / Debit Cards** | Payments (India & Intl) | INTEGRATION PENDING | Razorpay / Stripe | Shopify Admin > Settings > Payments |
| **Cash on Delivery (COD)** | Payments (Domestic) | INTEGRATION PENDING | Shopify Manual Payment / Advanced COD App | Shopify Admin > Settings > Payments |
| **Shipping & Logistics** | Fulfillment & Tracking | INTEGRATION PENDING | Shiprocket / Delhivery / Bluedart | Shopify App Store > Shiprocket Official App |
| **Order Tracking Notifications**| Communications | INTEGRATION PENDING | WhatsApp Business API / SMS Horizon | Shopify App Store or Webhook |
| **WhatsApp Customer Care** | Live Support | UI & Hook Configured | Direct `https://wa.me/{number}` | Shopify Theme Settings > Integrations |
| **Return & Exchange Portal** | Post-Purchase | INTEGRATION PENDING | ReturnPrime / EcoReturns / Custom | Shopify App Store |
| **Email Newsletter** | Marketing Automation | Hook Configured | Klaviyo / Mailchimp / Shopify Email | Shopify Theme Settings > Integrations |
| **Google Analytics 4** | Web Analytics | Hook Configured | Google Analytics (GA4) | Shopify Theme Settings > Analytics |
| **Meta (Facebook) Pixel** | Ad Attribution | Hook Configured | Meta Events Manager | Shopify Theme Settings > Analytics |

---

## 2. Setup Guides for Each Provider

### A. Payments: Razorpay / Cashfree (UPI, Cards, Netbanking)
1. Register a merchant business account at [Razorpay](https://razorpay.com) or [Cashfree](https://cashfree.com).
2. Complete business KYC verification (GSTIN, Company PAN, Bank Account).
3. In Shopify Admin, navigate to **Settings > Payments > Add payment methods**.
4. Search for "Razorpay" and click **Activate**.
5. Log in with your verified Razorpay merchant credentials.
6. Run test transactions using Razorpay Test Mode before switching to Live.
7. **Notice:** Frontend forms never simulate payment. All checkout flow routes through Shopify's secure PCI-DSS Level 1 checkout at `https://checkout.shopify.com`.

### B. Shipping: Shiprocket (India Delivery & Automated Tracking)
1. Create an account at [Shiprocket](https://www.shiprocket.in).
2. Install the **Shiprocket Shopify App** from the official Shopify App Store.
3. Configure your pickup warehouse address and courier priority (e.g. Bluedart Air, Delhivery Surface).
4. Enable automated WhatsApp/SMS tracking updates within Shiprocket.
5. In Theme Settings, paste your Shiprocket public tracking page URL into the **Announcement Bar > Track Order URL** field.

### C. WhatsApp Support Hook
1. Register a dedicated WhatsApp Business number.
2. In Shopify Admin > **Themes > Customize > Theme Settings > Integrations**:
3. Enter your phone number in international format with country code and no plus sign (e.g. `919876543210` for an Indian mobile number).
4. The footer WhatsApp button will automatically generate a sanitized click-to-chat URL:
   `https://wa.me/919876543210?text=Hi%20VYRO%2C%20I%20have%20an%20inquiry%20regarding%20FLEXFIT%2001.`

### D. Newsletter Subscription Hook
1. Select your email service provider (Klaviyo recommended for fashion e-commerce).
2. Create a list called "VYRO VIP Launch List".
3. Retrieve your custom subscription webhook URL or embedded list endpoint.
4. Paste the URL into **Theme Settings > Integrations > Newsletter endpoint URL**.
5. When configured, submissions to the newsletter form POST directly to this endpoint with JSON payload `{ "email": "user@example.com" }`.
6. Until configured, the UI cleanly states "Newsletter integration is pending. We'll notify you at launch." (No fake success messages).

### E. Google Analytics 4 (GA4) & Meta Pixel
1. Generate your GA4 Measurement ID (`G-XXXXXXXXXX`) in Google Analytics Admin.
2. Generate your Meta Pixel ID (`XXXXXXXXXXXXXXXX`) in Meta Business Events Manager.
3. Paste these IDs into **Theme Settings > Analytics & Tracking**.
4. The theme automatically loads Google tag and Facebook `fbq` asynchronously with zero impact on initial page speed.
