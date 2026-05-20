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

## Option B: Render

1. [render.com](https://render.com) → **New Web Service** → connect repo or use Docker
2. Use the included `Dockerfile`
3. Add a **persistent disk** mounted at `/data`
4. Environment: `DATABASE_URL=file:/data/prod.db`

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
