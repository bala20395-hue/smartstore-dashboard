# Render Deployment Notes

- Repository: https://github.com/bala20395-hue/smartstore-dashboard
- Branch: `main`
- Runtime: Node
- Root directory: blank (repository root)
- Build command: `cd server && npm install`
- Start command: `cd server && npm start`
- Health check path: `/health`
- Port: provided by Render through `process.env.PORT`
- Live application: https://smartstore-dashboard-i1t1.onrender.com

The service uses in-memory demonstration data. Product changes reset on server restart/redeploy. Configure a durable database before claiming persistent shared storage.
