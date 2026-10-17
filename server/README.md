# HopfenMatch-Server (Supabase Edge Function `hopfenmatch`)

Läuft im bestehenden Supabase-Projekt (Ref `wlujgkbtpjxuekwsgnmg`) neben Galaxy Empire, mit eigenen Tabellen
`hm_item`, `hm_session`, `hm_meta` (RLS an, keine Policies → nur die Function/Service-Role hat Zugriff).
Die Galaxy-Empire-Function `ge` und die `ge_*`-Tabellen werden nicht angefasst.

URL: https://wlujgkbtpjxuekwsgnmg.supabase.co/functions/v1/hopfenmatch

| Route | Zweck |
|---|---|
| `POST /login` `{user, pass}` | prüft Passwort (BIER, Groß-/Kleinschreibung egal) serverseitig, liefert Token |
| `POST /sync` `{since, items}` | sendet eigene Änderungen, liefert alle Änderungen seit Revision `since` |
| `POST /seed` | einmaliger Startbestand (nur wenn noch nichts angelegt ist) |
| `GET /health` | Lebenszeichen |

Besitzregeln: Bewertungen, Check-ins, Likes, Favoriten und Tasting-Punkte darf nur der jeweilige Nutzer schreiben.

Deploy: `supabase functions deploy hopfenmatch --project-ref wlujgkbtpjxuekwsgnmg --no-verify-jwt --use-api`
Schema: `schema.sql` (über `node q.js schema.sql`, braucht `SUPABASE_ACCESS_TOKEN`).
Startbestand zurücksetzen (löscht alle HopfenMatch-Daten!): `./reset.sh`
