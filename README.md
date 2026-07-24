# Vermilion County Watchdog

Hyperlocal accountability journalism for Danville and Vermilion County,
Illinois. Full-stack Next.js site with articles, a public records database,
paid memberships, an anonymous tip line, and an admin dashboard.

**Holding Power Accountable in Vermilion County.**

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Database:** SQLite via Prisma (swap the datasource provider to `postgresql`
  in `prisma/schema.prisma` to scale up — no other code changes required)
- **Auth:** NextAuth.js (email magic link + Google sign-in)
- **Payments:** Stripe Checkout + webhooks for recurring memberships
- **Content:** Article body is authored as Markdown. Seed articles live in
  `content/articles/*.md` with frontmatter; they're loaded into the database
  on first seed. From then on, the admin dashboard's article editor is the
  source of truth (so edits work the same in serverless deployments where the
  filesystem isn't writable at runtime).

## Getting Started

```bash
npm install
cp .env.example .env
# edit .env — at minimum set NEXTAUTH_SECRET (openssl rand -base64 32)

npm run db:push    # create the SQLite database from the Prisma schema
npm run db:seed    # load 3 sample articles + 2 sample records + admin user
npm run dev
```

Visit http://localhost:3000.

### Admin access

The seed script grants the `ADMIN` role to
`vermilioncountywatchdog@gmail.com`. Sign in as that address (via Google or
email magic link, once configured — see below) to reach `/admin`. To grant
admin to another account, update that user's `role` to `ADMIN` in the
database (e.g. via `npm run db:studio`).

## Environment Variables

See `.env.example` for the full list. Highlights:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | SQLite file path (or Postgres connection string) |
| `NEXTAUTH_URL` | Yes | Canonical site URL, also used for SEO/OG tags |
| `NEXTAUTH_SECRET` | Yes | Session encryption secret |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional | Enables "Continue with Google" |
| `EMAIL_SERVER_*` / `EMAIL_FROM` | Optional | Enables email magic-link sign-in |
| `STRIPE_SECRET_KEY` | For payments | Server-side Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | For payments | Verifies incoming Stripe webhook signatures |
| `STRIPE_PRICE_*` | Optional | Pre-created recurring Price IDs; if omitted, checkout builds prices dynamically from `lib/stripe.ts` |

Sign-in is optional to configure for local development — the site runs fine
without it, but comment posting and membership checkout require a signed-in
user.

## Stripe Setup

1. Create a Stripe account and grab your secret key into `STRIPE_SECRET_KEY`.
2. Either:
   - Do nothing else — checkout will create ad-hoc recurring prices at the
     amounts defined in `lib/stripe.ts` ($5 / $10 / $25 monthly, annual
     equivalents), or
   - Create six recurring Prices in the Stripe dashboard (one per tier per
     interval) and set the `STRIPE_PRICE_*` env vars to their IDs.
3. Add a webhook endpoint pointing at `/api/stripe/webhook` listening for
   `checkout.session.completed`, `customer.subscription.updated`, and
   `customer.subscription.deleted`. Copy the signing secret into
   `STRIPE_WEBHOOK_SECRET`.
4. For local testing, use the Stripe CLI: `stripe listen --forward-to
   localhost:3000/api/stripe/webhook`.

## File Structure

```
/app              Next.js App Router pages, layouts, and API routes
/components       Reusable UI components
/content/articles Seed article Markdown files (frontmatter + body)
/lib              Prisma client, auth config, Stripe helpers, data access
/prisma           schema.prisma + seed script
/public           Static assets — logo, placeholder images, uploaded PDFs
/styles           (Tailwind lives in app/globals.css + tailwind.config.ts)
```

## Notes on File Uploads

Anonymous tips (`/tips`) and admin-uploaded public records
(`/admin/documents`) are written to `public/uploads/tips` and
`public/documents` respectively. This works out of the box on a VPS or any
host with a persistent filesystem. **On serverless platforms (e.g. Vercel),
the filesystem is ephemeral** — swap these routes to upload to an object
store (S3, R2, Vercel Blob, etc.) before relying on file uploads in
production there.

## Deployment

### Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Set all required environment variables from `.env.example` in the Vercel
   project settings.
3. Switch `DATABASE_URL` to a hosted Postgres/SQLite-compatible database
   (e.g. Neon, Turso, or Vercel Postgres) — Vercel's filesystem is read-only
   at runtime, so a local SQLite file won't persist between deploys.
4. Add the Stripe webhook endpoint pointing at your deployed
   `/api/stripe/webhook` URL.
5. If you need tip/document file uploads in production, point those upload
   routes at an object store (see above).

### VPS / Self-Hosted

1. `npm install && npm run build`
2. Set environment variables (a `.env` file works fine here since the
   filesystem is persistent).
3. `npm run db:push && npm run db:seed` (seed once).
4. `npm run start`, reverse-proxied behind Nginx/Caddy with TLS.
5. SQLite and local file uploads both work natively in this setup — no
   external services required beyond Stripe and SMTP (if using email
   sign-in).

## Brand

- **Tagline:** "Holding Power Accountable in Vermilion County"
- **Motto:** "Accountability. Transparency. Exposure."
- Colors, typography, and the wolf-head wordmark are defined in
  `tailwind.config.ts` and `public/images/logo.svg`. Swap in the final logo
  file at that same path once available.
