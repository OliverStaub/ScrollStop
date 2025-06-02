function show(platform, enabled, useSettingsInsteadOfPreferences) {
    document.body.classList.add(`platform-${platform}`);

    if (useSettingsInsteadOfPreferences) {
        document.getElementsByClassName('platform-mac state-on')[0].innerText = "ScrollStop’s extension is currently on. You can turn it off in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-off')[0].innerText = "ScrollStop’s extension is currently off. You can turn it on in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-unknown')[0].innerText = "You can turn on ScrollStop’s extension in the Extensions section of Safari Settings.";
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

// iOS Walkthrough functionality
let currentStep = 1;
const totalSteps = 4;

function showStep(stepNumber) {
    console.log('showStep called with stepNumber:', stepNumber);
    
    // Hide all steps
    for (let i = 1; i <= totalSteps; i++) {
        const step = document.getElementById(`step-${i}`);
        if (step) {
            step.classList.remove('active');
            console.log('Hiding step', i);
        }
    }
    
    // Show current step
    const currentStepElement = document.getElementById(`step-${stepNumber}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
        console.log('Showing step', stepNumber);
    } else {
        console.error('Step element not found:', `step-${stepNumber}`);
    }
    
    currentStep = stepNumber;
}

function nextStep() {
    console.log('nextStep called, currentStep:', currentStep, 'totalSteps:', totalSteps);
    if (currentStep < totalSteps) {
        showStep(currentStep + 1);
    } else if (currentStep === totalSteps) {
        completeWalkthrough();
        showStep(1); // Start over
    }
}

function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function restartWalkthrough() {
    showStep(1);
}

// Initialize walkthrough when page loads
function initializeWalkthrough() {
    console.log('Initializing walkthrough, platform classes:', document.body.classList.toString());
    
    // Check if we're on iOS
    if (document.body.classList.contains('platform-ios')) {
        console.log('iOS platform detected');
        
        // Check if user has seen walkthrough before
        const hasSeenWalkthrough = localStorage.getItem('scrollstop-walkthrough-completed');
        console.log('Has seen walkthrough:', hasSeenWalkthrough);
        
        const walkthroughContainer = document.getElementById('walkthrough-container');
        const simpleVersion = document.getElementById('simple-version');
        
        if (!hasSeenWalkthrough) {
            // Show walkthrough, hide simple
            console.log('Showing walkthrough');
            if (walkthroughContainer) walkthroughContainer.style.display = 'flex';
            if (simpleVersion) simpleVersion.style.display = 'none';
            showStep(1);
        } else {
            // Show simple version, hide walkthrough
            console.log('Showing simple version');
            if (walkthroughContainer) walkthroughContainer.style.display = 'none';
            if (simpleVersion) simpleVersion.style.display = 'flex';
        }
    } else {
        console.log('Not iOS platform, hiding iOS containers');
        // Hide both iOS containers if not on iOS
        const walkthroughContainer = document.getElementById('walkthrough-container');
        const simpleVersion = document.getElementById('simple-version');
        if (walkthroughContainer) walkthroughContainer.style.display = 'none';
        if (simpleVersion) simpleVersion.style.display = 'none';
    }
}

// Mark walkthrough as completed
function completeWalkthrough() {
    localStorage.setItem('scrollstop-walkthrough-completed', 'true');
    console.log('Walkthrough marked as completed');
}

// Debug function to reset walkthrough (for testing)
function resetWalkthrough() {
    localStorage.removeItem('scrollstop-walkthrough-completed');
    console.log('Walkthrough reset, refreshing...');
    location.reload();
}

// Function to open iOS Settings app
function openSettingsApp() {
    console.log('Attempting to open Settings app');
    
    // Try to open Settings app using URL scheme
    // Note: This will only work if the app has proper URL handling in ViewController
    const settingsURL = 'app-settings:';
    
    // Create a temporary link and click it to trigger the navigation handler
    const link = document.createElement('a');
    link.href = settingsURL;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Set up event listeners for walkthrough buttons
function setupWalkthroughEventListeners() {
    console.log('Setting up walkthrough event listeners');
    
    // Step 1: Get Started button
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            console.log('Get Started clicked');
            nextStep();
        });
    }
    
    // Step 2: Back and Next buttons
    const step2BackBtn = document.getElementById('step2-back-btn');
    const step2NextBtn = document.getElementById('step2-next-btn');
    if (step2BackBtn) step2BackBtn.addEventListener('click', prevStep);
    if (step2NextBtn) step2NextBtn.addEventListener('click', nextStep);
    
    // Step 3: Back and Next buttons
    const step3BackBtn = document.getElementById('step3-back-btn');
    const step3NextBtn = document.getElementById('step3-next-btn');
    if (step3BackBtn) step3BackBtn.addEventListener('click', prevStep);
    if (step3NextBtn) step3NextBtn.addEventListener('click', nextStep);
    
    // Step 4: Restart button
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) restartBtn.addEventListener('click', restartWalkthrough);
    
    // Settings button
    const openSettingsBtn = document.getElementById('open-settings-btn');
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', () => {
            console.log('Open Settings clicked');
            openSettingsApp();
        });
    }
}

// Initialize everything
function initializeApp() {
    initializeWalkthrough();
    setupWalkthroughEventListeners();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
