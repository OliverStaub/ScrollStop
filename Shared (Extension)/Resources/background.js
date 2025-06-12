let blockedSites = [];
let newsSites = [];
let adultSites = [];

// Load blocked, news, and adult sites from JSON file
function loadSites() {
  const sitesUrl = browser.runtime.getURL('sites.json');
  console.log('Loading sites from:', sitesUrl);

  fetch(sitesUrl)
    .then((response) => response.json())
    .then((data) => {
      blockedSites = [...data.blockedSites];
      newsSites = [...data.newsSites];
      adultSites = [...data.adultSites];
      console.log('Loaded blocked sites:', blockedSites);
      console.log('Loaded news sites:', newsSites);
      console.log('Loaded adult sites:', adultSites);

      // Store the lists for content scripts
      browser.storage.local.set({
        blockedSites: blockedSites,
        newsSites: newsSites,
        adultSites: adultSites,
      });
    })
    .catch((error) => {
      console.error('Error loading sites:', error);
    });
}

// Load sites on startup
loadSites();

// Reload sites on install/update
browser.runtime.onInstalled.addListener(() => {
  console.log('Extension installed/updated - reloading sites');
  loadSites();
});

// Handle messages from content scripts
browser.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  console.log('Background received request:', request);

  if (request.action === 'getBlockedSites') {
    return Promise.resolve({ blockedSites: blockedSites });
  }

  if (request.action === 'getNewsSites') {
    return Promise.resolve({ newsSites: newsSites });
  }

  if (request.action === 'getAdultSites') {
    return Promise.resolve({ adultSites: adultSites });
  }

  return false;
});

// Note: Removed tab monitoring since we only run on specific sites now
// The content scripts will automatically run on the sites we specified
