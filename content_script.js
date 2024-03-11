// Retrieve the URL of the current webpage
var currentUrl = window.location.href;

// Send the URL to the background script
chrome.runtime.sendMessage({ url: currentUrl });
