# VYRO — PLACEHOLDERS & UNVERIFIED CLAIMS REGISTER
**Document version:** 1.0.0  
**Status:** Pre-Launch Audit Registry  
**Brand:** VYRO (Wear the Professional You)

> **CRITICAL COMPLIANCE NOTICE:**  
> In accordance with Brand Hard Constraints (Section 15), this document records every placeholder, mock image, mock product, and unverified technical claim currently present in the codebase. None of these items may be published to production or advertised to consumers without written verification and sign-off from the VYRO brand leadership team.

---

## 1. Unverified Technical & Performance Claims

The following claims appear as editable text fields or placeholder labels in the theme editor. They are explicitly marked with `◎ Pending verification` in the UI and must **NOT** be treated as verified medical or performance claims until laboratory testing or manufacturing specification sheets are provided:

| Location | Label / Claim | Current Status | Required Action for Production |
|---|---|---|---|
| **Feature Strip** | "Ultra-Light Fabric" | Placeholder / Unverified | Verify GSM (grams per square metre) against lab test reports. |
| **Feature Strip** | "4-Way Stretch" | Placeholder / Unverified | Verify elastane/spandex percentage and mechanical elongation data. |
| **Feature Strip** | "Breathable Design" | Placeholder / Unverified | Verify air permeability (CFM) or moisture vapor transmission rate (MVTR). |
| **Feature Strip** | "All-Day Comfort" | Subjective / Unverified | Reframe or support with ergonomic fit trial feedback. |
| **Feature Strip** | "Long-Lasting Quality" | Placeholder / Unverified | Verify wash-durability testing (e.g. 50+ industrial washes). |
| **Product Accordion** | Fabric Composition & Weight | Placeholder (`[Pending brand data]`) | Insert actual fiber blend (e.g., 72% Polyester, 21% Rayon, 7% Spandex). |
| **Product Accordion** | Wash Care Instructions | Placeholder (`[Pending brand data]`) | Insert verified temperature, tumble dry, and ironing specifications. |
| **ScentShift Section** | Fragrance-release technology | Exploratory Concept Only | **STRICT RULE:** Displayed prominently with "CURRENTLY IN DEVELOPMENT." Never claim proven, commercially available, or sweat-activated. |
| **Fit Guide** | Chest, Waist, and Hip Dimensions | Sizing Estimation Only | Calibrate against final production garment spec sheet from manufacturer. |

---

## 2. Mock Imagery Register

All images in `/assets/mock/` are AI-generated mockups created under the Image Style Lock guidelines (85mm lens, natural daylight, architectural setting, midnight navy apparel, blank chest). They are **NOT** real product photographs.

| File Path | Description / Scene | Target Aspect Ratio | Alt Text / Accessibility Label | Status |
|---|---|---|---|---|
| `/assets/mock/hero-slide-1.jpg` | Male & female professionals in modern clinic architecture | 16:7 (desktop), 4:5 (mobile) | "Two healthcare professionals in athletic-fit midnight navy medical apparel standing in modern architectural space." | MOCK: Replace with real campaign photography. |
| `/assets/mock/hero-slide-2.jpg` | Healthcare professional walking through sunlit corridor | 16:7 (desktop), 4:5 (mobile) | "Healthcare professional in midnight navy performance scrubs walking through sunlit modern facility." | MOCK: Replace with real campaign photography. |
| `/assets/mock/hero-slide-3.jpg` | Close-up seated portrait of clinician | 16:7 (desktop), 4:5 (mobile) | "Seated portrait of healthcare professional wearing midnight navy medical wear." | MOCK: Replace with real campaign photography. |
| `/assets/mock/product-front.webp` | FLEXFIT 01 Midnight Navy On-Model Front View | 4:5 seamless | "FLEXFIT 01 Midnight Navy two-piece scrub set on model, front view showing V-neck and chest silhouette." | MOCK: Replace with studio e-commerce shot. |
| `/assets/mock/product-back.webp` | FLEXFIT 01 Midnight Navy On-Model Back View | 4:5 seamless | "FLEXFIT 01 Midnight Navy two-piece scrub set on model, back view showing shoulder yoke and tailored drape." | MOCK: Replace with studio e-commerce shot. |
| `/assets/mock/product-side.webp` | FLEXFIT 01 Midnight Navy On-Model Side Profile | 4:5 seamless | "FLEXFIT 01 Midnight Navy on model, side profile view highlighting athletic taper." | MOCK: Replace with studio e-commerce shot. |
| `/assets/mock/model-wearing.webp` | FLEXFIT 01 Lifestyle In-Action Shot | 4:5 editorial | "Healthcare professional wearing FLEXFIT 01 scrubs in minimal modern environment." | MOCK: Replace with real lifestyle shoot. |
| `/assets/mock/fabric-macro.webp` | 1:1 Macro Fabric Weave Close-up | 1:1 square | "Extreme close-up of midnight navy textured performance weave showing fine yarn structure." | MOCK: Replace with actual fabric macro photography. |
| `/assets/mock/pocket-detail.webp` | 1:1 Pocket Construction Detail | 1:1 square | "Close-up of deep functional hip pocket with reinforced stitching on FLEXFIT 01 scrub pants." | MOCK: Replace with garment detail macro. |
| `/assets/mock/stitching-detail.webp`| 1:1 Bar-Tack Seam Detail | 1:1 square | "Close-up of reinforced seam construction and flatlock stitching." | MOCK: Replace with garment detail macro. |
| `/assets/mock/philosophy-editorial.jpg` | Two clinicians in discussion in modern space | 3:2 landscape | "Two medical professionals seated together in contemporary architectural setting." | MOCK: Replace with brand philosophy shoot. |
| `/assets/mock/journal-1.webp` | Shift Journal: Early morning shift transition | 3:2 landscape | "Abstract documentary moment of clinician hands and midnight navy sleeve." | MOCK: Replace with editorial essay photography. |
| `/assets/mock/journal-2.webp` | Shift Journal: Surgical prep / corridor light | 3:2 landscape | "Atmospheric lighting along a minimal hospital corridor." | MOCK: Replace with editorial essay photography. |
| `/assets/mock/journal-3.webp` | Shift Journal: Focus and preparation | 3:2 landscape | "Healthcare professional preparing for rounds in quiet morning light." | MOCK: Replace with editorial essay photography. |
| `/assets/mock/scentshift-macro-1.webp`| ScentShift Textile Macro 1 | 3:2 landscape | "Macro view of textile fibers with subtle sage highlights representing micro-encapsulation research." | MOCK: Replace with R&D laboratory visualization. |
| `/assets/mock/scentshift-macro-2.webp`| ScentShift Textile Macro 2 | 3:2 landscape | "High-magnification textile weave structure under lab-quality lighting." | MOCK: Replace with R&D laboratory visualization. |

---

## 3. Mock Catalog Data (`/data/mock-products.json`)

The catalog contains temporary products created exclusively to test collection filtering, multi-colour swatches, sorting, hover swap, quick add, and inventory states.

| Product Title | Handle | Mock Status | Purpose | Deletion Flag |
|---|---|---|---|---|
| **FLEXFIT 01 — Midnight Navy** | `flexfit-01-midnight-navy` | Core Mock (Real Collection) | Anchor product for all homepage and PDP testing. Size XL set to out-of-stock for test validation. | **KEEP:** Update variant IDs and price when real Shopify catalog is populated. |
| **FLEXFIT 01 — Sage** | `flexfit-01-sage-placeholder` | Test Product | Verifies collection filter by color (Sage), swatches, and multi-product grid. | **DELETE BEFORE LAUNCH** |
| **FLEXFIT 01 Women's — Midnight Navy** | `flexfit-01-womens-midnight-navy-placeholder` | Test Product | Verifies gender filter (Women's), category hierarchy, and XS variant sizing. | **DELETE BEFORE LAUNCH** |

---

## 4. Reviews & Testimonials Register

- **Current State:** SHIPPED WITH ZERO TESTIMONIALS / EMPTY STATE.
- **Empty State Display Copy:** *"Verified customer stories will appear here after launch. We never publish unverified or fabricated reviews."*
- **Policy:** Under Section 15, no AI-generated faces, fabricated doctor names, fictitious hospital designations, or invented 5-star ratings may ever be added to this section. All review blocks remain dormant until real verified customers submit feedback post-launch.

---

## 5. Shift Journal Editorial Copy

The four articles in the Shift Journal section are structural wireframes:
1. *"The Art of the Long Shift"*
2. *"What Your Scrubs Say About You"*
3. *"Designing for Comfort and Performance"*
4. *"Inside VYRO: Behind the First Collection"*

All article texts, author bylines, and issue numbers are placeholders. No real or fabricated clinicians are cited. Full journalistic articles must be authored and imported via Shopify Blog Articles prior to public debut.
