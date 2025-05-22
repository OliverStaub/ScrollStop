// Popup functionality for managing blocked sites
console.log("ScrollStop popup loaded");

function renderSiteList() {
  const siteList = document.getElementById("siteList");

  browser.storage.local.get(["blockedSites"], function (result) {
    const sites = result.blockedSites || [];

    // Clear existing list
    siteList.innerHTML = "";

    if (sites.length === 0) {
      // The CSS will show the "no sites" message
      return;
    }

    sites.forEach((site) => {
      const li = document.createElement("li");

      const siteNameSpan = document.createElement("span");
      siteNameSpan.className = "site-name";
      siteNameSpan.textContent = site;

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => removeSite(site));

      li.appendChild(siteNameSpan);
      li.appendChild(removeBtn);
      siteList.appendChild(li);
    });
  });
}

function addSite() {
  const siteInput = document.getElementById("siteInput");
  const site = siteInput.value.trim().toLowerCase();

  if (!site) {
    showError("Please enter a website");
    return;
  }

  // Validate domain format
  const domainRegex = /^[a-z0-9.-]+\.[a-z]{2,}$/i;
  if (!domainRegex.test(site)) {
    showError("Please enter a valid domain (e.g., example.com)");
    return;
  }

  browser.storage.local.get(["blockedSites"], function (result) {
    const sites = result.blockedSites || [];

    if (sites.includes(site)) {
      showError("This site is already blocked");
      return;
    }

    sites.push(site);
    browser.storage.local.set({ blockedSites: sites }, function () {
      if (browser.runtime.lastError) {
        console.error("Error saving site:", browser.runtime.lastError);
        showError("Failed to save site");
        return;
      }

      siteInput.value = "";
      renderSiteList();
      showSuccess("Site added successfully");
    });
  });
}

function removeSite(siteToRemove) {
  browser.storage.local.get(["blockedSites"], function (result) {
    const sites = result.blockedSites || [];
    const updatedSites = sites.filter((site) => site !== siteToRemove);

    browser.storage.local.set({ blockedSites: updatedSites }, function () {
      if (browser.runtime.lastError) {
        console.error("Error removing site:", browser.runtime.lastError);
        showError("Failed to remove site");
        return;
      }

      renderSiteList();
      showSuccess("Site removed successfully");
    });
  });
}

function showError(message) {
  showNotification(message, "error");
}

function showSuccess(message) {
  showNotification(message, "success");
}

function showNotification(message, type) {
  // Remove any existing notification
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    right: 10px;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    z-index: 1000;
    animation: slideInDown 0.3s ease;
    ${
      type === "error"
        ? "background-color: #fee; color: #c33; border: 1px solid #fcc;"
        : "background-color: #efe; color: #363; border: 1px solid #cfc;"
    }
  `;

  // Add animation keyframes if not already present
  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      @keyframes slideInDown {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

// Initialize popup when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  const siteInput = document.getElementById("siteInput");
  const addSiteBtn = document.getElementById("addSiteBtn");

  // Render the initial site list
  renderSiteList();

  // Add event listeners
  addSiteBtn.addEventListener("click", addSite);

  // Allow adding sites by pressing Enter
  siteInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addSite();
    }
  });

  // Focus the input field
  siteInput.focus();
});

// Handle any messages from background script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Popup received request: ", request);

  if (request.action === "refreshSiteList") {
    renderSiteList();
  }
});
