const isElectron = navigator.userAgent.includes("Electron");
document.documentElement.classList.add(isElectron ? "is-electron" : "is-browser");

const pages = {
  benutzer: {
    title: "Benutzer",
    action: "Neuen Benutzer anlegen",
  },
  freigaben: {
    title: "Freigaben",
    action: "Neuen Benutzer anlegen",
  },
  ki: {
    title: "KI Einstellungen",
    action: "Neuen Benutzer anlegen",
  },
};

const navItems = document.querySelectorAll("[data-page]");
const panels = document.querySelectorAll("[data-page-panel]");
const pageTitle = document.querySelector("[data-page-title]");
const primaryAction = document.querySelector("[data-primary-action]");
const primaryActionLabel = document.querySelector("[data-primary-action-label]");
const userCreateSplit = document.querySelector("[data-user-create-split]");
const userCreateTrigger = document.querySelector("[data-user-create-trigger]");
const userCreateMenu = document.querySelector("[data-user-create-menu]");
const openUserWizardButtons = document.querySelectorAll("[data-open-user-wizard]");
const userRows = document.querySelectorAll("[data-user-detail]");
const userWizardModal = document.querySelector("[data-user-wizard-modal]");
const closeUserWizardButtons = document.querySelectorAll("[data-close-user-wizard]");
const wizardTitle = document.querySelector("#user-wizard-title");
const wizardSubtitle = document.querySelector("[data-wizard-subtitle]");
const wizardFlow = document.querySelector("[data-wizard-flow]");
const wizardPanels = Array.from(document.querySelectorAll("[data-wizard-step]"));
const wizardBackButton = document.querySelector("[data-wizard-back]");
const wizardNextButton = document.querySelector("[data-wizard-next]");
const wizardFooter = document.querySelector("[data-wizard-footer]");
const wizardSuccess = document.querySelector("[data-wizard-success]");
const successFooter = document.querySelector("[data-success-footer]");
const wizardDots = document.querySelector("[data-wizard-dots]");
const personCopy = document.querySelector("[data-person-copy]");
const nameLabel = document.querySelector("[data-name-label]");
const identityName = document.querySelector("[data-identity-name]");
const identityEmail = document.querySelector("[data-identity-email]");
const passwordModeInputs = document.querySelectorAll("[data-password-mode]");
const passwordOptions = document.querySelectorAll("[data-password-option]");
const passwordFields = document.querySelector("[data-password-fields]");
const appToggleButtons = document.querySelectorAll("[data-app-toggle]");
const rightsGroups = document.querySelectorAll("[data-rights-group]");
const summaryAccess = document.querySelector("[data-summary-access]");
const summaryEmail = document.querySelector("[data-summary-email]");
const summaryApps = document.querySelector("[data-summary-apps]");
const summaryRights = document.querySelector("[data-summary-rights]");
const summaryPassword = document.querySelector("[data-summary-password]");
const successTitle = document.querySelector("[data-success-title]");
const successCopy = document.querySelector("[data-success-copy]");
const successFooterMessage = document.querySelector("[data-success-footer-message]");
const detailName = document.querySelector("[data-detail-name]");
const detailMeta = document.querySelector("[data-detail-meta]");
const detailRole = document.querySelector("[data-detail-role]");
const detailEmail = document.querySelector("[data-detail-email]");
const detailStatus = document.querySelector("[data-detail-status]");
const detailCuraState = document.querySelector("[data-detail-cura-state]");
const detailCuraChip = document.querySelector("[data-detail-cura-chip]");
const detailCuraSoftChip = document.querySelector("[data-detail-curasoft-chip]");
const detailLink = document.querySelector("[data-detail-link]");
const detailTabs = document.querySelectorAll("[data-detail-tab]");
const detailTabPanels = document.querySelectorAll("[data-detail-tab-panel]");

let currentPage = "benutzer";
let accountType = "person";
let currentWizardStep = "identity";
const wizardStepOrder = ["identity", "password", "permissions", "invite"];

function getNavPage(page) {
  return page.startsWith("benutzer") ? "benutzer" : page;
}

function setPersonDetail(row) {
  const isInvited = row.dataset.userStatus === "Eingeladen";
  const hasCuraSoft = row.dataset.userLink.includes("aktiv");

  detailName.textContent = row.dataset.userName;
  detailMeta.textContent = `${row.dataset.userRole} · ${row.dataset.userEmail}`;
  detailRole.textContent = row.dataset.userRole;
  detailEmail.textContent = row.dataset.userEmail;
  detailStatus.textContent = row.dataset.userStatus;
  detailCuraState.textContent = isInvited ? "Einladung offen" : "Aktiv";
  detailLink.textContent = row.dataset.userLink;
  detailCuraChip.classList.toggle("chip--success", !isInvited);
  detailCuraChip.classList.toggle("chip--neutral", isInvited);
  detailCuraChip.classList.toggle("cura-system-chip--disabled", isInvited);
  detailCuraSoftChip.classList.toggle("chip--success", hasCuraSoft);
  detailCuraSoftChip.classList.toggle("chip--neutral", !hasCuraSoft);
  detailCuraSoftChip.classList.toggle("cura-system-chip--disabled", !hasCuraSoft);

  userRows.forEach((userRow) => {
    userRow.classList.toggle("cura-user-row--selected", userRow === row);
  });
}

function showDetailTab(tabName) {
  detailTabs.forEach((tab) => {
    const isActive = tab.dataset.detailTab === tabName;
    tab.classList.toggle("cura-detail-tab--active", isActive);
    tab.classList.toggle("is-selected", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  detailTabPanels.forEach((panel) => {
    panel.hidden = panel.dataset.detailTabPanel !== tabName;
  });
}

function showPage(page) {
  const nextPage = pages[page] ? page : "benutzer";
  const navPage = getNavPage(nextPage);
  currentPage = nextPage;

  navItems.forEach((item) => {
    const isActive = item.dataset.page === navPage;
    item.classList.toggle("cura-nav__item--active", isActive);
    item.classList.toggle("sidebar-icon--selected", isActive);
    item.toggleAttribute("aria-current", isActive);
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.pagePanel === nextPage;
    panel.classList.toggle("cura-page--active", isActive);
    panel.hidden = !isActive;
  });

  pageTitle.textContent = pages[nextPage].title;
  primaryActionLabel.textContent = pages[nextPage].action;
  window.history.replaceState(null, "", `#${nextPage}`);
}

function getVisibleWizardSteps() {
  return wizardStepOrder;
}

function deriveUsername(name, email) {
  const emailName = email.includes("@") ? email.split("@")[0] : "";
  const source = name.trim() || emailName || "neuer.benutzer";
  return source
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .replace(/\.+/g, ".");
}

function getActiveApps() {
  return Array.from(appToggleButtons)
    .filter((button) => button.classList.contains("cura-app-chip--active"))
    .map((button) => button.textContent.trim());
}

function getSelectedRights() {
  return Array.from(rightsGroups)
    .filter((group) => !group.hidden)
    .flatMap((group) => Array.from(group.querySelectorAll("input:checked")))
    .map((input) => input.dataset.rightLabel)
    .filter(Boolean);
}

function getPasswordMode() {
  return Array.from(passwordModeInputs).find((input) => input.checked)?.value || "generated";
}

function updatePasswordMode() {
  const mode = getPasswordMode();
  passwordFields.hidden = mode !== "manual";
  passwordOptions.forEach((option) => {
    const input = option.querySelector("[data-password-mode]");
    option.classList.toggle("cura-password-option--active", input?.checked);
  });
}

function updateAppVisibility() {
  appToggleButtons.forEach((button) => {
    const isActive = button.classList.contains("cura-app-chip--active");
    button.setAttribute("aria-pressed", String(isActive));
    const group = document.querySelector(`[data-rights-group="${button.dataset.appToggle}"]`);
    if (group) {
      group.hidden = !isActive;
    }
  });
}

function updateWizardCopy() {
  const isTechnical = accountType === "technical";
  wizardTitle.textContent = isTechnical ? "Technischen Zugang erstellen" : "cura.go-Zugang erstellen";
  wizardSubtitle.textContent = isTechnical
    ? "Funktionszugang anlegen."
    : "Benutzer anlegen.";
  personCopy.textContent = isTechnical
    ? "Sprechender Funktionsname und Kontakt reichen."
    : "Name und E-Mail reichen.";
  nameLabel.textContent = isTechnical ? "Funktionsname" : "Name";
  updateWizardSummary();
}

function updateWizardSummary() {
  const name = identityName.value.trim() || (accountType === "technical" ? "Technischer Zugang" : "Neue Person");
  const email = identityEmail.value.trim() || "keine E-Mail eingetragen";
  const activeApps = getActiveApps();
  const selectedRights = getSelectedRights();
  const passwordMode = getPasswordMode();
  const passwordGenerated = passwordMode === "generated";
  const passwordSummary = passwordGenerated ? "Generiert" : "Manuell gesetzt";

  userWizardModal.dataset.derivedUsername = deriveUsername(name, identityEmail.value.trim());
  summaryAccess.textContent = accountType === "technical" ? `Technischer Zugang: ${name}` : `Person: ${name}`;
  summaryEmail.textContent = email;
  summaryApps.textContent = activeApps.length ? activeApps.join(", ") : "Keine App ausgewählt";
  summaryRights.textContent = selectedRights.length ? selectedRights.join(", ") : "Keine Detailrechte ausgewählt";
  summaryPassword.textContent = passwordSummary;
  wizardNextButton.textContent = currentWizardStep === "invite"
    ? "Zugang anlegen"
    : "Weiter";
  successTitle.textContent = `${name} wurde angelegt`;
  successCopy.textContent = passwordGenerated
    ? "Eine E-Mail mit Zugangsdaten wurde versendet."
    : "Das manuelle Passwort wurde übernommen.";
  successFooterMessage.textContent = `${name} wurde angelegt`;
}

function showWizardSuccess() {
  wizardFlow.hidden = true;
  wizardFooter.hidden = true;
  wizardSuccess.hidden = false;
  successFooter.hidden = false;
  successFooter.querySelector("[data-close-user-wizard]").focus();
}

function renderWizardDots(visibleSteps, currentIndex) {
  wizardDots.replaceChildren();
  visibleSteps.forEach((step, index) => {
    const dot = document.createElement("button");
    dot.className = `cura-wizard-dot${index === currentIndex ? " cura-wizard-dot--active" : ""}`;
    dot.type = "button";
    dot.setAttribute("aria-label", `Zu Schritt ${index + 1}`);
    dot.addEventListener("click", () => {
      currentWizardStep = step;
      updateWizard();
    });
    wizardDots.append(dot);
  });
}

function updateWizard() {
  const visibleSteps = getVisibleWizardSteps();
  if (!visibleSteps.includes(currentWizardStep)) {
    currentWizardStep = visibleSteps[visibleSteps.length - 1];
  }

  const currentIndex = visibleSteps.indexOf(currentWizardStep);
  wizardPanels.forEach((panel) => {
    panel.hidden = panel.dataset.wizardStep !== currentWizardStep;
  });

  renderWizardDots(visibleSteps, currentIndex);
  wizardBackButton.disabled = currentIndex === 0;
  updateWizardCopy();
}

function resetWizard() {
  currentWizardStep = "identity";
  wizardFlow.hidden = false;
  wizardFooter.hidden = false;
  wizardSuccess.hidden = true;
  successFooter.hidden = true;
  identityName.value = accountType === "technical" ? "Dienstplanung Nord" : "Maja Schneider";
  identityEmail.value = accountType === "technical" ? "dienstplanung-nord@cura.go" : "maja.schneider@cura.go";
  passwordModeInputs.forEach((input) => {
    input.checked = input.value === "generated";
  });
  updatePasswordMode();
  appToggleButtons.forEach((button) => {
    const isDefaultActive = button.dataset.appToggle === "cura-go" || button.dataset.appToggle === "go-book";
    button.classList.toggle("cura-app-chip--active", isDefaultActive);
  });
  updateAppVisibility();
  updateWizard();
}

function closeCreateMenu() {
  userCreateMenu.hidden = true;
  userCreateSplit.classList.remove("is-open");
  userCreateTrigger.setAttribute("aria-expanded", "false");
}

function toggleCreateMenu() {
  const shouldOpen = userCreateMenu.hidden;
  userCreateMenu.hidden = !shouldOpen;
  userCreateSplit.classList.toggle("is-open", shouldOpen);
  userCreateTrigger.setAttribute("aria-expanded", String(shouldOpen));
}

navItems.forEach((item) => {
  item.addEventListener("click", () => showPage(item.dataset.page));
});

userRows.forEach((row) => {
  row.addEventListener("click", () => {
    setPersonDetail(row);
  });
});

detailTabs.forEach((tab) => {
  tab.addEventListener("click", () => showDetailTab(tab.dataset.detailTab));
});

function openUserWizard(type = "person") {
  accountType = type;
  resetWizard();
  closeCreateMenu();
  userWizardModal.hidden = false;
  userWizardModal.querySelector(".modal__header [data-close-user-wizard]").focus();
}

function closeUserWizard() {
  userWizardModal.hidden = true;
  primaryAction.focus();
}

closeUserWizardButtons.forEach((button) => {
  button.addEventListener("click", closeUserWizard);
});

[identityName, identityEmail].forEach((control) => {
  control.addEventListener("input", updateWizardSummary);
  control.addEventListener("change", updateWizardSummary);
});

passwordModeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    updatePasswordMode();
    updateWizardSummary();
  });
});

appToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("cura-app-chip--active");
    updateAppVisibility();
    updateWizardSummary();
  });
});

rightsGroups.forEach((group) => {
  group.addEventListener("change", updateWizardSummary);
});

wizardBackButton.addEventListener("click", () => {
  const visibleSteps = getVisibleWizardSteps();
  const currentIndex = visibleSteps.indexOf(currentWizardStep);
  currentWizardStep = visibleSteps[Math.max(0, currentIndex - 1)];
  updateWizard();
});

wizardNextButton.addEventListener("click", () => {
  const visibleSteps = getVisibleWizardSteps();
  const currentIndex = visibleSteps.indexOf(currentWizardStep);
  if (currentIndex === visibleSteps.length - 1) {
    showWizardSuccess();
    return;
  }

  currentWizardStep = visibleSteps[currentIndex + 1];
  updateWizard();
});

primaryAction.addEventListener("click", () => {
  openUserWizard("person");
});

userCreateTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleCreateMenu();
});

openUserWizardButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openUserWizard(button.dataset.openUserWizard);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !userWizardModal.hidden) {
    closeUserWizard();
    return;
  }

  if (event.key === "Escape" && !userCreateMenu.hidden) {
    closeCreateMenu();
    userCreateTrigger.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!userCreateMenu.hidden && !userCreateSplit.contains(event.target)) {
    closeCreateMenu();
  }
});

showPage(window.location.hash.replace("#", "") || "benutzer");
