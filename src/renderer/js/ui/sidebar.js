export function initSidebarHover() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  let sidebarHoverTimer = null;

  sidebar.addEventListener('mouseenter', () => {
    clearTimeout(sidebarHoverTimer);
    sidebarHoverTimer = setTimeout(() => {
      sidebar.classList.add('sidebar--expanded');
    }, 150);
  });

  sidebar.addEventListener('mouseleave', () => {
    clearTimeout(sidebarHoverTimer);
    sidebarHoverTimer = setTimeout(() => {
      sidebar.classList.remove('sidebar--expanded');
    }, 300);
  });
}
