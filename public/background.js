let browsingInterval;

chrome.idle.setDetectionInterval(180);
chrome.storage.onChanged.addListener((changes, _) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === "blockingsession") {
      if (!newValue.blocking && oldValue.blocking !== newValue.blocking) {
        chrome.notifications.create(null, {
          title: "Blocking Session Complete!",
          message: "No longer blocking.",
          type: "basic",
          iconUrl: "icon128.png",
        });
        handleSessionEnd(oldValue);
        clearInterval(browsingInterval);
      } else if (
        (newValue.blocking && !oldValue) ||
        (newValue.blocking &&
          oldValue &&
          oldValue.blocking !== newValue.blocking)
      ) {
        chrome.notifications.create(null, {
          title: "Blocking Session Started!",
          message: "Now blocking URLs.",
          type: "basic",
          iconUrl: "icon128.png",
        });
        browsingInterval = setInterval(() => getCurrentTab(), 5000);
      }
    }
  }
});

let idleInterval;

chrome.idle.onStateChanged.addListener((newState) => {
  chrome.storage?.sync.get(["notificationsettings"]).then((result) => {
    if (
      result.notificationsettings &&
      result.notificationsettings["idle"].isOn &&
      newState === "idle"
    ) {
      chrome.notifications.create(null, {
        title: "Idle Notification",
        message: "You have been idle for too long.",
        type: "basic",
        iconUrl: "icon128.png",
      });
      idleInterval = setInterval(() => updateIdleTime(1), 60000);
    } else if (newState === "active") {
      clearInterval(idleInterval);
    }
  });
});

const updateIdleTime = (minutes) => {
  chrome.storage?.sync.get(["session_insights"]).then((result) => {
    if (result.session_insights) {
      chrome.storage?.sync.set({
        session_insights: {
          ...result.session_insights,
          idle_time: result.session_insights.idle_time + minutes,
        },
      });
    } else {
      chrome.storage?.sync.set({
        session_insights: {
          idle_time: minutes,
          history: {},
          blocked_visited: 0,
        },
      });
    }
  });
};

const handleSessionEnd = (prevSession) => {
  const current_time = new Date();
  const session_start = new Date(Date.parse(prevSession.blocking_start));
  const sessionlength = Math.floor(
    (current_time.getTime() - session_start.getTime()) / 60000
  );
  chrome.storage?.sync.get(["session_insights"]).then((result) => {
    if (result.session_insights) {
      chrome.storage?.sync.set({
        session_history: {
          session_length: sessionlength,
          idle_time: result.session_insights.idle_time,
          history: result.session_insights.history,
          blocked_visited: result.session_insights.blocked_visited,
        },
      });
      chrome.storage?.sync.set({
        session_insights: { idle_time: 0, history: {}, blocked_visited: 0 },
      });
    }
  });
};

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  if (tab) {
    const url = extractDomain(tab.url);
    updateBrowsingHistory(url);
  }
}

const updateBrowsingHistory = (url) => {
  chrome.storage?.sync.get(["session_insights"]).then((result) => {
    if (result.session_insights) {
      // Handle the case when session_insights is set in memory
      if (result.session_insights.history[url]) {
        // Handle the case when the URL is in history
        chrome.storage?.sync.set({
          session_insights: {
            ...result.session_insights,
            history: {
              ...result.session_insights.history,
              [url]: result.session_insights.history[url] + 5,
            },
          },
        });
      } else {
        // Handle the case when the URL is not in the history yet
        chrome.storage?.sync.set({
          session_insights: {
            ...result.session_insights,
            history: {
              ...result.session_insights.history,
              [url]: 5,
            },
          },
        });
      }
    } else {
      // Handle the case when there is no session_insights set in memory
      chrome.storage?.sync.set({
        session_insights: {
          idle_time: 0,
          history: { [url]: 5 },
          blocked_visited: 0,
        },
      });
    }
  });
};

const extractDomain = (url) => {
  const domain = url.match(/:\/\/(www\.)?(.[^/:]+)/i);
  return domain && domain.length > 2 ? domain[2] : "";
};
