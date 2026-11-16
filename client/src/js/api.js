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
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" })
};
