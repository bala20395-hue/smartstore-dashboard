import pg from "pg";

const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;

export const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000
    })
  : null;

const demoProducts = [
  ["p-1001", "Wireless Mouse", "Accessories", 799, 24],
  ["p-1002", "Mechanical Keyboard", "Electronics", 2499, 15],
  ["p-1003", "USB-C Hub", "Accessories", 1499, 12],
  ["p-1004", "Notebook Set", "Stationery", 299, 50],
  ["p-1005", "Desk Lamp", "Home", 1199, 8]
];

export async function initializeDatabase() {
  if (!pool) {
    console.log("DATABASE_URL is not set; using in-memory demo data.");
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name VARCHAR(80) NOT NULL,
      category VARCHAR(50) NOT NULL,
      price NUMERIC(12, 2) NOT NULL CHECK (price > 0),
      stock INTEGER NOT NULL CHECK (stock >= 0),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const countResult = await pool.query("SELECT COUNT(*)::int AS count FROM products");
  if (countResult.rows[0].count === 0) {
    for (const product of demoProducts) {
      await pool.query(
        "INSERT INTO products (id, name, category, price, stock) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING",
        product
      );
    }
  }
  console.log("PostgreSQL database is ready.");
}
