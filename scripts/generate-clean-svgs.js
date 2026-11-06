const fs = require('fs');
const path = require('path');

const MOCK_DIR = path.join(__dirname, '..', 'assets', 'mock');

function wrapSvg(w, h, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="bgNavy" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#101E35"/>
      <stop offset="100%" stop-color="#182A48"/>
    </linearGradient>
    <linearGradient id="bgSage" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2D3B34"/>
      <stop offset="100%" stop-color="#3D5046"/>
    </linearGradient>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(213,217,223,0.04)" stroke-width="1"/>
    </pattern>
  </defs>
${content}
</svg>`;
}

// 1. product-front.svg (Navy, 400x500)
const productFront = wrapSvg(400, 500, `  <rect width="100%" height="100%" fill="url(#bgNavy)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="20" y="20" width="360" height="460" fill="none" stroke="rgba(213,217,223,0.12)" stroke-width="1"/>
  <!-- Front scrub top silhouette -->
  <g transform="translate(100, 60)" stroke="#F4F1E9" stroke-width="1.5" fill="rgba(244,241,233,0.03)" stroke-linejoin="round">
    <!-- Torso & Sleeves -->
    <path d="M 100 20 L 70 35 L 10 75 L 30 115 L 60 98 L 60 250 L 140 250 L 140 98 L 170 115 L 190 75 L 130 35 Z"/>
    <!-- V-neck -->
    <path d="M 80 25 L 100 65 L 120 25" fill="none" stroke="#84958C"/>
    <!-- Chest pocket outline -->
    <rect x="68" y="90" width="32" height="38" rx="2" fill="none" stroke="#84958C" stroke-width="1" stroke-dasharray="2 2"/>
    <!-- Hem side slits -->
    <line x1="60" y1="230" x2="60" y2="250" stroke="#F4F1E9" stroke-width="2"/>
    <line x1="140" y1="230" x2="140" y2="250" stroke="#F4F1E9" stroke-width="2"/>
  </g>
  <!-- Subtle brand watermark line -->
  <line x1="185" y1="440" x2="215" y2="440" stroke="#84958C" stroke-width="1.5" stroke-linecap="round"/>`);

// 2. product-back.svg (Navy, 400x500)
const productBack = wrapSvg(400, 500, `  <rect width="100%" height="100%" fill="url(#bgNavy)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="20" y="20" width="360" height="460" fill="none" stroke="rgba(213,217,223,0.12)" stroke-width="1"/>
  <!-- Back scrub top silhouette with back yoke -->
  <g transform="translate(100, 60)" stroke="#F4F1E9" stroke-width="1.5" fill="rgba(244,241,233,0.03)" stroke-linejoin="round">
    <path d="M 100 20 L 70 35 L 10 75 L 30 115 L 60 98 L 60 250 L 140 250 L 140 98 L 170 115 L 190 75 L 130 35 Z"/>
    <!-- Back crew curve -->
    <path d="M 80 25 Q 100 32 120 25" fill="none" stroke="#84958C"/>
    <!-- Tailored back yoke seam -->
    <line x1="60" y1="75" x2="140" y2="75" stroke="#84958C" stroke-width="1.2"/>
    <!-- Centre back seam -->
    <line x1="100" y1="75" x2="100" y2="250" stroke="rgba(244,241,233,0.2)" stroke-dasharray="3 3"/>
  </g>
  <line x1="185" y1="440" x2="215" y2="440" stroke="#84958C" stroke-width="1.5" stroke-linecap="round"/>`);

// 3. product-side.svg (Navy, 400x500)
const productSide = wrapSvg(400, 500, `  <rect width="100%" height="100%" fill="url(#bgNavy)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="20" y="20" width="360" height="460" fill="none" stroke="rgba(213,217,223,0.12)" stroke-width="1"/>
  <!-- Side profile scrub silhouette -->
  <g transform="translate(130, 60)" stroke="#F4F1E9" stroke-width="1.5" fill="rgba(244,241,233,0.03)" stroke-linejoin="round">
    <path d="M 60 25 C 45 40 40 70 42 120 L 45 250 L 105 245 L 100 120 C 98 60 85 30 60 25 Z"/>
    <path d="M 70 40 L 95 90 L 75 110 L 58 70" fill="none" stroke="#84958C"/>
    <line x1="72" y1="120" x2="72" y2="248" stroke="rgba(244,241,233,0.25)" stroke-dasharray="2 2"/>
  </g>
  <line x1="185" y1="440" x2="215" y2="440" stroke="#84958C" stroke-width="1.5" stroke-linecap="round"/>`);

// 4. product-front-sage.svg (Sage, 400x500)
const productFrontSage = wrapSvg(400, 500, `  <rect width="100%" height="100%" fill="url(#bgSage)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="20" y="20" width="360" height="460" fill="none" stroke="rgba(213,217,223,0.15)" stroke-width="1"/>
  <g transform="translate(100, 60)" stroke="#F4F1E9" stroke-width="1.5" fill="rgba(244,241,233,0.05)" stroke-linejoin="round">
    <path d="M 100 20 L 70 35 L 10 75 L 30 115 L 60 98 L 60 250 L 140 250 L 140 98 L 170 115 L 190 75 L 130 35 Z"/>
    <path d="M 80 25 L 100 65 L 120 25" fill="none" stroke="#D5D9DF"/>
    <rect x="68" y="90" width="32" height="38" rx="2" fill="none" stroke="#D5D9DF" stroke-width="1" stroke-dasharray="2 2"/>
  </g>
  <line x1="185" y1="440" x2="215" y2="440" stroke="#D5D9DF" stroke-width="1.5" stroke-linecap="round"/>`);

// 5. product-back-sage.svg (Sage, 400x500)
const productBackSage = wrapSvg(400, 500, `  <rect width="100%" height="100%" fill="url(#bgSage)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="20" y="20" width="360" height="460" fill="none" stroke="rgba(213,217,223,0.15)" stroke-width="1"/>
  <g transform="translate(100, 60)" stroke="#F4F1E9" stroke-width="1.5" fill="rgba(244,241,233,0.05)" stroke-linejoin="round">
    <path d="M 100 20 L 70 35 L 10 75 L 30 115 L 60 98 L 60 250 L 140 250 L 140 98 L 170 115 L 190 75 L 130 35 Z"/>
    <path d="M 80 25 Q 100 32 120 25" fill="none" stroke="#D5D9DF"/>
    <line x1="60" y1="75" x2="140" y2="75" stroke="#D5D9DF" stroke-width="1.2"/>
  </g>
  <line x1="185" y1="440" x2="215" y2="440" stroke="#D5D9DF" stroke-width="1.5" stroke-linecap="round"/>`);

// 6. product-front-womens.svg (Navy contoured, 400x500)
const productFrontWomens = wrapSvg(400, 500, `  <rect width="100%" height="100%" fill="url(#bgNavy)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="20" y="20" width="360" height="460" fill="none" stroke="rgba(213,217,223,0.12)" stroke-width="1"/>
  <!-- Contoured women's scrub top -->
  <g transform="translate(100, 60)" stroke="#F4F1E9" stroke-width="1.5" fill="rgba(244,241,233,0.03)" stroke-linejoin="round">
    <path d="M 100 20 L 74 35 L 16 72 L 34 110 L 62 95 Q 66 160 58 200 L 56 250 L 144 250 L 142 200 Q 134 160 138 95 L 166 110 L 184 72 L 126 35 Z"/>
    <path d="M 82 24 L 100 68 L 118 24" fill="none" stroke="#84958C"/>
    <!-- Princess darts -->
    <path d="M 76 98 Q 78 160 74 250" fill="none" stroke="rgba(244,241,233,0.2)" stroke-dasharray="3 3"/>
    <path d="M 124 98 Q 122 160 126 250" fill="none" stroke="rgba(244,241,233,0.2)" stroke-dasharray="3 3"/>
  </g>
  <line x1="185" y1="440" x2="215" y2="440" stroke="#84958C" stroke-width="1.5" stroke-linecap="round"/>`);

// 7. product-back-womens.svg (Navy, 400x500)
const productBackWomens = wrapSvg(400, 500, `  <rect width="100%" height="100%" fill="url(#bgNavy)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="20" y="20" width="360" height="460" fill="none" stroke="rgba(213,217,223,0.12)" stroke-width="1"/>
  <g transform="translate(100, 60)" stroke="#F4F1E9" stroke-width="1.5" fill="rgba(244,241,233,0.03)" stroke-linejoin="round">
    <path d="M 100 20 L 74 35 L 16 72 L 34 110 L 62 95 Q 66 160 58 200 L 56 250 L 144 250 L 142 200 Q 134 160 138 95 L 166 110 L 184 72 L 126 35 Z"/>
    <path d="M 82 24 Q 100 30 118 24" fill="none" stroke="#84958C"/>
    <line x1="62" y1="75" x2="138" y2="75" stroke="#84958C" stroke-width="1.2"/>
  </g>
  <line x1="185" y1="440" x2="215" y2="440" stroke="#84958C" stroke-width="1.5" stroke-linecap="round"/>`);

// 8. model-wearing.svg (Navy, 400x500)
const modelWearing = wrapSvg(400, 500, `  <rect width="100%" height="100%" fill="url(#bgNavy)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="20" y="20" width="360" height="460" fill="none" stroke="rgba(213,217,223,0.12)" stroke-width="1"/>
  <!-- Minimalist clinical architectural silhouette -->
  <g stroke="#F4F1E9" stroke-width="1" fill="none" opacity="0.6">
    <line x1="80" y1="40" x2="80" y2="460" stroke-width="1"/>
    <line x1="80" y1="120" x2="340" y2="120" stroke-width="0.75" stroke-dasharray="4 4"/>
    <line x1="80" y1="260" x2="340" y2="260" stroke-width="0.75" stroke-dasharray="4 4"/>
    <!-- Clinician silhouette -->
    <circle cx="210" cy="140" r="26" stroke="#F4F1E9" stroke-width="1.5"/>
    <path d="M 170 210 Q 210 180 250 210 L 255 380 L 165 380 Z" stroke="#F4F1E9" stroke-width="1.5"/>
    <path d="M 185 210 L 210 240 L 235 210" stroke="#84958C" stroke-width="1.5"/>
  </g>
  <line x1="185" y1="440" x2="215" y2="440" stroke="#84958C" stroke-width="1.5" stroke-linecap="round"/>`);

// 9. fabric-macro.svg (Navy, 400x400)
const fabricMacro = wrapSvg(400, 400, `  <rect width="100%" height="100%" fill="url(#bgNavy)"/>
  <!-- Micro-weave matrix -->
  <g stroke="rgba(244,241,233,0.15)" stroke-width="1">
    ${Array.from({length: 16}).map((_, i) => `<line x1="${i*25}" y1="0" x2="${i*25}" y2="400"/>`).join('\n    ')}
    ${Array.from({length: 16}).map((_, i) => `<line x1="0" y1="${i*25}" x2="400" y2="${i*25}"/>`).join('\n    ')}
  </g>
  <!-- Interlaced mechanical stretch yarn paths -->
  <g stroke="#84958C" stroke-width="2" fill="none" opacity="0.65">
    <path d="M 50 150 Q 100 130 150 150 T 250 150 T 350 150"/>
    <path d="M 50 200 Q 100 220 150 200 T 250 200 T 350 200"/>
    <path d="M 50 250 Q 100 230 150 250 T 250 250 T 350 250"/>
  </g>
  <circle cx="200" cy="200" r="90" fill="none" stroke="#F4F1E9" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.5"/>
  <circle cx="200" cy="200" r="4" fill="#F4F1E9"/>`);

// 10. pocket-detail.svg (Navy, 400x400)
const pocketDetail = wrapSvg(400, 400, `  <rect width="100%" height="100%" fill="url(#bgNavy)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="20" y="20" width="360" height="360" fill="none" stroke="rgba(213,217,223,0.15)" stroke-width="1"/>
  <!-- Concealed zippered pocket construction -->
  <g transform="translate(80, 70)" stroke="#F4F1E9" stroke-width="1.5" fill="none">
    <!-- Pocket outer welt -->
    <rect x="20" y="30" width="200" height="200" rx="4" fill="rgba(244,241,233,0.03)" stroke="#84958C"/>
    <!-- Concealed zipper track -->
    <line x1="40" y1="70" x2="200" y2="70" stroke="#F4F1E9" stroke-width="2"/>
    <line x1="40" y1="74" x2="200" y2="74" stroke="#84958C" stroke-dasharray="3 3"/>
    <!-- Pull tab -->
    <rect x="60" y="65" width="16" height="12" rx="2" fill="#101E35" stroke="#F4F1E9" stroke-width="1.5"/>
    <!-- Reinforced bar-tacks -->
    <line x1="38" y1="64" x2="38" y2="80" stroke="#84958C" stroke-width="3"/>
    <line x1="202" y1="64" x2="202" y2="80" stroke="#84958C" stroke-width="3"/>
    <!-- Pen slot divider -->
    <line x1="90" y1="75" x2="90" y2="230" stroke="rgba(244,241,233,0.2)" stroke-dasharray="3 3"/>
  </g>`);

// 11. stitching-detail.svg (Navy, 400x400)
const stitchingDetail = wrapSvg(400, 400, `  <rect width="100%" height="100%" fill="url(#bgNavy)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="20" y="20" width="360" height="360" fill="none" stroke="rgba(213,217,223,0.15)" stroke-width="1"/>
  <!-- Flatlock double needle stitching -->
  <g transform="translate(50, 80)" stroke="#F4F1E9" stroke-width="1.5" fill="none">
    <line x1="0" y1="80" x2="300" y2="80" stroke="#84958C" stroke-width="1.5"/>
    <line x1="0" y1="92" x2="300" y2="92" stroke="#84958C" stroke-width="1.5"/>
    <!-- Cross threads -->
    ${Array.from({length: 25}).map((_, i) => `<line x1="${i*12}" y1="80" x2="${i*12+8}" y2="92" stroke="#F4F1E9" stroke-width="1"/>`).join('\n    ')}
    <!-- Bar tack reinforcement -->
    <rect x="130" y="60" width="40" height="52" fill="none" stroke="#F4F1E9" stroke-width="1" stroke-dasharray="2 2"/>
    <line x1="150" y1="65" x2="150" y2="107" stroke="#84958C" stroke-width="4"/>
  </g>`);

// 12. journal-1.svg, journal-2.svg, journal-3.svg (600x400)
function journalSvg(index) {
  return wrapSvg(600, 400, `  <rect width="100%" height="100%" fill="url(#bgNavy)"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect x="20" y="20" width="560" height="360" fill="none" stroke="rgba(213,217,223,0.12)" stroke-width="1"/>
  <!-- Editorial layout framing -->
  <g stroke="#84958C" stroke-width="1" fill="none" opacity="0.6">
    <line x1="60" y1="60" x2="540" y2="60"/>
    <line x1="60" y1="340" x2="540" y2="340"/>
    <circle cx="300" cy="200" r="${40 + index * 15}" stroke="#F4F1E9" stroke-width="1.5" opacity="0.4"/>
    <rect x="${200 - index * 10}" y="120" width="${200 + index * 20}" height="160" fill="rgba(244,241,233,0.02)" stroke="#84958C"/>
  </g>
  <line x1="285" y1="365" x2="315" y2="365" stroke="#84958C" stroke-width="1.5" stroke-linecap="round"/>`);
}

// 13. scentshift-macro-1.svg, scentshift-macro-2.svg (600x400)
function scentshiftSvg(num) {
  return wrapSvg(600, 400, `  <rect width="100%" height="100%" fill="url(#bgNavy)"/>
  <!-- Textile science micro-capsule visualization -->
  <g stroke="rgba(244,241,233,0.1)" stroke-width="1">
    ${Array.from({length: 12}).map((_, i) => `<line x1="${i*50}" y1="0" x2="${i*50}" y2="400"/>`).join('\n    ')}
    ${Array.from({length: 8}).map((_, i) => `<line x1="0" y1="${i*50}" x2="600" y2="${i*50}"/>`).join('\n    ')}
  </g>
  <g fill="rgba(132,149,140,0.12)" stroke="#84958C" stroke-width="1.5">
    <circle cx="220" cy="180" r="${35 + num * 5}"/>
    <circle cx="360" cy="210" r="${28 + num * 6}"/>
    <circle cx="280" cy="270" r="${22 + num * 4}"/>
    <circle cx="160" cy="250" r="18"/>
    <circle cx="430" cy="160" r="24"/>
  </g>
  <line x1="285" y1="365" x2="315" y2="365" stroke="#84958C" stroke-width="1.5" stroke-linecap="round"/>`);
}

// Write all SVGs
const files = {
  'product-front.svg': productFront,
  'product-back.svg': productBack,
  'product-side.svg': productSide,
  'product-front-sage.svg': productFrontSage,
  'product-back-sage.svg': productBackSage,
  'product-front-womens.svg': productFrontWomens,
  'product-back-womens.svg': productBackWomens,
  'model-wearing.svg': modelWearing,
  'fabric-macro.svg': fabricMacro,
  'pocket-detail.svg': pocketDetail,
  'stitching-detail.svg': stitchingDetail,
  'journal-1.svg': journalSvg(1),
  'journal-2.svg': journalSvg(2),
  'journal-3.svg': journalSvg(3),
  'scentshift-macro-1.svg': scentshiftSvg(1),
  'scentshift-macro-2.svg': scentshiftSvg(2),
  'login-editorial.svg': modelWearing
};

Object.entries(files).forEach(([name, content]) => {
  fs.writeFileSync(path.join(MOCK_DIR, name), content.trim() + '\n', 'utf8');
  console.log(`Generated clean SVG: ${name}`);
});

console.log('All mock SVGs successfully regenerated with zero baked-in text.');
