# Sweet Life Café — Website (v2)

Website for Sweet Life Café, a family-run café in Newry, Northern Ireland. Menu
display, sushi pre-ordering, blog, contact and booking enquiries. A rebuild of the
previous Vite/React site on Next.js, with ordering handled by external Revolut
Checkout links and transactional email via Resend.

See `.planning/PROJECT.md` for the full product context and decisions.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion
- **Content:** Markdown menu/blog data (`gray-matter` + `marked`)
- **Email:** Resend (contact form + sushi pre-order notifications)
- **Ordering / payments:** Revolut Checkout (external links — no on-site payment)
- **Hosting:** Vercel

## Prerequisites

- Node.js 20+ (Next.js 16 requires Node 18.18+; 20 LTS recommended)
- npm (this repo is pinned to npm via `package-lock.json`)

## Quickstart

```bash
npm install
cp .env.example .env.local   # then fill in RESEND_API_KEY (optional for local UI work)
npm run dev                  # http://localhost:3000
```

The app runs without any environment variables — the contact and sushi-order API
routes initialise Resend lazily and simply skip sending (logging a warning) when
`RESEND_API_KEY` is not set. Set the key when you want the enquiry emails to
actually send.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build (after `npm run build`) |
| `npm run lint` | ESLint |
| `npm run test` | Run the test suite once (Vitest) |
| `npm run test:watch` | Vitest in watch mode |

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values you need. See
`.env.example` for the annotated list. The only variable the app reads is:

- `RESEND_API_KEY` — Resend API key used to send contact-form and sushi pre-order
  notification emails. Optional locally; required in production for enquiries to
  arrive.

The contact and order notification recipient (`info@sweetlife.cafe`) and sender
addresses are set in code (`src/app/api/contact/route.ts`,
`src/app/api/sushi-order/route.ts`), not via environment variables.

## Deployment

Deploys to Vercel. Set `RESEND_API_KEY` in the Vercel project's Environment
Variables, then push to the deployment branch (or run `vercel --prod`). The Resend
sending domain (`sweetlife.cafe`) must be verified in the Resend dashboard for
production email to deliver.
