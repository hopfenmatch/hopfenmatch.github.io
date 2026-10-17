# HopfenMatch – Gute Biere. Gute Leute.

Reine Web-App (HTML/CSS/JS, ohne Build-Tools), im iPhone-Stil, Hochformat.

## Starten
- Lokal: `index.html` im Browser öffnen (funktioniert auch per Doppelklick), oder
  `python3 -m http.server 8000` in diesem Ordner → http://localhost:8000
- Am Desktop erscheint die App in einem iPhone-Rahmen, am Handy im Vollbild.
- iPhone: Seite in Safari öffnen → Teilen → „Zum Home-Bildschirm“ → startet wie eine App (ohne Safari-Leiste).

## Hosting (wie Galaxy Empire)
Inhalt dieses Ordners in ein GitHub-Repo legen und GitHub Pages (Branch main, Ordner /) aktivieren.
Nach Änderungen an JS/CSS in `sw.js` die Versionsnummer `CACHE='hopfenmatch-v1'` erhöhen,
damit installierte Apps die neuen Dateien laden.

## Anmeldung & Sync
Beim Start wählt man Sascha oder Martin, Passwort für beide: BIER (wird serverseitig geprüft).
Bewertungen, Aktivitäten/Likes, Mitteilungen und Tastings inkl. Live-Bewertung werden über den
HopfenMatch-Server (Supabase Edge Function, siehe `server/`) zwischen beiden Handys geteilt
(Polling alle 10 s, im Live-Tasting alle 3 s). Offline wird lokal weitergearbeitet, Änderungen
werden automatisch nachgesendet. Profil → „Abmelden“ führt zurück zur Profilauswahl.
`?nosync` startet die App rein lokal ohne Server.

URL-Parameter: `?frame=0` (ohne Rahmen), `?frame=1` (Rahmen erzwingen), `?nosw` (ohne Service Worker).
