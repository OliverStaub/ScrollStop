let blockedSites = [];
let newsSites = [];

// Load blocked and news sites from JSON file
function loadSites() {
  const sitesUrl = browser.runtime.getURL("sites.json");
  console.log("Loading sites from:", sitesUrl);

  fetch(sitesUrl)
    .then((response) => response.json())
    .then((data) => {
      blockedSites = [...data.blockedSites];
      newsSites = [...data.newsSites];
      console.log("Loaded blocked sites:", blockedSites);
      console.log("Loaded news sites:", newsSites);

      // Store the lists for content scripts
      browser.storage.local.set({ 
        blockedSites: blockedSites,
        newsSites: newsSites
      });
    })
    .catch((error) => {
      console.error("Error loading sites:", error);
    });
}

// Load sites on startup
loadSites();

// Reload sites on install/update
browser.runtime.onInstalled.addListener(() => {
  console.log("Extension installed/updated - reloading sites");
  loadSites();
});

// Handle messages from content scripts
browser.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  console.log("Background received request:", request);

  if (request.action === "getBlockedSites") {
    return Promise.resolve({ blockedSites: blockedSites });
  }
  
  if (request.action === "getNewsSites") {
    return Promise.resolve({ newsSites: newsSites });
  }
  
  return false;
});

// Note: Removed tab monitoring since we only run on specific sites now
// The content scripts will automatically run on the sites we specified
