# UIU Alumni Connect Architecture

UIU Alumni Connect is structured as a TypeScript monorepo with separate frontend and backend apps.

## Apps

- `apps/web`: Next.js, Tailwind CSS, React components, page routes, and future Supabase client integration.
- `apps/api`: Express REST API with modular routes, validation middleware, RBAC middleware, and Prisma access.
- `prisma`: PostgreSQL schema for Supabase-hosted Postgres.

## Core Modules

- Authentication: Supabase Auth, JWT session verification, protected routes.
- Users: student, alumni, admin, and recruiter profiles.
- Jobs: search, filters, alumni/recruiter posting, referrals.
- Q&A: questions, answers, tags, votes, accepted answers.
- Referrals: student requests and alumni accept/reject workflow.
- Mentorship: mentor discovery, booking, session history.
- Notifications: live alerts via Supabase Realtime.
- Admin: verification, reports, moderation, analytics.

## Security Baseline

- Helmet for secure HTTP headers.
- CORS restricted by `WEB_ORIGIN`.
- Rate limiting for API routes.
- Zod validation at request boundaries.
- Prisma parameterized database access.
- Role-based middleware for protected workflows.
- Supabase Row Level Security policies should be added during database deployment.

## Next Milestones

1. Install dependencies and run Prisma generate.
2. Connect Supabase Auth to frontend auth pages.
3. Add RLS SQL policies and storage bucket rules for resumes/profile images.
4. Expand test coverage around service classes and protected route behavior.
5. Add production monitoring and error tracking.
6. Configure deployment-specific environment variables in Vercel/Railway/Render.
