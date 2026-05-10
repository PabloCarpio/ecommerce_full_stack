FROM node:22-alpine AS base
RUN apk add --no-cache python3 make g++
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/database/package.json packages/database/
COPY packages/types/package.json packages/types/
COPY packages/config/package.json packages/config/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=deps /app/packages/types/node_modules ./packages/types/node_modules
COPY --from=deps /app/packages/config ./packages/config
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/database packages/database
COPY packages/types packages/types
COPY packages/config packages/config
COPY apps/api apps/api

RUN pnpm --filter @ecommerce/config build \
    && pnpm --filter @ecommerce/types build \
    && pnpm --filter @ecommerce/database exec prisma generate \
    && pnpm --filter @ecommerce/database build \
    && pnpm --filter @ecommerce/api build

FROM node:22-alpine AS runner
ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nestjs -G nodejs

WORKDIR /app

COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/packages/database/dist ./packages/database/dist
COPY --from=build /app/packages/types/dist ./packages/types/dist
COPY --from=build /app/packages/config/dist ./packages/config/dist

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules
COPY --from=deps /app/packages/types/node_modules ./packages/types/node_modules

USER nestjs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/docs || exit 1

CMD ["node", "dist/main.js"]