# SmartStore Dashboard Architecture

## Purpose

SmartStore is a small product-management dashboard used to demonstrate frontend, backend, accessibility, and deployment fundamentals.

## System boundaries

- `client/`: browser UI, semantic HTML, CSS, user interactions, API client, and browser-side cache.
- `server/`: HTTP server, product REST endpoints, request validation, and demonstration data.
- `docs/`: architecture and audit evidence.
- `tests/`: automated tests.

## Request flow: product listing

```text
Browser page
  -> client/src/js/app.js
  -> client/src/js/api.js
  -> GET /api/products
  -> server/src/routes/products.js
  -> JSON product array
  -> render accessible product table
```

## Request flow: add or edit product

The browser validates required fields, sends JSON to the Express API, updates the in-memory server collection, then refreshes the visible table and LocalStorage cache.

## Local setup

1. Install Node.js 18+.
2. Open a terminal in `server/`.
3. Run `npm install`.
4. Run `npm run dev`.
5. Visit `http://localhost:3000`.

## Data limitations

The server uses in-memory demonstration data. It resets on server restart. LocalStorage stores a browser-side copy for cache/fallback display; it is not a shared or permanent database.

## Accessibility choices

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`).
- Skip link to main content.
- Form controls have visible labels.
- Status updates use `role="status"` and `aria-live`.
- Dialog uses native `<dialog>` and returns focus to the trigger after save/cancel.
- Keyboard focus indicators are visible.
- Table has a caption and column headers.
- Layout adapts to narrow screens.
