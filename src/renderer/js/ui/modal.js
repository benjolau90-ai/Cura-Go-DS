export function initFeedbackModal() {
  const feedbackModalOverlay = document.getElementById('feedbackModalOverlay');
  const openFeedbackModalBtn = document.getElementById('openFeedbackModal');
  const editEntryBtn = document.getElementById('editEntryBtn');

  if (!feedbackModalOverlay) return;

  function openFeedbackModal() {
    feedbackModalOverlay.hidden = false;
  }

  function closeFeedbackModal() {
    feedbackModalOverlay.hidden = true;
  }

  openFeedbackModalBtn?.addEventListener('click', openFeedbackModal);
  editEntryBtn?.addEventListener('click', openFeedbackModal);

  feedbackModalOverlay.addEventListener('click', (event) => {
    if (event.target === feedbackModalOverlay) closeFeedbackModal();
  });

  feedbackModalOverlay.querySelectorAll('[data-modal-close]').forEach((button) => {
    button.addEventListener('click', closeFeedbackModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !feedbackModalOverlay.hidden) {
      closeFeedbackModal();
    }
  });
}
