export function rootLoadHandler(root) {
  let isLoaded = false;
  if (!root.children.length) {
    isLoaded = false;
    return isLoaded;
  } else {
    isLoaded = true;
    return isLoaded;
  }
}

export function setName(pathname, node) {
  const name = pathname.split("/")[1];
  node.textContent = name;
  return name;
}

export function clearSelect(select) {
  select.selectedIndex = 0;
}

export function addRemoveHandler(
  removeHandler,
  removeButtonsClass,
  dataset,
  type = null
) {
  const removeButtons =
    document.querySelectorAll(`.${removeButtonsClass}`) || [];
  if (!removeButtons.length) {
    return;
  }
  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const datavalue = event.currentTarget.dataset[dataset];
      const datatype = event.currentTarget.dataset[type] || null;
      removeHandler(datavalue, datatype);
    });
  });
}

export function addEditHandler(
  editHandler,
  editButtonsClass,
  dataset,
  type = null
) {
  const removeButtons = document.querySelectorAll(`.${editButtonsClass}`) || [];
  if (!removeButtons.length) {
    return;
  }
  removeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const datavalue = event.currentTarget.dataset[dataset];
      const datatype = event.currentTarget.dataset[type] || null;
      editHandler(datavalue, datatype);
    });
  });
}
