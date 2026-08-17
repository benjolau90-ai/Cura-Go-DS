// Tooltip: ein einziges, wiederverwendetes DOM-Element für alle Trigger.
// Trigger = jedes Element mit [data-tooltip="Text"].
//
// Verhalten (siehe Design-System-Regeln für Tooltips):
// - Trigger sind Hover UND Keyboard-Focus, nie Klick (das wäre ein Popover).
// - Erscheint verzögert (SHOW_DELAY_MS), verschwindet sofort, keine Delay.
// - Escape schließt es, auch wenn der Trigger weiter fokussiert ist.
// - Reiner Text, keine interaktiven Inhalte.
// - Position: rechts neben dem Trigger, mit leichtem Down-Offset (nicht exakt
//   flush an der Trigger-Oberkante). Wenn rechts nicht genug Platz ist,
//   klappt es auf die linke Seite.
// - aria-describedby verbindet Trigger und Tooltip nur während es sichtbar ist.

const SHOW_DELAY_MS = 450;
const VIEWPORT_MARGIN = 8;
const SIDE_GAP = 8; // Abstand Trigger <-> Tooltip auf der rechten/linken Seite.
// Leichter Down-Offset zur Trigger-Oberkante, damit das Tooltip nicht exakt
// flush abschließt – Wert deckt sich mit `.tooltip-demo .tooltip { margin-top: 2px }`
// in DesignSystem/navigation.css, damit App und Doku-Preview übereinstimmen.
const DOWN_OFFSET = 2;

export function initTooltips() {
  const triggers = document.querySelectorAll('[data-tooltip]');
  if (!triggers.length) return;

  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.id = 'sharedTooltip';
  tooltip.setAttribute('role', 'tooltip');
  document.body.appendChild(tooltip);

  let showTimer = null;
  let activeTrigger = null;

  function position(trigger) {
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Standard: rechts neben dem Trigger.
    let left = triggerRect.right + SIDE_GAP;
    // Kollision rechts: nicht genug Platz -> auf die linke Seite klappen.
    if (left + tooltipRect.width + VIEWPORT_MARGIN > window.innerWidth) {
      left = triggerRect.left - SIDE_GAP - tooltipRect.width;
    }
    // Randfall: passt auf keine der beiden Seiten (sehr schmales Fenster) ->
    // wenigstens innerhalb des Viewports bleiben statt abgeschnitten zu sein.
    left = Math.max(VIEWPORT_MARGIN, Math.min(left, window.innerWidth - tooltipRect.width - VIEWPORT_MARGIN));

    let top = triggerRect.top + DOWN_OFFSET;
    top = Math.max(VIEWPORT_MARGIN, Math.min(top, window.innerHeight - tooltipRect.height - VIEWPORT_MARGIN));

    tooltip.style.top = `${Math.round(top)}px`;
    tooltip.style.left = `${Math.round(left)}px`;
  }

  function show(trigger) {
    const text = trigger.getAttribute('data-tooltip');
    if (!text) return;
    tooltip.textContent = text;
    activeTrigger = trigger;
    trigger.setAttribute('aria-describedby', tooltip.id);
    // Erst rendern (für korrekte Maße), dann positionieren, dann einblenden.
    tooltip.classList.add('tooltip--visible');
    position(trigger);
  }

  function hide() {
    clearTimeout(showTimer);
    showTimer = null;
    tooltip.classList.remove('tooltip--visible');
    activeTrigger?.removeAttribute('aria-describedby');
    activeTrigger = null;
  }

  function scheduleShow(trigger) {
    clearTimeout(showTimer);
    showTimer = setTimeout(() => show(trigger), SHOW_DELAY_MS);
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('mouseenter', () => scheduleShow(trigger));
    trigger.addEventListener('mouseleave', hide);
    trigger.addEventListener('focus', () => scheduleShow(trigger));
    trigger.addEventListener('blur', hide);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeTrigger) hide();
  });

  // Scroll/Resize invalidieren die Position (Panels scrollen unabhängig
  // vom Fenster) – einfachste robuste Lösung: Tooltip verstecken statt
  // mitzuverfolgen, konsistent mit "verschwindet sofort ohne Delay".
  window.addEventListener('scroll', hide, true);
  window.addEventListener('resize', hide);
}
