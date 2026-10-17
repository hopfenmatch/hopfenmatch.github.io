#!/bin/bash
# Setzt NUR die HopfenMatch-Daten auf null (Galaxy Empire unberührt):
# alle Einträge löschen, Daten-Epoche hochzählen (alte Geräte verwerfen ihren Zwischenspeicher), KEINE Startdaten.
# Anmeldungen (hm_session) bleiben erhalten, damit Sascha und Martin angemeldet bleiben.
cd "$(dirname "$0")"
node q.js "begin;
truncate public.hm_item;
delete from public.hm_meta where k='seeded';
insert into public.hm_meta(k,v) values('epoch', jsonb_build_object('n', 2, 't', extract(epoch from now())))
  on conflict (k) do update set v = jsonb_build_object('n', coalesce((public.hm_meta.v->>'n')::int, 1) + 1, 't', extract(epoch from now()));
commit;
select (select count(*) from public.hm_item) as items, (select v from public.hm_meta where k='epoch') as epoch;"
