# FlowMaster Web — Next.js Frontend

Next.js 14 frontend for FlowMaster AI, deployable to Cloudflare Pages via `@cloudflare/next-on-pages`.

## Architecture

```
flowmaster-web/         ← This repo (frontend)
flowmaster/             ← Backend (Cloudflare Worker + Hono API)
```

The frontend is a separate deployment from the backend. All data comes from the Hono API Worker.

## Pages

| Route | Description | Auth |
|---|---|---|
| `/` | Landing page | Public |
| `/auth/login` | Sign in | Public |
| `/auth/register` | Create account | Public |
| `/dashboard` | Cashflow overview | Protected |
| `/integrations` | Connect marketplaces | Protected |
| `/liquidity` | Early payout requests | Protected |
| `/profile` | Account settings | Protected |

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Set your API URL
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL to point to your Hono Worker

# 3. Run locally
npm run dev
```

## Deploy to Cloudflare Pages

```bash
# Build for Cloudflare Pages
npm run pages:build

# Deploy
npm run pages:deploy
```

Or connect this repo to Cloudflare Pages in the dashboard:
- **Framework**: Next.js
- **Build command**: `npx @cloudflare/next-on-pages`
- **Build output**: `.vercel/output/static`
- **Environment variable**: `NEXT_PUBLIC_API_URL=https://your-worker.workers.dev`

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend Hono Worker URL |

## CORS

Make sure your backend Worker's `ALLOWED_ORIGINS` includes your Cloudflare Pages domain:

```
ALLOWED_ORIGINS=https://your-app.pages.dev,http://localhost:3000
```

## Tech Stack

- **Next.js 14** — App Router, edge runtime
- **Tailwind CSS** — styling
- **Recharts** — revenue chart
- **Lucide React** — icons
- **@cloudflare/next-on-pages** — Cloudflare Pages adapter
