// Captures website preview screenshots for the "Active Deployments" section
// via the microlink API and stores them locally under public/images/previews.
// Run: node scripts/gen-previews.js
const fs = require('fs');
const path = require('path');
const https = require('https');

const sites = [
  { key: 'hrfinance', url: 'https://hrfinance.com.au' },
  { key: 'taxbud', url: 'https://taxbud.com.au' },
  // finvue omitted: its root redirects bots to a Google login, so it can't be
  // auto-captured. public/images/previews/finvue.webp is a manual screenshot.
  { key: 'asrinteriors', url: 'https://www.asrinteriors.com.au/' },
  { key: 'itbyom', url: 'https://itbeyourownmind.com' },
  { key: 'primelendingexperts', url: 'https://primelendingexperts.com.au' },
];

const outDir = path.join(__dirname, '..', 'public', 'images', 'previews');
fs.mkdirSync(outDir, { recursive: true });

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'netriq-preview-bot' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(get(res.headers.location));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
      })
      .on('error', reject);
  });
}

async function capture({ key, url }) {
  const api = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&viewport.width=1280&viewport.height=800&type=png`;
  const res = await get(api);
  let json;
  try {
    json = JSON.parse(res.body.toString());
  } catch (e) {
    return { key, ok: false, reason: 'bad json' };
  }
  const shot = json.data && json.data.screenshot && json.data.screenshot.url;
  if (!shot) return { key, ok: false, reason: json.status || 'no url' };
  const img = await get(shot);
  if (img.status !== 200 || !img.body.length) return { key, ok: false, reason: 'download ' + img.status };
  const file = path.join(outDir, `${key}.png`);
  fs.writeFileSync(file, img.body);
  return { key, ok: true, bytes: img.body.length, type: img.headers['content-type'] };
}

(async () => {
  for (const site of sites) {
    try {
      const r = await capture(site);
      console.log(r.ok ? `✓ ${r.key}  ${r.bytes}b  ${r.type}` : `✗ ${r.key}  (${r.reason})`);
    } catch (e) {
      console.log(`✗ ${site.key}  (${e.message})`);
    }
  }
})();
