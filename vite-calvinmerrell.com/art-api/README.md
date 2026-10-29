# Lines of Light API

This is the Node/Express, MongoDB, and WebSocket backend for the `/art/` app. Deploy it as a Render Web Service with this directory as its root.

Required Render environment variables:

- `MONGODB_URI`: Atlas connection string for the application database user.
- `MONGODB_DATABASE`: optional; defaults to `startup`, matching the original app database.
- `CLIENT_ORIGINS`: comma-separated allowed origins, normally `https://calvinmerrell.com,http://localhost:5173`.
- `NODE_ENV`: set to `production` on Render.

Render supplies `PORT` automatically. Do not commit the MongoDB URI or add it to frontend build settings. The API uses the original `user` and `portfolio` collections. The API cookie is secure, HTTP-only, and scoped to the API host; use a custom domain such as `api.calvinmerrell.com` so the Pages app and API are same-site.
