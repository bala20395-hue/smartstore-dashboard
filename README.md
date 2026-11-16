# SmartStore Dashboard

A responsive product-management dashboard built with HTML5, CSS3, vanilla JavaScript, Node.js, and Express. This is the RABTECH Full Stack Web Development capstone project.

## Features

- Dashboard summary cards and inventory table
- REST API for listing, creating, editing, and deleting products
- Search, category filtering, and sorting
- LocalStorage browser cache and saved light/dark theme
- Loading, empty, and error states
- Semantic HTML landmarks, skip link, labelled form fields, table caption and headings
- Accessible product dialog with focus restoration and inline validation associations
- Responsive layouts using CSS Grid, Flexbox, design tokens, and media queries
- Server-side validation and automated validation tests

> Demo-data limitation: the Express server currently stores product records in memory. Data resets when the server restarts or redeploys. LocalStorage is a browser-side cache, not durable shared storage. Add a database if persistent shared data is required by the assessment.

## Requirements

- Node.js 18+
- npm
- VS Code (recommended)

## Run locally

From the repository root:

```bash
cd server
npm install
npm run dev
```

Open http://localhost:3000.

Run automated validation tests from `server/`:

```bash
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
│   ├── package.json
│   └── src/
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

## Deployment

The Render service uses:
- Build command: `cd server && npm install`
- Start command: `cd server && npm start`
- Health check: `/health`
- Root directory: blank (repository root)

Live app: https://smartstore-dashboard-i1t1.onrender.com

## Accessibility evidence

The audit worksheet is not a completed Lighthouse audit. Run Lighthouse and a keyboard-only pass on the selected public website, save genuine screenshots, and enter only findings actually observed. See `docs/submission-evidence.md` and `docs/testing-guide.md`.

## Repository

https://github.com/bala20395-hue/smartstore-dashboard
