const API_BASE = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed (${response.status})`);
  }
  return payload;
}

export const api = {
  getProducts: () => request("/products"),
  createProduct: (product) => request("/products", {
    method: "POST",
    body: JSON.stringify(product)
  }),
  updateProduct: (id, product) => request(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(product)
  }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),
  async getPublicProducts() {
    const response = await fetch(
      "https://dummyjson.com/products?limit=12&select=id,title,price,stock,category,thumbnail",
      { headers: { Accept: "application/json" } }
    );

    if (!response.ok) {
      throw new Error(`Public API request failed (HTTP ${response.status}).`);
    }

    const payload = await response.json();
    if (!Array.isArray(payload.products)) {
      throw new Error("The public API returned an unexpected product response.");
    }

    return payload.products.map((item) => ({
      id: item.id,
      name: item.title || "Untitled product",
      category: item.category || "Uncategorized",
      price: Number(item.price) || 0,
      stock: Number(item.stock) || 0,
      thumbnail: typeof item.thumbnail === "string" ? item.thumbnail : ""
    }));
  }
};
