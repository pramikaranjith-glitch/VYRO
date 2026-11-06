/**
 * VYRO — Shopify Sync Script (documentation)
 *
 * Architecture note:
 * -----------------
 * Shopify Online Store 2.0 themes require files in fixed directories:
 *   sections/, templates/, snippets/, assets/, config/, locales/, layout/
 *
 * The /pages/ and /shared/ directories are the developer source-of-truth.
 * Before deploying to Shopify, run this sync to copy and prefix files
 * into the Shopify-required directories.
 *
 * Usage (once Shopify CLI is configured):
 *   node scripts/sync.js
 *   shopify theme push
 *
 * Naming convention:
 *   pages/home/hero.liquid        → sections/home-hero.liquid
 *   pages/product/gallery.liquid  → sections/product-gallery.liquid
 *   pages/collection/filters.liquid → sections/collection-filters.liquid
 *   shared/layout/header.liquid   → (already in sections/header.liquid)
 *   shared/components/accordion.liquid → snippets/accordion.liquid
 *
 * Shopify customer accounts note:
 * --------------------------------
 * Shopify offers two customer account systems:
 *   1. Classic customer templates (templates/customers/*.liquid) — full
 *      theme-level customisation. VYRO uses this approach.
 *   2. New hosted customer accounts (Shopify-managed URL) — limited
 *      theme customisation; styling controlled in Shopify admin.
 * See /docs/INTEGRATIONS.md for the full Shopify integration checklist.
 */

const fs   = require('fs');
const path = require('path');

const ROOT    = path.resolve(__dirname, '..');
const PAGES   = path.join(ROOT, 'pages');
const SHARED  = path.join(ROOT, 'shared');
const SECTIONS = path.join(ROOT, 'sections');
const SNIPPETS = path.join(ROOT, 'snippets');

function syncPages() {
  console.log('VYRO Shopify Sync — documentation mode');
  console.log('---------------------------------------');
  console.log('Source:  /pages/  &  /shared/');
  console.log('Target:  /sections/  &  /snippets/');
  console.log('');
  console.log('To implement the sync:');
  console.log('  1. For each .liquid file in /pages/<page>/,');
  console.log('     copy to /sections/<page>-<filename>.liquid');
  console.log('  2. For each .liquid file in /shared/components/,');
  console.log('     copy to /snippets/<filename>.liquid');
  console.log('  3. Run: shopify theme push --store=your-store.myshopify.com');
  console.log('');
  console.log('See /docs/DEPLOYMENT.md for the full deployment checklist.');
}

syncPages();
