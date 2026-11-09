# Smidify

Marketing site, blog, project portfolio and admin panel. Next.js (App Router, Cache Components), Tailwind v4, Supabase (Postgres, Auth, Storage), Zod.

## Setup

```bash
pnpm install
cp .env.local.example .env.local   # then fill in the values below
supabase start                      # local stack (optional)
supabase db reset                   # applies supabase/migrations + seed.sql
pnpm dev
```

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. Also drives `images.remotePatterns` in `next.config.ts`, so Storage images work with `next/image`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key. Public reads and admin session calls; RLS enforces access. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only. Never import it in client code. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (sitemap, RSS, Open Graph). |

## Scripts

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm typecheck`, `pnpm lint`
- `pnpm db:types` regenerates `src/lib/types/database.ts` from the local database

## Admin

Routes under `/admin` require a Supabase Auth user listed in the `admins` table.

**Add an admin**

1. Create the user: Supabase dashboard → Authentication → Users → Add user (email + password).
2. Grant access in the SQL editor:

   ```sql
   insert into admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

3. Sign in at `/admin/login`.

Editors autosave drafts 10 seconds after a change. Published items are never autosaved: use **Save changes** or **Update**. Publishing sets `published_at` once, and the public pages refresh on the next request (cache tags plus `revalidatePath`). Preview opens `/admin/preview/{projects|posts}/{id}`, which renders the same components as the public page from the draft row.

Images upload from the browser to the public `media` bucket (`projects/{id}/…`, `posts/{id}/…`) under the admin's session; alt text is required.

## Deploy (Vercel + Supabase)

1. Create a Supabase project, then `supabase link --project-ref <ref>` and `supabase db push` (applies both migrations; run `supabase db push` before first deploy, since the code expects `cover_alt` / `gallery_alts`).
2. Optionally seed: run `supabase/seed.sql` in the SQL editor.
3. Import the repo in Vercel and set the four environment variables above (Production and Preview).
4. Add the first admin (see above) and set Supabase Auth → URL Configuration → Site URL to the Vercel domain.
5. The Storage host is allowed automatically because `next.config.ts` builds `images.remotePatterns` from `NEXT_PUBLIC_SUPABASE_URL`.
