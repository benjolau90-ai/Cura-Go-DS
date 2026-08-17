import { readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const CSS_PATH = resolve(__dir, '../src/renderer/style.css');
const OUT_PATH = resolve(__dir, '../components-manifest.json');

const css = readFileSync(CSS_PATH, 'utf8');

// Parst einen @component-Block in ein Objekt
function parseAnnotation(block) {
  const get = (key) => {
    const match = block.match(new RegExp(`\\*[ \\t]*${key}:[ \\t]*(.+)?`));
    const val = match ? (match[1] ?? '').trim() : '';
    return val === '*/' ? '' : val;
  };

  const getList = (key) =>
    get(key).split(',').map(s => s.trim()).filter(Boolean);

  // figmaProps: mehrzeilig, eingerückt mit *   Key: val
  const propsMatch = [...block.matchAll(/\*\s{3}(\w+):\s*(.+)/g)];
  const figmaProps = {};
  for (const [, key, val] of propsMatch) {
    figmaProps[key] = val.trim().split('|').map(s => s.trim());
  }

  return {
    name:       get('name'),
    selector:   get('selector'),
    variants:   getList('variants'),
    states:     getList('states'),
    figmaProps,
    tokens:     getList('tokens'),
    figmaId:    get('figmaId') || null,
  };
}

// Extrahiert den CSS-Block ab einem Selector bis zum nächsten @component
function extractCssBlock(css, startIndex) {
  const nextAnnotation = css.indexOf('/* @component', startIndex + 1);
  const end = nextAnnotation === -1 ? css.length : nextAnnotation;
  return css.slice(startIndex, end).trim();
}

function hash(str) {
  return createHash('sha256').update(str).digest('hex').slice(0, 12);
}

// Alle @component-Blöcke finden
const annotationRegex = /\/\* @component([\s\S]*?)\*\//g;
const components = {};
let match;

while ((match = annotationRegex.exec(css)) !== null) {
  const annotation = parseAnnotation(match[0]);
  if (!annotation.name) continue;

  const cssBlock = extractCssBlock(css, match.index);
  const cssHash = hash(cssBlock);

  // Vorherigen figmaId aus existierendem Manifest übernehmen
  let existingFigmaId = annotation.figmaId;
  try {
    const existing = JSON.parse(readFileSync(OUT_PATH, 'utf8'));
    const saved = existing[annotation.name]?.figmaId;
    if (saved && saved !== '*/') existingFigmaId = saved;
  } catch {}

  components[annotation.name] = {
    ...annotation,
    figmaId: existingFigmaId,
    hash: cssHash,
    updatedAt: new Date().toISOString(),
  };
}

writeFileSync(OUT_PATH, JSON.stringify(components, null, 2));

console.log(`✓ ${Object.keys(components).length} Komponenten gefunden:`);
for (const [name, c] of Object.entries(components)) {
  console.log(`  ${name} (${c.variants.length} Variants, hash: ${c.hash})`);
}
console.log(`\n→ ${OUT_PATH}`);
