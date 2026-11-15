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

| Variable                        | Purpose                                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL. Also drives `images.remotePatterns` in `next.config.ts`, so Storage images work with `next/image`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key. Public reads and admin session calls; RLS enforces access.                                                     |
| `NEXT_PUBLIC_SITE_URL`          | Canonical URL (sitemap, RSS, Open Graph).                                                                                |

## Scripts

- `pnpm dev` / `pnpm build` / `pnpm start`
- Production builds use the supported Webpack builder (`next build --webpack`) with Tailwind’s PostCSS plugin.
- `pnpm typecheck`, `pnpm lint`, `npm run test:studio`
- `pnpm db:types` regenerates `src/lib/types/database.ts` from the local database

## Admin Studio

Studio is at `/admin`. It includes the overview, project and post editors, website
copy and milestones, services, client pipeline, quote inbox, media library, and Settings. It uses the same
Supabase Auth admin accounts and RLS policies as the existing app.

The website editor, authenticated draft preview, and live homepage share the
current homepage renderer. Publishing website content updates its copy, navigation,
footer, metadata, team captions, and optional milestones. The service editor updates
the separate services page. Existing website documents gain newly added fields from
the current defaults while retaining their saved values.

For a local design review without signing in, run `npm run dev:studio` and open
`http://localhost:3000/admin`. This opt-in mode runs only in development on loopback
hosts and displays fictional sample records. You can navigate the dashboard and
editors; saving, publishing, uploads and inbox/pipeline mutations are disabled.
Public pages use empty states in this mode; fictional records stay inside Studio.
It never grants access to the real admin database client, even when Supabase is
configured. Production ignores the preview flag and still requires admin sign-in.
Use `npm run dev` for the normal authenticated flow.

Without both Supabase environment variables, `/admin` redirects to a setup message
at `/admin/login`. No admin authentication is bypassed and no fake writes are made.
Apply **all four migrations**, including `0004_company_content.sql`, before using
the website editor.

Routes under `/admin` require a Supabase Auth user listed in the `admins` table.

**Add an admin**

1. Create the user: Supabase dashboard → Authentication → Users → Add user (email + password).
2. Grant access in the SQL editor:

   ```sql
   insert into admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

3. Sign in at `/admin/login`.

Editors autosave drafts 10 seconds after a change. Published items are never autosaved: use **Save changes** or **Update**. Publishing sets `published_at` once, and the public pages refresh on the next request (cache tags plus `revalidatePath`). Preview opens `/admin/preview/{projects|posts}/{id}`, which renders the same components as the public page from the saved row. Draft edits are saved before opening preview; previewing unsaved published content shows the last saved version with a notice, and does not publish those edits.

Images upload from the browser to the public `media` bucket (`projects/{id}/…`, `posts/{id}/…`) under the admin's session; alt text is required.

## Deploy (Vercel + Supabase)

1. Create a Supabase project, then `supabase link --project-ref <ref>` and `supabase db push` (applies all three migrations, including media alt text and quote phone numbers).
2. Optionally seed: run `supabase/seed.sql` in the SQL editor.
3. Import the repo in Vercel and set the three environment variables above (Production and Preview).
4. Add the first admin (see above) and set Supabase Auth → URL Configuration → Site URL to the Vercel domain.
5. The Storage host is allowed automatically because `next.config.ts` builds `images.remotePatterns` from `NEXT_PUBLIC_SUPABASE_URL`.

## Studio workflows

- **Projects and posts:** create, search, filter, save drafts, upload or reuse media, preview, publish, and delete with confirmation.
- **Website:** edit the current homepage copy, navigation, team captions, metadata and milestones through a versioned draft, then publish.
- **Settings:** update contact email, SEO title/description and footer tagline through that same website draft; change the signed-in admin’s password; inspect connection status. Publishing settings also publishes any other saved website draft changes. Revision checks prevent overwriting edits from another session.
- **Services:** add, update, order and delete services. These changes affect the public services page immediately.
- **Pipeline:** add, edit, delete and move client/project items across stages using drag handles or the stage selector. Quote requests can be converted into ideas.
- **Media:** browse bucket folders, upload images, copy URLs and choose existing assets from content editors. Delete only images that are not referenced by a project or post. Removing an image from a content field does not delete the underlying shared asset.

No additional migration is needed for Settings, Media or the new service/pipeline controls; apply the four existing migrations. Live Auth, Storage permissions and database writes still need verification against the intended Supabase project. Local preview checks exercise fictional records and keep real writes disabled.

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
