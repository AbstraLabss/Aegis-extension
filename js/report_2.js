let reportUrl =
  "https://safebrowsing.google.com/safebrowsing/report_phish/?hl=en&url=";
let maliciousSite = "";

let link = document.getElementById("report");

link.href = `${reportUrl}${maliciousSite}`;
