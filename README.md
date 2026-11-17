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
- Responsive dashboard shell with semantic sidebar navigation using CSS Grid, Flexbox, fluid breakpoints, CSS design tokens, subtle glassmorphism/backdrop blur, soft shadows, hover transitions, and light/dark theme variables
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

## Accessibility and architecture review

The 16 November 2026 Lighthouse captures showed Accessibility 100 on desktop and on mobile emulation (390 × 844). Keyboard checks were recorded for the product dialog, Edit/Delete focus, category filtering, sorting, and search. These results do not replace a full screen-reader or WCAG conformance review.

The source review documented five findings in `docs/accessibility-audit.md`. Two accessibility improvements were committed: stronger focus-indicator contrast and live announcements for the product result count. Verify both after the latest Render deployment. Authentication, API rate limiting, and pagination remain production-hardening recommendations.

See `docs/accessibility-audit.md`, `docs/submission-evidence.md`, and `docs/testing-guide.md` for test results and evidence filenames.

## Repository

https://github.com/bala20395-hue/smartstore-dashboard


## Demo security scope

This public learning demo does not include user authentication, role-based authorization, or API rate limiting. Do not use it to manage confidential or business-critical inventory without adding those protections.
