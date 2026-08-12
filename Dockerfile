# ---------------------------------------------------------
# Echo API — Hono + tRPC on Bun (Turborepo monorepo)
# Works on: Railway, Render, Koyeb, Fly.io, Coolify/VPS.
# ---------------------------------------------------------

FROM oven/bun:1.2.17 AS base
WORKDIR /app

# ---- Prune the monorepo down to `server` + its workspace deps ----
FROM base AS pruner
COPY . .
RUN bunx turbo@2 prune server --docker

# ---- Install deps and build the bundle (dist/index.mjs) ----
FROM base AS builder
# t3-env validates at import time; skip during build (no secrets in image)
ENV SKIP_ENV_VALIDATION=true
COPY --from=pruner /app/out/json/ .
RUN bun install --ignore-scripts
COPY --from=pruner /app/out/full/ .
RUN bunx turbo build --filter=server

# ---- Runtime image ----
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app /app
WORKDIR /app/apps/server

# Platform injects $PORT (Railway/Render/Koyeb) — src/index.ts reads it.
EXPOSE 3000
CMD ["bun", "run", "start"]
