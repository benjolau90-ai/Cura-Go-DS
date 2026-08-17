const SURFACE_REPORTS = {
  transport: {
    title: 'Fahrdienst bestellen',
    meta: 'Margarete Schulz · Termin · heute 9:24 Uhr',
    body: 'Nachkontrolle bei Dr. Scholz am Mittwoch um 10:30 Uhr. Fahrdienst bitte bis morgen bestellen, damit die Abfahrt um 10:00 Uhr klappt.',
    status: 'Offen',
    chipClass: 'chip--warning',
    footer: 'Gelesen von Lisa Bachmann und 3 weiteren',
    popover: 'Aktionen bleiben als Glass Overlay ueber dem Bericht, weil sie kurzlebig sind und den Lesekontext nicht ersetzen.',
  },
  meds: {
    title: 'Medikation nachtragen',
    meta: 'Jonas Richter · Pflege · heute 8:10 Uhr',
    body: 'Die neue Abendmedikation ist angeordnet, aber im Pflegebericht noch nicht gegengezeichnet. Bitte Dosierung pruefen und im Verlauf dokumentieren.',
    status: 'Wichtig',
    chipClass: 'chip--error',
    footer: 'Noch ungelesen von der Spaetschicht',
    popover: 'Wichtige Entscheidungen duerfen kurzfristig nach vorne kommen, ohne die solide Content-Flaeche umzubauen.',
  },
  done: {
    title: 'Verbandswechsel dokumentiert',
    meta: 'Elisabeth Weber · Wunde · gestern 18:42 Uhr',
    body: 'Verbandswechsel wurde abgeschlossen. Wundrand reizlos, kein Naessen. Kontrolle morgen im Fruehdienst einplanen.',
    status: 'Erledigt',
    chipClass: 'chip--success',
    footer: 'Gelesen von allen Empfaengern',
    popover: 'Bei erledigten Eintraegen bleibt die Aktion leicht und reversibel: Overlay statt neuer Seite.',
  },
};

const SURFACE_PAGE_ORDER = ['app-bg', 'app-chrome', 'content-shell', 'content-surfaces', 'modal-overlay'];

function chipHtml(report) {
  return `<span class="chip chip--status ${report.chipClass}">${report.status}</span>`;
}

export function initSurfacesView() {
  const root = document.getElementById('view-surfaces');
  if (!root) return;

  const appRoot = document.querySelector('.main-view');
  const title = root.querySelector('#surfaceReportTitle');
  const meta = root.querySelector('#surfaceReportMeta');
  const body = root.querySelector('#surfaceReportBody');
  const footer = root.querySelector('#surfaceFooterText');
  const popover = root.querySelector('#surfacePopover');
  const popoverText = root.querySelector('#surfacePopoverText');
  const actionsButton = root.querySelector('#surfaceActionsButton');
  const closePopover = root.querySelector('#surfaceClosePopover');
  const readButton = root.querySelector('#surfaceReadButton');
  const escalateButton = root.querySelector('#surfaceEscalateButton');
  const rows = root.querySelectorAll('.surface-raised-row[data-surface-entry]');
  const filters = root.querySelectorAll('.surface-nav-pill[data-surface-filter]');
  const pageTabs = root.querySelectorAll('[data-surface-page]');
  const pages = root.querySelectorAll('.surface-page[data-surface-page-panel]');
  const overviewCards = root.querySelectorAll('.surface-overview-card[data-surface-goto]');

  let selectedKey = 'transport';
  let unread = true;
  let activePage = 'app-bg';

  function activatePage(pageName) {
    activePage = SURFACE_PAGE_ORDER.includes(pageName) ? pageName : 'app-bg';
    if (appRoot) {
      appRoot.dataset.surfaceLevel = activePage;
    }

    pageTabs.forEach((tab) => {
      const isActive = tab.dataset.surfacePage === activePage;
      tab.classList.toggle('surface-tab--active', isActive);
      tab.classList.toggle('surface-step--active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    pages.forEach((page) => {
      page.hidden = page.dataset.surfacePagePanel !== activePage;
    });
  }

  function renderSelected(nextKey) {
    selectedKey = nextKey;
    const report = SURFACE_REPORTS[selectedKey];
    if (!report) return;

    title.textContent = report.title;
    meta.textContent = report.meta;
    body.innerHTML = `<p>${report.body}</p>`;
    footer.textContent = unread ? report.footer : 'Du hast diesen Eintrag gerade als gelesen markiert';
    popoverText.textContent = report.popover;

    rows.forEach((row) => {
      const isSelected = row.dataset.surfaceEntry === selectedKey;
      row.classList.toggle('surface-raised-row--selected', isSelected);
      row.setAttribute('aria-pressed', String(isSelected));
    });

    popover.classList.add('surface-popover--open');
  }

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      unread = true;
      renderSelected(row.dataset.surfaceEntry);
    activatePage('content-surfaces');
    });
  });

  filters.forEach((filter) => {
    filter.addEventListener('click', () => {
      filters.forEach((candidate) => {
        candidate.classList.toggle('surface-nav-pill--active', candidate === filter);
      });

      const target = filter.dataset.surfaceFilter === 'urgent' ? 'meds' : filter.dataset.surfaceFilter === 'done' ? 'done' : 'transport';
      unread = true;
      renderSelected(target);
      activatePage('content-surfaces');
    });
  });

  pageTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activatePage(tab.dataset.surfacePage);
    });
  });

  overviewCards.forEach((card) => {
    card.addEventListener('click', () => {
      activatePage(card.dataset.surfaceGoto);
    });
  });

  actionsButton?.addEventListener('click', () => {
    popover.classList.add('surface-popover--open');
    activatePage('overlay');
  });

  closePopover?.addEventListener('click', () => {
    popover.classList.remove('surface-popover--open');
  });

  readButton?.addEventListener('click', () => {
    unread = false;
    footer.textContent = 'Du hast diesen Eintrag gerade als gelesen markiert';
    activatePage('modal-overlay');
  });

  escalateButton?.addEventListener('click', () => {
    const selectedRow = root.querySelector(`.surface-raised-row[data-surface-entry="${selectedKey}"]`);
    if (selectedRow) {
      selectedRow.querySelector('.chip')?.remove();
      selectedRow.insertAdjacentHTML('beforeend', chipHtml({ status: 'Wichtig', chipClass: 'chip--error' }));
    }
    popoverText.textContent = 'Die Auswahl bekommt Interaction-Elevation; der Bericht selbst bleibt ruhig und lesbar.';
    activatePage('content-surfaces');
  });

  renderSelected(selectedKey);
  activatePage('app-bg');
}
