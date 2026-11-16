import { api } from "./api.js";

const CACHE_KEY = "smartstore-products-v1";
const elements = {
  rows: document.querySelector("#product-rows"),
  status: document.querySelector("#status-message"),
  resultCount: document.querySelector("#result-count"),
  search: document.querySelector("#search-input"),
  category: document.querySelector("#category-filter"),
  sort: document.querySelector("#sort-select"),
  dialog: document.querySelector("#product-dialog"),
  form: document.querySelector("#product-form"),
  dialogTitle: document.querySelector("#dialog-title"),
  productId: document.querySelector("#product-id"),
  name: document.querySelector("#product-name"),
  categoryInput: document.querySelector("#product-category"),
  price: document.querySelector("#product-price"),
  stock: document.querySelector("#product-stock"),
  formError: document.querySelector("#form-error"),
  addButton: document.querySelector("#add-product-button"),
  closeButton: document.querySelector("#close-dialog-button"),
  cancelButton: document.querySelector("#cancel-button"),
  themeButton: document.querySelector("#theme-toggle")
};

let products = [];

function saveCache() {
  localStorage.setItem(CACHE_KEY, JSON.stringify(products));
}

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "[]");
  } catch {
    return [];
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(amount);
}

function updateSummary() {
  document.querySelector("#total-products").textContent = products.length;
  document.querySelector("#total-stock").textContent =
    products.reduce((sum, product) => sum + product.stock, 0);
  const value = products.reduce((sum, product) => sum + product.price * product.stock, 0);
  document.querySelector("#catalog-value").textContent = formatCurrency(value);
}

function updateCategoryOptions() {
  const selected = elements.category.value;
  const categories = [...new Set(products.map((product) => product.category))].sort();
  elements.category.replaceChildren(new Option("All categories", "all"));
  for (const category of categories) {
    elements.category.add(new Option(category, category));
  }
  elements.category.value = categories.includes(selected) ? selected : "all";
}

function getVisibleProducts() {
  const query = elements.search.value.trim().toLowerCase();
  const category = elements.category.value;
  const visible = products.filter((product) => {
    const matchesQuery = `${product.name} ${product.category}`.toLowerCase().includes(query);
    const matchesCategory = category === "all" || product.category === category;
    return matchesQuery && matchesCategory;
  });

  const sorters = {
    "name-asc": (a, b) => a.name.localeCompare(b.name),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "stock-desc": (a, b) => b.stock - a.stock
  };
  return visible.sort(sorters[elements.sort.value] || sorters["name-asc"]);
}

function makeCell(value, className) {
  const cell = document.createElement("td");
  cell.textContent = value;
  if (className) cell.className = className;
  return cell;
}

function renderProducts() {
  const visible = getVisibleProducts();
  elements.rows.replaceChildren();

  if (visible.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "empty-cell";
    cell.textContent = "No products found. Try changing your search or category.";
    row.append(cell);
    elements.rows.append(row);
  } else {
    for (const product of visible) {
      const row = document.createElement("tr");
      row.append(makeCell(product.name, "product-name"));

      const categoryCell = document.createElement("td");
      const tag = document.createElement("span");
      tag.className = "category-tag";
      tag.textContent = product.category;
      categoryCell.append(tag);
      row.append(categoryCell);

      row.append(makeCell(formatCurrency(product.price)));
      row.append(makeCell(String(product.stock)));

      const actionsCell = document.createElement("td");
      const actions = document.createElement("div");
      actions.className = "actions";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "button button-secondary button-small";
      editButton.textContent = "Edit";
      editButton.setAttribute("aria-label", `Edit ${product.name}`);
      editButton.addEventListener("click", () => openDialog(product));

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "button-danger button-small";
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute("aria-label", `Delete ${product.name}`);
      deleteButton.addEventListener("click", () => deleteProduct(product));

      actions.append(editButton, deleteButton);
      actionsCell.append(actions);
      row.append(actionsCell);
      elements.rows.append(row);
    }
  }

  elements.resultCount.textContent = `Showing ${visible.length} of ${products.length} products`;
  updateSummary();
}

function setStatus(message, isError = false) {
  elements.status.textContent = message;
  elements.status.classList.toggle("error", isError);
}

async function loadProducts() {
  const cached = readCache();
  if (cached.length) {
    products = cached;
    updateCategoryOptions();
    renderProducts();
    setStatus("Showing saved browser data while connecting to the server…");
  }

  try {
    products = await api.getProducts();
    saveCache();
    updateCategoryOptions();
    renderProducts();
    setStatus("Products loaded from the server.");
  } catch (error) {
    if (!cached.length) products = [];
    updateCategoryOptions();
    renderProducts();
    setStatus(
      cached.length
        ? "Server unavailable. Showing the saved browser copy; changes cannot be saved until the server reconnects."
        : "Could not load products. Start the backend server and refresh this page.",
      true
    );
    console.error(error);
  }
}

function clearFormErrors() {
  for (const id of ["name-error", "category-error", "price-error", "stock-error"]) {
    document.querySelector(`#${id}`).textContent = "";
  }
  elements.formError.textContent = "";
}

function validateForm() {
  clearFormErrors();
  let valid = true;
  const name = elements.name.value.trim();
  const category = elements.categoryInput.value.trim();
  const price = Number(elements.price.value);
  const stock = Number(elements.stock.value);

  if (!name) {
    document.querySelector("#name-error").textContent = "Enter a product name.";
    valid = false;
  }
  if (!category) {
    document.querySelector("#category-error").textContent = "Enter a category.";
    valid = false;
  }
  if (!Number.isFinite(price) || price <= 0) {
    document.querySelector("#price-error").textContent = "Price must be greater than zero.";
    valid = false;
  }
  if (!Number.isInteger(stock) || stock < 0) {
    document.querySelector("#stock-error").textContent = "Stock must be a whole number of zero or more.";
    valid = false;
  }
  return valid;
}

function openDialog(product = null) {
  elements.form.reset();
  clearFormErrors();
  elements.productId.value = product?.id ?? "";
  elements.dialogTitle.textContent = product ? "Edit product" : "Add product";
  if (product) {
    elements.name.value = product.name;
    elements.categoryInput.value = product.category;
    elements.price.value = product.price;
    elements.stock.value = product.stock;
  }
  elements.dialog.showModal();
  elements.name.focus();
}

function closeDialog() {
  elements.dialog.close();
  elements.addButton.focus();
}

async function saveProduct(event) {
  event.preventDefault();
  if (!validateForm()) return;

  const product = {
    name: elements.name.value.trim(),
    category: elements.categoryInput.value.trim(),
    price: Number(elements.price.value),
    stock: Number(elements.stock.value)
  };
  const id = elements.productId.value;

  try {
    const saved = id
      ? await api.updateProduct(id, product)
      : await api.createProduct(product);

    if (id) {
      products = products.map((item) => item.id === saved.id ? saved : item);
    } else {
      products.push(saved);
    }

    saveCache();
    updateCategoryOptions();
    renderProducts();
    setStatus(id ? "Product updated successfully." : "Product added successfully.");
    elements.dialog.close();
    elements.addButton.focus();
  } catch (error) {
    elements.formError.textContent = error.message;
  }
}

async function deleteProduct(product) {
  const confirmed = window.confirm(`Delete "${product.name}"? This cannot be undone.`);
  if (!confirmed) return;

  try {
    await api.deleteProduct(product.id);
    products = products.filter((item) => item.id !== product.id);
    saveCache();
    updateCategoryOptions();
    renderProducts();
    setStatus(`${product.name} deleted.`);
  } catch (error) {
    setStatus(error.message, true);
  }
}

function setupTheme() {
  const savedTheme = localStorage.getItem("smartstore-theme") || "light";
  document.documentElement.dataset.theme = savedTheme;
  updateThemeButton();
}

function updateThemeButton() {
  const isDark = document.documentElement.dataset.theme === "dark";
  elements.themeButton.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme"
  );
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
  localStorage.setItem("smartstore-theme", nextTheme);
  updateThemeButton();
});

setupTheme();
loadProducts();
