// Load sites from sites.json file
browser.runtime.onInstalled.addListener(() => {
  fetch(browser.runtime.getURL("sites.json"))
    .then((response) => response.json())
    .then((data) => {
      browser.storage.local.set({ blockedSites: data.blockedSites });
      console.log("Loaded blocked sites from sites.json");
    })
    .catch((error) => {
      console.error("Error loading sites.json:", error);
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
});

// Handle toolbar icon click
browser.action.onClicked.addListener(() => {
  // Get the list of blocked sites
  browser.storage.local.get(["blockedSites"], function (result) {
    const sites = result.blockedSites || [];

    // Create a notification/alert with the active sites
    if (sites.length > 0) {
      const message = `ScrollStop is actively blocking ${
        sites.length
      } social media sites, including: ${sites.slice(0, 5).join(", ")}${
        sites.length > 5 ? ", and more..." : ""
      }`;

      // Try to use browser notifications if available
      if (browser.notifications) {
        browser.notifications.create({
          type: "basic",
          iconUrl: browser.runtime.getURL("images/icon-128.png"),
          title: "ScrollStop Active",
          message: message,
        });
      } else {
        // Create a custom notification by sending a message to the current tab
        browser.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            if (tabs[0]) {
              browser.tabs.sendMessage(tabs[0].id, {
                action: "showNotification",
                title: "ScrollStop Active",
                message: message,
              });
            }
          }
        );
      }
    }
  });
});
