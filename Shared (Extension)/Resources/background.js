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

// Listen for tab updates to check if site should be blocked
browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.url) {
    browser.tabs
      .sendMessage(tabId, {
        action: "checkBlockedSite",
        url: tab.url,
      })
      .catch(() => {
        // Inject content scripts in sequence
        injectContentScripts(tabId, tab.url);
      });
  }
});

// Helper function to inject content scripts
function injectContentScripts(tabId, url) {
  const scripts = [
    "storage-helper.js",
    "time-manager.js",
    "doomscroll-detector.js",
    "doomscroll-animation.js",
    "transition-screen.js",
    "blocking-screen.js",
    "content.js",
  ];

  // Inject scripts sequentially
  scripts
    .reduce((promise, script) => {
      return promise.then(() =>
        browser.tabs.executeScript(tabId, { file: script })
      );
    }, Promise.resolve())
    .then(() => {
      // Try sending the message again after all scripts are injected
      return browser.tabs.sendMessage(tabId, {
        action: "checkBlockedSite",
        url: url,
      });
    })
    .catch((error) => {
      console.log(
        `Could not inject scripts or send message to tab ${tabId}:`,
        error
      );
    });
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received request:", request);

  if (request.action === "getBlockedSites") {
    return Promise.resolve({ blockedSites: blockedSites });
  }
});
