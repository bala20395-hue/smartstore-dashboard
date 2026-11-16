import test from "node:test";
import assert from "node:assert/strict";
import { validateProduct } from "../server/src/routes/productValidation.js";

test("accepts and normalizes a valid product", () => {
  assert.deepEqual(validateProduct({
    name: "  Wireless Mouse  ", category: "  Accessories  ", price: "799", stock: "24"
  }), { name: "Wireless Mouse", category: "Accessories", price: 799, stock: 24 });
});
test("rejects an empty product name", () => {
  assert.match(validateProduct({ name: " ", category: "Accessories", price: 799, stock: 24 }), /Name is required/);
});
test("rejects a product name longer than 80 characters", () => {
  assert.match(validateProduct({ name: "x".repeat(81), category: "Accessories", price: 799, stock: 24 }), /80 characters/);
});
test("rejects a missing category", () => {
  assert.match(validateProduct({ name: "Mouse", category: " ", price: 799, stock: 24 }), /Category is required/);
});
test("rejects zero, negative, and non-numeric prices", () => {
  for (const price of [0, -1, "not-a-number"]) {
    assert.match(validateProduct({ name: "Mouse", category: "Accessories", price, stock: 24 }), /Price must/);
  }
});
test("rejects negative or fractional stock", () => {
  for (const stock of [-1, 1.5]) {
    assert.match(validateProduct({ name: "Mouse", category: "Accessories", price: 799, stock }), /Stock must/);
  }
});
test("accepts zero stock as a valid whole number", () => {
  assert.deepEqual(validateProduct({ name: "Mouse", category: "Accessories", price: 799, stock: 0 }), {
    name: "Mouse", category: "Accessories", price: 799, stock: 0
  });
});
