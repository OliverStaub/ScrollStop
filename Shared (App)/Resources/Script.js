function show(platform, enabled, useSettingsInsteadOfPreferences) {
    document.body.classList.add(`platform-${platform}`);

    if (useSettingsInsteadOfPreferences) {
        const stateOnElement = document.querySelector('.platform-mac .state-on');
        const stateOffElement = document.querySelector('.platform-mac .state-off');
        const stateUnknownElement = document.querySelector('.platform-mac .state-unknown');
        const openPreferencesElement = document.querySelector('.platform-mac .open-preferences');
        
        if (stateOnElement) stateOnElement.innerText = "ScrollStop's extension is currently on. You can turn it off in the Extensions section of Safari Settings.";
        if (stateOffElement) stateOffElement.innerText = "ScrollStop's extension is currently off. You can turn it on in the Extensions section of Safari Settings.";
        if (stateUnknownElement) stateUnknownElement.innerText = "You can turn on ScrollStop's extension in the Extensions section of Safari Settings.";
        if (openPreferencesElement) openPreferencesElement.innerText = "Quit and Open Safari Settings…";
    }

    if (typeof enabled === "boolean") {
        document.body.classList.toggle(`state-on`, enabled);
        document.body.classList.toggle(`state-off`, !enabled);
    } else {
        document.body.classList.remove(`state-on`);
        document.body.classList.remove(`state-off`);
    }
}

function openPreferences() {
    webkit.messageHandlers.controller.postMessage("open-preferences");
}

document.querySelector("button.open-preferences")?.addEventListener("click", openPreferences);

function navigateToScreen(screenName) {
    if (typeof webkit !== 'undefined' && webkit.messageHandlers && webkit.messageHandlers.controller) {
        webkit.messageHandlers.controller.postMessage(`navigate-to-${screenName}`);
    }
}

function openSettingsApp() {
    const link = document.createElement('a');
    link.href = 'settings:';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function restartWalkthrough() {
    if (typeof webkit !== 'undefined' && webkit.messageHandlers && webkit.messageHandlers.controller) {
        webkit.messageHandlers.controller.postMessage('restart-walkthrough');
    }
}

function setupEventListeners() {
    // Welcome screen
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => navigateToScreen('step1'));
    }
    
    // Step 1 navigation
    const backToWelcome = document.getElementById('back-to-welcome');
    const goToStep2 = document.getElementById('go-to-step2');
    if (backToWelcome) backToWelcome.addEventListener('click', () => navigateToScreen('welcome'));
    if (goToStep2) goToStep2.addEventListener('click', () => navigateToScreen('step2'));
    
    // Step 2 navigation
    const backToStep1 = document.getElementById('back-to-step1');
    const goToComplete = document.getElementById('go-to-complete');
    if (backToStep1) backToStep1.addEventListener('click', () => navigateToScreen('step1'));
    if (goToComplete) {
        goToComplete.addEventListener('click', () => navigateToScreen('complete'));
    }
    
    // Complete screen
    const restartWalkthroughBtn = document.getElementById('restart-walkthrough');
    if (restartWalkthroughBtn) {
        restartWalkthroughBtn.addEventListener('click', restartWalkthrough);
    }
    
    // Settings button
    const openSettingsBtn = document.getElementById('open-settings-btn');
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', openSettingsApp);
    }
}

// Initialize when ready
function initializeApp() {
    setupEventListeners();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}