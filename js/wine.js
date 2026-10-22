/* HopfenMatch – Weinkatalog & gezeichnete Weinflaschen (SVG). Ids: wn-<slug> */
'use strict';
(function(){
const DATA=String.raw`# P|Erzeuger|Marke|Ort|Anbaugebiet/Region|Land|Form Glas Etikett Akzent Schrift
# Wein: Name|Rebsorte|Art(w r o s x)|%vol   (Name mit = am Anfang: vollständiger Name)
P|Weingut Dr. Loosen|Dr. Loosen|Bernkastel-Kues|Mosel|DE|sch gr #f7f2e6 #1b2f5c #1b2f5c
Riesling Kabinett Blauschiefer|Riesling|w|8.5
Ürziger Würzgarten Riesling Spätlese|Riesling|x|7.5
Wehlener Sonnenuhr Riesling GG|Riesling|w|12.5
Dr. L Riesling|Riesling|w|8.5
P|Weingut Joh. Jos. Prüm|J.J. Prüm|Wehlen|Mosel|DE|sch gr #f3ecd9 #8a1c22 #2a2016
Wehlener Sonnenuhr Riesling Kabinett|Riesling|x|8
Graacher Himmelreich Riesling Spätlese|Riesling|x|7.5
P|Weingut Egon Müller|Egon Müller|Wiltingen|Mosel|DE|sch gr #f5efdf #3a2a1a #2b1d12
Scharzhofberger Riesling Kabinett|Riesling|x|8
Scharzhof Riesling|Riesling|w|10
P|Weingut Markus Molitor|Markus Molitor|Bernkastel-Wehlen|Mosel|DE|sch gr #f6f1e5 #b8922e #1d1d1d
Zeltinger Sonnenuhr Riesling Spätlese|Riesling|w|12.5
Brauneberger Klostergarten Pinot Noir|Spätburgunder|r|13
Haus Klosterberg Riesling|Riesling|w|11.5
P|Weingut Fritz Haag|Fritz Haag|Brauneberg|Mosel|DE|sch gr #f4eedc #24476b #1e2b3a
Brauneberger Juffer Riesling Kabinett|Riesling|x|8.5
Riesling trocken|Riesling|w|11.5
P|Weingut Clemens Busch|Clemens Busch|Pünderich|Mosel|DE|sch gr #f2efe6 #6b7a2a #222
Riesling vom Grauen Schiefer|Riesling|w|12
Marienburg Rothenpfad Riesling GG|Riesling|w|12.5
P|Weingut Heymann-Löwenstein|Heymann-Löwenstein|Winningen|Mosel|DE|sch gr #f1ead8 #9a2f25 #2a1a10
Schieferterrassen Riesling|Riesling|w|12.5
Uhlen Blaufüßer Lay Riesling GG|Riesling|w|13
P|Weingut Van Volxem|Van Volxem|Wiltingen|Mosel|DE|sch gr #fbf7ec #111 #111
Saar Riesling|Riesling|w|11.5
Volz Riesling GG|Riesling|w|12.5
P|Weingut Reichsgraf von Kesselstatt|Kesselstatt|Morscheid|Mosel|DE|sch gr #f3ecd8 #7a1d24 #2a1a10
RK Riesling|Riesling|w|10.5
Josephshöfer Riesling GG|Riesling|w|12.5
P|Weingut Dr. Pauly-Bergweiler|Pauly-Bergweiler|Bernkastel-Kues|Mosel|DE|sch gr #f6efdc #24476b #1d2a3a
Bernkasteler Badstube Riesling Kabinett|Riesling|x|8.5
P|Weingut Dr. Bürklin-Wolf|Bürklin-Wolf|Wachenheim|Pfalz|DE|bur br #f4ecd6 #b33a2a #1f1a14
Bürklin Estate Riesling|Riesling|w|12
Pechstein Riesling GC|Riesling|w|12.5
Wachenheimer Riesling|Riesling|w|12
P|Weingut Dr. von Bassermann-Jordan|Bassermann-Jordan|Deidesheim|Pfalz|DE|sch br #f5eedb #1e3a5f #1e2a3a
Riesling trocken|Riesling|w|12
Deidesheimer Riesling|Riesling|w|12
Kirchenstück Riesling GG|Riesling|w|13
P|Weingut Reichsrat von Buhl|von Buhl|Deidesheim|Pfalz|DE|sch br #f7f2e6 #c49a3a #1a1a1a
Riesling trocken|Riesling|w|12
Reichsrat von Buhl Sekt Brut|Riesling|s|12
P|Weingut Ökonomierat Rebholz|Rebholz|Siebeldingen|Pfalz|DE|bur gr #f5f0e2 #2a4a2a #1e1e1e
Weißburgunder vom Muschelkalk|Weißburgunder|w|12.5
Im Sonnenschein Spätburgunder GG|Spätburgunder|r|13
Riesling vom Buntsandstein|Riesling|w|12
P|Weingut Friedrich Becker|Friedrich Becker|Schweigen|Pfalz|DE|bur dk #f3efe3 #7a1d24 #1a1a1a
Spätburgunder Schweigener|Spätburgunder|r|13
Kammerberg Spätburgunder GG|Spätburgunder|r|13.5
P|Weingut Knipser|Knipser|Laumersheim|Pfalz|DE|bdx dk #f6f1e5 #8a1c22 #2a1a12
Cuvée X|Cuvée Rot|r|13.5
Blauer Spätburgunder|Spätburgunder|r|13
Chardonnay|Chardonnay|w|13
P|Weingut Philipp Kuhn|Philipp Kuhn|Laumersheim|Pfalz|DE|bdx dk #f2ece0 #2a2a2a #111
Tradition Riesling|Riesling|w|12
Luitmar Cuvée Rot|Cuvée Rot|r|13.5
P|Weingut Markus Schneider|Markus Schneider|Ellerstadt|Pfalz|DE|bdx dk #111111 #c8a24a #f4ead2
Black Print|Cuvée Rot|r|14
Blackprint Rosé|Rosé|o|12.5
Ursprung|Cuvée Rot|r|14
Riesling Kaitui|Sauvignon Blanc|w|12
P|Weingut Pfeffingen|Pfeffingen|Bad Dürkheim|Pfalz|DE|sch br #f4eedc #3f6a3a #1f2a1f
Scheurebe trocken|Scheurebe|w|12
Riesling Ungsteiner|Riesling|w|12
P|Weingut Wageck|Wageck|Bissersheim|Pfalz|DE|bur gr #f6f2e7 #5a2a1a #222
Chardonnay Tertiär|Chardonnay|w|13
P|Weingut Bernhart|Bernhart|Schweigen|Pfalz|DE|bur dk #f1ebdc #7a1d24 #1a1a1a
Spätburgunder Schweigener|Spätburgunder|r|13
P|Weingut Keller|Keller|Flörsheim-Dalsheim|Rheinhessen|DE|sch gr #f6f1e3 #a01b1b #1d1d1d
Von der Fels Riesling|Riesling|w|12
Kirchspiel Riesling GG|Riesling|w|12.5
Grüner Silvaner|Silvaner|w|12
P|Weingut Wittmann|Wittmann|Westhofen|Rheinhessen|DE|bur gr #f7f4ea #2a2a2a #111
100 Hügel Riesling|Riesling|w|12
Morstein Riesling GG|Riesling|w|13
Silvaner trocken|Silvaner|w|12
P|Weingut Battenfeld-Spanier|Battenfeld-Spanier|Hohen-Sülzen|Rheinhessen|DE|sch gr #f3eee2 #24476b #1a1a1a
Riesling vom Kalkstein|Riesling|w|12
Frauenberg Riesling GG|Riesling|w|12.5
P|Weingut Gunderloch|Gunderloch|Nackenheim|Rheinhessen|DE|sch gr #f4eedc #8a1c22 #2a1a12
Jean-Baptiste Riesling Kabinett|Riesling|x|10
Rothenberg Riesling GG|Riesling|w|12.5
P|Weingut Kühling-Gillot|Kühling-Gillot|Bodenheim|Rheinhessen|DE|sch gr #f1ede4 #b0742a #1a1a1a
Qvinterra Riesling|Riesling|w|12
Pettenthal Riesling GG|Riesling|w|12.5
P|Weingut Thörle|Thörle|Saulheim|Rheinhessen|DE|bur gr #f6f1e6 #1d1d1d #1d1d1d
Riesling Kalkstein|Riesling|w|12
Spätburgunder Hölle|Spätburgunder|r|13.5
P|Weingut St. Antony|St. Antony|Nierstein|Rheinhessen|DE|sch gr #f2ecdf #6b1d24 #2a1a12
Roter Hang Riesling|Riesling|w|12.5
P|Weingut Gutzler|Gutzler|Gundheim|Rheinhessen|DE|bur dk #f4f0e6 #3a2a1a #1a1a1a
Spätburgunder|Spätburgunder|r|13
P|Weingut Hofmann|Hofmann|Appenheim|Rheinhessen|DE|sch gr #f6f2e6 #5a7a2a #1a1a1a
Scheurebe|Scheurebe|w|11.5
Grauburgunder|Grauburgunder|w|12.5
P|Weingut Fürst Castell|Castell|Castell|Franken|DE|bbt gr #f6efda #1d4a2a #1d2a1d
Casteller Silvaner trocken|Silvaner|w|12
Schlossberg Silvaner GG|Silvaner|w|13
Casteller Domina|Domina|r|13
P|Weingut Juliusspital|Juliusspital|Würzburg|Franken|DE|bbt gr #f5eedc #8a1c22 #2a1a12
Würzburger Stein Silvaner|Silvaner|w|12.5
Würzburger Riesling|Riesling|w|12
Müller-Thurgau trocken|Müller-Thurgau|w|11.5
P|Weingut Bürgerspital|Bürgerspital|Würzburg|Franken|DE|bbt gr #f2ead6 #a5822a #1d1d1d
Würzburger Silvaner|Silvaner|w|12
Stein-Harfe Riesling GG|Riesling|w|13
P|Staatlicher Hofkeller Würzburg|Hofkeller|Würzburg|Franken|DE|bbt gr #f5efdf #1e3a5f #1d1d1d
Silvaner trocken|Silvaner|w|12
Bacchus|Bacchus|w|11.5
P|Weingut Horst Sauer|Horst Sauer|Escherndorf|Franken|DE|bbt gr #f6f2e6 #2a6a8a #1a2a3a
Escherndorfer Lump Silvaner|Silvaner|w|12.5
Escherndorfer Lump Silvaner Beerenauslese|Silvaner|x|9
P|Weingut Rudolf Fürst|Rudolf Fürst|Bürgstadt|Franken|DE|bur dk #f4eedc #7a1d24 #1a1a1a
Spätburgunder tradition|Spätburgunder|r|13
Hundsrück Spätburgunder GG|Spätburgunder|r|13.5
P|Weingut Am Stein|Am Stein|Würzburg|Franken|DE|bbt gr #fbf8ef #111 #111
Stettener Silvaner|Silvaner|w|12
P|Divino Nordheim|Divino|Nordheim|Franken|DE|bbt gr #f3ebd5 #6b1d24 #2a1a12
Juventa Silvaner|Silvaner|w|11.5
P|Weingut Robert Weil|Robert Weil|Kiedrich|Rheingau|DE|sch br #f3eedf #1b2f5c #1b2f5c
Riesling trocken|Riesling|w|12
Kiedrich Gräfenberg Riesling GG|Riesling|w|13
Riesling Tradition|Riesling|x|10.5
P|Schloss Johannisberg|Schloss Johannisberg|Geisenheim|Rheingau|DE|sch br #f6efd6 #b8922e #2a1a10
Gelblack Riesling|Riesling|w|11.5
Grünlack Riesling Spätlese|Riesling|x|9
Silberlack Riesling GG|Riesling|w|13
P|Weingut Georg Breuer|Georg Breuer|Rüdesheim|Rheingau|DE|sch br #f7f3e9 #222 #111
Rüdesheim Estate Riesling|Riesling|w|12
Berg Schlossberg Riesling|Riesling|w|12.5
P|Weingut Künstler|Künstler|Hochheim|Rheingau|DE|sch br #f4eedb #8a1c22 #2a1a12
Hochheimer Hölle Riesling|Riesling|w|12.5
Spätburgunder Tradition|Spätburgunder|r|13
P|Kloster Eberbach|Kloster Eberbach|Eltville|Rheingau|DE|sch br #f5eedc #3a4a6b #1a1a2a
Steinberger Riesling|Riesling|w|12
Crescentia Riesling|Riesling|w|12
P|Schloss Vollrads|Schloss Vollrads|Oestrich-Winkel|Rheingau|DE|sch br #f2ead2 #24476b #1e2a3a
Riesling Kabinett|Riesling|x|10
P|Weingut Leitz|Leitz|Rüdesheim|Rheingau|DE|sch br #f7f2e6 #c63a2a #1a1a1a
Eins Zwei Dry Riesling|Riesling|w|12
Dragonstone Riesling|Riesling|x|10
P|Weingut Emrich-Schönleber|Emrich-Schönleber|Monzingen|Nahe|DE|sch gr #f4eedc #6b2a1a #1d1d1d
Halenberg Riesling GG|Riesling|w|13
Riesling trocken|Riesling|w|12
P|Weingut Dönnhoff|Dönnhoff|Oberhausen|Nahe|DE|sch gr #f6f1e4 #1d3a5c #1d2a3a
Riesling trocken|Riesling|w|12
Hermannshöhle Riesling GG|Riesling|w|13
Oberhäuser Leistenberg Riesling Kabinett|Riesling|x|9
P|Weingut Schäfer-Fröhlich|Schäfer-Fröhlich|Bockenau|Nahe|DE|sch gr #f3eee2 #a01b1b #1a1a1a
Bockenauer Riesling|Riesling|w|12
P|Weingut Dr. Heger|Dr. Heger|Ihringen|Baden|DE|bur dk #f4eedc #24476b #1d1d1d
Winklerberg Grauburgunder|Grauburgunder|w|13.5
Spätburgunder Kaiserstuhl|Spätburgunder|r|13
P|Weingut Bernhard Huber|Bernhard Huber|Malterdingen|Baden|DE|bur dk #f6f1e6 #6b1d24 #1a1a1a
Malterdinger Spätburgunder|Spätburgunder|r|13
Chardonnay|Chardonnay|w|13
P|Weingut Franz Keller|Franz Keller|Oberbergen|Baden|DE|bur dk #f7f3e9 #2a2a2a #111
Oberbergener Bassgeige Grauburgunder|Grauburgunder|w|13
Spätburgunder Kaiserstuhl|Spätburgunder|r|13
P|Weingut Salwey|Salwey|Oberrotweil|Baden|DE|bur dk #f3ecd8 #8a1c22 #2a1a12
Grauburgunder Kaiserstuhl|Grauburgunder|w|13
P|Weingut Ziereisen|Ziereisen|Efringen-Kirchen|Baden|DE|bur dk #f4f1e6 #5a3a1a #1d1d1d
Tschuppen Gutedel|Gutedel|w|11.5
Talrain Spätburgunder|Spätburgunder|r|13
P|Badischer Winzerkeller|Badischer Winzerkeller|Breisach|Baden|DE|bur gr #f6efda #b8922e #2a1a10
Baden Müller-Thurgau|Müller-Thurgau|w|11.5
Baden Spätburgunder Rosé|Spätburgunder|o|12
P|Weingut Aldinger|Aldinger|Fellbach|Württemberg|DE|bur dk #f3ecd8 #1e3a5f #1d1d1d
Lemberger Fellbacher|Lemberger|r|13.5
Spätburgunder Gips|Spätburgunder|r|13.5
P|Weingut Graf Neipperg|Graf Neipperg|Schwaigern|Württemberg|DE|bdx dk #f5eed8 #8a1c22 #2a1a12
Lemberger trocken|Lemberger|r|13.5
P|Weingut Dautel|Dautel|Bönnigheim|Württemberg|DE|bdx dk #f6f2e6 #6b1d24 #1a1a1a
Lemberger S|Lemberger|r|13.5
P|Weinmanufaktur Untertürkheim|Weinmanufaktur|Stuttgart|Württemberg|DE|bur dk #f4eddb #9a2f25 #2a1a10
Trollinger mit Lemberger|Trollinger|r|12
P|Weingut Meyer-Näkel|Meyer-Näkel|Dernau|Ahr|DE|bur dk #f5efdf #1d1d1d #1d1d1d
Spätburgunder Blauschiefer|Spätburgunder|r|13.5
Frühburgunder|Frühburgunder|r|13.5
P|Weingut Jean Stodden|Jean Stodden|Rech|Ahr|DE|bur dk #f3ecd9 #7a1d24 #2a1a12
Spätburgunder JS|Spätburgunder|r|13.5
P|Weingut Toni Jost|Toni Jost|Bacharach|Mittelrhein|DE|sch gr #f4eedb #1d3a5c #1d2a3a
Bacharacher Hahn Riesling|Riesling|w|12
P|Weingut Pawis|Pawis|Freyburg|Saale-Unstrut|DE|bur gr #f6f1e4 #3a5a2a #1d1d1d
Weißburgunder Edelacker|Weißburgunder|w|12.5
Silvaner|Silvaner|w|12
P|Winzervereinigung Freyburg-Unstrut|Freyburger Winzer|Freyburg|Saale-Unstrut|DE|sch gr #f3ecd6 #8a1c22 #2a1a12
Müller-Thurgau|Müller-Thurgau|w|11.5
P|Schloss Proschwitz|Schloss Proschwitz|Meißen|Sachsen|DE|bur gr #f6efd9 #24476b #1d2a3a
Goldriesling|Goldriesling|w|11.5
Grauer Burgunder|Grauburgunder|w|12.5
P|Sächsisches Staatsweingut Schloss Wackerbarth|Schloss Wackerbarth|Radebeul|Sachsen|DE|skt dk #f5efd9 #b8922e #2a1a10
Wackerbarth Sekt Riesling brut|Riesling|s|12
Traminer|Traminer|w|12.5
P|Rotkäppchen Sektkellerei|Rotkäppchen|Freyburg|Saale-Unstrut|DE|skt gr #b0201f #f2e6c8 #fff
Rotkäppchen Sekt trocken|Sekt|s|11
Rotkäppchen Rosé trocken|Sekt|s|11
P|Henkell Freixenet|Henkell|Wiesbaden|Rheingau|DE|skt gr #f3ead2 #1d3a5c #1d2a3a
Henkell Trocken|Sekt|s|11.5
Fürst von Metternich Riesling Sekt|Riesling|s|12.5
P|Sektkellerei Schloss Vaux|Schloss VAUX|Eltville|Rheingau|DE|skt gr #f5efdf #1d1d1d #1d1d1d
Vaux Riesling Brut|Riesling|s|12
P|Weingut Bergdolt-Reif & Nett|Reif & Nett|Duttweiler|Pfalz|DE|bur gr #f7f3ea #c63a2a #1a1a1a
Sommerwind Grauburgunder|Grauburgunder|w|12.5
P|Lergenmüller|Lergenmüller|Hainfeld|Pfalz|DE|bdx dk #111111 #b8922e #f2ead2
Grauburgunder|Grauburgunder|w|12.5
P|Weingut Dr. Wehrheim|Dr. Wehrheim|Birkweiler|Pfalz|DE|bur gr #f4f0e5 #2a4a2a #1d1d1d
Weißburgunder Buntsandstein|Weißburgunder|w|12.5
P|Weingut F. X. Pichler|F. X. Pichler|Dürnstein|Wachau|AT|sch gr #f5efdc #1d3a5c #1d2a3a
Grüner Veltliner Federspiel|Grüner Veltliner|w|12.5
Riesling Smaragd Dürnsteiner Kellerberg|Riesling|w|13.5
P|Domäne Wachau|Domäne Wachau|Dürnstein|Wachau|AT|sch gr #f3ecd9 #8a1c22 #2a1a12
Grüner Veltliner Federspiel Terrassen|Grüner Veltliner|w|12.5
Riesling Smaragd Achleiten|Riesling|w|13
P|Weingut Bründlmayer|Bründlmayer|Langenlois|Kamptal|AT|sch gr #f6f1e4 #2a2a2a #111
Grüner Veltliner Kamptal Terrassen|Grüner Veltliner|w|12.5
Brut Rosé|Sekt|s|12
P|Weingut Loimer|Loimer|Langenlois|Kamptal|AT|sch gr #111111 #f2ead2 #f2ead2
Lois Grüner Veltliner|Grüner Veltliner|w|11.5
P|Weingut Tement|Tement|Berghausen|Südsteiermark|AT|bur gr #f6f2e7 #5a7a2a #1d1d1d
Sauvignon Blanc Südsteiermark|Sauvignon Blanc|w|12.5
P|Weingut Umathum|Umathum|Frauenkirchen|Burgenland|AT|bdx dk #f3ecd8 #7a1d24 #1a1a1a
Zweigelt|Zweigelt|r|13
Blaufränkisch|Blaufränkisch|r|13
P|Weingut Kracher|Kracher|Illmitz|Burgenland|AT|sch fl #f5efd9 #b8922e #2a1a10
Beerenauslese Cuvée|Welschriesling|x|11
P|Château Margaux|Château Margaux|Margaux|Bordeaux|FR|bdx dk #f4edd8 #2a2a2a #1d1d1d
Pavillon Rouge du Château Margaux|Cabernet Sauvignon|r|13.5
=Château Margaux Premier Grand Cru Classé|Cabernet Sauvignon|r|13.5
P|Château Lafite Rothschild|Lafite|Pauillac|Bordeaux|FR|bdx dk #f3ecd6 #6b1d24 #2a1a12
=Château Lafite Rothschild|Cabernet Sauvignon|r|13
=Carruades de Lafite|Cabernet Sauvignon|r|13
P|Château Mouton Rothschild|Mouton Rothschild|Pauillac|Bordeaux|FR|bdx dk #f5efdc #b8922e #1d1d1d
=Château Mouton Rothschild|Cabernet Sauvignon|r|13.5
=Mouton Cadet Bordeaux|Merlot|r|13
P|Château Pétrus|Pétrus|Pomerol|Bordeaux|FR|bdx dk #f2e9d0 #8a1c22 #2a1a12
=Pétrus Pomerol|Merlot|r|14
P|Château Cheval Blanc|Cheval Blanc|Saint-Émilion|Bordeaux|FR|bdx dk #f6f1e4 #b8922e #1d1d1d
=Château Cheval Blanc|Cabernet Franc|r|14
P|Château Palmer|Palmer|Margaux|Bordeaux|FR|bdx dk #111111 #c8a24a #c8a24a
=Château Palmer|Merlot|r|13.5
=Alter Ego de Palmer|Merlot|r|13.5
P|Château Lynch-Bages|Lynch-Bages|Pauillac|Bordeaux|FR|bdx dk #f4eedb #6b1d24 #1a1a1a
=Château Lynch-Bages|Cabernet Sauvignon|r|13.5
P|Château d’Yquem|Château d’Yquem|Sauternes|Bordeaux|FR|bdx fl #f5efd9 #b8922e #2a1a10
=Château d’Yquem Sauternes|Sémillon|x|14
P|Château Smith Haut Lafitte|Smith Haut Lafitte|Pessac-Léognan|Bordeaux|FR|bdx dk #f4eedc #1d3a5c #1d1d1d
=Château Smith Haut Lafitte Blanc|Sauvignon Blanc|w|13.5
P|Domaine de la Romanée-Conti|DRC|Vosne-Romanée|Burgund|FR|bur dk #f2ead2 #6b1d24 #2a1a12
=Romanée-Conti Grand Cru|Pinot Noir|r|13.5
=La Tâche Grand Cru|Pinot Noir|r|13.5
P|Louis Jadot|Louis Jadot|Beaune|Burgund|FR|bur dk #f5efdc #8a1c22 #2a1a12
Bourgogne Pinot Noir Couvent des Jacobins|Pinot Noir|r|13
Chablis|Chardonnay|w|12.5
Pouilly-Fuissé|Chardonnay|w|13
P|Joseph Drouhin|Joseph Drouhin|Beaune|Burgund|FR|bur dk #f6f1e4 #1d1d1d #1d1d1d
Côte de Beaune|Pinot Noir|r|13
Meursault|Chardonnay|w|13
P|William Fèvre|William Fèvre|Chablis|Burgund|FR|bur fl #f4eedc #1d3a5c #1d2a3a
Chablis Premier Cru Montmains|Chardonnay|w|12.5
P|Domaine Leflaive|Leflaive|Puligny-Montrachet|Burgund|FR|bur fl #f6f1e3 #2a2a2a #1d1d1d
Puligny-Montrachet|Chardonnay|w|13
P|Georges Duboeuf|Georges Duboeuf|Romanèche-Thorins|Beaujolais|FR|bur dk #f6efd9 #a01b1b #1d1d1d
Beaujolais-Villages|Gamay|r|12.5
Morgon|Gamay|r|13
P|Moët & Chandon|Moët & Chandon|Épernay|Champagne|FR|skt dk #f6f0e2 #b8922e #1a1a1a
Brut Impérial|Champagner|s|12
Rosé Impérial|Champagner|s|12
=Dom Pérignon Vintage|Champagner|s|12.5
P|Veuve Clicquot|Veuve Clicquot|Reims|Champagne|FR|skt dk #f2a11c #111 #111
Brut Carte Jaune|Champagner|s|12
La Grande Dame|Champagner|s|12.5
P|Bollinger|Bollinger|Aÿ|Champagne|FR|skt dk #f4eedb #8a1c22 #2a1a12
Special Cuvée|Champagner|s|12
P|Ruinart|Ruinart|Reims|Champagne|FR|skt fl #f6f1e3 #1d3a5c #1d1d1d
Blanc de Blancs|Champagner|s|12.5
P|Louis Roederer|Louis Roederer|Reims|Champagne|FR|skt fl #f3c94a #6b4a10 #2a1a10
=Cristal|Champagner|s|12
Collection 243|Champagner|s|12.5
P|Taittinger|Taittinger|Reims|Champagne|FR|skt dk #f5efdc #1d3a5c #1d2a3a
Brut Réserve|Champagner|s|12.5
P|Krug|Krug|Reims|Champagne|FR|skt dk #f2ead2 #6b1d24 #2a1a12
Grande Cuvée|Champagner|s|12
P|Laurent-Perrier|Laurent-Perrier|Tours-sur-Marne|Champagne|FR|skt dk #f6f1e4 #24476b #1d1d1d
Cuvée Rosé|Champagner|s|12
P|E. Guigal|Guigal|Ampuis|Rhône|FR|bur dk #f4eedc #6b1d24 #2a1a12
Côtes du Rhône Rouge|Syrah|r|14
Côte-Rôtie Brune et Blonde|Syrah|r|13.5
P|M. Chapoutier|Chapoutier|Tain-l’Hermitage|Rhône|FR|bur dk #f3ecd6 #1d1d1d #1d1d1d
Belleruche Côtes du Rhône|Grenache|r|14
Crozes-Hermitage Les Meysonniers|Syrah|r|13.5
P|Château de Beaucastel|Beaucastel|Courthézon|Rhône|FR|bur dk #f6efd9 #8a1c22 #2a1a12
Châteauneuf-du-Pape|Grenache|r|14.5
P|Château Miraval|Miraval|Correns|Provence|FR|bur fl #f9e8de #b0742a #2a1a12
Côtes de Provence Rosé|Rosé|o|13
P|Whispering Angel|Whispering Angel|La Motte|Provence|FR|bur fl #fbf2ec #6b4a8a #2a1a3a
Côtes de Provence Rosé|Rosé|o|13
P|Maison Trimbach|Trimbach|Ribeauvillé|Elsass|FR|sch gr #f6efd9 #b8922e #2a1a10
Riesling|Riesling|w|12.5
Gewurztraminer|Gewürztraminer|w|13.5
P|Domaine Zind-Humbrecht|Zind-Humbrecht|Turckheim|Elsass|FR|sch gr #f4eedb #6b1d24 #1d1d1d
Pinot Gris|Grauburgunder|w|13.5
P|Domaine Huet|Huet|Vouvray|Loire|FR|bur fl #f6f1e4 #24476b #1d2a3a
Vouvray Le Haut-Lieu Sec|Chenin Blanc|w|13
P|Henri Bourgeois|Henri Bourgeois|Chavignol|Loire|FR|bur fl #f5efdc #2a4a2a #1d1d1d
Sancerre Les Baronnes|Sauvignon Blanc|w|13
P|Ladoucette|de Ladoucette|Pouilly-sur-Loire|Loire|FR|bur fl #f4eed6 #b8922e #2a1a10
Pouilly-Fumé|Sauvignon Blanc|w|12.5
P|Gérard Bertrand|Gérard Bertrand|Narbonne|Languedoc|FR|bur dk #f5efdc #2a2a2a #1d1d1d
Côte des Roses Rosé|Rosé|o|13
Gris Blanc|Rosé|o|12.5
P|Antinori|Antinori|Florenz|Toskana|IT|bdx dk #f5efdc #8a1c22 #2a1a12
Tignanello|Sangiovese|r|14
Villa Antinori Rosso|Sangiovese|r|13.5
Peppoli Chianti Classico|Sangiovese|r|13.5
=Solaia|Cabernet Sauvignon|r|14.5
P|Tenuta San Guido|San Guido|Bolgheri|Toskana|IT|bdx dk #f4eedc #1d3a5c #1d1d1d
=Sassicaia Bolgheri|Cabernet Sauvignon|r|14
=Guidalberto|Cabernet Sauvignon|r|14
P|Tenuta dell’Ornellaia|Ornellaia|Bolgheri|Toskana|IT|bdx dk #f2ead2 #6b1d24 #2a1a12
=Ornellaia Bolgheri Superiore|Merlot|r|14.5
=Le Serre Nuove dell’Ornellaia|Merlot|r|14.5
P|Castello Banfi|Banfi|Montalcino|Toskana|IT|bdx dk #f5efdc #b8922e #2a1a10
Brunello di Montalcino|Sangiovese|r|14
P|Biondi-Santi|Biondi-Santi|Montalcino|Toskana|IT|bdx dk #f3ecd6 #6b1d24 #1d1d1d
Brunello di Montalcino|Sangiovese|r|13.5
P|Castello di Ama|Castello di Ama|Gaiole in Chianti|Toskana|IT|bdx dk #f6f1e4 #8a1c22 #1d1d1d
Chianti Classico|Sangiovese|r|13.5
P|Ruffino|Ruffino|Pontassieve|Toskana|IT|bdx dk #f4eedc #8a1c22 #2a1a12
Chianti Classico Riserva Ducale|Sangiovese|r|13.5
P|Gaja|Gaja|Barbaresco|Piemont|IT|bur dk #f7f3e9 #1d1d1d #1d1d1d
Barbaresco|Nebbiolo|r|14
P|Giacomo Conterno|Giacomo Conterno|Monforte d’Alba|Piemont|IT|bur dk #f3ecd6 #6b1d24 #2a1a12
Barolo Cascina Francia|Nebbiolo|r|14
P|Pio Cesare|Pio Cesare|Alba|Piemont|IT|bur dk #f5efdc #b8922e #2a1a10
Barolo|Nebbiolo|r|14
Barbera d’Alba|Barbera|r|14
P|Fontanafredda|Fontanafredda|Serralunga d’Alba|Piemont|IT|bur dk #f4eedc #8a1c22 #2a1a12
Barolo Serralunga|Nebbiolo|r|14
P|Michele Chiarlo|Michele Chiarlo|Calamandrana|Piemont|IT|bur fl #f6f1e4 #24476b #1d1d1d
Moscato d’Asti Nivole|Moscato|x|5
Gavi Le Marne|Cortese|w|12.5
P|Masi|Masi|Valpolicella|Venetien|IT|bur dk #f4eedc #8a1c22 #2a1a12
Costasera Amarone Classico|Corvina|r|15
Campofiorin|Corvina|r|13
P|Allegrini|Allegrini|Fumane|Venetien|IT|bur dk #f5efdc #1d1d1d #1d1d1d
Amarone della Valpolicella Classico|Corvina|r|15
Palazzo della Torre|Corvina|r|13.5
P|Zenato|Zenato|Peschiera del Garda|Venetien|IT|bur dk #f3ecd6 #6b1d24 #2a1a12
Ripassa Valpolicella Superiore|Corvina|r|14
Lugana San Benedetto|Trebbiano|w|13
P|Santa Margherita|Santa Margherita|Fossalta di Portogruaro|Venetien|IT|sch fl #f6f1e4 #1d3a5c #1d2a3a
Pinot Grigio Valdadige|Grauburgunder|w|12.5
Prosecco Superiore Valdobbiadene|Prosecco|s|11.5
P|Mionetto|Mionetto|Valdobbiadene|Venetien|IT|skt gr #111111 #e0a43a #e0a43a
Prosecco DOC Treviso Brut|Prosecco|s|11
P|Bottega|Bottega|Bibano di Godega|Venetien|IT|skt fl #d8b25a #6b4a10 #2a1a10
Il Vino dei Poeti Prosecco|Prosecco|s|11
P|Kellerei St. Michael-Eppan|St. Michael-Eppan|Eppan|Südtirol|IT|bur fl #f6f1e4 #24476b #1d1d1d
Sanct Valentin Sauvignon|Sauvignon Blanc|w|14
Pinot Bianco|Weißburgunder|w|13.5
P|Kellerei Tramin|Tramin|Tramin|Südtirol|IT|sch fl #f4eedc #b8922e #2a1a10
Nussbaumer Gewürztraminer|Gewürztraminer|w|14.5
P|Alois Lageder|Alois Lageder|Margreid|Südtirol|IT|bur fl #f7f3e9 #3a5a2a #1d1d1d
Pinot Grigio|Grauburgunder|w|12.5
P|Planeta|Planeta|Menfi|Sizilien|IT|bur dk #f5efdc #c63a2a #1d1d1d
Cerasuolo di Vittoria|Nero d’Avola|r|13
Chardonnay|Chardonnay|w|14
P|Donnafugata|Donnafugata|Marsala|Sizilien|IT|bur dk #f3ecd6 #1d3a5c #1d1d1d
Sherazade Nero d’Avola|Nero d’Avola|r|13
Ben Ryé Passito di Pantelleria|Moscato|x|14.5
P|Feudi di San Gregorio|Feudi di San Gregorio|Sorbo Serpico|Kampanien|IT|bur dk #f4eedc #6b1d24 #2a1a12
Rubrato Aglianico|Aglianico|r|13.5
P|San Marzano|San Marzano|San Marzano di San Giuseppe|Apulien|IT|bur dk #111111 #c8a24a #c8a24a
Sessantanni Primitivo di Manduria|Primitivo|r|14.5
Il Pumo Primitivo|Primitivo|r|13.5
P|Marqués de Riscal|Marqués de Riscal|Elciego|Rioja|ES|bdx dk #f2ead2 #b8922e #2a1a10
Rioja Reserva|Tempranillo|r|14
Rueda Verdejo|Verdejo|w|13
P|Bodegas Muga|Muga|Haro|Rioja|ES|bdx dk #f4eedc #8a1c22 #2a1a12
Reserva|Tempranillo|r|14
Rosado|Rosé|o|13
P|La Rioja Alta|La Rioja Alta|Haro|Rioja|ES|bdx dk #f3ecd6 #6b1d24 #2a1a12
Viña Ardanza Reserva|Tempranillo|r|14
Gran Reserva 904|Tempranillo|r|13.5
P|CVNE|CVNE|Haro|Rioja|ES|bdx dk #f5efdc #a01b1b #1d1d1d
Cune Crianza|Tempranillo|r|13.5
Imperial Reserva|Tempranillo|r|14
P|Bodegas Faustino|Faustino|Oyón|Rioja|ES|bdx dk #e9dcc0 #6b4a2a #2a1a12
Faustino I Gran Reserva|Tempranillo|r|13.5
P|Campo Viejo|Campo Viejo|Logroño|Rioja|ES|bdx dk #f4eedc #b33a2a #1d1d1d
Rioja Reserva|Tempranillo|r|13.5
P|Vega Sicilia|Vega Sicilia|Valbuena de Duero|Ribera del Duero|ES|bdx dk #f2ead2 #1d1d1d #1d1d1d
Único|Tempranillo|r|14
Valbuena 5°|Tempranillo|r|14
P|Bodegas Pesquera|Pesquera|Pesquera de Duero|Ribera del Duero|ES|bdx dk #f4eedc #8a1c22 #2a1a12
Crianza|Tempranillo|r|14
P|Dominio de Pingus|Pingus|Quintanilla de Onésimo|Ribera del Duero|ES|bdx dk #f7f3e9 #111 #111
Flor de Pingus|Tempranillo|r|14.5
P|Álvaro Palacios|Álvaro Palacios|Gratallops|Priorat|ES|bur dk #f5efdc #6b1d24 #2a1a12
Camins del Priorat|Garnacha|r|14.5
P|Martín Códax|Martín Códax|Cambados|Rías Baixas|ES|sch fl #f4eedc #2a6a8a #1d2a3a
Albariño|Albariño|w|12.5
P|Freixenet|Freixenet|Sant Sadurní d’Anoia|Penedès|ES|skt dk #111111 #c8a24a #f2ead2
Cordon Negro Brut Cava|Cava|s|11.5
P|Codorníu|Codorníu|Sant Sadurní d’Anoia|Penedès|ES|skt fl #f5efdc #b8922e #2a1a10
Anna de Codorníu Blanc de Blancs|Cava|s|11.5
P|Torres|Torres|Vilafranca del Penedès|Penedès|ES|bdx dk #f4eedc #8a1c22 #2a1a12
Sangre de Toro|Garnacha|r|13.5
Viña Sol|Parellada|w|11.5
P|Bodegas Borsao|Borsao|Borja|Campo de Borja|ES|bdx dk #111111 #b33a2a #f2ead2
Tres Picos Garnacha|Garnacha|r|15
P|Symington Family Estates|Graham’s|Vila Nova de Gaia|Porto|PT|bdx dk #f2ead2 #8a1c22 #2a1a12
Graham’s Six Grapes Reserve Port|Portwein|x|20
Graham’s 10 Years Old Tawny|Portwein|x|20
P|Taylor’s|Taylor’s|Vila Nova de Gaia|Porto|PT|bdx dk #f4eedc #1d1d1d #1d1d1d
Late Bottled Vintage Port|Portwein|x|20
P|Sandeman|Sandeman|Vila Nova de Gaia|Porto|PT|bdx dk #111111 #c63a2a #f2ead2
Ruby Porto|Portwein|x|19.5
P|Quinta do Crasto|Quinta do Crasto|Sabrosa|Douro|PT|bdx dk #f5efdc #6b1d24 #2a1a12
Douro Tinto|Touriga Nacional|r|14
P|Casa Ferreirinha|Ferreirinha|Vila Nova de Gaia|Douro|PT|bdx dk #f4eedc #b8922e #2a1a10
Esteva Douro|Touriga Nacional|r|13
=Barca Velha|Touriga Nacional|r|14
P|Quinta da Aveleda|Casal Garcia|Penafiel|Vinho Verde|PT|sch fl #f6f1e4 #2a6a8a #1d2a3a
Vinho Verde Branco|Loureiro|w|9.5
P|Herdade do Esporão|Esporão|Reguengos de Monsaraz|Alentejo|PT|bdx dk #f3ecd6 #8a1c22 #2a1a12
Reserva Tinto|Touriga Nacional|r|14.5
P|Robert Mondavi Winery|Robert Mondavi|Oakville|Napa Valley|US|bdx dk #f5efdc #6b1d24 #2a1a12
Napa Valley Cabernet Sauvignon|Cabernet Sauvignon|r|14.5
Fumé Blanc|Sauvignon Blanc|w|13.5
P|Opus One Winery|Opus One|Oakville|Napa Valley|US|bdx dk #f7f3e9 #1d1d1d #1d1d1d
=Opus One|Cabernet Sauvignon|r|14.5
P|Caymus Vineyards|Caymus|Rutherford|Napa Valley|US|bdx dk #f4eedc #1d1d1d #1d1d1d
Napa Valley Cabernet Sauvignon|Cabernet Sauvignon|r|14.5
P|Stag’s Leap Wine Cellars|Stag’s Leap|Napa|Napa Valley|US|bdx dk #f3ecd6 #8a1c22 #2a1a12
Artemis Cabernet Sauvignon|Cabernet Sauvignon|r|14.5
P|Ridge Vineyards|Ridge|Cupertino|Santa Cruz Mountains|US|bdx dk #f6f1e4 #1d1d1d #1d1d1d
Monte Bello|Cabernet Sauvignon|r|13.5
Lytton Springs Zinfandel|Zinfandel|r|14.5
P|Kendall-Jackson|Kendall-Jackson|Santa Rosa|Sonoma|US|bur fl #f4eedc #b8922e #2a1a10
Vintner’s Reserve Chardonnay|Chardonnay|w|13.5
P|Domaine Drouhin Oregon|Domaine Drouhin Oregon|Dundee|Willamette Valley|US|bur dk #f5efdc #1d3a5c #1d1d1d
Pinot Noir Dundee Hills|Pinot Noir|r|13.5
P|Catena Zapata|Catena|Mendoza|Mendoza|AR|bdx dk #f3ecd6 #b8922e #2a1a10
Catena Malbec|Malbec|r|13.5
Catena Alta Malbec|Malbec|r|14
P|Bodega Norton|Norton|Luján de Cuyo|Mendoza|AR|bdx dk #f5efdc #8a1c22 #2a1a12
Reserva Malbec|Malbec|r|14
P|Achával-Ferrer|Achával-Ferrer|Luján de Cuyo|Mendoza|AR|bdx dk #f7f3e9 #1d1d1d #1d1d1d
Malbec Mendoza|Malbec|r|14
P|Bodega Colomé|Colomé|Molinos|Salta|AR|bdx dk #f4eedc #6b4a2a #2a1a12
Torrontés|Torrontés|w|13.5
P|Concha y Toro|Concha y Toro|Pirque|Maipo|CL|bdx dk #111111 #c8a24a #c8a24a
Casillero del Diablo Cabernet Sauvignon|Cabernet Sauvignon|r|13.5
=Don Melchor|Cabernet Sauvignon|r|14.5
P|Montes|Montes|Santa Cruz|Colchagua|CL|bdx dk #f5efdc #1d3a5c #1d1d1d
Alpha Carmenère|Carmenère|r|14.5
P|Viña Errázuriz|Errázuriz|Panquehue|Aconcagua|CL|bdx dk #f4eedc #8a1c22 #2a1a12
Max Reserva Carmenère|Carmenère|r|13.5
P|Cloudy Bay|Cloudy Bay|Blenheim|Marlborough|NZ|bur fl #f6f1e4 #24476b #1d2a3a
Sauvignon Blanc|Sauvignon Blanc|w|13.5
Pinot Noir|Pinot Noir|r|13.5
P|Villa Maria|Villa Maria|Auckland|Marlborough|NZ|bur fl #f4eedc #1d1d1d #1d1d1d
Private Bin Sauvignon Blanc|Sauvignon Blanc|w|12.5
P|Oyster Bay|Oyster Bay|Blenheim|Marlborough|NZ|bur fl #f5efdc #2a6a8a #1d2a3a
Sauvignon Blanc|Sauvignon Blanc|w|13
P|Felton Road|Felton Road|Bannockburn|Central Otago|NZ|bur dk #f7f3e9 #1d1d1d #1d1d1d
Bannockburn Pinot Noir|Pinot Noir|r|14
P|Penfolds|Penfolds|Nuriootpa|Barossa Valley|AU|bdx dk #f2ead2 #a01b1b #1d1d1d
Grange|Shiraz|r|14.5
Bin 389 Cabernet Shiraz|Shiraz|r|14.5
Koonunga Hill Shiraz Cabernet|Shiraz|r|13.5
P|Yalumba|Yalumba|Angaston|Barossa Valley|AU|bdx dk #f4eedc #6b1d24 #2a1a12
The Y Series Shiraz Viognier|Shiraz|r|14
P|d’Arenberg|d’Arenberg|McLaren Vale|McLaren Vale|AU|bdx dk #f3ecd6 #b33a2a #1d1d1d
The Dead Arm Shiraz|Shiraz|r|14.5
The Footbolt Shiraz|Shiraz|r|14.5
P|Leeuwin Estate|Leeuwin|Margaret River|Margaret River|AU|bur fl #f6f1e4 #b8922e #2a1a10
Art Series Chardonnay|Chardonnay|w|13.5
P|Yellow Tail|Yellow Tail|Yenda|South Eastern Australia|AU|bdx dk #111111 #f2b51c #f2b51c
Shiraz|Shiraz|r|13.5
Chardonnay|Chardonnay|w|13
P|Kanonkop Estate|Kanonkop|Stellenbosch|Stellenbosch|ZA|bdx dk #f4eedc #6b1d24 #2a1a12
Pinotage|Pinotage|r|14.5
Paul Sauer|Cabernet Sauvignon|r|14.5
P|Meerlust Estate|Meerlust|Stellenbosch|Stellenbosch|ZA|bdx dk #f2ead2 #8a1c22 #2a1a12
Rubicon|Cabernet Sauvignon|r|14.5
P|Sadie Family Wines|Sadie Family|Malmesbury|Swartland|ZA|bur fl #f7f3e9 #1d1d1d #1d1d1d
Palladius|Chenin Blanc|w|13.5
P|Boekenhoutskloof|Boekenhoutskloof|Franschhoek|Franschhoek|ZA|bdx dk #f4eedc #1d1d1d #1d1d1d
The Chocolate Block|Syrah|r|14.5
P|Weingut Schloss Gobelsburg|Schloss Gobelsburg|Gobelsburg|Kamptal|AT|sch gr #f5efdc #6b1d24 #2a1a12
Grüner Veltliner Gobelsburger|Grüner Veltliner|w|12.5
P|Weingut Gesellmann|Gesellmann|Deutschkreutz|Burgenland|AT|bdx dk #f4eedc #1d3a5c #1d1d1d
Blaufränkisch Hochberg|Blaufränkisch|r|13.5
P|Weingut Sattlerhof|Sattlerhof|Gamlitz|Südsteiermark|AT|bur gr #f6f1e4 #5a7a2a #1d1d1d
Sauvignon Blanc Gamlitz|Sauvignon Blanc|w|12.5
Gelber Muskateller|Muskateller|w|11.5
P|Weingut Gantenbein|Gantenbein|Fläsch|Graubünden|CH|bur dk #f7f3e9 #1d1d1d #1d1d1d
Pinot Noir|Pinot Noir|r|13
P|Domaine Louis Bovard|Louis Bovard|Cully|Lavaux|CH|bur fl #f4eedc #b8922e #2a1a10
Médinette Dézaley Grand Cru|Chasselas|w|12.5
P|Tokaj Oremus|Oremus|Tolcsva|Tokaj|HU|bur fl #f4eedc #b8922e #2a1a10
Tokaji Aszú 5 Puttonyos|Furmint|x|11.5
Mandolás Furmint|Furmint|w|13.5
P|Domaine Sigalas|Sigalas|Oia|Santorini|GR|bur fl #f6f1e4 #2a6a8a #1d2a3a
Assyrtiko|Assyrtiko|w|14
P|Château Musar|Musar|Ghazir|Bekaa|LB|bdx dk #f2ead2 #8a1c22 #2a1a12
Château Musar Rouge|Cuvée Rot|r|14
P|Weingut Heitlinger|Heitlinger|Östringen|Baden|DE|bur gr #f5f0e3 #b33a2a #1d1d1d
Auxerrois|Auxerrois|w|12.5
P|Weingut Jürgen Ellwanger|Jürgen Ellwanger|Winterbach|Württemberg|DE|bdx dk #f4eedc #6b1d24 #1d1d1d
Zweigelt Hades|Zweigelt|r|13.5
P|Weingut Schloss Neuweier|Schloss Neuweier|Baden-Baden|Baden|DE|bbt gr #f5efdc #1d3a5c #1d2a3a
Mauerberg Riesling GG|Riesling|w|13
P|Weingut Kranz|Kranz|Ilbesheim|Pfalz|DE|bur gr #f4f0e6 #3a5a2a #1d1d1d
Kalmit Weißburgunder GG|Weißburgunder|w|13
P|Weingut Christmann|A. Christmann|Gimmeldingen|Pfalz|DE|sch br #f6f1e4 #6b1d24 #1d1d1d
Idig Riesling GG|Riesling|w|13
Königsbacher Riesling|Riesling|w|12.5
P|Weingut Weegmüller|Weegmüller|Neustadt-Haardt|Pfalz|DE|sch br #f4eedb #24476b #1d2a3a
Scheurebe Kabinett trocken|Scheurebe|w|11.5
P|Weingut Schlossgut Diel|Schlossgut Diel|Burg Layen|Nahe|DE|sch gr #f6f1e4 #1d1d1d #1d1d1d
Goldloch Riesling GG|Riesling|w|13
Cuvée Mo Sekt|Sekt|s|12
P|Weingut Rings|Rings|Freinsheim|Pfalz|DE|bur dk #f7f3e9 #1d1d1d #1d1d1d
Kallstadter Saumagen Riesling GG|Riesling|w|12.5
Spätburgunder Saumagen|Spätburgunder|r|13
P|Weingut Zehnthof Luckert|Zehnthof Luckert|Sulzfeld|Franken|DE|bbt gr #f5efdc #6b4a2a #1d1d1d
Silvaner Muschelkalk|Silvaner|w|12.5
P|Weingut Rainer Sauer|Rainer Sauer|Escherndorf|Franken|DE|bbt gr #f6f1e4 #24476b #1d2a3a
Escherndorfer Silvaner|Silvaner|w|12
P|Weingut Schloss Sommerhausen|Schloss Sommerhausen|Sommerhausen|Franken|DE|bbt gr #f4eedc #8a1c22 #2a1a12
Silvaner trocken|Silvaner|w|12
Scheurebe Sekt Brut|Scheurebe|s|12
P|Weingut Sankt Urbans-Hof|St. Urbans-Hof|Leiwen|Mosel|DE|sch gr #f4eedc #1d3a5c #1d2a3a
Ockfener Bockstein Riesling Kabinett|Riesling|x|8
P|Weingut Selbach-Oster|Selbach-Oster|Zeltingen|Mosel|DE|sch gr #f5efdc #b8922e #2a1a10
Zeltinger Schlossberg Riesling Spätlese|Riesling|x|8
P|Weingut Grans-Fassian|Grans-Fassian|Leiwen|Mosel|DE|sch gr #f6f1e4 #6b1d24 #1d1d1d
Trittenheimer Apotheke Riesling|Riesling|w|12
P|Weingut Kloster Pforta|Kloster Pforta|Bad Kösen|Saale-Unstrut|DE|bur gr #f4eedc #6b1d24 #2a1a12
Blauer Zweigelt|Zweigelt|r|12.5
P|Weingut Klaus Zimmerling|Zimmerling|Dresden-Pillnitz|Sachsen|DE|bur fl #f7f3e9 #2a2a2a #1d1d1d
Riesling Pillnitzer|Riesling|w|12
P|Weingut Simon-Bürkle|Simon-Bürkle|Zwingenberg|Hessische Bergstraße|DE|sch gr #f5efdc #24476b #1d2a3a
Riesling trocken|Riesling|w|12
`;
const ART={w:'weiss',r:'rot',o:'rose',s:'schaum',x:'suess'};
const WINE_GROUPS=[['weiss','Weißwein'],['rot','Rotwein'],['rose','Rosé'],['schaum','Sekt & Champagner'],['suess','Süß & Dessert']];
const ARTNAME={weiss:'Weißwein',rot:'Rotwein',rose:'Roséwein',schaum:'Schaumwein',suess:'Süßwein'};
/* Rebsorte: [Beschreibung, Weinfarbe] */
const G={
 'Riesling':['rassige Säure, Pfirsich, Zitrus und eine feine Schiefer-Mineralik','#ead984'],
 'Silvaner':['zurückhaltend, erdig-kräutrig mit Birne und Muschelkalk-Würze','#e6dc98'],
 'Müller-Thurgau':['leicht und süffig mit Muskat-Duft und milder Säure','#ece3a4'],
 'Weißburgunder':['cremig und elegant, mit Birne, Mandel und dezenter Säure','#eadc96'],
 'Grauburgunder':['vollmundig mit Nuss, gelbem Apfel und schmelziger Textur','#e6cf80'],
 'Chardonnay':['buttrig bis mineralisch, mit Zitrus, Melone und oft feinem Holz','#e8d074'],
 'Sauvignon Blanc':['knackig-frisch mit Stachelbeere, Holunder und grüner Paprika','#e4e09a'],
 'Scheurebe':['aromatisch-exotisch mit Cassis, Grapefruit und Mango','#e8da8a'],
 'Gewürztraminer':['üppig duftend nach Rose, Litschi und Gewürzen','#e4c464'],
 'Traminer':['feiner Rosenduft, Litschi und eine zarte Würze','#e6c868'],
 'Grüner Veltliner':['pfeffrig-würzig mit grünem Apfel und lebendiger Frische','#e4e092'],
 'Gutedel':['leicht und zart mit Mandel, Apfel und wenig Säure','#ece6ae'],
 'Bacchus':['duftig mit Holunder, Muskat und reifer Frucht','#ebdf98'],
 'Goldriesling':['fruchtig-leicht mit Muskatton – eine sächsische Spezialität','#ece09c'],
 'Auxerrois':['mild und schmelzig mit gelber Frucht und Nuss','#e8d88c'],
 'Muskateller':['traubig-frisch mit Holunder und Muskat','#ece29e'],
 'Chenin Blanc':['Quitte, Honig und Apfel, getragen von frischer Säure','#e6d27a'],
 'Albariño':['salzig-frisch mit Pfirsich, Zitrus und Meeresbrise','#e6e09a'],
 'Verdejo':['frisch mit Fenchel, Zitrus und leicht bitterem Finale','#e6e09a'],
 'Assyrtiko':['vulkanisch-mineralisch, salzig, mit Zitrone und Feuerstein','#e8e0a0'],
 'Furmint':['rauchig-mineralisch mit Quitte und lebhafter Säure','#e2c860'],
 'Chasselas':['zart und mineralisch mit Lindenblüte und Mandel','#ece6ae'],
 'Cortese':['frisch und hell mit Apfel und Mandel','#ece4a6'],
 'Trebbiano':['zitrisch und mandelig mit cremigem Schmelz','#e8dc92'],
 'Torrontés':['blumig mit Rose, Pfirsich und Orangenschale','#e6dc8a'],
 'Loureiro':['spritzig-leicht mit Zitrus und Blüten','#ece6a8'],
 'Parellada':['leicht und blumig mit grünem Apfel','#ece6aa'],
 'Welschriesling':['edelsüß mit Honig, Aprikose und Rosinen','#d9a032'],
 'Sémillon':['edelsüß mit Honig, Aprikose, Safran und Botrytis','#d79a2a'],
 'Moscato':['süß-duftig nach Muskattraube, Orangenblüte und Pfirsich','#e6c45a'],
 'Portwein':['süß und kräftig mit Brombeere, Pflaume, Nuss und Karamell','#5a0f1c'],
 'Spätburgunder':['seidig mit Kirsche, Himbeere und feiner Würze','#7a1a24'],
 'Pinot Noir':['elegant mit roter Frucht, Unterholz und seidigem Tannin','#7a1a24'],
 'Frühburgunder':['samtig mit dunkler Kirsche und milder Säure','#741a26'],
 'Lemberger':['kräftig mit Brombeere, Pfeffer und präsenter Säure','#5c0f22'],
 'Blaufränkisch':['würzig mit Brombeere, Kirsche und kühler Frische','#5c0f22'],
 'Trollinger':['hell und süffig mit Kirsche und Mandel','#9a2a32'],
 'Zweigelt':['saftig mit Weichsel und Kirsche, weich im Tannin','#6e1424'],
 'Domina':['dunkel und kräftig mit Brombeere und Gewürz','#5a0f20'],
 'Cabernet Sauvignon':['Cassis, Zeder und Tabak, mit festem Tannin','#4e0c1c'],
 'Merlot':['samtig mit Pflaume, Schokolade und weichem Tannin','#560e1e'],
 'Cabernet Franc':['duftig mit Veilchen, Himbeere und feiner Würze','#5a1022'],
 'Syrah':['dunkel und würzig mit Brombeere, Pfeffer und Rauch','#4a0b1c'],
 'Shiraz':['opulent mit Brombeere, Lakritz und Pfeffer','#4a0b1c'],
 'Grenache':['saftig-warm mit Erdbeere, Kräutern und Gewürz','#6a1222'],
 'Garnacha':['saftig-warm mit roter Beere und Kräutern','#6a1222'],
 'Gamay':['fruchtig-leicht mit Kirsche und Veilchen','#7e1c2a'],
 'Sangiovese':['Sauerkirsche, Kräuter und lebendige Säure','#64121e'],
 'Nebbiolo':['Rose, Teer und Kirsche, mit kraftvollem Tannin','#6a1a22'],
 'Barbera':['saftig mit Kirsche und frischer Säure','#5a0f1e'],
 'Corvina':['Kirsche, Bittermandel und getrocknete Früchte','#520e1c'],
 'Primitivo':['üppig mit Pflaume, Feige und Schokolade','#4c0b1a'],
 'Zinfandel':['üppig mit Brombeere, Pflaume und Gewürz','#4c0b1a'],
 'Nero d’Avola':['sonnig mit dunkler Kirsche und Pflaume','#520e1e'],
 'Aglianico':['tiefdunkel mit Kirsche, Leder und festem Tannin','#4a0b1a'],
 'Tempranillo':['Kirsche, Tabak und Vanille aus dem Eichenfass','#5a0f1e'],
 'Touriga Nacional':['dunkle Beeren, Veilchen und feste Struktur','#4a0b1c'],
 'Malbec':['tiefdunkel mit Pflaume, Brombeere und Veilchen','#460a1c'],
 'Carmenère':['dunkle Beeren, Paprika und Schokolade','#480b1c'],
 'Pinotage':['rauchig mit Brombeere, Kaffee und Banane','#4e0c1c'],
 'Cuvée Rot':['dunkle Frucht, Gewürz und Holz in einer Assemblage','#520e1e'],
 'Rosé':['frisch und zart mit Erdbeere, Pfirsich und Kräutern','#f2b0a2'],
 'Sekt':['feinperlig mit Apfel, Brioche und frischer Säure','#eedfa0'],
 'Champagner':['feine Perlage, Brioche, Zitrus und Kreide','#ecd998'],
 'Prosecco':['leicht und perlend mit Birne, Apfel und Blüten','#eee4a8'],
 'Cava':['frisch perlend mit Zitrus, Mandel und Hefe','#ecdea0']};
const COL={weiss:'#e8d88a',rot:'#5c0f1e',rose:'#f2b0a2',schaum:'#eedfa0',suess:'#d9a032'};
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[’'&.]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const WINES=[];const seen=new Set();let P=null;
DATA.split('\n').forEach(l=>{l=l.trim();if(!l||l[0]==='#')return;const f=l.split('|');
 if(f[0]==='P'){const lk=f[6].split(' ');P={prod:f[1],brand:f[2],ort:f[3],reg:f[4],cc:f[5],shape:lk[0],glass:lk[1],label:lk[2],accent:lk[3],ink:lk[4]};return}
 const full=f[0][0]==='='?f[0].slice(1):P.brand+' '+f[0];const grp=ART[f[2]]||'weiss';
 let id='wn-'+slug(full);if(seen.has(id))id+='-'+slug(P.ort);seen.add(id);
 const gm=G[f[1]]||['',COL[grp]];
 let shape=P.shape;if(grp==='schaum')shape='skt';
 const liq=grp==='rose'||/Rosé/.test(full)?COL.rose:grp==='schaum'?(G[f[1]]&&['Sekt','Champagner','Prosecco','Cava'].includes(f[1])?gm[1]:COL.schaum):gm[1]||COL[grp];
 const C=(typeof COUNTRIES!=='undefined'&&COUNTRIES[P.cc])||[P.cc];
 const plain=['Sekt','Champagner','Prosecco','Cava','Rosé','Portwein'].includes(f[1]);
 const desc=`${f[1]==='Cuvée Rot'?'Rote Cuvée':plain?f[1]:ARTNAME[grp]+' aus der Rebsorte '+f[1]}. Typisch: ${gm[0]||'ausdrucksstark und charaktervoll'}. ${P.cc==='DE'?'Anbaugebiet':'Region'} ${P.reg}, ${C[0]} – ${P.prod}, ${P.ort}.`;
 WINES.push({id,kat:'wein',name:full,brewery:P.prod,style:f[1],grp,abv:+f[3]||12,origin:P.ort+', '+P.reg,country:P.cc,reg:P.reg,cat:1,desc,
  svg:{shape,glass:P.glass,label:P.label,accent:P.accent,ink:P.ink,liq,text:P.brand,sub:(f[1]==='Cuvée Rot'?'CUVÉE':f[1]).toUpperCase(),grp}})});

/* ---------- Zeichnen ---------- */
let _w=0;
const WG={gr:['#0b220f','#28502a','#5f8f52'],dk:['#080f08','#1c2918','#4a5a3c'],br:['#241005','#653310','#a5611e'],ol:['#3a5418','#76963a','#b6cc78']};
function mix(a,b,t){const x=parseInt(a.slice(1),16),y=parseInt(b.slice(1),16);const r=Math.round((x>>16)+((y>>16)-(x>>16))*t),g=Math.round(((x>>8)&255)+(((y>>8)&255)-((x>>8)&255))*t),bl=Math.round((x&255)+((y&255)-(x&255))*t);return '#'+((1<<24)|(r<<16)|(g<<8)|bl).toString(16).slice(1)}
function glassCols(s){if(s.glass==='fl'){const l=s.liq;return [shade(l,-0.45),shade(l,-0.08),shade(l,0.45)]}return WG[s.glass]||WG.gr}
function wineOutline(sh){const L=n=>(20-n).toFixed(1),R=n=>(20+n).toFixed(1);
 if(sh==='bdx')return {p:`M15.8,3 L24.2,3 L24.2,44 C24.2,52 33.6,51 33.6,60 L33.6,145 Q33.6,148 30.6,148 L9.4,148 Q6.4,148 6.4,145 L6.4,60 C6.4,51 15.8,52 15.8,44 Z`,nh:4.2,top:3,neckBot:44,bw:13.6,ly:80,lh:46};
 if(sh==='bur')return {p:`M15.9,3 L24.1,3 L24.1,36 C24.1,60 34.6,62 34.6,86 L34.6,145 Q34.6,148 31.6,148 L8.4,148 Q5.4,148 5.4,145 L5.4,86 C5.4,62 15.9,60 15.9,36 Z`,nh:4.1,top:3,neckBot:36,bw:14.6,ly:92,lh:42};
 if(sh==='sch')return {p:`M16.3,0 L23.7,0 L23.7,50 C23.7,70 31.6,76 31.6,96 L31.6,145 Q31.6,148 28.6,148 L11.4,148 Q8.4,148 8.4,145 L8.4,96 C8.4,76 16.3,70 16.3,50 Z`,nh:3.7,top:0,neckBot:50,bw:11.6,ly:104,lh:34};
 if(sh==='bbt')return {p:`M15.4,26 L24.6,26 L24.6,54 C24.6,62 38.8,68 38.8,104 C38.8,138 31,148 20,148 C9,148 1.2,138 1.2,104 C1.2,68 15.4,62 15.4,54 Z`,nh:4.6,top:26,neckBot:54,bw:18.8,ly:88,lh:36,oval:1};
 /* skt */ return {p:`M15,4 L25,4 L25,42 C25,62 35.6,64 35.6,84 L35.6,145 Q35.6,148 32.6,148 L7.4,148 Q4.4,148 4.4,145 L4.4,84 C4.4,64 15,62 15,42 Z`,nh:5,top:4,neckBot:42,bw:15.6,ly:94,lh:38}}
function grapeIcon(cx,cy,c){let o='';[[0,0],[-2.2,0],[2.2,0],[-1.1,2],[1.1,2],[0,4]].forEach(([x,y])=>o+=`<circle cx="${cx+x}" cy="${cy+y-2}" r="1.15" fill="${c}"/>`);return o+`<path d="M${cx},${cy-3.4} q1.6,-1.6 3.2,-1.2" stroke="${c}" stroke-width=".6" fill="none"/>`}
function wineBottle(s){
 const id='w'+(++_w),O=wineOutline(s.shape),g=glassCols(s),L=20-O.nh,R=20+O.nh;
 let o=`<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${g[0]}"/><stop offset=".2" stop-color="${g[1]}"/><stop offset=".32" stop-color="${g[2]}"/><stop offset=".44" stop-color="${g[1]}"/><stop offset=".86" stop-color="${g[0]}"/><stop offset="1" stop-color="${g[0]}"/></linearGradient>
 <linearGradient id="${id}l" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".26"/><stop offset=".3" stop-color="#fff" stop-opacity=".2"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".34"/></linearGradient><clipPath id="${id}c"><path d="${O.p}"/></clipPath></defs>`;
 o+=`<ellipse cx="20" cy="149" rx="${O.bw+2}" ry="2.2" fill="#000" opacity=".18"/><path d="${O.p}" fill="url(#${id})"/>`;
 if(s.glass==='fl')o+=`<path d="M${L},${O.top} L${R},${O.top} L${R},${O.neckBot-4} L${L},${O.neckBot-4}Z" fill="#fff" opacity=".35"/>`;
 // Kapsel bzw. Folie mit Agraffe
 const cap=s.accent==='#111'||s.accent==='#1d1d1d'?'#1c1c1c':s.accent;
 if(s.shape==='skt'||s.grp==='schaum'){const fc=s.label==='#111111'?'#1a1a1a':shade(cap,-0.1);
  o+=`<path d="M${L-1.2},${O.top-3} Q20,${O.top-7} ${R+1.2},${O.top-3} L${R+0.6},${O.neckBot+8} L${L-0.6},${O.neckBot+8} Z" fill="${fc}"/><path d="M${L-1.2},${O.top-3} Q20,${O.top-7} ${R+1.2},${O.top-3} L${R+0.6},${O.neckBot+8} L${L-0.6},${O.neckBot+8} Z" fill="url(#${id}l)"/>
  <path d="M${L},${O.top+4} L${R},${O.top+4}" stroke="#d9c27a" stroke-width=".9"/><path d="M${L-0.6},${O.neckBot+8} L${R+0.6},${O.neckBot+8}" stroke="#d9c27a" stroke-width="1.2"/>
  <rect x="${L+1.5}" y="${O.neckBot-4}" width="${2*O.nh-3}" height="7" rx="1" fill="${s.label}"/><text x="20" y="${O.neckBot+1.4}" font-family="'Source Sans 3',Arial" font-weight="700" font-size="2.8" fill="${s.ink==='#f2ead2'||s.ink==='#fff'?s.ink:s.accent}" text-anchor="middle">${s.grp==='schaum'?'BRUT':''}</text>`}
 else o+=`<rect x="${L-0.7}" y="${O.top-1}" width="${2*O.nh+1.4}" height="17" rx="1.2" fill="${cap}"/><rect x="${L-0.7}" y="${O.top-1}" width="${2*O.nh+1.4}" height="17" rx="1.2" fill="url(#${id}l)"/><path d="M${L-0.7},${O.top+13} L${R+0.7},${O.top+13}" stroke="#fff" stroke-opacity=".35" stroke-width=".7"/>`;
 // Etikett
 const lw=O.bw*2-(O.oval?6:1.4),lx=20-lw/2,ly=O.ly,lh=O.lh,ac=s.accent,ink=s.ink;
 o+=`<g clip-path="url(#${id}c)">`;
 if(O.oval){o+=`<ellipse cx="20" cy="${ly+lh/2}" rx="${lw/2}" ry="${lh/2}" fill="${s.label}"/><ellipse cx="20" cy="${ly+lh/2}" rx="${lw/2-1.6}" ry="${lh/2-1.6}" fill="none" stroke="${ac}" stroke-width=".8"/>`}
 else if(s.shape==='skt'){o+=`<path d="M${lx},${ly+5} Q20,${ly-3} ${lx+lw},${ly+5} L${lx+lw},${ly+lh} L${lx},${ly+lh} Z" fill="${s.label}"/><path d="M${lx+1.8},${ly+6} Q20,${ly-0.6} ${lx+lw-1.8},${ly+6} L${lx+lw-1.8},${ly+lh-1.8} L${lx+1.8},${ly+lh-1.8} Z" fill="none" stroke="${ac}" stroke-width=".8"/>`}
 else{o+=`<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" fill="${s.label}"/><rect x="${lx+1.6}" y="${ly+1.6}" width="${lw-3.2}" height="${lh-3.2}" fill="none" stroke="${ac}" stroke-width=".7"/><rect x="${lx+2.6}" y="${ly+2.6}" width="${lw-5.2}" height="${lh-5.2}" fill="none" stroke="${ac}" stroke-width=".3"/>`}
 const cy=ly+lh/2;
 o+=grapeIcon(20,ly+(O.oval?8:7.5),ac);
 o+=labelText(s.text,20,cy+1.5,lw-(O.oval?8:6),ink,s.shape==='sch'?6.6:7.6);
 const sub=s.sub.length>16?s.sub.slice(0,16):s.sub;
 o+=`<path d="M${20-lw*0.22},${cy+8.4} L${20+lw*0.22},${cy+8.4}" stroke="${ac}" stroke-width=".5"/><text x="20" y="${cy+12.6}" font-family="'Source Sans 3',Arial,sans-serif" font-weight="700" font-size="${Math.min(3.4,(lw-6)/(sub.length*0.62)).toFixed(2)}" fill="${ac==='#f2ead2'?ink:ac}" text-anchor="middle" letter-spacing=".3">${esc(sub)}</text>`;
 o+=`<rect x="0" y="${ly-2}" width="40" height="${lh+4}" fill="url(#${id}l)"/></g>`;
 // Glanzlichter
 o+=`<path d="M${20-O.bw+3.6},${O.ly-10} L${20-O.bw+3.6},${144}" stroke="#fff" stroke-opacity=".22" stroke-width="2" stroke-linecap="round"/><path d="M${L+1.6},${O.top+19} L${L+1.6},${O.neckBot-6}" stroke="#fff" stroke-opacity=".28" stroke-width="1.2" stroke-linecap="round"/>`;
 return o;
}
/* Weinglas (Box 44..88) */
function wineGlass(s,dx){
 const id='wq'+(++_w),c=s.liq,grp=s.grp;
 if(grp==='schaum'){ // Flöte
  const bowl=`M${dx+14},62 L${dx+30},62 C${dx+30},90 ${dx+28},110 ${dx+22},116 C${dx+16},110 ${dx+14},90 ${dx+14},62 Z`;
  let o=`<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(c,-0.25)}"/><stop offset=".4" stop-color="${shade(c,0.3)}"/><stop offset="1" stop-color="${shade(c,-0.2)}"/></linearGradient><clipPath id="${id}c"><path d="${bowl}"/></clipPath></defs>`;
  o+=`<ellipse cx="${dx+22}" cy="149" rx="11" ry="1.8" fill="#000" opacity=".15"/><g clip-path="url(#${id}c)"><rect x="${dx}" y="70" width="44" height="50" fill="url(#${id})"/><rect x="${dx}" y="68" width="44" height="3" fill="#fff" opacity=".7"/>`;
  for(let i=0;i<10;i++)o+=`<circle cx="${dx+18+((i*7)%9)}" cy="${76+((i*29)%36)}" r=".6" fill="#fff" opacity=".8"/>`;
  o+=`</g><path d="${bowl}" fill="#fff" fill-opacity=".08" stroke="#8a7e64" stroke-opacity=".45" stroke-width=".6"/><path d="M${dx+22},116 L${dx+22},146" stroke="#b9b2a0" stroke-width="1.3"/><ellipse cx="${dx+22}" cy="146.5" rx="9" ry="1.8" fill="#e9e4d6" stroke="#b9b2a0" stroke-width=".6"/><path d="M${dx+16.5},66 L${dx+16.8},96" stroke="#fff" stroke-opacity=".6" stroke-width="1"/>`;
  return o}
 const big=grp==='rot',top=big?66:72,w=big?17:14,by=big?112:110;
 const bowl=`M${dx+22-w},${top} C${dx+22-w-1.5},${top+22} ${dx+22-w+1},${by-6} ${dx+22},${by} C${dx+22+w-1},${by-6} ${dx+22+w+1.5},${top+22} ${dx+22+w},${top} Z`;
 const lvl=grp==='suess'?by-14:top+(big?26:22);
 let o=`<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(c,-0.35)}"/><stop offset=".35" stop-color="${shade(c,grp==='rot'?0.12:0.3)}"/><stop offset=".6" stop-color="${c}"/><stop offset="1" stop-color="${shade(c,-0.3)}"/></linearGradient><clipPath id="${id}c"><path d="${bowl}"/></clipPath></defs>`;
 o+=`<ellipse cx="${dx+22}" cy="149" rx="12" ry="1.8" fill="#000" opacity=".15"/><g clip-path="url(#${id}c)"><rect x="${dx}" y="${lvl}" width="44" height="${by-lvl+2}" fill="url(#${id})"/><ellipse cx="${dx+22}" cy="${lvl}" rx="${w}" ry="1.6" fill="${shade(c,0.25)}" opacity=".8"/></g>`;
 o+=`<path d="${bowl}" fill="#fff" fill-opacity=".07" stroke="#8a7e64" stroke-opacity=".45" stroke-width=".6"/><path d="M${dx+22},${by} L${dx+22},146" stroke="#b9b2a0" stroke-width="1.3"/><ellipse cx="${dx+22}" cy="146.5" rx="10" ry="1.9" fill="#e9e4d6" stroke="#b9b2a0" stroke-width=".6"/>`;
 o+=`<path d="M${dx+22-w+3},${top+4} C${dx+22-w+2},${top+18} ${dx+22-w+4},${by-14} ${dx+22-w+7},${by-8}" stroke="#fff" stroke-opacity=".55" stroke-width="1.1" fill="none"/>`;
 return o;
}
function wineSVG(b,kind){const s=b.svg;
 if(kind==='pair')return `<svg viewBox="-4 -4 96 158" xmlns="http://www.w3.org/2000/svg" class="bsvg">${wineBottle(s)}${wineGlass(s,44)}</svg>`;
 return `<svg viewBox="-6 -4 52 158" xmlns="http://www.w3.org/2000/svg" class="bsvg">${wineBottle(s)}</svg>`}
const WREG=[...new Set(WINES.map(w=>w.reg))];
window.HM_WINE={items:WINES,groups:WINE_GROUPS,grapes:G,svg:wineSVG,col:COL,
 newSvg:(st)=>({shape:st.grp==='schaum'?'skt':st.shape||'bur',glass:st.glass||'gr',label:st.label,accent:st.label2,ink:st.label2==='#ffffff'?'#1d1d1d':st.label2,liq:(G[st.style]||[0,COL[st.grp]])[1]||COL[st.grp],text:(st.brewery||st.name||'Wein').slice(0,16),sub:(st.style||'WEIN').toUpperCase(),grp:st.grp})};
window.wineSVG=wineSVG;
})();
