"use strict";

const browser = window.msBrowser || window.browser || window.chrome;
const background = browser.extension.getBackgroundPage();
const USER_REPORT_URL =
  "https://us-central1-counter-phishing.cloudfunctions.net/userReport";

let reportCurrent = document.getElementById("reportCurrent");
let maliciousSite = document.getElementById("maliciousSite");
let list = document.getElementById("targets");
let dropdown = document.getElementById("dropdown");
let targetItems = document.querySelectorAll(".dropdown__item");
let reportButton = document.getElementById("reportButton");

dropdown.addEventListener("click", () => {
  let dropdownContent = document.getElementById("typeDropdown");
  let dropdownImage = dropdown.querySelector("label img");
  if (dropdown.getAttribute("aria-modal") === "true") {
    dropdownContent.style.opacity = "1";
    dropdownContent.style.height = "auto";
    dropdownContent.style.display = "block";
    dropdown.style.marginBottom = "93px";
    dropdown.setAttribute("aria-modal", "false");
    dropdownImage.style.transform = "rotate(180deg)";
  } else {
    dropdownContent.style.opacity = "0";
    dropdownContent.style.height = "0";
    dropdownContent.style.display = "none";
    dropdown.style.marginBottom = "10px";
    dropdown.setAttribute("aria-modal", "true");
    dropdownImage.style.transform = "rotate(0deg)";
  }
});

reportButton.addEventListener("click", function () {
  recaptchaCallback();
});

function instantiated_dropdown() {
  let instantiated_dropdown = document.querySelectorAll(
    ".instantiated_dropdown"
  );
  instantiated_dropdown.forEach((dropdown_instance) => {
    dropdown_instance.style.opacity = "1";
    dropdown_instance.style.display = "block";
  });
  let footerElement = document.getElementById("instantiated_dropdown--true");
  footerElement.style.opacity = "0";
  footerElement.style.display = "none";
}

targetItems.forEach((item) => {
  item.addEventListener("click", () => {
    let dropdownContent = document.getElementById("typeDropdown");
    let value = item.getAttribute("data-value");
    dropdownContent.setAttribute("data-value", value);
    dropdownContent.setAttribute("aria-modal", "false");
    instantiated_dropdown();
  });
});

browser.runtime.sendMessage({
  func: "popup",
});

reportCurrent.addEventListener(
  "click",
  function () {
    browser.tabs.query(
      {
        currentWindow: true,
        active: true,
      },
      function (tabs) {
        maliciousSite.value = tabs[0].url;
      }
    );
  },
  false
);

background.whitelist.forEach(function (item) {
  var option = document.createElement("option");
  option.value = item;
  option.textContent = item;
  list.appendChild(option);
});

// Fix function to take in the dropdown value from aria-valuetext
function recaptchaCallback() {
  let url = document.getElementById("maliciousSite").value;
  let target = document.getElementById("impersonatedUrl").value;

  document.getElementById("loader").style.display = "block";
  document.getElementById("loader-background").style.display = "block";

  let dropdown = document.getElementById("typeDropdown");
  let incident = {
    incidentType: dropdown.getAttribute("data-value"),
    url: url,
    target: getDNSNameFromURL(target),
    reportedBy: localStorage["address"] ? localStorage["address"] : "anonymous",
  };

  console.log(incident, "Incident!!!");

  fetch(USER_REPORT_URL, {
    method: "POST",
    body: new URLSearchParams([...Object.entries(incident)]),
  }).then((response) => {
    if (response.ok) {
      window.location.replace("success.html");
    } else {
      window.location.replace("error.html");
    }
  });
}

// function recaptchaError() {
//   window.location.replace("error.html");
// };

function getDNSNameFromURL(url) {
  if (url.startsWith("http://")) {
    url = url.replace("http://", "");
  } else if (url.startsWith("https://")) {
    url = url.replace("https://", "");
  }

  if (url.indexOf("/") > -1) {
    url = url.split("/")[0];
  }

  let domain = url;

  return domain;
}

// if (typeof localStorage["sessionID"] !== 'undefined') {
//   // authenticated
//   document.getElementById("loginButton").remove()
// } else {
//   document.getElementById("profileButton").remove()
// };

if (typeof localStorage["address"] !== "undefined") {
  document.getElementById("profileButton").innerText = shortenAddress(
    localStorage["address"]
  );
}

function shortenAddress(address) {
  return (
    address.substring(0, 4) +
    "..." +
    address.substring(address.length - 2, address.length)
  );
}

// Jquery datalist plugin
$("#targets").dataList({
  return_mask: "text",
  value_selected_to: "target",
  clearOnFocus: true,
  loadingMessage: "e.g. myetherwallet.com",
});
