# Deploy Fitness Garage

This app uses **SQLite** — deploy to a platform with **persistent disk** (not serverless-only).

## Option A: Railway (recommended, free tier)

1. Create account at [railway.app](https://railway.app)
2. Install CLI: `npm i -g @railway/cli`
3. Login: `railway login`
4. From project folder:

```bash
cd d:\FitnessGarrage
railway init
railway volume add --mount-path /data
railway up
```

5. In Railway dashboard → **Variables**, add:
   ```
   DATABASE_URL=file:/data/prod.db
   ```
6. Open the generated public URL.

## Option B: Render (free tier)

Render **free plan cannot use disks** — use **Turso** (free cloud SQLite) instead.

### Step 1 — Create Turso database (free)

```bash
# Install Turso CLI: https://docs.turso.tech/cli
turso auth login
turso db create fitness-garage
turso db show fitness-garage --url        # copy URL
turso db tokens create fitness-garage     # copy token
```

### Step 2 — Push schema to Turso (once, from your PC)

```bash
cd d:\FitnessGarrage
set TURSO_DATABASE_URL=libsql://your-db.turso.io
set TURSO_AUTH_TOKEN=your-token
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

### Step 3 — Deploy on Render

1. [render.com](https://render.com) → **New** → **Blueprint** → connect your GitHub repo
2. Uses `render.yaml` (no disk — works on **free** plan)
3. In Render → **Environment**, add:
   - `TURSO_DATABASE_URL` = your libsql URL
   - `TURSO_AUTH_TOKEN` = your token

### Render paid (optional)

If you prefer local SQLite file on disk, use **Starter plan ($7/mo)** and add a 1GB disk at `/data` with `DATABASE_URL=file:/data/prod.db` (see git history for that config).

## Option C: Vercel (requires Postgres/Turso)

SQLite does **not** work on Vercel serverless. You would need to migrate to PostgreSQL or Turso first.

## Local production test

```bash
docker build -t fitness-garage .
docker run -p 3000:3000 -v fitness-data:/data fitness-garage
```

Open http://localhost:3000

## First deploy

After deploy, seed demo data once (optional):

```bash
railway run npx tsx prisma/seed.ts
```
