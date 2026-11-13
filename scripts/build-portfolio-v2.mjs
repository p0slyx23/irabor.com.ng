import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const dir = new URL('docs/portfolio-v2/', root);
const assets = {
  FONT: ['docs/portfolio-v2/SpaceMono-Bold.ttf', 'font/ttf'],
  BRAND_WHITE: ['src/assets/brand/brandmark-white.svg', 'image/svg+xml'],
  BRAND_BLACK: ['src/assets/brand/brandmark-black.svg', 'image/svg+xml'],
  PRIME: ['src/assets/images/projects/primewave-cleaning-cover.webp', 'image/webp'],
  ELECTION: ['src/assets/images/projects/lgscelection-cover.webp', 'image/webp'],
  LUGSPACE: ['src/assets/images/projects/lugspace-cover.webp', 'image/webp'],
  PAYSHIP: ['src/assets/images/projects/payship-cover.webp', 'image/webp'],
  BEFORE: ['docs/portfolio-v2/evidence/current-dark-desktop.png', 'image/png'],
  BEFORE_MOBILE: ['docs/portfolio-v2/evidence/current-dark-mobile.png', 'image/png'],
};
const tokens = {};
for (const [key, [path, type]] of Object.entries(assets)) {
  tokens[key] = `data:${type};base64,${(await readFile(new URL(path, root))).toString('base64')}`;
}
function embed(html) {
  for (const [key, value] of Object.entries(tokens)) html = html.replaceAll(`{{${key}}}`, value);
  return html;
}
const prototype = embed(await readFile(new URL('prototype.template.html', dir), 'utf8'));
await writeFile(new URL('prototype.html', dir), prototype);
let report = embed(await readFile(new URL('report.template.html', dir), 'utf8'));
report = report.replace('{{PROTOTYPE_JSON}}', () => JSON.stringify(prototype).replaceAll('<', '\\u003c'));
await writeFile(new URL('index.html', dir), report);
console.log(`Built v2 report (${Math.round(Buffer.byteLength(report)/1024)} KB) and standalone prototype (${Math.round(Buffer.byteLength(prototype)/1024)} KB).`);
