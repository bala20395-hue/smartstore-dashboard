# Render Deployment Notes

## Current service

- Repository: https://github.com/bala20395-hue/smartstore-dashboard
- Branch: `main`
- Runtime: Node
- Root directory: blank (repository root)
- Build command: `cd server && npm install`
- Start command: `cd server && npm start`
- Health check path: `/health`
- Port: provided by Render through `process.env.PORT`
- Live application: https://smartstore-dashboard-i1t1.onrender.com

## Persistent PostgreSQL setup

The app supports PostgreSQL when the `DATABASE_URL` environment variable is configured. Without it, the server uses in-memory demonstration data.

1. Create a PostgreSQL project with a provider such as Neon.
2. Copy its pooled connection string, including TLS mode (for example `sslmode=require`).
3. In Render, open the web service → **Environment**.
4. Add `DATABASE_URL` with the connection string as its secret value.
5. Save and allow the service to redeploy.
6. Check the deploy logs for `PostgreSQL database is ready.`
7. Create a product through the UI, refresh the page, and verify it remains.
8. Restart/redeploy the service and verify the record is still present.

Do not put the connection string in GitHub, source files, screenshots, or public documentation.

## Free-tier caveats

Free Render web services use an ephemeral filesystem, so a SQLite file on the web-service filesystem is not durable. Free Render Postgres expires after 30 days. A separate PostgreSQL provider can supply a persistent free database, subject to that provider's usage and inactivity limits. See the official Render and Neon free-tier documentation before using this for anything beyond a demo.

The app's database integration is implemented, but persistent production mode is not active until a valid `DATABASE_URL` is added in Render.
