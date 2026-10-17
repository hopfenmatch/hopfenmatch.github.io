-- HopfenMatch: eigene Tabellen (Präfix hm_), unabhängig von Galaxy Empire (ge_*)
create table if not exists public.hm_item(
  kind text not null,
  id text not null,
  data jsonb,
  del boolean not null default false,
  rev bigint not null,
  by_user text,
  updated_at timestamptz not null default now(),
  primary key(kind,id)
);
create index if not exists hm_item_rev on public.hm_item(rev);
create sequence if not exists public.hm_rev_seq;
create table if not exists public.hm_session(
  token text primary key,
  usr text not null,
  created_at timestamptz not null default now(),
  seen_at timestamptz not null default now()
);
create table if not exists public.hm_meta(k text primary key, v jsonb);
alter table public.hm_item enable row level security;
alter table public.hm_session enable row level security;
alter table public.hm_meta enable row level security;
-- Keine Policies: nur die Edge Function (Service-Role) darf lesen/schreiben.

-- Schreibt Änderungen atomar und vergibt fortlaufende Revisionen (Sperre = lückenlose Reihenfolge für Polling)
create or replace function public.hm_put(p_items jsonb, p_user text) returns bigint
language plpgsql security definer set search_path = public as $$
declare it jsonb; r bigint := 0;
begin
  perform pg_advisory_xact_lock(780420);
  for it in select * from jsonb_array_elements(p_items) loop
    r := nextval('public.hm_rev_seq');
    insert into public.hm_item(kind,id,data,del,rev,by_user,updated_at)
    values (it->>'kind', it->>'id', case when coalesce((it->>'del')::boolean,false) then null else it->'data' end,
            coalesce((it->>'del')::boolean,false), r, p_user, now())
    on conflict (kind,id) do update set data=excluded.data, del=excluded.del, rev=excluded.rev,
            by_user=excluded.by_user, updated_at=now();
  end loop;
  return r;
end $$;
revoke all on function public.hm_put(jsonb,text) from public, anon, authenticated;
grant execute on function public.hm_put(jsonb,text) to service_role;
-- Lesend: höchste sichtbare Revision
create or replace function public.hm_rev() returns bigint language sql security definer set search_path = public as $$ select coalesce(max(rev),0) from public.hm_item $$;
revoke all on function public.hm_rev() from public, anon, authenticated;
grant execute on function public.hm_rev() to service_role;
