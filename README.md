# UIU Alumni Connect

A modern alumni-student networking platform for university communities where alumni can post jobs, mentor students, answer questions, and provide referrals.

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS, ShadCN-style components, Zustand-ready structure, TanStack Query-ready structure.
- Backend: Express.js, TypeScript, REST routes, Zod validation, JWT/RBAC middleware.
- Database: Supabase PostgreSQL with Prisma ORM.
- Realtime-ready: Supabase Realtime for notifications, chat, Q&A updates, and job alerts.

## Project Structure

```text
apps/
  web/      Next.js application
  api/      Express API
prisma/     PostgreSQL schema
docs/       Architecture and API notes
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

For Supabase, set both `DATABASE_URL` and `DIRECT_URL` to the project pooler URL with the real database password:

```bash
postgresql://postgres.ftsepzfndwsjhlbfvbfr:YOUR_DATABASE_PASSWORD@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Push the schema to the configured database:

```bash
npm run prisma:migrate -- --name init
```

5. Run the web app:

```bash
npm run dev:web
```

6. Run the API:

```bash
npm run dev:api
```

## Current Status

This first implementation creates the production-oriented foundation:

- Responsive landing page.
- Login, register, and password reset screens.
- Student dashboard.
- Alumni dashboard.
- Job board.
- Q&A community.
- Alumni directory.
- Profile page.
- Mentorship page.
- Admin dashboard.
- Express API route skeleton with validation and RBAC.
- Prisma schema covering the core product model.

Next work should connect Supabase Auth, implement Prisma services, and add real data fetching with TanStack Query.

## Render Hosting

The repo includes `render.yaml` for deploying the Express API and Next.js frontend together in one Render web service.

See [docs/render-deployment.md](docs/render-deployment.md) for the required environment variables and health checks.

Authentication uses Firebase Google sign-in only. The backend accepts only verified Google accounts whose email ends in `.uiu.ac.bd`, such as `name@bscse.uiu.ac.bd`. Add Firebase Admin service-account values to Render as `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.
