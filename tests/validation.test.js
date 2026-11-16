import test from "node:test";
import assert from "node:assert/strict";

function isValidProduct(product) {
  return Boolean(
    product &&
    typeof product.name === "string" && product.name.trim().length > 0 &&
    typeof product.category === "string" && product.category.trim().length > 0 &&
    Number.isFinite(Number(product.price)) && Number(product.price) > 0 &&
    Number.isInteger(Number(product.stock)) && Number(product.stock) >= 0
  );
}

test("accepts a valid product", () => {
  assert.equal(isValidProduct({
    name: "Wireless Mouse", category: "Accessories", price: 799, stock: 24
  }), true);
});

test("rejects a product with an empty name", () => {
  assert.equal(isValidProduct({
    name: " ", category: "Accessories", price: 799, stock: 24
  }), false);
});

test("rejects a negative stock value", () => {
  assert.equal(isValidProduct({
    name: "Mouse", category: "Accessories", price: 799, stock: -1
  }), false);
});
