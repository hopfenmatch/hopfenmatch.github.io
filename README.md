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
Ab v1.6: Anmelden/Registrieren mit Name + Passwort (siehe unten). Sascha und Martin: Passwort BIER.
Bewertungen, Aktivitäten/Likes, Mitteilungen und Tastings inkl. Live-Bewertung werden über den
HopfenMatch-Server (Supabase Edge Function, siehe `server/`) zwischen beiden Handys geteilt
(Polling alle 10 s, im Live-Tasting alle 3 s). Offline wird lokal weitergearbeitet, Änderungen
werden automatisch nachgesendet. Profil → „Abmelden“ führt zurück zur Profilauswahl.
`?nosync` startet die App rein lokal ohne Server.

URL-Parameter: `?frame=0` (ohne Rahmen), `?frame=1` (Rahmen erzwingen), `?nosw` (ohne Service Worker).

## v1.3: Neustart bei null & großer Bierkatalog
- Alle Bewertungen, Check-ins, Tastings, Mitteilungen, Likes und Favoriten wurden gelöscht; es gibt keine Beispieldaten mehr.
- Daten-Epoche: Client (`DATA_EPOCH`) und Server (`hm_meta.epoch`) – ältere lokale Stände werden verworfen und nicht erneut hochgeladen.
- `js/catalog.js`: über 600 echte Biere (Schwerpunkt Deutschland, dazu AT, CH, CZ, BE, NL, DK, UK/IE, USA, international) als kompakte Rohdaten; die Flaschen werden als SVG im Stil der bisherigen Grafiken gezeichnet.
- Bierkatalog-Seite mit umlaut- und tippfehlertoleranter Suche, Stil- und Länderfiltern; lange Listen werden stückweise (lazy) gerendert.
- Bounce/Gummiband am Listenende in allen Browsern (`js/bounce.js`): WebKit (alle iPhone-Browser, Safari macOS) federt nativ; Android-Chrome, Samsung Internet, Firefox und Desktop-Chrome/Edge/Firefox bekommen eine JS-Federung für Touch und Mausrad/Trackpad, Overscroll-Glow und Pull-to-Refresh sind per `overscroll-behavior` aus. Nie beides gleichzeitig. Test-Override: `?bounce=js|native|off`.

## v1.5: Regionale Biere & Regionen-Filter
- Katalog auf über 1.400 Biere erweitert: +794 Biere von 163 regionalen Brauereien, Schwerpunkt Bayern (Franken mit vielen Bamberger und fränkischen Landbrauereien, Oberpfalz, Niederbayern, Oberbayern, Schwaben/Allgäu) sowie BaWü, Hessen, RLP/Pfalz, Saarland, NRW, Niedersachsen, Schleswig-Holstein, MV, Thüringen, Sachsen, Sachsen-Anhalt, Brandenburg.
- Neu u. a. Brauhaus Leikeim (Altenkunstadt, Bügelflaschen, 18 Sorten) und Familienbrauerei Jacob (Bodenwöhr, 21 Sorten), Sortiment und Alkoholgehalt nach den Brauerei-Websites.
- Etikettfarben der neuen Biere aus Produktfotos abgeleitet; die Flaschen werden wie alle anderen als SVG gezeichnet.
- Regionen-Filter im Katalog (Bundesland, für Bayern zusätzlich Franken, Oberbayern, Niederbayern, Oberpfalz, Schwaben); Suche findet auch Regionen („oberpfalz“) und gängige Schreibweisen („Leikheil“).

## v1.6: Konten, Registrierung & Freunde (neue Adresse https://hopfenmatch.github.io/)
- Startfenster mit „Anmelden“ / „Neu registrieren“; zuletzt auf dem Gerät angemeldete Konten als Schnellwahl.
- Registrierung nur mit Name (eindeutig ohne Groß-/Kleinschreibung, 2–24 Zeichen) + Passwort (mind. 4, doppelt),
  optional Profilfoto (wird im Browser auf 256×256 JPEG verkleinert), sonst Initialen-Avatar in Bierfarben. Keine E-Mail.
- Sascha und Martin sind feste Alt-Konten (Passwort BIER, Groß-/Kleinschreibung egal), schon befreundet; ihre Daten bleiben.
- Profil (Klick aufs eigene Bild): Name, Passwort (altes nötig), Profilbild ändern, Abmelden, Konto löschen.
- Freunde: Suche „Freund finden“ (Teilstring), Anfrage senden/annehmen/ablehnen/zurückziehen, Freund entfernen.
  Matches, Rangliste-Badges, Aktivitäten, Mitteilungen, Likes und Tastings funktionieren mit beliebig vielen Freunden.
- Datenschutz (serverseitig): Bewertungen/Aktivitäten nur für Freunde, Tastings nur für Teilnehmer, Mitteilungen nur für
  den Empfänger. Fremde sehen nur Name + Profilbild.
- Server: Tabellen `hm_user` (PBKDF2-SHA256, 100 000 Iterationen, Salt je Konto), `hm_friend`, `hm_fail` (Rate-Limit),
  Routen `/register`, `/login`, `/logout`, `/account`, `/friend`, `/sync`, `/avatar/:id` – siehe `server/`.
  Die Daten-Epoche bleibt unverändert (keine Datenverluste). Backup: `node server/backup.js`.

## v1.7: Bier · Wein · Whisky
- **Ladebildschirm:** HopfenMatch-Logo, dann rollt eine Flasche quer über den Bildschirm (Etikett dreht mit), weicher Übergang in die App. `?nointro` überspringt ihn.
- **Startseite nach der Anmeldung** (`js/home.js`, Canvas 2D): bildschirmfüllende Nahansicht des Flaschenbauchs. Wischen wechselt Bier → Wein → Whisky (Endlosschleife). Das Morphing von Kontur, Glasfarbe, Lichtreflexen und Etikett folgt dem Finger; beim Loslassen rastet es mit Feder ein. Tipp auf die Flasche oder auf „… entdecken“ öffnet den Bereich. Bei `prefers-reduced-motion` wird überblendet statt gemorpht. Etiketten werden einmal als Bitmap vorgerendert, ein Frame kostet unter 0,1 ms.
- **Wein** (`js/wine.js`, 338 Weine von 211 Erzeugern): Weinart, Rebsorte, Land, Region; deutsche Anbaugebiete (Pfalz, Mosel, Rheinhessen, Franken …) stehen vorn. Generierte Flaschen (Bordeaux, Burgunder, Schlegel, Bocksbeutel, Sekt) mit Glas.
- **Whisky** (`js/whisky.js`, 223 Whiskys von 121 Brennereien): Typ (Single Malt, Bourbon, Blended, Rye, Irish …), Land, Region (Islay, Speyside, Highlands, Kentucky …).
- Jede Kategorie hat eigene Bewertungen, Rangliste, Matches (über 90 bei beiden), Tastings und Aktivitäten. Die Kategorie wechselt man über den Kopf-Umschalter oder die Startseite.
- **Datenmodell:** IDs mit den Präfixen `wn-` und `wk-` (eigene: `wn-c-`, `wk-c-`), Tastings mit dem Feld `kat`. Es gab keine Server- oder Schemaänderung; Bierdaten bleiben unverändert in der Kategorie Bier.
- SW-Cache `hopfenmatch-v8`. Assets werden beim Install an der HTTP-Cache vorbei geladen.

## v1.7.1: Fotorealistische Flaschen
- Startseite: drei Studio-Nahaufnahmen (Bier-Euroflasche mit Kondenstropfen, dunkelgrüne Bordeauxflasche, kantige Kristall-Whiskyflasche). Die HopfenMatch-Fantasieetiketten werden einmalig per Canvas eingebrannt (Druckfarbe mit Multiply, Goldfolie mit Prägung, Zylinderverzerrung). (Bilder in v1.8 ersetzt.)
- Morphing in WebGL (`js/home.js`): Flaschenbreite und Etikettkanten gleiten ineinander, dazu eine weiche Wischkante mit Rauschen, eine leichte Glasverzerrung und ein Softbox-Lichtstreif an der Kante. Der Übergang folgt weiter dem Finger. Fallback ohne WebGL: Canvas-2D-Überblendung; bei reduzierter Bewegung wird überblendet.
- Intro: rollende Foto-Euroflasche (in v1.8 durch das reine Logo-Intro ersetzt).
- SW-Cache `hopfenmatch-v9`, Assets `?v=9`.

## v1.8: 3D-Karussell aus gerenderten Flaschen
- Ladebildschirm nur mit dem HopfenMatch-Logo, elegant ein- und ausgeblendet im dunklen Studio-Look.
- Startseite (`js/home.js`): drei fotorealistische Flaschen (Blender Cycles: Bier-Euroflasche 0,5 l mit Kondenstropfen, Bordeaux in Dunkelgrün mit Folienkapsel, kantige Kristall-Whiskyflasche mit Holzkorken) auf einer unsichtbaren Drehplatte. Wischen dreht den Kreis (folgt dem Finger, Trägheit, Feder, endlos); jede Flasche dreht sich dabei sichtbar um die eigene Achse (36 Winkel à 10°). Hintere Flaschen kleiner, dunkler, leicht unscharf. Studiolicht bleibt stehen. Tipp auf die vordere Flasche öffnet den Bereich, Tipp auf eine hintere dreht sie nach vorn. Bei reduzierter Bewegung wird überblendet.
- Vorder- und Rückenetiketten (Fantasie, HopfenMatch) als Texturen.
- Bilder: `img/car_<k>.webp` (Frontansicht), `img/car_<k>_s1.webp` (20°-Raster) und `_s2.webp` (Zwischenwinkel), gestaffelt nachgeladen.
- SW-Cache `hopfenmatch-v10`, Assets `?v=10`.

## v1.8.1: Flüssige Drehung auch bei langsamem Ziehen
- 72 Winkel à 5° pro Flasche (vorher 36 à 10°), verteilt auf vier Sprite-Blätter: `img/car_<k>_s1.webp` und `_s2.webp` (10°-Raster, zuerst geladen), `_s3.webp` und `_s4.webp` (5°-Zwischenwinkel, im Hintergrund nachgeladen). Die Frontansicht `img/car_<k>.webp` ist weiterhin sofort da.
- Bewegungsabhängige Überblendung: Während des Ziehens wird stufenlos zwischen den Nachbarwinkeln überblendet. Kommt die Bewegung zur Ruhe, rastet das Bild auf einen einzelnen, scharfen Winkel ein (keine Doppelbilder im Stand).
- Tiefenunschärfe der hinteren Flaschen ändert sich stufenlos (keine Sprünge zwischen Unschärfestufen).
- Karussell-Bilder gesamt ca. 5,3 MB.
- SW-Cache `hopfenmatch-v11`, Assets `?v=11`, App-Version 1.8.1.

## v1.9: Live-Etikett und mehr Licht
- Etiketten werden nicht mehr ins Sprite gebacken, sondern per WebGL live auf die exakte Flaschengeometrie gezeichnet, genau im Drehwinkel des Sprites. Dadurch bleibt Schrift in jeder Position und auch beim langsamen Drehen scharf (kein Doppelbild durch Überblendung); nur das Glas blendet weiter über.
- Beleuchtung im Shader: weiches Haupt-, Fenster- und Gegenlicht (Wrap-Diffus + sanfter Glanz), dunklere Ränder. Bier mit Kondenstropfen auf dem Etikett, Wein und Whisky mit glänzender Goldfolie. Rücketiketten durch Glas und Flüssigkeit getönt und leicht verzerrt sichtbar.
- Retina-Etiketttexturen mit Mipmaps und Anisotropie: `img/lab_<k>_<f|b|n>.webp` (+ `_x` für Goldmaske/Tropfen).
- Neue Sprites ohne Etikett mit wärmerem, hellerem Licht: `img/car2_<k>(_s1…_s4).webp`. Hintergrund in warmen Verläufen, Glas leuchtet von hinten, sehr dezenter Kontaktschatten, kein Boden; UI mit leichten Textschatten.
- Hintere Flaschen günstiger (geringere GL-Auflösung, ohne Durchsicht-Schicht).
- Ohne WebGL: altes Verhalten mit den eingebrannten Sprites `img/car_<k>…` (bleiben erhalten).
- Bilder gesamt: Sprites ca. 5,2 MB + Etiketten ca. 1,2 MB.
- SW-Cache `hopfenmatch-v12`, Assets `?v=12`, App-Version 1.9.

## v1.9.1: Ruckelfrei und kein Neustart mehr
- Karussell in **einem einzigen WebGL-Canvas**: Flasche, Live-Etikett, Kontaktschatten, Tiefenunschärfe, Helligkeit und Sättigung entstehen im Shader. Es gibt keine 2D-Kopien und keine CSS-Filter pro Frame mehr. Gezeichnet wird höchstens einmal pro Animations-Frame.
- Bilder werden vorab asynchron dekodiert (`decode()`) und einzeln in Leerlauf-Frames hochgeladen. Während einer Geste geht nur noch Dringendes hoch, und Texturen und Shader werden vorgewärmt. Die erste Drehung ruckelt dadurch nicht mehr.
- Die Zwischenwinkel-Blätter (`car3_*_s2…s4`, nur in Bewegung sichtbar) haben jetzt die 0,7-fache Auflösung. Das Ruhebild ist unverändert. Der Texturspeicher sinkt von etwa 250 MB auf etwa 150 MB, was iOS-Speicherabbrüche verhindert.
- Updates: Der Service Worker installiert nur noch das Nötigste und übernimmt die Bilder aus dem vorigen Cache. CSS und JS sind versioniert und werden exakt gesucht, sodass Versionen nicht mehr gemischt werden. Die Seite lädt bei einem Update **nicht mehr mitten in der Nutzung neu**, höchstens einmal still in den ersten Sekunden vor der ersten Eingabe (mit Schutz gegen Schleifen). Sonst gilt das Update beim nächsten Start.
- Ohne WebGL oder nach einem Kontextverlust zeichnet die App wie bisher mit Canvas 2D.

## v1.10: Erkennbarere Biergrafiken
- Die generativen Katalog-Flaschen tragen jetzt den **echten Bier- und Brauereinamen** in unseren App-Schriften (Lora, Source Sans) auf **8 eigenen, neutralen Etikett-Layouts**. Welches Layout eine Brauerei bekommt, ergibt sich fest aus ihrem Namen.
- Recherchiert sind **Markenfarben** (Etikettgrund, Haupt- und Akzentfarbe), das **typische Gebinde** (Euro, NRW/Longneck, Steinie, Bügel, Vichy/Ale, Dose) und die **Glasfarbe**. Die Daten stehen in `js/brands.js`, die Quellen (Produktfotos von Open Food Facts, Brauerei-, Shop- und Presseseiten) in `work/v110/brands.json` außerhalb des Repos.
- Ohne belegte Daten gibt es **Stilfarben als Fallback**, markiert mit `svg.fb`: Helles Gold/Weiß, Pils Grün/Weiß, Weizen Weiß/Blau, Dunkel/Bock Braun/Rot, Rauchbier Schwarz/Rot, IPA kräftig. Stand: 440 Biere mit recherchierten Farben, 954 mit Fallback, 8 mit echtem Foto.
- Bewusst **nicht** übernommen: Logos, Wappen, Maskottchen, Original-Schriftzüge, Originallayouts und Etikettformen, Slogans.
- Neue Formen: Euro-, Vichy- und Ale-Flasche sowie die 0,5-l-Dose. Wein und Whisky sehen aus wie bisher. Ein SVG ist etwa 2,3 KB groß, Lazy-Loading ist unverändert. Service-Worker-Cache v14.

## v1.11: Kategorie-Umschalter auf der Startseite statt Flaschenkarussell
- Das 3D-Flaschenkarussell (WebGL, `car*_`/`lab_`-Sprites, `js/home.js`) ist entfernt. Ablauf: Logo-Intro → (Anmeldung, falls nötig) → direkt die Startseite der zuletzt genutzten Kategorie (Standard Bier, gespeichert in `hopfenmatch.kat`).
- Unter dem Kopf jedes Tabs sitzt ein gut sichtbarer Umschalter Bier / Wein / Whisky (dunkles Segmented Control, eigene kleine SVG-Icons, Akzent Gold / Bordeaux / Kupfer, gleitende Markierung, Inhalt blendet weich über). Das kleine Pill unter dem Schriftzug ist durch die Kategorie-Zeile ersetzt; „Kategorie wechseln“ im Profil springt zum Umschalter.
- Fix: „Zuletzt bewertet“ und der Freundes-Status zeigen nur Einträge der aktiven Kategorie (vorher erschien z. B. ein Bier auf der Wein-Startseite).
- Service Worker `hopfenmatch-v15`: Karussell-Bilder (~11 MB) werden nicht mehr vorgeladen. Die Bilddateien liegen noch im Repo, damit offene v1.10-Clients nicht brechen; sie können mit v1.12 gelöscht werden.
