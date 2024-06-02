import ua from "../language/ua.json";
import en from "../language/en.json";
import { getAppLanguage, setAppLanguage } from "./db";
import { rootLoadHandler } from "./utils";
const languageItems = document.querySelectorAll(".header__language-item");
const langs = ["ua", "en"];
let currentLanguage = {};

function setActiveItem() {
  getAppLanguage().then((data) => {
    const { language, index } = data;
    if (language === "ua") {
      if (
        languageItems[index].classList.contains("header__language-item-active")
      ) {
        return;
      }
      changeUrlLanguage(language);
      translateWords();
      languageItems.forEach((lg, idx) =>
        languageItems[idx].classList.remove("header__language-item-active")
      );
      languageItems[index].classList.add("header__language-item-active");
    } else if (language === "en") {
      if (
        languageItems[index].classList.contains("header__language-item-active")
      ) {
        return;
      }
      changeUrlLanguage(language);
      translateWords();
      languageItems.forEach((lg, idx) =>
        languageItems[idx].classList.remove("header__language-item-active")
      );
      languageItems[index].classList.add("header__language-item-active");
    }
  });
}

function languageHandler() {
  languageItems.forEach((item, index) =>
    item.addEventListener("click", (event) => {
      let language = event.target.innerText.toLocaleLowerCase();
      setAppLanguage(language).then(() => {
        setActiveItem();
        location.reload();
      });
    })
  );
}

function setLanguage(lang) {
  location.href = `${window.location.pathname}#${lang}`;
  let locallangs = { ua: ua, en: en };
  currentLanguage = locallangs;
}

function translateWords() {
  const lang = location.hash.substring(1);
  let isLoaded = false;
  const interval = setInterval(() => {
    const root = document.querySelector("#root");
    isLoaded = rootLoadHandler(root);
    if (isLoaded) {
      clearInterval(interval);
      for (let key in currentLanguage[lang]) {
        const elem = document.querySelector(`[data-lang=${key}]`);

        if (elem) {
          const word = elem.dataset.langWord;
          elem.textContent = currentLanguage[lang][key][word];
        }
      }
    }
  });
}

function changeUrlLanguage(lang) {
  if (langs.includes(lang)) {
    setLanguage(lang);
  }
}

export default function getLangWords() {
  const lang = location.hash.substring(1);
  return currentLanguage[lang];
}

setActiveItem();
languageHandler();
