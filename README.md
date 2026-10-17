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

## Daten
Alles wird lokal im Browser gespeichert (localStorage, Schlüssel `hopfenmatch.v1`).
Profil → „Beispieldaten zurücksetzen“ stellt den Ausgangszustand wieder her.
Martins Aktionen (Live-Punkte, Zusagen, Likes) werden simuliert.

URL-Parameter: `?frame=0` (ohne Rahmen), `?frame=1` (Rahmen erzwingen), `?nosw` (ohne Service Worker).
