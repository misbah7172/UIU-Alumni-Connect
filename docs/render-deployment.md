# Render Deployment

This repository is ready for Render with the root-level `render.yaml` blueprint.

## Services

- `uiu-alumni-connect-api`: Express API web service.
- `uiu-alumni-connect-web`: Next.js web service.

## Required Environment Variables

Set these in the API service before the first successful deploy:

```text
DATABASE_URL
DIRECT_URL
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
WEB_ORIGIN
```

Set these in the web service:

```text
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

The default blueprint assumes these service URLs:

```text
https://uiu-alumni-connect-api.onrender.com
https://uiu-alumni-connect-web.onrender.com
```

If Render assigns a different URL, update:

- API service `WEB_ORIGIN`
- Web service `NEXT_PUBLIC_API_URL`

## Database

The Supabase database has already been pushed with Prisma. For future schema updates:

```bash
npm run prisma:push
```

## Health Checks

After deploy:

```text
https://uiu-alumni-connect-api.onrender.com/health
https://uiu-alumni-connect-api.onrender.com/health/db
https://uiu-alumni-connect-web.onrender.com/
```

`/health/db` verifies that the deployed API can reach Supabase.
