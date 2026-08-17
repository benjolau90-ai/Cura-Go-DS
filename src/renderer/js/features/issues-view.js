import { issues, issueStatusMeta } from '../data/issues.js';

const issueOverviewGroups = [
  { id: 'intake', label: 'Eingang', hint: 'Noch nicht entschieden', className: 'issue-group--intake' },
  { id: 'needs-package', label: 'Paket benötigt', hint: 'Vertrag geklärt, Paket offen', className: 'issue-group--needs-package' },
  { id: 'package-work', label: 'Paket in Arbeit', hint: 'Bearbeitung läuft', className: 'issue-group--package-work' },
  { id: 'testing', label: 'Im Test', hint: 'Paket wartet auf Prüfung', className: 'issue-group--testing' },
  { id: 'approved', label: 'Freigegeben', hint: 'Fachlich abgeschlossen', className: 'issue-group--approved' },
];

const overviewMetaByIssueId = {
  1: { group: 'package-work', packageName: 'Paket 08/2026 A', updated: '14.08.2026', source: 'Anruf' },
  2: { group: 'testing', packageName: 'Paket 07/2026 Privat', updated: '11.08.2026', source: 'Intern' },
  3: { group: 'testing', packageName: 'Paket 06/2026 IK', updated: '10.08.2026', source: 'Testbench' },
  4: { group: 'approved', packageName: 'Paket 05/2026 Betreuung', updated: '07.08.2026', source: 'Review' },
  5: { group: 'needs-package', packageName: '', updated: '05.08.2026', source: 'Rundschreiben' },
  6: { group: 'testing', packageName: 'Paket 08/2026 Privat', updated: '05.08.2026', source: 'Anruf' },
  7: { group: 'testing', packageName: 'Paket 07/2026 Abendtour', updated: '04.08.2026', source: 'Testbench' },
  8: { group: 'needs-package', packageName: '', updated: '02.08.2026', source: 'Intern' },
  9: { group: 'intake', packageName: '', updated: '30.07.2026', source: 'Anruf' },
  10: { group: 'approved', packageName: 'Paket 06/2026 §45b', updated: '29.07.2026', source: 'Review' },
  11: { group: 'testing', packageName: 'Paket 05/2026 Pauschale', updated: '27.07.2026', source: 'Testbench' },
  12: { group: 'package-work', packageName: 'Paket 05/2026 PG4', updated: '25.07.2026', source: 'Intern' },
  13: { group: 'intake', packageName: '', updated: '23.07.2026', source: 'Import' },
  14: { group: 'testing', packageName: 'Paket 04/2026 Feiertage', updated: '21.07.2026', source: 'Kalender' },
  15: { group: 'package-work', packageName: 'Paket 03/2026 Kappung', updated: '18.07.2026', source: 'Anruf' },
  16: { group: 'approved', packageName: 'Paket 03/2026 Entlastung', updated: '15.07.2026', source: 'Review' },
  17: { group: 'intake', packageName: '', updated: '12.07.2026', source: 'Anruf' },
  18: { group: 'testing', packageName: 'Paket 02/2026 Sperre', updated: '10.07.2026', source: 'Intern' },
  19: { group: 'needs-package', packageName: '', updated: '08.07.2026', source: 'Export' },
  20: { group: 'approved', packageName: 'Paket 01/2026 Sondertarif', updated: '05.07.2026', source: 'Review' },
  21: { group: 'package-work', packageName: 'Paket 12/2025 Punktwerte', updated: '02.07.2026', source: 'Nachberechnung' },
  22: { group: 'intake', packageName: '', updated: '30.06.2026', source: 'Anruf' },
  23: { group: 'testing', packageName: 'Paket 11/2025 Wechsel', updated: '26.06.2026', source: 'Testbench' },
  24: { group: 'approved', packageName: 'Paket 11/2025 Gutschrift', updated: '22.06.2026', source: 'Review' },
};

function getOverviewMeta(issue) {
  const fallbackGroup = issue.status === 'approved' ? 'approved' : issue.status === 'testing' ? 'testing' : 'package-work';
  return overviewMetaByIssueId[issue.id] ?? {
    group: fallbackGroup,
    packageName: issue.status === 'approved' ? `Paket ${issue.stand}` : '',
    updated: issue.activities[0]?.date ?? issue.stand,
    source: 'Intern',
  };
}

function normalize(value) {
  return String(value ?? '').toLowerCase().trim();
}

function issueSearchText(issue) {
  const overview = getOverviewMeta(issue);
  const status = issueStatusMeta[issue.status]?.label ?? issue.status;
  const group = issueOverviewGroups.find((candidate) => candidate.id === overview.group)?.label ?? overview.group;
  return normalize([
    issue.title,
    issue.contract,
    issue.costGroup,
    issue.assignee,
    issue.stand,
    issue.priority,
    issue.tariff,
    issue.description.join(' '),
    overview.packageName || 'Kein Paket',
    overview.source,
    overview.updated,
    status,
    group,
  ].join(' '));
}

function issueFieldValue(issue, field) {
  const overview = getOverviewMeta(issue);
  const status = issueStatusMeta[issue.status]?.label ?? issue.status;
  const group = issueOverviewGroups.find((candidate) => candidate.id === overview.group)?.label ?? overview.group;

  const values = {
    arbeitslage: group,
    bearbeiter: issue.assignee,
    paket: overview.packageName || 'Kein Paket',
    prio: issue.priority,
    stand: issue.stand,
    status,
    vertrag: issue.contract,
  };

  return values[field] ?? '';
}

const searchableFilters = [
  { field: 'prio', label: 'Prio', values: ['Highest', 'High', 'Normal', 'Low'] },
  { field: 'status', label: 'Status', values: Object.values(issueStatusMeta).map((status) => status.label) },
  { field: 'arbeitslage', label: 'Arbeitslage', values: issueOverviewGroups.map((group) => group.label) },
  { field: 'stand', label: 'Stand', values: [...new Set(issues.map((issue) => issue.stand))] },
  { field: 'vertrag', label: 'Vertrag', values: [...new Set(issues.map((issue) => issue.contract))] },
  { field: 'bearbeiter', label: 'Bearbeiter', values: [...new Set(issues.map((issue) => issue.assignee))] },
  { field: 'paket', label: 'Paket', values: [...new Set(issues.map((issue) => getOverviewMeta(issue).packageName || 'Kein Paket'))] },
];

const zeitraumOptions = ['Letzte 7 Tage', 'Letzte 30 Tage', 'Älter als 30 Tage'];

const filterMenuGroups = [
  { field: 'paket', label: 'Paket' },
  { field: 'status', label: 'Status' },
  { field: 'prio', label: 'Priorität' },
  { field: 'zeitraum', label: 'Zeitraum', values: zeitraumOptions },
];

function parseGermanDate(value) {
  const match = String(value).match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function issueMatchesZeitraum(issue, value) {
  const date = parseGermanDate(getOverviewMeta(issue).updated);
  if (!date) return false;
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (value === 'Letzte 7 Tage') return days <= 7;
  if (value === 'Letzte 30 Tage') return days <= 30;
  if (value === 'Älter als 30 Tage') return days > 30;
  return true;
}

const fieldAliases = {
  arbeitslage: 'arbeitslage',
  bearbeiter: 'bearbeiter',
  paket: 'paket',
  prio: 'prio',
  prioritaet: 'prio',
  priorität: 'prio',
  stand: 'stand',
  status: 'status',
  vertrag: 'vertrag',
};

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

function issueMatchesFilters(issue, activeFilters) {
  return activeFilters.every((filter) => {
    if (filter.field === 'text') return issueSearchText(issue).includes(normalize(filter.value));
    if (filter.field === 'zeitraum') return issueMatchesZeitraum(issue, filter.value);
    return normalize(issueFieldValue(issue, filter.field)).includes(normalize(filter.value));
  });
}

function createCell(text, className) {
  const cell = document.createElement('span');
  if (className) cell.className = className;
  cell.textContent = text;
  return cell;
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

function createHeaderRow() {
  const row = document.createElement('div');
  row.className = 'issue-table__row issue-table__row--head';
  row.setAttribute('role', 'row');

  ['Issue', 'Vertrag', 'Paket', 'Status', 'Bearbeiter', 'Aktualisiert'].forEach((label) => {
    row.appendChild(createCell(label));
  });
  row.appendChild(createCell('', 'issue-table__open-cell'));

  return row;
}

function createOpenIndicator() {
  const cell = document.createElement('span');
  cell.className = 'issue-table__open-cell';
  cell.innerHTML =
    '<svg class="icon issue-table__open-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>';
  return cell;
}

function createIssueRow(issue, onSelect) {
  const overview = getOverviewMeta(issue);
  const row = document.createElement('button');
  row.className = 'issue-table__row';
  row.type = 'button';
  row.dataset.issueId = issue.id;
  row.setAttribute('role', 'row');

  const statusCell = document.createElement('span');
  statusCell.appendChild(createStatusChip(issue.status));

  const issueCell = document.createElement('span');
  issueCell.className = 'issue-table__issue-cell';

  const title = document.createElement('span');
  title.className = 'issue-table__primary';
  title.textContent = issue.title;

  const meta = document.createElement('span');
  meta.className = 'issue-table__meta';
  meta.textContent = `${overview.source} · ${issue.costGroup}`;

  issueCell.append(title, meta);

  const packageCell = document.createElement('span');
  if (overview.packageName) {
    packageCell.textContent = overview.packageName;
  } else {
    const empty = document.createElement('span');
    empty.className = 'issue-table__empty';
    empty.textContent = 'Kein Paket';
    packageCell.appendChild(empty);
  }

  row.append(
    issueCell,
    createCell(issue.contract),
    packageCell,
    statusCell,
    createCell(issue.assignee),
    createCell(overview.updated),
    createOpenIndicator()
  );

  row.addEventListener('click', () => onSelect(issue.id));
  return row;
}

function createGroupHeader(group, count) {
  const row = document.createElement('div');
  row.className = `issue-table__group ${group.className}`;

  const label = document.createElement('span');
  label.className = 'issue-table__group-label';
  label.textContent = group.label;

  const countBadge = document.createElement('span');
  countBadge.className = 'issue-table__group-count';
  countBadge.textContent = String(count);

  const hint = document.createElement('span');
  hint.className = 'issue-table__group-hint';
  hint.textContent = group.hint;

  row.append(label, countBadge, hint);
  return row;
}

function createOverviewSummary(groupedIssues) {
  const summary = document.createElement('div');
  summary.className = 'issue-overview-summary';

  const lead = document.createElement('span');
  lead.className = 'issue-overview-summary__label';
  lead.textContent = `${issues.length} Issues`;
  summary.appendChild(lead);

  const chips = [
    { label: 'Arbeitslage', value: 'Alle' },
    { label: 'Status', value: 'Alle' },
  ];

  chips.forEach((filter) => {
    const chip = document.createElement('span');
    chip.className = 'chip chip--neutral chip--removable issue-filter-chip';

    const text = document.createElement('span');
    text.textContent = `${filter.label}: ${filter.value}`;

    const remove = document.createElement('button');
    remove.className = 'chip__remove';
    remove.type = 'button';
    remove.setAttribute('aria-label', `${filter.label} Filter entfernen`);
    remove.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-linecap="round" /></svg>';

    chip.append(text, remove);
    summary.appendChild(chip);
  });

  const hint = document.createElement('span');
  hint.className = 'issue-overview-summary__hint';
  hint.textContent = 'Filter über Suche hinzufügen';
  summary.appendChild(hint);

  return summary;
}

function createSearchChip(filter, onRemove, onEdit) {
  const chip = document.createElement('span');
  chip.className = 'chip chip--neutral chip--removable smart-search__chip';
  chip.title = 'Doppelklick zum Bearbeiten';

  const text = document.createElement('span');
  text.textContent = filter.field === 'text' ? `${filter.value} · ${filter.label}` : `${filter.label}: ${filter.value}`;
  text.addEventListener('dblclick', onEdit);

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

function renderSearchTokens(elements, activeFilters, onRemove, onEdit) {
  elements.searchTokens.replaceChildren();
  activeFilters.forEach((filter, index) => {
    elements.searchTokens.appendChild(createSearchChip(filter, () => onRemove(index), () => onEdit(index)));
  });
}

function renderSuggestion(elements, suggestions, onCommit, activeIndex = 0) {
  elements.searchSuggestions.replaceChildren();

  if (!suggestions.length) {
    elements.searchSuggestions.hidden = true;
    return;
  }

  suggestions.forEach((suggestion, index) => {
    const option = document.createElement('button');
    option.className = 'smart-search__suggestion';
    option.classList.toggle('is-active', index === activeIndex);
    option.type = 'button';
    option.setAttribute('aria-selected', String(index === activeIndex));

    const value = document.createElement('strong');
    value.textContent = suggestion.displayValue ?? suggestion.value;

    const context = document.createElement('span');
    context.textContent = `· ${suggestion.label}`;

    option.append(value, context);
    option.addEventListener('mousedown', (event) => {
      event.preventDefault();
      onCommit(suggestion);
    });
    option.addEventListener('mousemove', () => {
      if (!option.classList.contains('is-active')) {
        elements.searchSuggestions
          .querySelectorAll('.smart-search__suggestion.is-active')
          .forEach((active) => active.classList.remove('is-active'));
        option.classList.add('is-active');
      }
    });

    elements.searchSuggestions.appendChild(option);
  });

  elements.searchSuggestions.hidden = false;
  const activeOption = elements.searchSuggestions.children[activeIndex];
  if (activeOption) activeOption.scrollIntoView({ block: 'nearest' });
}

function createEmptyRow() {
  const row = document.createElement('div');
  row.className = 'issue-table__empty-state';
  row.textContent = 'Keine Issues für diese Suche';
  return row;
}

function setSelectValue(element, value) {
  element.textContent = value || '-';
  element.classList.toggle('issue-detail__select--empty', !value || value === '-');
}

function renderDescription(container, description) {
  container.replaceChildren();

  description.forEach((paragraph) => {
    const element = document.createElement('p');
    element.textContent = paragraph;
    container.appendChild(element);
  });
}

function renderActivity(container, activities) {
  container.replaceChildren();

  activities.forEach((activity) => {
    const item = document.createElement('article');
    item.className = 'issue-activity__item';

    const dot = document.createElement('span');
    dot.className = 'issue-activity__dot';

    const text = document.createElement('p');
    text.textContent = activity.text;

    const date = document.createElement('time');
    date.textContent = activity.date;

    item.append(dot, text, date);
    container.appendChild(item);
  });
}

function renderDetail(issue, elements) {
  const status = issueStatusMeta[issue.status] ?? issueStatusMeta.work;

  elements.title.textContent = issue.title;
  elements.tariff.textContent = issue.tariff;
  elements.tariff.classList.toggle('issue-detail__muted', issue.tariff === '-');
  renderDescription(elements.description, issue.description);
  elements.contract.textContent = issue.contract;
  setSelectValue(elements.status, status.label);
  setSelectValue(elements.priority, issue.priority);
  elements.stand.textContent = issue.stand;
  setSelectValue(elements.assignee, issue.assignee);
  renderActivity(elements.activityList, issue.activities);
}

function groupValues(group) {
  if (group.values) return group.values;
  return searchableFilters.find((candidate) => candidate.field === group.field)?.values ?? [];
}

function renderFilterMenu(container, onPick) {
  container.replaceChildren();

  const header = document.createElement('div');
  header.className = 'menu-surface__header';
  header.textContent = 'Filtern nach';
  container.appendChild(header);

  function collapseAll() {
    container.querySelectorAll('.menu-surface__group-trigger').forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false');
    });
    container.querySelectorAll('.menu-surface--nested').forEach((nested) => {
      nested.hidden = true;
    });
    container.querySelectorAll('.menu-surface__group--align-left').forEach((wrapper) => {
      wrapper.classList.remove('menu-surface__group--align-left');
    });
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
      option.addEventListener('click', () => {
        onPick({ field: group.field, label: group.label, value, displayValue: value });
      });
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
      if (rect.right > window.innerWidth - 8) {
        wrapper.classList.add('menu-surface__group--align-left');
      }
    });

    wrapper.append(trigger, nested);
    container.appendChild(wrapper);
  });

  container.addEventListener('click', () => window.setTimeout(collapseAll, 0));
}

export function initIssuesView() {
  const elements = {
    table: document.getElementById('issueTable'),
    smartSearch: document.getElementById('issueSmartSearch'),
    filterMenu: document.getElementById('issueFilterMenu'),
    searchInput: document.getElementById('issueSmartSearchInput'),
    searchTokens: document.getElementById('issueSearchTokens'),
    searchSuggestions: document.getElementById('issueSearchSuggestions'),
    title: document.getElementById('issueDetailTitle'),
    tariff: document.getElementById('issueDetailTariff'),
    description: document.getElementById('issueDetailDescription'),
    contract: document.getElementById('issueDetailContract'),
    status: document.getElementById('issueDetailStatus'),
    priority: document.getElementById('issueDetailPriority'),
    stand: document.getElementById('issueDetailStand'),
    assignee: document.getElementById('issueDetailAssignee'),
    activityList: document.getElementById('issueActivityList'),
    detailModalOverlay: document.getElementById('issueDetailModalOverlay'),
  };

  if (Object.values(elements).some((element) => !element)) return;

  const activeFilters = [];

  function selectIssue(id) {
    const issue = issues.find((candidate) => candidate.id === Number(id));
    if (!issue) return;

    renderDetail(issue, elements);
  }

  function openIssueDetailModal() {
    elements.detailModalOverlay.hidden = false;
  }

  function closeIssueDetailModal() {
    elements.detailModalOverlay.hidden = true;
  }

  function openIssue(id) {
    selectIssue(id);
    openIssueDetailModal();
  }

  elements.detailModalOverlay.addEventListener('click', (event) => {
    if (event.target === elements.detailModalOverlay) closeIssueDetailModal();
  });

  elements.detailModalOverlay.querySelectorAll('[data-modal-close]').forEach((button) => {
    button.addEventListener('click', closeIssueDetailModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !elements.detailModalOverlay.hidden) {
      closeIssueDetailModal();
    }
  });

  function renderOverview() {
    const filteredIssues = issues.filter((issue) => issueMatchesFilters(issue, activeFilters));
    const groupedIssues = Object.fromEntries(issueOverviewGroups.map((group) => [group.id, []]));
    filteredIssues.forEach((issue) => {
      groupedIssues[getOverviewMeta(issue).group]?.push(issue);
    });

    elements.table.classList.add('issue-table--grouped');
    elements.table.replaceChildren(createHeaderRow());
    issueOverviewGroups.forEach((group) => {
      const groupIssues = groupedIssues[group.id] ?? [];
      if (groupIssues.length === 0) return;
      elements.table.appendChild(createGroupHeader(group, groupIssues.length));
      groupIssues.forEach((issue) => {
        elements.table.appendChild(createIssueRow(issue, openIssue));
      });
    });

    if (filteredIssues.length === 0) {
      elements.table.appendChild(createEmptyRow());
    }

    if (filteredIssues[0]) selectIssue(filteredIssues[0].id);
  }

  function removeFilter(index) {
    activeFilters.splice(index, 1);
    renderSearchTokens(elements, activeFilters, removeFilter, editFilter);
    renderOverview();
    elements.searchInput.focus();
  }

  function editFilter(index) {
    const [filter] = activeFilters.splice(index, 1);
    if (!filter) return;

    elements.searchInput.value = filter.field === 'text' ? filter.value : `${filter.label}: ${filter.value}`;
    renderSearchTokens(elements, activeFilters, removeFilter, editFilter);
    renderOverview();
    elements.searchInput.focus();
    elements.searchInput.select();
    updateSuggestions(findFilterSuggestions(elements.searchInput.value));
  }

  function commitSearchFilter(suggestion) {
    if (!suggestion?.value) return;
    const alreadyActive = activeFilters.some(
      (filter) => filter.field === suggestion.field && filter.value === suggestion.value
    );
    if (alreadyActive) return;
    activeFilters.push(suggestion);
    elements.searchInput.value = '';
    currentSuggestions = [];
    activeSuggestionIndex = 0;
    renderSuggestion(elements, [], commitSearchFilter);
    renderSearchTokens(elements, activeFilters, removeFilter, editFilter);
    renderOverview();
  }

  let currentSuggestions = [];
  let activeSuggestionIndex = 0;

  function updateSuggestions(suggestions) {
    currentSuggestions = suggestions;
    activeSuggestionIndex = 0;
    renderSuggestion(elements, currentSuggestions, commitSearchFilter, activeSuggestionIndex);
  }

  elements.smartSearch.addEventListener('click', () => elements.searchInput.focus());
  elements.searchInput.addEventListener('input', () => {
    updateSuggestions(findFilterSuggestions(elements.searchInput.value));
  });
  elements.searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' && currentSuggestions.length > 0) {
      event.preventDefault();
      activeSuggestionIndex = (activeSuggestionIndex + 1) % currentSuggestions.length;
      renderSuggestion(elements, currentSuggestions, commitSearchFilter, activeSuggestionIndex);
      return;
    }

    if (event.key === 'ArrowUp' && currentSuggestions.length > 0) {
      event.preventDefault();
      activeSuggestionIndex = (activeSuggestionIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
      renderSuggestion(elements, currentSuggestions, commitSearchFilter, activeSuggestionIndex);
      return;
    }

    if (event.key === 'Escape' && currentSuggestions.length > 0) {
      event.preventDefault();
      updateSuggestions([]);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      commitSearchFilter(currentSuggestions[activeSuggestionIndex] ?? findFilterSuggestions(elements.searchInput.value)[0]);
      return;
    }

    if (event.key === 'Backspace' && elements.searchInput.value === '' && activeFilters.length > 0) {
      activeFilters.pop();
      renderSearchTokens(elements, activeFilters, removeFilter, editFilter);
      renderOverview();
    }
  });
  elements.searchInput.addEventListener('blur', () => {
    window.setTimeout(() => updateSuggestions([]), 120);
  });

  if (elements.filterMenu) renderFilterMenu(elements.filterMenu, commitSearchFilter);

  renderSearchTokens(elements, activeFilters, removeFilter, editFilter);
  renderOverview();
}
