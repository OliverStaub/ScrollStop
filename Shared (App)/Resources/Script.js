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

// Create HeadlessButton components
function createButtons() {
    // Main.html - macOS preferences button
    const preferencesContainer = document.getElementById('preferences-button-container');
    if (preferencesContainer) {
        if (typeof HeadlessButton !== 'undefined') {
            new HeadlessButton('Quit and Open Safari Extensions Preferences…', {
                color: 'blue',
                onClick: openPreferences
            }).render(preferencesContainer);
        } else {
            // Fallback: create simple button
            const button = document.createElement('button');
            button.textContent = 'Quit and Open Safari Extensions Preferences…';
            button.className = 'open-preferences';
            button.style.cssText = `
                background: #007AFF;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 14px;
                cursor: pointer;
                font-weight: 500;
            `;
            button.addEventListener('click', openPreferences);
            preferencesContainer.appendChild(button);
        }
    }

    // Welcome screen - Get Started button
    const getStartedContainer = document.getElementById('get-started-button');
    if (getStartedContainer && getStartedContainer.children.length === 0) {
        if (typeof HeadlessButton !== 'undefined') {
            new HeadlessButton('Get Started', {
                color: 'blue',
                onClick: () => navigateToScreen('step1')
            }).render(getStartedContainer);
        } else {
            // Fallback: create simple button
            const button = document.createElement('button');
            button.textContent = 'Get Started';
            button.className = 'primary-button';
            button.style.cssText = `
                background: #007AFF;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                font-weight: 500;
                margin: 1rem 0;
            `;
            button.addEventListener('click', () => navigateToScreen('step1'));
            getStartedContainer.appendChild(button);
        }
    }

    // Step 1 - Settings button
    const openSettingsContainer = document.getElementById('open-settings-button');
    if (openSettingsContainer && openSettingsContainer.children.length === 0) {
        new HeadlessButton('📱 Open Settings App', {
            color: 'blue',
            onClick: openSettingsApp
        }).render(openSettingsContainer);
    }

    // Step 1 - Navigation buttons
    const step1ButtonsContainer = document.getElementById('step1-buttons');
    if (step1ButtonsContainer) {
        step1ButtonsContainer.style.display = 'flex';
        step1ButtonsContainer.style.gap = '0.5rem';
        
        new HeadlessButton('Back', {
            outline: true,
            onClick: () => navigateToScreen('welcome')
        }).render(step1ButtonsContainer);
        
        new HeadlessButton('Next', {
            color: 'blue',
            onClick: () => navigateToScreen('step2')
        }).render(step1ButtonsContainer);
    }

    // Step 2 - Navigation buttons
    const step2ButtonsContainer = document.getElementById('step2-buttons');
    if (step2ButtonsContainer) {
        step2ButtonsContainer.style.display = 'flex';
        step2ButtonsContainer.style.gap = '0.5rem';
        
        new HeadlessButton('Back', {
            outline: true,
            onClick: () => navigateToScreen('step1')
        }).render(step2ButtonsContainer);
        
        new HeadlessButton('Complete Setup', {
            color: 'blue',
            onClick: () => navigateToScreen('complete')
        }).render(step2ButtonsContainer);
    }

    // Complete screen - Restart walkthrough button
    const restartContainer = document.getElementById('restart-walkthrough-button');
    if (restartContainer) {
        new HeadlessButton('Restart Walkthrough', {
            color: 'blue',
            onClick: restartWalkthrough
        }).render(restartContainer);
    }
}

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


// Initialize when ready
function initializeApp() {
    createButtons();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}