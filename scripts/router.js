import page from "page";
const root = document.getElementById("root");
const currency = document.querySelector(".header__currency");

function loadPageContent(path) {
  fetch(`../FinManage/pages/${path}`)
    .then((response) => response.text())
    .then((html) => (root.innerHTML = html))
    .catch((error) => console.error(error));
}

function loadHome(ctx, next) {
  loadPageContent("Home.html");
  next();
}

function loadUser(ctx, next) {
  loadPageContent("User.html");
  currency.style.visibility = "visible";
  next();
}
page.base("/FinManage");

page("/", loadHome);
page("/:user", loadUser);

page();
