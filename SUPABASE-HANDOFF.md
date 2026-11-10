# Smidify — Supabase handoff

The public design, video, branding and team photos are local assets and do not need a database migration. No Supabase project has been connected or changed during the design work.

## Connect

1. Copy `.env.local.example` to `.env.local`. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the intended Supabase project. Set `NEXT_PUBLIC_SITE_URL` to the deployment domain. The current app uses the public anon key with row-level security; no service-role key is required by the current code.
2. Link the intended project with the Supabase CLI and run `supabase db push`. Apply all three migrations in order: `0001_init.sql`, `0002_media_alt.sql`, `0003_quote_phone.sql`. These include tables, admin policies, the public `media` bucket and its upload policies. Do not reset a remote database.
3. Add services content. `supabase/seed.sql` contains example services, fictional projects/posts and pipeline records; review it before use. Do not present its fictional customers or results as real work. For production, enter the approved content instead.
4. Create each admin in Supabase Auth, then insert their user ID into `public.admins` as described in README. Configure the Auth site URL and allowed redirect URLs for the actual deployment.
5. Restart the local app after changing environment variables. Set the same variables on the hosting service and rebuild for deployment. The image hostname allowlist is derived from the Supabase URL.

## Content switch

When either public Supabase variable is absent, project and blog queries use `src/lib/content/samples.ts`. Both configured variables switch these queries to the database. Configured database failures reach the error boundary; they do not silently fall back to demonstration content. Empty database tables will show empty states. Services have local fallback content only while no database is configured.

The homepage shows email contact while unconfigured and the existing quote form when configured. The form inserts into `quote_requests`; it does not send email notifications. Arrange notifications separately if needed.

Image fields contain storage paths relative to the `media` bucket, e.g. `projects/<id>/cover.jpg`, not full URLs. Uploads require an authenticated admin. Project and post images need meaningful alt text. The published content queries require `status = 'published'`.

Team portraits are in `public/team/`; the hero video and poster are in `public/media/`. Names and roles are currently edited in `src/app/(site)/page.tsx`. Header/footer branding is in `public/brand/`. These are independent of Supabase.

## Verify after connection

- Public pages load with the configured services, projects and posts; drafts stay hidden.
- Work filters and blog categories select the correct published records; detail links, next-project navigation and article images work.
- An admin can sign in at `/admin/login`, save a draft, upload an image, preview it and publish it. An ordinary authenticated user cannot read or edit admin content.
- Submit one clearly labelled test quote. Confirm its email, phone and message arrive in `quote_requests`, and the form shows success. Check invalid input and failure handling.
- Confirm the public media URLs load anonymously and unauthorized uploads are refused.
- Confirm sitemap and blog RSS URLs use the actual `NEXT_PUBLIC_SITE_URL`.
- Run `pnpm typecheck`, `pnpm lint`, and `pnpm build` after configuring the environment. Recheck mobile navigation, video playback and the contact form on the deployed site.

These integration checks require the real project and remain for the connecting developer. The design review does not verify live database permissions, Auth, delivery of quotes or production deployment.

## Final local verification — 5 November 2026

- Public route review: all 13 index/detail pages rendered, with no broken loaded images or empty link destinations found.
- Responsive review completed at 320, 390, 768, 1024, 1440 and 1920px during the design pass; menu, filters, branding, footer and team captions reviewed.
- ESLint and TypeScript checks pass.
- Production build verified: `pnpm build` succeeds and generates all 35 pages. The build uses Next.js Webpack with the standard Tailwind PostCSS integration, avoiding the Turbopack CSS-worker failure. The configured site URL now supplies `metadataBase` for sharing images.
- Production server verified with `next start -p 3001`: all 13 public index/detail pages render, Tailwind styles load, the hero video plays muted and the 390px layout has no horizontal overflow.
- The existing Google font is self-hosted by Next.js at build time; the build environment needs network access to fetch it when it is not cached.
- Live Auth, RLS, Storage and quote submission remain untested until Supabase is configured.
