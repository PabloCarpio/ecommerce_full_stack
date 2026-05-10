# Role: Senior Fullstack Engineer & Software Architect
# Project: Enterprise-Grade E-commerce (Zero-Cost Stack)

## Technology Stack
- Backend: Node.js (NestJS) + TypeScript.
- Frontend: Next.js 15 (App Router) + Tailwind CSS + ShadcnUI.
- Database: PostgreSQL (Supabase) + Prisma ORM.
- Cache/Queue: Redis (Upstash).
- Architecture: Domain-Driven Design (DDD) & Hexagonal Architecture.

## Core Principles (MANDATORY)
1. **Type Safety:** 100% TypeScript coverage. No 'any'. Use Zod for runtime validation.
2. **Clean Architecture:** 
   - Separation of concerns: Domain (Business Logic) != Infrastructure (DB/External APIs).
   - Use Data Transfer Objects (DTOs) for every request/response.
3. **Performance:** 
   - Optimize SQL queries (Avoid N+1).
   - Use Server Components in Next.js whenever possible.
   - Implement caching strategies with Redis for product catalogs.
4. **Security:** 
   - Strict JWT handling (HttpOnly cookies).
   - Rate limiting on sensitive endpoints (Auth, Payments).
   - Input sanitization to prevent XSS and SQL Injection.

## Efficiency & Token Saving
- **Brief Explanations:** Skip the fluff. Provide high-density technical code.
- **Incremental Progress:** Before writing code, suggest the file structure changes.
- **Dry Run:** If a logic is complex, explain the algorithm in 2 lines before coding.
- **Reusable Components:** Prioritize Atomic Design in the frontend.

## Rules for Code Generation
- Backend: Follow NestJS modularity (Module, Controller, Service).
- Frontend: Use 'use client' only when necessary.
- Testing: Every service must include a template for a Unit Test.
- Errors: Implement a Global Exception Filter for consistent API errors.

---

## Project Status — ALL PHASES COMPLETE

| Phase | Status | Key Deliverables |
|-------|--------|------------------|
| 0. Bootstrap | ✅ | Turborepo monorepo, pnpm workspaces |
| 1. Infrastructure | ✅ | Supabase DB live; Upstash/Cloudinary/Resend pending |
| 2. Database | ✅ | 11 models, 2 enums, 18 indexes, 51 products seeded |
| 3. Backend | ✅ | Auth, Products, Categories, Cart, Orders, Reviews, Search, Analytics |
| 4. Frontend | ✅ | All pages: public, auth, buyer, seller, admin |
| 5. Security | ✅ | CSP, token blacklist, SanitizePipe, rate limiting, OptionalJwtAuthGuard |
| 6. Performance | ✅ | PPR, ICacheService, GIN index, SEO metadata, bundle-analyzer |
| 7. CI/CD | ✅ | 4 workflows, Dockerfile, Vercel/Railway configs |
| 8. Portfolio | ✅ | README, CONTRIBUTING, CODE_OF_CONDUCT |

### Blocked (needs external credentials)
- Upstash Redis — swap `InMemoryCacheService` → `RedisCacheService`
- Cloudinary — add image upload to Products module
- Resend — add forgot-password/reset-password emails

### Key Architecture Decisions
- `ICacheService` / `TOKEN_BLACKLIST` — Symbol-based DI, swap InMemory → Redis with one provider change
- Bearer tokens (not cookies) — inherently CSRF-resistant
- `OptionalJwtAuthGuard` — public endpoints work for both auth'd and guest users
- Postgres GIN index for tsvector — full-text search without ElasticSearch
- Multi-stage Dockerfile with HEALTHCHECK — lean production image for Railway
- Path-filtered deploy workflows — only deploy changed services
- Baseline migrations resolved — `prisma migrate deploy` works from clean state