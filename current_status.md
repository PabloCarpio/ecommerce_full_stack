# E-Commerce Platform — Current Status

> Last updated: Phase 7 (CI/CD & Deployment) — Complete

---

## Phase Completion Summary

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0 | ✅ Done | Monorepo, Turborepo, pnpm workspaces |
| Phase 1 | ✅ Done | Supabase DB live; Upstash/Cloudinary/Resend credentials pending |
| Phase 2 | ✅ Done | 11 models, 2 enums, migrations pushed, 51 products seeded |
| Phase 3 | ✅ Done | Auth, Products, Categories, Cart, Orders, Reviews, Search, Analytics |
| Phase 4 | ✅ Done | All frontend pages: public, auth, buyer, seller, admin dashboards |
| Phase 5 | ✅ Done | CSP, token blacklist, CSRF-safe Bearer auth, SanitizePipe, rate limiting |
| Phase 6 | ✅ Done | PPR, caching abstraction (ICacheService), Prisma indexes, SEO metadata |
| Phase 7 | ✅ Done | CI/CD workflows, Dockerfile, Vercel/Railway configs |
| Phase 8 | ❌ Not started | GitHub portfolio presentation |

---

## Phase 7 — Where We Are

All four GitHub Actions workflows are created and committed:

1. **`.github/workflows/ci.yml`** — lint → typecheck → test (with Postgres service container) → build. Runs on PRs and pushes to `main`. Uses `concurrency` groups to cancel in-flight runs.

2. **`.github/workflows/deploy-web.yml`** — Deploys Next.js to Vercel on push to `main` when `apps/web/`, `packages/`, or `pnpm-lock.yaml` changes. Uses Vercel CLI.

3. **`.github/workflows/deploy-api.yml`** — Deploys NestJS to Railway on push to `main` when `apps/api/`, `packages/`, or `pnpm-lock.yaml` changes. Uses Railway CLI.

4. **`.github/workflows/db-migrate.yml`** — Runs `prisma migrate deploy` on push to `main` when `packages/database/prisma/` changes.

Supporting files created:
- `apps/api/Dockerfile` — Multi-stage Node 22 Alpine build for Railway
- `apps/api/.dockerignore` — Keeps Docker build lean
- `apps/web/vercel.json` — Monorepo-aware Vercel build config
- `railway.json` — Railway deploy config with healthcheck
- `.env.example` — Updated with all deployment env vars

---

## Pending Terminal Commands

These must be run once before the first deployment to `main`:

### 1. Vercel (Frontend)
```bash
cd apps/web
npx vercel link
# Follow prompts: select project, link to existing or create new
# This creates .vercel/project.json with ORG_ID and PROJECT_ID
```
Then add these as GitHub Secrets:
- `VERCEL_TOKEN` — from https://vercel.com/account/tokens
- `VERCEL_ORG_ID` — from `.vercel/project.json`
- `VERCEL_PROJECT_ID` — from `.vercel/project.json`

### 2. Railway (Backend)
```bash
# Install CLI
npm i -g @railway/cli

# Login (opens browser)
railway login

# Initialize project (links repo to Railway)
railway init

# Get the SERVICE_ID
railway status
```
Then add these as GitHub Secrets:
- `RAILWAY_TOKEN` — from https://railway.app/account/tokens
- `RAILWAY_SERVICE_ID` — from `railway status` output

### 3. Prisma Migrations (already live)
The database is already synced via `prisma db push`. For production, `prisma migrate deploy` in the CI workflow will handle future schema changes.

---

## Environment Variables — Still Needed

### GitHub Secrets (Settings → Secrets → Actions)

| Secret | Status | How to Get |
|--------|--------|------------|
| `DATABASE_URL` | ✅ Have value | From Supabase dashboard (pooled, port 6543) |
| `DIRECT_URL` | ✅ Have value | From Supabase dashboard (direct, port 5432) |
| `VERCEL_TOKEN` | ❌ Need to create | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | ❌ Need from `vercel link` | Created by `npx vercel link` |
| `VERCEL_PROJECT_ID` | ❌ Need from `vercel link` | Created by `npx vercel link` |
| `RAILWAY_TOKEN` | ❌ Need to create | https://railway.app/account/tokens |
| `RAILWAY_SERVICE_ID` | ❌ Need from `railway init` | Created by `railway init` |
| `NEXT_PUBLIC_API_URL` | ❌ Set after deployment | e.g. `https://your-api.up.railway.app` |

### Railway Environment Variables (set in Railway Dashboard)

| Variable | Status |
|----------|--------|
| `DATABASE_URL` | ✅ Have |
| `DIRECT_URL` | ✅ Have |
| `JWT_ACCESS_SECRET` | ⚠️ Using dev placeholder — generate strong secret |
| `JWT_REFRESH_SECRET` | ⚠️ Using dev placeholder — generate strong secret |
| `JWT_ACCESS_EXPIRES_IN` | ✅ `15m` |
| `JWT_REFRESH_EXPIRES_IN` | ✅ `7d` |
| `FRONTEND_URL` | ❌ Set after Vercel deploy (e.g. `https://your-app.vercel.app`) |
| `PORT` | ✅ `4000` |
| `NODE_ENV` | ✅ `production` |
| `UPSTASH_REDIS_REST_URL` | ❌ Not yet — create at https://upstash.com |
| `UPSTASH_REDIS_REST_TOKEN` | ❌ Not yet — from Upstash dashboard |
| `CLOUDINARY_CLOUD_NAME` | ❌ Not yet — create at https://cloudinary.com |
| `CLOUDINARY_API_KEY` | ❌ Not yet — from Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | ❌ Not yet — from Cloudinary dashboard |
| `RESEND_API_KEY` | ❌ Not yet — create at https://resend.com |
| `RESEND_FROM_EMAIL` | ❌ Not yet — e.g. `noreply@yourdomain.com` |

### Vercel Environment Variables (set in Vercel Dashboard)

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-api.up.railway.app` (after Railway deploy) |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` (after Vercel deploy) |

---

## Next Task (Tomorrow Morning)

### Phase 8: GitHub Portfolio Presentation

1. **Write `README.md`** — Architecture diagram (Mermaid), tech stack badges, setup instructions (5 steps), feature list, screenshots
2. **Create `CONTRIBUTING.md`** and `CODE_OF_CONDUCT.md`
3. **Set up GitHub Projects board** — Kanban with phases as columns
4. **Add repository topics** — `nextjs`, `nestjs`, `ecommerce`, `typescript`, `postgresql`, `redis`, `ddd`
5. **Pin repository on GitHub profile**
6. **Create GitHub Release v1.0.0** — Changelog summarizing all phases

### Before starting Phase 8, complete the one-time setup:

```bash
# 1. Vercel link (run from apps/web)
cd apps/web && npx vercel link

# 2. Railway init (run from project root)
npm i -g @railway/cli
railway login
railway init

# 3. Create free-tier accounts still missing:
#    - Upstash: https://upstash.com → create Redis database
#    - Cloudinary: https://cloudinary.com → get API credentials
#    - Resend: https://resend.com → get API key

# 4. Generate production JWT secrets:
openssl rand -base64 64  # → JWT_ACCESS_SECRET
openssl rand -base64 64  # → JWT_REFRESH_SECRET

# 5. Push to GitHub and verify CI passes
git remote add origin https://github.com/<username>/ecommerce-platform.git
git push -u origin main
```

---

## Architecture Overview

```
ecommerce/
├── .github/workflows/
│   ├── ci.yml                 # lint → typecheck → test → build
│   ├── deploy-web.yml         # Vercel deploy on main push
│   ├── deploy-api.yml         # Railway deploy on main push
│   └── db-migrate.yml         # Prisma migrate on schema changes
├── apps/
│   ├── api/                   # NestJS backend (port 4000)
│   │   ├── Dockerfile          # Multi-stage Docker for Railway
│   │   ├── src/
│   │   │   ├── main.ts         # Helmet CSP, CORS, ValidationPipe, SanitizePipe
│   │   │   ├── app.module.ts   # ThrottlerGuard global, 60/min default
│   │   │   ├── common/
│   │   │   │   ├── cache/      # ICacheService + InMemoryCacheService
│   │   │   │   ├── filters/     # GlobalExceptionFilter (prod-safe)
│   │   │   │   ├── guards/      # JwtAuthGuard, RolesGuard, OptionalJwtAuthGuard
│   │   │   │   ├── decorators/  # @Roles(), @CurrentUser()
│   │   │   │   ├── interceptors/ # TransformInterceptor, LoggingInterceptor
│   │   │   │   ├── pipes/       # SanitizePipe (XSS prevention)
│   │   │   │   └── security/    # TOKEN_BLACKLIST, InMemoryTokenBlacklist
│   │   │   └── modules/
│   │   │       ├── auth/        # Register, Login, Refresh, Logout (token revocation)
│   │   │       ├── products/    # CRUD, cached (60s list, 120s detail)
│   │   │       ├── categories/  # CRUD, cached (300s)
│   │   │       ├── cart/        # DB auth + cache guest, merge on login
│   │   │       ├── orders/      # Atomic $transaction, ADMIN status updates
│   │   │       ├── reviews/     # One per user, owner or ADMIN delete
│   │   │       ├── search/      # tsvector + GIN index, cached (30s)
│   │   │       └── analytics/   # Seller + Platform KPIs
│   └── web/                    # Next.js 15 (App Router, PPR)
│       ├── vercel.json          # Monorepo-aware build config
│       ├── next.config.ts       # PPR incremental, AVIF/WebP, bundle-analyzer
│       └── src/
│           ├── app/             # All pages with loading.tsx, error.tsx, not-found.tsx
│           ├── components/      # UI (ShadcnUI), layout, products
│           ├── stores/          # Zustand (auth, cart — logout calls blacklist API)
│           └── lib/             # api.ts (axios with JWT interceptor)
├── packages/
│   ├── database/               # Prisma schema (11 models, 2 enums, 18 indexes)
│   │   └── prisma/
│   │       └── migrations/
│   │           ├── 20260509000000_init/
│   │           └── 20260510000000_performance_indexes/  # GIN + composites
│   ├── types/                  # Shared TypeScript + Zod
│   └── config/                 # Shared tsconfig, eslint
├── .env.example                # All env vars documented
├── turbo.json                  # Turborepo pipeline config
└── railway.json                # Railway deploy config
```

---

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| `ICacheService` interface + `InMemoryCacheService` | Swap to `RedisCacheService` when Upstash arrives — one provider change |
| `TOKEN_BLACKLIST` Symbol injection | Interface-only pattern; `InMemoryTokenBlacklist` swaps to `RedisTokenBlacklist` |
| `SanitizePipe` before `ValidationPipe` | Strip XSS vectors before validation |
| `OptionalJwtAuthGuard` | Cart/search work for both guests and auth'd users |
| Bearer tokens (not cookies) | CSRF-resistant — browsers don't auto-attach Authorization header |
| Postgres GIN index on `to_tsvector` | Full-text search uses index instead of sequential scan |
| Composite indexes `(is_published, created_at)` | Product listing queries avoid full table scan |
| PPR `incremental` mode | Static shell renders instantly, dynamic content streams in |
| Multi-stage Dockerfile | Final image is ~150MB vs ~1GB+ with dev dependencies |
| Path-filtered deploy workflows | Only deploy what changed — saves runner minutes |