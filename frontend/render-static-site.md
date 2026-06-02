# Render static site — copy these settings exactly

In your Render **Static Site** → **Settings**:

| Field | Value |
|-------|--------|
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

⚠️ Prefer **`dist`** (standard Vite output). If your Render publish directory is **`.dist`**, the build script copies `dist` → `.dist` automatically after `vite build`.

**Environment**

| Key | Example |
|-----|---------|
| `VITE_API_BASE_URL` | `https://your-backend-service.onrender.com` |

After saving, click **Manual Deploy** → **Clear build cache & deploy**.

### Redirects/Rewrites (required for routes like `/admin`)

In Render Static Site settings, add:

| Type | Source | Destination |
|------|--------|-------------|
| Rewrite | `/*` | `/index.html` |

---

## If Root Directory is empty (repo root)

| Field | Value |
|-------|--------|
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `frontend/dist` |

Requires the root `package.json` in this repo (with a `build` script).
