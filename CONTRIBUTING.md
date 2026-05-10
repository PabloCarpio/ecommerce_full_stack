# Contributing to DigiStore

Thank you for your interest in contributing! This document provides guidelines and instructions.

## Development Setup

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/ecommerce-platform.git
cd ecommerce-platform

# 2. Install dependencies
pnpm install

# 3. Set up environment
cp .env.example .env
# Fill in your Supabase connection strings and JWT secrets

# 4. Initialize database
cd packages/database
pnpm exec prisma db push
pnpm exec prisma db seed
cd ../..

# 5. Start development
pnpm dev
```

## Development Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes following the code style below.

3. Verify your changes:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm build
   ```

4. Commit using conventional commits:
   ```bash
   git commit -m "feat: add wishlish share functionality"
   ```

5. Push and open a Pull Request against `main`.

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting, semicolons) |
| `refactor` | Code refactoring without behavior change |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Build process, tooling, dependencies |

## Code Style

- **TypeScript strict** — `"strict": true`, no `any` types
- **NestJS modules** — Module, Controller, Service pattern
- **Next.js App Router** — Server Components by default, `'use client'` only when necessary
- **Prisma** — Use `prisma` singleton from `@ecommerce/database`
- **Zod** — Runtime validation for shared types
- **Tailwind** — Use ShadcnUI components, dark-mode-first
- **No `any`** — Use proper types or generics

## Project Architecture

```
apps/api/src/
  modules/          # Domain modules (auth, products, cart, etc.)
  common/
    cache/          # ICacheService interface + InMemoryCacheService
    decorators/     # @Roles(), @CurrentUser()
    filters/        # GlobalExceptionFilter
    guards/         # JwtAuthGuard, RolesGuard, OptionalJwtAuthGuard
    interceptors/   # TransformInterceptor, LoggingInterceptor
    pipes/          # SanitizePipe
    security/       # TOKEN_BLACKLIST, ITokenBlacklist

apps/web/src/
  app/              # Next.js App Router pages
  components/       # Reusable UI + layout components
  stores/           # Zustand state (auth, cart)
  lib/              # API client, utilities
```

## Database Changes

When modifying the Prisma schema:

1. Edit `packages/database/prisma/schema.prisma`
2. Create a migration SQL file in `prisma/migrations/`
3. Run `pnpm --filter @ecommerce/database exec prisma db push` locally
4. Run `pnpm --filter @ecommerce/database exec prisma generate` to update the client
5. On merge to `main`, the `db-migrate.yml` workflow runs `prisma migrate deploy`

## Pull Request Process

1. Ensure all CI checks pass (lint, typecheck, test, build).
2. Update the relevant documentation.
3. Add tests for new features.
4. Keep PRs focused — one feature or fix per PR.
5. Request review from a maintainer.

## Reporting Issues

- Use [GitHub Issues](https://github.com/<username>/ecommerce-platform/issues)
- Include steps to reproduce, expected behavior, and actual behavior
- Specify your Node.js version, OS, and browser

## Questions?

Open a [GitHub Discussion](https://github.com/<username>/ecommerce-platform/discussions) for questions that are not bug reports or feature requests.