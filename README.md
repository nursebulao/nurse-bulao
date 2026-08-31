# Nurse Bulao V4.1

Corrected production-oriented foundation for Nurse Bulao.

## What was corrected from the earlier V4 ZIP
- Added missing `crypto` import that broke booking creation.
- Added missing Prisma `Session -> User` relation.
- Added missing web TypeScript/Next configuration.
- Protected admin booking and assignment APIs with authentication + role checks.
- Prevented public registration from silently changing an existing Patient account into a Nurse account.
- Added UUID validation for route parameters.
- Added audit logs for sensitive admin mutations.
- Made nurse assignment conflict checks ignore cancelled/completed bookings.
- Cancelled previous outstanding offers before creating a new offer.
- Added safer error handling and database unique-conflict handling.
- Added production HSTS and optional trusted-proxy configuration.
- Improved root workspace scripts and database package exports.

## Still intentionally provider-dependent
OTP delivery, Redis-backed distributed rate limiting/sessions, document object storage, notifications, payments and full RBAC/admin/patient/nurse UI need provider and business-policy decisions before implementation.

## Run locally
1. Copy `.env.example` to `.env`.
2. Run `docker compose up -d`.
3. Run `npm install`.
4. Run `npm run db:generate`.
5. Run `npm run db:migrate`.
6. Run `npm run dev:api`.
7. In another terminal run `npm run dev:web`.

Do not use the development PostgreSQL password or example secrets in production.


## Premium web + Netlify deployment

The public web app is in `apps/web`. It now has a premium responsive home page, service cards, date-to-date booking, separate Nurse/Caretaker/Admin entry points, and desktop WhatsApp Web support.

Set these Netlify environment variables:
- `NEXT_PUBLIC_API_URL` = the HTTPS URL where the Fastify API is deployed.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` = business WhatsApp number in international digits, without `+` or spaces.

Important: Netlify hosts the web frontend. The Fastify API + PostgreSQL database must be deployed separately for real bookings, authentication and admin operations. WhatsApp is an optional confirmation/support channel, not the booking database.
