# HopfenMatch-Server (Supabase Edge Function `hopfenmatch`)

Läuft im bestehenden Supabase-Projekt (Ref `wlujgkbtpjxuekwsgnmg`) neben Galaxy Empire, mit eigenen Tabellen
`hm_item`, `hm_session`, `hm_meta` (RLS an, keine Policies → nur die Function/Service-Role hat Zugriff).
Die Galaxy-Empire-Function `ge` und die `ge_*`-Tabellen werden nicht angefasst.

URL: https://wlujgkbtpjxuekwsgnmg.supabase.co/functions/v1/hopfenmatch

| Route | Zweck |
|---|---|
| `POST /register` `{name, pass, avatar?}` | neues Konto (Name eindeutig), liefert Token |
| `POST /login` `{name, pass}` | prüft Passwort (PBKDF2) serverseitig, Rate-Limit, liefert Token |
| `POST /logout` | Sitzung beenden |
| `POST /account` `{action: rename/password/avatar/delete}` | Konto verwalten |
| `POST /friend` `{action: search/request/accept/decline/cancel/remove}` | Freunde |
| `GET /avatar/:id` | Profilbild (öffentlich) |
| `POST /sync` `{since, items, epoch}` | sendet eigene Änderungen, liefert die für den Nutzer sichtbaren Änderungen seit `since` + Freundesliste (`dir`) |
| `POST /seed` | entfernt (v1.3: keine Startdaten mehr, Antwort 410) |
| `GET /health` | Lebenszeichen |

Besitzregeln: Bewertungen, Check-ins, Likes, Favoriten und Tasting-Punkte darf nur der jeweilige Nutzer schreiben.

Deploy: `supabase functions deploy hopfenmatch --project-ref wlujgkbtpjxuekwsgnmg --no-verify-jwt --use-api`
Schema: `schema.sql` (über `node q.js schema.sql`, braucht `SUPABASE_ACCESS_TOKEN`).
Alles auf null setzen (löscht alle HopfenMatch-Daten!): `./reset.sh` – leert `hm_item`, zählt die Daten-Epoche (`hm_meta.epoch`) hoch und legt **keine** Startdaten an. Geräte mit älterer Epoche verwerfen beim nächsten Sync ihren Zwischenspeicher und laden neu; ihre alten Einträge werden vom Server abgelehnt.

v1.6: Schema-Erweiterung `schema_v16.sql` (rein additiv). Testkonten entfernen: `node cleanup_test.js`. Backup: `node backup.js`.
**`reset.sh` nicht mehr verwenden** – es löscht alle echten Bewertungen.
