// Portiert aus dem "Verträge Edit"-Prototyp (changeLogData.ts + PaketHistorie.tsx
// -> convertToLeistungChanges). Dort liegt ein Änderungsprotokoll als flacher
// Pfad-Diff vor (z.B. "leistungen.[17].preis": 21,00 € -> 22,00 €); die
// Original-Logik gruppiert das pro Leistung, filtert technische Felder über
// eine Whitelist raus und zeigt die volle Wertkette statt nur des letzten
// Sprungs. Hier auf unser Datenmodell (String-IDs wie "LK1", keine
// Varianten-Ebene) reduziert, Kernidee identisch.

const FIELD_LABELS = {
  name: 'Name',
  preis: 'Preis',
  punkte: 'Punkte',
  kommentar: 'Kommentar',
};

const PRICE_FIELDS = new Set(['preis']);

function parseLeistungPath(path) {
  const match = String(path).match(/^leistungen\.\[([^\]]+)\]\.(.+)$/);
  if (!match) return null;
  return { leistungId: match[1], field: match[2] };
}

function formatValue(field, value) {
  if (value === null || value === undefined) return '–';
  if (PRICE_FIELDS.has(field)) return `${Number(value).toFixed(2).replace('.', ',')} €`;
  return String(value);
}

function parseGermanDate(value) {
  const match = String(value).match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/**
 * Gruppiert rohe Pfad-Diffs zu lesbaren Änderungseinträgen pro Leistung.
 * Mehrere Änderungen desselben Felds werden zu einer Wertkette
 * zusammengefasst (28 → 30 → 32), Feldnamen ohne Label-Mapping fallen raus.
 */
export function groupChangesByLeistung(rawChangeLog, leistungNamesById) {
  const groups = new Map();

  rawChangeLog.forEach((change) => {
    const parsed = parseLeistungPath(change.path);
    if (!parsed || !FIELD_LABELS[parsed.field]) return;

    if (!groups.has(parsed.leistungId)) groups.set(parsed.leistungId, new Map());
    const fields = groups.get(parsed.leistungId);
    if (!fields.has(parsed.field)) fields.set(parsed.field, []);
    fields.get(parsed.field).push(change);
  });

  const entries = [];
  groups.forEach((fields, leistungId) => {
    fields.forEach((changes, field) => {
      const firstOldValue = changes[0].oldValue;
      const chain = [
        ...(firstOldValue === null || firstOldValue === undefined ? [] : [formatValue(field, firstOldValue)]),
        ...changes.map((change) => formatValue(field, change.newValue)),
      ];
      const latestDate = changes.reduce((latest, change) => {
        const date = parseGermanDate(change.datum);
        return date && (!latest || date > latest.date) ? { date, text: change.datum } : latest;
      }, null);

      entries.push({
        leistungId,
        title: leistungNamesById[leistungId] ?? leistungId,
        label: FIELD_LABELS[field],
        chain,
        date: latestDate?.text ?? '',
        sortDate: latestDate?.date ?? new Date(0),
      });
    });
  });

  entries.sort((a, b) => b.sortDate - a.sortDate);
  return entries;
}
