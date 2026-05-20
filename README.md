# Fitness Garage — Gym Management System

A full-featured gym management web app for **Fitness Garage**. Manage clients, membership fees, pending/overdue payments, payment history, and real-time client monitoring (check-ins & notes).

## Features

- **Dashboard** — Active members, pending/overdue fees, monthly revenue, who's in the gym
- **Clients** — Add/edit members, plans (Basic/Premium/Elite), active/inactive/suspended status, search
- **Fees & pending** — Monthly invoices, pending/partial/overdue tracking, bulk generate fees
- **Payments** — Record payments (Cash, UPI, Card, etc.), link to invoices, full payment ledger
- **Monitoring** — Check-in/check-out, live “in gym” list, attendance log, progress/health/payment notes

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Prisma](https://www.prisma.io) + SQLite
- Tailwind CSS
- TypeScript

## Getting started

```bash
# Install dependencies (if needed)
npm install

# Create database & generate client
npx prisma migrate dev --name init

# Seed sample data (6 clients, invoices, payments, check-ins)
npx tsx prisma/seed.ts

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npx prisma studio` | Browse database in UI |

## Project structure

```
src/
  app/           # Pages (dashboard, clients, fees, payments, monitoring)
  components/    # UI components
  lib/
    actions/     # Server actions (data mutations)
    db.ts        # Prisma client
prisma/
  schema.prisma  # Data models
  seed.ts        # Demo data
```

## Database

SQLite file: `prisma/dev.db` (configured via `DATABASE_URL` in `.env`).

To reset and re-seed:

```bash
npx prisma migrate reset
npx tsx prisma/seed.ts
```

## Deploy online

This app uses SQLite and needs **persistent storage**. Use **Railway** or **Render** (not Vercel serverless).

### Railway (fastest)

```bash
npm i -g @railway/cli
railway login
cd d:\FitnessGarrage
railway init
railway volume add --mount-path /data
```

Set variable in Railway dashboard:

```
DATABASE_URL=file:/data/prod.db
```

Then deploy:

```bash
railway up
```

### Render

1. Push this folder to GitHub
2. [render.com](https://render.com) → **New** → **Blueprint** → connect repo
3. Uses `render.yaml` (Docker + 1GB disk at `/data`)

Full details: [DEPLOY.md](./DEPLOY.md)
