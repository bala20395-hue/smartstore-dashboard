export function validateProduct(body) {
  const source = body && typeof body === "object" ? body : {};
  const name = typeof source.name === "string" ? source.name.trim() : "";
  const category = typeof source.category === "string" ? source.category.trim() : "";
  const price = Number(source.price);
  const stock = Number(source.stock);

  if (!name || name.length > 80) return "Name is required and must be 80 characters or fewer.";
  if (!category || category.length > 50) return "Category is required and must be 50 characters or fewer.";
  if (!Number.isFinite(price) || price <= 0) return "Price must be a number greater than zero.";
  if (!Number.isInteger(stock) || stock < 0) return "Stock must be a whole number of zero or more.";
  return { name, category, price, stock };
}
