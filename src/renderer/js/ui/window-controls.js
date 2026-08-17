export function initWindowControls() {
  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      window.desktopLayout?.windowAction(button.dataset.action);
    });
  });
}
