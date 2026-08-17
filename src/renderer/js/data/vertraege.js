export const vertragsUebersicht = [
  { id: 1, name: 'SGB XI Bayern', kalender: 'Bayern', status: 'work', offenePakete: 6, zuletztBearbeitet: 'vor 3 Tagen' },
  { id: 2, name: 'SGB XI Hessen', kalender: 'Hessen', status: 'work', offenePakete: null, zuletztBearbeitet: 'vor einer Woche' },
  { id: 3, name: 'SGB XI Hamburg Pflegevertrag', kalender: 'Hamburg', status: 'work', offenePakete: 8, zuletztBearbeitet: 'vor einer Woche', detailId: 'hamburg-sgb-xi' },
  { id: 4, name: 'SGB XI Niedersachsen', kalender: 'Niedersachsen', status: 'work', offenePakete: 7, zuletztBearbeitet: 'vor zwei Wochen' },
  { id: 5, name: 'SGB XI Sachsen', kalender: 'Sachsen', status: 'work', offenePakete: null, zuletztBearbeitet: 'vor zwei Wochen' },
  { id: 6, name: 'SGB XI Brandenburg', kalender: 'Brandenburg', status: 'waiting', offenePakete: 5, zuletztBearbeitet: 'vor zwei Wochen' },
  { id: 7, name: 'SGB XI Brandenburg', kalender: 'Brandenburg', status: 'waiting', offenePakete: 3, zuletztBearbeitet: '01.08.2025' },
  { id: 8, name: 'SGB XI Brandenburg', kalender: 'Brandenburg', status: 'waiting', offenePakete: 5, zuletztBearbeitet: '01.08.2025' },
  { id: 9, name: 'SGB XI Brandenburg', kalender: 'Brandenburg', status: 'testing', offenePakete: null, zuletztBearbeitet: '01.04.2025' },
  { id: 10, name: 'SGB XI Brandenburg', kalender: 'Brandenburg', status: 'testing', offenePakete: null, zuletztBearbeitet: '01.02.2025' },
  { id: 11, name: 'SGB XI Brandenburg', kalender: 'Brandenburg', status: 'approved', offenePakete: null, zuletztBearbeitet: '01.02.2025' },
  { id: 12, name: 'SGB XI Brandenburg', kalender: 'Brandenburg', status: 'approved', offenePakete: null, zuletztBearbeitet: '01.02.2025' },
  { id: 13, name: 'SGB XI Berlin', kalender: 'Berlin', status: 'approved', offenePakete: 8, zuletztBearbeitet: '01.02.2025' },
  { id: 14, name: 'SGB XI Berlin', kalender: 'Berlin', status: 'approved', offenePakete: null, zuletztBearbeitet: '01.02.2025' },
  { id: 15, name: 'SGB XI Berlin', kalender: 'Berlin', status: 'approved', offenePakete: null, zuletztBearbeitet: '01.02.2025' },
  { id: 16, name: 'SGB XI Bayern', kalender: 'Bayern', status: 'approved', offenePakete: null, zuletztBearbeitet: '01.02.2025' },
  { id: 17, name: 'SGB XI Bayern', kalender: 'Bayern', status: 'approved', offenePakete: null, zuletztBearbeitet: '01.02.2025' },
];

export const vertraege = [
  {
    id: 'hamburg-sgb-xi',
    name: 'Hamburg SGB XI',
    stand: '04/2025',
    bundesland: 'Hamburg',
    investitionskosten: 'Monatlich',
    kostengruppen: ['Pflegeversicherung', 'Betreuung §45b', 'Privat', 'Sozialamt', 'Verhinderungspflege'],
    getestetVon: 'Benjamin Lau',
    ersteller: 'Daniel Jonas',
    leistungen: [
      { id: 'LK1', name: 'Kleine Morgentoilette', preis: 9.2, punkte: 30 },
      { id: 'LK2', name: 'Körperpflege am Bett', preis: 9.2, punkte: 30 },
      {
        id: 'LK3',
        name: 'Mobilisation',
        preis: 9.2,
        punkte: 30,
        kinder: [
          { id: 'LK3.1', name: 'Mobilisation 2 Pflegekräfte', preis: 9.2, punkte: 30 },
          { id: 'LK3.2', name: 'Kleine Morgentoilette', preis: 9.2, punkte: 30 },
        ],
      },
      { id: 'LK4', name: 'Essen und Trinken', preis: 9.2, punkte: 30 },
      { id: 'LK5', name: 'Unterstützung bei der Körperhygiene', preis: 9.2, punkte: 30 },
      { id: 'LK6', name: 'Medikamente verabreichen', preis: 9.2, punkte: 30 },
      { id: 'LK7', name: 'Wundversorgung', preis: 9.2, punkte: 30 },
      { id: 'LK8', name: 'Psychosoziale Betreuung', preis: 9.2, punkte: 30, fussnote: 'Nur mit ärztlicher Verordnung abrechenbar.' },
      { id: 'LK9', name: 'Therapiebegleitung', preis: 9.2, punkte: 30 },
      { id: 'LK10', name: 'Sturzprophylaxe', preis: 9.2, punkte: 30 },
      { id: 'LK11', name: 'Mobilisationshilfe', preis: 9.2, punkte: 30, fussnote: 'Nur mit ärztlicher Verordnung abrechenbar.' },
      { id: 'LK12', name: 'Toilettengang unterstützen', preis: 9.2, punkte: 30 },
      { id: 'LK13', name: 'Ernährungstherapie', preis: 9.2, punkte: 30 },
      { id: 'LK14', name: 'Atemtherapie', preis: 9.2, punkte: 30 },
      { id: 'LK15', name: 'Physiotherapie', preis: 9.2, punkte: 30 },
      { id: 'LK16', name: 'Psychotherapie', preis: 9.2, punkte: 30, fussnote: 'Nur mit ärztlicher Verordnung abrechenbar.' },
      { id: 'LK17', name: 'Ernährungsberatung', preis: 9.2, punkte: 30 },
      { id: 'LK18', name: 'Schmerzmanagement', preis: 9.2, punkte: 30 },
      { id: 'LK19', name: 'Palliativpflege', preis: 9.2, punkte: 30, fussnote: 'Nur mit ärztlicher Verordnung abrechenbar.' },
      { id: 'LK20', name: 'Demenzbetreuung', preis: 9.2, punkte: 30 },
      { id: 'LK21', name: 'Nachtwache', preis: 9.2, punkte: 30 },
      { id: 'LK22', name: 'Freizeitgestaltung', preis: 9.2, punkte: 30 },
      { id: 'LK23', name: 'Begleitung zu Terminen', preis: 9.2, punkte: 30 },
      { id: 'LK24', name: 'Hauswirtschaftliche Versorgung', preis: 9.2, punkte: 30 },
      { id: 'LK25', name: 'Individuelle Betreuung', preis: 9.2, punkte: 30 },
      { id: 'LK26', name: 'Gruppenaktivitäten', preis: 9.2, punkte: 30 },
      { id: 'LK27', name: 'Freizeit- und Sportangebote', preis: 9.2, punkte: 30 },
      { id: 'wegepauschale', name: 'Wegepauschale', preis: 10.0, punkte: null },
    ],
    wegepauschale: {
      beschreibung:
        'Setze bei jeder Leistung des Vertrags eine Wegepauschale. Bei Assistenzleistung ist die Wegepauschale auf 1× täglich limitiert.',
    },
    zusatzkosten: [
      {
        titel: 'Ausbildungsumlage allgemein',
        referenzLabel: 'LK20: Ausbildungsumlage',
        begruendung:
          'Zur Sicherstellung der Finanzierung der generalistischen Pflegeausbildung nach dem Pflegeberufegesetz (PflBG) wird gemäß §82a SGB XI ein Ausbildungszuschlag erhoben. Dieser Zuschlag dient der Refinanzierung der Ausbildungskosten aller ambulanten Pflegeeinrichtungen in Sachsen, unabhängig davon, ob sie selbst ausbilden.',
      },
      {
        titel: 'Ausbildungsumlage nach §26 PflBG',
        referenzLabel: 'LK21: Ausbildungspauschale nach §26 PflBG',
        begruendung:
          'Für die Beratungsbesuche nach § 37 Abs. 3 SGB XI fällt gemäß §82a SGB XI ein Ausbildungszuschlag an. Dieser Zuschlag finanziert anteilig die Ausbildungskosten der Pflegeberufe in Sachsen und wird von allen zugelassenen Pflegediensten erhoben.',
      },
    ],
    zuschlaege: [
      {
        titel: '2. Pflegekraft',
        beschreibung: 'Es 50% auf den Preis einer Leistung aufgeschlagen, wenn eine zweite Pflegekraft den Einsatz mitführt.',
      },
    ],
    // Rohes Änderungsprotokoll als Pfad-Diffs (path/oldValue/newValue), analog
    // zum "Verträge Edit"-Prototyp (changeLogData.ts + PaketHistorie.tsx).
    // Wird erst beim Rendern über js/utils/changelog.js zu lesbaren Einträgen
    // gruppiert – dadurch bleibt die volle Wertkette sichtbar (28 → 30 statt
    // nur des letzten Sprungs) und technische Felder lassen sich per
    // Whitelist rausfiltern, ohne die Rohdaten anzufassen.
    rawChangeLog: [
      { path: 'leistungen.[LK1].punkte', oldValue: 28, newValue: 30, datum: '12.08.2025' },
      { path: 'leistungen.[LK1].preis', oldValue: 3.2, newValue: 3.8, datum: '13.08.2025' },
      { path: 'leistungen.[LK1].preis', oldValue: 3.8, newValue: 4.3, datum: '14.08.2025' },
      { path: 'leistungen.[LK3].punkte', oldValue: 28, newValue: 30, datum: '13.08.2025' },
      { path: 'leistungen.[LK4].punkte', oldValue: 40, newValue: 42, datum: '16.08.2025' },
      { path: 'leistungen.[LK5].punkte', oldValue: 36, newValue: 38, datum: '18.08.2025' },
      { path: 'leistungen.[LK8].kommentar', oldValue: null, newValue: 'Nur mit ärztlicher Verordnung abrechenbar.', datum: '10.08.2025' },
    ],
  },
];

export function findVertrag(id) {
  return vertraege.find((vertrag) => vertrag.id === id) ?? vertraege[0];
}
