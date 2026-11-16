# SmartStore Dashboard

A responsive product-management dashboard built with HTML5, CSS3, vanilla JavaScript, Node.js, and Express. This is the RABTECH Full Stack Web Development capstone project.

## Features

- Dashboard summary cards and product inventory table
- REST API for listing, creating, editing, and deleting products
- Search, category filtering, and sorting
- LocalStorage browser cache and saved light/dark theme
- Loading, empty, and error states
- Semantic HTML landmarks, skip link, labelled form fields, table caption and headings
- Accessible product dialog with focus restoration and inline validation associations
- Responsive layouts using CSS Grid, Flexbox, design tokens, and media queries
- Server-side validation and automated validation tests
- Optional PostgreSQL persistence through a `DATABASE_URL` environment variable

> Without `DATABASE_URL`, the app deliberately runs with in-memory demonstration data. With a PostgreSQL connection configured, product records persist in the database across server restarts. LocalStorage is a browser-side cache, not shared database storage.

## Requirements

- Node.js 18+
- npm
- VS Code (recommended)
- A PostgreSQL database for persistent deployed storage (Neon Free is one option)

## Run locally

From the repository root:

```powershell
cd server
npm install
Copy-Item .env.example .env
```

For persistent local testing, edit `server/.env` and put your real PostgreSQL connection string in `DATABASE_URL`. Keep this file private; it is ignored by Git.

Then run:

```powershell
npm run dev
```

Open http://localhost:3000.

Run automated validation tests from `server/`:

```powershell
npm test
```

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/products` | List products |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

## Repository structure

```text
smartstore-dashboard/
├── client/
│   ├── index.html
│   └── src/
│       ├── css/styles.css
│       └── js/
│           ├── api.js
│           └── app.js
├── server/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── db.js
│       ├── server.js
│       └── routes/
│           ├── products.js
│           └── productValidation.js
├── docs/
│   ├── accessibility-audit.md
│   ├── architecture.md
│   ├── deployment.md
│   ├── submission-evidence.md
│   └── testing-guide.md
└── tests/validation.test.js
```

## Database setup for Render

1. Create a PostgreSQL project on Neon (or another PostgreSQL provider).
2. Copy the pooled connection string. It should include TLS configuration such as `sslmode=require`.
3. In Render, open the `smartstore-dashboard` web service → Environment.
4. Add an environment variable named `DATABASE_URL` and paste the connection string as its value.
5. Save changes and allow Render to redeploy.
6. Open `/health` and the dashboard, then create a test product and verify it remains after a page refresh.

Never commit a real `.env` file or database password. Keep credentials in Render's Environment settings.

## Deployment

Render settings:
- Build command: `cd server && npm install`
- Start command: `cd server && npm start`
- Health check path: `/health`
- Root directory: blank (repository root)

Live app: https://smartstore-dashboard-i1t1.onrender.com

## Accessibility evidence

The audit worksheet is not a completed Lighthouse audit. Run Lighthouse and a keyboard-only pass on the selected public website, save genuine screenshots, and enter only findings actually observed. See `docs/submission-evidence.md` and `docs/testing-guide.md`.

## Repository

https://github.com/bala20395-hue/smartstore-dashboard
