# Production deploy (pixel-desk-landing)

## Same-origin API proxy (recommended)

Set `PUBLIC_USE_API_PROXY=true` so browser requests go to `/api/proxy/...` on your app host. Nginx in the Docker image forwards those paths to `PUBLIC_API_URL`.

This avoids cross-origin session cookie issues between the landing site and API (same pattern as pixel-desk-web).

## Required build / runtime env

| Variable | Example | Purpose |
|----------|---------|---------|
| `PUBLIC_API_URL` | `https://api.pixeldesk.in` | Upstream API (proxy target + baked into client) |
| `PUBLIC_USE_API_PROXY` | `true` | Use `/api/proxy` in the login OTP flow |
| `PUBLIC_DASHBOARD_URL` | `https://dashboard.pixeldesk.in` | Redirect after successful OTP verify |
| `PUBLIC_LOGIN_URL` | `/login` | Login path (same-origin) |
| `PUBLIC_SUPPORT_URL` | `/resources/knowledge-base` | Support link on the login form |

**Important:** `PUBLIC_*` variables are embedded into the static build at **Docker build time**. Setting them only on the running container after deploy has **no effect** — pass `--build-arg` (or GitHub Actions secrets) and rebuild.

Set GitHub repo secrets `PUBLIC_API_URL` and `PUBLIC_DASHBOARD_URL` for `.github/workflows/deploy-prod.yml`.

## Docker build example

```bash
docker build --progress=plain \
  --build-arg PUBLIC_API_URL=https://api.pixeldesk.in \
  --build-arg PUBLIC_DASHBOARD_URL=https://dashboard.pixeldesk.in \
  --build-arg PUBLIC_USE_API_PROXY=true \
  -t pixel-desk-landing:latest .
```

Image serves on **port 80**.

## Backend cookie domain

If the API sets `Domain=api.pixeldesk.in` on session cookies, the browser will not send them to your landing host. Prefer **`Domain=.pixeldesk.in`** (leading dot) so cookies work across subdomains, or omit `Domain` when using the proxy (cookie scoped to landing host).

## HSTS

Enable `Strict-Transport-Security` at your TLS terminator (CDN / load balancer), not on plain HTTP nginx. `nginx.conf` already sets frame/CSP-related headers.
