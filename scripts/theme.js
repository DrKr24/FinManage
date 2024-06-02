import { getAppTheme, setAppTheme } from "./db";

const body = document.querySelector("body");
const themeButton = document.querySelector(".header__theme");

function themeHandler() {
  getAppTheme().then((theme) => {
    if (theme === "light") {
      body.setAttribute("dark", "");
    } else {
      body.removeAttribute("dark");
    }
    themeButton.addEventListener("click", () => {
      if (theme === "light") {
        setAppTheme("dark");
      } else {
        setAppTheme("light");
      }
      location.reload();
    });
  });
}

themeHandler();
