// Listen for messages from background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkBlockedSite") {
    browser.storage.local.get(["blockedSites"], function (result) {
      const blockedSites = result.blockedSites || [];
      const href = window.location.href;
      const hostname = window.location.hostname;

      // Check if current site is blocked
      const isBlocked = blockedSites.some((site) => {
        // Remove protocol if present
        const cleanSite = site.replace(/^https?:\/\//, "");
        return href.includes(cleanSite) || hostname.includes(cleanSite);
      });

      if (isBlocked) {
        checkTimeBasedBlock().then((isTimeBlocked) => {
          if (isTimeBlocked) {
            showTimeBlockScreen();
          } else {
            initializeDoomscrollBlocker();
          }
        });
      } else {
        // Remove scroll listener if site is not blocked
        if (initializeDoomscrollBlocker.scrollHandler) {
          window.removeEventListener(
            "scroll",
            initializeDoomscrollBlocker.scrollHandler
          );
          initializeDoomscrollBlocker.scrollHandler = null;
        }
        // Remove any existing warning overlay
        const existingWarning = document.getElementById("doomscroll-warning");
        if (existingWarning) {
          existingWarning.remove();
        }
      }

      if (sendResponse) {
        sendResponse({ isBlocked });
      }
    });
    return true; // Indicates we will send a response asynchronously
  }
});

// Check if site is currently time-blocked (60 minutes after doomscroll)
async function checkTimeBasedBlock() {
  return new Promise((resolve) => {
    const hostname = window.location.hostname;
    browser.storage.local.get(["timeBlocks"], function (result) {
      const timeBlocks = result.timeBlocks || {};
      const blockInfo = timeBlocks[hostname];

      if (!blockInfo) {
        resolve(false);
        return;
      }

      const now = Date.now();
      const blockDuration = 60 * 60 * 1000; // 60 minutes in milliseconds
      const timeRemaining = blockInfo.timestamp + blockDuration - now;

      if (timeRemaining > 0) {
        resolve(true);
      } else {
        // Block expired, remove it
        delete timeBlocks[hostname];
        browser.storage.local.set({ timeBlocks }, () => {
          resolve(false);
        });
      }
    });
  });
}

// Save time block when doomscroll is triggered
function saveTimeBlock() {
  const hostname = window.location.hostname;
  browser.storage.local.get(["timeBlocks"], function (result) {
    const timeBlocks = result.timeBlocks || {};
    timeBlocks[hostname] = {
      timestamp: Date.now(),
      siteName: hostname,
    };
    browser.storage.local.set({ timeBlocks });
  });
}

// Show the 60-minute block screen
function showTimeBlockScreen() {
  // Remove any existing content
  document.body.innerHTML = "";

  // Create and show time block screen
  const blockScreen = createTimeBlockElement();
  document.body.appendChild(blockScreen);

  // Start countdown timer
  updateCountdown(blockScreen);
  const countdownInterval = setInterval(() => {
    updateCountdown(blockScreen);
  }, 1000);

  // Store interval reference for cleanup
  blockScreen.countdownInterval = countdownInterval;
}

// Create the time block overlay element
function createTimeBlockElement() {
  const element = document.createElement("div");
  element.id = "time-block-screen";
  element.style.cssText = `
      height: 100vh;
      width: 100vw;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999999;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      text-align: center;
      padding: 2rem;
      box-sizing: border-box;
    `;

  element.innerHTML = `
      <div style="max-width: 600px; width: 100%;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🌱</div>
        <h1 style="font-size: 3rem; margin: 0 0 1rem 0; font-weight: 700;">
          Time to Touch Grass!
        </h1>
        <p style="font-size: 1.5rem; margin: 0 0 2rem 0; opacity: 0.9; line-height: 1.4;">
          You've been scrolling too much. This site is blocked for 60 minutes.
        </p>
        <div id="countdown-display" style="
          background: rgba(255, 255, 255, 0.2);
          padding: 1.5rem;
          border-radius: 15px;
          margin: 2rem 0;
          backdrop-filter: blur(10px);
        ">
          <div style="font-size: 3rem; font-weight: 700; margin-bottom: 0.5rem;" id="time-remaining">
            Loading...
          </div>
          <div style="font-size: 1.2rem; opacity: 0.8;">
            until you can access this site again
          </div>
        </div>
        <div style="margin-top: 2rem;">
          <p style="font-size: 1.1rem; margin: 1rem 0; opacity: 0.8;">
            Here are some better things you could be doing:
          </p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
            <div style="background: rgba(255, 255, 255, 0.15); padding: 1rem; border-radius: 10px;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🚶‍♂️</div>
              <div>Take a walk outside</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.15); padding: 1rem; border-radius: 10px;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">📚</div>
              <div>Read a book</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.15); padding: 1rem; border-radius: 10px;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🧘‍♀️</div>
              <div>Meditate</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.15); padding: 1rem; border-radius: 10px;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">💪</div>
              <div>Exercise</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.15); padding: 1rem; border-radius: 10px;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">👥</div>
              <div>Call a friend</div>
            </div>
            <div style="background: rgba(255, 255, 255, 0.15); padding: 1rem; border-radius: 10px;">
              <div style="font-size: 2rem; margin-bottom: 0.5rem;">🎨</div>
              <div>Be creative</div>
            </div>
          </div>
        </div>
        <button onclick="window.close()" style="
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.5);
          color: white;
          padding: 12px 24px;
          font-size: 1.1rem;
          border-radius: 25px;
          cursor: pointer;
          margin-top: 2rem;
          transition: all 0.3s ease;
        " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" 
           onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
          Close Tab
        </button>
      </div>
    `;

  return element;
}

// Update the countdown timer
function updateCountdown(blockScreen) {
  const hostname = window.location.hostname;
  browser.storage.local.get(["timeBlocks"], function (result) {
    const timeBlocks = result.timeBlocks || {};
    const blockInfo = timeBlocks[hostname];

    if (!blockInfo) {
      // Block not found, reload page
      window.location.reload();
      return;
    }

    const now = Date.now();
    const blockDuration = 60 * 60 * 1000; // 60 minutes
    const timeRemaining = blockInfo.timestamp + blockDuration - now;

    if (timeRemaining <= 0) {
      // Time's up! Remove the block and reload
      delete timeBlocks[hostname];
      browser.storage.local.set({ timeBlocks }, () => {
        window.location.reload();
      });
      return;
    }

    // Format time remaining
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    const timeDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    const countdownElement = blockScreen.querySelector("#time-remaining");
    if (countdownElement) {
      countdownElement.textContent = timeDisplay;
    }
  });
}

function initializeDoomscrollBlocker() {
  // Avoid initializing multiple times
  if (initializeDoomscrollBlocker.initialized) {
    return;
  }
  initializeDoomscrollBlocker.initialized = true;

  const CONFIG = {
    SCROLL_LIMIT: 4000, // Pixels scrolled before showing warning
    FLASH_INTERVAL: 400, // Warning flash interval in ms
    SCREEN_DECAY_TIME: 7, // Time in seconds for content to fade out
  };

  let scrollDistance = 0;
  let isWarningVisible = false;
  let isWarningEnabled = false;
  let flashIntervalId;

  const warningElement = createWarningElement();

  function createWarningElement() {
    const element = document.createElement("div");
    element.id = "doomscroll-warning";
    element.style.cssText = `
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: rgba(0, 0, 0, 0.1);
        color: #f94144;
        font-weight: bolder;
        text-align: center;
        font-size: 7vw;
        font-family: Arial, sans-serif;
        transition: opacity 0.3s ease;
        opacity: 0;
        pointer-events: none;
      `;
    element.innerText = "DOOMSCROLL!";
    return element;
  }

  const handleScroll = () => {
    const currentScrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollDelta = currentScrollTop - scrollDistance;
    scrollDistance = currentScrollTop;

    // Only trigger on downward scrolling
    if (scrollDelta > 0) {
      if (!isWarningEnabled && scrollDistance > CONFIG.SCROLL_LIMIT) {
        isWarningEnabled = true;
        showDoomscrollWarning();
      }
    }
  };

  function showDoomscrollWarning() {
    // Save the time block immediately
    saveTimeBlock();

    // Add warning element to page
    document.body.appendChild(warningElement);

    // Get all children except our warning
    const children = Array.from(document.body.children).filter(
      (child) => child.id !== "doomscroll-warning"
    );

    // Set up transition properties for existing content
    children.forEach((child) => {
      child.style.transition = `opacity ${CONFIG.SCREEN_DECAY_TIME}s ease`;
    });

    // Start flashing warning
    flashIntervalId = setInterval(() => {
      displayWarning();
    }, CONFIG.FLASH_INTERVAL);

    // Fade out existing content
    setTimeout(() => {
      children.forEach((child) => {
        child.style.opacity = "0";
      });
    }, 100);

    // Replace with transition message, then show time block
    setTimeout(() => {
      // Clear the flashing interval
      clearInterval(flashIntervalId);

      // Remove all content except our warning
      children.forEach((child) => child.remove());

      // Update warning to transition message
      warningElement.style.opacity = "1";
      warningElement.style.color = "#8ac926";
      warningElement.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
      warningElement.style.pointerEvents = "all";
      warningElement.innerHTML = `
          <div style="font-size: 5vw; margin-bottom: 2rem;">Touch some grass!</div>
          <div style="font-size: 2vw; color: #666; margin-bottom: 2rem;">
            This site is now blocked for 60 minutes.
          </div>
          <div style="font-size: 1.5vw; color: #888;">
            Redirecting in 3 seconds...
          </div>
        `;

      // After 3 seconds, show the full time block screen
      setTimeout(() => {
        showTimeBlockScreen();
      }, 3000);
    }, CONFIG.SCREEN_DECAY_TIME * 1000);
  }

  function displayWarning() {
    if (!isWarningVisible) {
      warningElement.style.opacity = "1";
    } else {
      warningElement.style.opacity = "0";
    }
    isWarningVisible = !isWarningVisible;
  }

  // Add scroll event listener
  const scrollHandler = handleScroll;
  window.addEventListener("scroll", scrollHandler, { passive: true });

  // Store reference to handler for cleanup
  initializeDoomscrollBlocker.scrollHandler = scrollHandler;
}

// Check for time block on page load
document.addEventListener("DOMContentLoaded", function () {
  browser.storage.local.get(["blockedSites"], function (result) {
    const blockedSites = result.blockedSites || [];
    const href = window.location.href;
    const hostname = window.location.hostname;

    const isBlocked = blockedSites.some((site) => {
      const cleanSite = site.replace(/^https?:\/\//, "");
      return href.includes(cleanSite) || hostname.includes(cleanSite);
    });

    if (isBlocked) {
      checkTimeBasedBlock().then((isTimeBlocked) => {
        if (isTimeBlocked) {
          showTimeBlockScreen();
        } else {
          initializeDoomscrollBlocker();
        }
      });
    }
  });
});

// Also check immediately when script loads (for faster loading)
browser.storage.local.get(["blockedSites"], function (result) {
  const blockedSites = result.blockedSites || [];
  const href = window.location.href;
  const hostname = window.location.hostname;

  const isBlocked = blockedSites.some((site) => {
    const cleanSite = site.replace(/^https?:\/\//, "");
    return href.includes(cleanSite) || hostname.includes(cleanSite);
  });

  if (isBlocked) {
    checkTimeBasedBlock().then((isTimeBlocked) => {
      if (isTimeBlocked) {
        showTimeBlockScreen();
      } else {
        initializeDoomscrollBlocker();
      }
    });
  }
});
