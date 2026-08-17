import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const MANIFEST     = resolve(__dir, '../components-manifest.json');
const LAST_SYNC    = resolve(__dir, '../components-manifest.last-sync.json');

function load(path) {
  if (!existsSync(path)) return {};
  return JSON.parse(readFileSync(path, 'utf8'));
}

const current  = load(MANIFEST);
const lastSync = load(LAST_SYNC);

const allNames = new Set([...Object.keys(current), ...Object.keys(lastSync)]);

const added    = [];
const changed  = [];
const removed  = [];
const unchanged = [];

for (const name of allNames) {
  const cur  = current[name];
  const prev = lastSync[name];

  if (!prev)            { added.push(name); continue; }
  if (!cur)             { removed.push(name); continue; }
  if (cur.hash !== prev.hash) {
    const diff = buildDiff(prev, cur);
    changed.push({ name, diff });
  } else {
    unchanged.push(name);
  }
}

function buildDiff(prev, cur) {
  const changes = [];

  if (prev.variants.join() !== cur.variants.join())
    changes.push(`variants: [${prev.variants}] → [${cur.variants}]`);

  if (prev.states.join() !== cur.states.join())
    changes.push(`states: [${prev.states}] → [${cur.states}]`);

  const prevProps = JSON.stringify(prev.figmaProps);
  const curProps  = JSON.stringify(cur.figmaProps);
  if (prevProps !== curProps)
    changes.push(`figmaProps geändert`);

  if (prev.tokens.join() !== cur.tokens.join())
    changes.push(`tokens: [${prev.tokens}] → [${cur.tokens}]`);

  if (!changes.length) changes.push('CSS-Inhalt geändert (kein struktureller Unterschied)');
  return changes;
}

// Output
const hasChanges = added.length || changed.length || removed.length;

if (!hasChanges) {
  console.log('✓ Keine Änderungen seit letztem Figma-Sync.');
  process.exit(0);
}

console.log('── Component Changes ──────────────────────────');

if (added.length) {
  console.log(`\n🆕 Neu (${added.length}):`);
  added.forEach(n => console.log(`   + ${n}`));
}

if (changed.length) {
  console.log(`\n✏️  Geändert (${changed.length}):`);
  changed.forEach(({ name, diff }) => {
    console.log(`   ~ ${name}`);
    diff.forEach(d => console.log(`       ${d}`));
  });
}

if (removed.length) {
  console.log(`\n🗑  Entfernt (${removed.length}):`);
  removed.forEach(n => console.log(`   - ${n}`));
}

if (unchanged.length) {
  console.log(`\n─ Unverändert: ${unchanged.join(', ')}`);
}

console.log('\n───────────────────────────────────────────────');
console.log('→ Führe "npm run sync:figma" aus um Figma zu aktualisieren.');

// Strukturierten Output für CI/Scripts speichern
const report = { added, changed: changed.map(c => c.name), removed, unchanged };
writeFileSync(
  resolve(__dir, '../components-changes.json'),
  JSON.stringify(report, null, 2)
);
