# Deploy StayPro to Vercel

1. Push this project to a Git repository and import it in Vercel.
2. Keep the detected framework as **Vite**. `vercel.json` already defines the
   build, output directory, API function, and SPA rewrites.
3. In **Project Settings -> Environment Variables**, add:

   - `VITE_SUPABASE_URL`
   - VITE_SUPABASE_ANON_KEY
   - SAFEPAY_ENVIRONMENT (sandbox first, then production)
   - SAFEPAY_API_KEY
   - SAFEPAY_SECRET_KEY
   - SAFEPAY_WEBHOOK_SECRET
   - APP_URL (your deployed Vercel URL)

4. Deploy, then verify these URLs:

   - `/`
   - `/hotels-explore`
   - `/rooms-explore`
   - `/login`
   - `/api/health`

## Data persistence warning

The current Express compatibility API uses `server/data.json` locally. On
Vercel it uses temporary `/tmp` storage so requests do not fail with a
read-only-filesystem error, but serverless instances may reset that data.
Production bookings, users, reviews, payments, and hotel edits must use
Supabase before accepting real customers.

