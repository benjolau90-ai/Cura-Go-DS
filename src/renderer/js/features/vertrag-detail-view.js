import { findVertrag } from '../data/vertraege.js';
import { groupChangesByLeistung } from '../utils/changelog.js';

function formatPreis(preis) {
  return `${preis.toFixed(2).replace('.', ',')} €`;
}

function formatPunkte(punkte) {
  return punkte === null || punkte === undefined ? 'Keine Punkte' : `${punkte} Punkte`;
}

function createLeistungRow(leistung, { isChild = false } = {}) {
  const row = document.createElement('div');
  row.className = isChild ? 'leistung-row leistung-row--child' : 'leistung-row';

  const name = document.createElement('span');
  name.className = 'leistung-row__name';
  name.textContent = leistung.name;

  if (leistung.fussnote) {
    const footnote = document.createElement('span');
    footnote.className = 'leistung-row__footnote';
    footnote.textContent = '*';
    footnote.title = leistung.fussnote;
    name.appendChild(footnote);
  }

  row.append(name, createCell(formatPreis(leistung.preis)), createCell(formatPunkte(leistung.punkte)));
  return row;
}

function createCell(text) {
  const cell = document.createElement('span');
  cell.className = 'leistung-row__cell';
  cell.textContent = text;
  return cell;
}

function renderLeistungen(container, leistungen) {
  container.replaceChildren();
  leistungen.forEach((leistung) => {
    container.appendChild(createLeistungRow(leistung));
    leistung.kinder?.forEach((kind) => {
      container.appendChild(createLeistungRow(kind, { isChild: true }));
    });
  });
}

function renderFlatMatches(container, leistungen) {
  container.replaceChildren();
  leistungen.forEach((leistung) => {
    container.appendChild(createLeistungRow(leistung));
  });
}

function flattenLeistungen(leistungen) {
  return leistungen.flatMap((leistung) => [leistung, ...(leistung.kinder ?? [])]);
}

function createUpdateItem(entry) {
  const item = document.createElement('div');
  item.className = 'update-item';

  const dot = document.createElement('span');
  dot.className = 'update-item__dot';

  const text = document.createElement('span');
  text.className = 'update-item__text';
  text.textContent = `${entry.title} - ${entry.label}: ${entry.chain.join(' → ')}`;

  const date = document.createElement('span');
  date.className = 'update-item__date';
  date.textContent = entry.date;

  item.append(dot, text, date);
  return item;
}

function renderUpdates(container, vertrag, allLeistungen) {
  container.replaceChildren();
  const namesById = Object.fromEntries(allLeistungen.map((leistung) => [leistung.id, leistung.name]));
  const entries = groupChangesByLeistung(vertrag.rawChangeLog ?? [], namesById);
  entries.forEach((entry, index) => {
    const item = createUpdateItem(entry);
    if (index === entries.length - 1) item.classList.add('update-item--last');
    container.appendChild(item);
  });
}

export function initVertragDetailView() {
  const list = document.getElementById('leistungList');
  const searchInput = document.getElementById('leistungSearchInput');
  const headerTitle = document.getElementById('leistungHeaderTitle');
  const updatesList = document.getElementById('vertragUpdatesList');
  if (!list || !searchInput || !headerTitle || !updatesList) return;

  let vertrag = null;
  let allLeistungen = [];

  function loadVertrag(id) {
    vertrag = findVertrag(id);
    allLeistungen = flattenLeistungen(vertrag.leistungen);
    headerTitle.textContent = `Leistungen · ${vertrag.name}`;
    searchInput.value = '';
    renderLeistungen(list, vertrag.leistungen);
    renderUpdates(updatesList, vertrag, allLeistungen);
  }

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      renderLeistungen(list, vertrag.leistungen);
      return;
    }
    const matches = allLeistungen.filter(
      (leistung) => leistung.name.toLowerCase().includes(query) || leistung.id.toLowerCase().includes(query)
    );
    renderFlatMatches(list, matches);
  });

  document.addEventListener('vertrag:open', (event) => loadVertrag(event.detail?.id));

  loadVertrag('hamburg-sgb-xi');
}
