# HarryShare.vn

Personal brand website + content hub for product thinking, personal branding, AI/vibe coding, career journey, and resources.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend/Auth**: Supabase
- **Deployment**: Vercel

## Project Structure

- `app/`: Main application routes and logic.
- `components/`: Reusable UI components.
- `lib/`: Utility functions, database logic, and site configuration.
- `supabase/`: Database schema, policies, and seed data.

## Main Routes

- `/`: Homepage with featured and latest posts.
- `/ghi-chep`: All blog posts.
- `/chu-de`: Topic clusters.
- `/[categorySlug]/[postSlug]`: Dynamic hierarchical post detail pages.
- `/du-an-tai-nguyen`: Projects, tools, and freebies.
- `/ve-harry`: Personal about page.
- `/lien-he`: Contact form.
- `/login-admin`: Admin login page.
- `/admin`: Admin dashboard and management tools.

## Admin Features

The admin dashboard is protected by Supabase Auth and a custom `profiles.role` check. It includes:
- **Post Management**: Create and edit hierarchical blog posts.
- **Resource Management**: Manage tools, products, and affiliate links.
- **Comment Management**: Moderation and threaded replies.
- **Contact Inquiries**: Review and manage messages from the contact form.

## Setup & Development

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SITE_URL=https://harryshare.vn
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Run locally: `npm run dev`.

## Deployment

Pushes to the `master` branch are automatically deployed to Vercel.
