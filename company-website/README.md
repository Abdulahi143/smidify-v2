# Smidify company website

The homepage preserves the original Smidify design. `/admin` provides a protected content editor for website wording, project case studies, and milestones.

## Editing

Sign in to `/admin` with an approved administrator account. Save draft stores work without changing the website. Preview draft saves and opens `/preview`. Publish changes copies the reviewed draft to the live homepage. Add, remove, or reorder projects and milestones in their respective tabs. Project images use HTTPS image URLs.

Drafts and published content live in Cloudflare D1, not browser storage. The initial content comes from `lib/default-content.json`. The template in `lib/site-template.ts` keeps the existing design; editable text is escaped before rendering. Simultaneous edits use revision checks to prevent silent overwrites.

## Access

Sites provides ChatGPT sign-in and trusted identity headers. The server-only `ADMIN_EMAILS` environment setting lists approved administrator emails, separated by commas. All draft, preview, save, and publish endpoints independently enforce this allowlist. Publishing and saving also require a same-origin request. No default password or public registration is provided. Site audience is managed separately by Sites.

## Local development

Use Node 22.13 or newer and the Sites dependency installer. Set `ADMIN_EMAILS=seedy@sites.test` in ignored `.dev.vars` for the starter's local mock identity. Production uses the separately configured Sites environment setting.

Generate schema migrations with `npm run db:generate`. Build with the Sites build helper, then apply pending SQL locally using the D1 commands documented by the Sites starter. `npm run dev -- --hostname 127.0.0.1 --port 5173` serves the editable preview.

`npx tsc --noEmit` checks types. `scripts/check-admin.mjs` tests admin authorization, validation, revision conflicts, draft isolation, safe HTML rendering, and publish behavior against a local production preview on port 5174. Launch it with `npm start -- --port 5174 --var ADMIN_EMAILS:seedy@sites.test` after local migrations. The script modifies and restores only the local database. Never direct test identity headers at a hosted site.

Deploy through the Sites source workflow, using the existing project ID and D1 migration files. Ignore local credentials, `.dev.vars`, `.sites-runtime`, and `.wrangler` state. The original static design is retained in `website-source/original.html` for reference.
