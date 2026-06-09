# API Surface

Base URL: `http://localhost:4000/api`

## Auth

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/reset-password`

These endpoints are backed by the current authentication service and can be swapped to a Supabase Auth exchange when production credentials and policies are finalized.

## Users

- `GET /users/me`
- `GET /users/alumni`

## Jobs

- `GET /jobs`
- `POST /jobs`

`POST /jobs` requires `ALUMNI`, `RECRUITER`, or `ADMIN`.

## Questions

- `GET /questions`
- `POST /questions`
- `POST /questions/:questionId/answers`

## Referrals

- `POST /referrals`
- `PATCH /referrals/:referralId/status`

Students create referral requests. Alumni or admins update status.

## Mentorship

- `GET /mentorship/mentors`
- `POST /mentorship/sessions`

## Notifications

- `GET /notifications`
- `PATCH /notifications/:notificationId/read`

## Admin

- `GET /admin/analytics`
- `GET /admin/reports`
- `PATCH /admin/users/:userId/verify`

Admin routes require an authenticated `ADMIN` user.
