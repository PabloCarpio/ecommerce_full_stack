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
| `RAILWAY_TOKEN` | Railway | https://railway.app/account/tokens → Create Token |
| `RAILWAY_SERVICE_ID` | Railway | Run `railway status` after `railway init`, or find in Railway Dashboard → Service → Settings |
| `NEXT_PUBLIC_API_URL` | Deployment | Your Railway API URL, e.g. `https://ecommerce-api-production.up.railway.app` |

---

## Vercel Environment Variables

Set in **Vercel Dashboard → Project → Settings → Environment Variables** (Production):

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://<your-railway-app>.up.railway.app` |
| `NEXT_PUBLIC_APP_URL` | `https://<your-vercel-app>.vercel.app` |

---

## Railway Environment Variables

Set in **Railway Dashboard → Project → Variables**:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://postgres...supabase.com:6543/postgres` | Pooled connection |
| `DIRECT_URL` | `postgresql://postgres...supabase.com:5432/postgres` | Direct connection |
| `JWT_ACCESS_SECRET` | Generate with `openssl rand -base64 64` | Must be 32+ chars |
| `JWT_REFRESH_SECRET` | Generate with `openssl rand -base64 64` | Different from access secret |
| `JWT_ACCESS_EXPIRES_IN` | `15m` | |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | |
| `FRONTEND_URL` | `https://<your-vercel-app>.vercel.app` | CORS origin |
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

# 3. Railway (run from project root)
npm i -g @railway/cli
railway login                 # Opens browser
railway init                  # Links repo to Railway service
railway up                    # First deploy (or let CI handle it)
railway variables set DATABASE_URL="postgresql://..."   # Set each variable
railway variables set JWT_ACCESS_SECRET="..."
# ... repeat for all Railway vars above

# 4. Upstash (create free Redis)
# Go to https://upstash.com → Create Database → Copy REST URL + Token to Railway vars

# 5. Cloudinary (create free account)
# Go to https://cloudinary.com → Dashboard → Copy Cloud Name, API Key, API Secret to Railway vars

# 6. Resend (create free account)
# Go to https://resend.com → Create API Key → Copy to Railway vars
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
| Railway | 500 hrs/mo, 512 MB RAM | Cold starts after inactivity |
| Vercel | 100 GB bandwidth, unlimited deploys | Serverless function timeout 10s |
| Upstash | 10k commands/day, 256 MB | Rate-limited if exceeded |
| Cloudinary | 25 GB storage, 25k transforms/mo | Bandwidth limits |
| Resend | 3,000 emails/mo | Sufficient for MVP |