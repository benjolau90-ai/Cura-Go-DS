const REPO_RAW = 'https://raw.githubusercontent.com/benjolau90-ai/Cura-Go-DS/main';
const STORAGE_KEY = 'cura-ds-last-sync';

figma.showUI(__html__, { width: 400, height: 560, title: 'Cura DS Sync' });

// ── Nachrichten vom UI empfangen ──────────────────────────────────────────────
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'fetch-manifest')  await handleFetch();
  if (msg.type === 'apply-sync')      await handleApply(msg.changes);
  if (msg.type === 'close')           figma.closePlugin();
};

// ── Manifest + letzten Sync-Stand laden, Diff berechnen ──────────────────────
async function handleFetch() {
  try {
    const [manifestRes, tokensRes] = await Promise.all([
      fetch(`${REPO_RAW}/components-manifest.json`),
      fetch(`${REPO_RAW}/src/renderer/tokens.css`),
    ]);

    if (!manifestRes.ok) throw new Error(`Manifest: ${manifestRes.status}`);
    if (!tokensRes.ok)   throw new Error(`Tokens: ${tokensRes.status}`);

    const manifest   = await manifestRes.json();
    const tokensCss  = await tokensRes.text();
    const lastSync   = JSON.parse(await figma.clientStorage.getAsync(STORAGE_KEY) || '{}');

    const diff = computeDiff(manifest, lastSync);

    figma.ui.postMessage({ type: 'manifest-loaded', manifest, tokensCss, diff });
  } catch (err) {
    figma.ui.postMessage({ type: 'error', message: err.message });
  }
}

// ── Sync anwenden ─────────────────────────────────────────────────────────────
async function handleApply({ manifest, tokensCss, toSync }) {
  const results = { tokens: null, components: [] };

  // 1. Tokens → Figma Variables
  try {
    results.tokens = await syncTokens(tokensCss);
  } catch (err) {
    results.tokens = { error: err.message };
  }

  // 2. Komponenten aktualisieren
  for (const name of toSync) {
    const meta = manifest[name];
    if (!meta) continue;
    try {
      const result = await syncComponent(name, meta);
      results.components.push({ name, ...result });
    } catch (err) {
      results.components.push({ name, error: err.message });
    }
  }

  // Letzten Sync-Stand speichern
  const syncRecord = {};
  for (const [k, v] of Object.entries(manifest)) {
    syncRecord[k] = { hash: v.hash, figmaId: v.figmaId };
  }
  await figma.clientStorage.setAsync(STORAGE_KEY, JSON.stringify(syncRecord));

  figma.ui.postMessage({ type: 'sync-done', results });
}

// ── Token-Parser: CSS Custom Properties → Figma Variables ────────────────────
async function syncTokens(css) {
  const vars = parseTokensCss(css);

  // Collections nach Präfix gruppieren: color, spacing, radius, typography, shadow
  const groups = groupTokens(vars);
  const created = [], updated = [], skipped = [];

  for (const [collName, tokens] of Object.entries(groups)) {
    let collection = figma.variables
      .getLocalVariableCollections()
      .find(c => c.name === collName);

    if (!collection) {
      collection = figma.variables.createVariableCollection(collName);
      // Light/Dark Modes für Color-Collection
      if (collName === 'color') {
        collection.renameMode(collection.modes[0].modeId, 'Light');
        collection.addMode('Dark');
      }
    }

    const lightModeId = collection.modes[0].modeId;

    for (const [varName, value] of Object.entries(tokens)) {
      const figmaName = cssVarToFigmaName(varName);

      let variable = figma.variables
        .getLocalVariables()
        .find(v => v.variableCollectionId === collection.id && v.name === figmaName);

      const resolvedValue = resolveValue(value, vars);
      if (resolvedValue === null) { skipped.push(varName); continue; }

      if (!variable) {
        variable = figma.variables.createVariable(figmaName, collection, resolvedValue.type);
        created.push(varName);
      } else {
        updated.push(varName);
      }

      variable.setValueForMode(lightModeId, resolvedValue.value);
    }
  }

  return { created: created.length, updated: updated.length, skipped: skipped.length };
}

function parseTokensCss(css) {
  const vars = {};
  // Nur die :root { } und [data-theme="dark"] Blöcke
  const rootBlock = css.match(/:root\s*\{([^}]+)\}/s)?.[1] ?? '';
  for (const match of rootBlock.matchAll(/--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g)) {
    vars[`--${match[1]}`] = match[2].trim();
  }
  return vars;
}

function groupTokens(vars) {
  const groups = { color: {}, spacing: {}, radius: {}, typography: {}, shadow: {}, other: {} };
  for (const [name, value] of Object.entries(vars)) {
    if (name.startsWith('--color-') || name.startsWith('--text-') || name.startsWith('--border-'))
      groups.color[name] = value;
    else if (name.startsWith('--spacing-') || name.startsWith('--space-'))
      groups.spacing[name] = value;
    else if (name.startsWith('--radius-'))
      groups.radius[name] = value;
    else if (name.startsWith('--type-') || name.startsWith('--font-') || name.startsWith('--letter-'))
      groups.typography[name] = value;
    else if (name.startsWith('--shadow-'))
      groups.shadow[name] = value;
    else
      groups.other[name] = value;
  }
  // Leere Gruppen entfernen
  return Object.fromEntries(Object.entries(groups).filter(([, v]) => Object.keys(v).length > 0));
}

function cssVarToFigmaName(cssVar) {
  // --color-text-primary → color/text/primary
  return cssVar.replace(/^--/, '').replace(/-/g, '/');
}

function resolveValue(raw, vars) {
  // var(--other) Referenz auflösen
  const varRef = raw.match(/^var\(--([a-zA-Z0-9-]+)\)/);
  if (varRef) {
    const ref = vars[`--${varRef[1]}`];
    if (!ref) return null;
    return resolveValue(ref, vars);
  }

  // Farbe (hex, rgb, hsl)
  if (/^#[0-9a-fA-F]{3,8}$/.test(raw)) {
    return { type: 'COLOR', value: hexToRgb(raw) };
  }
  if (/^rgb/.test(raw)) {
    return { type: 'COLOR', value: cssRgbToFigma(raw) };
  }

  // Zahl (px, rem, ohne Einheit)
  const num = parseFloat(raw);
  if (!isNaN(num)) {
    return { type: 'FLOAT', value: num };
  }

  // String (font-family, etc.)
  return { type: 'STRING', value: raw };
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const len = h.length <= 4 ? 1 : 2;
  const parse = (s) => parseInt(s, 16) / 255;
  return {
    r: parse(h.slice(0, len).padEnd(2, h[0])),
    g: parse(h.slice(len, len * 2).padEnd(2, h[len])),
    b: parse(h.slice(len * 2, len * 3).padEnd(2, h[len * 2])),
    a: len === 1 && h.length === 4 ? parse(h[3] + h[3]) : 1,
  };
}

function cssRgbToFigma(raw) {
  const m = raw.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 1];
  const a = raw.includes('rgba') ? (m[3] ?? 1) : 1;
  return { r: m[0] / 255, g: m[1] / 255, b: m[2] / 255, a };
}

// ── Komponente in Figma suchen oder anlegen ───────────────────────────────────
async function syncComponent(name, meta) {
  // Existierende Component Set per Name suchen
  const page = figma.currentPage;
  let compSet = page.findOne(
    n => n.type === 'COMPONENT_SET' && n.name === name
  );

  if (!compSet) {
    // Noch nicht in Figma — als "needs creation" markieren, nicht selbst bauen
    // (das macht der figma-generate-library Agent beim initialen Setup)
    return { status: 'pending', note: 'Noch nicht in Figma – beim nächsten Agent-Lauf erstellen' };
  }

  // Variant-Properties prüfen und Beschreibung updaten
  const existingProps = Object.keys(compSet.componentPropertyDefinitions ?? {});
  const expectedProps = Object.keys(meta.figmaProps ?? {});
  const missing = expectedProps.filter(p => !existingProps.includes(p));

  compSet.description = buildDescription(meta);

  return {
    status: 'updated',
    missingProps: missing,
    note: missing.length ? `Props fehlen in Figma: ${missing.join(', ')}` : 'OK',
  };
}

function buildDescription(meta) {
  const lines = [
    `Variants: ${meta.variants.join(', ')}`,
    `States: ${meta.states.join(', ')}`,
    `Tokens: ${meta.tokens.join(', ')}`,
  ];
  return lines.join('\n');
}

// ── Diff zwischen aktuellem Manifest und letztem Sync ────────────────────────
function computeDiff(manifest, lastSync) {
  const added = [], changed = [], unchanged = [];

  for (const [name, comp] of Object.entries(manifest)) {
    const prev = lastSync[name];
    if (!prev)                    added.push(name);
    else if (prev.hash !== comp.hash) changed.push(name);
    else                          unchanged.push(name);
  }

  const removed = Object.keys(lastSync).filter(n => !manifest[n]);
  return { added, changed, removed, unchanged };
}
