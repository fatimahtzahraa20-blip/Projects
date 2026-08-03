# Hajj Umrah Tours

Premium, responsive pilgrimage travel website for **HajjUmrahTours.com**.

Built with Next.js, React, TypeScript, Tailwind CSS, reusable UI components and Framer Motion. The website includes around 20 marketing and service pages, an animated homepage, registration flow and an interactive client-dashboard preview.

## Features

- Mobile-first layouts for phones, tablets, laptops and desktops
- Animated homepage wallpaper carousel
- Light and dark themes with saved preference
- Multi-step registration and inquiry form
- Interactive client dashboard
- Itinerary download demonstration
- Document-selection and upload-queue demonstration
- Payment and consultant-message actions
- Responsive navigation, footer and social links
- Route-level metadata, Open Graph and Schema.org data
- Sitemap, robots.txt and canonical URLs
- Accessible focus states and reduced-motion support

## Technology

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI primitives
- Lucide icons

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production verification:

```bash
npm run build
npm start
```

## Important routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage and animated carousel |
| `/about` | Company introduction |
| `/register` | Multi-step registration |
| `/dashboard` | Interactive client portal preview |
| `/luxury-umrah-packages` | Luxury Umrah services |
| `/hajj` | Hajj guidance |
| `/hotels` | Hotel services |
| `/flights` | Flight planning |
| `/transportation` | Private transfers |
| `/ziyarat` | Private Ziyarat |
| `/contact` | Contact information |
| `/policies` | Privacy and travel policies |

## Project structure

```text
app/                 Pages, layout and SEO endpoints
components/          Shared and interactive components
components/ui/       UI primitives
data/                Page content and route definitions
lib/                 Shared utilities
public/images/       Website artwork
```

## Responsive behavior

The interface supports screens from 320px mobile width through large desktops. Navigation becomes a touch-friendly menu, grids collapse into single columns, headings scale by breakpoint, forms remain inside the viewport and dashboard controls work without horizontal page scrolling.

## Production integration required

Registration, dashboard, uploads, messages and payments are currently safe front-end demonstrations. Before accepting live data, connect authentication, encrypted database and document storage, CRM/email delivery, server-side validation and a PCI-compliant payment provider. Never collect card details directly in this application.

Replace demonstration information with verified business contact details, social accounts, licenses and customer reviews before launch.
