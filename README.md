This is a Next.js admin CMS for a fitness app. Tech: Next.js App Router, TypeScript, Tailwind CSS, Ant Design v5, Supabase.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Getting started

- Add environment variables in `.env.local`:
  - `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`)
  - `SUPABASE_SERVICE_ROLE_KEY` (preferred for admin APIs)
  - Optional fallback: `SUPABASE_ANON_KEY` (works only if RLS allows)
  - `NEXT_PUBLIC_APP_URL`
  - Optional: `ADMIN_EMAILS` comma-separated list to restrict access
- Install deps: `npm install`
- Run: `npm run dev`

Auth

- Login at `/login` using Supabase email/password
- Middleware protects app and API; API routes also verify admin
- Note: Using `SUPABASE_ANON_KEY` instead of `SUPABASE_SERVICE_ROLE_KEY` may fail for admin CRUD if RLS blocks those operations.

Implemented

- Supabase admin client
- Auth routes (login/logout) and cookies
- Middleware protection
- Dashboard layout with sidebar
- Dashboard stats (users, workouts, meals, active today)
- Users management (list/search/paginate/create/edit/delete/bulk delete)

Next

- Implement remaining entities (workout/relax/meal/nutrition/habits/sessions/messages)
- Add JSON editor for meal plans
- Add charts to Dashboard

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
