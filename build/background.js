chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === "blockingsession") {
      if (!newValue.blocking && oldValue.blocking !== newValue.blocking) {
        chrome.notifications.create(null, {
          title: "Blocking Session Complete!",
          message: "No longer blocking. :-)",
          type: "basic",
          iconUrl: "icon128.png",
        });
      } else if (oldValue.blocking !== newValue.blocking) {
        chrome.notifications.create(null, {
          title: "Blocking Session Started!",
          message: "Now blocking URLs.",
          type: "basic",
          iconUrl: "icon128.png",
        });
      }
    }
  }
});
