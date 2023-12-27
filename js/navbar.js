let navbarElement = document.getElementById("navbar");
let menu = document.getElementById("hamburger");
menu.addEventListener("click", () => {
  fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
      navbarElement.innerHTML = data;
      let closeBtn = navbarElement.querySelector("#close");
      console.log(closeBtn, "CLOSE");
      closeBtn.addEventListener("click", () => (navbarElement.innerHTML = ""));
    });
});
