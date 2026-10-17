-- v1.6 (Konten & Freunde) – rein additiv: bestehende hm_item/hm_session/hm_meta bleiben unverändert
create table if not exists public.hm_user(
  id text primary key,                 -- stabile Nutzer-ID (sascha, martin, u…); steckt in Bewertungs-IDs
  name text not null,                  -- Anzeigename (änderbar)
  name_lc text not null unique,        -- eindeutig ohne Groß-/Kleinschreibung
  pass_hash text not null,             -- PBKDF2-SHA256 (hex)
  salt text not null,                  -- zufällig je Konto (hex)
  iter int not null,
  ci boolean not null default false,   -- true = Passwort ohne Groß-/Kleinschreibung (Alt-Konten mit BIER)
  avatar text,                         -- JPEG base64 (clientseitig verkleinert), optional
  av int not null default 0,           -- Bild-Version (0 = kein eigenes Bild)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.hm_friend(
  a text not null, b text not null,    -- a < b
  status text not null check (status in ('pending','accepted')),
  req text not null,                   -- wer angefragt hat
  created_at timestamptz not null default now(),
  primary key(a,b)
);
create index if not exists hm_friend_b on public.hm_friend(b);
create table if not exists public.hm_fail(k text primary key, n int not null, t timestamptz not null);
alter table public.hm_user enable row level security;
alter table public.hm_friend enable row level security;
alter table public.hm_fail enable row level security;
