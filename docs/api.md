# API Surface

Base URL: `http://localhost:4000/api`

## Auth

- `POST /auth/firebase/google`

Manual email/password auth is disabled. The frontend signs in with Firebase Google Auth, sends the Firebase ID token to `/auth/firebase/google`, and the backend verifies it with Firebase Admin before issuing the app JWT. Only verified Google emails ending in `uiu.ac.bd` are accepted.

Compatibility endpoints return `410 Gone`:

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/reset-password`

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
