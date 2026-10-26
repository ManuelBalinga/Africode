// Builds the website into dist/. Vercel runs this on every deploy (see vercel.json).
//
//   index.html  is the ONE file you edit. It holds the English page and every
//               English + French string (the I18N table).
//   dist/       is what visitors get:
//                 /     the English page
//                 /fr   a real French page, generated from index.html with the
//                       French text written into the HTML itself
//               plus the small files search engines need. Nothing else in the
//               repository is ever published.
//
// Run it yourself with:  node scripts/build.mjs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const SITE = 'https://africodestudios.com';
const URL_OF = { en: `${SITE}/`, fr: `${SITE}/fr` };

// Files copied into dist untouched.
const ASSETS = ['og.jpg', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'llms.txt'];

const FR_DESCRIPTION =
  'Studio de conception et de développement web basé à Accra, au Ghana, qui crée des sites web, des boutiques en ligne et des applications web pour des clients du monde entier. Bilingue français et anglais.';

const source = readFileSync(join(root, 'index.html'), 'utf8').replace(/\r\n/g, '\n');

/* ---------- helpers ---------- */

function replaceOnce(html, from, to, label) {
  const parts = html.split(from);
  if (parts.length !== 2) throw new Error(`Expected exactly one "${label}" in index.html, found ${parts.length - 1}`);
  return parts[0] + to + parts[1];
}

const escAttr = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// The I18N table in index.html is a plain object literal; read it straight from the source.
function readI18N(html) {
  const start = html.indexOf('var I18N={');
  if (start < 0) throw new Error('I18N table not found in index.html');
  const open = html.indexOf('{', start);
  const end = html.indexOf('\n};', open);
  if (end < 0) throw new Error('End of I18N table not found');
  return new Function('return ' + html.slice(open, end + 2))();
}

// Index of the closing tag that matches an element whose content starts at `from`.
function findClose(html, tag, from) {
  const re = new RegExp(`<${tag}\\b|</${tag}\\s*>`, 'gi');
  re.lastIndex = from;
  let depth = 1;
  let m;
  while ((m = re.exec(html))) {
    if (m[0][1] === '/') {
      if (--depth === 0) return m.index;
    } else {
      depth++;
    }
  }
  throw new Error(`Unclosed <${tag}> after position ${from}`);
}

// Write the French strings into every element marked data-i18n="key", the same
// thing the in-page script does at runtime, but done here so search engines
// receive French text without having to run any JavaScript.
function translate(html, I18N, lang, missing) {
  const re = /<([a-zA-Z][\w-]*)\b([^>]*?)\sdata-i18n="([^"]+)"([^>]*)>/g;
  let out = '';
  let cursor = 0;
  let m;
  while ((m = re.exec(html))) {
    if (m.index < cursor) continue;
    const entry = I18N[m[3]];
    if (!entry || entry[lang] == null) {
      missing.add(m[3]);
      continue;
    }
    const text = entry[lang];
    const attrName = (m[0].match(/\sdata-i18n-attr="([^"]+)"/) || [])[1];
    if (attrName) {
      const tag = m[0].replace(new RegExp(`(\\s${attrName}=")[^"]*"`), (_, a) => a + escAttr(text) + '"');
      out += html.slice(cursor, m.index) + tag;
      cursor = m.index + m[0].length;
    } else {
      const innerStart = m.index + m[0].length;
      const closeAt = findClose(html, m[1], innerStart);
      out += html.slice(cursor, innerStart) + text;
      cursor = closeAt;
      re.lastIndex = closeAt;
    }
  }
  return out + html.slice(cursor);
}

function editJsonLd(html, edit) {
  return html.replace(/<script type="application\/ld\+json">\n([\s\S]*?)\n<\/script>/g, (all, body) => {
    const data = edit(JSON.parse(body));
    return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
  });
}

/* ---------- one page per language ---------- */

function buildPage(lang, I18N, missing) {
  let html = source;

  // 1. Each language has its own address, so the EN / FR switch becomes two real links.
  html = html.replace(
    /<button id="lang-en"[^>]*>EN<\/button>\s*<button id="lang-fr"[^>]*>FR<\/button>/,
    `<a id="lang-en" class="${lang === 'en' ? 'on' : ''}" href="/" hreflang="en" lang="en">EN</a>\n          ` +
      `<a id="lang-fr" class="${lang === 'fr' ? 'on' : ''}" href="/fr" hreflang="fr" lang="fr">FR</a>`
  );
  if (!html.includes('id="lang-fr" class=')) throw new Error('Language switch markup not found');
  html = html.replace(/\.lang button/g, '.lang :is(button,a)');

  // 2. The page shows the language of its own address instead of guessing from the browser.
  html = replaceOnce(
    html,
    `var sl=get(K.lang);
if(sl!=='en'&&sl!=='fr'){
  var nl=(navigator.languages&&navigator.languages[0])||navigator.language||'en';
  sl=/^fr\\b/i.test(nl)?'fr':'en';
}`,
    `var sl=document.documentElement.lang==='fr'?'fr':'en';`,
    'language start-up block'
  );

  // 3. Canonical address, social address and the "other language" links for search engines.
  const canonical = `<link rel="canonical" href="${SITE}/">`;
  html = replaceOnce(
    html,
    canonical,
    `<link rel="canonical" href="${URL_OF[lang]}">\n` +
      `<link rel="alternate" hreflang="en" href="${URL_OF.en}">\n` +
      `<link rel="alternate" hreflang="fr" href="${URL_OF.fr}">\n` +
      `<link rel="alternate" hreflang="x-default" href="${URL_OF.en}">`,
    'canonical link'
  );
  html = replaceOnce(html, `<meta property="og:url" content="${SITE}/">`, `<meta property="og:url" content="${URL_OF[lang]}">`, 'og:url');

  if (lang === 'fr') {
    html = replaceOnce(html, '<html lang="en">', '<html lang="fr">', 'html lang');
    html = translate(html, I18N, 'fr', missing);
    html = replaceOnce(html, '<meta property="og:locale" content="en_GB">', '<meta property="og:locale" content="fr_FR">', 'og:locale');
    html = replaceOnce(html, '<meta property="og:locale:alternate" content="fr_FR">', '<meta property="og:locale:alternate" content="en_GB">', 'og:locale:alternate');
    html = editJsonLd(html, (data) => {
      if (data['@type'] === 'ProfessionalService') data.description = FR_DESCRIPTION;
      if (data['@type'] === 'FAQPage') {
        data.mainEntity = data.mainEntity.map((q, i) => ({
          ...q,
          name: I18N[`faq.q${i + 1}`].fr,
          acceptedAnswer: { ...q.acceptedAnswer, text: I18N[`faq.a${i + 1}`].fr },
        }));
      }
      return data;
    });
  }
  return html;
}

/* ---------- build ---------- */

const I18N = readI18N(source);
const missing = new Set();

// Empty dist/ rather than deleting the folder itself, so the build also works
// while a local preview server (or Windows) is holding the folder open.
mkdirSync(dist, { recursive: true });
for (const entry of readdirSync(dist)) rmSync(join(dist, entry), { recursive: true, force: true });
mkdirSync(join(dist, 'fr'), { recursive: true });

writeFileSync(join(dist, 'index.html'), buildPage('en', I18N, missing));
writeFileSync(join(dist, 'fr', 'index.html'), buildPage('fr', I18N, missing));

for (const file of ASSETS) {
  if (!existsSync(join(root, file))) throw new Error(`Missing file: ${file}`);
  copyFileSync(join(root, file), join(dist, file));
}

if (missing.size) console.warn(`Note: no French text for ${missing.size} key(s): ${[...missing].join(', ')}`);
console.log(`Built dist/: index.html (en), fr/index.html (fr), ${ASSETS.length} static files.`);
