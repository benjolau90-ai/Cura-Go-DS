const isElectron = navigator.userAgent.includes('Electron');
document.documentElement.classList.add(isElectron ? 'is-electron' : 'is-browser');
