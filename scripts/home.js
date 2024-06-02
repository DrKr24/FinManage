import localforage from "localforage";
import { addStoreName, removeUser } from "./db";
import { addRemoveHandler, clearSelect, rootLoadHandler } from "./utils";

function removeHandler(name) {
  const homeList = document.querySelector(".home-list");
  const confirm = window.confirm("🗑️?");
  if (confirm) {
    removeUser(name).then(() => renderHomeList(homeList));
  }
}

function userComponent(data) {
  const { name } = data;
  return `<div class="home-list-item">
            <div class="home-list-item-actions">
              <button class="home-list-item-actions-remove" data-name=${name}>
                <img src="../FinManage/icons/remove.png" alt="Remove" />
              </button>
            </div>
            <a href="/FinManage/${name}">${name}</a>
          </div>`;
}

async function renderHomeList(node) {
  const names = (await localforage.getItem("persons")) || [];
  if (!names.length) {
    return (node.innerHTML = names);
  }
  const namesList = names
    .map((name) => {
      return userComponent({ name });
    })
    .join("");
  node.innerHTML = namesList;
  addRemoveHandler(removeHandler, "home-list-item-actions-remove", "name");
}

document.addEventListener("DOMContentLoaded", () => {
  const { pathname } = document.location;
  if (pathname !== "/FinManage/") {
    return;
  }

  let isLoaded = true;

  const interval = setInterval(() => {
    const root = document.querySelector("#root");
    isLoaded = rootLoadHandler(root);
    if (isLoaded) {
      clearInterval(interval);

      const localState = {
        name: "",
        currency: "UAH",
      };

      const buttonSubmit = document.querySelector(".home__actions-submit");
      const nameInput = document.querySelector(".home__actions-text");
      const selects = document.querySelectorAll(".home-select");
      const homeList = document.querySelector(".home-list");

      renderHomeList(homeList);
      nameInput.addEventListener("input", (event) => {
        const inputValue = event.target.value.trim();
        localState[event.target.name] = inputValue;
        if (inputValue.length) {
          buttonSubmit.removeAttribute("disabled");
        } else {
          buttonSubmit.setAttribute("disabled", "");
        }
      });
      selects.forEach((item) => {
        item.addEventListener("change", (event) => {
          const inputValue = event.target.value;
          localState[event.target.name] = inputValue;
        });
      });
      buttonSubmit.addEventListener("click", () => {
        addStoreName(localState.name, {
          currency: localState.currency,
        }).then(() => {
          renderHomeList(homeList);
          nameInput.value = "";
          selects.forEach((item) => clearSelect(item));
          buttonSubmit.setAttribute("disabled", "");
        });
      });
    }
  }, 10);
});
