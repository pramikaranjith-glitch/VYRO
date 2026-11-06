# VYRO — SHOPIFY DEPLOYMENT GUIDE
**Target Environment:** Shopify Online Store 2.0  
**Repository Architecture:** Standard Liquid / JSON / Assets Structure

This document outlines the step-by-step procedure for deploying the VYRO theme to a production or staging Shopify store.

---

## 1. Prerequisites
Before deployment, ensure you have:
1. Owner or Collaborator access to the VYRO Shopify store (e.g. `vyro-apparel.myshopify.com`).
2. Theme editing permissions (`themes` scope).
3. (Optional but recommended) Shopify CLI installed locally:
   ```bash
   brew tap shopify/shopify
   brew install shopify-cli
   ```

---

## 2. Deployment Methods

### Method A: Shopify Admin ZIP Upload (Fastest, No CLI Required)
1. In your local terminal, package the theme into a standard distribution ZIP (excluding git, tests, and node_modules):
   ```bash
   zip -r vyro-theme-v1.0.zip \
     assets/ config/ layout/ locales/ sections/ snippets/ templates/ \
     -x "*.DS_Store*"
   ```
2. Log into the Shopify Admin: `https://admin.shopify.com/store/{your-store}`.
3. In the left navigation, navigate to **Online Store > Themes**.
4. In the **Theme library** section, click **Add theme > Upload zip file**.
5. Select `vyro-theme-v1.0.zip` and confirm the upload.
6. The theme will appear as an unpublished draft theme named `vyro-theme-v1.0`.
7. Click **Actions > Preview** to inspect the live preview.
8. Once verified against real Shopify catalog data, click **Publish**.

---

### Method B: Shopify CLI Push
If Shopify CLI is installed:

1. Authenticate your CLI session:
   ```bash
   shopify auth login
   ```
2. Push directly as an unpublished theme to avoid interrupting live operations:
   ```bash
   shopify theme push --store your-store.myshopify.com --unpublished --theme "VYRO Luxury Performance v1.0"
   ```
3. Test using the generated theme preview URL.
4. When ready to go live:
   ```bash
   shopify theme publish --theme "VYRO Luxury Performance v1.0"
   ```

---

## 3. Post-Deployment Configuration Steps

Once uploaded to Shopify, complete these essential steps in the Shopify Admin:

### Step 1: Upload Real Brand Assets
1. Open the Shopify Theme Editor (**Online Store > Themes > Customize**).
2. Replace all mock images in the Hero slideshow, Featured Product, Philosophy section, and Shift Journal with high-resolution photography.
3. Review `/docs/PLACEHOLDERS.md` to ensure every placeholder is replaced.

### Step 2: Configure Theme Settings
1. Click the gear icon (**Theme settings**) in the Theme Editor.
2. Under **Analytics & Tracking**:
   - Paste your GA4 Measurement ID (`G-XXXXXXXXXX`).
   - Paste your Meta Pixel ID (`123456789012345`).
3. Under **Integrations**:
   - Enter your WhatsApp support telephone number (format: country code + digits, e.g. `919876543210`).
   - Enter your email marketing webhook endpoint (Klaviyo / Mailchimp / Shopify Email).
4. Under **Development**:
   - **Uncheck** `Show MOCK DATA badge` to remove the orange badge before public debut.

### Step 3: Populate Navigation Menus
1. Go to **Online Store > Navigation** in Shopify Admin.
2. In the **Main menu**, configure links:
   - Shop (Collections: All, Men's, Women's, FLEXFIT 01)
   - Our Story (`/pages/our-story`)
   - Technology (`/pages/technology`)
   - Contact (`/pages/contact`)
3. In the **Footer menu**, ensure links to your policy pages (Shipping, Returns, Privacy, Terms) are linked to your published Shopify policies.
