-- Smidify initial schema: content, quotes, pipeline, admins, RLS, storage.

create type content_status as enum ('draft','in_review','published');
create type project_kind as enum ('website','mobile','network','ai');
create type pipeline_stage as enum ('idea','discovery','design','build','test','launch','care');

create table services (
  id uuid primary key default gen_random_uuid(),
  num text not null, title text not null, body text not null,
  items text[] not null default '{}', sort int not null default 0
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, title text not null, summary text not null,
  kinds project_kind[] not null default '{}',
  client text, timeline text, year int,
  cover_path text, gallery_paths text[] default '{}',
  problem text, solution text, result text,
  quote text, quote_author text,
  featured boolean not null default false,
  status content_status not null default 'draft',
  published_at timestamptz, created_at timestamptz default now(), updated_at timestamptz default now()
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, title text not null, excerpt text not null,
  body_md text not null default '', category text not null,
  cover_path text, featured boolean not null default false,
  status content_status not null default 'draft',
  published_at timestamptz, created_at timestamptz default now(), updated_at timestamptz default now()
);

create table quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text, email text not null, company text, kind text, message text,
  handled boolean not null default false, created_at timestamptz default now()
);

create table pipeline_items (
  id uuid primary key default gen_random_uuid(),
  name text not null, kind text not null, stage pipeline_stage not null default 'idea',
  due_note text, quote_request_id uuid references quote_requests(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  sort int not null default 0, created_at timestamptz default now(), updated_at timestamptz default now()
);

create table admins (user_id uuid primary key references auth.users(id) on delete cascade);

-- Runs as definer so policies can read admins (which has no public policy).
create function is_admin() returns boolean language sql stable security definer set search_path = '' as
$$ select exists(select 1 from public.admins where user_id = (select auth.uid())) $$;

revoke execute on function is_admin() from public;
grant execute on function is_admin() to anon, authenticated;

-- Indexes for foreign keys and common listing filters.
create index pipeline_items_quote_request_id_idx on pipeline_items (quote_request_id);
create index pipeline_items_project_id_idx on pipeline_items (project_id);
create index projects_published_idx on projects (published_at desc) where status = 'published';
create index posts_published_idx on posts (published_at desc) where status = 'published';

-- updated_at trigger
create function set_updated_at() returns trigger language plpgsql set search_path = '' as
$$ begin new.updated_at = now(); return new; end $$;

create trigger projects_set_updated_at before update on projects
  for each row execute function set_updated_at();
create trigger posts_set_updated_at before update on posts
  for each row execute function set_updated_at();
create trigger pipeline_items_set_updated_at before update on pipeline_items
  for each row execute function set_updated_at();

-- Row level security
alter table services enable row level security;
alter table projects enable row level security;
alter table posts enable row level security;
alter table quote_requests enable row level security;
alter table pipeline_items enable row level security;
alter table admins enable row level security;

-- services: public select; admin all
create policy "services public read" on services for select to anon, authenticated
  using (true);
create policy "services admin all" on services for all to authenticated
  using ((select is_admin())) with check ((select is_admin()));

-- projects: public select published; admin all
create policy "projects public read" on projects for select to anon, authenticated
  using (status = 'published');
create policy "projects admin all" on projects for all to authenticated
  using ((select is_admin())) with check ((select is_admin()));

-- posts: public select published; admin all
create policy "posts public read" on posts for select to anon, authenticated
  using (status = 'published');
create policy "posts admin all" on posts for all to authenticated
  using ((select is_admin())) with check ((select is_admin()));

-- quote_requests: public insert only; admin select/update/delete
create policy "quote_requests public insert" on quote_requests for insert to anon, authenticated
  with check (true);
create policy "quote_requests admin select" on quote_requests for select to authenticated
  using ((select is_admin()));
create policy "quote_requests admin update" on quote_requests for update to authenticated
  using ((select is_admin())) with check ((select is_admin()));
create policy "quote_requests admin delete" on quote_requests for delete to authenticated
  using ((select is_admin()));

-- pipeline_items, admins: admin only
create policy "pipeline_items admin all" on pipeline_items for all to authenticated
  using ((select is_admin())) with check ((select is_admin()));
create policy "admins admin all" on admins for all to authenticated
  using ((select is_admin())) with check ((select is_admin()));

-- Storage: public-read `media` bucket, admin write.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media public read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');
create policy "media admin insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "media admin update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "media admin delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
