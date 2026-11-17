import { api } from "./api.js";
const CACHE_KEY = "smartstore-products-v1";
const elements = {
  rows: document.querySelector("#product-rows"), status: document.querySelector("#status-message"),
  resultCount: document.querySelector("#result-count"), search: document.querySelector("#search-input"),
  category: document.querySelector("#category-filter"), sort: document.querySelector("#sort-select"),
  dialog: document.querySelector("#product-dialog"), form: document.querySelector("#product-form"),
  dialogTitle: document.querySelector("#dialog-title"), productId: document.querySelector("#product-id"),
  name: document.querySelector("#product-name"), categoryInput: document.querySelector("#product-category"),
  price: document.querySelector("#product-price"), stock: document.querySelector("#product-stock"),
  formError: document.querySelector("#form-error"), addButton: document.querySelector("#add-product-button"),
  closeButton: document.querySelector("#close-dialog-button"), cancelButton: document.querySelector("#cancel-button"),
  themeButton: document.querySelector("#theme-toggle"),
  externalButton: document.querySelector("#load-external-button"),
  externalStatus: document.querySelector("#external-status"),
  externalControls: document.querySelector("#external-controls"),
  externalSearch: document.querySelector("#external-search-input"),
  externalSort: document.querySelector("#external-sort-select"),
  externalCategoryTabs: document.querySelector("#external-category-tabs"),
  externalSkeletons: document.querySelector("#external-skeletons"),
  externalGrid: document.querySelector("#external-product-grid"),
  externalResultCount: document.querySelector("#external-result-count")
};
let products = [];
let externalProducts = [];
let selectedExternalCategory = "all";
let dialogTrigger = null;

function saveCache() {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(products)); }
  catch (error) { console.warn("Could not save product cache:", error); }
}
function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");
    return Array.isArray(cached) ? cached : [];
  } catch { return []; }
}
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(amount);
}
function updateSummary() {
  document.querySelector("#total-products").textContent = products.length;
  document.querySelector("#total-stock").textContent = products.reduce((sum, product) => sum + product.stock, 0);
  const value = products.reduce((sum, product) => sum + product.price * product.stock, 0);
  document.querySelector("#catalog-value").textContent = formatCurrency(value);
}
function updateCategoryOptions() {
  const selected = elements.category.value;
  const categories = [...new Set(products.map((product) => product.category))].sort();
  elements.category.replaceChildren(new Option("All categories", "all"));
  for (const category of categories) elements.category.add(new Option(category, category));
  elements.category.value = categories.includes(selected) ? selected : "all";
}
function getVisibleProducts() {
  const query = elements.search.value.trim().toLowerCase();
  const category = elements.category.value;
  const visible = products.filter((product) => {
    const matchesQuery = `${product.name} ${product.category}`.toLowerCase().includes(query);
    return matchesQuery && (category === "all" || product.category === category);
  });
  const sorters = {
    "name-asc": (a, b) => a.name.localeCompare(b.name),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "stock-desc": (a, b) => b.stock - a.stock
  };
  return visible.sort(sorters[elements.sort.value] || sorters["name-asc"]);
}
function makeCell(value, className, label) {
  const cell = document.createElement("td");
  cell.textContent = String(value);
  if (className) cell.className = className;
  if (label) cell.dataset.label = label;
  return cell;
}
function renderProducts() {
  const visible = getVisibleProducts();
  elements.rows.replaceChildren();
  if (!visible.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5; cell.className = "empty-cell";
    cell.textContent = "No products found. Try changing your search or category.";
    row.append(cell); elements.rows.append(row);
  } else {
    for (const product of visible) {
      const row = document.createElement("tr");
      row.append(makeCell(product.name, "product-name", "Product"));
      const categoryCell = document.createElement("td");
      const tag = document.createElement("span");
      tag.className = "category-tag"; tag.textContent = product.category;
      categoryCell.append(tag);
      categoryCell.dataset.label = "Category";
      row.append(categoryCell, makeCell(formatCurrency(product.price), "", "Price"), makeCell(product.stock, "", "Stock"));
      const actionsCell = document.createElement("td");
      actionsCell.dataset.label = "Actions";
      const actions = document.createElement("div"); actions.className = "actions";
      const editButton = document.createElement("button");
      editButton.type = "button"; editButton.className = "button button-secondary button-small";
      editButton.textContent = "Edit"; editButton.setAttribute("aria-label", `Edit ${product.name}`);
      editButton.addEventListener("click", () => openDialog(product));
      const deleteButton = document.createElement("button");
      deleteButton.type = "button"; deleteButton.className = "button-danger button-small";
      deleteButton.textContent = "Delete"; deleteButton.setAttribute("aria-label", `Delete ${product.name}`);
      deleteButton.addEventListener("click", () => deleteProduct(product));
      actions.append(editButton, deleteButton); actionsCell.append(actions); row.append(actionsCell);
      elements.rows.append(row);
    }
  }
  elements.resultCount.textContent = `Showing ${visible.length} of ${products.length} products`;
  updateSummary();
}
function setStatus(message, isError = false) {
  elements.status.textContent = message; elements.status.classList.toggle("error", isError);
}
async function loadProducts() {
  const cached = readCache();
  if (cached.length) {
    products = cached; updateCategoryOptions(); renderProducts();
    setStatus("Showing saved browser data while connecting to the server…");
  }
  try {
    products = await api.getProducts(); saveCache(); updateCategoryOptions(); renderProducts();
    setStatus("Products loaded from the server.");
  } catch (error) {
    if (!cached.length) products = [];
    updateCategoryOptions(); renderProducts();
    setStatus(cached.length
      ? "Server unavailable. Showing the saved browser copy; changes cannot be saved until the server reconnects."
      : "Could not load products. Start the backend server and refresh this page.", true);
    console.error(error);
  }
}
function clearFormErrors() {
  const fields = [[elements.name, "name-error"], [elements.categoryInput, "category-error"],
    [elements.price, "price-error"], [elements.stock, "stock-error"]];
  for (const [input, errorId] of fields) {
    document.querySelector(`#${errorId}`).textContent = "";
    input.setAttribute("aria-invalid", "false");
  }
  elements.formError.textContent = "";
}
function setFieldError(input, errorId, message) {
  document.querySelector(`#${errorId}`).textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
}
function validateForm() {
  clearFormErrors(); let valid = true;
  const name = elements.name.value.trim();
  const category = elements.categoryInput.value.trim();
  const price = Number(elements.price.value); const stock = Number(elements.stock.value);
  if (!name) { setFieldError(elements.name, "name-error", "Enter a product name."); valid = false; }
  if (!category) { setFieldError(elements.categoryInput, "category-error", "Enter a category."); valid = false; }
  if (!Number.isFinite(price) || price <= 0) { setFieldError(elements.price, "price-error", "Price must be greater than zero."); valid = false; }
  if (!Number.isInteger(stock) || stock < 0) { setFieldError(elements.stock, "stock-error", "Stock must be a whole number of zero or more."); valid = false; }
  return valid;
}
function openDialog(product = null) {
  dialogTrigger = document.activeElement;
  elements.form.reset(); clearFormErrors();
  elements.productId.value = product?.id ?? "";
  elements.dialogTitle.textContent = product ? "Edit product" : "Add product";
  if (product) {
    elements.name.value = product.name; elements.categoryInput.value = product.category;
    elements.price.value = product.price; elements.stock.value = product.stock;
  }
  elements.dialog.showModal(); elements.name.focus();
}
function restoreDialogFocus() {
  if (dialogTrigger instanceof HTMLElement && dialogTrigger.isConnected) dialogTrigger.focus();
  else elements.addButton.focus();
  dialogTrigger = null;
}
function closeDialog() { elements.dialog.close(); restoreDialogFocus(); }
async function saveProduct(event) {
  event.preventDefault(); if (!validateForm()) return;
  const product = {
    name: elements.name.value.trim(), category: elements.categoryInput.value.trim(),
    price: Number(elements.price.value), stock: Number(elements.stock.value)
  };
  const id = elements.productId.value;
  try {
    const saved = id ? await api.updateProduct(id, product) : await api.createProduct(product);
    products = id ? products.map((item) => item.id === saved.id ? saved : item) : [...products, saved];
    saveCache(); updateCategoryOptions(); renderProducts();
    setStatus(id ? "Product updated successfully." : "Product added successfully.");
    elements.dialog.close(); restoreDialogFocus();
  } catch (error) { elements.formError.textContent = error.message; }
}
async function deleteProduct(product) {
  if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
  try {
    await api.deleteProduct(product.id); products = products.filter((item) => item.id !== product.id);
    saveCache(); updateCategoryOptions(); renderProducts(); setStatus(`${product.name} deleted.`);
  } catch (error) { setStatus(error.message, true); }
}
function setExternalStatus(message, isError = false) {
  elements.externalStatus.textContent = message;
  elements.externalStatus.classList.toggle("error", isError);
}

function renderExternalCategoryTabs() {
  const categories = [...new Set(externalProducts.map((product) => product.category))].sort();
  elements.externalCategoryTabs.replaceChildren();

  for (const category of ["all", ...categories]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-tab";
    button.dataset.category = category;
    button.textContent = category === "all"
      ? "All categories"
      : category.replace(/-/g, " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    button.setAttribute("aria-pressed", String(selectedExternalCategory === category));
    elements.externalCategoryTabs.append(button);
  }
}

function renderExternalProducts() {
  const query = elements.externalSearch.value.trim().toLowerCase();
  const visible = externalProducts.filter((product) => {
    const matchesQuery = `${product.name} ${product.category}`.toLowerCase().includes(query);
    const matchesCategory = selectedExternalCategory === "all"
      || product.category === selectedExternalCategory;
    return matchesQuery && matchesCategory;
  });

  const sorters = {
    "name-asc": (a, b) => a.name.localeCompare(b.name),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "stock-desc": (a, b) => b.stock - a.stock
  };
  visible.sort(sorters[elements.externalSort.value] || sorters["name-asc"]);
  elements.externalGrid.replaceChildren();

  if (!visible.length) {
    const empty = document.createElement("p");
    empty.className = "empty-cell external-empty";
    empty.textContent = "No sample products match these filters.";
    elements.externalGrid.append(empty);
  } else {
    for (const product of visible) {
      const card = document.createElement("article");
      card.className = "external-product-card";

      const media = document.createElement("div");
      media.className = "external-product-media";
      if (product.thumbnail.startsWith("https://")) {
        const image = document.createElement("img");
        image.src = product.thumbnail;
        image.alt = product.name;
        image.loading = "lazy";
        media.append(image);
      } else {
        media.textContent = "Sample product";
      }

      const details = document.createElement("div");
      details.className = "external-product-details";
      const title = document.createElement("h3");
      title.textContent = product.name;
      const category = document.createElement("span");
      category.className = "category-tag";
      category.textContent = product.category.replace(/-/g, " ");
      const price = document.createElement("p");
      price.className = "external-product-price";
      price.textContent = new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD"
      }).format(product.price);
      const stock = document.createElement("p");
      stock.className = "external-product-stock";
      stock.textContent = `Sample stock: ${product.stock}`;

      details.append(title, category, price, stock);
      card.append(media, details);
      elements.externalGrid.append(card);
    }
  }

  elements.externalResultCount.textContent =
    `Showing ${visible.length} of ${externalProducts.length} public sample products`;
  renderExternalCategoryTabs();
}

async function loadExternalProducts() {
  elements.externalButton.disabled = true;
  elements.externalSkeletons.hidden = false;
  elements.externalGrid.replaceChildren();
  elements.externalControls.hidden = true;
  elements.externalCategoryTabs.hidden = true;
  elements.externalResultCount.textContent = "";
  setExternalStatus("Loading sample products from the public API…");

  try {
    externalProducts = await api.getPublicProducts();
    selectedExternalCategory = "all";
    elements.externalControls.hidden = false;
    elements.externalCategoryTabs.hidden = false;
    setExternalStatus(`Loaded ${externalProducts.length} sample products from DummyJSON.`);
    renderExternalProducts();
  } catch (error) {
    externalProducts = [];
    setExternalStatus(
      "The public catalogue could not be loaded. Check your internet connection and try again.",
      true
    );
    console.error("Public product API error:", error);
  } finally {
    elements.externalSkeletons.hidden = true;
    elements.externalButton.disabled = false;
  }
}

function setupTheme() {
  let savedTheme = "light";
  try { savedTheme = localStorage.getItem("smartstore-theme") || "light"; }
  catch (error) { console.warn("Could not read theme preference:", error); }
  document.documentElement.dataset.theme = savedTheme; updateThemeButton();
}
function updateThemeButton() {
  const isDark = document.documentElement.dataset.theme === "dark";
  elements.themeButton.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  elements.themeButton.textContent = isDark ? "☀" : "◐";
}
elements.addButton.addEventListener("click", () => openDialog());
elements.closeButton.addEventListener("click", closeDialog);
elements.cancelButton.addEventListener("click", closeDialog);
elements.form.addEventListener("submit", saveProduct);
elements.search.addEventListener("input", renderProducts);
elements.category.addEventListener("change", renderProducts);
elements.sort.addEventListener("change", renderProducts);
elements.themeButton.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  try { localStorage.setItem("smartstore-theme", nextTheme); }
  catch (error) { console.warn("Could not save theme preference:", error); }
  updateThemeButton();
});
elements.externalButton.addEventListener("click", loadExternalProducts);
elements.externalSearch.addEventListener("input", renderExternalProducts);
elements.externalSort.addEventListener("change", renderExternalProducts);
elements.externalCategoryTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  selectedExternalCategory = button.dataset.category;
  renderExternalProducts();
});
setupTheme();
loadProducts();
