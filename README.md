# Pixeldesk Landing

High-performance marketing site for Pixeldesk, built with **Astro** and **Tailwind CSS**.

## Pages

- `/` — Home
- `/features` — Features
- `/pricing` — Pricing
- `/resources` — Resources hub
- `/resources/knowledge-base` — Knowledge Base

## Requirements

- Node.js **≥ 22.12**

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # preview production build
```

## Deploy

Production deploys as a Docker image (nginx + static `dist/`) on push to `main`. See [DEPLOY.md](./DEPLOY.md).

## Performance defaults

- Static HTML output (`output: 'static'`)
- Compressed HTML
- Minimal client JS (mobile nav + pricing toggle only)
- FAQ uses native `<details>` (no JS)
- Local Outfit variable font + committed image assets
