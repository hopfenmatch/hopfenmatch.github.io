#!/bin/bash
# Setzt NUR die HopfenMatch-Tabellen auf den Startbestand zurück (Galaxy Empire unberührt)
cd "$(dirname "$0")"
node q.js "truncate public.hm_item; delete from public.hm_meta where k='seeded'; delete from public.hm_session;" && node seed.js
