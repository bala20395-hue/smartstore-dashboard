# SmartStore Dashboard Architecture

## Purpose

SmartStore is a product-management dashboard demonstrating frontend, backend, accessibility, and deployment fundamentals.

## System boundaries

- `client/`: browser interface, semantic markup, CSS, interactions, API client, and LocalStorage cache.
- `server/`: Express HTTP server, REST routes, request validation, and persistence adapter.
- `docs/`: audit, architecture, deployment, and evidence documentation.
- `tests/`: automated product-validation tests.

## Product listing flow

```text
Browser page
  -> client/src/js/app.js
  -> client/src/js/api.js
  -> GET /api/products
  -> server/src/routes/products.js
  -> PostgreSQL (when DATABASE_URL is configured)
     OR in-memory demo data (fallback mode)
  -> JSON product array
  -> accessible product table
```

## Add / edit / delete flow

The browser validates required fields and sends JSON to Express. The server validates the payload in `productValidation.js`; if PostgreSQL is configured, parameterized SQL statements persist the records in the `products` table. Otherwise, the in-memory demo collection is used. The browser refreshes the table and LocalStorage cache.

## System diagram

```text
+--------------------------+
| Browser: HTML / CSS / JS |
+------------+-------------+
             |
             v
+--------------------------+
| API client: fetch + JSON |
+------------+-------------+
             |
             v
+--------------------------+
| Express REST endpoints   |
+------------+-------------+
             |
             v
+--------------------------+
| Validation layer         |
+------------+-------------+
             |
             v
+--------------------------+
| PostgreSQL / demo memory |
+--------------------------+
```

## Local setup

1. Install Node.js 18+.
2. Open a terminal in `server/`.
3. Run `npm install`.
4. Optionally configure `DATABASE_URL` in a private `.env` file using `.env.example`.
5. Run `npm run dev`.
6. Visit `http://localhost:3000`.
7. Run automated tests with `npm test` from `server/`.

## Accessibility implementation

- Semantic landmarks: `header`, `nav`, `main`, `section`, and `footer`.
- Skip link to main content.
- Visible focus indicators.
- Labelled controls and inline error descriptions.
- `aria-invalid` updated for invalid form fields.
- Status messages use `role="status"` and `aria-live`.
- Native dialog restores focus to its invoking control.
- Product table has a caption and column headers.
- Responsive layout.

## Data modes

- PostgreSQL mode: enabled when `DATABASE_URL` is present; product records persist across server restarts.
- Demo mode: used when `DATABASE_URL` is absent; data is held in memory and resets on server restart.
- LocalStorage: browser-only cache and theme preference; not a shared database.
