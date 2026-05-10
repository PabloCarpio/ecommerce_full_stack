<div align="center">

# DigiStore

### Enterprise-Grade Digital Products Marketplace

*A full-stack e-commerce platform for selling courses, templates, and digital assets — built with modern best practices and deployed at zero cost.*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

</div>

---

## Overview

DigiStore is a production-quality marketplace for digital products — think Hotmart meets Udemy. It features a multi-vendor architecture where sellers list courses/templates and buyers purchase with instant digital delivery. The codebase demonstrates senior-level engineering: clean architecture, security hardening, performance optimization, and CI/CD — all on zero-cost infrastructure.

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Vercel (CDN)                              │
│                    Next.js 15 — App Router                       │
│              PPR · Server Components · ShadcnUI                  │
└──────────────────────────────┬───────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼───────────────────────────────────┐
│                      Railway (Docker)                             │
│                     NestJS 10 REST API                            │
│          JWT Auth · Rate Limiting · Swagger Docs                 │
└──────┬───────────┬──────────────┬───────────────┬───────────────┘
       │           │              │               │
  ┌────▼────┐ ┌───▼────┐  ┌─────▼─────┐  ┌──────▼──────┐
  │ Supabase│ │ Upstash │  │ Cloudinary │  │   Resend     │
  │   PG 16 │ │  Redis  │  │  Images    │  │   Email      │
  └─────────┘ └─────────┘  └────────────┘  └──────────────┘
```

```
ecommerce/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/       # JWT + token blacklist (JTI rotation)
│   │   │   │   ├── products/   # CRUD + catalog caching (ICacheService)
│   │   │   │   ├── categories/ # Nested tree + 5-min cache
│   │   │   │   ├── cart/       # DB (auth) + cache (guest) + merge
│   │   │   │   ├── orders/     # Atomic $transaction + Access grants
│   │   │   │   ├── reviews/    # One-per-user + owner/ADMIN delete
│   │   │   │   ├── search/     # PostgreSQL tsvector + GIN index
│   │   │   │   └── analytics/  # Seller + Platform KPIs
│   │   │   └── common/
│   │   │       ├── cache/      # ICacheService (swap InMemory→Redis)
│   │   │       ├── filters/    # GlobalExceptionFilter (prod-safe)
│   │   │       ├── guards/     # JwtAuthGuard, RolesGuard, OptionalJwt
│   │   │       ├── pipes/      # SanitizePipe (XSS prevention)
│   │   │       └── security/   # TOKEN_BLACKLIST abstraction
│   │   └── Dockerfile          # Multi-stage for Railway
│   └── web/                    # Next.js 15 frontend
│       └── src/
│           ├── app/            # Pages with loading/error/not-found
│           ├── components/     # ShadcnUI + layout + product cards
│           ├── stores/         # Zustand (auth + cart)
│           └── lib/            # Axios client with JWT interceptor
├── packages/
│   ├── database/               # Prisma schema (11 models, 2 enums, 18 indexes)
│   ├── types/                  # Shared TypeScript + Zod schemas
│   └── config/                 # Shared tsconfig, eslint
├── .github/workflows/
│   ├── ci.yml                  # lint → typecheck → test → build
│   ├── deploy-web.yml          # Vercel deploy (path-filtered)
│   ├── deploy-api.yml          # Railway deploy (path-filtered)
│   └── db-migrate.yml          # Prisma migrate deploy
└── turbo.json                  # Turborepo pipeline
```

## Features

### Backend (NestJS)
- **Auth** — JWT with JTI-based token blacklist, refresh rotation, bcrypt (12 rounds)
- **Products** — Paginated CRUD with `ICacheService` abstraction (60s/120s TTL, Redis-ready)
- **Categories** — Nested tree endpoint, 5-minute cache
- **Cart** — Authenticated (DB) + guest (cache-manager) with merge-on-login
- **Orders** — Atomic `prisma.$transaction` creates Order + OrderItems + Access records
- **Reviews** — One per user per product, owner or ADMIN can delete
- **Search** — PostgreSQL `tsvector` + GIN index full-text search with relevance ranking
- **Analytics** — Seller revenue KPIs, Platform-wide metrics
- **Security** — Helmet CSP, SanitizePipe, rate limiting (ThrottlerGuard 60/min), OptionalJwtAuthGuard

### Frontend (Next.js 15)
- **Public** — Hero, product grid with filters, product detail, search results
- **Auth** — Login, Register Buyer, Register Seller
- **Buyer** — Dashboard, cart, orders, library, wishlist
- **Seller** — KPI dashboard, product CRUD, sales history, store settings
- **Admin** — Platform analytics, user/seller/product management, category tree editor
- **UX** — PPR with Suspense boundaries, skeleton loaders, error/not-found pages, SEO metadata

### Infrastructure
- **Zero-cost deployment** — Vercel (frontend), Railway (backend), Supabase (DB)
- **CI/CD** — GitHub Actions: lint → typecheck → test → build → deploy (path-filtered)
- **Docker** — Multi-stage Node 22 Alpine image with healthcheck
- **18 database indexes** — Including composite indexes for catalog, orders, and GIN for full-text search

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 (App Router) | SSR, PPR, Server Components |
| UI | Tailwind CSS + ShadcnUI | Dark-mode-first component library |
| State | Zustand + TanStack Query | Auth + cart state, server data cache |
| Backend | NestJS 10 | Modular REST API |
| Auth | JWT + bcrypt | Access (15m) + Refresh (7d) with JTI blacklist |
| Database | PostgreSQL 16 (Supabase) | Primary data store |
| ORM | Prisma 5 | Type-safe queries, migrations |
| Cache | InMemoryCacheService (→ Redis) | Swap to Upstash with one provider change |
| Search | PostgreSQL tsvector + GIN | Full-text search without ElasticSearch |
| CI/CD | GitHub Actions | 4 path-filtered workflows |
| Deploy | Vercel + Railway | Zero-cost hosting |

## Quick Start

### Prerequisites
- Node.js 22+, pnpm 9+
- Supabase account (free)
- Upstash, Cloudinary, Resend accounts (optional, for production features)

### 1. Clone & Install
```bash
git clone https://github.com/<username>/ecommerce-platform.git
cd ecommerce-platform
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Supabase connection strings and JWT secrets
```

### 3. Set Up Database
```bash
cd packages/database
pnpm exec prisma db push
pnpm exec prisma db seed
cd ../..
```

### 4. Start Development
```bash
pnpm dev
# API → http://localhost:4000 (Swagger at /api/docs)
# Web → http://localhost:3000
```

## API Documentation

Once the API is running, visit:
- **Swagger UI** → `http://localhost:4000/api/docs`
- **Auth**: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- **Products**: `GET /products`, `GET /products/:slug`, `POST /products` (ADMIN)
- **Categories**: `GET /categories`, `GET /categories/tree`
- **Cart**: `GET /cart`, `POST /cart/items`, `POST /cart/merge`
- **Orders**: `POST /orders`, `GET /orders`, `PATCH /orders/:id/status` (ADMIN)
- **Reviews**: `POST /products/:slug/reviews`, `GET /products/:slug/reviews`
- **Search**: `GET /search?q=...`
- **Analytics**: `GET /analytics/seller` (SELLER), `GET /analytics/platform` (ADMIN)

## Security

| Layer | Implementation |
|-------|---------------|
| CSP | Helmet with Tailwind/ShadcnUI-safe directives |
| Auth | JWT + JTI token blacklist, bcrypt 12 rounds |
| CSRF | Bearer tokens (browsers don't auto-attach) |
| XSS | SanitizePipe strips HTML, JS event handlers, `javascript:` URIs |
| Rate Limiting | ThrottlerGuard 60/min global, 5/min auth |
| Token Revocation | InMemoryTokenBlacklist → Redis (one provider swap) |
| Input Validation | `class-validator` + `whitelist: true, forbidNonWhitelisted` |
| Error Handling | GlobalExceptionFilter sanitizes 500s in production |

## Performance

| Optimization | Details |
|-------------|---------|
| PPR | `experimental.ppr: 'incremental'` — static shell, dynamic streaming |
| Caching | Products 60s/120s, Categories 300s, Search 30s |
| Database | 18 indexes including GIN for tsvector, composite `(is_published, created_at DESC)` |
| Images | AVIF/WebP, 30-day `minimumCacheTTL`, responsive `sizes` |
| Fonts | `next/font/google` with `display: swap`, preloaded |
| Bundle | `@next/bundle-analyzer` configured, run with `ANALYZE=true pnpm build` |
| Code Split | Client components isolated, Suspense boundaries on every async section |

## Project Structure Stats

- **141** TypeScript source files
- **11** Prisma models, **2** enums
- **18** database indexes (including GIN for full-text search)
- **7** NestJS modules
- **8** Next.js page routes with loading/error/not-found
- **4** GitHub Actions workflows

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.