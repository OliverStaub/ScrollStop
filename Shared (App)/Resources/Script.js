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
    // Hide all steps
    for (let i = 1; i <= totalSteps; i++) {
        const step = document.getElementById(`step-${i}`);
        if (step) {
            step.classList.remove('active');
        }
    }
    
    // Show current step
    const currentStepElement = document.getElementById(`step-${stepNumber}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    
    currentStep = stepNumber;
}

function nextStep() {
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
    // Check if we're on iOS
    if (document.body.classList.contains('platform-ios')) {
        // Check if user has seen walkthrough before
        const hasSeenWalkthrough = localStorage.getItem('scrollstop-walkthrough-completed');
        
        if (!hasSeenWalkthrough) {
            // Show walkthrough
            showStep(1);
        } else {
            // Show simple version
            const walkthroughContainer = document.querySelector('.walkthrough-container');
            const simpleVersion = document.querySelector('.simple-version');
            
            if (walkthroughContainer && simpleVersion) {
                walkthroughContainer.style.display = 'none';
                simpleVersion.style.display = 'block';
            }
        }
    }
}

// Mark walkthrough as completed
function completeWalkthrough() {
    localStorage.setItem('scrollstop-walkthrough-completed', 'true');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWalkthrough);
} else {
    initializeWalkthrough();
}
