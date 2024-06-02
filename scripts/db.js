import localforage from "localforage";

export async function addStoreName(name, base) {
  const names = (await localforage.getItem("persons")) || [];
  if (names.includes(name)) {
    return;
  }
  await localforage.setItem("persons", [name, ...names]);
  createStore(name, base);
}

function createStore(storeName, base) {
  let store = localforage.createInstance({
    name: storeName,
  });
  const { currency } = base;
  store.setItem("base", { currency });
  store.setItem("userdata", {
    cost: [],
    income: [],
  });
  store.setItem("currency", {
    currency: currency,
  });
}

export async function getBase(storeName) {
  let store = localforage.createInstance({
    name: storeName,
  });
  const data = await store.getItem("base");
  return data;
}

export async function getUser(storeName) {
  const store = localforage.createInstance({
    name: storeName,
  });
  const userdata = await store.getItem("userdata");
  return userdata;
}

export async function setIncome(income, storeName) {
  const store = localforage.createInstance({
    name: storeName,
  });
  const userdata = await store.getItem("userdata");
  await store.setItem("userdata", { ...userdata, income });
}

export async function setCost(cost, storeName) {
  const store = localforage.createInstance({
    name: storeName,
  });
  const userdata = await store.getItem("userdata");
  await store.setItem("userdata", { ...userdata, cost });
}

export async function removeUser(name) {
  const persons = await localforage.getItem("persons");
  const newPersons = persons.filter((person) => person !== name);
  await localforage.dropInstance({ name });
  await localforage.setItem("persons", newPersons);
}

export async function removeItem(storeName, id, type) {
  const store = localforage.createInstance({
    name: storeName,
  });
  const userdata = await store.getItem("userdata");
  if (type === "income") {
    const income = userdata.income.filter((item) => item.id.toString() !== id);
    await store.setItem("userdata", { ...userdata, income });
  } else {
    const cost = userdata.cost.filter((item) => item.id.toString() !== id);
    await store.setItem("userdata", { ...userdata, cost });
  }
}

export async function editItem(storeName, id, data, type, prevType) {
  const store = localforage.createInstance({
    name: storeName,
  });
  const { title, value, date } = data;
  const userdata = await store.getItem("userdata");
  if (type === "income") {
    if (type === prevType) {
      await store.setItem("userdata", {
        ...userdata,
        income: userdata.income.map((item) =>
          item.id.toString() === id ? { ...item, title, value, date } : item
        ),
      });
    } else {
      await store.setItem("userdata", {
        ...userdata,
        income: [{ id: Date.now(), title, value, date }, ...userdata.income],
        cost: userdata.cost.filter((item) => item.id.toString() !== id),
      });
    }
  } else {
    if (type === prevType) {
      await store.setItem("userdata", {
        ...userdata,
        cost: userdata.cost.map((item) =>
          item.id.toString() === id ? { ...item, title, value, date } : item
        ),
      });
    } else {
      await store.setItem("userdata", {
        ...userdata,
        cost: [{ id: Date.now(), title, value, date }, ...userdata.cost],
        income: userdata.income.filter((item) => item.id.toString() !== id),
      });
    }
  }
}

export async function getCurrency(storeName) {
  const store = localforage.createInstance({ name: storeName });
  const data = await store.getItem("base");
  return data;
}

async function recountAllItemsByCurrencyMultiplayer(store, multiplayer) {
  const userdata = await store.getItem("userdata");
  store.setItem("userdata", {
    ...userdata,
    cost: userdata.cost.map((item) => ({
      ...item,
      value: (Number(item.value) * multiplayer).toFixed(2),
    })),
    income: userdata.income.map((item) => ({
      ...item,
      value: (Number(item.value) * multiplayer).toFixed(2),
    })),
  });
}

export async function changeCurrency(storeName, currency, multiplayer) {
  const store = localforage.createInstance({
    name: storeName,
  });
  await store.setItem("currency", { currency: currency });
  await recountAllItemsByCurrencyMultiplayer(store, multiplayer);
  store.setItem("base", { currency });
  window.location.reload();
}

export async function setAppLanguage(language) {
  await localforage.setItem("language", { language: language });
}

export async function getAppLanguage() {
  const { language } = (await localforage.getItem("language")) || "ua";
  if (language === "ua") {
    return { language, index: 0 };
  } else {
    return { language, index: 1 };
  }
}

export async function setAppTheme(theme) {
  await localforage.setItem("theme", theme);
}

export async function getAppTheme() {
  const theme = (await localforage.getItem("theme")) || "light";
  return theme;
}
