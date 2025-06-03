function show(platform, enabled, useSettingsInsteadOfPreferences) {
    document.body.classList.add(`platform-${platform}`);

    if (useSettingsInsteadOfPreferences) {
        document.getElementsByClassName('platform-mac state-on')[0].innerText = "ScrollStop's extension is currently on. You can turn it off in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-off')[0].innerText = "ScrollStop's extension is currently off. You can turn it on in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-unknown')[0].innerText = "You can turn on ScrollStop's extension in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac open-preferences')[0].innerText = "Quit and Open Safari Settings…";
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

// Simple walkthrough navigation
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.walkthrough-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
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

function resetWalkthrough() {
    localStorage.removeItem('scrollstop-walkthrough-completed');
    location.reload();
}

function initializeWalkthrough() {
    // Check if we're on iOS
    if (!document.body.classList.contains('platform-ios')) {
        return;
    }
    
    const walkthroughContainer = document.getElementById('walkthrough-container');
    const simpleVersion = document.getElementById('simple-version');
    
    // Always show walkthrough starting with welcome screen
    if (walkthroughContainer) walkthroughContainer.style.display = 'flex';
    if (simpleVersion) simpleVersion.style.display = 'none';
    showScreen('welcome');
}

function completeWalkthrough() {
    localStorage.setItem('scrollstop-walkthrough-completed', 'true');
}

function setupEventListeners() {
    // Welcome screen
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => showScreen('step1'));
    }
    
    // Step 1 navigation
    const backToWelcome = document.getElementById('back-to-welcome');
    const goToStep2 = document.getElementById('go-to-step2');
    if (backToWelcome) backToWelcome.addEventListener('click', () => showScreen('welcome'));
    if (goToStep2) goToStep2.addEventListener('click', () => showScreen('step2'));
    
    // Step 2 navigation
    const backToStep1 = document.getElementById('back-to-step1');
    const goToComplete = document.getElementById('go-to-complete');
    if (backToStep1) backToStep1.addEventListener('click', () => showScreen('step1'));
    if (goToComplete) {
        goToComplete.addEventListener('click', () => {
            completeWalkthrough();
            showScreen('complete');
        });
    }
    
    // Complete screen
    const restartWalkthrough = document.getElementById('restart-walkthrough');
    if (restartWalkthrough) {
        restartWalkthrough.addEventListener('click', () => showScreen('welcome'));
    }
    
    // Settings button
    const openSettingsBtn = document.getElementById('open-settings-btn');
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', openSettingsApp);
    }
}

// Initialize when ready
function initializeApp() {
    initializeWalkthrough();
    setupEventListeners();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}