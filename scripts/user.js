import { editItem, getCurrency, removeItem } from "./db";
import { currencyAssosiatedData, setCurrencyByValue } from "./currency";
import { getUser, setCost, setIncome } from "./db";
import {
  addEditHandler,
  addRemoveHandler,
  clearSelect,
  rootLoadHandler,
  setName,
} from "./utils";
import dayjs from "dayjs";

let state = {
  income: [],
  cost: [],
  title: "",
  value: "",
  isIncome: true,
  isIncomePrev: true,
  isEdit: false,
  editingId: null,
  currency: "",
};

function incomeComponent(data) {
  const { title, value, id, date } = data;
  return `<div class="main__lists-item-content-item">
                <p class="main__lists-item-content-item-title">
                  ${title}
                </p>
                <div class="main__lists-item-content-item-actions">
                  <button class="main__lists-item-content-item-actions-edit income-button" data-id="${id}" data-type="income">
                    <img src="../FinManage/icons/edit.png" alt="edit" />
                  </button>
                  <button class="main__lists-item-content-item-actions-remove income-button" data-id="${id}" data-type="income">
                    <img src="../FinManage/icons/remove.png" alt="remove" />
                  </button>
                </div>
                <div class="main__lists-item-content-item-info">
                  <p class="main__lists-item-content-item-info-value">
                    ${value}${currencyAssosiatedData[state.currency]}
                  </p>
                  <p class="main__lists-item-content-item-info-date">
                    ${date}
                  </p>
                </div>
              </div>`;
}

function costComponent(data) {
  const { title, value, id, date } = data;
  return `<div class="main__lists-item-content-item">
                <p class="main__lists-item-content-item-title">
                  ${title}
                </p>
                <div class="main__lists-item-content-item-actions">
                  <button class="main__lists-item-content-item-actions-edit income-button" data-id="${id}" data-type="cost">
                    <img src="../FinManage/icons/edit.png" alt="edit" />
                  </button>
                  <button class="main__lists-item-content-item-actions-remove cost-button" data-id="${id}" data-type="cost">
                    <img src="../FinManage/icons/remove.png" alt="remove" />
                  </button>
                </div>
                <div class="main__lists-item-content-item-info">
                  <p class="main__lists-item-content-item-info-value">
                    ${value}${currencyAssosiatedData[state.currency]}
                  </p>
                  <p class="main__lists-item-content-item-info-date">
                    ${date}
                  </p>
                </div>
              </div>`;
}

function editHandler(id, type) {
  const header = document.querySelector(".header");
  const submit = document.querySelector(".main__actions-submit");
  const item =
    type === "income"
      ? state.income.find((item) => item.id.toString() === id)
      : state.cost.find((item) => item.id.toString() === id);
  setEditFields(item.title, item.value, type, id, header, submit);
}

function setEditFields(title, value, type, id, scrollElement, button) {
  const titleField = document.querySelector(".main__actions-title");
  const valueField = document.querySelector(".main__actions-value");
  const select = document.querySelector(".main__actions-select");
  const itemType = type === "income" ? true : false;
  state.title = title;
  state.value = value;
  state.isIncomePrev = itemType;
  state.isIncome = itemType;
  state.isEdit = true;
  state.editingId = id;

  titleField.value = title;
  valueField.value = Number(value);
  select.selectedIndex = type === "income" ? 0 : 1;
  window.scrollTo({ top: scrollElement.offsetTop, behavior: "smooth" });
  button.removeAttribute("disabled");
}

function clearAll() {
  const titleField = document.querySelector(".main__actions-title");
  const valueField = document.querySelector(".main__actions-value");
  const select = document.querySelector(".main__actions-select");
  const submit = document.querySelector(".main__actions-submit");

  state.title = "";
  state.value = "";
  state.isIncomePrev = true;
  state.isIncome = true;
  state.isEdit = false;
  state.editingId = null;

  titleField.value = "";
  valueField.value = "";
  select.selectedIndex = 0;
  submit.setAttribute("disabled", "");
}

function removeHandler(id, type) {
  const incomelist = document.querySelector(".main__lists-income");
  const costlist = document.querySelector(".main__lists-cost");
  const incomeprogress = document.querySelector(
    ".main__difference-progress-income"
  );
  const costprogress = document.querySelector(
    ".main__difference-progress-cost"
  );
  const incomepercent = document.querySelector(
    ".main__difference-value-income-value"
  );
  const costpercent = document.querySelector(
    ".main__difference-value-cost-value"
  );
  const { pathname } = document.location;
  const name = pathname.split("/")[2];
  const confirm = window.confirm("🗑️?");
  if (confirm) {
    removeItem(name, id, type).then(() => {
      getUser(name).then(({ cost, income }) => {
        state = { ...state, cost, income };
        renderItems(cost, costlist, "cost");
        renderItems(income, incomelist, "income");
        renderProgress(incomeprogress, incomepercent, income, cost, "income");
        renderProgress(costprogress, costpercent, income, cost, "cost");
        runRemoveAndEditHandler();
      });
    });
  }
}

function runRemoveAndEditHandler() {
  addRemoveHandler(
    removeHandler,
    "main__lists-item-content-item-actions-remove",
    "id",
    "type"
  );
  addEditHandler(
    editHandler,
    "main__lists-item-content-item-actions-edit",
    "id",
    "type"
  );
}

function renderItems(items, node, type) {
  if (!items.length) {
    return (node.innerHTML = []);
  }
  const list = items
    .map((item) =>
      type === "income" ? incomeComponent(item) : costComponent(item)
    )
    .join("");
  node.innerHTML = list;
}

function calculateProgressIncome(income, cost) {
  if (!income.length) {
    return 0;
  }
  if (!cost.length) {
    return 100;
  }
  const costSumValue = cost.reduce(
    (acc, item) => (acc += Number(item.value)),
    0
  );
  const incomeSumValue = income.reduce(
    (acc, item) => (acc += Number(item.value)),
    0
  );
  const incomeCostSum = costSumValue + incomeSumValue;
  const percent = incomeCostSum / 100;
  const incomePercent = incomeSumValue / percent;
  return Math.round(incomePercent);
}
function calculateProgressCost(income, cost) {
  if (!cost.length) {
    return 0;
  }
  if (!income.length) {
    return 100;
  }
  const costSumValue = cost.reduce(
    (acc, item) => (acc += Number(item.value)),
    0
  );
  const incomeSumValue = income.reduce(
    (acc, item) => (acc += Number(item.value)),
    0
  );
  const incomeCostSum = costSumValue + incomeSumValue;
  const percent = incomeCostSum / 100;
  const costPercent = costSumValue / percent;
  return Math.round(costPercent);
}

function renderProgress(progressNode, percentNode, income, cost, type) {
  progressNode.style.width =
    type === "income"
      ? `${calculateProgressIncome(income, cost)}%`
      : `${calculateProgressCost(income, cost)}%`;
  percentNode.textContent =
    type === "income"
      ? `${calculateProgressIncome(income, cost)}%`
      : `${calculateProgressCost(income, cost)}%`;
}

function sortByMinMax(event, incomeData, costData, costNode, incomeNode, type) {
  const income = [...incomeData];
  const cost = [...costData];
  if (event.target.checked) {
    if (type === "min") {
      income.sort((a, b) => a?.value - b?.value);
      cost.sort((a, b) => a?.value - b?.value);
    } else {
      income.sort((a, b) => b?.value - a?.value);
      cost.sort((a, b) => b?.value - a?.value);
    }
  }
  renderItems(income, incomeNode, "income");
  renderItems(cost, costNode, "cost");
}

function searchItems(event, incomeData, costData, costNode, incomeNode) {
  const value = event.target.value;
  const income = incomeData.filter((item) =>
    item.title.toLowerCase().includes(value.toLowerCase())
  );
  const cost = costData.filter((item) =>
    item.title.toLowerCase().includes(value.toLowerCase())
  );
  renderItems(income, incomeNode, "income");
  renderItems(cost, costNode, "cost");
}

document.addEventListener("DOMContentLoaded", () => {
  const { pathname } = document.location;
  if (pathname === "/FinManage/") {
    return;
  }
  let isLoaded = false;
  const interval = setInterval(() => {
    const root = document.querySelector("#root");
    isLoaded = rootLoadHandler(root);

    if (isLoaded) {
      clearInterval(interval);
      const node = document.querySelector(".main__name");
      const title = document.querySelector(".main__actions-title");
      const value = document.querySelector(".main__actions-value");
      const select = document.querySelector(".main__actions-select");
      const submit = document.querySelector(".main__actions-submit");
      const incomelist = document.querySelector(".main__lists-income");
      const costlist = document.querySelector(".main__lists-cost");
      const search = document.querySelector(".main__filters-search");
      const min = document.querySelector(".main__filters-min");
      const max = document.querySelector(".main__filters-max");
      const clearSubmit = document.querySelector(".main__filters-submit");
      const incomeprogress = document.querySelector(
        ".main__difference-progress-income"
      );
      const costprogress = document.querySelector(
        ".main__difference-progress-cost"
      );
      const incomepercent = document.querySelector(
        ".main__difference-value-income-value"
      );
      const costpercent = document.querySelector(
        ".main__difference-value-cost-value"
      );

      const name = setName(pathname, node);

      getCurrency(name).then(({ currency }) => {
        setCurrencyByValue(currency);
        state = { ...state, currency };
      });
      getUser(name).then(({ cost, income }) => {
        state = { ...state, cost, income };
        renderItems(cost, costlist, "cost");
        renderItems(income, incomelist, "income");
        renderProgress(incomeprogress, incomepercent, income, cost, "income");
        renderProgress(costprogress, costpercent, income, cost, "cost");
        runRemoveAndEditHandler();
      });
      function inputHandler(event) {
        const { name, value } = event.target;
        state = { ...state, [name]: value.trim() };
        if (!state.title.length || !state.value.length) {
          submit.setAttribute("disabled", "");
        } else {
          submit.removeAttribute("disabled");
        }
      }
      function clearFilters() {
        search.value = "";
        min.checked = false;
        max.checked = false;
        renderItems(state.income, incomelist, "income");
        renderItems(state.cost, costlist, "cost");
      }

      function submitHandler() {
        const now = dayjs();
        const formattedDate = now.format("DD.MM.YYYY");
        const data = {
          id: Date.now(),
          title: state.title,
          value: state.value,
          date: formattedDate,
        };
        if (state.isEdit) {
          if (state.editingId) {
            const type = state.isIncome ? "income" : "cost";
            const prevType = state.isIncomePrev ? "income" : "cost";
            editItem(
              name,
              state.editingId,
              {
                title: state.title,
                value: state.value,
                date: formattedDate,
              },
              type,
              prevType
            ).then(() => {
              getUser(name).then(({ cost, income }) => {
                clearAll();
                state = { ...state, cost, income };
                renderItems(income, incomelist, "income");
                renderItems(cost, costlist, "cost");
                renderProgress(
                  incomeprogress,
                  incomepercent,
                  income,
                  cost,
                  "income"
                );
                renderProgress(costprogress, costpercent, income, cost, "cost");

                runRemoveAndEditHandler();
              });
            });
          }
          return;
        }
        if (state.isIncome) {
          setIncome([...state.income, data], name).then(() => {
            getUser(name).then(({ cost, income }) => {
              state = { ...state, cost, income };
              renderItems(income, incomelist, "income");
              renderProgress(
                incomeprogress,
                incomepercent,
                income,
                cost,
                "income"
              );
              renderProgress(costprogress, costpercent, income, cost, "cost");

              runRemoveAndEditHandler();
            });
          });
        } else {
          setCost([...state.cost, data], name).then(() => {
            getUser(name).then(({ cost, income }) => {
              state = { ...state, cost, income };
              renderItems(cost, costlist, "cost");
              renderProgress(
                incomeprogress,
                incomepercent,
                income,
                cost,
                "income"
              );
              renderProgress(costprogress, costpercent, income, cost, "cost");

              runRemoveAndEditHandler();
            });
          });
        }
        title.value = "";
        value.value = "";
        state.title = "";
        state.value = "";
        state.isIncome = true;
        clearSelect(select);
      }
      title.addEventListener("input", inputHandler);
      value.addEventListener("input", inputHandler);
      select.addEventListener(
        "change",
        (event) =>
          (state = {
            ...state,
            isIncome: event.target.value === "false" ? false : true,
          })
      );
      submit.addEventListener("click", submitHandler);
      clearSubmit.addEventListener("click", clearFilters);
      min.addEventListener("change", (e) => {
        sortByMinMax(e, state.income, state.cost, costlist, incomelist, "min");
        runRemoveAndEditHandler();
      });
      max.addEventListener("change", (e) => {
        sortByMinMax(e, state.income, state.cost, costlist, incomelist, "max");
        runRemoveAndEditHandler();
      });
      search.addEventListener("input", (e) => {
        searchItems(e, state.income, state.cost, costlist, incomelist);
        runRemoveAndEditHandler();
      });
    }
  }, 10);
});
