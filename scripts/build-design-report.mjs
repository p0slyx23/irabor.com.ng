import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
let html = await readFile(new URL('docs/portfolio-design-report.template.html', root), 'utf8');
for (const name of ['primewave-cleaning', 'lgscelection', 'lugspace']) {
  const image = await readFile(new URL(`src/assets/images/projects/${name}-cover.webp`, root));
  html = html.replaceAll(`{{${name}}}`, `data:image/webp;base64,${image.toString('base64')}`);
}
const output = new URL('docs/portfolio-design-report.html', root);
await writeFile(output, html);
console.log(`Built self-contained report: ${fileURLToPath(output)} (${Math.round(Buffer.byteLength(html) / 1024)} KB)`);
