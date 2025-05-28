let blockedSites = [];

// Load blocked sites from JSON file
function loadBlockedSites() {
  const sitesUrl = browser.runtime.getURL("sites.json");
  console.log("Loading blocked sites from:", sitesUrl);

  fetch(sitesUrl)
    .then((response) => response.json())
    .then((data) => {
      blockedSites = [...data.blockedSites];
      console.log("Loaded blocked sites:", blockedSites);

      // Store the list for content scripts
      browser.storage.local.set({ blockedSites: blockedSites });
    })
    .catch((error) => {
      console.error("Error loading blocked sites:", error);
    });
}

// Load sites on startup
loadBlockedSites();

// Reload sites on install/update
browser.runtime.onInstalled.addListener(() => {
  console.log("Extension installed/updated - reloading blocked sites");
  loadBlockedSites();
});

// Handle messages from content scripts
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received request:", request);

  if (request.action === "getBlockedSites") {
    return Promise.resolve({ blockedSites: blockedSites });
  }
});

// Note: Removed tab monitoring since we only run on specific sites now
// The content scripts will automatically run on the sites we specified
