// Action Menu: Kebab-/Overflow-Menü. Markup-getrieben – jeder Wrapper mit
// [data-action-menu] enthält einen Trigger [data-action-menu-trigger] und
// ein .menu-surface (das Overlay-Panel). JS übernimmt nur Verhalten
// (Öffnen/Schließen, Fokus, Tastatur, Kollisions-Flip); die Positionierung
// selbst ist CSS (siehe ".action-menu" in style.css, gleiche Konvention
// wie .split-button__menu/.sidebar-more__menu: position:absolute im
// position:relative-Wrapper statt JS-Rect-Tracking wie beim Tooltip).
//
// Verhalten:
// - Trigger ist Klick, nicht Hover (anders als Tooltip) – ein Menü ist
//   eine Liste von Aktionen, kein passiver Hinweistext.
// - Pfeil runter/hoch bewegt den Fokus durch die aktivierten Items,
//   Home/End springen an Anfang/Ende.
// - Escape schließt und gibt den Fokus zurück an den Trigger.
// - Klick außerhalb oder Klick auf ein Item schließt. Immer nur ein Menü
//   gleichzeitig offen.
// - role="menu"/"menuitem" + aria-haspopup/aria-expanded auf dem Trigger.
//
// Bewusst nicht Teil dieser ersten Version: Submenüs (Figmas arrowRight-
// Slot auf ActionMenuItem) und Checkbox-/Radio-Items, die das Menü nach
// Auswahl offen halten müssten – beides eigene Tasks, da verschachtelte
// Menüs bzw. persistente Auswahl eigene Fokus-/Tastatur-Logik brauchen.

const VIEWPORT_MARGIN = 8;

export function initActionMenus() {
  const groups = document.querySelectorAll('[data-action-menu]');
  if (!groups.length) return;

  let openGroup = null;

  function items(group) {
    return Array.from(group.querySelectorAll('.menu-surface [role="menuitem"]:not(:disabled)')).filter(
      (item) => item.offsetParent !== null
    );
  }

  function close(group, { focusTrigger = false } = {}) {
    const trigger = group.querySelector('[data-action-menu-trigger]');
    const surface = group.querySelector('.menu-surface');
    if (!surface || surface.hidden) return;
    surface.hidden = true;
    group.classList.remove('action-menu--open', 'action-menu--align-left', 'action-menu--open-up');
    trigger?.setAttribute('aria-expanded', 'false');
    if (openGroup === group) openGroup = null;
    if (focusTrigger) trigger?.focus();
  }

  function closeAllExcept(group) {
    groups.forEach((other) => {
      if (other !== group) close(other);
    });
  }

  function position(group) {
    const surface = group.querySelector('.menu-surface');
    if (!surface) return;
    // Erst den Default-Zustand (rechtsbündig, unterhalb) rendern lassen,
    // dann gegen den Viewport prüfen und bei Bedarf flippen.
    group.classList.remove('action-menu--align-left', 'action-menu--open-up');
    let rect = surface.getBoundingClientRect();
    if (rect.left < VIEWPORT_MARGIN) {
      group.classList.add('action-menu--align-left');
    }
    rect = surface.getBoundingClientRect();
    if (rect.bottom > window.innerHeight - VIEWPORT_MARGIN) {
      group.classList.add('action-menu--open-up');
    }
  }

  function open(group) {
    const trigger = group.querySelector('[data-action-menu-trigger]');
    const surface = group.querySelector('.menu-surface');
    if (!surface) return;
    closeAllExcept(group);
    surface.hidden = false;
    group.classList.add('action-menu--open');
    trigger?.setAttribute('aria-expanded', 'true');
    openGroup = group;
    position(group);
    items(group)[0]?.focus();
  }

  function toggle(group) {
    const surface = group.querySelector('.menu-surface');
    if (surface && surface.hidden === false) {
      close(group, { focusTrigger: true });
    } else {
      open(group);
    }
  }

  groups.forEach((group) => {
    const trigger = group.querySelector('[data-action-menu-trigger]');
    const surface = group.querySelector('.menu-surface');
    if (!trigger || !surface) return;

    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', 'false');
    surface.setAttribute('role', 'menu');
    surface.querySelectorAll('button').forEach((button) => {
      if (!button.hasAttribute('role')) button.setAttribute('role', 'menuitem');
    });

    trigger.addEventListener('click', () => toggle(group));

    surface.addEventListener('click', (event) => {
      if (event.target.closest('[role="menuitem"]')) {
        close(group);
      }
    });

    surface.addEventListener('keydown', (event) => {
      const list = items(group);
      const currentIndex = list.indexOf(document.activeElement);

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        list[(currentIndex + 1) % list.length]?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        list[(currentIndex - 1 + list.length) % list.length]?.focus();
      } else if (event.key === 'Home') {
        event.preventDefault();
        list[0]?.focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        list[list.length - 1]?.focus();
      } else if (event.key === 'Tab') {
        close(group);
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && openGroup) {
      close(openGroup, { focusTrigger: true });
    }
  });

  document.addEventListener('click', (event) => {
    if (openGroup && !openGroup.contains(event.target)) {
      close(openGroup);
    }
  });

  window.addEventListener('resize', () => {
    if (openGroup) close(openGroup);
  });
}
