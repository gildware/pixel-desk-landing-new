# ---- Build Stage ----
FROM node:22-alpine AS builder
WORKDIR /app

ARG PUBLIC_API_URL
ARG PUBLIC_DASHBOARD_URL
ARG PUBLIC_LOGIN_URL=/login
ARG PUBLIC_SUPPORT_URL=/resources/knowledge-base
ARG PUBLIC_USE_API_PROXY=true

ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_DASHBOARD_URL=$PUBLIC_DASHBOARD_URL
ENV PUBLIC_LOGIN_URL=$PUBLIC_LOGIN_URL
ENV PUBLIC_SUPPORT_URL=$PUBLIC_SUPPORT_URL
ENV PUBLIC_USE_API_PROXY=$PUBLIC_USE_API_PROXY

# Astro bakes PUBLIC_* into the client bundle at build time.
RUN test -n "$PUBLIC_API_URL" && test -n "$PUBLIC_DASHBOARD_URL" || \
  (echo "ERROR: PUBLIC_API_URL and PUBLIC_DASHBOARD_URL must be passed as --build-arg" && exit 1)

COPY package*.json ./
RUN npm ci

COPY astro.config.mjs tsconfig.json ./
COPY public ./public
COPY src ./src

RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Bake upstream API into the same-origin /api/proxy location.
ARG PUBLIC_API_URL
RUN test -n "$PUBLIC_API_URL" && \
  sed -i "s|__API_URL__|${PUBLIC_API_URL%/}|g" /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
