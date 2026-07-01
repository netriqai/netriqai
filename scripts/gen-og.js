// Generates public/og-image.png — the social/AI share card.
// Focused on service pillars; intentionally no pricing or quantified stats.
const sharp = require('sharp');
const path = require('path');

const W = 1200, H = 630;
const teal = '#069494';

// Service pillars, laid out in two columns (no width math needed — left-aligned).
const colA = ['Website Development', 'AI Automations', 'Sales & Support Automation'];
const colB = ['Business Process Automation', 'AI Team Training', 'Measurable ROI'];

function serviceRows(items, x) {
  const startY = 372;
  const gap = 58;
  return items
    .map((label, i) => {
      const y = startY + i * gap;
      const safe = label.replace(/&/g, '&amp;');
      return `
    <rect x="${x}" y="${y - 15}" width="14" height="14" rx="4" fill="${teal}"/>
    <text x="${x + 30}" y="${y}" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="600" fill="#e6eaec">${safe}</text>`;
    })
    .join('');
}

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#0f1518"/>
    </linearGradient>
    <radialGradient id="glow" cx="80%" cy="15%" r="60%">
      <stop offset="0%" stop-color="${teal}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${teal}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- accent bar -->
  <rect x="80" y="120" width="64" height="6" rx="3" fill="${teal}"/>

  <!-- wordmark -->
  <text x="80" y="108" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="800" letter-spacing="6" fill="#f0f0f0">NETRIQ <tspan fill="${teal}">AI</tspan></text>

  <!-- headline -->
  <text x="80" y="230" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="800" fill="#f5f5f5">AI Automation &amp; Web</text>
  <text x="80" y="308" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="800" fill="#f5f5f5">Solutions for <tspan fill="${teal}">SMBs</tspan></text>

  <!-- service pillars -->
  ${serviceRows(colA, 80)}
  ${serviceRows(colB, 620)}

  <!-- footer -->
  <text x="80" y="575" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="600" letter-spacing="1" fill="#7d878c">netriqai.com.au</text>
  <text x="${W - 80}" y="575" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="600" letter-spacing="1" fill="#7d878c">Melbourne, Australia</text>
</svg>`;

const out = path.join(__dirname, '..', 'public', 'og-image.png');
sharp(Buffer.from(svg))
  .png()
  .toFile(out)
  .then(info => console.log('Wrote', out, info.width + 'x' + info.height, info.size + ' bytes'))
  .catch(err => { console.error(err); process.exit(1); });
