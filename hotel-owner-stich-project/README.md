# StayPro Hotel Partner Platform

A full-stack React and Express implementation of the supplied hotel onboarding mockups.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs on port `4000` and persists data in `server/data.json` (created automatically on first run).

## Default accounts

| Role / state | Email | Password |
| --- | --- | --- |
| Administrator | `admin@staypro.com` | `admin123` |
| Approved owner | `maya@heritage.pk` | `owner123` |
| Pending owner | `sarah@grandhorizon.com` | `owner123` |
| Information requested owner | `amir@oceanview.com` | `owner123` |

Owner accounts created by an administrator also start with `owner123` and are flagged to change it.

## Main routes

- `/register` — four-step owner registration
- `/admin` — approval queue
- `/hotels` — hotel status management
- `/dashboard` — owner overview
- `/rooms`, `/bookings`, `/reviews`, `/analytics`, `/settings` — operating tools

For a production deployment, replace JSON persistence with PostgreSQL/Supabase and add a real identity provider. The API boundaries are already separated for that migration.
