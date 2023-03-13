const blockPage = () => {
  document.body.innerHTML =
    '<div class="row align-items-center justify-content-center" style="height:100vh"><h1>URL blocked!</h1></div>';
  document.documentElement.style = "background: white;";
  document.head.innerHTML =
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">';
};
chrome.storage.sync.get(["blockedurls"]).then((result) => {
  if (result.blockedurls) {
    for (let i = 0; i < result.blockedurls.length; i++) {
      if (result.blockedurls[i].url === window.location.hostname) {
        blockPage();
      }
    }
  }
});
