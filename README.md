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
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (sitemap, RSS, Open Graph). |

## Scripts

- `pnpm dev` / `pnpm build` / `pnpm start`
- Production builds use the supported Webpack builder (`next build --webpack`) with Tailwind’s PostCSS plugin.
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

1. Create a Supabase project, then `supabase link --project-ref <ref>` and `supabase db push` (applies all three migrations, including media alt text and quote phone numbers).
2. Optionally seed: run `supabase/seed.sql` in the SQL editor.
3. Import the repo in Vercel and set the three environment variables above (Production and Preview).
4. Add the first admin (see above) and set Supabase Auth → URL Configuration → Site URL to the Vercel domain.
5. The Storage host is allowed automatically because `next.config.ts` builds `images.remotePatterns` from `NEXT_PUBLIC_SUPABASE_URL`.

## Design preview content

When either public Supabase environment variable is missing, the public project and
blog queries use fictional content from `src/lib/content/samples.ts`, with local
illustrations in `public/samples/`. The public design has no preview banner; these are demonstration records, not real client work.
Project details, next-project navigation, blog articles, categories and work filters
all use the same sample records. Once both public Supabase variables are configured,
these queries read the database instead; database errors are not replaced with sample
content. No sample records are written to Supabase.


## Supabase handoff

See [SUPABASE-HANDOFF.md](SUPABASE-HANDOFF.md) for the connection steps and acceptance checks. The public design works without Supabase. Admin access, storage uploads and quote submissions need a configured project.
