import { vertragsUebersicht } from '../data/vertraege.js';
import { issueStatusMeta } from '../data/issues.js';

function normalize(value) {
  return String(value ?? '').toLowerCase().trim();
}

const searchableFilters = [
  { field: 'vertrag', label: 'Vertrag', values: [...new Set(vertragsUebersicht.map((v) => v.name))] },
  { field: 'kalender', label: 'Kalender', values: [...new Set(vertragsUebersicht.map((v) => v.kalender))] },
  { field: 'status', label: 'Status', values: Object.values(issueStatusMeta).map((status) => status.label) },
];

const fieldAliases = { vertrag: 'vertrag', kalender: 'kalender', status: 'status' };

function vertragFieldValue(vertrag, field) {
  if (field === 'vertrag') return vertrag.name;
  if (field === 'kalender') return vertrag.kalender;
  if (field === 'status') return issueStatusMeta[vertrag.status]?.label ?? vertrag.status;
  return '';
}

function findFilterSuggestions(query) {
  const value = normalize(query);
  if (!value) return [];

  const colonMatch = value.match(/^([^:]+):\s*(.+)$/);
  if (colonMatch) {
    const field = fieldAliases[normalize(colonMatch[1])];
    const filter = searchableFilters.find((candidate) => candidate.field === field);
    if (!filter) return [];
    const wanted = normalize(colonMatch[2]);
    const match = filter.values.find((candidate) => normalize(candidate).includes(wanted)) ?? colonMatch[2].trim();
    return [{ field: filter.field, label: filter.label, value: match, displayValue: colonMatch[2].trim() }];
  }

  const suggestions = [];
  for (const filter of searchableFilters) {
    const match = filter.values.find((candidate) => normalize(candidate).includes(value));
    if (match) {
      suggestions.push({ field: filter.field, label: filter.label, value: match, displayValue: query.trim() });
      break;
    }
  }

  suggestions.push({ field: 'text', label: 'Alle Spalten', value: query.trim(), displayValue: query.trim() });
  return suggestions;
}

function vertragMatchesFilters(vertrag, activeFilters) {
  return activeFilters.every((filter) => {
    if (filter.field === 'text') {
      const haystack = normalize([vertrag.name, vertrag.kalender, vertragFieldValue(vertrag, 'status')].join(' '));
      return haystack.includes(normalize(filter.value));
    }
    return normalize(vertragFieldValue(vertrag, filter.field)).includes(normalize(filter.value));
  });
}

function createStatusChip(status) {
  const meta = issueStatusMeta[status] ?? issueStatusMeta.work;
  const chip = document.createElement('span');
  chip.className = `status-chip ${meta.className}`;

  const dot = document.createElement('span');
  dot.className = 'status-chip__dot';

  chip.append(dot, document.createTextNode(meta.label));
  return chip;
}

function createCell(text) {
  const cell = document.createElement('span');
  cell.textContent = text;
  return cell;
}

function createVertragRow(vertrag, onSelect) {
  const row = document.createElement('button');
  row.className = 'contract-table__row';
  row.type = 'button';
  row.dataset.vertragId = vertrag.id;
  row.setAttribute('role', 'row');

  const nameCell = document.createElement('span');
  const strong = document.createElement('strong');
  strong.textContent = vertrag.name;
  nameCell.appendChild(strong);

  const statusCell = document.createElement('span');
  statusCell.appendChild(createStatusChip(vertrag.status));

  row.append(
    nameCell,
    createCell(vertrag.kalender),
    statusCell,
    createCell(vertrag.offenePakete ?? ''),
    createCell(vertrag.zuletztBearbeitet)
  );

  row.addEventListener('click', () => onSelect(vertrag.id));
  return row;
}

function createSearchChip(filter, onRemove) {
  const chip = document.createElement('span');
  chip.className = 'chip chip--neutral chip--removable smart-search__chip';

  const text = document.createElement('span');
  text.textContent = filter.field === 'text' ? `${filter.value} · ${filter.label}` : `${filter.label}: ${filter.value}`;

  const remove = document.createElement('button');
  remove.className = 'chip__remove';
  remove.type = 'button';
  remove.setAttribute('aria-label', `${filter.label} ${filter.value} entfernen`);
  remove.innerHTML =
    '<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-linecap="round" /></svg>';
  remove.addEventListener('click', onRemove);

  chip.append(text, remove);
  return chip;
}

function renderSearchTokens(elements, activeFilters, onRemove) {
  elements.searchTokens.replaceChildren();
  activeFilters.forEach((filter, index) => {
    elements.searchTokens.appendChild(createSearchChip(filter, () => onRemove(index)));
  });
}

function renderSuggestion(elements, suggestions, onCommit) {
  elements.searchSuggestions.replaceChildren();

  if (!suggestions.length) {
    elements.searchSuggestions.hidden = true;
    return;
  }

  suggestions.forEach((suggestion) => {
    const option = document.createElement('button');
    option.className = 'smart-search__suggestion';
    option.type = 'button';

    const value = document.createElement('strong');
    value.textContent = suggestion.displayValue ?? suggestion.value;

    const context = document.createElement('span');
    context.textContent = `· ${suggestion.label}`;

    option.append(value, context);
    option.addEventListener('mousedown', (event) => {
      event.preventDefault();
      onCommit(suggestion);
    });

    elements.searchSuggestions.appendChild(option);
  });

  elements.searchSuggestions.hidden = false;
}

const filterMenuGroups = [
  { field: 'kalender', label: 'Kalender' },
  { field: 'status', label: 'Status' },
];

function groupValues(group) {
  return searchableFilters.find((candidate) => candidate.field === group.field)?.values ?? [];
}

function renderFilterMenu(container, onPick) {
  container.replaceChildren();

  const header = document.createElement('div');
  header.className = 'menu-surface__header';
  header.textContent = 'Filtern nach';
  container.appendChild(header);

  function collapseAll() {
    container.querySelectorAll('.menu-surface__group-trigger').forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
    container.querySelectorAll('.menu-surface--nested').forEach((nested) => (nested.hidden = true));
    container.querySelectorAll('.menu-surface__group--align-left').forEach((wrapper) => wrapper.classList.remove('menu-surface__group--align-left'));
  }

  filterMenuGroups.forEach((group) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'menu-surface__group';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'menu-surface__group-trigger';
    trigger.setAttribute('role', 'menuitem');
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');

    const label = document.createElement('span');
    label.textContent = group.label;

    const caret = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    caret.setAttribute('class', 'icon menu-surface__caret');
    caret.setAttribute('viewBox', '0 0 24 24');
    caret.setAttribute('fill', 'none');
    caret.setAttribute('aria-hidden', 'true');
    caret.innerHTML = '<path d="M10 8L14 12L10 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />';

    trigger.append(label, caret);

    const nested = document.createElement('div');
    nested.className = 'menu-surface menu-surface--nested';
    nested.setAttribute('role', 'menu');
    nested.setAttribute('aria-label', group.label);
    nested.hidden = true;

    groupValues(group).forEach((value) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.setAttribute('role', 'menuitem');
      const optionText = document.createElement('span');
      optionText.textContent = value;
      option.appendChild(optionText);
      option.addEventListener('click', () => onPick({ field: group.field, label: group.label, value, displayValue: value }));
      nested.appendChild(option);
    });

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      collapseAll();
      if (isOpen) return;

      trigger.setAttribute('aria-expanded', 'true');
      nested.hidden = false;
      wrapper.classList.remove('menu-surface__group--align-left');
      const rect = nested.getBoundingClientRect();
      if (rect.right > window.innerWidth - 8) wrapper.classList.add('menu-surface__group--align-left');
    });

    wrapper.append(trigger, nested);
    container.appendChild(wrapper);
  });

  container.addEventListener('click', () => window.setTimeout(collapseAll, 0));
}

export function initVertragOverviewView() {
  const elements = {
    table: document.getElementById('vertragTable'),
    filterMenu: document.getElementById('vertragFilterMenu'),
    searchInput: document.getElementById('vertragSmartSearchInput'),
    searchTokens: document.getElementById('vertragSearchTokens'),
    searchSuggestions: document.getElementById('vertragSearchSuggestions'),
  };

  if (Object.values(elements).some((element) => !element)) return;

  const activeFilters = [];

  function openVertragDetail(vertrag) {
    document.dispatchEvent(new CustomEvent('vertrag:open', { detail: { id: vertrag.detailId } }));
    document.querySelector('[data-view="example-contract"]')?.click();
  }

  function renderRows() {
    elements.table.querySelectorAll('.contract-table__row:not(.contract-table__row--head)').forEach((row) => row.remove());
    const filtered = vertragsUebersicht.filter((vertrag) => vertragMatchesFilters(vertrag, activeFilters));
    filtered.forEach((vertrag) => {
      elements.table.appendChild(createVertragRow(vertrag, () => openVertragDetail(vertrag)));
    });
  }

  function removeFilter(index) {
    activeFilters.splice(index, 1);
    renderSearchTokens(elements, activeFilters, removeFilter);
    renderRows();
    elements.searchInput.focus();
  }

  function commitSearchFilter(suggestion) {
    if (!suggestion?.value) return;
    const alreadyActive = activeFilters.some((filter) => filter.field === suggestion.field && filter.value === suggestion.value);
    if (alreadyActive) return;
    activeFilters.push(suggestion);
    elements.searchInput.value = '';
    renderSuggestion(elements, [], commitSearchFilter);
    renderSearchTokens(elements, activeFilters, removeFilter);
    renderRows();
  }

  elements.searchInput.addEventListener('input', () => {
    renderSuggestion(elements, findFilterSuggestions(elements.searchInput.value), commitSearchFilter);
  });
  elements.searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitSearchFilter(findFilterSuggestions(elements.searchInput.value)[0]);
    }
    if (event.key === 'Backspace' && elements.searchInput.value === '' && activeFilters.length > 0) {
      activeFilters.pop();
      renderSearchTokens(elements, activeFilters, removeFilter);
      renderRows();
    }
  });
  elements.searchInput.addEventListener('blur', () => {
    window.setTimeout(() => renderSuggestion(elements, [], commitSearchFilter), 120);
  });

  renderFilterMenu(elements.filterMenu, commitSearchFilter);
  renderRows();
}
