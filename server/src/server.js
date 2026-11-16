import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import productsRouter from "./routes/products.js";
import { initializeDatabase } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientPath = path.resolve(__dirname, "../../client");

app.use(express.json({ limit: "20kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", app: "SmartStore Dashboard" });
});

app.use("/api/products", productsRouter);
app.use(express.static(clientPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong on the server." });
});

async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`SmartStore is running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("SmartStore could not start:", error);
  process.exit(1);
});
