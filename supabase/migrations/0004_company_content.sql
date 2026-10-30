-- Company copy and milestones use the existing Supabase admin identity.
create table public.company_content (
  id text primary key check (id in ('draft', 'published')),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  revision integer not null default 1 check (revision > 0),
  updated_at timestamptz not null default now()
);
alter table public.company_content enable row level security;
create policy "company published read" on public.company_content for select to anon, authenticated
  using (id = 'published');
create policy "company admin all" on public.company_content for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
grant select on public.company_content to anon;
grant select, insert, update, delete on public.company_content to authenticated;

create function public.save_company_draft(input_content jsonb, expected_revision integer)
returns table(revision integer, updated_at timestamptz)
language plpgsql security invoker set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Admin access required' using errcode = '42501'; end if;
  if expected_revision < 0 or jsonb_typeof(input_content) <> 'object' or octet_length(input_content::text) > 500000 then
    raise exception 'Invalid website content' using errcode = '22023';
  end if;
  if expected_revision > 0 and not exists (select 1 from public.company_content where id = 'draft') then
    raise exception 'Draft changed; reload the editor' using errcode = '40001';
  end if;
  return query
    insert into public.company_content as document (id, content, revision, updated_at)
    values ('draft', input_content, 1, now())
    on conflict (id) do update set content = excluded.content,
      revision = document.revision + 1, updated_at = excluded.updated_at
      where document.revision = expected_revision
    returning document.revision, document.updated_at;
  if not found then raise exception 'Draft changed; reload the editor' using errcode = '40001'; end if;
end;
$$;

create function public.publish_company_content(expected_revision integer)
returns table(revision integer, updated_at timestamptz)
language plpgsql security invoker set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Admin access required' using errcode = '42501'; end if;
  return query
    insert into public.company_content as document (id, content, revision, updated_at)
    select 'published', draft.content, draft.revision, now()
      from public.company_content draft where draft.id = 'draft' and draft.revision = expected_revision
    on conflict (id) do update set content = excluded.content,
      revision = excluded.revision, updated_at = excluded.updated_at
    returning document.revision, document.updated_at;
  if not found then raise exception 'Draft changed; reload the editor before publishing' using errcode = '40001'; end if;
end;
$$;
revoke all on function public.save_company_draft(jsonb, integer) from public;
revoke all on function public.publish_company_content(integer) from public;
grant execute on function public.save_company_draft(jsonb, integer) to authenticated;
grant execute on function public.publish_company_content(integer) to authenticated;
