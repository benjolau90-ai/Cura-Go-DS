import {
  TYPES,
  TYPE_ICON_SVG,
  CHECK_ICON_SVG,
  SQUARE_ICON_SVG,
  URGENT_ICON_SVG,
  badgeClassForPriority,
  dayBucket,
  formatTime,
  formatDateTime,
  handoverEntries,
} from '../data/handover.js';

function renderDetail(entry, elements) {
  const typeInfo = TYPES[entry.type];

  elements.detailIcon.className = `list-row__badge detail-view__icon ${badgeClassForPriority(typeInfo.priority)}`;
  elements.detailIcon.innerHTML = TYPE_ICON_SVG[typeInfo.icon];
  elements.detailTitle.textContent = entry.type;
  elements.detailDate.textContent = formatDateTime(entry.createdAt);
  elements.detailPersonName.textContent = entry.targetName;

  elements.detailPriorityChip.textContent = typeInfo.label ?? typeInfo.priority;
  elements.detailUrgentChip.hidden = !entry.urgent;

  elements.detailTarget.textContent = entry.target;
  elements.detailTargetName.textContent = entry.targetName;

  elements.detailBody.textContent = entry.note;
  elements.detailMetaCreated.textContent = `Erstellt von ${entry.author} · ${formatDateTime(entry.createdAt)}`;
  elements.detailMetaUpdated.textContent = `Letzte Bearbeitung von ${entry.updatedBy} · ${formatDateTime(entry.updatedAt)}`;

  elements.detailTodos.hidden = entry.todos.length === 0;
  elements.detailTodos.replaceChildren();
  entry.todos.forEach((todo, index) => {
    const row = document.createElement('label');
    row.className = 'detail-view__todo-row';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', (event) => {
      entry.todos[index].done = event.target.checked;
    });

    const label = document.createElement('span');
    label.className = 'detail-view__todo-text';
    label.textContent = todo.text;

    const content = document.createElement('span');
    content.className = 'detail-view__todo-content';
    content.appendChild(label);

    if (todo.done) {
      row.classList.add('detail-view__todo-row--done');
      const meta = document.createElement('span');
      meta.className = 'detail-view__todo-meta';
      meta.textContent = `Erledigt von ${todo.doneBy ?? entry.updatedBy} · ${todo.doneAt ?? formatTime(entry.updatedAt)}`;
      content.appendChild(meta);
    }

    row.append(checkbox, content);
    elements.detailTodos.appendChild(row);
  });

  elements.detailFooter.hidden = !entry.read;
  if (entry.read) elements.detailReadBy.textContent = `Gelesen von ${entry.readBy ?? entry.updatedBy}`;
}

function createTextSpan(className, text) {
  const span = document.createElement('span');
  span.className = className;
  span.textContent = text;
  return span;
}

function createRow(entry, onSelect) {
  const typeInfo = TYPES[entry.type];
  const row = document.createElement('button');
  row.className = `list-row ${badgeClassForPriority(typeInfo.priority)}${entry.read ? ' list-row--read' : ''}`;
  row.dataset.item = entry.id;

  const badge = document.createElement('span');
  badge.className = 'list-row__badge';
  badge.innerHTML = TYPE_ICON_SVG[typeInfo.icon];

  const content = document.createElement('span');
  content.className = 'list-row__content';

  const title = document.createElement('span');
  title.className = 'list-row__title';
  title.textContent = `${entry.type}: ${entry.targetName}`;

  const meta = document.createElement('span');
  meta.className = 'list-row__meta';
  meta.append(
    createTextSpan('list-row__desc', entry.note.split('\n')[0]),
    createTextSpan('list-row__name', entry.author)
  );

  content.append(title, meta);

  const side = document.createElement('span');
  side.className = 'list-row__side';
  side.appendChild(createTextSpan('list-row__time', formatTime(entry.createdAt)));

  const indicators = document.createElement('span');
  indicators.className = 'list-row__indicators';

  if (entry.urgent) {
    const urgentIcon = document.createElement('span');
    urgentIcon.className = 'list-row__urgent-icon';
    urgentIcon.innerHTML = URGENT_ICON_SVG;
    indicators.appendChild(urgentIcon);
  }

  const check = document.createElement('span');
  check.style.opacity = entry.read ? '1' : '0.35';
  check.innerHTML = entry.read ? CHECK_ICON_SVG : SQUARE_ICON_SVG;
  indicators.appendChild(check);

  side.appendChild(indicators);

  row.append(badge, content, side);
  row.addEventListener('click', () => onSelect(entry.id));

  return row;
}

export function initHandoverView() {
  const elements = {
    listGroups: document.getElementById('listGroups'),
    detailIcon: document.getElementById('detailIcon'),
    detailTitle: document.getElementById('detailTitle'),
    detailDate: document.getElementById('detailDate'),
    detailPersonName: document.getElementById('detailPersonName'),
    detailPriorityChip: document.getElementById('detailPriorityChip'),
    detailUrgentChip: document.getElementById('detailUrgentChip'),
    detailTarget: document.getElementById('detailTarget'),
    detailTargetName: document.getElementById('detailTargetName'),
    detailBody: document.getElementById('detailBody'),
    detailMetaCreated: document.getElementById('detailMetaCreated'),
    detailMetaUpdated: document.getElementById('detailMetaUpdated'),
    detailTodos: document.getElementById('detailTodos'),
    detailFooter: document.getElementById('detailFooter'),
    detailReadBy: document.getElementById('detailReadBy'),
  };

  if (Object.values(elements).some((element) => !element)) return;

  function selectEntry(id) {
    const entry = handoverEntries.find((candidate) => candidate.id === Number(id));
    if (!entry) return;

    document.querySelectorAll('.list-row[data-item]').forEach((row) => {
      row.classList.toggle('list-row--selected', Number(row.dataset.item) === entry.id);
    });

    renderDetail(entry, elements);
  }

  const buckets = { Heute: [], Gestern: [], 'Letzte Woche': [] };
  handoverEntries.forEach((entry) => buckets[dayBucket(entry.createdAt)].push(entry));

  elements.listGroups.replaceChildren();

  Object.entries(buckets).forEach(([label, entries]) => {
    if (entries.length === 0) return;
    entries.sort((a, b) => b.createdAt - a.createdAt);

    const group = document.createElement('div');
    group.className = 'list-group';

    const header = document.createElement('div');
    header.className = 'list-group__header';
    header.textContent = label;

    const items = document.createElement('div');
    items.className = 'list-group__items';
    entries.forEach((entry) => items.appendChild(createRow(entry, selectEntry)));

    group.append(header, items);
    elements.listGroups.appendChild(group);
  });

  selectEntry(handoverEntries[0].id);

  const quickFilters = document.querySelectorAll('.chip[data-quick-filter]');
  const ACTIVE_CLASSES = ['chip--solid', 'chip--primary'];
  quickFilters.forEach((pill) => {
    pill.addEventListener('click', () => {
      const alreadyActive = pill.classList.contains('chip--solid');
      quickFilters.forEach((candidate) => {
        candidate.classList.remove(...ACTIVE_CLASSES);
        candidate.classList.add('chip--neutral');
      });
      if (!alreadyActive) {
        pill.classList.remove('chip--neutral');
        pill.classList.add(...ACTIVE_CLASSES);
      }
    });
  });
}
