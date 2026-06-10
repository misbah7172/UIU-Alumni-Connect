# Render Deployment

This repository is configured for a single Render web service.

One Node process runs:

- Express API at `/api/*`
- API health checks at `/health` and `/health/db`
- Next.js frontend for all other routes

## Service

Create one Render Web Service from the repository root, or use the root-level `render.yaml` blueprint.

```text
Name: uiu-alumni-connect
Runtime: Node
Root Directory: leave blank
Build Command: npm ci --include=dev && npm run build:render
Start Command: npm run start:render
Health Check Path: /health
```

Do not set the root directory to `apps/web` or `apps/api`. The combined server needs both apps from the monorepo root.

## Required Environment Variables

Set these on the single Render service:

```text
DATABASE_URL
DIRECT_URL
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
JWT_SECRET
WEB_ORIGIN
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_DATABASE_URL
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

For the default service URL, use:

```text
WEB_ORIGIN=https://uiu-alumni-connect.onrender.com
NEXT_PUBLIC_API_URL=https://uiu-alumni-connect.onrender.com/api
```

If Render assigns a different service URL, update both values.

## Database

The Supabase database has already been pushed with Prisma. For future schema updates:

```bash
npm run prisma:push
```

## Health Checks

After deploy:

```text
https://uiu-alumni-connect.onrender.com/health
https://uiu-alumni-connect.onrender.com/health/db
https://uiu-alumni-connect.onrender.com/
```

`/health/db` verifies that the deployed API can reach Supabase.

## Firebase Admin

Google sign-in is verified on the backend with Firebase Admin. In Firebase Console, create a service account private key and add:

```text
FIREBASE_PROJECT_ID=uiu-adda-k
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

Keep newline escapes in `FIREBASE_PRIVATE_KEY` as `\n` when pasting into Render.
