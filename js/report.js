"use strict";

const browser = window.msBrowser || window.browser || window.chrome;
const background = browser.extension.getBackgroundPage();
const USER_REPORT_URL =
  "https://us-central1-counter-phishing.cloudfunctions.net/userReport";

let reportCurrent = document.getElementById("reportCurrent");
let maliciousSite = document.getElementById("maliciousSite");
let reportButton = document.getElementById("reportButton");

let radioButtons = document.querySelectorAll(".radio_element");

function setReportType(radioButton) {
  let report_type = radioButton.getAttribute("data-value");
  let reportRadio = document.querySelector(".report_radio");
  let previous_reportRadio = reportRadio.getAttribute("data-value");
  if (previous_reportRadio !== "") return;
  reportRadio.setAttribute("data-value", report_type);
  let radioButton_Img = radioButton.getElementsByTagName("img")[0];
  radioButton_Img.src = "/img/radio_ticked.png";
  let footer = document.querySelector(".footer");
  footer.style.display = "none";
  instantiated_dropdown();
}

radioButtons.forEach((radioButton) =>
  radioButton.addEventListener("click", () => setReportType(radioButton))
);

reportButton.addEventListener("click", function () {
  recaptchaCallback();
});

function instantiated_dropdown(instantiate = true) {
  let instantiated_dropdown = document.querySelectorAll(
    ".instantiated_dropdown"
  );
  instantiated_dropdown.forEach((dropdown_instance) => {
    dropdown_instance.style.opacity = instantiate ? "1" : "0";
    dropdown_instance.style.display = instantiate ? "block" : "none";
  });
}

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

function recaptchaCallback() {
  let url = document.getElementById("maliciousSite").value;
  let target = document.getElementById("impersonatedUrl").value;

  instantiated_dropdown(false);
  document.getElementById("loader").style.display = "block";
  document.getElementById("loader-background").style.display = "block";

  let report_radio = document.querySelector(".report_radio");
  let incident = {
    incidentType: report_radio.getAttribute("data-value"),
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

function recaptchaError() {
  window.location.replace("error.html");
}

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
