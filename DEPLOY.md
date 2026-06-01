# Deploying on Render

You need **two services**: backend (API) + frontend (static site). Products will not show if only the frontend is deployed or if the API URL / database is wrong.

---

## 1. Backend (Web Service)

| Setting | Value |
|--------|--------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

**Environment variables:**

| Key | Value |
|-----|--------|
| `MONGODB_URI` | Your **MongoDB Atlas** connection string (same DB as local if you want the same products) |
| `JWT_SECRET` | Long random secret |
| `FRONTEND_URL` | Your live site URL, e.g. `https://women-centric.onrender.com` (no trailing slash) |

**Test after deploy:** open  
`https://YOUR-BACKEND.onrender.com/api/health`  

You should see:

```json
{ "ok": true, "mongo": "connected", "productCount": 12 }
```

- `productCount: 0` → API works but **database has no products** (use the same `MONGODB_URI` as local, or add products via `/admin`).
- Error / timeout → fix `MONGODB_URI` or check Render logs.

---

## 2. Frontend (Static Site)

| Setting | Value |
|--------|--------|
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` or `.dist` (if you use the copy script) |

**Environment variable (required before build):**

| Key | Value |
|-----|--------|
| `VITE_API_BASE_URL` | `https://YOUR-BACKEND.onrender.com` (no trailing slash) |

After changing `VITE_API_BASE_URL`, you **must redeploy** the frontend (Clear build cache & deploy).

**Check in browser:** on your live site, open DevTools → Console → type:

```js
window.__API_BASE_URL__
```

It must show your backend URL, **not** `http://localhost:5000`.

---

## Why products don’t show (checklist)

1. **Backend not deployed** — only the static site is live.
2. **`VITE_API_BASE_URL` missing or wrong** — frontend still points to localhost. Fix env on Render → redeploy frontend.
3. **`FRONTEND_URL` not set on backend** — browser blocks API (CORS). Set to your exact frontend URL → redeploy backend.
4. **Empty production database** — `productCount` is 0 on `/api/health`. Use the same Atlas cluster as local, or add products in admin on production.
5. **Old Git commit on Render** — push latest code and redeploy both services.

---

## Local vs production

| | Local | Render |
|---|--------|--------|
| Frontend | `frontend/.env` → `VITE_API_BASE_URL=http://localhost:5000` | Render env on **frontend** service |
| Backend | `backend/.env` → `MONGODB_URI`, `JWT_SECRET` | Render env on **backend** service |
| Products | Your local/Atlas data | Whatever `MONGODB_URI` points to |
