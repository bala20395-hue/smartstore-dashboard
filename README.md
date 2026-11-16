# SmartStore Dashboard

A responsive, accessible product-management dashboard built with HTML5, CSS3, vanilla JavaScript, Node.js, and Express.

This project is designed as one evolving capstone for the RABTECH Full Stack Web Development tasks.

## Features

- Dashboard summary cards
- Product listing from a REST API
- Create, edit, and delete products
- Search by product name
- Filter by category
- Sort by product name, price, or stock
- Client-side LocalStorage cache
- Loading, empty, and error states
- Accessible labels, semantic landmarks, keyboard-friendly dialog, and visible focus
- Responsive desktop, tablet, and mobile layout
- Light/dark theme toggle
- Simple server-side validation

> The included product records are demonstration data. The server currently stores changes in memory, so restarting the server resets the demo data. LocalStorage keeps a browser-side cache, not a permanent database.

## Requirements

- Node.js 18 or newer
- npm
- VS Code (recommended)

## Run locally

1. Extract the ZIP.
2. Open the extracted `smartstore-dashboard-complete` folder in VS Code.
3. Open the VS Code terminal.
4. Run:

```bash
cd server
npm install
npm run dev
```

5. Open `http://localhost:3000` in your browser.

Do not open `client/index.html` directly for this full version. Open the app through the Express server so the API and frontend use the same origin.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/products` | List products |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

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
│       └── routes/products.js
├── docs/
│   ├── accessibility-audit.md
│   └── architecture.md
├── tests/
│   └── validation.test.js
├── .gitignore
└── README.md
```

## Accessibility audit evidence

See `docs/accessibility-audit.md`. Run Lighthouse and keyboard testing against the actual public website you choose. Record only findings you verify and attach genuine screenshots. Do not present the starter worksheet as a completed audit.

## GitHub

Create a public repository named `smartstore-dashboard`, then run these commands from the project root:

```bash
git init
git add .
git commit -m "Build SmartStore dashboard"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
