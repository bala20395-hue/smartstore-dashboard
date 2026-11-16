# SmartStore Dashboard Architecture

## Purpose

SmartStore is a product-management dashboard demonstrating frontend, backend, accessibility, and deployment fundamentals.

## System boundaries

- `client/`: browser interface, semantic markup, CSS, interactions, API client, and LocalStorage cache.
- `server/`: Express HTTP server, REST routes, request validation, and demo records.
- `docs/`: audit, architecture, deployment, and evidence documentation.
- `tests/`: automated validation tests.

## Product listing flow

```text
Browser page
  -> client/src/js/app.js
  -> client/src/js/api.js
  -> GET /api/products
  -> server/src/routes/products.js
  -> JSON product array
  -> accessible product table
```

## Add / edit / delete flow

The browser validates fields and sends JSON to Express. The server validates the payload in `productValidation.js`, updates its in-memory collection, and returns JSON. The browser refreshes the table and LocalStorage cache.

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
| Validation + demo data   |
+--------------------------+
```

## Local setup

1. Install Node.js 18+.
2. Open a terminal in `server/`.
3. Run `npm install`.
4. Run `npm run dev`.
5. Visit `http://localhost:3000`.
6. Run automated tests with `npm test` from `server/`.

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

## Data limitations

The product collection is in memory and resets on restart/redeploy. LocalStorage is only a browser-specific cache. It is not durable database storage.
