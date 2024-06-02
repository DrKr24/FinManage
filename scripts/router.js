import page from "page";
const root = document.getElementById("root");
const currency = document.querySelector(".header__currency");

function loadPageContent(path) {
  fetch(path)
    .then((response) => response.text())
    .then((html) => (root.innerHTML = html))
    .catch((error) => console.error(error));
}

function loadHome(ctx, next) {
  loadPageContent("../pages/Home.html");
  next();
}

function loadUser(ctx, next) {
  loadPageContent("../pages/User.html");
  currency.style.visibility = "visible";
  next();
}

page("/", loadHome);
page("/:user", loadUser);

page();
