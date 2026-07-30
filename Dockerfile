FROM oven/bun:1.2.17-slim AS base
WORKDIR /app

FROM base AS install
COPY package.json bun.lock ./
COPY apps/server/package.json apps/server/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/ai/package.json packages/ai/package.json
COPY packages/api/package.json packages/api/package.json
COPY packages/auth/package.json packages/auth/package.json
COPY packages/configuration/package.json packages/configuration/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/environment/package.json packages/environment/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN bun install --frozen-lockfile

FROM install AS build
COPY . .
RUN bunx turbo run build --filter=server...

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY --from=build /app/apps/server/package.json ./apps/server/package.json
WORKDIR /app/apps/server

EXPOSE 3000

CMD ["bun", "run", "dist/index.mjs"]
