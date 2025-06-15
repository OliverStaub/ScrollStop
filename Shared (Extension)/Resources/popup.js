// popup.js - Popup functionality for ScrollStop extension

document.addEventListener('DOMContentLoaded', function () {
  // Create HeadlessButton for configuration
  const buttonContainer = document.getElementById('button-container');

  if (window.HeadlessButton && buttonContainer) {
    const configureButton = new window.HeadlessButton('⚙️ Configure Activities', {
      color: 'green',
      onClick: function () {
        try {
          // Create a new tab with a blocked site to trigger the questionnaire
          const newTab = window.open('https://www.instagram.com', '_blank');

          if (newTab) {
            // Store a flag that we want to show the questionnaire
            try {
              localStorage.setItem('scrollstop_show_questionnaire', 'true');
            } catch (e) {
              console.log('LocalStorage not available in popup context');
            }

            // Close popup
            window.close();
          } else {
            // Fallback if popup blocking occurs
            alert(
              'Please visit any social media site (Instagram, Facebook, etc.) and click "Configure Activities" in the choice dialog that appears.'
            );
          }
        } catch (error) {
          console.error('Error opening configuration:', error);
          // Simple fallback
          alert(
            'Please visit Instagram or Facebook manually, and you will see a "Configure Activities" option in the choice dialog.'
          );
        }
      },
    });

    buttonContainer.appendChild(configureButton.element);
  }
});
