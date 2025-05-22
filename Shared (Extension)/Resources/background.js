const defaultSites = [
  "facebook.com",
  "twitter.com",
  "instagram.com",
  "reddit.com",
  "x.com",
  "youtube.com",
];

// Initialize with default blocked sites on install
browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get(["blockedSites"], function (result) {
    if (!result.blockedSites) {
      browser.storage.local.set({ blockedSites: defaultSites });
    }
  });
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
        // Ignore errors for tabs that can't receive messages (like chrome:// pages)
      });
  }
});

// Handle messages from content script or popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Background received request: ", request);

  if (request.greeting === "hello") {
    return Promise.resolve({ farewell: "goodbye" });
  }

  // Handle any custom background logic here
});
