import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pages = [
  'index.html',
  'en/index.html',
  'it/index.html',
  'en/business/index.html',
  'it/business/index.html',
  'en/healthcare/index.html',
  'it/sanità/index.html',
  'en/ngo/index.html',
  'it/ngo/index.html',
  'en/privacy/index.html',
  'it/privacy/index.html',
];
const errors = [];

for (const page of pages) {
  const absolutePage = path.join(root, page);
  const html = fs.readFileSync(absolutePage, 'utf8');
  const pageDirectory = path.dirname(absolutePage);

  if (!/<meta name="viewport"/i.test(html)) errors.push(`${page}: viewport metadata missing`);
  if (!/<link rel="canonical"/i.test(html)) errors.push(`${page}: canonical URL missing`);
  if (!/hreflang="x-default"/i.test(html)) errors.push(`${page}: x-default hreflang missing`);

  for (const match of html.matchAll(/(?:src|href|poster)="([^"#?]+)"/g)) {
    const reference = decodeURIComponent(match[1]);
    if (/^(?:https?:|mailto:|tel:|data:)/i.test(reference)) continue;
    let target = reference.startsWith('/')
      ? path.join(root, reference)
      : path.resolve(pageDirectory, reference);
    if (reference.endsWith('/')) target = path.join(target, 'index.html');
    if (!fs.existsSync(target)) errors.push(`${page}: missing local resource ${match[1]}`);
  }

  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
    if (!/rel="[^"]*noopener/i.test(match[0])) errors.push(`${page}: target=_blank link lacks noopener`);
  }

  const labels = new Set([...html.matchAll(/<label\b[^>]*for="([^"]+)"/gi)].map((match) => match[1]));
  for (const match of html.matchAll(/<(?:input|textarea|select)\b[^>]*id="([^"]+)"[^>]*>/gi)) {
    if (!labels.has(match[1])) errors.push(`${page}: #${match[1]} has no associated label`);
  }

  if (!page.includes('/privacy/') && page !== 'index.html') {
    if (!/class="skip-link"/i.test(html)) errors.push(`${page}: skip link missing`);
    if (!/<main\b[^>]*id="main-content"/i.test(html)) errors.push(`${page}: main landmark missing`);
    if (/\.(?:gif)"/i.test(html)) errors.push(`${page}: legacy GIF still referenced`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${pages.length} public pages.`);
