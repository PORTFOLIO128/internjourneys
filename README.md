# InternJourneys

InternJourneys is a virtual internship and project-based learning platform built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Configure the existing Supabase public URL and anon key for the app. Razorpay Standard Checkout requires:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

Only the Razorpay key ID may be exposed to the browser. Never expose the Razorpay key secret, webhook secret, or Supabase service-role key to client-side code.

## Payments and database

Certificate checkout uses a fixed ₹99 INR amount. Configure Razorpay webhooks to send `payment.captured` and `payment.failed` events to `/api/payments/razorpay-webhook`. Keep unresolved orders pending; mark a payment failed only after Razorpay confirms failure or confirms that Checkout closed before any payment attempt. No additional payment-status database migration is required.

## Checks

```bash
npm test
npx tsc --noEmit
npm run build
```

The repository may contain existing lint failures; use the output of the build/lint commands to review them.
