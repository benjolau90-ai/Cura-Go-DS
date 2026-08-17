import { initActionMenus } from './js/ui/action-menu.js';
import { initHandoverView } from './js/features/handover-view.js';
import { initIssuesView } from './js/features/issues-view.js';
import { initSurfacesView } from './js/features/surfaces-view.js';
import { initVertragDetailView } from './js/features/vertrag-detail-view.js';
import { initVertragOverviewView } from './js/features/vertrag-overview-view.js';
import { initFeedbackModal } from './js/ui/modal.js';
import { initViewNavigation } from './js/ui/navigation.js?v=2';
import { initResizableLayouts } from './js/ui/resizable.js';
import { initSidebarHover } from './js/ui/sidebar.js';
import { initTooltips } from './js/ui/tooltip.js';
import { initWindowControls } from './js/ui/window-controls.js';

const isElectron = navigator.userAgent.includes('Electron');
document.documentElement.classList.add(isElectron ? 'is-electron' : 'is-browser');

initWindowControls();
initResizableLayouts();
initHandoverView();
initIssuesView();
initSurfacesView();
initVertragDetailView();
initVertragOverviewView();
initSidebarHover();
initViewNavigation();
initFeedbackModal();
initTooltips();
initActionMenus();
