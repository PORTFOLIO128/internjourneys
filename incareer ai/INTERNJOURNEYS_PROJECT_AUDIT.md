# InternJourneys Project Audit Report

## 1. Executive Summary

This repository is a Next.js-based virtual internship platform for InternJourneys. The app is built around a student-facing dashboard, internship domain catalog, task submission workflow, payment gating for certificate unlock, and an admin console. The full business logic is split between the Next.js app and PostgreSQL functions in Supabase, with Redis caching used for domain data.

The repository shows a realistic, end-to-end platform architecture rather than a toy prototype. The core stack is: Next.js 14 App Router, React/TypeScript, Tailwind CSS, Supabase Auth + Postgres, Upstash Redis, and Razorpay for certificate payments. The platform enforces a significant amount of logic in database functions, which is a good sign for integrity but also means production behavior depends heavily on the live database configuration and migration state.

The most important confirmed findings are:

- The app uses Supabase for auth, profile creation, internship enrollment, task state, payment tracking, certificate issuance, and admin reporting.
- It contains a real certificate-payment flow using Razorpay and a signed verification path.
- The platform includes certificate gating logic that requires a completed payment plus all required tasks to be verified before a certificate is issued.
- The repo still contains a number of ESLint violations and likely incomplete or unpolished UI/server patterns.
- Some production-critical assumptions are not verifiable from the repo alone, especially live auth policies, RLS enforcement in Supabase, production Redis configuration, and deployment environment setup.

This report documents what is confirmed by the code and migration evidence, and also identifies what remains unconfirmed without access to the live Supabase project, Redis, and deployment dashboard.

---

## 2. Audit Scope and Evidence Used

This audit is based on direct repository inspection, including:

- [package.json](package.json)
- [lib/authContext.tsx](lib/authContext.tsx)
- [lib/supabase/queries.ts](lib/supabase/queries.ts)
- [lib/supabase/client.ts](lib/supabase/client.ts)
- [lib/supabase/server.ts](lib/supabase/server.ts)
- [lib/redis.ts](lib/redis.ts)
- [app/api/domains/route.ts](app/api/domains/route.ts)
- [app/api/domains/[slug]/route.ts](app/api/domains/[slug]/route.ts)
- [app/api/payments/create-order/route.ts](app/api/payments/create-order/route.ts)
- [app/api/payments/verify/route.ts](app/api/payments/verify/route.ts)
- [app/dashboard/page.tsx](app/dashboard/page.tsx)
- [app/dashboard/certifications/page.tsx](app/dashboard/certifications/page.tsx)
- [components/dashboard/QuestLog.tsx](components/dashboard/QuestLog.tsx)
- [components/dashboard/TaskDetailModal.tsx](components/dashboard/TaskDetailModal.tsx)
- [utils/certificateGenerator.ts](utils/certificateGenerator.ts)
- [supabase/config.toml](supabase/config.toml)
- [supabase/migrations](supabase/migrations)

This project was audited as a codebase-only review; no application code was changed, no database migrations were run, no payment integration was completed, and no live environment credentials were used beyond local inspection.

---

## 3. Confirmed Technology Stack

| Area | Confirmed technology | Evidence |
|---|---|---|
| Frontend framework | Next.js 14 App Router | [package.json](package.json) |
| UI library | React 18 + TypeScript | [package.json](package.json) |
| Styling | Tailwind CSS | [tailwind.config.ts](tailwind.config.ts) |
| Auth / database | Supabase Auth + Postgres | [lib/authContext.tsx](lib/authContext.tsx), [lib/supabase/client.ts](lib/supabase/client.ts), [supabase/migrations](supabase/migrations) |
| Caching | Upstash Redis | [lib/redis.ts](lib/redis.ts), [app/api/domains/route.ts](app/api/domains/route.ts) |
| Payment provider | Razorpay | [app/api/payments/create-order/route.ts](app/api/payments/create-order/route.ts), [app/api/payments/verify/route.ts](app/api/payments/verify/route.ts) |
| Certificate generation | Browser canvas + QR codes | [utils/certificateGenerator.ts](utils/certificateGenerator.ts) |
| Infrastructure | Supabase-managed Postgres functions + Auth | [supabase/migrations](supabase/migrations) |

The package manifest confirms the project is a real production-style web app, not a mock or static landing page. The app has a strong domain model and multiple business workflows tied to live data sources.

---

## 4. High-Level Architecture

The platform follows a classic modern web architecture:

1. Frontend application in Next.js with App Router pages and client-side state.
2. Supabase is the primary backend for user identity, role metadata, domain/task tables, enrollments, submissions, payments, certificates, and admin views.
3. Route handlers in the Next.js server layer perform specific secure operations such as starting a Razorpay order and validating the payment signature.
4. Redis is used to cache domain data and prevent repeated DB fetches.
5. The database layer uses SQL migrations to create tables, RLS policies, and security-definer RPC functions that enforce business logic.

In practical terms, the app does not rely solely on client-side checks. A substantial amount of business enforcement is pushed down to Supabase functions, which is both positive and operationally important to understand.

---

## 5. Repository Structure and Product Shape

The repository is organized around a student internship platform with both public-facing pages and private application sections.

### Public / marketing / onboarding

- Landing page and marketing sections are in [app/page.tsx](app/page.tsx)
- Registration and login flows are in [app/register/page.tsx](app/register/page.tsx) and [app/login/page.tsx](app/login/page.tsx)
- Domain discovery and detail pages appear in [app/domains/[slug]/page.tsx](app/domains/[slug]/page.tsx)
- Help and verification pages exist in [app/help/page.tsx](app/help/page.tsx) and [app/verify/[code]/page.tsx](app/verify/[code]/page.tsx)

### Student app

- Student dashboard: [app/dashboard/page.tsx](app/dashboard/page.tsx)
- Certifications page: [app/dashboard/certifications/page.tsx](app/dashboard/certifications/page.tsx)
- Payments page: [app/dashboard/payments/page.tsx](app/dashboard/payments/page.tsx)
- Task flow: [components/dashboard/QuestLog.tsx](components/dashboard/QuestLog.tsx) and [components/dashboard/TaskDetailModal.tsx](components/dashboard/TaskDetailModal.tsx)

### Admin app

- Admin home/dashboard: [app/admin/page.tsx](app/admin/page.tsx)
- Student management: [app/admin/students/page.tsx](app/admin/students/page.tsx)
- Domain/task management: [app/admin/domains-tasks/page.tsx](app/admin/domains-tasks/page.tsx)
- Payment management: [app/admin/payments/page.tsx](app/admin/payments/page.tsx)
- Certificate access controls: [app/admin/certificate-access/page.tsx](app/admin/certificate-access/page.tsx)

The app has a clear separation between student and admin experiences, but the repository does not include a complete deployment configuration or environment inventory, so hosting is not confirmed from code alone.

---

## 6. Authentication and User Model

The app uses Supabase Auth rather than a custom session system. The user model is created and restored in [lib/authContext.tsx](lib/authContext.tsx).

Behavior confirmed by the code:

- Users sign up with Supabase Auth via `signUp`.
- A trigger from the database layer creates a profile record after Auth signup.
- The profile includes `role`, `full_name`, `college`, `graduation_year`, and contact fields.
- The app calls `supabase.auth.getSession()` and reads the profile to restore the logged-in user.
- The login flow determines the redirect target: admin users go to `/admin`; students go to `/dashboard`.
- The app stores session information in browser storage and uses a custom tab-scoped storage key in [lib/supabase/client.ts](lib/supabase/client.ts).

The actual auth setup is in the database migration files, and the app also contains a specific message warning the developer to disable email confirmation in Supabase Authentication when signup is expected to complete without email approval. That message is represented in [lib/authContext.tsx](lib/authContext.tsx), and the local Supabase config shows `enable_confirmations = false` in [supabase/config.toml](supabase/config.toml).

This is a strong indicator that the project expects a low-friction auth flow but may be configured to bypass email verification in development or staging.

---

## 7. Domain, Enrollment, and Task Workflow

The app’s core product loop is: discover domains → enroll → complete required tasks → submit work → payment → certificate unlock.

The domain catalog is loaded from a cached public endpoint built in [app/api/domains/route.ts](app/api/domains/route.ts) and [app/api/domains/[slug]/route.ts](app/api/domains/[slug]/route.ts). Domain data is filtered by `is_active = true`, and tasks are also filtered by `tasks.is_active = true`.

The student dashboard uses [app/dashboard/page.tsx](app/dashboard/page.tsx), which calls `getStudentTasks()` from [lib/supabase/queries.ts](lib/supabase/queries.ts). That function selects from `student_tasks` and joins task metadata. The mapping in [lib/supabase/types.ts](lib/supabase/types.ts) transforms the raw database rows into a UI-friendly task model with statuses like `Completed`, `Pending`, and `VERIFICATION_PENDING`.

The task submission UI allows a student to provide a project URL and submit work. The workflow then relies on a database RPC named `submit_student_task`, which enforces validation in the SQL layer.

The app explicitly polls the dashboard every 15 seconds whenever tasks are in a pending verification state, which strongly suggests the platform expects a background or near-real-time verification cycle. This is confirmed by the status text shown in [components/dashboard/TaskDetailModal.tsx](components/dashboard/TaskDetailModal.tsx).

---

## 8. Cache and API Layer

The app uses Upstash Redis via [lib/redis.ts](lib/redis.ts). This wrapper checks for environment variables:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

When present, it can read and write cached values with TTLs. Domain endpoints cache active domain listings and slug-based fetches for 10 minutes.

This is a reasonable optimization pattern for a public catalog, but it also creates an operational dependency: if Redis is misconfigured or unavailable, the app falls back to direct Supabase queries without failing the route entirely. The code is designed to be resilient to cache absence, but the live cache state still matters for performance and stale-data behavior.

---

## 9. Payment Flow

The payment flow is implemented in two route handlers and relies on the database for state tracking.

### Payment order creation

The order creation route is [app/api/payments/create-order/route.ts](app/api/payments/create-order/route.ts).

Confirmed behavior:

- It requires a bearer token from the signed-in user.
- It validates the session with `supabase.auth.getUser(accessToken)`.
- It calls `assert_certificate_payment_schema()` to ensure the certificate-payment schema is ready.
- It prevents duplicate completed certificate payments using a query against the `payments` table.
- It creates a Razorpay order for a certificate fee of ₹199 using `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
- It inserts a payment row with status `Pending`.

### Payment verification

The verification route is [app/api/payments/verify/route.ts](app/api/payments/verify/route.ts).

Confirmed behavior:

- It verifies the Razorpay signature by reconstructing the expected HMAC.
- It fetches the payment from Razorpay and checks order id, amount, currency, and captured status.
- It then calls `complete_certificate_payment` in the database layer.

This flow is a clear sign of a real payment integration for the certificate fee. However, the code does not show a complete external webhook pipeline or any admin refund logic beyond manual status updates in the UI. The live operational flow still depends on Razorpay webhooks, payment state synchronization, and database function behavior in the remote Supabase environment.

---

## 10. Certificate Issuance and Verification

The certificate experience is a key product feature and is implemented across the front-end, the SQL layer, and the public verification page.

The browser-side certificate generator in [utils/certificateGenerator.ts](utils/certificateGenerator.ts) draws a certificate onto a canvas, inserts a QR code, and saves the image file. It uses a base template and a founder signature image. It is designed to generate a PNG for preview/download.

The eligibility state is computed via `get_student_certificate_access` in [supabase/migrations](supabase/migrations). This function checks:

- whether the student has an active enrollment
- whether the required payment is completed
- whether all required tasks are verified
- whether a certificate override exists for the student
- whether a prior certificate was revoked

If all conditions are satisfied, the function creates or updates the certificate and returns a verification URL.

The public verification page is [app/verify/[code]/page.tsx](app/verify/[code]/page.tsx), which calls `verifyCertificateByCode` and displays certificate metadata if valid. The database function `verify_certificate_by_code` resolves a certificate ID and returns a valid or invalid result without exposing sensitive backend fields.

This is a thoughtful, real certificate flow. It includes both product UX and stored verification logic, which is a strong sign of a mature feature set.

---

## 11. Admin Functionality

The admin app includes several management views. The SQL migration layer is rich and precise.

The admin console includes:

- dashboard stats via `admin_dashboard_stats()`
- student overview via `admin_student_overview()`
- submission review via `admin_submission_overview()`
- payment overview via `admin_payment_overview()`
- certificate access overview via `admin_certificate_access_overview()`
- overrides via `set_certificate_access_override()`

The admin payment page and certificate access page show the controls to review or change status, which is useful operationally but also increases the risk of accidental or malicious manual status changes if access controls are misconfigured.

More importantly, the SQL layer uses `security definer` database functions and a custom `is_admin()` check. That means the system assumes admin status is enforced in Postgres and not purely by UI. This is appropriate for strong backend enforcement, but it should be validated in a live Supabase project because the code cannot prove the final role policy state from the repo alone.

---

## 12. Database Schema and Migration Architecture

The project includes a migration series under [supabase/migrations](supabase/migrations), including:

- `20260905000000_internship_system.sql`
- `20260905010000_profile_trigger.sql`
- `20260905020000_fix_enrollment_status_ambiguity.sql`
- `20260905020000_payments_and_admin.sql`
- `20260906000000_fix_admin_rpc_functions.sql`
- `20260906010000_certificates_and_branding.sql`
- `20260907000000_unlock_certificates_for_students.sql`
- `20260907010000_unlock_certificates_without_enrollment.sql`
- `20261005000000_certificate_access_controls.sql`
- `20261005010000_fix_certificate_access_json.sql`

These migrations create core tables such as:

- `profiles`
- `domains`
- `domain_skills`
- `tasks`
- `internship_enrollments`
- `student_tasks`
- `payments`
- `certificates`
- `certificate_access_overrides`

The migration pattern is important: business logic is not only in app code but also in SQL stored procedures and RLS policies. This means that if the live database is not perfectly synced with the migration history, the app may break or behave unexpectedly even when the frontend code is correct.

---

## 13. Security Review and Confirmed Risks

The project contains a number of reasonable protections, but the repository also highlights several important concerns.

### Confirmed strengths

- Operating with Supabase Auth gives access to managed session handling.
- The app uses RPC functions and Postgres checks instead of trusting arbitrary UI state.
- Payment verification is done with signature matching and server-side validation before the DB is updated.
- Public verification is read-only and derived from issued certificate records.

### Confirmed concerns

1. Sensitive configuration exists locally in the workspace.
   - The local environment file contains keys and URLs that are not suitable to be committed or left in plain text.
   - The audit did not include any secret values, but the repo clearly shows environment variables are expected in the local app configuration.

2. Email confirmation is disabled.
   - [supabase/config.toml](supabase/config.toml) sets `enable_confirmations = false`.
   - This reduces friction but increases the chance of unverified account creation in environments that should require stronger identity checks.

3. Client-side UI is not the only trust boundary.
   - The app definitely relies on backend functions for permissions and payment rules, but not every permission is impossible to bypass if the database is misconfigured.
   - Frontend-only checks are still insufficient as a security model.

4. Manual admin actions can change payment and certificate states.
   - The admin area has the ability to update payment rows and override certificate access.
   - If the admin role is over-broad or mis-scoped, this becomes a high-impact control surface.

5. Payment flow is partially dependent on live service configuration.
   - The actual live Razorpay keys, webhook configuration, and production environment variables are not visible in the repo.
   - The code shows a working pattern, but not a full production-grade deployment plan.

6. Linting is currently failing.
   - A direct `npm run lint` run reported a large number of `@typescript-eslint/no-explicit-any`, unused imports, and unescaped-entity issues.
   - This is an important quality and maintainability concern and highlights that the repo is not currently lint-clean.

---

## 14. Important Observations from the Code

### Required task and certificate gating

The database function `get_student_certificate_access` makes certificate eligibility depend on:

- enrollment existence
- payment completion
- all required tasks being verified
- admin override state

This is a robust model for a certificate-based internship program.

### Registration and onboarding

The registration flow in [lib/authContext.tsx](lib/authContext.tsx) creates a user, then inserts/upserts the profile row, and optionally creates an internship enrollment if a valid domain is selected. This means the platform expects a domain selection during signup or strongly encourages it.

### Cache invalidation

The app has an admin cache invalidation endpoint at [app/api/cache/invalidate/route.ts](app/api/cache/invalidate/route.ts). That endpoint checks auth and invalidates domain cache keys. This suggests the application is designed to support content updates without redeploying.

### Footer and support placeholders

The app includes placeholder anchors for privacy and terms pages, and some support flows appear incomplete. This does not necessarily mean production risk, but it does suggest some product/compliance pages are not yet determined.

---

## 15. Verified Security Concerns and Risk Levels

| Risk | Severity | Status | Notes |
|---|---|---|---|
| Secret leakage in local environment files | Critical | Confirmed by repo context | Environment config is expected but should never be committed or left exposed |
| Email confirmation disabled | Medium | Confirmed | Good for UX, but weakens onboarding security if not intentionally configured |
| Manual admin override power | High | Confirmed | Admin actions can directly alter certificate/payment state |
| Payment gateway dependencies not fully operationally reviewed | High | Likely | Webhooks, dashboard settings, and production config are not visible here |
| Lint failures and type-quality issues | Medium | Confirmed | There are many lint errors in the repo |
| Missing compliance/privacy/legal pages | Low | Confirmed by placeholder links | Not a direct security flaw, but a product/compliance gap |

---

## 16. Deployment and Hosting Status

The repository does not include a deployment setup, infrastructure-as-code project, or CI/CD configuration. That means the following items are not confirmed from code alone:

- actual production hosting provider
- deployment environment names and regions
- upstream domain configuration
- reverse proxy / CDN behavior
- DNS / TLS / WAF posture
- queueing or background worker setup
- infrastructure secrets management

The user-facing app is clearly built for a hosted Next.js environment, but the production deployment state cannot be proven from the repository alone.

---

## 17. Missing Information Requiring Live Access

The following items are essential for a complete production-grade audit and cannot be determined from the repository alone without access to live systems:

1. Supabase project settings
   - RLS toggles
   - role policies
   - active migration history
   - auth providers and confirmation settings
   - storage bucket permissions

2. Live Redis status
   - whether Upstash Redis is active in production
   - TTL behavior and cache eviction patterns
   - any stale-cache issues

3. Razorpay configuration
   - live key values
   - webhook settings
   - success/failure callbacks
   - refund handling and dispute process

4. Deployment and hosting dashboard
   - Vercel, Azure, or another platform status
   - env var inventory and secret rotation status
   - domain and SSL configuration

5. Operational monitoring and logs
   - failed payment logs
   - auth failures
   - admin access events
   - certificate issuance exceptions

Without access to these systems, the repo can document the intended architecture but cannot confirm live production correctness.

---

## 18. Production Readiness Assessment

This project is not a simple demo; it is a real business workflow platform with a meaningful domain model. The repository demonstrates a clear product shape and good backend enforcement patterns.

However, it is not yet fully proven production-ready because:

- there are lint and code-quality issues in the repository
- deployment and live environment details are missing
- some auth and admin assumptions require live validation
- payment operations and certificate issuance depend on external systems that are not fully visible here
- the repo has placeholders and incomplete compliance flows

A realistic assessment is: mid-to-high maturity in business logic, but incomplete in operational hardening and production validation.

---

## 19. Conclusion

The InternJourneys codebase is a real, feature-rich virtual internship platform with student onboarding, reimbursement-like payment gating, task submission, admin review, and certificate issuance. The strongest evidence shows a design that intentionally pushes core business logic into Supabase SQL functions to reduce trust in the frontend.

The app is structurally mature, but it still requires live-environment validation before calling it production-ready. Most importantly, the codebase does not by itself prove the live security posture or deployment configuration. The most important remaining work is to audit the actual Supabase policies, Redis configuration, deployment platform, and Razorpay setup in the live environment.

---

## 20. Evidence Summary

Key files that define the system behavior:

- [package.json](package.json)
- [lib/authContext.tsx](lib/authContext.tsx)
- [lib/supabase/queries.ts](lib/supabase/queries.ts)
- [lib/redis.ts](lib/redis.ts)
- [app/api/domains/route.ts](app/api/domains/route.ts)
- [app/api/payments/create-order/route.ts](app/api/payments/create-order/route.ts)
- [app/api/payments/verify/route.ts](app/api/payments/verify/route.ts)
- [app/dashboard/certifications/page.tsx](app/dashboard/certifications/page.tsx)
- [utils/certificateGenerator.ts](utils/certificateGenerator.ts)
- [supabase/config.toml](supabase/config.toml)
- [supabase/migrations](supabase/migrations)

## 21. Post-audit Cashfree sandbox migration

The certificate-payment implementation has since been migrated from Razorpay to Cashfree sandbox checkout. Order creation, payment verification against Cashfree's server API, and raw-body-signed Cashfree webhooks are handled by server routes. Provider credentials and the Supabase service-role key are server-only. Browser checkout results are not used to complete payments.

The additive migration `supabase/migrations/20261019000000_cashfree_certificate_payments.sql` removes student payment-insert policies, restricts the payment-completion RPC to the service role, adds idempotent Cashfree completion/failure RPCs, and includes both verified Cashfree payments and valid historical Razorpay payments in certificate eligibility.

Required deployment configuration:

- `CASHFREE_CLIENT_ID` — Cashfree sandbox client ID.
- `CASHFREE_CLIENT_SECRET` — Cashfree sandbox client secret.
- `CASHFREE_WEBHOOK_SECRET` — webhook signing secret for the Cashfree sandbox webhook.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only Supabase service-role key.
- `NEXT_PUBLIC_SITE_URL` — canonical app origin used for Cashfree's order return URL.

Configure Cashfree's sandbox webhook to call `/api/payments/webhook` for payment success, failure, and user-dropped events. Apply the new Supabase migration through the normal reviewed database change process; it has not been applied to any remote database by this repository change. No live-mode configuration or deployment was performed.

This report intentionally excludes actual secret values and authentication tokens.
