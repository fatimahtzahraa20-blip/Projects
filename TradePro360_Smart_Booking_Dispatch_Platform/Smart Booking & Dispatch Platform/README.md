# TradeWeb — Smart Booking & Dispatch Platform

TradeWeb is a full-stack-ready job-management application for UK plumbers,
electricians, heating engineers, cleaners and locksmiths. It combines customer
booking, explainable engineer dispatch, live GPS tracking, GBP quotes, VAT
invoicing, customer communication and white-label business controls in one
responsive Next.js application.

## Features

- Five-step public booking flow with UK postcode, service, urgency, schedule,
  customer details, image evidence and Google Business Profile attribution.
- Automatic engineer recommendations based on qualification, availability,
  distance, estimated arrival time, workload and rating.
- Owner dashboard for jobs, dispatch, customers, engineers, invoices, reports
  and white-label settings.
- Mobile engineer workspace with job queue, status controls, directions,
  customer chat and browser-based GPS sharing.
- Customer portal with live MapTiler tracking, status timeline, chat, photo
  uploads, downloadable PDF invoices, Pay Later and service ratings.
- Dynamic GBP pricing using call-out fees, hourly labour, urgency premiums,
  UK parts and 20% VAT.
- Safepay hosted sandbox checkout with signed callback verification.
- Booking-confirmation and Pay Later invoice emails through Resend.
- Google Business Profile booking link generation and source attribution.
- Offline-friendly Zustand persistence and automatic synchronisation between
  tabs in the same browser.

## Technology

- Next.js 16 App Router, React 19 and TypeScript
- Tailwind CSS and Base UI components
- Zustand for application and demo-session state
- MapLibre GL with MapTiler map tiles
- Safepay official Node SDK for sandbox checkout
- Resend for transactional email
- React PDF for downloadable VAT invoices
- Zod for server-request validation
- Vitest, ESLint and TypeScript for verification

## Requirements

- Node.js 20 or newer
- npm
- A MapTiler key for map tiles
- A Resend key for email testing
- Safepay sandbox credentials for test checkout
- Supabase credentials if extending the supplied database schema into
  authenticated, cross-device persistence

## Installation

```bash
npm install
copy .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

After changing `.env`, stop and restart the development server. Do not commit
`.env` or expose any secret through a variable beginning with `NEXT_PUBLIC_`.

## Environment variables

| Variable | Visibility | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_MAPTILER_API_KEY` | Browser | Loads MapTiler map tiles. Restrict allowed origins in MapTiler. |
| `RESEND_API_KEY` | Server | Sends booking and invoice emails. |
| `EMAIL_FROM` | Server | Verified sender, or `TradeWeb <onboarding@resend.dev>` in test mode. |
| `RESEND_TEST_EMAIL` | Server | Optional recipient used while the Resend test sender is active. |
| `NEXT_PUBLIC_APP_URL` | Browser/server | Public application origin, for example `http://localhost:3000`. |
| `SAFEPAY_API_KEY` | Server | Safepay sandbox merchant API key. |
| `SAFEPAY_V1_SECRET` | Server | Validates Safepay callback signatures. |
| `SAFEPAY_ENVIRONMENT` | Server | Must remain `sandbox` in this build. |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser | Supabase publishable/anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Administrative database access; never expose to the browser. |

## Demo accounts

### Owner

```text
Email: owner@tradeweb.co.uk
Password: Owner123!
```

### Customers

All customer demo accounts use `Client123!`:

```text
amelia.brown@example.co.uk
george.evans@example.co.uk
charlotte.king@example.co.uk
harry.clarke@example.co.uk
```

These credentials are for local demonstration only and must not be used for a
production deployment.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | UK marketing site and product overview |
| `/services` | Trade services and starting prices |
| `/pricing` | Itemised GBP quote calculator |
| `/booking` | Public multi-step booking flow |
| `/track/[reference]` | Customer tracking, chat, photos, invoice and rating |
| `/portal` | Customer account and booking history |
| `/dashboard` | Owner KPIs and operational overview |
| `/dashboard/dispatch` | Explainable AI-assisted dispatch board |
| `/dashboard/jobs` | Job list and job detail management |
| `/dashboard/engineers` | Engineer roster and availability |
| `/dashboard/customers` | Customer directory and value history |
| `/dashboard/invoices` | Invoice management |
| `/dashboard/reports` | Revenue and operational reports |
| `/dashboard/settings` | White-label and Google Business Profile settings |
| `/engineer` | Mobile engineer queue and live job controls |

## Testing Safepay

Safepay is intentionally locked to sandbox mode because the current demo
invoice source is browser state. Visit `/track/TW-48197`, find invoice
`TW-INV-1042` and select **Pay now**. Safepay's successful sandbox card is:

```text
Card number: 4111 1111 1111 1111
Expiry: any future date
CVV: 123
```

The backend creates the tracker, redirects to Safepay, verifies Safepay's
signed callback and then marks the local invoice paid. Sandbox transactions do
not move real money. A live gateway must validate invoice ownership and amount
against authenticated server-side database records before checkout creation.

## Testing live tracking

1. Open an assigned job in `/engineer`.
2. Select **Start live GPS sharing** and allow browser location permission.
3. Open the matching `/track/[reference]` page in another tab.
4. Engineer position, ETA, status and chat updates synchronise between tabs.

Geolocation normally requires HTTPS in production; browsers allow it on
`localhost` for development.

## Google Business Profile booking

The white-label settings page generates a tagged booking URL. Add it to the
business profile's booking/action link. Supported query parameters include:

```text
/booking?source=gmb&service=plumbing&postcode=SW1A%201AA&lat=51.501&lng=-0.142
```

The booking page records the source and pre-fills supplied location details.

## Data and production readiness

The current interface persists operational state to browser `localStorage` and
synchronises same-device tabs. The configured Supabase project contains
normalised tables for companies, profiles, customers, engineers, jobs, status
events, messages, photos, ratings, invoices and invoice lines. Production use
still requires wiring those tables to Supabase Auth sessions and their existing
Row Level Security policies.

Before production deployment:

1. Replace demo authentication with Supabase Auth for owners, engineers and
   customers.
2. Persist all jobs, messages, GPS positions, files, ratings and invoices in
   Supabase and enable Realtime on the required tables.
3. Store photos in a private Supabase Storage bucket using signed URLs.
4. Validate checkout amount and ownership from database invoice records.
5. Configure a verified Resend sending domain and production email recipients.
6. Set production hostnames and restrict MapTiler origins.
7. Replace Safepay if the operating UK business requires a UK-supported live
   gateway such as Stripe.
8. Add monitoring, rate limiting, audit logging, backups and privacy/retention
   policies suitable for UK GDPR.

## Commands

```bash
npm run dev          # development server
npm run build        # production build
npm run start        # serve the production build
npm run typecheck    # TypeScript validation
npm run lint         # ESLint validation
npm test -- --run    # run Vitest once
npm run test:watch   # Vitest watch mode
npm run test:e2e     # Playwright end-to-end tests
npm run format       # format source files
```

## Security notes

- Never expose `SAFEPAY_V1_SECRET`, `RESEND_API_KEY` or
  `SUPABASE_SERVICE_ROLE_KEY` to client code.
- Never commit `.env`.
- Safepay callback signatures are verified with a timing-safe comparison.
- Server routes validate request bodies with Zod.
- Demo credentials and browser persistence are not substitutes for production
  authentication and authorisation.
