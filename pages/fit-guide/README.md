# Fit Guide — /pages/fit-guide

## Purpose
Interactive size guide modal and standalone page. Helps customers select the correct scrub size.

## Status
✅ Modal exists (`sections/fit-guide-modal.liquid`, rendered via `renderFitGuideModal()` in server.js)
⏳ Standalone /pages/fit-guide route — not yet routed

## Content
- Size chart: XS / S / M / L / XL with chest, waist, hip measurements
- NOTE: Exact measurements are PLACEHOLDER — awaiting final production spec from client

## Placeholders
- All size measurements: pending production grading sheet from client/manufacturer

## Test Checklist
- [ ] Modal opens from "Size Guide" link on product page
- [ ] Modal closes on X or overlay click
- [ ] Tab/keyboard accessible (focus trap)
- [ ] Measurements clearly marked as placeholders
- [ ] No horizontal overflow at 375px
