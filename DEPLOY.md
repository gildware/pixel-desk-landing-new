# Production deploy (pixel-desk-landing)

## Auth / API mode (important)

Dashboard (`dashboard.pixeldesk.in`) talks **directly** to `apis.pixeldesk.in`.
Login must set session cookies on that same API host, or the dashboard will bounce back to login after OTP.

For production, set:

```bash
PUBLIC_USE_API_PROXY=false
PUBLIC_API_URL=https://apis.pixeldesk.in
```

The browser then calls the API cross-origin with `credentials: 'include'`. Backend must have:

- `CROSS_SITE_AUTH=true`
- `LANDING_PAGE_URL=https://pixeldesk.in` (CORS)
- `FRONTEND_URL=https://dashboard.pixeldesk.in` (CORS)
- Prefer `COOKIE_DOMAIN=.pixeldesk.in` (optional if cookies are host-scoped to `apis.pixeldesk.in`)

### Local / same-origin proxy

`PUBLIC_USE_API_PROXY=true` is fine for local Astro/nginx proxy development. Do **not** use it in production when the dashboard is on another subdomain — cookies would be scoped to `pixeldesk.in` and never sent to `apis.pixeldesk.in`.

## Required build / runtime env

| Variable | Example | Purpose |
|----------|---------|---------|
| `PUBLIC_API_URL` | `https://apis.pixeldesk.in` | API base (direct) or proxy upstream |
| `PUBLIC_USE_API_PROXY` | `false` (prod) / `true` (local) | Same-origin `/api/proxy` vs direct API |
| `PUBLIC_DASHBOARD_URL` | `https://dashboard.pixeldesk.in` | Redirect after successful OTP verify |
| `PUBLIC_SITE_URL` | `https://www.pixeldesk.in` | Canonical origin for SEO, sitemap, OG tags |
| `PUBLIC_ALT_SITE_URL` | `https://www.thepixeldesk.com` | Alternate domain (301 to canonical via nginx) |
| `PUBLIC_ORG_SAME_AS` | `https://linkedin.com/company/...` | Comma-separated social profile URLs for Organization schema |
| `PUBLIC_LOGIN_URL` | `/login` | Login path (same-origin) |
| `PUBLIC_SUPPORT_URL` | `/resources/knowledge-base` | Support link on the login form |

**Important:** `PUBLIC_*` variables are embedded into the static build at **Docker build time**. Setting them only on the running container after deploy has **no effect** — pass `--build-arg` (or GitHub Actions secrets) and rebuild.

Set GitHub repo secrets `PUBLIC_API_URL` and `PUBLIC_DASHBOARD_URL` for `.github/workflows/deploy-prod.yml`.

## Docker build example (production)

```bash
docker build --progress=plain \
  --build-arg PUBLIC_API_URL=https://apis.pixeldesk.in \
  --build-arg PUBLIC_DASHBOARD_URL=https://dashboard.pixeldesk.in \
  --build-arg PUBLIC_USE_API_PROXY=false \
  -t pixel-desk-landing:latest .
```

Image serves on **port 80**.

## HSTS

Enable HSTS at your TLS terminator when serving HTTPS.

## Dual domain (pixeldesk.in + thepixeldesk.com)

The SEO doc lists both `https://www.pixeldesk.in` and `https://www.thepixeldesk.com`. Production should:

1. Point both domains at the same nginx container (or TLS load balancer).
2. Rely on `nginx.conf` to **301 redirect** `thepixeldesk.com` → `www.pixeldesk.in`.
3. Set `PUBLIC_SITE_URL=https://www.pixeldesk.in` at Docker build time so canonical URLs, sitemap, and OG tags use `.in` only.

After deploy, submit `https://www.pixeldesk.in/sitemap-index.xml` in Google Search Console and Bing Webmaster Tools (property: `www.pixeldesk.in`).
