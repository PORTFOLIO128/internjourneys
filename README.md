# InternJourneys

InternJourneys is a virtual internship and project-based learning platform built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Configure the existing Supabase public URL and anon key for the app. Cashfree checkout is currently configured for sandbox and additionally requires these server-side variables:

- `CASHFREE_CLIENT_ID`
- `CASHFREE_CLIENT_SECRET`
- `CASHFREE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

Never expose Cashfree credentials or the Supabase service-role key to client-side code.

## Payments and database

Certificate checkout uses a fixed ₹199 INR amount. Apply the additive SQL migration in `supabase/migrations` through a reviewed database deployment process before enabling payment completion. The migration is not applied automatically by the app.

## Checks

```bash
npm test
npx tsc --noEmit
npm run build
```

The repository may contain existing lint failures; use the output of the build/lint commands to review them.
