# 🛒 Enterprise E-Commerce Platform  about digital products like hotmart &udemy— Master Implementation Plan

> **Stack:** Next.js 15 · NestJS · PostgreSQL (Supabase) · Prisma · Redis (Upstash) · Tailwind CSS · ShadcnUI  
> **Goal:** Zero-cost deployment · GitHub-ready · Senior-level showcase

---

## 📐 Architecture Overview

```
ecommerce/
├── apps/
│   ├── web/          # Next.js 15 (App Router) — Frontend
│   └── api/          # NestJS — Backend REST/GraphQL API
├── packages/
│   ├── database/     # Prisma schema + migrations
│   ├── types/        # Shared TypeScript interfaces & Zod schemas
│   └── config/       # Shared ESLint, TSConfig, etc.
├── .github/
│   └── workflows/    # CI/CD pipelines
└── turbo.json        # Turborepo monorepo config
```

**Design Pattern:** Domain-Driven Design (DDD) + Hexagonal Architecture  
**Deployment:** Vercel (frontend) · Railway or Render (backend) · Supabase (DB) · Upstash (Redis) — **all free tiers**

---

## ✅ PHASE 0 — Project Bootstrap & Tooling

- [ ] **0.1** Create GitHub repository (`ecommerce-platform`) with MIT license, `.gitignore`, `README.md`
- [ ] **0.2** Initialize **Turborepo** monorepo
  ```bash
  npx create-turbo@latest . --package-manager pnpm
  ```
- [ ] **0.3** Configure `pnpm` workspaces (`pnpm-workspace.yaml`)
- [ ] **0.4** Add shared `packages/types` with Zod + TypeScript
- [ ] **0.5** Add shared `packages/config` (ESLint flat config, Prettier, tsconfig base)
- [ ] **0.6** Set up **Husky** + **lint-staged** + **commitlint** (conventional commits)
- [ ] **0.7** Add **GitHub Actions** workflow skeleton (lint → test → build)

> **Outcome:** Clean monorepo skeleton pushed to GitHub with CI green.

---

## ✅ PHASE 1 — Infrastructure & External Services

- [ ] **1.1 Supabase** — Create project, copy `DATABASE_URL` (PostgreSQL connection string)
- [ ] **1.2 Upstash** — Create Redis database, copy `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
- [ ] **1.3 Cloudinary** (free tier) — Image CDN for product photos
- [ ] **1.4 Resend** (free tier, 3k emails/mo) — Transactional emails (order confirmations, password reset)
- [ ] **1.5** Create `.env.example` with all required env vars (never commit real secrets)
- [ ] **1.6** Add `packages/database` — initialize Prisma, point to Supabase

> **Outcome:** All zero-cost services wired up, secrets documented.

---

## ✅ PHASE 2 — Database Schema (Prisma)

Design and migrate the full schema supporting a multi-vendor marketplace. Key models:

| Model | Key Fields |
|---|---|
| `User` | id, email, passwordHash, role (ADMIN/SELLER/BUYER), createdAt |
| `Session` | id, userId, token, expiresAt |
| `Store` | id, sellerId, name, description, logoUrl |
| `Product` | id, slug, name, description, price, sellerId, categoryId, fileUrl (digital), images[] |
| `Category` | id, slug, name, parentId (self-relation for subcategories) |
| `Cart` | id, userId, items[] |
| `CartItem` | id, cartId, productId, quantity |
| `Order` | id, userId, status, total, paymentIntentId |
| `OrderItem` | id, orderId, productId, quantity, unitPrice, sellerId |
| `Review` | id, userId, productId, rating, body |
| `Access` | id, userId, productId (For granting buyers access to digital products) |

- [ ] **2.1** Write full `schema.prisma`
- [ ] **2.2** Run `prisma migrate dev --name init`
- [ ] **2.3** Write `seed.ts` with realistic product/category data (50+ products, 8+ categories)
- [ ] **2.4** Add Prisma Client singleton in `packages/database/src/client.ts`

> **Outcome:** Database live on Supabase, seed data loaded.

---

## ✅ PHASE 3 — NestJS Backend (`apps/api`)

### 3.1 — Core Setup
- [ ] Bootstrap NestJS app with `@nestjs/cli`
- [ ] Configure **Global Exception Filter** (uniform error shape: `{ statusCode, message, error, timestamp }`)
- [ ] Configure **ValidationPipe** globally (Zod or `class-validator`)
- [ ] Configure **Helmet** (security headers), **CORS**, **Compression**
- [ ] Set up **Swagger/OpenAPI** auto-doc at `/api/docs`

### 3.2 — Auth Module (JWT + HttpOnly Cookies)
- [ ] `POST /auth/register` — Zod-validated, bcrypt hash, return access + refresh tokens
- [ ] `POST /auth/login` — Credential check, issue tokens via HttpOnly cookies
- [ ] `POST /auth/refresh` — Rotate refresh token
- [ ] `POST /auth/logout` — Clear cookies, invalidate token in Redis
- [ ] `POST /auth/forgot-password` — Generate reset token, send email via Resend
- [ ] `POST /auth/reset-password` — Validate token, update hash
- [ ] **Guards:** `JwtAuthGuard`, `RolesGuard` (`@Roles('ADMIN')`)
- [ ] **Rate Limiting:** `@nestjs/throttler` on all auth endpoints (5 req/min)

### 3.3 — Products Module (Multi-Vendor)
- [ ] `GET /products` — Paginated, filterable (category, price range, rating), sortable
- [ ] `GET /products/:slug` — Single product with reviews
- [ ] `POST /products` (SELLER) — Create digital product with Cloudinary (images) and secure file URL
- [ ] `PATCH /products/:id` (SELLER) — Update own product
- [ ] `DELETE /products/:id` (SELLER/ADMIN) — Soft delete
- [ ] **Redis Cache:** Cache `GET /products` list (TTL 60s), invalidate on mutation

### 3.3b — Revenue & Analytics Module
- [ ] `GET /analytics/seller` (SELLER) — Revenue, total sales, and conversion rate for a specific seller
- [ ] `GET /analytics/platform` (ADMIN) — Global platform revenue, active sellers, and total transactions

### 3.4 — Categories Module
- [ ] Full CRUD (ADMIN-protected mutations)
- [ ] Nested category tree endpoint

### 3.5 — Cart Module
- [ ] `GET /cart` — Fetch user's active cart
- [ ] `POST /cart/items` — Add item (validate stock)
- [ ] `PATCH /cart/items/:id` — Update quantity
- [ ] `DELETE /cart/items/:id` — Remove item
- [ ] Cart stored in **Redis** for guests, persisted to DB on login

### 3.6 — Orders Module
- [ ] `POST /orders` — Create order from cart (atomic transaction)
- [ ] `GET /orders` — User's order history
- [ ] `GET /orders/:id` — Order detail
- [ ] `PATCH /orders/:id/status` (ADMIN) — Update order status

### 3.7 — Reviews Module
- [ ] `POST /products/:id/reviews` — Authenticated users only, one per product
- [ ] `GET /products/:id/reviews` — Paginated
- [ ] `DELETE /reviews/:id` (ADMIN or owner)

### 3.8 — Search Module
- [ ] Full-text search using **PostgreSQL `tsvector`** (no extra cost)
- [ ] `GET /search?q=...` endpoint

### 3.9 — Unit Tests
- [ ] Jest unit test templates for: `AuthService`, `ProductsService`, `CartService`, `OrdersService`

> **Outcome:** Full REST API documented on Swagger, secured, tested.

---

## ✅ PHASE 4 — Next.js Frontend (`apps/web`)

### 4.1 — Design System Setup
- [ ] Install **ShadcnUI** components + customize theme tokens
- [ ] **Design Aesthetic:** High-conversion digital product marketplace style (similar to Hotmart, Udemy, or AliExpress). Use rich visual hierarchy, strong call-to-actions, and clear product cards.
- [ ] Define color palette (dark mode first), typography scale (`Inter` font)
- [ ] Global layout: `RootLayout` with `ThemeProvider`, `Toaster`, `QueryClientProvider`
- [ ] Responsive **Navbar** (search bar, cart icon, user menu with Buyer/Seller toggle)

### 4.2 — Public Pages (Server Components)
- [ ] `/` — Hero banner, featured digital products/courses, top sellers
- [ ] `/products` — Product grid with robust sidebar filters (category, rating, price)
- [ ] `/products/[slug]` — Product sales page: video trailer/image gallery, robust description, creator info, reviews, sticky "Buy Now" CTA
- [ ] `/creators/[slug]` — Public profile for sellers showcasing their product catalog

### 4.3 — Auth Pages (Client Components)
- [ ] `/auth/login` — Tabbed login (Buyer / Seller) or role-detected email input
- [ ] `/auth/register/buyer` — Quick checkout-friendly registration
- [ ] `/auth/register/seller` — Comprehensive onboarding (store name, payout info)

### 4.4 — Protected Pages (Buyer Mode)
- [ ] `/cart` & `/checkout` — Streamlined digital product checkout
- [ ] `/buyer/dashboard` — Access purchased digital products/courses
- [ ] `/buyer/orders` — Order history and invoices
- [ ] `/buyer/wishlist` — Saved products

### 4.5 — Seller Dashboard (`/seller`)
- [ ] Protected by `SELLER` role check
- [ ] `/seller` — KPI cards (seller revenue, sales volume, conversion rate)
- [ ] `/seller/products` — Create/manage digital products, upload files/videos
- [ ] `/seller/sales` — Detailed transaction history for their products
- [ ] `/seller/settings` — Storefront customization and payout settings

### 4.6 — Admin Dashboard (`/admin`)
- [ ] Protected by `ADMIN` role check
- [ ] `/admin` — Global KPI cards (total platform revenue, platform commission collected, active sellers)
- [ ] `/admin/sellers` — Approve/suspend seller accounts
- [ ] `/admin/products` — Global moderation of all products
- [ ] `/admin/users` — Manage all users (buyers, sellers, admins)
- [ ] `/admin/categories` — Category tree editor

### 4.6 — Key Frontend Patterns
- [ ] **TanStack Query** for all client-side data fetching (caching, optimistic updates)
- [ ] **Zustand** for client state (cart, auth session)
- [ ] `next/image` for all product images (Cloudinary integration)
- [ ] **Skeleton loaders** on every async component
- [ ] **Error Boundaries** + `error.tsx` / `not-found.tsx` pages
- [ ] **SEO:** `generateMetadata()` on every page, Open Graph tags, `sitemap.ts`, `robots.ts`

---

## ✅ PHASE 5 — Security Hardening

- [ ] **5.1** `Content-Security-Policy` header via `next.config.ts`
- [ ] **5.2** CSRF protection on state-mutating endpoints
- [ ] **5.3** Input sanitization (`DOMPurify` client-side, strip HTML server-side)
- [ ] **5.4** Refresh token rotation with Redis blacklist
- [ ] **5.5** Rate limiting on API via Upstash Ratelimit SDK
- [ ] **5.6** Supabase Row-Level Security (RLS) policies as a second DB layer
- [ ] **5.7** Dependency audit: `pnpm audit --fix`
- [ ] **5.8** `SECURITY.md` file in repo (responsible disclosure policy)

---

## ✅ PHASE 6 — Performance Optimization

- [ ] **6.1** Next.js **Partial Prerendering (PPR)** for product pages (static shell + dynamic content)
- [ ] **6.2** Redis cache for product catalog (TTL strategy)
- [ ] **6.3** Prisma query optimization — check `explain analyze` on slow queries, add indexes
- [ ] **6.4** Image optimization via Cloudinary transformations + `next/image`
- [ ] **6.5** Bundle analysis: `@next/bundle-analyzer`
- [ ] **6.6** Lighthouse audit target: Performance ≥ 90, SEO = 100, Accessibility ≥ 95

---

## ✅ PHASE 7 — CI/CD & Deployment (Zero Cost)

### Services
| Service | Purpose | Free Tier |
|---|---|---|
| **Vercel** | Next.js frontend | Hobby (unlimited) |
| **Railway** or **Render** | NestJS API | 500hr/mo or 750hr/mo |
| **Supabase** | PostgreSQL | 500MB DB |
| **Upstash** | Redis | 10k commands/day |
| **Cloudinary** | Images | 25GB storage |
| **Resend** | Email | 3k emails/mo |

### CI/CD Pipeline (GitHub Actions)
- [ ] **7.1** `ci.yml` — On PR: lint → type-check → unit tests → build
- [ ] **7.2** `deploy-web.yml` — On push to `main`: deploy frontend to Vercel
- [ ] **7.3** `deploy-api.yml` — On push to `main`: deploy API to Railway/Render
- [ ] **7.4** `db-migrate.yml` — Run `prisma migrate deploy` on release
- [ ] **7.5** Set all secrets in GitHub repo Settings → Secrets

---

## ✅ PHASE 8 — GitHub Portfolio Presentation

- [ ] **8.1** Write a world-class `README.md`:
  - Animated GIF/video demo at the top
  - Architecture diagram (Mermaid or image)
  - Tech stack badges
  - Local setup instructions (5 steps or fewer)
  - Live demo link
  - Feature list with screenshots
- [ ] **8.2** Add `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`
- [ ] **8.3** Set up **GitHub Projects** board (kanban with your phases as columns)
- [ ] **8.4** Add descriptive **topics/tags** to repo: `nextjs`, `nestjs`, `ecommerce`, `typescript`, `postgresql`, `redis`, `ddd`
- [ ] **8.5** Pin the repository on your GitHub profile
- [ ] **8.6** Add a **GitHub Release** (v1.0.0) with a changelog when MVP is complete

---

## 🗺️ Recommended Build Order

```
Phase 0 (Bootstrap) → Phase 1 (Infra) → Phase 2 (DB Schema)
→ Phase 3.1–3.2 (NestJS Core + Auth) → Phase 4.3 (Auth Pages)
→ Phase 3.3–3.4 (Products + Categories) → Phase 4.1–4.2 (Design + Public Pages)
→ Phase 3.5–3.6 (Cart + Orders) → Phase 4.4 (Protected Pages)
→ Phase 3.7–3.9 (Reviews + Search + Tests) → Phase 4.5–4.6 (Admin + Patterns)
→ Phase 5 (Security) → Phase 6 (Performance) → Phase 7 (CI/CD)
→ Phase 8 (GitHub Presentation)
```

---

## ⚡ What Makes This Senior-Level

| Capability | Implementation |
|---|---|
| **Monorepo** | Turborepo + pnpm workspaces |
| **Type Safety** | 100% TypeScript + Zod end-to-end |
| **DDD / Hexagonal Arch** | Domain separated from infra in NestJS |
| **Caching Strategy** | Redis TTL + cache invalidation patterns |
| **Security Depth** | JWT rotation, RLS, CSP, rate limiting |
| **Performance** | PPR, bundle splitting, image CDN |
| **Observability** | Structured logging (Pino), error tracking |
| **DevEx** | Conventional commits, lint-staged, Swagger |
| **Testing** | Unit test templates for all services |
| **SEO** | Dynamic metadata, sitemap, robots.txt |

---

> **Total estimated time:** 4–6 weeks building solo at a steady pace.  
> Start with Phase 0 and say the word — I'll generate every file. 🚀
