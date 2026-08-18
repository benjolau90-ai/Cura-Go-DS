const isElectron = navigator.userAgent.includes('Electron');
document.documentElement.classList.add(isElectron ? 'is-electron' : 'is-browser');

const sidebar = document.getElementById('intensivSidebar');
const sectionLabel = document.getElementById('currentSection');
const app = document.querySelector('.intensiv-app');
const buttons = document.querySelectorAll('.sidebar-icon[data-section]');
const pages = document.querySelectorAll('.intensiv-page[data-page]');
const switches = document.querySelectorAll('.switch[aria-pressed]');
const segmentedControls = document.querySelectorAll('.segmented-control');
const analysisMeasureSelect = document.querySelector('[data-analysis-measure-select]');
const analysisMeasureLabel = document.querySelector('[data-analysis-measure-label]');
const analysisMeasureChips = document.querySelector('[data-analysis-measure-chips]');
const analysisEmpty = document.querySelector('[data-analysis-empty]');
const analysisResults = document.querySelector('[data-analysis-results]');
const analysisExport = document.querySelector('[data-analysis-export]');
const analysisSurface = document.querySelector('.analysis-surface');
const backgroundCycle = document.querySelector('[data-bg-cycle]');
const backgroundLabel = document.querySelector('[data-bg-label]');

let analysisHasValidSelection = false;

const backgroundModes = [
  { id: 'edge', label: 'Kante' },
  { id: 'wash', label: 'Wash' },
  { id: 'plain', label: 'Mist' },
  { id: 'mesh', label: 'Mesh' },
  { id: 'paper', label: 'Papier' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'blend', label: 'Blend' },
];

let backgroundModeIndex = 0;

function setBackgroundMode(index) {
  backgroundModeIndex = (index + backgroundModes.length) % backgroundModes.length;
  const mode = backgroundModes[backgroundModeIndex];
  app?.setAttribute('data-bg-mode', mode.id);
  if (backgroundLabel) backgroundLabel.textContent = `${backgroundModeIndex + 1}/${backgroundModes.length} ${mode.label}`;
  try {
    localStorage.setItem('intensivBackgroundMode', mode.id);
  } catch {
    // Storage is optional in local previews.
  }
}

const savedBackgroundMode = (() => {
  try {
    return localStorage.getItem('intensivBackgroundMode');
  } catch {
    return null;
  }
})();

const savedBackgroundModeIndex = backgroundModes.findIndex((mode) => mode.id === savedBackgroundMode);
setBackgroundMode(savedBackgroundModeIndex >= 0 ? savedBackgroundModeIndex : 0);

backgroundCycle?.addEventListener('click', () => {
  setBackgroundMode(backgroundModeIndex + 1);
});

const planningPreviewIcons = {
  danger: [
    'M13 20.3025C12.1525 20.6505 11.1746 20.5389 10.4107 19.9677C7.58942 17.858 2 13.0348 2 8.69444C2 5.82563 4.10526 3.5 7 3.5C8.5 3.5 10 4 12 6C14 4 15.5 3.5 17 3.5C19.8947 3.5 22 5.82563 22 8.69444C22 9.12591 21.9448 9.56214 21.8425 10',
    'M14 17C14 17 15 17 16 19C16 19 19.1765 14 22 13',
  ],
  success: [
    'M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z',
    'M8 12.5L10.5 15L16 9',
  ],
  info: [
    'M10 5H4M14 5H20',
    'M17 21H7',
    'M12 7V21',
    'M16 14L18.5 8H19.5L22 14C22 15.6569 20.6569 17 19 17C17.3431 17 16 15.6569 16 14ZM22 14H16',
    'M2 14L4.5 8H5.5L8 14C8 15.6569 6.65685 17 5 17C3.34315 17 2 15.6569 2 14ZM8 14H2',
  ],
  note: [
    'M21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C10.3719 21.5 8.8394 21.0904 7.5 20.3687C5.63177 19.362 4.37462 20.2979 3.26592 20.4658C3.09774 20.4913 2.93024 20.4302 2.80997 20.31C2.62741 20.1274 2.59266 19.8451 2.6935 19.6074C3.12865 18.5818 3.5282 16.6382 2.98341 15C2.6698 14.057 2.5 13.0483 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12Z',
    'M12.1257 12H12.0007M8.125 12H8M16.125 12H16',
  ],
};

sidebar?.addEventListener('mouseenter', () => sidebar.classList.add('sidebar--expanded'));
sidebar?.addEventListener('focusin', () => sidebar.classList.add('sidebar--expanded'));

function setActivePage(activePage, activeButton) {
  app?.setAttribute('data-active-page', activePage);
  buttons.forEach((candidate) => candidate.classList.remove('sidebar-icon--selected'));
  activeButton?.classList.add('sidebar-icon--selected');
  pages.forEach((page) => {
    page.hidden = page.dataset.page !== activePage;
  });
  if (sectionLabel && activeButton) sectionLabel.textContent = activeButton.textContent.trim();
}

function getAnalysisMode() {
  const selected = document.querySelector('.analysis-segmented .is-selected');
  return selected?.textContent.trim().toLowerCase() === 'tabelle' ? 'tabelle' : 'kurve';
}

function updateAnalysisState() {
  if (!analysisEmpty || !analysisResults) return;
  analysisSurface?.classList.toggle('is-showing-results', analysisHasValidSelection);
  analysisEmpty.hidden = analysisHasValidSelection;
  analysisEmpty.setAttribute('aria-hidden', String(analysisHasValidSelection));
  analysisResults.hidden = !analysisHasValidSelection;
  analysisResults.setAttribute('aria-hidden', String(!analysisHasValidSelection));
  if (analysisExport) analysisExport.disabled = !analysisHasValidSelection;

  const mode = getAnalysisMode();
  document.querySelectorAll('[data-analysis-view]').forEach((view) => {
    view.hidden = !analysisHasValidSelection || view.dataset.analysisView !== mode;
  });
}

function createPlanningPreviewIcon(type) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'icon icon--xs');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');

  if (type === 'info') {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '5');
    circle.setAttribute('r', '2');
    circle.setAttribute('stroke', 'currentColor');
    circle.setAttribute('stroke-linecap', 'round');
    circle.setAttribute('stroke-linejoin', 'round');
    circle.setAttribute('stroke-width', '1.5');
    svg.appendChild(circle);
  }

  planningPreviewIcons[type].forEach((pathData) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-width', '1.5');
    svg.appendChild(path);
  });

  return svg;
}

document.querySelectorAll('.planning-chip').forEach((chip) => {
  if (chip.querySelector('.icon')) return;
  const type = ['danger', 'success', 'info', 'note'].find((candidate) => chip.classList.contains(`planning-chip--${candidate}`));
  if (!type) return;
  chip.prepend(createPlanningPreviewIcon(type));
});

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    setActivePage(button.dataset.section, button);
  });
});

const initialButton = document.querySelector('.sidebar-icon--selected[data-section]') || buttons[0];
if (initialButton) setActivePage(initialButton.dataset.section, initialButton);

switches.forEach((switchControl) => {
  switchControl.addEventListener('click', () => {
    const isOn = switchControl.getAttribute('aria-pressed') === 'true';
    switchControl.setAttribute('aria-pressed', String(!isOn));
    switchControl.classList.toggle('is-on', !isOn);
  });
});

segmentedControls.forEach((control) => {
  const items = control.querySelectorAll('.segmented-control__item');
  items.forEach((item) => {
    item.addEventListener('click', () => {
      items.forEach((candidate) => {
        const isSelected = candidate === item;
        candidate.classList.toggle('is-selected', isSelected);
        candidate.setAttribute('aria-selected', String(isSelected));
      });
      updateAnalysisState();
    });
  });
});

document.querySelectorAll('.analysis-view-switch').forEach((control) => {
  const items = control.querySelectorAll('.analysis-view-switch__item');
  items.forEach((item) => {
    item.addEventListener('click', () => {
      items.forEach((candidate) => {
        const isSelected = candidate === item;
        candidate.classList.toggle('is-selected', isSelected);
        candidate.setAttribute('aria-selected', String(isSelected));
      });
      updateAnalysisState();
    });
  });
});

analysisMeasureSelect?.addEventListener('click', () => {
  analysisHasValidSelection = true;
  analysisMeasureSelect.classList.remove('analysis-select--placeholder');
  analysisMeasureSelect.setAttribute('aria-pressed', 'true');
  if (analysisMeasureLabel) analysisMeasureLabel.textContent = 'Herzfrequenz, Körpertemperatur';
  if (analysisMeasureChips) analysisMeasureChips.hidden = false;
  updateAnalysisState();
});

updateAnalysisState();
