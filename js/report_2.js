let reportUrl =
  "https://safebrowsing.google.com/safebrowsing/report_phish/?hl=en&url=";
let maliciousSite = "";

browser.tabs.query(
  {
    currentWindow: true,
    active: true,
  },
  function (tabs) {
    maliciousSite = tabs[0].url;
  }
);

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.url) {
    maliciousSite = message.url;
  }
});

let link = document.getElementById("report");

link.href = `${reportUrl}${maliciousSite}`;
