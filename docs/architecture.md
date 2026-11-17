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


## Current demo limitations and production hardening

- Product CRUD routes are publicly reachable and currently have no authentication or authorization layer. Protect write operations before handling real inventory data.
- API request rate limiting is not configured. Add route-level and/or edge-level rate limiting before wider public use.
- The product-list query currently returns the full catalogue. Add bounded pagination when the catalogue grows.
- The two accessibility source fixes (theme-aware high-contrast focus indicators and a live result-count status) are committed on the main branch. Verify them on the deployed app and test the announcements with a screen reader.


## Semantic page and component structure

The dashboard shell uses these semantic regions:

- `header.topbar`: brand, primary page links, and theme control.
- `aside.sidebar`: secondary workspace navigation for the Dashboard overview and Products section.
- `nav.main-nav` and `nav.sidebar-nav`: separately labelled navigation landmarks.
- `main#main-content`: the primary page content, targeted by the skip link.
- `section#overview`: dashboard heading and summary region.
- `article.stat-card`: individual product, stock, and catalogue-value summaries.
- `section#products`: product management, filters, live status, and data table.
- `table`: captioned product inventory table with scoped column headings.
- `dialog#product-dialog`: accessible add/edit product form with labelled controls, fieldset/legend, inline error descriptions, and validation states.
- `footer.footer`: project footer.

The sidebar is a responsive section-navigation pattern: it links to the two main dashboard sections in the same document. It is not a separate multi-document page router. On narrow screens the sidebar links become a two-column navigation row.


## Responsive styling system

The CSS design system in `client/src/css/styles.css` includes:

- Theme variables for page/surface colors, text, brand, borders, focus, shadows, and translucent glass surfaces.
- Spacing, radius, typography, and transition tokens defined in `:root`.
- A responsive dashboard grid with a desktop sidebar, a compact tablet navigation row, and a mobile navigation layout.
- Breakpoint bands for 320px-class mobile, 768px tablet, 1024px compact desktop, and 1440px wide desktop layouts.
- Subtle `backdrop-filter` blur on the top bar, sidebar, summary cards, and main panel; soft shadows; hover lift; and color/border/shadow transitions.
- Light and dark theme variable sets, plus reduced-motion handling.

The 320/768/1024/1440 viewport and page-overflow observations recorded before the semantic sidebar was introduced must be repeated against the latest deployed layout.


## External public REST API flow

The dashboard includes a separate, read-only sample catalogue preview so that third-party demo data never overwrites the PostgreSQL inventory.

1. The user activates **Fetch public products** in the External product catalogue section.
2. `client/src/js/app.js` calls `api.getPublicProducts()`.
3. `client/src/js/api.js` performs an asynchronous GET request to DummyJSON: `https://dummyjson.com/products?limit=12&select=id,title,price,stock,category,thumbnail`.
4. The API client normalizes the response to the dashboard's sample-product shape (name, category, price, stock, thumbnail).
5. The browser renders the preview cards and category tabs. Search and sort update the preview DOM without a page reload.
6. Loading skeletons appear while the request is pending; a friendly status error is shown when the API cannot be reached.

The sample catalogue is read-only and does not create, edit, or delete the user's Neon/PostgreSQL product records. DummyJSON describes this endpoint as fictional/sample product data for testing and prototyping. Its simulated write examples do not persist changes on its service.
