// Initialize blocked sites array
let blockedSites = [];

// Hardcoded default sites as fallback
const defaultSites = [
  "facebook.com",
  "twitter.com",
  "instagram.com",
  "reddit.com",
  "x.com",
  "youtube.com",
];

// Attempt to load sites from sites.json
function loadBlockedSites() {
  // First try to add all the default sites
  blockedSites = [...defaultSites];
  
  // Try to load sites from storage
  browser.storage.local.get(["customBlockedSites"], function (result) {
    // Add any custom sites from storage
    if (result.customBlockedSites && Array.isArray(result.customBlockedSites)) {
      blockedSites = [...new Set([...blockedSites, ...result.customBlockedSites])];
    }
    
    console.log("Using blocked sites:", blockedSites);
    
    // Store the combined list back to local storage
    browser.storage.local.set({ blockedSites: blockedSites });
  });
  
  // Now try to load sites from JSON file
  try {
    // Create URL for sites.json
    // First try with sites.json in the root folder
    const sitesUrl = browser.runtime.getURL("sites.json");
    console.log("Attempting to load from:", sitesUrl);
    
    fetch(sitesUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && data.blockedSites && Array.isArray(data.blockedSites)) {
          // Combine default sites with sites from JSON file
          blockedSites = [...new Set([...blockedSites, ...data.blockedSites])];
          console.log("Successfully loaded sites from JSON:", blockedSites);
          // Update storage
          browser.storage.local.set({ blockedSites: blockedSites });
        }
      })
      .catch(error => {
        console.error("Error loading sites.json:", error);
      });
  } catch (error) {
    console.error("Exception in loadBlockedSites:", error);
  }
}

// Load sites on startup
loadBlockedSites();

// Reload sites on install/update
browser.runtime.onInstalled.addListener(() => {
  loadBlockedSites();
});

// Listen for tab updates to check if site should be blocked
browser.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url) {
    browser.tabs
      .sendMessage(tabId, {
        action: "checkBlockedSite",
        url: tab.url,
      })
      .catch(() => {
        // If content script isn't ready, inject it
        browser.tabs
          .executeScript(tabId, {
            file: "content.js",
          })
          .then(() => {
            // Try sending the message again
            browser.tabs
              .sendMessage(tabId, {
                action: "checkBlockedSite",
                url: tab.url,
              })
              .catch((error) => {
                // Some pages still can't receive messages (e.g., chrome:// pages)
                console.log("Could not send message to tab:", tabId);
              });
          })
          .catch((error) => {
            // Ignore errors for tabs where scripts can't be injected
            console.log("Could not inject content script:", error);
          });
      });
  }
});

// Handle messages from content script or popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received request: ", request);

  // If content script asks for blocked sites list
  if (request.action === "getBlockedSites") {
    return Promise.resolve({ blockedSites: blockedSites });
  }

  if (request.greeting === "hello") {
    return Promise.resolve({ farewell: "goodbye" });
  }

  // Handle any custom background logic here
});

// Load sites on startup
loadBlockedSites();

// Reload sites on install/update
browser.runtime.onInstalled.addListener(() => {
  loadBlockedSites();
});

// Listen for tab updates to check if site should be blocked
browser.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url) {
    browser.tabs
      .sendMessage(tabId, {
        action: "checkBlockedSite",
        url: tab.url,
      })
      .catch(() => {
        // If content script isn't ready, inject it
        browser.tabs
          .executeScript(tabId, {
            file: "content.js",
          })
          .then(() => {
            // Try sending the message again
            browser.tabs
              .sendMessage(tabId, {
                action: "checkBlockedSite",
                url: tab.url,
              })
              .catch((error) => {
                // Some pages still can't receive messages (e.g., chrome:// pages)
                console.log("Could not send message to tab:", tabId);
              });
          })
          .catch((error) => {
            // Ignore errors for tabs where scripts can't be injected
            console.log("Could not inject content script:", error);
          });
      });
  }
});

// Handle messages from content script or popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received request: ", request);

  // If content script asks for blocked sites list
  if (request.action === "getBlockedSites") {
    return Promise.resolve({ blockedSites: blockedSites });
  }

  if (request.greeting === "hello") {
    return Promise.resolve({ farewell: "goodbye" });
  }

  // Handle any custom background logic here
});

  // If content script asks for blocked sites list
  if (request.action === "getBlockedSites") {
    return Promise.resolve({ blockedSites: blockedSites });
  }

  if (request.greeting === "hello") {
    return Promise.resolve({ farewell: "goodbye" });
  }

  // Handle any custom background logic here
});
