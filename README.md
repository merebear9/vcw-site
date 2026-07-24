# Vermilion County Watchdog

Hyperlocal accountability journalism for Danville and Vermilion County,
Illinois. Full-stack Next.js site with articles, a public records database,
paid memberships, an anonymous tip line, and an admin dashboard.

**Holding Power Accountable in Vermilion County.**

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL via Prisma, with proper migrations
  (`prisma/migrations`). Works with any Postgres host — Neon, Vercel
  Postgres, Supabase, RDS, or a self-hosted instance on a VPS.
- **Auth:** NextAuth.js (email magic link + Google sign-in)
- **Payments:** Stripe Checkout + webhooks for recurring memberships
- **Content:** Article body is authored as Markdown. Seed articles live in
  `content/articles/*.md` with frontmatter; they're loaded into the database
  on first seed. From then on, the admin dashboard's article editor is the
  source of truth (so edits work the same in serverless deployments where the
  filesystem isn't writable at runtime).

## Getting Started

You need a Postgres database to run this locally — either a free cloud one
(easiest) or one running on your machine.

**Option A — free cloud Postgres (recommended, 2 minutes):**
Create a free database at [neon.com](https://neon.com) or
[vercel.com/storage/postgres](https://vercel.com/storage/postgres) and copy
the connection string it gives you.

**Option B — local Postgres:**
```bash
# macOS
brew install postgresql@16 && brew services start postgresql@16
createuser -s vcw && createdb -O vcw vcw_dev
# then use: postgresql://vcw@localhost:5432/vcw_dev
```

Then:

```bash
npm install
cp .env.example .env
# edit .env — set DATABASE_URL to your connection string, and set
# NEXTAUTH_SECRET (generate one with: openssl rand -base64 32)

npm run db:migrate   # applies prisma/migrations to your database
npm run db:seed      # loads 3 sample articles + 2 sample records + admin user
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
| `DATABASE_URL` | Yes | Postgres connection string |
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
/prisma           schema.prisma + migrations/ + seed script
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

## Deploying to Vercel — step by step

1. **Push the code to GitHub** (if it isn't already).

2. **Create a Postgres database.** Go to
   [neon.com](https://neon.com) (or Vercel's own Postgres add-on at
   vercel.com/storage/postgres), create a free database, and copy the
   connection string. It looks like
   `postgresql://user:password@host/dbname?sslmode=require`.

3. **Import the project into Vercel.**
   - Go to [vercel.com/new](https://vercel.com/new), sign in with GitHub,
     and select this repo.
   - Framework preset should auto-detect as Next.js — leave the build
     command as the default (`npm run build`); it already runs
     `prisma migrate deploy` before building, so your database schema is
     created/updated automatically on every deploy.

4. **Set environment variables** in the Vercel project settings
   (Settings → Environment Variables). At minimum:
   - `DATABASE_URL` — the connection string from step 2
   - `NEXTAUTH_URL` — your Vercel deployment URL, e.g. `https://vcw-site.vercel.app`
   - `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
   - `STRIPE_SECRET_KEY` — if you want memberships to work
   - Any of the optional ones from `.env.example` you want enabled
     (Google sign-in, email sign-in, Stripe price IDs)

5. **Click Deploy.** Vercel builds the project, applies the Prisma
   migrations against your new database, and gives you a live URL.

6. **Seed sample content (one time only).** From your local machine, with
   `DATABASE_URL` in your `.env` pointed at the *same* production database
   from step 2, run:
   ```bash
   npm run db:seed
   ```
   This is a one-time step — after that, use the admin dashboard
   (`/admin`) to manage articles and records going forward.

7. **Add the Stripe webhook** pointing at
   `https://<your-domain>/api/stripe/webhook`, listening for
   `checkout.session.completed`, `customer.subscription.updated`, and
   `customer.subscription.deleted`. Put the signing secret into the
   `STRIPE_WEBHOOK_SECRET` environment variable in Vercel and redeploy.

8. **File uploads** (`/tips`, `/admin/documents`) won't persist on Vercel's
   filesystem between requests — see "Notes on File Uploads" above. The
   rest of the site works fully without this.

## VPS / Self-Hosted

1. Install Postgres on the VPS (or point at a hosted one) and create a
   database.
2. `npm install && npm run build` (this runs `prisma migrate deploy`
   automatically before building).
3. Set environment variables (a `.env` file works fine here since the
   filesystem is persistent).
4. `npm run db:seed` once, to load sample content.
5. `npm run start`, reverse-proxied behind Nginx/Caddy with TLS.
6. Local file uploads work natively in this setup — no object storage
   required.

## Brand

- **Tagline:** "Holding Power Accountable in Vermilion County"
- **Motto:** "Accountability. Transparency. Exposure."
- Colors, typography, and the wolf-head wordmark are defined in
  `tailwind.config.ts` and `public/images/logo.png` (the real logo, cropped
  and made transparent from the Facebook page asset).
