# GitHub Secrets & Environment Variables — Complete Reference

## GitHub Repository Secrets

Add these in **Settings → Secrets and variables → Actions**:

| Secret | Source | How to Get |
|--------|--------|------------|
| `DATABASE_URL` | Supabase | Supabase Dashboard → Project Settings → Database → Connection string (Pooler, port 6543) |
| `DIRECT_URL` | Supabase | Supabase Dashboard → Project Settings → Database → Connection string (Direct, port 5432) |
| `VERCEL_TOKEN` | Vercel | https://vercel.com/account/tokens → Create Token (scope: Full Account) |
| `VERCEL_ORG_ID` | Vercel | Run `npx vercel link` inside `apps/web`, then read from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Vercel | Same as above — found in `.vercel/project.json` after linking |
| `RENDER_DEPLOY_HOOK` | Render | Render Dashboard → your service → Settings → Deploy Hook → Create one |
| `NEXT_PUBLIC_API_URL` | Deployment | Your Render API URL, e.g. `https://ecommerce-api.onrender.com` |

---

## Vercel Environment Variables

Set in **Vercel Dashboard → Project → Settings → Environment Variables** (Production):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://ecommerce-api.onrender.com` (your Render URL) |
| `NEXT_PUBLIC_APP_URL` | `https://<your-app>.vercel.app` |

---

## Render Environment Variables

Set in **Render Dashboard → your service → Environment**:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://postgres...supabase.com:6543/postgres` | Pooled connection |
| `DIRECT_URL` | `postgresql://postgres...supabase.com:5432/postgres` | Direct connection |
| `JWT_ACCESS_SECRET` | Generate with `openssl rand -base64 64` | Must be 32+ chars |
| `JWT_REFRESH_SECRET` | Generate with `openssl rand -base64 64` | Different from access secret |
| `JWT_ACCESS_EXPIRES_IN` | `15m` | |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | |
| `FRONTEND_URL` | `https://<your-app>.vercel.app` | CORS origin |
| `PORT` | `4000` | NestJS port |
| `NODE_ENV` | `production` | |
| `UPSTASH_REDIS_REST_URL` | `https://<endpoint>.upstash.io` | Create at https://upstash.com |
| `UPSTASH_REDIS_REST_TOKEN` | From Upstash dashboard | |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard | Create at https://cloudinary.com |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard | |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard | |
| `RESEND_API_KEY` | `re_xxxxx` | Create at https://resend.com |
| `RESEND_FROM_EMAIL` | `noreply@yourdomain.com` | Domain must be verified in Resend |

---

## One-Time Setup Commands

```bash
# 1. Generate production JWT secrets
openssl rand -base64 64    # Copy → JWT_ACCESS_SECRET
openssl rand -base64 64    # Copy → JWT_REFRESH_SECRET

# 2. Vercel (run from apps/web)
cd apps/web
npx vercel link              # Creates .vercel/project.json with ORG_ID + PROJECT_ID
npx vercel env pull .env.local   # Pull existing Vercel env vars locally (optional)

# 3. Render (via Dashboard)
# Go to https://dashboard.render.com → New → Web Service
# Connect your GitHub repo
# Set:
#   Runtime: Docker
#   Dockerfile Path: ./apps/api/Dockerfile
#   Docker Context: . (root of monorepo)
# Add all environment variables from the table above

# 4. After creating the Render service, get the Deploy Hook URL:
# Render Dashboard → your service → Settings → Deploy Hook → Create
# Add that URL as RENDER_DEPLOY_HOOK in GitHub Secrets

# 5. Upstash (create free Redis)
# Go to https://upstash.com → Create Database → Copy REST URL + Token to Render vars

# 6. Cloudinary (create free account)
# Go to https://cloudinary.com → Dashboard → Copy Cloud Name, API Key, API Secret to Render vars

# 7. Resend (create free account)
# Go to https://resend.com → Create API Key → Copy to Render vars
```

---

## First Manual Migration Command

After all secrets are set, if you ever need to run migrations manually (e.g., on a new database):

```bash
# From project root — sets schema on a fresh database
cd packages/database
pnpm exec prisma migrate deploy

# If starting from a completely blank database, also seed:
pnpm exec prisma db seed
```

For the CI/CD pipeline, `db-migrate.yml` runs `prisma migrate deploy` automatically when `packages/database/prisma/**` files change on `main`.

---

## Service Free-Tier Limits

| Service | Free Tier | Potential Limit |
|---------|-----------|-----------------|
| Supabase | 500 MB DB, 2 projects | Storage & row limits |
| Render | 750 hrs/mo, 512 MB RAM | Cold starts after 15min inactivity |
| Vercel | 100 GB bandwidth, unlimited deploys | Serverless function timeout 10s |
| Upstash | 10k commands/day, 256 MB | Rate-limited if exceeded |
| Cloudinary | 25 GB storage, 25k transforms/mo | Bandwidth limits |
| Resend | 3,000 emails/mo | Sufficient for MVP |