# VYRO — AI Image Generation Prompts

> **Status:** All images are MOCK placeholders. Replace with real VYRO photography before commercial launch.
> Every image is listed in /docs/PLACEHOLDERS.md as "MOCK — replace with real VYRO photography".

## Style Lock — Apply to Every Image

```
"Premium international fashion campaign photograph. Midnight navy athletic-fit scrub set
with a blank chest area (no logos, no text on fabric). Soft natural window light, modern
minimalist architecture, pale grey concrete and glass, muted ivory and silver tones,
shallow depth of field, natural skin tones, realistic fabric texture and stitching,
confident relaxed expressions. Indian healthcare professionals as subjects.
No text, no logos, no hospital clutter, no recognisable real people."
```

Use **the same two models** (one man, one woman) across all lifestyle shots wherever the tool allows.
AI-generated faces must **never** be presented as customers or reviewers.

---

## Hero Slides (16:9 desktop · 4:5 mobile crop · face always visible)

| Filename | Aspect | Prompt |
|----------|--------|--------|
| `hero-slide-1.jpg` | 16:9 | Full-body editorial: male Indian doctor in midnight navy two-piece scrub set walking through a sunlit minimalist corridor, pale grey concrete and glass walls, face fully visible, confident stride, soft natural left light, shallow DOF. |
| `hero-slide-1-mobile.jpg` | 4:5 | Same scene cropped to 4:5, face and upper torso visible, blank chest. |
| `hero-slide-2.jpg` | 16:9 | Female Indian healthcare professional in midnight navy scrubs seated at a minimal white desk, face visible, looking slightly off-camera, natural window light, pale concrete background. |
| `hero-slide-2-mobile.jpg` | 4:5 | Same scene cropped 4:5. |
| `hero-slide-3.jpg` | 16:9 | Two Indian healthcare professionals (man and woman) in midnight navy scrubs walking together through a bright modern hospital corridor, faces visible, editorial fashion feel, natural light. |
| `hero-slide-3-mobile.jpg` | 4:5 | Same scene cropped 4:5, both faces visible. |

---

## Product Images — Midnight Navy (4:5 · light grey seamless background · no text on fabric)

| Filename | Aspect | Prompt |
|----------|--------|--------|
| `product-front.jpg` | 4:5 | Male Indian model wearing midnight navy two-piece scrub set, front-facing, light grey seamless studio background, clean editorial styling, blank chest. |
| `product-back.jpg` | 4:5 | Same model, back-facing, midnight navy scrubs, light grey seamless studio background. |
| `product-side.jpg` | 4:5 | Same model, 3/4 side profile, midnight navy scrubs, light grey seamless studio background. |
| `model-wearing.jpg` | 4:5 | Same model wearing midnight navy scrubs in a modern minimalist architectural setting with glass and concrete, lifestyle editorial. |

---

## Product Images — Sage Colourway (4:5 · light grey seamless · MOCK)

| Filename | Aspect | Prompt |
|----------|--------|--------|
| `product-front-sage.jpg` | 4:5 | Male Indian model wearing sage green (#84958C) two-piece scrub set, front-facing, light grey seamless studio background, blank chest, no logos. |
| `product-back-sage.jpg` | 4:5 | Same model, back-facing, sage green scrubs, light grey seamless background. |

---

## Product Images — Women's Fit (4:5 · light grey seamless · MOCK)

| Filename | Aspect | Prompt |
|----------|--------|--------|
| `product-front-womens.jpg` | 4:5 | Female Indian model wearing midnight navy contoured-fit scrub set, front-facing, light grey seamless studio background, blank chest, no logos. |
| `product-back-womens.jpg` | 4:5 | Same model, back-facing, midnight navy women's fit scrubs, light grey seamless background. |

---

## Detail / Macro Shots (1:1 · extreme close-up · no text)

| Filename | Aspect | Prompt |
|----------|--------|--------|
| `fabric-macro.jpg` | 1:1 | Extreme close-up macro photograph of midnight navy performance fabric weave, textile detail, no text, no logos, natural light. |
| `pocket-detail.jpg` | 1:1 | Close-up of a concealed zippered chest pocket on midnight navy scrub top, construction detail, no text, no logos. |
| `stitching-detail.jpg` | 1:1 | Close-up of bar-tack reinforced stitching at a stress point on midnight navy scrub fabric, thread detail visible. |

---

## Featured Section — Pocket Close-Up Bleed (1:1)

| Filename | Aspect | Prompt |
|----------|--------|--------|
| `pocket-closeup-bleed.jpg` | 1:1 | Dramatic editorial close-up of a concealed zippered pocket on midnight navy scrub top, partially cropped at the right edge, strong directional light, luxury fashion feel, no text. |

---

## Philosophy Editorial (3:2)

| Filename | Aspect | Prompt |
|----------|--------|--------|
| `philosophy-editorial.jpg` | 3:2 | Male and female Indian healthcare professionals in midnight navy scrubs seated in a bright minimalist architectural space, editorial portrait style, natural light, clean background, faces visible, confident expressions. |

---

## Login Page Editorial (4:5)

| Filename | Aspect | Prompt |
|----------|--------|--------|
| `login-editorial.jpg` | 4:5 | Indian healthcare professional in midnight navy scrubs standing in a minimalist architectural space with glass and concrete, confident expression, editorial fashion, natural window light. |

---

## Shift Journal — Documentary Style (3:2 or 4:5 · non-identifiable subjects)

| Filename | Aspect | Prompt |
|----------|--------|--------|
| `journal-1.jpg` | 3:2 | Documentary-style photograph in a bright clinical space, subject in midnight navy scrubs with hands on paperwork, face NOT clearly identifiable, editorial depth of field. |
| `journal-2.jpg` | 3:2 | Detail shot of medical notes and a stethoscope on a minimal white surface, documentary style, no text visible in frame. |
| `journal-3.jpg` | 3:2 | Wide shot of empty minimalist corridor in a modern hospital, atmospheric, no people, cool natural light. |

---

## ScentShift Textile Macro (3:2)

| Filename | Aspect | Prompt |
|----------|--------|--------|
| `scentshift-macro-1.jpg` | 3:2 | Abstract macro textile photography of midnight navy performance fabric weave, shallow depth of field, luxury material feel. |
| `scentshift-macro-2.jpg` | 3:2 | Extreme close-up of fabric surface with micro-texture visible, midnight navy tones, no text, no logos. |

---

## Rules Summary

- No readable text inside any image.
- No third-party logos or recognisable brand marks.
- Leave the chest area blank — overlay the VYRO SVG wordmark in HTML/CSS.
- Every image needs descriptive `alt` text, `srcset` with WebP/AVIF, and `loading="lazy"` below the fold.
- Hero images use `fetchpriority="high"` and do NOT use `loading="lazy"`.
- AI faces must **never** be presented as customers or reviewers.
- Reviews section stays an empty state at all times.
