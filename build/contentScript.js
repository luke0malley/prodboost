const blockPage = (date) => {
  document.body.innerHTML =
    '<div class="d-flex align-items-center justify-content-center" style="height: 100vh;"><div class="alert alert-danger" role="alert"><h4 class="alert-heading">URL blocked!</h4><p id="blocked_time"></p></div></div>';
  document.documentElement.style = "background: white;";
  document.head.innerHTML =
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">';
  setInterval(setTime, 1000, date);
  clearInterval(checkIfBlocked);
  setInterval(checkNotBlocked, 5000);
};
const setTime = (date) => {
  document.getElementById("blocked_time").innerHTML =
    "Blocking " +
    window.location.hostname +
    " for&nbsp;" +
    getBlockedTime(date);
};
const getBlockedTime = (date) => {
  let now = new Date();
  let unblocktime = new Date(date);
  let timeleft = unblocktime.getTime() - now.getTime();
  if (timeleft <= 0) {
    chrome.storage.sync.get(["blockingsession"]).then((result) => {
      if (result.blockingsession && result.blockingsession.blocking) {
        chrome.storage.sync.set({ blockingsession: { blocking: false } });
      }
      location.reload();
    });
  } else {
    let blocked_time = "";
    let days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
    if (days > 0) {
      blocked_time += days + " days, ";
    }
    if (hours > 0) {
      blocked_time += (hours % 24) + " hours, ";
    }
    if (minutes > 0) {
      blocked_time += (minutes % 60) + " minutes, ";
    }
    blocked_time += (seconds % 60) + " seconds";
    return blocked_time;
  }
};
const checkBlocked = () => {
  let promise1 = chrome.storage.sync.get(["blockedurls"]);
  let promise2 = chrome.storage.sync.get(["blockingsession"]);

  Promise.all([promise1, promise2]).then((result) => {
    if (
      result[0].blockedurls &&
      result[1].blockingsession &&
      result[1].blockingsession.blocking
    ) {
      for (let i = 0; i < result[0].blockedurls.length; i++) {
        if (result[0].blockedurls[i].url === window.location.hostname) {
          blockPage(result[1].blockingsession.blocking_time);
        }
      }
    }
  });
};
checkBlocked();
const checkIfBlocked = setInterval(checkBlocked, 5000);

const checkNotBlocked = () => {
  chrome.storage.sync.get(["blockingsession"]).then((result) => {
    if (result.blockingsession && result.blockingsession.blocking === false) {
      location.reload();
    }
  });
};