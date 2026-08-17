export function makeResizable(handle, targetEl, { min, max, invert = false }) {
  if (!handle || !targetEl) return;

  let startX = 0;
  let startWidth = 0;

  function onPointerMove(event) {
    const delta = invert ? event.clientX - startX : startX - event.clientX;
    const newWidth = Math.min(max, Math.max(min, startWidth + delta));
    targetEl.style.flex = 'none';
    targetEl.style.width = `${newWidth}px`;
  }

  function onPointerUp() {
    handle.classList.remove('resize-handle--active');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('mouseup', onPointerUp);
  }

  handle.addEventListener('mousedown', (event) => {
    startX = event.clientX;
    startWidth = targetEl.getBoundingClientRect().width;
    handle.classList.add('resize-handle--active');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    event.preventDefault();
  });
}

export function initResizableLayouts() {
  makeResizable(
    document.getElementById('resizeHandle'),
    document.getElementById('listPanel'),
    { min: 380, max: 720, invert: true }
  );

  makeResizable(
    document.getElementById('resizeHandleSeamless'),
    document.getElementById('seamlessSide'),
    { min: 200, max: 900 }
  );

  makeResizable(
    document.getElementById('resizeHandleDetail'),
    document.getElementById('detailSidepanel'),
    { min: 260, max: 640 }
  );

  makeResizable(
    document.getElementById('resizeHandleLayout1'),
    document.getElementById('emptyListPanel'),
    { min: 380, max: 720, invert: true }
  );

  makeResizable(
    document.getElementById('resizeHandleLayout5'),
    document.getElementById('layout5Sidepanel'),
    { min: 260, max: 640 }
  );
}
