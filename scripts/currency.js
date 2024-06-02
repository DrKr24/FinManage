import { changeCurrency, getBase } from "./db";

const currencyBlock = document.querySelector(".header__currency");
const currencyBlockActive = document.querySelector(".header__currency-active");
const currencyButton = document.querySelector(".header__currency-btn");
const currencyItems = document.querySelectorAll(".header__currency-list-item");

const currencyData = {
  UAH: {
    DOLLAR: 0.025,
    EURO: 0.024,
    UAH: 1,
  },
  DOLLAR: {
    DOLLAR: 1,
    EURO: 0.97,
    UAH: 40,
  },
  EURO: {
    DOLLAR: 0.97,
    EURO: 1,
    UAH: 41.6679,
  },
};

export const currencyAssosiatedData = {
  UAH: "₴",
  DOLLAR: "$",
  EURO: "€",
};

function setCurrency(currency) {
  const { pathname } = document.location;
  const name = pathname.split("/")[1];
  getBase(name).then((data) => {
    const value = currencyData[data.currency][currency];
    changeCurrency(name, currency, value);
  });
}

function currencyHandler() {
  currencyButton.addEventListener("click", () => {
    if (!currencyBlockActive) {
      currencyButton.style.display = "none";
    }
    currencyBlock.classList.add("header__currency-active");
  });
  currencyItems.forEach((item, index) =>
    item.addEventListener("click", (e) => {
      for (let i = 0; i < currencyItems.length; i++) {
        currencyItems[i].style.order = "0";
        currencyItems[index].setAttribute("data-selected", "0");
      }
      currencyItems[index].style.order = "-1";
      currencyItems[index].setAttribute("data-selected", "1");
      setCurrency(e.target.dataset.currency);
      currencyBlock.classList.remove("header__currency-active");
      currencyButton.style.display = "block";
    })
  );
}

export function setCurrencyByValue(value) {
  currencyItems.forEach((currencyItem, index) => {
    const currency = currencyItem.getAttribute("data-currency");
    for (let i = 0; i < currencyItems.length; i++) {
      currencyItems[index].style.order = "0";
      currencyItems[index].setAttribute("data-selected", "0");
    }
    if (currency === value) {
      currencyItems[index].style.order = "-1";
      currencyItems[index].setAttribute("data-selected", "1");
    }
  });
}

currencyHandler();
