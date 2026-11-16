import { Router } from "express";
import { randomUUID } from "node:crypto";

const router = Router();

// Demonstration-only in-memory data. Restarting the server resets these records.
let products = [
  { id: "p-1001", name: "Wireless Mouse", category: "Accessories", price: 799, stock: 24 },
  { id: "p-1002", name: "Mechanical Keyboard", category: "Electronics", price: 2499, stock: 15 },
  { id: "p-1003", name: "USB-C Hub", category: "Accessories", price: 1499, stock: 12 },
  { id: "p-1004", name: "Notebook Set", category: "Stationery", price: 299, stock: 50 },
  { id: "p-1005", name: "Desk Lamp", category: "Home", price: 1199, stock: 8 }
];

function validateProduct(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const price = Number(body.price);
  const stock = Number(body.stock);

  if (!name || name.length > 80) return "Name is required and must be 80 characters or fewer.";
  if (!category || category.length > 50) return "Category is required and must be 50 characters or fewer.";
  if (!Number.isFinite(price) || price <= 0) return "Price must be a number greater than zero.";
  if (!Number.isInteger(stock) || stock < 0) return "Stock must be a whole number of zero or more.";

  return { name, category, price, stock };
}

router.get("/", (_req, res) => {
  res.json(products);
});

router.post("/", (req, res) => {
  const result = validateProduct(req.body);
  if (typeof result === "string") return res.status(400).json({ error: result });

  const product = { id: randomUUID(), ...result };
  products.push(product);
  return res.status(201).json(product);
});

router.put("/:id", (req, res) => {
  const index = products.findIndex((product) => product.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Product not found." });

  const result = validateProduct(req.body);
  if (typeof result === "string") return res.status(400).json({ error: result });

  products[index] = { ...products[index], ...result };
  return res.json(products[index]);
});

router.delete("/:id", (req, res) => {
  const existing = products.find((product) => product.id === req.params.id);
  if (!existing) return res.status(404).json({ error: "Product not found." });

  products = products.filter((product) => product.id !== req.params.id);
  return res.json({ message: "Product deleted.", id: existing.id });
});

export default router;
