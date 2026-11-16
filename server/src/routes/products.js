import { Router } from "express";
import { randomUUID } from "node:crypto";
import { pool } from "../db.js";
import { validateProduct } from "./productValidation.js";

const router = Router();

// Used only when DATABASE_URL is not configured (local demo fallback).
let demoProducts = [
  { id: "p-1001", name: "Wireless Mouse", category: "Accessories", price: 799, stock: 24 },
  { id: "p-1002", name: "Mechanical Keyboard", category: "Electronics", price: 2499, stock: 15 },
  { id: "p-1003", name: "USB-C Hub", category: "Accessories", price: 1499, stock: 12 },
  { id: "p-1004", name: "Notebook Set", category: "Stationery", price: 299, stock: 50 },
  { id: "p-1005", name: "Desk Lamp", category: "Home", price: 1199, stock: 8 }
];

const asyncRoute = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

function normalizeRow(row) {
  return { ...row, price: Number(row.price), stock: Number(row.stock) };
}

router.get("/", asyncRoute(async (_req, res) => {
  if (!pool) return res.json(demoProducts);
  const result = await pool.query(
    "SELECT id, name, category, price, stock FROM products ORDER BY created_at, id"
  );
  return res.json(result.rows.map(normalizeRow));
}));

router.post("/", asyncRoute(async (req, res) => {
  const result = validateProduct(req.body);
  if (typeof result === "string") return res.status(400).json({ error: result });
  const product = { id: randomUUID(), ...result };

  if (!pool) {
    demoProducts.push(product);
    return res.status(201).json(product);
  }

  const saved = await pool.query(
    "INSERT INTO products (id, name, category, price, stock) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, category, price, stock",
    [product.id, product.name, product.category, product.price, product.stock]
  );
  return res.status(201).json(normalizeRow(saved.rows[0]));
}));

router.put("/:id", asyncRoute(async (req, res) => {
  const result = validateProduct(req.body);
  if (typeof result === "string") return res.status(400).json({ error: result });

  if (!pool) {
    const index = demoProducts.findIndex((product) => product.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Product not found." });
    demoProducts[index] = { ...demoProducts[index], ...result };
    return res.json(demoProducts[index]);
  }

  const saved = await pool.query(
    "UPDATE products SET name = $1, category = $2, price = $3, stock = $4 WHERE id = $5 RETURNING id, name, category, price, stock",
    [result.name, result.category, result.price, result.stock, req.params.id]
  );
  if (!saved.rowCount) return res.status(404).json({ error: "Product not found." });
  return res.json(normalizeRow(saved.rows[0]));
}));

router.delete("/:id", asyncRoute(async (req, res) => {
  if (!pool) {
    const existing = demoProducts.find((product) => product.id === req.params.id);
    if (!existing) return res.status(404).json({ error: "Product not found." });
    demoProducts = demoProducts.filter((product) => product.id !== req.params.id);
    return res.json({ message: "Product deleted.", id: existing.id });
  }

  const deleted = await pool.query(
    "DELETE FROM products WHERE id = $1 RETURNING id",
    [req.params.id]
  );
  if (!deleted.rowCount) return res.status(404).json({ error: "Product not found." });
  return res.json({ message: "Product deleted.", id: deleted.rows[0].id });
}));

export default router;
