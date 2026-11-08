# § Ordinance

**Livingston permits, in plain English.** An unofficial, student-built helper for Livingston, NJ permits and zoning.
Type what you want to do ("put up a 6-foot fence") and Ordinance tells you if you likely need a permit, which rules
apply (with links to the exact section on eCode360), what you'll need, and who to contact.

> Unofficial student project. Not affiliated with Livingston Township. Always confirm with the Construction or Zoning office before you build.

<!-- Add screenshots here: docs/home.png, docs/ask.png, docs/staff.png -->

## Features
- **Ask** – plain-English answers that cite every rule. Says "I don't know" instead of guessing.
- **Pre-checker** – checklist (✅ OK / ⚠️ might be a problem / ❓ needs info), PDF download, shareable link.
- **Staff dashboard** – most-asked questions, top code sections, unanswered questions, chart. Locked with Clerk.
- **Feedback** – 👍 / 👎 on every answer.

## Tech stack
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Claude API (Haiku by default) · Postgres (Neon) · Clerk · Vercel

## Run it on your computer
```bash
npm install
cp .env.local.example .env.local   # then fill in the keys you have
npm run dev                        # open http://localhost:3000
```
Everything is optional at first: without keys the app still runs in demo mode.

| What | Env var | Free? |
|---|---|---|
| AI answers | `ANTHROPIC_API_KEY` | Pay per use (cheap with Haiku). Set a spending limit. |
| Database | `DATABASE_URL` | Neon free tier. Then run `npm run db:setup` once. |
| Staff login | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `STAFF_EMAILS` | Clerk free tier |

## Adding code sections
Copy text **by hand** from https://ecode360.com/LI1238 into a file in `data/code-sections/`. See the README there.

## Testing
With the app running: `npm run test:answers` asks 20 normal + 5 "unknown" questions and checks that every citation
is a section you actually pasted in, and that unknown questions get "I don't know".
