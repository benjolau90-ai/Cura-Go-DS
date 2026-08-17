export function initViewNavigation() {
  const titleBarTitle = document.getElementById('titleBarTitle');
  const appRoot = document.querySelector('.main-view');
  const sidebar = document.getElementById('sidebar');
  const layoutGroup = document.getElementById('sidebarLayouts');
  const layoutTrigger = layoutGroup?.querySelector('.sidebar-layouts__trigger');
  const surfaceGroup = document.getElementById('sidebarSurfaces');
  const surfaceTrigger = surfaceGroup?.querySelector('.sidebar-layouts__trigger');
  const moreGroup = document.getElementById('sidebarMore');
  const moreTrigger = moreGroup?.querySelector('.sidebar-more__trigger');
  const layoutViews = new Set(['split', 'table-block', 'split-seamless', 'column-grid', 'detail-topbar']);
  const navButtons = document.querySelectorAll('.sidebar-icon[data-view], .menu-item[data-view], .sidebar-subitem[data-view]');
  const viewShells = document.querySelectorAll('.content-shell[id^="view-"]');

  function toggleGroup(group, trigger) {
    sidebar?.classList.add('sidebar--expanded');
    const isOpen = group.classList.toggle('sidebar-layouts--open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  }

  function closeGroup(group, trigger) {
    group?.classList.remove('sidebar-layouts--open');
    trigger?.setAttribute('aria-expanded', 'false');
  }

  layoutTrigger?.addEventListener('click', () => {
    toggleGroup(layoutGroup, layoutTrigger);
    closeGroup(surfaceGroup, surfaceTrigger);
  });

  surfaceTrigger?.addEventListener('click', () => {
    toggleGroup(surfaceGroup, surfaceTrigger);
    closeGroup(layoutGroup, layoutTrigger);
  });

  // "Mehr"-Overflow (nur Bottom-Bar <=1024px relevant, auf Desktop
  // unsichtbar/inert): eigenes, einfacheres Toggle ohne sidebar--expanded,
  // da das eine reine Vertikal-Rail-Mechanik ist.
  moreTrigger?.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = moreGroup.classList.toggle('sidebar-more--open');
    moreTrigger.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (moreGroup?.classList.contains('sidebar-more--open') && !moreGroup.contains(event.target)) {
      moreGroup.classList.remove('sidebar-more--open');
      moreTrigger?.setAttribute('aria-expanded', 'false');
    }
  });

  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const activeView = button.dataset.view;
      const isLayoutView = layoutViews.has(activeView);
      const isSurfaceView = activeView === 'surfaces';
      const surfaceTarget = button.dataset.surfaceTarget;

      viewShells.forEach((target) => {
        target.hidden = target.id !== `view-${activeView}`;
      });

      navButtons.forEach((candidate) => {
        const isSelected = candidate === button;
        candidate.classList.toggle('sidebar-icon--selected', candidate.classList.contains('sidebar-icon') && isSelected);
        candidate.classList.toggle('menu-item--selected', candidate.classList.contains('menu-item') && isSelected);
        candidate.classList.toggle('sidebar-subitem--selected', candidate.classList.contains('sidebar-subitem') && isSelected);
      });

      layoutTrigger?.classList.toggle('sidebar-icon--selected', isLayoutView);
      if (isLayoutView) {
        layoutGroup?.classList.add('sidebar-layouts--open');
        layoutTrigger?.setAttribute('aria-expanded', 'true');
        closeGroup(surfaceGroup, surfaceTrigger);
      } else {
        closeGroup(layoutGroup, layoutTrigger);
      }

      surfaceTrigger?.classList.toggle('sidebar-icon--selected', isSurfaceView);
      if (isSurfaceView) {
        appRoot?.classList.add('main-view--surface-demo');
        surfaceGroup?.classList.add('sidebar-layouts--open');
        surfaceTrigger?.setAttribute('aria-expanded', 'true');
        closeGroup(layoutGroup, layoutTrigger);
        if (surfaceTarget) {
          document.querySelector(`#view-surfaces [data-surface-page="${surfaceTarget}"]`)?.click();
        }
      } else {
        appRoot?.classList.remove('main-view--surface-demo');
        closeGroup(surfaceGroup, surfaceTrigger);
      }

      if (titleBarTitle) {
        titleBarTitle.textContent = button.dataset.title ?? '';
      }

      if (moreGroup?.classList.contains('sidebar-more--open')) {
        moreGroup.classList.remove('sidebar-more--open');
        moreTrigger?.setAttribute('aria-expanded', 'false');
      }
    });
  });
}
