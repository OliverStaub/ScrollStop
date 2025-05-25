// background.js - Safari Extension Background Script (Fixed paths)

// Initialize blocked sites array
let blockedSites = [];

// Your original hardcoded default sites
const defaultSites = [
  "facebook.com",
  "twitter.com",
  "instagram.com",
  "reddit.com",
  "x.com",
  "youtube.com",
];

// Load blocked sites from storage and JSON file
function loadBlockedSites() {
  // First add all the default sites
  blockedSites = [...defaultSites];

  // Try to load sites from storage
  browser.storage.local.get(["customBlockedSites"], function (result) {
    // Add any custom sites from storage
    if (result.customBlockedSites && Array.isArray(result.customBlockedSites)) {
      blockedSites = [
        ...new Set([...blockedSites, ...result.customBlockedSites]),
      ];
    }

    console.log("Using blocked sites:", blockedSites);

    // Store the combined list back to local storage
    browser.storage.local.set({ blockedSites: blockedSites });
  });

  // Try to load sites from JSON file
  try {
    const sitesUrl = browser.runtime.getURL("sites.json");
    console.log("Attempting to load from:", sitesUrl);

    fetch(sitesUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.blockedSites && Array.isArray(data.blockedSites)) {
          // Combine default sites with sites from JSON file
          blockedSites = [...new Set([...blockedSites, ...data.blockedSites])];
          console.log("Successfully loaded sites from JSON:", blockedSites);
          // Update storage
          browser.storage.local.set({ blockedSites: blockedSites });
        }
      })
      .catch((error) => {
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
        // If content script isn't ready, inject the modular scripts in order
        // Using flat paths that match the built extension structure
        Promise.resolve()
          .then(() =>
            browser.tabs.executeScript(tabId, {
              file: "storage-helper.js",
            })
          )
          .then(() =>
            browser.tabs.executeScript(tabId, {
              file: "time-manager.js",
            })
          )
          .then(() =>
            browser.tabs.executeScript(tabId, {
              file: "doomscroll-detector.js",
            })
          )
          .then(() =>
            browser.tabs.executeScript(tabId, {
              file: "doomscroll-animation.js",
            })
          )
          .then(() =>
            browser.tabs.executeScript(tabId, {
              file: "transition-screen.js",
            })
          )
          .then(() =>
            browser.tabs.executeScript(tabId, {
              file: "blocking-screen.js",
            })
          )
          .then(() => browser.tabs.executeScript(tabId, { file: "content.js" }))
          .then(() => {
            // Try sending the message again after all scripts are injected
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

});
