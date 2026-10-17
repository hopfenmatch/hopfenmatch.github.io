/* HopfenMatch – großer Bierkatalog
   Kompakte Rohdaten je Brauerei/Marke, beim Laden zu BEERS-Einträgen mit gezeichneten Flaschen (SVG) aufgeklappt.
   Brauerei: [Brauerei, Marke, Ort, Region, Land, Form, Glas, Etikett, Akzent, Schrift, [Biere]]
   Bier:     [Sorte (an Marke angehängt; '=' am Anfang = voller Name), Stil, % vol, {l:Etikett,a:Akzent,i:Schrift,s:Form,g:Glas,t:Etikett-Text,u:Unterzeile}] */
'use strict';
/* Stil-Metadaten: Farbe im Glas, Gruppe (Filter), dunkel/Weizen (Glasform), Beschreibungs-Vorlagen */
const STYLE_META={
 'Helles':{c:'#f3c236',g:'hell',t:['Goldgelbes Helles mit weicher Malzsüße und dezenter Hopfenherbe – süffig und rund.','Mildes, hellgoldenes Lagerbier mit feiner Getreidenote und ausgewogenem Abgang. Ein typisches Biergartenbier.']},
 'Lager':{c:'#efbd35',g:'hell',t:['Klares, erfrischendes Lagerbier mit leichtem Malzkörper und sauberem, trockenem Finish.','Hellgoldenes Lager: unkompliziert, spritzig und gut gekühlt am besten.']},
 'Light Lager':{c:'#f5d469',g:'hell',t:['Sehr leichtes, helles Lager mit wenig Bittere – spritzig und durstlöschend.']},
 'Export':{c:'#eab030',g:'hell',t:['Kräftiges Export mit vollem Malzkörper, feiner Hopfung und etwas mehr Stammwürze als ein Helles.','Goldenes Exportbier – vollmundig, rund und angenehm mild gehopft.']},
 'Landbier':{c:'#e09a2c',g:'hell',t:['Bernsteinfarbenes Landbier mit kräftigem Malzaroma und ehrlichem, bodenständigem Charakter.']},
 'Märzen':{c:'#d98a26',g:'hell',t:['Bernsteinfarbenes Märzen mit kräftigem Malz, leichter Karamellnote und weichem Abgang.','Vollmundiges Märzen – malzbetont, rund und mit einem Hauch Röstbrot.']},
 'Festbier':{c:'#e9a92a',g:'hell',t:['Goldenes Festbier mit etwas mehr Kraft: vollmundig-malzig und erstaunlich süffig.']},
 'Kellerbier':{c:'#dc8f2a',g:'hell',t:['Unfiltriertes, naturtrübes Kellerbier mit frischer Hefenote und kräftigem Malzkörper.','Naturtrüb und ungespundet im Charakter – würzig, mild gehopft und schön süffig.']},
 'Zwickel':{c:'#e2a030',g:'hell',t:['Naturtrübes Zwickelbier direkt aus dem Lagertank: frisch, hefig und mild.']},
 'Spezialbier':{c:'#cf7f24',g:'hell',t:['Regionale Spezialität mit eigenständigem Charakter – malzig, würzig und typisch für die Brauerei.']},
 'Pils':{c:'#f6d34c',g:'pils',t:['Goldgelbes Pils mit feinherber Hopfennote und trockenem, erfrischendem Abgang.','Klares, spritziges Pils mit blumigem Hopfenaroma und schlanker Bittere.']},
 'Kölsch':{c:'#f5cf4a',g:'ale',t:['Obergäriges Kölsch, hell und blank filtriert – leicht fruchtig, feinherb und traditionell aus der Stange getrunken.']},
 'Alt':{c:'#8a3a12',g:'ale',d:1,t:['Kupferfarbenes Altbier, obergärig gebraut – malzig-würzig mit herber Hopfennote im Abgang.']},
 'Weißbier':{c:'#eaa338',g:'weizen',w:1,t:['Naturtrübes Hefeweißbier mit fruchtigen Bananen- und Nelkenaromen, spritzig und vollmundig.','Bayerisches Hefeweizen mit cremigem Schaum, feiner Hefe und frischer Fruchtigkeit.']},
 'Kristallweizen':{c:'#f2c447',g:'weizen',w:1,t:['Blank filtriertes Kristallweizen – spritzig, fruchtig-frisch und besonders klar im Glas.']},
 'Dunkles Weißbier':{c:'#8d4a17',g:'weizen',w:1,d:1,t:['Dunkles Hefeweißbier mit Noten von Karamell, Brotkruste und reifer Banane.']},
 'Weizenbock':{c:'#c9741f',g:'weizen',w:1,t:['Starker Weizenbock mit Aromen von Banane, Nelke und Trockenfrüchten – kräftig und wärmend.']},
 'Berliner Weisse':{c:'#f2dc8a',g:'weizen',w:1,t:['Leichte, säuerlich-erfrischende Berliner Weisse – pur oder klassisch „mit Schuss“.']},
 'Gose':{c:'#efd27a',g:'weizen',w:1,t:['Leipziger Gose mit Koriander und einer Prise Salz – säuerlich, spritzig und ungewöhnlich.']},
 'Dunkel':{c:'#5a2a0f',g:'dunkel',d:1,t:['Dunkles Lagerbier mit Röstmalz, Brotkruste und dezenter Süße – mild und rund.','Kastanienbraunes Dunkles mit weichen Karamell- und Röstnoten.']},
 'Schwarzbier':{c:'#1a0c05',g:'dunkel',d:1,t:['Tiefschwarzes, untergäriges Schwarzbier mit milden Röstaromen und überraschend leichtem Körper.']},
 'Rauchbier':{c:'#5c240b',g:'dunkel',d:1,t:['Rauchbier aus über Buchenholz gedarrtem Malz – rauchig, deftig und unverwechselbar.']},
 'Stout':{c:'#1e0e07',g:'dunkel',d:1,t:['Tiefschwarzes Stout mit Röstaromen von Kaffee und dunkler Schokolade, cremig im Mundgefühl.']},
 'Imperial Stout':{c:'#140904',g:'dunkel',d:1,t:['Mächtiges Imperial Stout: ölig, schwer und voller Espresso-, Schokoladen- und Trockenfruchtaromen.']},
 'Porter':{c:'#2a1209',g:'dunkel',d:1,t:['Dunkelbraunes Porter mit Röstmalz, Kakao und leichter Süße – weich und gut trinkbar.']},
 'Baltic Porter':{c:'#22100a',g:'dunkel',d:1,t:['Starker, untergäriger Baltic Porter mit Noten von Pflaume, Lakritz und dunkler Schokolade.']},
 'Bock':{c:'#b8621c',g:'bock',t:['Kräftiger Bock mit vollem Malzkörper, feiner Süße und wärmendem Alkohol.']},
 'Maibock':{c:'#d98a26',g:'bock',t:['Heller Maibock: goldkupfern, malzig und kräftiger gehopft als ein klassischer Bock.']},
 'Doppelbock':{c:'#6a2c0e',g:'bock',d:1,t:['Starker Doppelbock mit Karamell, Trockenfrucht und Röstmalz – vollmundig und wärmend.','Dunkler, kräftiger Doppelbock in klösterlicher Tradition – malzsüß und schwer.']},
 'Eisbock':{c:'#4a1d0b',g:'bock',d:1,t:['Durch Ausfrieren konzentrierter Eisbock – likörartig, intensiv malzig und sehr stark.']},
 'Pale Ale':{c:'#e2952a',g:'ale',t:['Obergäriges Pale Ale mit fruchtigem Hopfenaroma, Malzrückgrat und angenehmer Bittere.']},
 'IPA':{c:'#e7a02c',g:'ale',t:['India Pale Ale mit kräftiger Hopfung – Noten von Zitrus, Harz und tropischen Früchten.']},
 'Session IPA':{c:'#eeb33a',g:'ale',t:['Leichtes Session IPA: viel Hopfenaroma bei wenig Alkohol.']},
 'Double IPA':{c:'#dc8a24',g:'ale',t:['Double IPA mit massiver Hopfung, hohem Alkohol und intensiven Frucht- und Harznoten.']},
 'NEIPA':{c:'#f0b640',g:'ale',t:['Trübes New England IPA – saftig, weich und voller Mango-, Pfirsich- und Zitrusaromen.']},
 'Amber':{c:'#c0601c',g:'ale',t:['Bernsteinfarbenes Bier mit Karamellmalz, nussigen Noten und ausgewogener Hopfung.']},
 'Red Ale':{c:'#a8441a',g:'ale',t:['Rötliches Ale mit Karamell- und Toffeenoten und sanfter Bittere.']},
 'Bitter':{c:'#c46a1e',g:'ale',t:['Britisches Bitter: kupferfarben, malzig mit erdigem englischem Hopfen.']},
 'Brown Ale':{c:'#6e3412',g:'ale',d:1,t:['Nussbraunes Ale mit Karamell- und Haselnussnoten, weich und mild.']},
 'Scotch Ale':{c:'#7a3412',g:'ale',d:1,t:['Schottisches Starkbier mit kräftigem Malz, Karamell und dezentem Whisky-Charakter.']},
 'Strong Ale':{c:'#9a4a18',g:'ale',d:1,t:['Kräftiges, aggressiv gehopftes Strong Ale mit vollem Malzkörper.']},
 'Belgisches Blonde':{c:'#ebb43a',g:'belgisch',t:['Belgisches Blonde mit fruchtiger Hefe, feiner Würze und spritziger Kohlensäure.']},
 'Belgisches Pale Ale':{c:'#d58a2a',g:'belgisch',t:['Belgisches Ale mit hefiger Würze, trockenem Finish und eigenständigem Charakter.']},
 'Tripel':{c:'#e6a630',g:'belgisch',t:['Goldenes Tripel nach Klostertradition – würzig, fruchtig und gefährlich süffig für seine Stärke.']},
 'Dubbel':{c:'#6a2a12',g:'belgisch',d:1,t:['Dunkles Dubbel mit Noten von Rosinen, Karamell und belgischer Hefe.']},
 'Quadrupel':{c:'#4a1a0c',g:'belgisch',d:1,t:['Schweres Quadrupel mit Feige, Pflaume, Kandis und warmer Würze – ein Bier zum Genießen.']},
 'Witbier':{c:'#f2d27a',g:'belgisch',w:1,t:['Trübes Witbier mit Koriander und Orangenschale – leicht, frisch und spritzig.']},
 'Saison':{c:'#e8b040',g:'belgisch',t:['Trockenes, würziges Saison mit pfeffriger Hefe und hoher Spritzigkeit.']},
 'Lambic':{c:'#c8603a',g:'belgisch',t:['Spontan vergorenes Lambic – sauer, komplex und typisch für das Brüsseler Umland.']},
 'Flanders Red':{c:'#8a2a18',g:'belgisch',d:1,t:['Flämisches Rotbraunes, im Holzfass gereift – fruchtig-sauer mit Kirsch- und Essignoten.']},
 'Bière de Garde':{c:'#cf8a2a',g:'belgisch',t:['Nordfranzösisches Lagerbier-Ale: malzig, würzig und lange gereift.']},
 'Alkoholfrei':{c:'#f2c94a',g:'leicht',t:['Alkoholfreie Variante mit vollem Biergeschmack – erfrischend, isotonisch und kalorienarm.']},
 'Radler':{c:'#f5d963',g:'leicht',t:['Spritzige Mischung aus Bier und Limonade – leicht, fruchtig und perfekt für heiße Tage.']}
};
const STYLE_GROUPS=[['hell','Hell & Lager'],['pils','Pils'],['weizen','Weizen'],['dunkel','Dunkel & Stout'],['bock','Bock'],['ale','Ale, IPA & Kölsch'],['belgisch','Belgisch'],['leicht','Alkoholfrei & Radler']];
const COUNTRIES={DE:['Deutschland','🇩🇪'],AT:['Österreich','🇦🇹'],CH:['Schweiz','🇨🇭'],CZ:['Tschechien','🇨🇿'],BE:['Belgien','🇧🇪'],NL:['Niederlande','🇳🇱'],DK:['Dänemark','🇩🇰'],SE:['Schweden','🇸🇪'],NO:['Norwegen','🇳🇴'],FI:['Finnland','🇫🇮'],IS:['Island','🇮🇸'],PL:['Polen','🇵🇱'],IE:['Irland','🇮🇪'],GB:['Großbritannien','🇬🇧'],US:['USA','🇺🇸'],CA:['Kanada','🇨🇦'],MX:['Mexiko','🇲🇽'],AR:['Argentinien','🇦🇷'],BR:['Brasilien','🇧🇷'],VE:['Venezuela','🇻🇪'],JM:['Jamaika','🇯🇲'],JP:['Japan','🇯🇵'],CN:['China','🇨🇳'],TH:['Thailand','🇹🇭'],SG:['Singapur','🇸🇬'],VN:['Vietnam','🇻🇳'],LA:['Laos','🇱🇦'],PH:['Philippinen','🇵🇭'],IN:['Indien','🇮🇳'],KR:['Südkorea','🇰🇷'],AU:['Australien','🇦🇺'],NZ:['Neuseeland','🇳🇿'],ZA:['Südafrika','🇿🇦'],TR:['Türkei','🇹🇷'],CY:['Zypern','🇨🇾'],GR:['Griechenland','🇬🇷'],IT:['Italien','🇮🇹'],ES:['Spanien','🇪🇸'],PT:['Portugal','🇵🇹'],FR:['Frankreich','🇫🇷'],SI:['Slowenien','🇸🇮'],HR:['Kroatien','🇭🇷'],HU:['Ungarn','🇭🇺'],RO:['Rumänien','🇷🇴'],LT:['Litauen','🇱🇹'],RU:['Russland','🇷🇺'],EE:['Estland','🇪🇪']};
/* HopfenMatch – großer Bierkatalog (real existierende Biere)
   Je Brauerei: [Brauerei, Marke, Ort, Region/Land, Länderkürzel, Flaschenform, Glas, Etikett, Akzent, Schrift, [Biere]]
   Je Bier: [Name (wird an die Marke gehängt; '=' am Anfang = vollständiger Name), Stil, Alkohol %, {Optionen}]
   Optionen: l=Etikett, a=Akzent, i=Schrift, s=Form, g=Glas, t=Etikett-Text, u=Untertitel */
const CATALOG_RAW=[
/* ===== Deutschland · München & Oberbayern ===== */
['Augustiner Bräu München','Augustiner','München','Bayern','DE','nrw','brown','#f3ead2','#1d6b3a','#7a1c14',[
 ['Pils','Pils',5.6],['Dunkel','Dunkel',5.6,{l:'#3a1a0e',i:'#f3ead2'}],['Weissbier','Weißbier',5.4],['Maximator','Doppelbock',7.5,{l:'#5a1410',i:'#f3ead2',a:'#c9a227'}],['Oktoberfestbier','Festbier',6.3],['Heller Bock','Bock',7.0,{l:'#f6e7a8'}]]],
['Paulaner Brauerei','Paulaner','München','Bayern','DE','nrw','brown','#f8f4ea','#1d4fa0','#1d4fa0',[
 ['Hefe-Weißbier Dunkel','Dunkles Weißbier',5.3,{s:'longneck',l:'#3b2414',i:'#f8f4ea'}],['Weißbier Alkoholfrei','Alkoholfrei',0.5,{s:'longneck',a:'#3a8dd6'}],['Salvator','Doppelbock',7.9,{l:'#2a2a6a',i:'#f2d27a',a:'#c9a227'}],['Original Münchner Dunkel','Dunkel',5.0,{l:'#2b1a10',i:'#f8f4ea'}],['Natur-Radler','Radler',2.5,{l:'#f6e27a',a:'#2f7d3a',i:'#1d4fa0'}],['Münchner Hell Alkoholfrei 0,0','Alkoholfrei',0.0,{a:'#3a8dd6'}],['Weißbier Kristallklar','Kristallweizen',5.2,{s:'longneck'}],['Oktoberfest Märzen','Märzen',5.8,{l:'#f2e3c0'}]]],
['Hacker-Pschorr Bräu','Hacker-Pschorr','München','Bayern','DE','nrw','brown','#f6f1e3','#7a1c22','#7a1c22',[
 ['Münchner Hell','Helles',5.0],['Münchner Gold','Export',5.5,{l:'#efe0b0'}],['Hefe Weisse','Weißbier',5.5],['Weisse Dunkel','Dunkles Weißbier',5.3,{l:'#3a2316',i:'#f6f1e3'}],['Animator','Doppelbock',8.1,{l:'#3a1410',i:'#e9cf8a',a:'#c9a24a'}],['Oktoberfest Märzen','Märzen',5.8],['Superior','Festbier',6.0],['Münchner Kellerbier Anno 1417','Kellerbier',5.5,{s:'swing',l:'#efe2c4'}],['Münchner Dunkel','Dunkel',5.0,{l:'#2e1a10',i:'#f6f1e3'}],['Natur Radler','Radler',2.5,{l:'#f6e27a'}]]],
['Spaten-Franziskaner-Bräu','Spaten','München','Bayern','DE','nrw','brown','#f8f5ec','#14408f','#14408f',[
 ['Oktoberfestbier','Festbier',5.9],['Optimator','Doppelbock',7.6,{l:'#2a1a12',i:'#e8cf8a',a:'#c9a24a'}],['Münchner Dunkel','Dunkel',5.1,{l:'#241812',i:'#f8f5ec'}],['Pils','Pils',5.0]]],
['Spaten-Franziskaner-Bräu','Franziskaner','München','Bayern','DE','longneck','brown','#fdfaf2','#e0701e','#3a2a1a',[
 ['Hefe-Weissbier Dunkel','Dunkles Weißbier',5.0,{l:'#3a2314',i:'#fdfaf2'}],['Weissbier Kristallklar','Kristallweizen',5.0],['Weissbier Alkoholfrei','Alkoholfrei',0.5,{a:'#2a7bc0'}],['Royal Jahrgangsweisse','Weißbier',5.5,{l:'#1f2a44',i:'#f2d27a',a:'#c9a24a'}]]],
['Löwenbräu München','Löwenbräu','München','Bayern','DE','nrw','brown','#1e3f86','#d9b44a','#f5e9c6',[
 ['Oktoberfestbier','Festbier',6.1],['Triumphator','Doppelbock',7.6,{l:'#3a1410'}],['Hefe Weissbier','Weißbier',5.2,{s:'longneck'}],['Urtyp','Export',5.4,{l:'#f5ecd2',i:'#1e3f86'}]]],
['Staatliches Hofbräuhaus München','Hofbräu','München','Bayern','DE','nrw','brown','#fbf8f0','#2b5aa6','#123a7a',[
 ['Dunkel','Dunkel',5.5,{l:'#2a1c12',i:'#f5ecd2'}],['Münchner Weisse','Weißbier',5.1,{s:'longneck'}],['Oktoberfestbier','Festbier',6.3],['Maibock','Bock',7.2,{l:'#f2e2a6'}],['Schwarze Weisse','Dunkles Weißbier',5.1,{s:'longneck',l:'#22180f',i:'#f5ecd2'}]]],
['Brauerei Tegernsee','Tegernseer','Tegernsee','Bayern','DE','nrw','brown','#eef3f6','#1d3f7a','#1d3f7a',[
 ['Dunkel Export','Dunkel',5.5,{l:'#2a1c14',i:'#eef3f6'}],['Max I. Joseph','Festbier',6.4,{l:'#f3ead2'}]]],
['Brauerei Aying','Ayinger','Aying','Bayern','DE','nrw','brown','#f7f4ec','#1f3d7a','#1f3d7a',[
 ['Bräuweisse','Weißbier',5.1,{s:'longneck'}],['Jahrhundert-Bier','Export',5.5],['Lager Hell','Helles',4.9],['Urweisse','Dunkles Weißbier',5.8,{s:'longneck',l:'#e6d2a8'}],['Oktober Fest-Märzen','Märzen',5.8,{l:'#f1e2bf'}],['Altbairisch Dunkel','Dunkel',5.0,{l:'#2b1c12',i:'#f7f4ec'}],['Winterbock','Bock',6.7,{l:'#3a1d12',i:'#f2d27a'}],['Weizenbock','Weizenbock',7.1,{s:'longneck',l:'#5a2d14',i:'#f7f4ec'}]]],
['Schneider Weisse','Schneider Weisse','Kelheim','Bayern','DE','longneck','brown','#f6efe1','#9b1b1f','#2a1a12',[
 ['TAP 1 Meine Blonde Weisse','Weißbier',4.9,{a:'#e2b62a',t:'Schneider',u:'TAP 1 BLONDE WEISSE'}],['TAP 2 Mein Kristall','Kristallweizen',5.3,{a:'#5f9fd0',t:'Schneider',u:'TAP 2 KRISTALL'}],['TAP 3 Mein Alkoholfreies','Alkoholfrei',0.5,{a:'#6aa83e',t:'Schneider',u:'TAP 3 ALKOHOLFREI'}],['TAP 4 Meine Festweisse','Weißbier',6.2,{a:'#2e8b57',t:'Schneider',u:'TAP 4 FESTWEISSE'}],['TAP 5 Meine Hopfenweisse','Weizenbock',8.2,{a:'#3e7c3a',t:'Schneider',u:'TAP 5 HOPFENWEISSE'}],['TAP 6 Unser Aventinus','Weizenbock',8.2,{l:'#5a1a16',a:'#c9a24a',i:'#f2e2b8',t:'Aventinus',u:'TAP 6 WEIZENDOPPELBOCK'}],['=Aventinus Weizen-Eisbock','Eisbock',12.0,{l:'#2a120c',a:'#c9a24a',i:'#f2e2b8',t:'Aventinus',u:'WEIZEN-EISBOCK'}]]],
['Bayerische Staatsbrauerei Weihenstephan','Weihenstephaner','Freising','Bayern','DE','longneck','brown','#fbf6e8','#1c3f7a','#1c3f7a',[
 ['Hefeweissbier Dunkel','Dunkles Weißbier',5.3,{l:'#3a2414',i:'#fbf6e8'}],['Kristallweissbier','Kristallweizen',5.4],['Original Helles','Helles',5.1,{s:'nrw'}],['Pilsner','Pils',5.1,{s:'nrw',a:'#2e6b2f'}],['Korbinian','Doppelbock',7.4,{s:'nrw',l:'#3a1d10',i:'#f2d27a',a:'#c9a24a'}],['Festbier','Festbier',5.8,{s:'nrw'}],['Hefeweissbier Alkoholfrei','Alkoholfrei',0.5,{a:'#3a8dd6'}],['Tradition Bayrisch Dunkel','Dunkel',5.2,{s:'nrw',l:'#2b1c12',i:'#fbf6e8'}]]],
['Erdinger Weißbräu','Erdinger','Erding','Bayern','DE','longneck','brown','#f7f1df','#12407a','#12407a',[
 ['Dunkel','Dunkles Weißbier',5.3,{l:'#2a1a12',i:'#f7f1df',a:'#c8a74a'}],['Alkoholfrei','Alkoholfrei',0.4,{a:'#2a7bc0',l:'#eef5fb'}],['Kristallklar','Kristallweizen',5.3],['Pikantus','Weizenbock',7.3,{l:'#5a2a14',i:'#f7f1df'}],['Urweisse','Weißbier',4.9,{l:'#efe2c0'}],['Oktoberfest Weißbier','Weißbier',5.7,{l:'#e9eef6'}]]],
['Klosterbrauerei Andechs','Andechser','Andechs','Bayern','DE','nrw','brown','#f6efe0','#7c1d1a','#7c1d1a',[
 ['Vollbier Hell','Helles',4.8],['Weissbier Hefetrüb','Weißbier',5.5,{s:'longneck'}],['Bergbock Hell','Bock',6.9,{l:'#f2e2a6'}],['Spezial Hell','Export',5.9],['Dunkles Weissbier','Dunkles Weißbier',5.0,{s:'longneck',l:'#3a2416',i:'#f6efe0'}]]],
['Klosterbrauerei Ettal','Ettaler','Ettal','Bayern','DE','nrw','brown','#2a1c14','#c9a24a','#efd9a0',[
 ['Curator','Doppelbock',7.0]]],
['Klosterbrauerei Weltenburg','Weltenburger','Kelheim-Weltenburg','Bayern','DE','nrw','brown','#f4ecd6','#5a2a14','#5a2a14',[
 ['Kloster Barock Dunkel','Dunkel',4.7,{l:'#2b1a10',i:'#f4ecd6',a:'#c9a24a'}],['Kloster Asam Bock','Doppelbock',6.9,{l:'#4a1a10',i:'#f4ecd6',a:'#c9a24a'}],['Kloster Anno 1050','Märzen',5.5],['Kloster Hefe-Weissbier Hell','Weißbier',5.4,{s:'longneck'}],['Kloster Barock Hell','Helles',5.2]]],
['Brauerei Unertl','Unertl','Haag in Oberbayern','Bayern','DE','longneck','brown','#f4ead0','#b3241c','#3a1a10',[
 ['Weissbier','Weißbier',4.8]]],
['Crew Republic','Crew Republic','Unterschleißheim','Bayern','DE','can','brown','#1f1f1f','#f2c230','#f2c230',[
 ['Foundation 11','Pale Ale',5.6,{l:'#e8a33a',i:'#1f1f1f'}],['Drunken Sailor','IPA',6.4,{l:'#1d5f8a',i:'#ffffff'}],['Roundhouse Kick','Stout',9.2,{l:'#141414',i:'#e3c46a'}]]],
['Private Landbrauerei Schönram','Schönramer','Schönram','Bayern','DE','nrw','brown','#f4efe1','#2e6b2f','#2e6b2f',[
 ['Hell','Helles',5.0,{a:'#1d4fa0',i:'#1d4fa0'}],['Saphir Bock','Bock',8.0,{l:'#1f3f6a',i:'#f4efe1'}]]],
['Hofbräuhaus Berchtesgaden','Berchtesgadener','Berchtesgaden','Bayern','DE','nrw','brown','#f3f0e6','#1d5a3a','#1d5a3a',[
 ['Hell','Helles',5.2]]],
['Hofbrauhaus Freising','Huber Weisses','Freising','Bayern','DE','longneck','brown','#f5ecd2','#b02a1f','#3a1a10',[
 ['Original','Weißbier',5.4]]],
['Brauerei Kaltenberg','König Ludwig','Kaltenberg','Bayern','DE','longneck','brown','#1c2a5a','#d6b24c','#f5e6b8',[
 ['Weissbier Hell','Weißbier',5.5],['Dunkel','Dunkel',5.1,{s:'nrw',l:'#2a1810'}]]],
['Benediktiner Weissbräu','Benediktiner','Ettal','Bayern','DE','longneck','brown','#f6efe0','#1f3d6a','#1f3d6a',[
 ['Weissbier Naturtrüb','Weißbier',5.4],['Hell','Helles',5.0,{s:'nrw'}],['Weissbier Dunkel','Dunkles Weißbier',5.4,{l:'#2e1c12',i:'#f6efe0'}]]],
['Brauerei Gebr. Maisel','Maisel\'s Weisse','Bayreuth','Franken','DE','longneck','brown','#f4ead6','#7a1f2a','#7a1f2a',[
 ['Original','Weißbier',5.2],['Dunkel','Dunkles Weißbier',5.2,{l:'#3a2014',i:'#f4ead6'}],['Alkoholfrei','Alkoholfrei',0.5,{a:'#2a7bc0'}],['Kristall','Kristallweizen',5.1]]],
['Bayreuther Bierbrauerei','Bayreuther','Bayreuth','Franken','DE','swing','brown','#f2ead2','#1c3f6a','#1c3f6a',[
 ['Hell','Helles',4.9]]],
['Brauerei Riegele','Riegele','Augsburg','Bayern','DE','nrw','brown','#f6f0e2','#8a1c1c','#8a1c1c',[
 ['Augustus','Weizenbock',8.0,{s:'longneck',l:'#4a1d12',i:'#f2d27a'}],['Commerzienrat Privat','Helles',5.0],['Feines Urhell','Helles',4.7,{a:'#1d4fa0',i:'#1d4fa0'}],['Aechtes Dunkel','Dunkel',5.0,{l:'#2a1810',i:'#f6f0e2'}]]],
['Allgäuer Brauhaus','Allgäuer','Kempten','Bayern','DE','nrw','brown','#f2e9cf','#1f4f2f','#1f4f2f',[
 ['Büble Bier Edelbräu','Export',5.5]]],
['Bischofshof Regensburg','Bischofshof','Regensburg','Bayern','DE','longneck','brown','#f3ecda','#7a1c22','#7a1c22',[
 ['Hefe-Weißbier','Weißbier',5.1]]],
['Brauerei Kneitinger','Kneitinger','Regensburg','Bayern','DE','nrw','brown','#f4ead2','#2a5a2a','#2a5a2a',[
 ['Bock','Bock',6.8,{l:'#3a1d12',i:'#f4ead2'}]]],
['Brauerei Michael Plank','Plank','Laaber','Bayern','DE','longneck','brown','#f5edd8','#1d3f7a','#1d3f7a',[
 ['Heller Weizenbock','Weizenbock',7.8],['Hefeweizen','Weißbier',5.0]]],
['Brauerei Gutmann','Gutmann','Titting','Bayern','DE','longneck','brown','#f4ecd8','#1c4f8a','#1c4f8a',[
 ['Hefeweizen','Weißbier',5.2],['Dunkles Hefeweizen','Dunkles Weißbier',5.2,{l:'#30200f',i:'#f4ecd8'}],['Weizenbock','Weizenbock',7.2,{l:'#5a2d14',i:'#f4ecd8'}]]],
['Kuchlbauer','Kuchlbauer','Abensberg','Bayern','DE','longneck','brown','#f3e9cf','#1d5a8a','#1d5a8a',[
 ['Weisse','Weißbier',5.0]]],
['Neumarkter Lammsbräu','Lammsbräu','Neumarkt','Bayern','DE','nrw','brown','#f2f0e2','#3a7a2a','#3a7a2a',[
 ['Pilsner','Pils',4.7]]],
['Oettinger Brauerei','Oettinger','Oettingen','Bayern','DE','nrw','brown','#f7f3e6','#c8102e','#1c3f7a',[
 ['Pils','Pils',4.7,{g:'green'}],['Hefeweißbier','Weißbier',4.9,{s:'longneck'}],['Export','Export',5.4],['Radler','Radler',2.5,{l:'#f6e27a'}]]],
/* ===== Franken ===== */
['Brauerei Heller-Trum','Schlenkerla','Bamberg','Franken','DE','nrw','brown','#efe3c4','#7a1a12','#3b1308',[
 ['Urbock','Rauchbier',6.5,{l:'#3a1810',i:'#efe3c4'}],['Helles Lagerbier','Helles',4.3],['Weizen','Rauchbier',5.2,{s:'longneck'}],['Eiche Doppelbock','Doppelbock',8.0,{l:'#2a120c',i:'#efe3c4'}]]],
['Brauerei Spezial','Spezial','Bamberg','Franken','DE','nrw','brown','#f2e6c8','#1a3a6a','#1a3a6a',[
 ['Rauchbier Lager','Rauchbier',4.9],['Rauchbier Märzen','Rauchbier',5.3,{l:'#e2c89a'}]]],
['Mahrs Bräu Bamberg','Mahrs Bräu','Bamberg','Franken','DE','nrw','brown','#f7f4ea','#111111','#111111',[
 ['Helles','Helles',4.9],['Pils','Pils',4.9,{a:'#2e6b2f'}]]],
['Brauerei Keesmann','Keesmann','Bamberg','Franken','DE','nrw','brown','#f4efe0','#1d5a2a','#1d5a2a',[
 ['Herren Pils','Pils',4.6]]],
['Brauerei Fässla','Fässla','Bamberg','Franken','DE','nrw','brown','#f2e8cc','#8a1c1c','#8a1c1c',[
 ['Lagerbier','Lager',5.5]]],
['Kaiserdom Privatbrauerei','Kaiserdom','Bamberg','Franken','DE','nrw','green','#fbf8ef','#a3192b','#a3192b',[
 ['Pilsener','Pils',4.8]]],
['St. Georgen Bräu','St. Georgen','Buttenheim','Franken','DE','swing','brown','#f1e2bf','#6a2a12','#4a1d0b',[
 ['Keller Bier','Kellerbier',4.9]]],
['Kulmbacher Brauerei','Mönchshof','Kulmbach','Franken','DE','swing','brown','#f1e2bf','#8a3b12','#5a220b',[
 ['Original Pils','Pils',4.9],['Schwarzbier','Schwarzbier',4.9,{l:'#1e1610',i:'#e9cf8a'}],['Landbier','Landbier',5.4],['Kellerbier Alkoholfrei','Alkoholfrei',0.5,{a:'#2a7bc0'}]]],
['Kulmbacher Brauerei','Kulmbacher','Kulmbach','Franken','DE','nrw','brown','#f6f1e4','#a8192c','#a8192c',[
 ['Edelherb Pils','Pils',4.9,{g:'green'}],['Eisbock','Eisbock',9.2,{l:'#3a1610',i:'#f2d27a'}]]],
['Kulmbacher Brauerei','Kapuziner','Kulmbach','Franken','DE','longneck','brown','#f5ead2','#7a3a14','#4a220b',[
 ['Weißbier','Weißbier',5.4]]],
['Kulmbacher Brauerei','EKU','Kulmbach','Franken','DE','nrw','brown','#1d1a3a','#d6b24c','#f2e2b0',[
 ['28','Doppelbock',11.0,{t:'EKU 28',u:'KULMINATOR'}]]],
['Brauerei Tucher','Tucher','Nürnberg','Franken','DE','nrw','brown','#f6f1e2','#1c3f7a','#1c3f7a',[
 ['Helles Hefe Weizen','Weißbier',5.2,{s:'longneck'}],['Übersee Export','Export',5.5],['Pilsener','Pils',4.9,{g:'green'}]]],
['Würzburger Hofbräu','Würzburger Hofbräu','Würzburg','Franken','DE','nrw','brown','#f4efe2','#9a1c2a','#9a1c2a',[
 ['Premium Pilsner','Pils',4.9,{t:'Würzburger'}],['Sympator','Doppelbock',7.9,{t:'Würzburger',l:'#3a1810',i:'#f2d27a'}]]],
['Distelhäuser Brauerei','Distelhäuser','Distelhausen','Baden-Württemberg','DE','nrw','brown','#f3efe2','#1c4a2a','#1c4a2a',[
 ['Pils','Pils',4.9],['Landbier','Landbier',5.1,{l:'#efe0bc'}]]],
/* ===== Baden-Württemberg ===== */
['Badische Staatsbrauerei Rothaus','Rothaus','Grafenhausen','Schwarzwald','DE','steinie','brown','#f6efdd','#b3241c','#b3241c',[
 ['Hefeweizen','Weißbier',5.4,{s:'longneck'}],['=Rothaus Eiszäpfle','Märzen',5.6,{t:'Eiszäpfle',u:'MÄRZEN EXPORT',a:'#1d4fa0'}],['Pils Alkoholfrei','Alkoholfrei',0.4,{a:'#2a7bc0'}]]],
['Fürstlich Fürstenbergische Brauerei','Fürstenberg','Donaueschingen','Baden-Württemberg','DE','nrw','green','#fbf7ec','#1f3f6a','#1f3f6a',[
 ['Premium Pilsener','Pils',4.8]]],
['Alpirsbacher Klosterbräu','Alpirsbacher','Alpirsbach','Schwarzwald','DE','nrw','brown','#f4efe1','#1c3f7a','#1c3f7a',[
 ['Klosterbräu Pils','Pils',4.9],['Spezial','Export',5.2],['Klosterweisse','Weißbier',5.2,{s:'longneck'}]]],
['Privatbrauerei Waldhaus','Waldhaus','Waldhaus','Schwarzwald','DE','nrw','brown','#f2ecd8','#1d4a2a','#1d4a2a',[
 ['Diplom Pils','Pils',4.9]]],
['Dinkelacker-Schwabenbräu','Dinkelacker','Stuttgart','Baden-Württemberg','DE','nrw','brown','#fbf6ea','#b11f24','#b11f24',[
 ['CD-Pils','Pils',4.9]]],
['Stuttgarter Hofbräu','Stuttgarter Hofbräu','Stuttgart','Baden-Württemberg','DE','nrw','brown','#f6f0e2','#1c3f7a','#1c3f7a',[
 ['Herrenpils','Pils',4.9,{t:'Hofbräu'}]]],
['Meckatzer Löwenbräu','Meckatzer','Heimenkirch','Allgäu','DE','nrw','brown','#f4ead0','#1c4f2a','#1c4f2a',[
 ['Weiss-Gold','Helles',5.2]]],
['Welde Braumanufaktur','Welde','Plankstadt','Baden-Württemberg','DE','nrw','brown','#f6f2e6','#1d2f5a','#1d2f5a',[
 ['No. 1 Premium Pils','Pils',4.8]]],
['Eichbaum Brauereien','Eichbaum','Mannheim','Baden-Württemberg','DE','nrw','green','#fbf7ec','#1f5a2a','#1f5a2a',[
 ['Ureich Pils','Pils',4.9]]],
['Brauerei Ganter','Ganter','Freiburg','Baden-Württemberg','DE','nrw','brown','#f6f0e0','#b0191f','#b0191f',[
 ['Pilsner','Pils',4.8]]],
/* ===== Hessen, Pfalz, Saar ===== */
['Licher Privatbrauerei','Licher','Lich','Hessen','DE','longneck','green','#f6f2e4','#1f4f2a','#1f4f2a',[
 ['Pilsner','Pils',4.9],['Weizen','Weißbier',5.4,{g:'brown',a:'#c9a227'}]]],
['Binding-Brauerei','Binding','Frankfurt am Main','Hessen','DE','nrw','green','#fbf7ec','#b3241c','#b3241c',[
 ['Römer Pils','Pils',4.9]]],
['Henninger','Henninger','Frankfurt am Main','Hessen','DE','longneck','green','#fbf7ec','#c8102e','#1c3f7a',[
 ['Kaiser Pilsner','Pils',4.9]]],
['Binding-Brauerei','Schöfferhofer','Frankfurt am Main','Hessen','DE','longneck','brown','#1c3f7a','#d6b24c','#ffffff',[
 ['Hefeweizen','Weißbier',5.0],['Grapefruit','Radler',2.5,{l:'#e85a6a',a:'#f6e27a'}],['Kristallweizen','Kristallweizen',5.0,{l:'#eef3f8',i:'#1c3f7a'}],['Hefeweizen Dunkel','Dunkles Weißbier',5.0,{l:'#2a1a12'}]]],
['Clausthaler','Clausthaler','Frankfurt am Main','Hessen','DE','longneck','green','#f6f2e4','#c8102e','#1c3f7a',[
 ['Original','Alkoholfrei',0.45]]],
['Pfungstädter Brauerei','Pfungstädter','Pfungstadt','Hessen','DE','nrw','green','#f6f2e4','#1c3f7a','#1c3f7a',[
 ['Edel-Pils','Pils',4.8]]],
['Bitburger Brauerei','Bitburger','Bitburg','Eifel','DE','longneck','green','#fbf8ef','#a8192c','#1a1a1a',[
 ['0,0% Alkoholfrei','Alkoholfrei',0.0,{a:'#2a7bc0'}],['Radler','Radler',2.5,{l:'#f6e27a'}]]],
['Königsbacher Brauerei','Königsbacher','Koblenz','Rheinland-Pfalz','DE','nrw','green','#fbf7ec','#1f3f6a','#1f3f6a',[
 ['Pils','Pils',4.9]]],
['Karlsberg Brauerei','Karlsberg','Homburg','Saarland','DE','nrw','brown','#f6f0e0','#c8102e','#1c3f7a',[
 ['UrPils','Pils',4.8],['=Mixery','Radler',3.1,{s:'can',l:'#141414',i:'#e5322d',t:'MIXERY',u:'BIER + COLA'}]]],
['Park & Bellheimer','Park','Pirmasens','Pfalz','DE','nrw','green','#fbf7ec','#1f5a2a','#1f5a2a',[
 ['Pilsener','Pils',4.6]]],
['Privatbrauerei Kirner','Kirner','Kirn','Rheinland-Pfalz','DE','nrw','brown','#f6f0e0','#1c3f7a','#1c3f7a',[
 ['Pils','Pils',4.8]]],
/* ===== Nordrhein-Westfalen: Pils ===== */
['Krombacher Brauerei','Krombacher','Kreuztal','Siegerland','DE','longneck','green','#fbf8ef','#0f5a32','#0f5a32',[
 ['Weizen','Weißbier',5.3,{g:'brown'}],['Alkoholfrei','Alkoholfrei',0.5,{a:'#2a7bc0'}],['Radler','Radler',2.5,{l:'#f6e27a'}],['Hell','Helles',5.0,{g:'brown',a:'#c9a227'}]]],
['Warsteiner Brauerei','Warsteiner','Warstein','Sauerland','DE','longneck','green','#fbf8ef','#a3192b','#1c2f5a',[
 ['Premium Pilsener','Pils',4.8],['Herb','Pils',4.8,{a:'#1f5a2a'}],['Radler','Radler',2.5,{l:'#f6e27a'}]]],
['Brauerei C. & A. Veltins','Veltins','Meschede-Grevenstein','Sauerland','DE','longneck','green','#fbf8ef','#0b5c3b','#0b5c3b',[
 ['Pilsener','Pils',4.8],['Helles','Helles',4.9,{g:'brown',a:'#c9a227'}],['V+ Lemon','Radler',2.5,{s:'can',l:'#f2e25a',i:'#0b5c3b'}]]],
['Brauerei C. & A. Veltins','Grevensteiner','Meschede-Grevenstein','Sauerland','DE','nrw','brown','#efe2c0','#5a2a14','#5a2a14',[
 ['Original','Landbier',5.3]]],
['König-Brauerei','König Pilsener','Duisburg','Ruhrgebiet','DE','longneck','green','#fbf8ef','#14306b','#14306b',[
 ['=König Pilsener','Pils',4.9,{t:'KöPi',u:'KÖNIG PILSENER'}]]],
['Radeberger Gruppe','DAB','Dortmund','Ruhrgebiet','DE','nrw','green','#fbf8ef','#c8102e','#1c2f5a',[
 ['Original','Pils',4.8]]],
['Radeberger Gruppe','Brinkhoff\'s','Dortmund','Ruhrgebiet','DE','nrw','green','#1c3f2a','#d6b24c','#f2e2b0',[
 ['No. 1','Pils',5.0]]],
['Dortmunder Actien-Brauerei','Dortmunder Union','Dortmund','Ruhrgebiet','DE','nrw','brown','#f6efdc','#b3241c','#b3241c',[
 ['Export','Export',5.1,{t:'Union'}]]],
['Hövels Hausbrauerei','Hövels','Dortmund','Ruhrgebiet','DE','nrw','brown','#f2e6c8','#7a1c14','#7a1c14',[
 ['Original','Amber',5.5]]],
['Privatbrauerei Moritz Fiege','Fiege','Bochum','Ruhrgebiet','DE','nrw','brown','#f6f2e4','#1c3f7a','#1c3f7a',[
 ['Pils','Pils',4.9],['Gründer','Kellerbier',5.0,{l:'#efe2c0'}]]],
['Privatbrauerei Jacob Stauder','Stauder','Essen','Ruhrgebiet','DE','nrw','green','#fbf8ef','#1f3f6a','#1f3f6a',[
 ['Pils','Pils',4.6]]],
['Herforder Brauerei','Herforder','Hiddenhausen','Ostwestfalen','DE','longneck','green','#fbf8ef','#1f5a2a','#1f5a2a',[
 ['Pils','Pils',4.8]]],
['Iserlohner Brauerei','Iserlohner','Iserlohn','Sauerland','DE','nrw','green','#fbf8ef','#a3192b','#a3192b',[
 ['Pilsener','Pils',4.8]]],
['Wicküler','Wicküler','Wuppertal','Bergisches Land','DE','nrw','green','#fbf8ef','#c8102e','#c8102e',[
 ['Pilsener','Pils',4.9]]],
['Brauerei Pott\'s','Pott\'s','Oelde','Münsterland','DE','nrw','green','#fbf8ef','#1c3f7a','#1c3f7a',[
 ['Pilsener','Pils',4.8]]],
['Brauerei Rolinck','Rolinck','Steinfurt','Münsterland','DE','nrw','green','#fbf8ef','#1f4f2a','#1f4f2a',[
 ['Pilsener','Pils',4.8]]],
['Privatbrauerei Barre','Barre','Lübbecke','Ostwestfalen','DE','nrw','green','#fbf8ef','#a8192c','#a8192c',[
 ['Pilsener','Pils',4.8]]],
['Paderborner Brauerei','Paderborner','Paderborn','Ostwestfalen','DE','nrw','green','#fbf8ef','#1f4f2a','#1f4f2a',[
 ['Pilsener','Pils',4.8]]],
/* ===== Altbier ===== */
['Diebels','Diebels','Issum','Niederrhein','DE','nrw','brown','#f2e6c8','#7a1c14','#7a1c14',[
 ['Alt','Alt',4.9]]],
['Frankenheim','Frankenheim','Düsseldorf','Niederrhein','DE','nrw','brown','#f4ead2','#1c3f7a','#1c3f7a',[
 ['Alt','Alt',4.8]]],
['Brauerei Zum Uerige','Uerige','Düsseldorf','Niederrhein','DE','swing','brown','#f2e6c8','#5a2a14','#5a2a14',[
 ['Alt','Alt',4.7],['Sticke','Alt',6.0,{l:'#3a2014',i:'#f2e6c8'}]]],
['Brauerei Im Füchschen','Füchschen','Düsseldorf','Niederrhein','DE','nrw','brown','#f2e6c8','#b3241c','#b3241c',[
 ['Alt','Alt',4.5]]],
['Brauerei Schumacher','Schumacher','Düsseldorf','Niederrhein','DE','swing','brown','#f2e6c8','#1f4f2a','#1f4f2a',[
 ['Alt','Alt',4.6]]],
['Brauerei Zum Schlüssel','Schlüssel','Düsseldorf','Niederrhein','DE','nrw','brown','#f2e6c8','#7a3a14','#7a3a14',[
 ['Alt','Alt',5.0]]],
['Hannen Brauerei','Hannen','Mönchengladbach','Niederrhein','DE','nrw','brown','#f4ead2','#a3192b','#a3192b',[
 ['Alt','Alt',4.9]]],
['Privatbrauerei Bolten','Bolten','Korschenbroich','Niederrhein','DE','swing','brown','#f2e6c8','#1c3f7a','#1c3f7a',[
 ['Ur-Alt','Alt',4.9]]],
/* ===== Kölsch ===== */
['Cölner Hofbräu Früh','Früh','Köln','Rheinland','DE','nrw','brown','#fbf7ee','#c8102e','#c8102e',[
 ['Kölsch','Kölsch',4.8]]],
['Brauerei Heinrich Reissdorf','Reissdorf','Köln','Rheinland','DE','nrw','brown','#fbf7ee','#1c3f7a','#c8102e',[
 ['Kölsch','Kölsch',4.8]]],
['Privatbrauerei Gaffel','Gaffel','Köln','Rheinland','DE','nrw','brown','#fbf7ee','#1f4f9a','#1f4f9a',[
 ['Kölsch','Kölsch',4.8]]],
['Sion Kölsch','Sion','Köln','Rheinland','DE','nrw','brown','#fbf7ee','#14306b','#14306b',[
 ['Kölsch','Kölsch',4.8]]],
['Brauerei zur Malzmühle','Mühlen','Köln','Rheinland','DE','nrw','brown','#f6efdc','#5a2a14','#5a2a14',[
 ['Kölsch','Kölsch',4.8]]],
['Brauerei Päffgen','Päffgen','Köln','Rheinland','DE','nrw','brown','#f6efdc','#1f4f2a','#1f4f2a',[
 ['Kölsch','Kölsch',4.8]]],
['Peters Brauhaus','Peters','Köln','Rheinland','DE','nrw','brown','#fbf7ee','#a3192b','#1c2f5a',[
 ['Kölsch','Kölsch',4.8]]],
['Radeberger Gruppe','Dom','Köln','Rheinland','DE','nrw','brown','#fbf7ee','#c9a227','#1c2f5a',[
 ['Kölsch','Kölsch',4.8]]],
['Gebr. Sünner','Sünner','Köln','Rheinland','DE','nrw','brown','#fbf7ee','#1f4f2a','#c8102e',[
 ['Kölsch','Kölsch',4.8]]],
['Radeberger Gruppe','Gilden','Köln','Rheinland','DE','nrw','brown','#fbf7ee','#c8102e','#1c2f5a',[
 ['Kölsch','Kölsch',4.8]]],
['Radeberger Gruppe','Küppers','Köln','Rheinland','DE','nrw','brown','#fbf7ee','#1c3f7a','#1c3f7a',[
 ['Kölsch','Kölsch',4.8]]],
/* ===== Norden & Osten ===== */
['Friesisches Brauhaus zu Jever','Jever','Jever','Friesland','DE','longneck','green','#173f2a','#c9b26a','#f1e6c2',[
 ['Fun','Alkoholfrei',0.5,{l:'#eef3ea',i:'#173f2a',a:'#2a7bc0'}]]],
['Brauerei Beck','Beck\'s','Bremen','Bremen','DE','longneck','green','#0f6b3a','#c8102e','#ffffff',[
 ['Gold','Pils',4.9,{l:'#c9a227',i:'#0f3a22'}],['Blue','Alkoholfrei',0.0,{l:'#1c4f9a'}],['Green Lemon','Radler',2.5,{l:'#9bd14a',i:'#0f3a22'}],['Unfiltered','Pils',5.0,{l:'#efe2c0',i:'#0f6b3a'}]]],
['Brauerei Beck','Haake-Beck','Bremen','Bremen','DE','longneck','green','#fbf8ef','#c8102e','#1f4f2a',[
 ['Pils','Pils',4.9],['Kräusen','Pils',4.9,{g:'brown',l:'#efe2c0'}]]],
['Holsten-Brauerei','Holsten','Hamburg','Hamburg','DE','longneck','green','#fbf8ef','#1f4f2a','#1f4f2a',[
 ['Pilsener','Pils',4.8],['Edel','Export',4.8,{a:'#c9a227'}]]],
['Holsten-Brauerei','Astra','Hamburg','Hamburg','DE','steinie','brown','#fbf6ea','#c8102e','#c8102e',[
 ['Urtyp','Pils',4.9],['Rotlicht','Lager',6.0,{l:'#c8102e',i:'#ffffff',a:'#141414'}],['Kiezmische','Radler',2.5,{l:'#f6e27a'}]]],
['Ratsherrn Brauerei','Ratsherrn','Hamburg','Hamburg','DE','nrw','brown','#f6f2e6','#1f3f6a','#1f3f6a',[
 ['Pils','Pils',4.9]]],
['Flensburger Brauerei','Flensburger','Flensburg','Schleswig-Holstein','DE','swing','green','#fbf8ef','#1f4f2a','#1f4f2a',[
 ['Pilsener','Pils',4.8],['Gold','Export',4.8,{a:'#c9a227',i:'#5a3a10'}],['Weizen','Weißbier',5.1,{g:'brown'}],['Frei','Alkoholfrei',0.0,{a:'#2a7bc0'}],['Dunkel','Dunkel',4.8,{g:'brown',l:'#2a1a12',i:'#f2e2b0'}],['Kellerbier','Kellerbier',4.8,{g:'brown',l:'#efe2c0'}]]],
['Störtebeker Braumanufaktur','Störtebeker','Stralsund','Mecklenburg-Vorpommern','DE','nrw','brown','#f4ead2','#14306b','#14306b',[
 ['Keller-Bier 1402','Kellerbier',4.8],['Atlantik-Ale','Pale Ale',5.1,{a:'#1d7a8a'}],['Schwarz-Bier','Schwarzbier',5.0,{l:'#1e1610',i:'#e9cf8a'}],['Bernstein-Weizen','Weißbier',5.3,{s:'longneck'}],['Frei-Bier','Alkoholfrei',0.5,{a:'#2a7bc0'}],['Roggen-Weizen','Weißbier',5.4,{s:'longneck',l:'#e6d2a8'}]]],
['Mecklenburgische Brauerei Lübz','Lübzer','Lübz','Mecklenburg-Vorpommern','DE','longneck','green','#fbf8ef','#14306b','#14306b',[
 ['Pils','Pils',4.9]]],
['Hanseatische Brauerei Rostock','Rostocker','Rostock','Mecklenburg-Vorpommern','DE','nrw','green','#fbf8ef','#1c3f7a','#1c3f7a',[
 ['Pils','Pils',4.9]]],
['Einbecker Brauhaus','Einbecker','Einbeck','Niedersachsen','DE','nrw','brown','#f6efdc','#a3192b','#a3192b',[
 ['Brauherren Pils','Pils',4.9],['Ur-Bock Dunkel','Bock',6.5,{l:'#2a1a12',i:'#f2d27a'}],['Mai-Ur-Bock','Bock',6.5,{l:'#f2e2a6'}]]],
['Privatbrauerei Herrenhausen','Herrenhäuser','Hannover','Niedersachsen','DE','nrw','green','#fbf8ef','#a3192b','#a3192b',[
 ['Pilsener','Pils',4.9]]],
['Hasseröder Brauerei','Hasseröder','Wernigerode','Sachsen-Anhalt','DE','longneck','green','#fbf8ef','#1f4f2a','#1f4f2a',[
 ['Premium Pils','Pils',4.9]]],
['Hofbrauhaus Wolters','Wolters','Braunschweig','Niedersachsen','DE','nrw','green','#fbf8ef','#a3192b','#a3192b',[
 ['Pilsener','Pils',4.9]]],
['Radeberger Exportbierbrauerei','Radeberger','Radeberg','Sachsen','DE','longneck','green','#f6efdc','#14306b','#14306b',[
 ['Pilsner','Pils',4.8],['Zwickel','Zwickel',5.0,{g:'brown',l:'#efe2c0'}]]],
['Wernesgrüner Brauerei','Wernesgrüner','Steinberg','Sachsen','DE','longneck','green','#fbf8ef','#1f4f2a','#1f4f2a',[
 ['Pils Legende','Pils',4.9]]],
['Sternquell-Brauerei','Sternquell','Plauen','Sachsen','DE','nrw','green','#fbf8ef','#1c3f7a','#1c3f7a',[
 ['Pils','Pils',4.9]]],
['Krostitzer Brauerei','Ur-Krostitzer','Krostitz','Sachsen','DE','nrw','green','#fbf8ef','#1f4f2a','#1f4f2a',[
 ['Feinherbes Pilsner','Pils',4.9,{t:'Krostitzer'}]]],
['Freiberger Brauhaus','Freiberger','Freiberg','Sachsen','DE','nrw','green','#fbf8ef','#14306b','#14306b',[
 ['Premium Pils','Pils',4.9]]],
['Landskron Brauerei','Landskron','Görlitz','Sachsen','DE','nrw','green','#fbf8ef','#a3192b','#a3192b',[
 ['Pils','Pils',4.9]]],
['Feldschlößchen Dresden','Feldschlößchen','Dresden','Sachsen','DE','nrw','green','#fbf8ef','#1f4f2a','#1f4f2a',[
 ['Pilsner','Pils',4.9]]],
['Rittergutsbrauerei Döllnitz','Ritterguts','Leipzig','Sachsen','DE','nrw','brown','#f2ecd8','#1c3f7a','#1c3f7a',[
 ['Gose','Gose',4.7]]],
['Bayerischer Bahnhof','Bayerischer Bahnhof','Leipzig','Sachsen','DE','nrw','brown','#f6efdc','#7a1c14','#7a1c14',[
 ['Leipziger Gose','Gose',4.5,{t:'Gose'}]]],
['Berliner Kindl Schultheiss','Berliner Kindl','Berlin','Berlin','DE','nrw','green','#fbf8ef','#a3192b','#a3192b',[
 ['Jubiläums Pilsener','Pils',5.1,{t:'Kindl'}],['Weisse','Berliner Weisse',3.0,{t:'Kindl',a:'#2f8a3a'}]]],
['Berliner Kindl Schultheiss','Schultheiss','Berlin','Berlin','DE','nrw','green','#fbf8ef','#1c3f7a','#1c3f7a',[
 ['Pilsener','Pils',4.9]]],
['Berliner Kindl Schultheiss','Berliner Pilsner','Berlin','Berlin','DE','nrw','green','#fbf8ef','#1f4f2a','#1f4f2a',[
 ['=Berliner Pilsner','Pils',5.0,{t:'Berliner',u:'PILSNER'}]]],
['Köstritzer Schwarzbierbrauerei','Köstritzer','Bad Köstritz','Thüringen','DE','longneck','brown','#1a1410','#c9a24a','#e8cf8a',[
 ['Edel Pils','Pils',4.8,{g:'green',l:'#fbf8ef',i:'#1a1410'}],['Kellerbier','Kellerbier',4.8,{l:'#efe2c0',i:'#5a2a14'}]]],
['Klosterbrauerei Neuzelle','Neuzeller','Neuzelle','Brandenburg','DE','nrw','brown','#1a1410','#c9a24a','#e8cf8a',[
 ['Schwarzer Abt','Schwarzbier',3.9]]],
['Radeberger Gruppe','Feldschlösschen','Rheinfelden','Schweiz','CH','longneck','brown','#c8102e','#ffffff','#ffffff',[
 ['Original','Lager',4.8]]],
/* ===== Österreich ===== */
['Stieglbrauerei zu Salzburg','Stiegl','Salzburg','Österreich','AT','nrw','brown','#fbf8ef','#c8102e','#c8102e',[
 ['Goldbräu','Märzen',4.9],['Radler Grapefruit','Radler',2.0,{l:'#e85a6a',i:'#ffffff'}],['Paracelsus Zwickl','Zwickel',5.0,{l:'#efe2c0'}]]],
['Brauerei Göss','Gösser','Leoben','Österreich','AT','nrw','green','#fbf8ef','#1f6a3a','#1f6a3a',[
 ['Märzen','Märzen',5.2],['Natur Radler','Radler',2.0,{l:'#f6e27a'}]]],
['Ottakringer Brauerei','Ottakringer','Wien','Österreich','AT','nrw','brown','#fbf8ef','#c8102e','#141414',[
 ['Helles','Helles',5.2],['Wiener Original','Märzen',5.3,{l:'#b5571a',i:'#ffffff'}]]],
['Brauerei Zipf','Zipfer','Zipf','Österreich','AT','nrw','green','#fbf8ef','#1f6a3a','#1f6a3a',[
 ['Urtyp','Pils',5.4]]],
['Brauerei Puntigam','Puntigamer','Graz','Österreich','AT','nrw','brown','#fbf8ef','#a3192b','#a3192b',[
 ['Das bierige Bier','Märzen',5.1,{u:'MÄRZEN'}]]],
['Brauerei Murau','Murauer','Murau','Österreich','AT','nrw','brown','#fbf8ef','#1f4f2a','#1f4f2a',[
 ['Märzen','Märzen',5.0]]],
['Brauerei Kaltenhausen','Edelweiss','Hallein','Österreich','AT','longneck','brown','#e8f0f6','#1c4f8a','#1c4f8a',[
 ['Hefetrüb','Weißbier',5.3]]],
['Brauerei Schwechat','Schwechater','Schwechat','Österreich','AT','nrw','brown','#fbf8ef','#c8102e','#c8102e',[
 ['Zwickl','Zwickel',5.4,{l:'#efe2c0'}]]],
['Privatbrauerei Hirt','Hirter','Hirt','Österreich','AT','nrw','green','#fbf8ef','#1f4f2a','#1f4f2a',[
 ['Privat Pils','Pils',5.2]]],
['Trumer Privatbrauerei','Trumer','Obertrum','Österreich','AT','longneck','green','#fbf8ef','#1f6a3a','#1f6a3a',[
 ['Pils','Pils',4.9]]],
['Mohrenbrauerei','Mohren','Dornbirn','Österreich','AT','nrw','brown','#fbf8ef','#c8102e','#141414',[
 ['Spezial','Märzen',5.0]]],
['Augustiner Bräu Kloster Mülln','Augustiner Mülln','Salzburg','Österreich','AT','swing','brown','#f2e6c8','#5a2a14','#5a2a14',[
 ['Märzen','Märzen',4.6,{t:'Mülln'}]]],
['Schloss Eggenberg','Eggenberg','Vorchdorf','Österreich','AT','nrw','brown','#141414','#c9a24a','#e8cf8a',[
 ['=Samichlaus Classic','Doppelbock',14.0,{t:'Samichlaus',u:'CLASSIC'}],['Hopfenkönig','Pils',5.1,{l:'#fbf8ef',i:'#1f4f2a',a:'#1f4f2a'}]]],
/* ===== Schweiz ===== */
['Brauerei Eichhof','Eichhof','Luzern','Schweiz','CH','nrw','brown','#fbf8ef','#1f4f2a','#1f4f2a',[
 ['Lager','Lager',4.8]]],
['Brauerei Locher','Appenzeller','Appenzell','Schweiz','CH','swing','brown','#f2e6c8','#c8102e','#141414',[
 ['Quöllfrisch Hell','Helles',4.8,{t:'Quöllfrisch'}]]],
['Brasserie du Cardinal','Cardinal','Fribourg','Schweiz','CH','nrw','brown','#c8102e','#ffffff','#ffffff',[
 ['Lager','Lager',4.8]]],
['Ittinger','Ittinger','Warth','Schweiz','CH','nrw','brown','#7a1c14','#c9a24a','#f2e2b0',[
 ['Klosterbräu','Amber',5.6]]],
/* ===== Tschechien ===== */
['Budějovický Budvar','Budweiser Budvar','České Budějovice','Tschechien','CZ','nrw','brown','#1a1a1a','#c1121f','#f5efe0',[
 ['Dark','Dunkel',4.7,{t:'Budvar'}]]],
['Plzeňský Prazdroj','Gambrinus','Pilsen','Tschechien','CZ','nrw','green','#fbf8ef','#1f6a3a','#1f6a3a',[
 ['Originál 10','Lager',4.3]]],
['Pivovar Velké Popovice','Kozel','Velké Popovice','Tschechien','CZ','nrw','brown','#f6efdc','#a3192b','#a3192b',[
 ['Premium','Lager',4.6],['Dark','Dunkel',3.8,{l:'#2a1a12',i:'#f2d27a'}]]],
['Pivovary Staropramen','Staropramen','Prag','Tschechien','CZ','longneck','green','#fbf8ef','#c8102e','#c8102e',[
 ['Premium','Lager',5.0]]],
['Rodinný pivovar Bernard','Bernard','Humpolec','Tschechien','CZ','swing','brown','#f6efdc','#1c3f2a','#1c3f2a',[
 ['Sváteční ležák','Lager',5.0]]],
['Pivovar Krušovice','Krušovice','Krušovice','Tschechien','CZ','nrw','brown','#fbf8ef','#a3192b','#a3192b',[
 ['Imperial','Lager',5.0]]],
['Pivovar Svijany','Svijany','Svijany','Tschechien','CZ','nrw','brown','#fbf8ef','#a3192b','#1c3f2a',[
 ['Máz 11','Lager',4.8]]],
['Pivovar U Fleků','U Fleků','Prag','Tschechien','CZ','nrw','brown','#2a1a12','#c9a24a','#e8cf8a',[
 ['Flekovský tmavý ležák 13°','Dunkel',5.0,{t:'U Fleků',u:'TMAVÝ LEŽÁK 13°'}]]],
['Únětický pivovar','Únětické','Únětice','Tschechien','CZ','nrw','brown','#f6efdc','#1c3f7a','#1c3f7a',[
 ['Pivo 12°','Lager',5.0]]],
/* ===== Belgien ===== */
['Abbaye Notre-Dame de Scourmont','Chimay','Chimay','Belgien','BE','steinie','brown','#7a1a1a','#d6b24c','#f2e2b0',[
 ['Rouge','Dubbel',7.0],['Bleue','Quadrupel',9.0,{l:'#1c3f7a'}],['Blanche','Tripel',8.0,{l:'#f2ecd8',i:'#3a2a1a'}],['Dorée','Belgisches Blonde',4.8,{l:'#c9a24a',i:'#3a1a0a'}]]],
['Abbaye d\'Orval','Orval','Villers-devant-Orval','Belgien','BE','steinie','clear','#f3ead0','#2a7bc0','#2a2a2a',[
 ['=Orval','Belgisches Pale Ale',6.2,{t:'Orval',u:'TRAPPIST'}]]],
['Abbaye de Rochefort','Rochefort','Rochefort','Belgien','BE','steinie','brown','#f6efdc','#1c3f7a','#1c3f7a',[
 ['6','Dubbel',7.5,{a:'#c8102e'}],['8','Quadrupel',9.2,{a:'#2f7a3a'}],['10','Quadrupel',11.3,{a:'#1c3f7a'}]]],
['Brouwerij Westmalle','Westmalle','Westmalle','Belgien','BE','steinie','brown','#f6efdc','#b3241c','#141414',[
 ['Dubbel','Dubbel',7.0],['Tripel','Tripel',9.5,{a:'#c9a227'}]]],
['Sint-Sixtusabdij','Westvleteren','Vleteren','Belgien','BE','steinie','brown','#d8c9a6','#c9a24a','#3a2a1a',[
 ['12','Quadrupel',10.2,{u:'TRAPPIST XII'}],['Blond','Belgisches Blonde',5.8,{u:'TRAPPIST BLOND'}]]],
['Brouwerij der Sint-Benedictusabdij','Achel','Hamont-Achel','Belgien','BE','steinie','brown','#f6efdc','#7a1a1a','#3a2a1a',[
 ['Blond','Belgisches Blonde',8.0]]],
['Brouwerij De Koningshoeven','La Trappe','Berkel-Enschot','Niederlande','NL','steinie','brown','#f6efdc','#7a1a1a','#3a2a1a',[
 ['Quadrupel','Quadrupel',10.0],['Isid\'or','Belgisches Pale Ale',7.5,{l:'#c9a24a'}]]],
['Brouwerij Duvel Moortgat','Duvel','Breendonk','Belgien','BE','steinie','clear','#f8f4e8','#c8102e','#c8102e',[
 ['=Duvel','Belgisches Blonde',8.5,{t:'Duvel',u:'BELGIAN GOLDEN ALE'}],['Tripel Hop','Tripel',9.5,{a:'#2f7a3a'}]]],
['Brouwerij Van Steenberge','Gulden Draak','Ertvelde','Belgien','BE','longneck','clear','#f4f2ee','#2f7a3a','#2a2a2a',[
 ['=Gulden Draak','Quadrupel',10.5,{t:'Gulden Draak',u:'DARK TRIPLE'}]]],
['Brouwerij Huyghe','Delirium','Melle','Belgien','BE','longneck','clear','#f6f2ee','#2a7bc0','#2a2a2a',[
 ['Tremens','Belgisches Blonde',8.5],['Nocturnum','Dubbel',8.5,{l:'#2a2a3a',i:'#f2e2b0'}]]],
['Brouwerij Het Anker','Gouden Carolus','Mechelen','Belgien','BE','steinie','brown','#1a1a1a','#c9a24a','#e8cf8a',[
 ['Classic','Dubbel',8.5]]],
['Brouwerij Bosteels','Tripel Karmeliet','Buggenhout','Belgien','BE','longneck','brown','#f2e6c8','#7a3a14','#3a2a1a',[
 ['=Tripel Karmeliet','Tripel',8.4,{t:'Karmeliet',u:'TRIPEL'}]]],
['Brouwerij Bosteels','Kwak','Buggenhout','Belgien','BE','steinie','brown','#7a3a14','#c9a24a','#f2e2b0',[
 ['=Pauwel Kwak','Belgisches Pale Ale',8.4,{t:'Kwak',u:'PAUWEL'}]]],
['AB InBev','Leffe','Dinant','Belgien','BE','steinie','brown','#c9a24a','#7a1a1a','#3a1a0a',[
 ['Blonde','Belgisches Blonde',6.6],['Brune','Dubbel',6.5,{l:'#3a1a10',i:'#f2e2b0'}]]],
['AB InBev','Hoegaarden','Hoegaarden','Belgien','BE','steinie','clear','#f4f6f8','#1f5fa8','#1f5fa8',[
 ['Wit','Witbier',4.9]]],
['AB InBev','Stella Artois','Leuven','Belgien','BE','longneck','green','#fbf8ef','#c8102e','#7a1a1a',[
 ['=Stella Artois','Lager',5.0,{t:'Stella Artois',u:'PREMIUM LAGER'}]]],
['AB InBev','Jupiler','Jupille','Belgien','BE','steinie','brown','#c8102e','#ffffff','#ffffff',[
 ['=Jupiler','Lager',5.2,{t:'Jupiler',u:'PILS'}]]],
['Brasserie d\'Achouffe','La Chouffe','Achouffe','Belgien','BE','steinie','brown','#f6efdc','#c8102e','#2a2a2a',[
 ['Blonde','Belgisches Blonde',8.0]]],
['Brouwerij St. Bernardus','St. Bernardus','Watou','Belgien','BE','steinie','brown','#f2e6c8','#7a1a1a','#3a2a1a',[
 ['Abt 12','Quadrupel',10.0],['Tripel','Tripel',8.0,{a:'#2a7bc0'}]]],
['Brouwerij Rodenbach','Rodenbach','Roeselare','Belgien','BE','steinie','brown','#7a1a1a','#c9a24a','#f2e2b0',[
 ['Classic','Flanders Red',5.2],['Grand Cru','Flanders Red',6.0,{l:'#3a1a1a'}]]],
['Brouwerij Lindemans','Lindemans','Vlezenbeek','Belgien','BE','steinie','green','#f6efdc','#a3192b','#3a2a1a',[
 ['Kriek','Lambic',3.5],['Framboise','Lambic',2.5,{a:'#c8346a'}]]],
['Brouwerij Boon','Boon','Lembeek','Belgien','BE','steinie','green','#f6efdc','#7a1a1a','#3a2a1a',[
 ['Oude Geuze','Lambic',7.0]]],
['Brouwerij Cantillon','Cantillon','Brüssel','Belgien','BE','steinie','green','#f2ead8','#a3192b','#2a2a2a',[
 ['Gueuze 100% Lambic Bio','Lambic',5.0,{u:'GUEUZE'}]]],
['Brasserie Dupont','Saison Dupont','Tourpes','Belgien','BE','steinie','green','#f6efdc','#2f7a3a','#2a2a2a',[
 ['=Saison Dupont','Saison',6.5,{t:'Dupont',u:'SAISON'}]]],
['Brouwerij De Halve Maan','Brugse Zot','Brügge','Belgien','BE','steinie','brown','#f6efdc','#c8102e','#2a2a2a',[
 ['Blond','Belgisches Blonde',6.0],['Straffe Hendrik Tripel','Tripel',9.0,{t:'Straffe Hendrik',u:'TRIPEL'}]]],
['Brouwerij Palm','Palm','Steenhuffel','Belgien','BE','steinie','brown','#c8102e','#f2e2b0','#ffffff',[
 ['Spéciale Belge','Belgisches Pale Ale',5.2]]],
['Brouwerij Affligem','Affligem','Opwijk','Belgien','BE','steinie','brown','#f2e6c8','#1c3f7a','#1c3f7a',[
 ['Blond','Belgisches Blonde',6.7],['Tripel','Tripel',9.0,{a:'#c9a227'}]]],
['Brouwerij Van Honsebrouck','Kasteel','Ingelmunster','Belgien','BE','steinie','brown','#1a1a1a','#c9a24a','#e8cf8a',[
 ['Donker','Quadrupel',11.0]]],
['Brasserie de Silly','Silly','Silly','Belgien','BE','steinie','brown','#f6efdc','#7a1a1a','#2a2a2a',[
 ['Saison','Saison',5.0]]],
['Brouwerij Bockor','Omer','Bellegem','Belgien','BE','steinie','clear','#f6efdc','#c9a24a','#2a2a2a',[
 ['Traditional Blond','Belgisches Blonde',8.0]]],
/* ===== Niederlande ===== */
['Heineken','Heineken','Amsterdam','Niederlande','NL','longneck','green','#0f6b3a','#c8102e','#ffffff',[
 ['=Heineken','Lager',5.0,{t:'Heineken',u:'LAGER BEER'}],['0.0','Alkoholfrei',0.0,{a:'#2a7bc0'}]]],
['Heineken','Amstel','Amsterdam','Niederlande','NL','longneck','brown','#c8102e','#d6b24c','#ffffff',[
 ['=Amstel','Lager',5.0,{t:'Amstel',u:'LAGER'}]]],
['Grolsch','Grolsch','Enschede','Niederlande','NL','swing','green','#fbf8ef','#1f5a2a','#1f5a2a',[
 ['Premium Pilsner','Pils',5.0]]],
['Bavaria Brouwerij','Bavaria','Lieshout','Niederlande','NL','longneck','green','#fbf8ef','#1c3f7a','#1c3f7a',[
 ['Premium','Pils',5.0]]],
['Brand Bierbrouwerij','Brand','Wijlre','Niederlande','NL','nrw','green','#fbf8ef','#c8102e','#c8102e',[
 ['Pilsener','Pils',5.0]]],
['Brouwerij \'t IJ','\'t IJ','Amsterdam','Niederlande','NL','steinie','brown','#f6efdc','#1f7a8a','#2a2a2a',[
 ['Zatte','Tripel',8.0]]],
['Hertog Jan','Hertog Jan','Arcen','Niederlande','NL','nrw','brown','#f2e6c8','#7a1a1a','#3a2a1a',[
 ['Pilsener','Pils',5.1]]],
/* ===== Dänemark & Skandinavien ===== */
['Carlsberg','Carlsberg','Kopenhagen','Dänemark','DK','longneck','green','#0f6b3a','#ffffff','#ffffff',[
 ['Pilsner','Pils',4.6]]],
['Carlsberg','Tuborg','Kopenhagen','Dänemark','DK','longneck','green','#0f6b3a','#d6b24c','#ffffff',[
 ['Grøn','Pils',4.6]]],
['Mikkeller','Mikkeller','Kopenhagen','Dänemark','DK','can','clear','#f2ecd8','#e5322d','#141414',[
 ['Peter, Pale and Mary','Pale Ale',4.6,{t:'Mikkeller',u:'PETER PALE & MARY'}],['Beer Geek Breakfast','Stout',7.5,{l:'#1a1410',i:'#f2e2b0'}]]],
['Nørrebro Bryghus','Nørrebro','Kopenhagen','Dänemark','DK','nrw','brown','#f6efdc','#1c3f7a','#1c3f7a',[
 ['Bombay IPA','IPA',6.2]]],
['To Øl','To Øl','Svinninge','Dänemark','DK','can','clear','#f2f2f2','#141414','#141414',[
 ['Gose to Hollywood','Gose',3.8,{a:'#e85a9a'}]]],
['Omnipollo','Omnipollo','Stockholm','Schweden','SE','can','clear','#f2f2f2','#e85a9a','#141414',[
 ['Noa Pecan Mud Cake','Imperial Stout',11.0,{l:'#1a1410',i:'#f2f2f2'}]]],
['Nøgne Ø','Nøgne Ø','Grimstad','Norwegen','NO','nrw','brown','#141414','#c8102e','#f2f2f2',[
 ['India Pale Ale','IPA',7.5]]],
['Lapin Kulta','Lapin Kulta','Tornio','Finnland','FI','longneck','green','#fbf8ef','#c9a24a','#1c3f7a',[
 ['=Lapin Kulta','Lager',4.5,{t:'Lapin Kulta',u:'LAGER'}]]],
['Carlsberg Polska','Okocim','Brzesko','Polen','PL','longneck','green','#fbf8ef','#c8102e','#1f4f2a',[
 ['Jasne','Lager',5.5]]],
['Kompania Piwowarska','Tyskie','Tychy','Polen','PL','longneck','green','#fbf8ef','#c9a24a','#1c3f7a',[
 ['Gronie','Lager',5.2]]],
['Kompania Piwowarska','Lech','Posen','Polen','PL','longneck','green','#0f6b3a','#ffffff','#ffffff',[
 ['Premium','Lager',5.0]]],
['Grupa Żywiec','Żywiec','Żywiec','Polen','PL','longneck','green','#fbf8ef','#c8102e','#1f4f2a',[
 ['Jasne Pełne','Lager',5.6],['Porter','Baltic Porter',9.5,{g:'brown',l:'#1a1410',i:'#f2e2b0'}]]],
/* ===== UK & Irland ===== */
['St. James\'s Gate','Guinness','Dublin','Irland','IE','can','clear','#141414','#c9a24a','#f2e2b0',[
 ['Extra Stout','Stout',5.6,{s:'nrw',g:'brown'}],['0.0','Alkoholfrei',0.0,{a:'#2a7bc0'}]]],
['Murphy\'s Brewery','Murphy\'s','Cork','Irland','IE','can','clear','#7a1a1a','#f2e2b0','#f2e2b0',[
 ['Irish Stout','Stout',4.0],['Irish Red','Red Ale',5.0,{l:'#b5301a'}]]],
['Beamish & Crawford','Beamish','Cork','Irland','IE','can','clear','#141414','#c8102e','#f2e2b0',[
 ['Irish Stout','Stout',4.1]]],
['Smithwick\'s','Smithwick\'s','Kilkenny','Irland','IE','longneck','brown','#7a1a1a','#c9a24a','#f2e2b0',[
 ['Red Ale','Red Ale',3.8]]],
['St. Francis Abbey Brewery','Kilkenny','Kilkenny','Irland','IE','can','clear','#b5301a','#c9a24a','#f2e2b0',[
 ['Irish Cream Ale','Red Ale',4.3]]],
['Fuller\'s','Fuller\'s','London','England','GB','nrw','brown','#141414','#c9a24a','#e8cf8a',[
 ['London Pride','Bitter',4.7],['ESB','Bitter',5.9,{l:'#c8102e',i:'#f2e2b0'}],['London Porter','Porter',5.4,{l:'#1a1410'}]]],
['Samuel Smith Old Brewery','Samuel Smith\'s','Tadcaster','England','GB','nrw','clear','#f2e6c8','#7a1a1a','#3a2a1a',[
 ['Oatmeal Stout','Stout',5.0,{l:'#1a1410',i:'#f2e2b0'}],['Nut Brown Ale','Brown Ale',5.0],['Taddy Porter','Porter',5.0,{l:'#3a1a10',i:'#f2e2b0'}]]],
['Newcastle Brown Ale','Newcastle','Newcastle','England','GB','longneck','clear','#f6efdc','#1c3f7a','#1c3f7a',[
 ['Brown Ale','Brown Ale',4.7]]],
['Shepherd Neame','Bishops Finger','Faversham','England','GB','nrw','brown','#7a1a1a','#c9a24a','#f2e2b0',[
 ['Kentish Strong Ale','Bitter',5.4]]],
['Greene King','Old Speckled Hen','Bury St Edmunds','England','GB','nrw','clear','#f2e6c8','#7a1a1a','#3a2a1a',[
 ['=Old Speckled Hen','Bitter',5.0,{t:'Speckled Hen',u:'ENGLISH ALE'}]]],
['Greene King','Abbot Ale','Bury St Edmunds','England','GB','nrw','brown','#1c2f5a','#c9a24a','#f2e2b0',[
 ['=Abbot Ale','Bitter',5.0,{t:'Abbot Ale',u:'BURY ST EDMUNDS'}]]],
['Timothy Taylor','Timothy Taylor\'s','Keighley','England','GB','nrw','brown','#f2e6c8','#c8102e','#141414',[
 ['Landlord','Pale Ale',4.3]]],
['Wychwood Brewery','Hobgoblin','Witney','England','GB','nrw','brown','#141414','#c8102e','#f2e2b0',[
 ['Ruby','Red Ale',5.2]]],
['Thornbridge','Thornbridge','Bakewell','England','GB','nrw','brown','#f2f2f2','#1f7a8a','#141414',[
 ['Jaipur','IPA',5.9]]],
['BrewDog','BrewDog','Ellon','Schottland','GB','can','clear','#1c7fbf','#ffffff','#ffffff',[
 ['Elvis Juice','IPA',6.5,{l:'#e85a1a'}],['Hazy Jane','NEIPA',5.0,{l:'#f2d24a',i:'#141414'}],['Nanny State','Alkoholfrei',0.5,{l:'#2a2a2a'}],['Lost Lager','Lager',4.5,{l:'#f2f2f2',i:'#1c7fbf'}]]],
['Innis & Gunn','Innis & Gunn','Edinburgh','Schottland','GB','nrw','brown','#141414','#c9a24a','#e8cf8a',[
 ['Original','Scotch Ale',6.6]]],
['Belhaven','Belhaven','Dunbar','Schottland','GB','nrw','brown','#1c2f5a','#c9a24a','#f2e2b0',[
 ['Scottish Stout','Stout',7.0,{l:'#141414'}]]],
['Traquair House','Traquair','Innerleithen','Schottland','GB','nrw','clear','#f2e6c8','#7a1a1a','#3a2a1a',[
 ['House Ale','Scotch Ale',7.2]]],
/* ===== USA & Kanada ===== */
['Sierra Nevada Brewing Co.','Sierra Nevada','Chico','Kalifornien','US','steinie','brown','#f4f2e8','#1e6b3a','#1e6b3a',[
 ['Torpedo Extra IPA','IPA',7.2,{a:'#2a6bb0'}],['Hazy Little Thing','NEIPA',6.7,{s:'can',l:'#f2d24a'}],['Celebration','IPA',6.8,{a:'#c8102e'}]]],
['Stone Brewing','Stone','Escondido','Kalifornien','US','nrw','brown','#141414','#c9a24a','#e8e8e8',[
 ['IPA','IPA',6.9],['Arrogant Bastard Ale','Strong Ale',7.2,{u:'ARROGANT BASTARD'}]]],
['Lagunitas Brewing','Lagunitas','Petaluma','Kalifornien','US','nrw','brown','#f2ead2','#c8102e','#141414',[
 ['IPA','IPA',6.2]]],
['Anchor Brewing','Anchor','San Francisco','Kalifornien','US','nrw','brown','#f2ead2','#1c3f7a','#1c3f7a',[
 ['Steam Beer','Amber',4.9],['Porter','Porter',5.6,{l:'#1a1410',i:'#f2e2b0'}]]],
['Russian River Brewing','Russian River','Santa Rosa','Kalifornien','US','nrw','brown','#f2ead2','#2f7a3a','#2a2a2a',[
 ['Pliny the Elder','Double IPA',8.0]]],
['Firestone Walker','Firestone Walker','Paso Robles','Kalifornien','US','nrw','brown','#f2ead2','#b3241c','#2a2a2a',[
 ['Union Jack','IPA',7.0]]],
['Ballast Point','Ballast Point','San Diego','Kalifornien','US','nrw','brown','#f2f2f2','#1c3f7a','#1c3f7a',[
 ['Sculpin','IPA',7.0,{a:'#e85a1a'}]]],
['Brooklyn Brewery','Brooklyn','New York','New York','US','nrw','brown','#f2ead2','#1f5a2a','#1f5a2a',[
 ['Lager','Lager',5.2],['East IPA','IPA',6.9,{a:'#c8102e'}]]],
['Samuel Adams','Samuel Adams','Boston','Massachusetts','US','nrw','brown','#1c2f5a','#c8102e','#f2e2b0',[
 ['Boston Lager','Lager',5.0]]],
['Goose Island','Goose Island','Chicago','Illinois','US','nrw','brown','#f2ead2','#c8102e','#2a2a2a',[
 ['IPA','IPA',5.9],['Bourbon County Stout','Imperial Stout',14.0,{l:'#141414',i:'#f2e2b0'}]]],
['Founders Brewing','Founders','Grand Rapids','Michigan','US','nrw','brown','#f2ead2','#1c3f7a','#1c3f7a',[
 ['All Day IPA','Session IPA',4.7],['Breakfast Stout','Imperial Stout',8.3,{l:'#1a1410',i:'#f2e2b0'}]]],
['Bell\'s Brewery','Bell\'s','Kalamazoo','Michigan','US','nrw','brown','#f2ead2','#e85a1a','#2a2a2a',[
 ['Two Hearted','IPA',7.0]]],
['Dogfish Head','Dogfish Head','Milton','Delaware','US','nrw','brown','#f2ead2','#2f7a3a','#2a2a2a',[
 ['60 Minute IPA','IPA',6.0]]],
['New Belgium Brewing','New Belgium','Fort Collins','Colorado','US','nrw','brown','#f2ead2','#c8102e','#2a2a2a',[
 ['Fat Tire','Amber',5.2]]],
['Odell Brewing','Odell','Fort Collins','Colorado','US','nrw','brown','#f2ead2','#2f7a3a','#2a2a2a',[
 ['IPA','IPA',7.0]]],
['Deschutes Brewery','Deschutes','Bend','Oregon','US','nrw','brown','#f2ead2','#1c3f7a','#2a2a2a',[
 ['Black Butte Porter','Porter',5.2,{l:'#1a1410',i:'#f2e2b0'}],['Fresh Squeezed IPA','IPA',6.4,{a:'#e85a1a'}]]],
['Rogue Ales','Rogue','Newport','Oregon','US','nrw','brown','#f2ead2','#c8102e','#2a2a2a',[
 ['Dead Guy Ale','Maibock',6.8]]],
['The Alchemist','Heady Topper','Stowe','Vermont','US','can','clear','#f2f2f2','#141414','#141414',[
 ['=Heady Topper','Double IPA',8.0,{t:'Heady Topper',u:'DOUBLE IPA'}]]],
['Anheuser-Busch','Budweiser','St. Louis','Missouri','US','longneck','brown','#c8102e','#f2f2f2','#ffffff',[
 ['=Budweiser','Lager',5.0,{t:'Budweiser',u:'KING OF BEERS'}]]],
['Molson Coors','Coors','Golden','Colorado','US','longneck','clear','#f2f2f2','#c8102e','#1c3f7a',[
 ['Light','Light Lager',4.2]]],
['Pabst Brewing','Pabst Blue Ribbon','Milwaukee','Wisconsin','US','can','clear','#f2f2f2','#1c3f7a','#c8102e',[
 ['=Pabst Blue Ribbon','Lager',4.7,{t:'Pabst',u:'BLUE RIBBON'}]]],
['Yuengling','Yuengling','Pottsville','Pennsylvania','US','nrw','brown','#f2ead2','#c9a24a','#1c3f7a',[
 ['Traditional Lager','Amber',4.5]]],
['Unibroue','Unibroue','Chambly','Kanada','CA','steinie','brown','#141414','#c9a24a','#e8cf8a',[
 ['La Fin du Monde','Tripel',9.0]]],
['Molson Coors','Molson','Montréal','Kanada','CA','longneck','brown','#f2f2f2','#c8102e','#1c3f7a',[
 ['Canadian','Lager',5.0]]],
/* ===== Lateinamerika ===== */
['Cervecería Modelo','Corona','Mexiko-Stadt','Mexiko','MX','longneck','clear','#f2f2f2','#c9a24a','#1c3f7a',[
 ['Extra','Lager',4.5]]],
['Cervecería Modelo','Modelo','Mexiko-Stadt','Mexiko','MX','longneck','clear','#f2ecd8','#c9a24a','#1c2f5a',[
 ['Especial','Lager',4.5],['Negra','Dunkel',5.4,{g:'brown',l:'#1a1410',i:'#e8cf8a'}]]],
['Cervecería Cuauhtémoc Moctezuma','Sol','Monterrey','Mexiko','MX','longneck','clear','#f2c24a','#c8102e','#1c2f5a',[
 ['=Sol','Lager',4.5,{t:'Sol',u:'CERVEZA'}]]],
['Cervecería Cuauhtémoc Moctezuma','Dos Equis','Monterrey','Mexiko','MX','longneck','green','#f2ecd8','#c8102e','#141414',[
 ['Lager Especial','Lager',4.2]]],
['Cervecería Cuauhtémoc Moctezuma','Tecate','Tecate','Mexiko','MX','can','clear','#c8102e','#f2e2b0','#ffffff',[
 ['Original','Lager',4.5]]],
['Cervecería Pacífico','Pacífico','Mazatlán','Mexiko','MX','longneck','clear','#f2c24a','#1c3f7a','#1c3f7a',[
 ['Clara','Lager',4.5]]],
['Cervecería Quilmes','Quilmes','Quilmes','Argentinien','AR','longneck','brown','#f2f2f2','#1c7fbf','#1c3f7a',[
 ['Clásica','Lager',4.9]]],
['Cervejaria Brahma','Brahma','Rio de Janeiro','Brasilien','BR','longneck','brown','#c8102e','#f2f2f2','#ffffff',[
 ['Chopp','Lager',4.8]]],
['Cervecería Polar','Polar','Caracas','Venezuela','VE','longneck','brown','#f2f2f2','#1c3f7a','#1c3f7a',[
 ['Pilsen','Lager',5.0]]],
['Red Stripe','Red Stripe','Kingston','Jamaika','JM','steinie','brown','#c8102e','#f2f2f2','#ffffff',[
 ['Jamaican Lager','Lager',4.7]]],
/* ===== Asien & Ozeanien ===== */
['Asahi Breweries','Asahi','Tokio','Japan','JP','longneck','brown','#d8dde2','#c8102e','#141414',[
 ['Super Dry','Lager',5.0]]],
['Kirin Brewery','Kirin','Tokio','Japan','JP','longneck','brown','#f2ecd8','#c8102e','#c9a24a',[
 ['Ichiban','Lager',5.0]]],
['Sapporo Breweries','Sapporo','Tokio','Japan','JP','can','clear','#d8dde2','#c9a24a','#141414',[
 ['Premium','Lager',4.9]]],
['Kiuchi Brewery','Hitachino Nest','Naka','Japan','JP','steinie','brown','#f2ecd8','#c8102e','#141414',[
 ['White Ale','Witbier',5.5]]],
['Tsingtao Brewery','Tsingtao','Qingdao','China','CN','longneck','green','#f2f2f2','#2f7a3a','#2f7a3a',[
 ['=Tsingtao','Lager',4.7,{t:'Tsingtao',u:'LAGER'}]]],
['Singha Corporation','Singha','Bangkok','Thailand','TH','longneck','brown','#f2ecd8','#c9a24a','#7a1a1a',[
 ['=Singha','Lager',5.0,{t:'Singha',u:'LAGER BEER'}]]],
['Thai Beverage','Chang','Bangkok','Thailand','TH','longneck','green','#0f6b3a','#c9a24a','#f2e2b0',[
 ['Classic','Lager',5.0]]],
['Heineken Asia Pacific','Tiger','Singapur','Singapur','SG','longneck','brown','#1c3f7a','#e85a1a','#ffffff',[
 ['Lager','Lager',5.0]]],
['Saigon Beer','Saigon','Ho-Chi-Minh-Stadt','Vietnam','VN','longneck','green','#c8102e','#c9a24a','#f2e2b0',[
 ['Special','Lager',4.9]]],
['Lao Brewery','Beerlao','Vientiane','Laos','LA','longneck','brown','#f2c24a','#1c3f7a','#1c3f7a',[
 ['Lager','Lager',5.0]]],
['San Miguel Corporation','San Miguel','Manila','Philippinen','PH','steinie','brown','#f2ecd8','#c9a24a','#7a1a1a',[
 ['Pale Pilsen','Pils',5.0]]],
['United Breweries','Kingfisher','Bangalore','Indien','IN','longneck','green','#c8102e','#f2f2f2','#ffffff',[
 ['Premium','Lager',4.8]]],
['Oriental Brewery','Cass','Seoul','Südkorea','KR','can','clear','#1c3f7a','#f2f2f2','#ffffff',[
 ['Fresh','Lager',4.5]]],
['Carlton & United','Victoria Bitter','Melbourne','Australien','AU','steinie','brown','#c8102e','#1f4f2a','#ffffff',[
 ['=Victoria Bitter','Lager',4.9,{t:'VB',u:'VICTORIA BITTER'}]]],
['Coopers Brewery','Coopers','Adelaide','Australien','AU','nrw','brown','#f2ecd8','#1f5a2a','#1f5a2a',[
 ['Sparkling Ale','Pale Ale',5.8,{a:'#c8102e'}],['Pale Ale','Pale Ale',4.5]]],
['Lion','Steinlager','Auckland','Neuseeland','NZ','longneck','green','#0f6b3a','#f2f2f2','#ffffff',[
 ['Classic','Lager',5.0]]],
['Castle Brewery','Castle','Johannesburg','Südafrika','ZA','longneck','brown','#c8102e','#c9a24a','#ffffff',[
 ['Lager','Lager',5.0]]],
['Efes Beverage','Efes','Istanbul','Türkei','TR','longneck','brown','#1c3f7a','#c9a24a','#ffffff',[
 ['Pilsen','Pils',5.0]]],
['Keo','Keo','Limassol','Zypern','CY','longneck','brown','#f2f2f2','#1c3f7a','#1c3f7a',[
 ['Lager','Lager',4.5]]],
['Athenian Brewery','Mythos','Thessaloniki','Griechenland','GR','longneck','green','#f2f2f2','#1c3f7a','#1c3f7a',[
 ['Lager','Lager',4.7]]],
/* ===== Italien, Spanien, Portugal, Frankreich ===== */
['Birra Peroni','Peroni','Rom','Italien','IT','longneck','green','#1c2f5a','#c8102e','#ffffff',[
 ['Nastro Azzurro','Lager',5.0,{l:'#f2f2f2',i:'#1c2f5a'}],['Gran Riserva Rossa','Märzen',5.2,{l:'#7a1a1a',i:'#f2e2b0'}]]],
['Birra Moretti','Moretti','Udine','Italien','IT','longneck','brown','#f2ecd8','#c8102e','#7a1a1a',[
 ['L\'Autentica','Lager',4.6],['La Rossa','Doppelbock',7.2,{l:'#7a1a1a',i:'#f2e2b0'}]]],
['Birra Menabrea','Menabrea','Biella','Italien','IT','steinie','green','#f2ecd8','#c9a24a','#1c3f7a',[
 ['Bionda','Lager',4.8]]],
['Birra Ichnusa','Ichnusa','Assemini','Sardinien','IT','longneck','brown','#f2f2f2','#c8102e','#1c3f7a',[
 ['Non Filtrata','Lager',5.0]]],
['Forst','Forst','Algund','Südtirol','IT','nrw','brown','#f2ecd8','#c8102e','#1f4f2a',[
 ['Premium','Lager',4.8],['Sixtus','Doppelbock',6.5,{l:'#3a1810',i:'#f2d27a'}]]],
['Birrificio Baladin','Baladin','Piozzo','Italien','IT','steinie','brown','#f2ecd8','#c8102e','#2a2a2a',[
 ['Isaac','Witbier',5.0]]],
['Mahou San Miguel','Mahou','Madrid','Spanien','ES','longneck','brown','#c8102e','#c9a24a','#ffffff',[
 ['Cinco Estrellas','Lager',5.5]]],
['Mahou San Miguel','San Miguel','Madrid','Spanien','ES','longneck','green','#f2ecd8','#c9a24a','#1c3f7a',[
 ['Especial','Lager',5.4,{t:'San Miguel ES',u:'ESPECIAL'}]]],
['Damm','Estrella Damm','Barcelona','Spanien','ES','longneck','green','#f2ecd8','#c8102e','#c8102e',[
 ['=Estrella Damm','Lager',5.4,{t:'Estrella Damm',u:'BARCELONA'}],['Inedit','Witbier',4.8,{t:'Inedit',l:'#141414',i:'#f2e2b0'}]]],
['Hijos de Rivera','Estrella Galicia','A Coruña','Spanien','ES','longneck','brown','#f2ecd8','#c8102e','#1c3f7a',[
 ['Especial','Lager',5.5],['1906 Reserva Especial','Export',6.5,{t:'1906',l:'#c9a24a',i:'#1a1410'}]]],
['Heineken España','Cruzcampo','Sevilla','Spanien','ES','longneck','brown','#c8102e','#c9a24a','#ffffff',[
 ['Pilsen','Lager',4.8]]],
['Alhambra','Alhambra','Granada','Spanien','ES','steinie','green','#1f5a3a','#c9a24a','#f2e2b0',[
 ['Reserva 1925','Export',6.4]]],
['Unicer','Super Bock','Leça do Balio','Portugal','PT','longneck','brown','#c8102e','#c9a24a','#ffffff',[
 ['Original','Lager',5.2]]],
['Sociedade Central de Cervejas','Sagres','Vialonga','Portugal','PT','longneck','brown','#f2ecd8','#c8102e','#1c3f7a',[
 ['Branca','Lager',5.0]]],
['Brasseries Kronenbourg','Kronenbourg','Obernai','Elsass','FR','longneck','green','#f2f2f2','#c8102e','#1c3f7a',[
 ['1664','Lager',5.5],['1664 Blanc','Witbier',5.0,{l:'#1c5fa8',i:'#ffffff',g:'clear'}]]],
['Brasserie Meteor','Meteor','Hochfelden','Elsass','FR','swing','green','#f2ecd8','#c8102e','#1c3f7a',[
 ['Pils','Pils',5.0]]],
['Brasserie Pietra','Pietra','Furiani','Korsika','FR','steinie','brown','#7a1a1a','#c9a24a','#f2e2b0',[
 ['Ambrée','Amber',6.0]]],
['Brasserie Castelain','Ch\'ti','Bénifontaine','Frankreich','FR','swing','brown','#f2ecd8','#c9a24a','#3a2a1a',[
 ['Blonde','Bière de Garde',6.4]]],
['Brasserie Duyck','Jenlain','Jenlain','Frankreich','FR','swing','brown','#7a3a14','#c9a24a','#f2e2b0',[
 ['Ambrée','Bière de Garde',7.5]]],
['Brasserie Fischer','Fischer','Schiltigheim','Elsass','FR','swing','clear','#f2ecd8','#1c3f7a','#1c3f7a',[
 ['Tradition','Lager',6.0]]],
['Pelforth','Pelforth','Mons-en-Barœul','Frankreich','FR','longneck','brown','#7a1a1a','#c9a24a','#f2e2b0',[
 ['Brune','Dunkel',5.8]]],
['Ölvisholt','Ölvisholt','Selfoss','Island','IS','nrw','brown','#141414','#c9a24a','#e8cf8a',[
 ['Lava','Imperial Stout',9.4]]],
['Pivovarna Laško','Laško','Laško','Slowenien','SI','longneck','green','#f2f2f2','#1f5a2a','#1f5a2a',[
 ['Zlatorog','Lager',4.9]]],
['Zagrebačka pivovara','Ožujsko','Zagreb','Kroatien','HR','longneck','brown','#f2f2f2','#c8102e','#1c3f7a',[
 ['Pivo','Lager',5.0]]],
['Dreher Sörgyárak','Dreher','Budapest','Ungarn','HU','longneck','brown','#f2ecd8','#c9a24a','#1c3f7a',[
 ['Classic','Lager',5.2]]],
['Ursus Breweries','Ursus','Cluj-Napoca','Rumänien','RO','longneck','brown','#f2f2f2','#c8102e','#c9a24a',[
 ['Premium','Lager',5.0]]],
['Švyturys','Švyturys','Klaipėda','Litauen','LT','longneck','brown','#f2f2f2','#c9a24a','#1c3f7a',[
 ['Ekstra','Export',5.2]]],
['Baltika Breweries','Baltika','Sankt Petersburg','Russland','RU','longneck','brown','#1c3f7a','#c9a24a','#ffffff',[
 ['No. 6 Porter','Baltic Porter',7.0,{l:'#1a1410'}]]],
['A. Le Coq','A. Le Coq','Tartu','Estland','EE','longneck','brown','#f2f2f2','#c8102e','#1c3f7a',[
 ['Premium','Lager',4.7]]],
/* ===== Mehr Bayern ===== */
['Giesinger Bräu','Giesinger','München','Bayern','DE','nrw','brown','#f4ecd8','#1d3f6e','#1d3f6e',[
 ['Lokalpatriot','Export',5.3],['Baby Back Hops','IPA',6.8,{s:'can',l:'#e85a1a',i:'#ffffff'}]]],
['Camba Bavaria','Camba','Truchtlaching','Bayern','DE','nrw','brown','#141414','#c9a24a','#e8cf8a',[
 ['Pale Ale','Pale Ale',5.5],['Hell','Helles',4.9,{l:'#f2ecd8',i:'#141414'}]]],
['Tilmans Biere','Tilmans','München','Bayern','DE','nrw','brown','#f2f2f2','#1c3f7a','#141414',[
 ['Das Helle','Helles',5.0],['Das Dunkle','Dunkel',5.0,{l:'#2a1a12',i:'#f2e2b0'}]]],
['Riedenburger Brauhaus','Riedenburger','Riedenburg','Bayern','DE','nrw','brown','#f2ecd8','#2f7a3a','#2f7a3a',[
 ['Dolden Sud','IPA',6.5],['Emmerbier','Spezialbier',5.1]]],
['Flötzinger Bräu','Flötzinger','Rosenheim','Bayern','DE','nrw','brown','#f4ecd8','#1c3f7a','#1c3f7a',[
 ['Hell','Helles',5.0]]],
['Auerbräu Rosenheim','Auerbräu','Rosenheim','Bayern','DE','nrw','brown','#f4ecd8','#a3192b','#a3192b',[
 ['Rosenheimer Hell','Helles',4.9,{u:'ROSENHEIMER HELL'}]]],
['Privatbrauerei Wieninger','Wieninger','Teisendorf','Bayern','DE','nrw','brown','#f4ecd8','#1f4f2a','#1f4f2a',[
 ['Hell','Helles',5.0],['Weißbier','Weißbier',5.3,{s:'longneck'}]]],
['Hofbräuhaus Traunstein','Hofbräuhaus Traunstein','Traunstein','Bayern','DE','nrw','brown','#f4ecd8','#1c3f7a','#1c3f7a',[
 ['Fürstenquell','Helles',5.0,{t:'Traunsteiner'}],['Altbayerisch Weißbier','Weißbier',5.3,{t:'Traunsteiner',s:'longneck'}]]],
['Bürgerbräu Bad Reichenhall','Bürgerbräu','Bad Reichenhall','Bayern','DE','nrw','brown','#f4ecd8','#a3192b','#a3192b',[
 ['Hell','Helles',4.8]]],
['Arcobräu','Arcobräu','Moos','Niederbayern','DE','nrw','brown','#f4ecd8','#1c3f7a','#1c3f7a',[
 ['Urfass','Helles',5.0],['Mooser Liesl','Helles',5.3,{t:'Mooser Liesl',u:'HELLES'}]]],
['Aldersbacher Klosterbrauerei','Aldersbacher','Aldersbach','Niederbayern','DE','nrw','brown','#f4ecd8','#7a1a1a','#7a1a1a',[
 ['Kloster Hell','Helles',5.0],['Kloster Pils','Pils',4.9,{a:'#1f4f2a'}]]],
['Brauerei Zwiesel','Zwiesel','Zwiesel','Niederbayern','DE','swing','brown','#f2e6c8','#1c3f7a','#1c3f7a',[
 ['Dampfbier','Spezialbier',5.0,{t:'Zwieseler',u:'DAMPFBIER'}]]],
['Hacklberg','Hacklberg','Passau','Niederbayern','DE','nrw','brown','#f4ecd8','#a3192b','#a3192b',[
 ['Urhell','Helles',4.9]]],
['Herrnbräu','Herrnbräu','Ingolstadt','Bayern','DE','nrw','brown','#f4ecd8','#1c3f7a','#1c3f7a',[
 ['Hefe-Weissbier','Weißbier',5.3,{s:'longneck'}]]],
['Nordbräu Ingolstadt','Nordbräu','Ingolstadt','Bayern','DE','nrw','brown','#f4ecd8','#1f4f2a','#1f4f2a',[
 ['Edel Hell','Helles',4.9]]],
['Brauerei Karg','Karg','Murnau','Bayern','DE','longneck','brown','#f2e6c8','#7a1a1a','#7a1a1a',[
 ['Weißbier Hell','Weißbier',5.2]]],
['Zötler Privatbrauerei','Zötler','Rettenberg','Allgäu','DE','nrw','brown','#f4ecd8','#1c3f7a','#1c3f7a',[
 ['Gold','Export',5.2]]],
['Brauerei Rapp','Rapp','Kutzenhausen','Schwaben','DE','nrw','brown','#f4ecd8','#a3192b','#a3192b',[
 ['Kellerbier','Kellerbier',5.2]]],
['Schwaben Bräu','Schwaben Bräu','Stuttgart','Baden-Württemberg','DE','nrw','brown','#f4ecd8','#c8102e','#c8102e',[
 ['Das Echte Märzen','Märzen',5.4]]],
['Hochdorfer Kronenbrauerei','Hochdorfer','Nagold','Schwarzwald','DE','nrw','brown','#f4ecd8','#1c3f7a','#1c3f7a',[
 ['Kronenpils','Pils',4.9]]],
['Brauerei Ketterer','Ketterer','Hornberg','Schwarzwald','DE','nrw','brown','#f4ecd8','#a3192b','#a3192b',[
 ['Pils','Pils',4.9]]],
['Brauerei Zoller-Hof','Zoller-Hof','Sigmaringen','Baden-Württemberg','DE','nrw','brown','#f4ecd8','#1f4f2a','#1f4f2a',[
 ['Pils','Pils',4.9]]],
['Brauerei Schäff','Schäff','Treuchtlingen','Franken','DE','nrw','brown','#f4ecd8','#7a1a1a','#7a1a1a',[
 ['Feuerfest Edel Bier','Doppelbock',10.0,{l:'#3a1810',i:'#f2d27a'}]]],
['Schanzenbräu','Schanzenbräu','Nürnberg','Franken','DE','swing','brown','#f2e6c8','#c8102e','#141414',[
 ['Rotbier','Spezialbier',5.0],['Kellerbier','Kellerbier',4.9,{a:'#1c3f7a'}]]],
['Landwehr-Bräu','Landwehr-Bräu','Reichelshofen','Franken','DE','swing','brown','#f2e6c8','#1f4f2a','#1f4f2a',[
 ['Pils','Pils',4.8]]],
['Brauerei Kitzmann','Kitzmann','Erlangen','Franken','DE','nrw','brown','#f4ecd8','#1c3f7a','#1c3f7a',[
 ['Edelpils','Pils',4.9]]],
['Brauerei Neder','Neder','Forchheim','Franken','DE','swing','brown','#f2e6c8','#7a1a1a','#7a1a1a',[
 ['Schwarze Anna','Dunkel',5.4,{l:'#2a1a12',i:'#f2e2b0'}]]],
['Brauerei Greif','Greif','Forchheim','Franken','DE','swing','brown','#f2e6c8','#1f4f2a','#1f4f2a',[
 ['Annafestbier','Festbier',5.6]]],
['Brauerei Rittmayer','Rittmayer','Hallerndorf','Franken','DE','swing','brown','#f2e6c8','#1c3f7a','#1c3f7a',[
 ['Kellerbier','Kellerbier',4.9]]],
['Brauerei Göller','Göller','Zeil am Main','Franken','DE','nrw','brown','#f4ecd8','#a3192b','#a3192b',[
 ['Kellerbier','Kellerbier',4.9]]],
['Brauerei Eschenbacher','Eschenbacher','Eschenbach','Franken','DE','swing','brown','#f2e6c8','#7a1a1a','#7a1a1a',[
 ['Pils','Pils',4.9]]],
['Brauerei Rother Bräu','Rother Bräu','Hausen','Rhön','DE','nrw','brown','#f4ecd8','#a3192b','#a3192b',[
 ['Weizen','Weißbier',5.3,{s:'longneck'}]]],
['Klosterbrauerei Kreuzberg','Kreuzberg','Bischofsheim','Rhön','DE','swing','brown','#f2e6c8','#1c3f7a','#1c3f7a',[
 ['Klosterbier Dunkel','Dunkel',5.4,{l:'#2a1a12',i:'#f2e2b0'}]]],
['Hochstiftliches Brauhaus Fulda','Hochstift','Fulda','Hessen','DE','nrw','green','#fbf8ef','#a3192b','#a3192b',[
 ['Pils','Pils',4.9]]],
/* ===== Thüringen, Sachsen-Anhalt ===== */
['Rosenbrauerei Pößneck','Rosen','Pößneck','Thüringen','DE','nrw','brown','#f4ecd8','#c8102e','#c8102e',[
 ['Pils','Pils',4.9]]],
['Vereinsbrauerei Apolda','Apoldaer','Apolda','Thüringen','DE','nrw','brown','#f4ecd8','#1f4f2a','#1f4f2a',[
 ['Domizil Pils','Pils',4.8]]],
['Brauerei Saalfeld','Saalfelder','Saalfeld','Thüringen','DE','nrw','brown','#f4ecd8','#1c3f7a','#1c3f7a',[
 ['Ur-Saalfelder','Export',5.0]]],
['Braugold','Braugold','Erfurt','Thüringen','DE','nrw','green','#fbf8ef','#c9a24a','#1c3f7a',[
 ['Pilsner','Pils',4.9]]],
['Brauhaus Hartmannsdorf','Hartmannsdorfer','Hartmannsdorf','Sachsen','DE','nrw','brown','#f4ecd8','#1f4f2a','#1f4f2a',[
 ['Pils','Pils',4.9]]],
['Einsiedler Brauhaus','Einsiedler','Chemnitz','Sachsen','DE','nrw','brown','#f4ecd8','#7a1a1a','#7a1a1a',[
 ['Schwarzbier','Schwarzbier',4.9,{l:'#1e1610',i:'#e9cf8a'}]]],
['Brauerei Reichenbrand','Reichenbrander','Chemnitz','Sachsen','DE','nrw','brown','#f4ecd8','#1c3f7a','#1c3f7a',[
 ['Pils','Pils',4.9]]],
/* ===== Craft Deutschland ===== */
['BRLO','BRLO','Berlin','Berlin','DE','can','clear','#141414','#e85a1a','#f2f2f2',[
 ['Helles','Helles',4.7,{l:'#f2ecd8',i:'#141414'}],['Pale Ale','Pale Ale',5.5]]],
['Schoppe Bräu','Schoppe Bräu','Berlin','Berlin','DE','nrw','brown','#f2f2f2','#141414','#141414',[
 ['Holy Shit Ale','Double IPA',9.0]]],
['Lemke Berlin','Lemke','Berlin','Berlin','DE','nrw','brown','#f2ecd8','#1c3f7a','#1c3f7a',[
 ['Original','Lager',5.0]]],
['Kehrwieder Kreativbrauerei','Kehrwieder','Hamburg','Hamburg','DE','nrw','brown','#f2f2f2','#1f7a8a','#141414',[
 ['ü.NN IPA','Alkoholfrei',0.4,{u:'ALKOHOLFREIES IPA'}]]],
['Insel-Brauerei Rügen','Insel-Brauerei','Rambin','Rügen','DE','swing','clear','#f2f2f2','#1c3f7a','#1c3f7a',[
 ['Insel-Kreide','Saison',6.2]]],
['BraufactuM','BraufactuM','Frankfurt am Main','Hessen','DE','steinie','clear','#141414','#c9a24a','#e8cf8a',[
 ['Progusta','IPA',6.8]]],
['Ale-Mania','Ale-Mania','Bonn','Rheinland','DE','nrw','brown','#f2f2f2','#c8102e','#141414',[
 ['India Pale Ale','IPA',6.2]]],
['Hopfenstopfer','Hopfenstopfer','Bad Rappenau','Baden-Württemberg','DE','nrw','brown','#f2ecd8','#2f7a3a','#2f7a3a',[
 ['Citra Ale','Pale Ale',5.1]]],
/* ===== Mehr Radler & Alkoholfrei (DE) ===== */
['Erdinger Weißbräu','Erdinger','Erding','Bayern','DE','longneck','brown','#f6eedb','#1c3f7a','#1c3f7a',[
 ['Alkoholfrei Grapefruit','Alkoholfrei',0.4,{l:'#e85a6a',i:'#ffffff'}]]],
['Krombacher Brauerei','Krombacher','Kreuztal','Siegerland','DE','longneck','green','#fbf8ef','#0f5a32','#0f5a32',[
 ['O,0% Pils','Alkoholfrei',0.0,{a:'#2a7bc0',t:'Krombacher',u:'0,0% PILS'}]]],
['Warsteiner Brauerei','Warsteiner','Warstein','Sauerland','DE','longneck','green','#fbf8ef','#a3192b','#1c2f5a',[
 ['Alkoholfrei','Alkoholfrei',0.0,{a:'#2a7bc0'}]]],
['Paulaner Brauerei','Paulaner','München','Bayern','DE','longneck','brown','#f4ecd8','#1c3f7a','#1c3f7a',[
 ['Weißbier-Zitrone Alkoholfrei','Radler',0.0,{l:'#f6e27a'}]]],
['Brauerei Gold Ochsen','Gold Ochsen','Ulm','Baden-Württemberg','DE','nrw','brown','#f4ecd8','#c9a24a','#7a1a1a',[
 ['Original','Export',5.1],['Kellerbier','Kellerbier',5.2,{l:'#efe2c0'}]]],
['Brauerei Lasser','Lasser','Lörrach','Baden-Württemberg','DE','nrw','brown','#f4ecd8','#1c3f7a','#1c3f7a',[
 ['Pils','Pils',4.9]]],
['Brauerei Härle','Härle','Leutkirch','Allgäu','DE','swing','brown','#f2e6c8','#2f7a3a','#2f7a3a',[
 ['Classic','Helles',5.1]]],
['Familienbrauerei Bauhöfer','Ulmer','Renchen','Schwarzwald','DE','nrw','brown','#f4ecd8','#c8102e','#c8102e',[
 ['Pils','Pils',4.8]]],
['Brauerei Wittmann','Wittmann','Landshut','Niederbayern','DE','nrw','brown','#f4ecd8','#7a1a1a','#7a1a1a',[
 ['Hell','Helles',4.9]]],
['Brauerei Hofmühl','Hofmühl','Eichstätt','Bayern','DE','nrw','brown','#f4ecd8','#1f4f2a','#1f4f2a',[
 ['Weizen','Weißbier',5.2,{s:'longneck'}],['Dunkel','Dunkel',5.3,{l:'#2a1a12',i:'#f2e2b0'}]]],
['Brauerei Zirndorf','Zirndorfer','Zirndorf','Franken','DE','nrw','brown','#f4ecd8','#c8102e','#c8102e',[
 ['Landbier','Landbier',5.2]]],
['Brauerei Gebr. Maisel','Maisel & Friends','Bayreuth','Franken','DE','can','clear','#141414','#c9a24a','#f2f2f2',[
 ['Pale Ale','Pale Ale',5.2],['IPA','IPA',6.3,{a:'#e85a1a'}]]],
/* ===== Regionale Brauereien (v1.5): Leikeim, Jacob & Landbrauereien – Sortiment & Alkoholgehalt geprüft (Brauerei-Websites / BeerTasting), Etikettfarben aus Produktfotos ===== */
['Brauhaus Leikeim','Leikeim','Altenkunstadt','Oberfranken','DE','swing','brown','#eef0ea','#b5121b','#2d4a35',[
 ['Premium Pils','Pils',4.9],
 ['Landbier','Landbier',5.4,{l:'#3d8a34',a:'#efe2a8',i:'#ffffff'}],
 ['Steinbier','Spezialbier',5.8,{l:'#6b3414',a:'#d9a640',i:'#f6e6c0',u:'Steinbier Original'}],
 ['Kellerbier','Kellerbier',4.9,{l:'#8f5f3e',a:'#efe0c0',i:'#ffffff'}],
 ['Hell','Helles',4.9,{l:'#86b9dc',a:'#f2f2ea',i:'#16365e'}],
 ['Weizen','Weißbier',5.4,{l:'#efe6c6',a:'#c7a24a',i:'#5a3a1a',u:'Helle Weisse'}],
 ['Dunkle Weisse','Dunkles Weißbier',5.5,{l:'#5a3a22',a:'#d9b46a',i:'#f6e6c0'}],
 ['Steinweisse','Weißbier',5.5,{l:'#7a4a22',a:'#d9a640',i:'#f6e6c0'}],
 ['Steinweizen Bock','Weizenbock',7.0,{l:'#4a2614',a:'#d9a640',i:'#f6e6c0'}],
 ['Feines Schwarzes','Schwarzbier',4.9,{l:'#1e1a18',a:'#c9a24a',i:'#f2e2b0'}],
 ['Märzen','Märzen',5.8,{l:'#b0462a',a:'#efd9a0',i:'#ffffff'}],
 ['Wintertraum','Festbier',5.4,{l:'#1f3f6b',a:'#e8d9a0',i:'#ffffff'}],
 ['Fränkischer UrStoff','Dunkel',5.2,{l:'#4a2a18',a:'#c9a24a',i:'#f2e2b0',u:'Urstoff'}],
 ['Radler','Radler',2.6,{l:'#a6cf3e',a:'#f4e45a',i:'#24400c'}],
 ['Naturtrübes Radler','Radler',2.5,{l:'#c6d94a',a:'#f6efc0',i:'#24400c'}],
 ['Frei 0,0 %','Alkoholfrei',0.0,{l:'#f4f2ec',a:'#c8102e',i:'#c8102e'}],
 ['Premium Pils 0,0 %','Alkoholfrei',0.0,{a:'#2d6a3a',i:'#c8102e'}],
 ['Alkoholfreies Weizen','Alkoholfrei',0.5,{l:'#efe6c6',a:'#2d6a3a',i:'#5a3a1a'}]]],
['Familienbrauerei Jacob','Jacob','Bodenwöhr','Oberpfalz','DE','nrw','brown','#b8323a','#f2ead2','#ffffff',[
 ['Hell','Helles',4.9],
 ['Altbayerisch Hell','Helles',4.9,{l:'#f1e6c4',a:'#2a5aa8',i:'#1f3f7a'}],
 ['Flaschlbier','Helles',4.9,{l:'#e9dcb8',a:'#b8323a',i:'#3a2a1a'}],
 ['Flaschlpils','Pils',5.0,{l:'#e9e4d4',a:'#2f6a3a',i:'#1f3a2a'}],
 ['Export','Export',5.3,{l:'#5b4ea0'}],
 ['Edel-Pils','Pils',5.0,{l:'#c7c9c8',a:'#c9a24a',i:'#2a2a2a'}],
 ['Dunkel','Dunkel',5.3,{l:'#2b211d',a:'#efe2c2',i:'#f2e6c8'}],
 ['Winter Gold','Dunkel',5.3,{l:'#3a2414',a:'#d6a640',i:'#f2dca0',u:'Dunkles Export'}],
 ['=Jacobator Doppelbock','Doppelbock',7.5,{l:'#7a1f24',a:'#d6b04a',i:'#f2d79a',t:'Jacobator',u:'Doppelbock'}],
 ['=Jacobator Weissbier-Doppelbock','Weizenbock',7.5,{l:'#4a2a1a',a:'#d6b04a',i:'#f2d79a',t:'Jacobator',u:'Weissbier-Doppelbock'}],
 ['Naturtrübes Weissbier','Weißbier',5.3,{l:'#f0c22e',a:'#2a4f9a',i:'#2a1a10'}],
 ['Dunkles Weissbier','Dunkles Weißbier',5.3,{l:'#4a68b8',a:'#f0d27a'}],
 ['Weissbier Kristall','Kristallweizen',5.3,{l:'#dfe9ef',a:'#2a4f9a',i:'#1f3f7a'}],
 ['Winter Weisse','Dunkles Weißbier',5.3,{l:'#6b2a22',a:'#e8d9a0'}],
 ['Leichtes Weissbier','Weißbier',2.7,{l:'#e9dcb8',a:'#4a68b8',i:'#2a3f7a'}],
 ['Weissbier Alkoholfrei','Alkoholfrei',0.5,{l:'#8cc3e8',a:'#f0c22e',i:'#1f3f7a',s:'longneck'}],
 ['Hell Alkoholfrei','Alkoholfrei',0.5,{l:'#8cc3e8',a:'#b8323a',i:'#1f3f7a'}],
 ['Radler','Radler',2.6,{l:'#f08a2a',a:'#f6e27a'}],
 ['Dunkles Radler','Radler',2.7,{l:'#6b3a1a',a:'#f6e27a'}],
 ['Weissbier Radler dunkel','Radler',2.7,{l:'#4a68b8',a:'#f6e27a',s:'longneck'}],
 ['Bourbon Bock','Bock',7.3,{l:'#2a1a12',a:'#c98a3a',i:'#f2d79a',u:'JBB Bourbon Bock'}]]],
['Brauerei Greifenklau','Greifenklau','Bamberg','Oberfranken','DE','nrw','brown','#3c2e59','#f8fbe3','#f6f8e6',[
 ['Lager','Lager',4.9],
 ['Helles Vollbier','Helles',4.7,{l:'#5599ca',a:'#445a71',i:'#e1e4e1'}],
 ['Kellerbier','Kellerbier',4.9,{l:'#746849',a:'#d7be5e',i:'#f6f6e4'}],
 ['Roter Bock','Bock',7.0,{l:'#dcd7c2',a:'#7e2417',i:'#712e24'}],
 ['Bock','Bock',6.9,{l:'#664e45',a:'#9c7761',i:'#f6f4e6'}]]],
['Klosterbräu Bamberg','Klosterbräu','Bamberg','Oberfranken','DE','nrw','brown','#57403a','#716b6f','#f5e6d1',[
 ['Bamberger Rauchbier','Rauchbier',5.3],
 ['Bamberger Braunbier','Dunkel',5.5,{l:'#5e2a2d',a:'#817372',i:'#eee5db'}],
 ['Bamberger Kellerbier','Kellerbier',5.3,{l:'#b6b0ac',a:'#6d4a41',i:'#674d47'}],
 ['Bamberger Schwärzla','Dunkel',5.0,{l:'#7c2d26',a:'#aeabab',i:'#e7e3da'}],
 ['Bamberger Bockbier','Bock',6.9,{l:'#6d6e83',a:'#e0d5c9',i:'#ebe4da'}]]],
['Brauerei Wagner','Wagner','Merkendorf','Oberfranken','DE','swing','brown','#dbddd9','#7e3933','#74413d',[
 ['Lagerbier Ungespundet','Kellerbier',5.3],
 ['Märzen','Märzen',5.5,{l:'#dfe2d9',a:'#535850',i:'#535850'}],
 ['=Richard Wagner Dunkel','Dunkel',5.5,{l:'#3c211b',a:'#dfcd8d',i:'#d4c798',u:'Richard Wagner Dunkel'}],
 ['Helles','Helles',4.7,{l:'#f5fcf1',a:'#9fa07f',i:'#54585b'}],
 ['Pils','Pils',4.9,{l:'#ffffff',a:'#3e4540',i:'#3e4540'}]]],
['Brauerei Zehendner','Mönchsambacher','Mönchsambach','Oberfranken','DE','swing','brown','#443519','#67685d','#d0b363',[
 ['=Mönchsambacher Lagerbier','Lager',5.5,{u:'Lagerbier'}],
 ['=Mönchsambacher Export','Export',5.2,{l:'#fde285',a:'#461f16',i:'#40231c',u:'Export'}],
 ['=Mönchsambacher Hefe-Weizen','Weißbier',5.5,{l:'#ffe068',a:'#2a3343',i:'#2d3440',u:'Hefe-Weizen'}],
 ['=Mönchsambacher Festbier','Festbier',5.8,{l:'#f1ebe4',a:'#c5b7ae',i:'#49362f',u:'Festbier'}],
 ['=Mönchsambacher Weihnachts-Bock','Bock',7.0,{l:'#29201c',a:'#efe2c2',i:'#c4a869',u:'Weihnachts-Bock'}]]],
['Brauerei Drei Kronen','Drei Kronen','Memmelsdorf','Oberfranken','DE','nrw','brown','#0a5121','#928f5b','#f4edd8',[
 ['Lotte Fränkisch Hell','Helles',4.8],
 ['Nessie Kühlschiff IPA','IPA',6.6,{l:'#3e3835',a:'#ada650',i:'#efe8cb'}],
 ['1457 Lager','Lager',4.9,{l:'#054573',a:'#81827f',i:'#f6f0de'}],
 ['Stöffla Rauchbier','Rauchbier',5.0,{l:'#460904',a:'#fceed3',i:'#f7ecd8'}],
 ['Böckla','Bock',6.2,{l:'#fcebc8',a:'#fed773',i:'#88531f'}]]],
['Löwenbräu Buttenheim','Löwenbräu Buttenheim','Buttenheim','Oberfranken','DE','swing','brown','#fbfbe9','#d5cc88','#9d8562',[
 ['Lagerbier Ungespundet','Kellerbier',4.8],
 ['Helles Vollbier','Helles',4.8,{l:'#f2eeda',a:'#abb6b8',i:'#527f85'}],
 ['Bartholomäus Festbier','Festbier',5.4,{l:'#276f20',a:'#eeeed5',i:'#f5f8e7'}],
 ['Anna Festbier','Festbier',5.4,{l:'#9b8767',a:'#a6c8e3',i:'#c8cdce'}],
 ['Weissbier','Weißbier',5.0,{l:'#edf6fc',a:'#cfc7af',i:'#624541'}]]],
['Brauerei Grasser','Huppendorfer','Huppendorf','Oberfranken','DE','swing','brown','#fdffd8','#bb2723','#a73a37',[
 ['Vollbier','Dunkel',5.0],
 ['Zwickel','Zwickel',4.9,{l:'#a4342c',a:'#e7e39b',i:'#f9fce6'}],
 ['Weihnachtsfestbier','Festbier',5.5,{l:'#ada9a6',a:'#ffee9c',i:'#47456a'}],
 ['Pils','Pils',4.9,{l:'#fdffdb',a:'#912218',i:'#812f28'}],
 ['Urtyp Hell','Helles',5.2,{l:'#ebf0e2',a:'#a19cbc',i:'#a05265'}]]],
['Klosterbrauerei Weißenohe','Weißenoher','Weißenohe','Oberfranken','DE','nrw','brown','#9e978e','#4e4541','#f3f6f7',[
 ['Glocken Hell','Helles',5.0],
 ['Kloster Sud','Helles',5.4,{l:'#871c18',a:'#ecdcb6',i:'#ebe5c6'}],
 ['Altfränkisch Klosterbier','Helles',5.1,{l:'#e6d6a4',a:'#544433',i:'#504437'}],
 ['Bonator Doppelbock','Doppelbock',8.0,{l:'#45454e',a:'#8b634d',i:'#caaf8f'}],
 ['Bonifatius Dunkel','Dunkel',5.1,{l:'#fae098',a:'#2a1a10',i:'#694e39'}]]],
['Brauerei Trunk','Trunk','Vierzehnheiligen','Oberfranken','DE','nrw','brown','#b36e64','#faf4ae','#f0ecb8',[
 ['Nothelfer Export Dunkel','Dunkel',5.1],
 ['Nothelfer Bio-Weisse','Weißbier',5.3,{l:'#857c7a',a:'#ccc39c',i:'#fdfcbd'}],
 ['Nothelfer Pils','Pils',5.1,{l:'#278957',a:'#a3965b',i:'#eceac5'}],
 ['Nothelfer Hausbrauer Hell','Helles',4.5,{l:'#585967',a:'#f5edcd',i:'#f7f5dc'}],
 ['Nothelfer Lager','Lager',4.7,{l:'#0c2665',a:'#78d1e6',i:'#f7ef9b'}]]],
['Staffelberg-Bräu','Staffelberg-Bräu','Loffeld','Oberfranken','DE','nrw','brown','#e6cdb9','#40649a','#53292e',[
 ['Helles Vollbier','Helles',4.8],
 ['Betthupferl Die Rote Verführung','Spezialbier',4.0,{l:'#34397f',a:'#f0d8b9',i:'#e9d7c0'}],
 ['Wienerla','Spezialbier',5.4,{l:'#e1bd96',a:'#897353',i:'#76332b'}],
 ['Mai-Bock','Maibock',7.0,{l:'#dfd0b7',a:'#6f375e',i:'#683e5b'}],
 ['Loffelder Dunkel','Dunkel',5.2,{l:'#ddc7ae',a:'#691e1b',i:'#5f2725'}]]],
['Brauerei Grosch','Grosch','Rödental','Oberfranken','DE','nrw','brown','#e1d0b2','#382c27','#362d29',[
 ['Fuhrmanns Trunk','Dunkel',5.5],
 ['Bock','Bock',7.0,{l:'#2b0707',a:'#f2c2ac',i:'#e9c5b5'}],
 ['Luthertrunk','Dunkel',5.3,{l:'#7278ae',a:'#6d3b7e',i:'#e4ebf3'}],
 ['Prinz Albert Pils','Pils',4.9,{l:'#13204a',a:'#7e6d7a',i:'#edeae2'}],
 ['Fuhrmanns Trunk Alkoholfrei','Alkoholfrei',0.5,{l:'#ddcbaf',a:'#412723',i:'#3d2a27'}]]],
['Meinel-Bräu','Meinel','Hof','Oberfranken','DE','nrw','brown','#186281','#5297ac','#e0dfdb',[
 ['Helles','Helles',4.6],
 ['Pils','Pils',5.2,{l:'#007fae',a:'#02c3ff',i:'#efe0d5'}],
 ['Keller Märzen','Kellerbier',5.6,{l:'#254f3b',a:'#3da29a',i:'#eaeae8'}],
 ['Dunkel','Dunkel',4.3,{l:'#090707',a:'#58afca',i:'#eeede1'}],
 ['Holla die Bierfee Dinkel Ale','Spezialbier',6.0,{l:'#e2cc97',a:'#c6224e',i:'#b13758'}]]],
['Brauerei Hebendanz','Hebendanz','Forchheim','Oberfranken','DE','nrw','brown','#fffbb6','#c2bd70','#82402b',[
 ['Annafest Bier','Festbier',5.3],
 ['Helles Export','Export',5.0,{l:'#e1dc9a',a:'#b0a864',i:'#874631'}],
 ['Posthalter Lager','Lager',5.0,{l:'#9f9a6c',a:'#e3dc97',i:'#fbf5b8'}],
 ['Winter Zauber Festbier','Festbier',5.3,{l:'#c5c6b5',a:'#4a4d30',i:'#474934'}],
 ['Dunkel \'79','Dunkel',5.0,{l:'#f2ecb3',a:'#2a1a10',i:'#604e37'}]]],
['Brauerei Eichhorn','Eichhorn','Forchheim','Oberfranken','DE','nrw','brown','#f4d147','#de4f4a','#3a532d',[
 ['Annafestbier','Festbier',5.7],
 ['=Eichhorn Vollbier','Helles',4.9,{l:'#c2c1ba',a:'#94978e',i:'#625549',u:'Vollbier'}],
 ['Winterfestbier','Festbier',5.7,{l:'#341f0c',a:'#efe2c2',i:'#7e653d'}],
 ['Echhorn Edel Pils','Pils',5.4,{l:'#341f0c',a:'#efe2c2',i:'#7e653d'}]]],
['Schlossbrauerei Maxlrain','Maxlrainer','Tuntenhausen','Oberbayern','DE','nrw','brown','#293c46','#bad1c2','#f1edd8',[
 ['Original Maxl Helles','Helles',5.1],
 ['Aiblinger Schwarzbier','Schwarzbier',5.0,{l:'#e5d8c1',a:'#928254',i:'#33231a'}],
 ['Original Maxl Zwickl','Zwickel',5.3,{l:'#f9edd5',a:'#482f23',i:'#433128'}],
 ['Leo Weisse','Weißbier',5.0,{l:'#352a23',a:'#ebddc7',i:'#f1eadd'}],
 ['Helles','Helles',4.8,{l:'#eee1cf',a:'#442e1e',i:'#3f2f23'}]]],
['Wildbräu Grafing','Wildbräu','Grafing','Oberbayern','DE','nrw','brown','#1f4d6b','#b7a58a','#c4bcac',[
 ['Helles','Helles',5.0],
 ['Meistersud','Helles',5.8,{l:'#d9c9a9',a:'#ac3e2b',i:'#9b4a3c'}],
 ['Grandauer Weißbier','Weißbier',5.1,{l:'#901c0f',a:'#d4b89c',i:'#cdb8a3'}],
 ['Pils','Pils',4.8,{l:'#3e5735',a:'#e8ddc2',i:'#e7e2d0'}],
 ['Kirtabier','Festbier',5.7,{l:'#cec7a0',a:'#2a1a10',i:'#c56434'}]]],
['Klosterbrauerei Reutberg','Reutberger','Sachsenkam','Oberbayern','DE','nrw','brown','#7f6a61','#b9c0c5','#b9c0c5',[
 ['Kloster-Hell','Helles',4.8],
 ['Export Dunkel','Dunkel',4.8,{l:'#8e7c6a',a:'#b5c1c7',i:'#b7c0c5'}],
 ['Kloster-Weisse','Weißbier',4.9,{l:'#3584aa',a:'#bacfde',i:'#bfced9'}],
 ['Kloster Märzen','Märzen',5.6,{l:'#90a5aa',a:'#cec8c6',i:'#6d4b3b'}],
 ['Kloster-Pils','Pils',5.0,{l:'#49413c',a:'#98b2b7',i:'#e4e6e4'}]]],
['Brauerei Maisach','Maisacher','Maisach','Oberbayern','DE','nrw','brown','#9fa09a','#810b06','#711a16',[
 ['=Maisacher Perle','Helles',5.3,{u:'Perle'}],
 ['Kneißl Dunkel','Dunkel',5.0,{l:'#23160c',a:'#b08968',i:'#baa28b'}],
 ['=Maisacher Kellerbier','Kellerbier',5.3,{l:'#4f392c',a:'#b3b6b0',i:'#cdd2cc',u:'Kellerbier'}],
 ['=Maisacher Freibier','Alkoholfrei',0.5,{l:'#c3c7c7',a:'#134486',i:'#29262d',u:'Freibier'}],
 ['Munddusche Helles','Helles',5.2,{l:'#d8d9e3',a:'#833226',i:'#773b32'}]]],
['Brauhaus Faust','Faust','Miltenberg','Unterfranken','DE','nrw','brown','#e9e6d4','#3da1e5','#4d7892',[
 ['Bayrisch Hell','Helles',4.8],
 ['Kräusen Naturtrüb','Helles',5.5,{l:'#d69f68',a:'#2a1a10',i:'#ab5912'}],
 ['=Faust Pils','Pils',4.9,{l:'#090d3a',a:'#b8c3d0',i:'#ccd4e1',u:'Pils'}],
 ['Hefe Weizen Hell','Weißbier',5.1,{l:'#e0e0d2',a:'#14285b',i:'#1d2c52'}],
 ['Schwarzviertler Dunkel','Schwarzbier',5.2,{l:'#0d0d04',a:'#770011',i:'#eff49b'}]]],
['Kauzen-Bräu','Kauzen','Ochsenfurt','Unterfranken','DE','nrw','brown','#8becfb','#f8fefe','#44484f',[
 ['Käuzle Helles Lager','Lager',4.9],
 ['Käuzle Pilsner','Pils',5.0,{l:'#e93d28',a:'#4e2829',i:'#fcfdfd'}],
 ['Weissbier Dunkel','Dunkles Weißbier',5.0,{l:'#e6dcc5',a:'#881c20',i:'#7a2a2d'}],
 ['Wolf-Bier Pils','Pils',4.9,{l:'#30884e',a:'#fcfcff',i:'#fcfcff'}],
 ['Frankonia Laurentius','Helles',5.5,{l:'#c3c1b7',a:'#72473a',i:'#6b4b41'}]]],
['Wernecker Bierbrauerei','Wernecker','Werneck','Unterfranken','DE','nrw','brown','#d4c5b9','#7d8152','#787b58',[
 ['Frankonia Clanbier','Stout',4.8],
 ['Frankonia Vollbier Hell','Helles',4.8,{l:'#fff9e2',a:'#d60b00',i:'#c41b12'}],
 ['Haustrunk Pils','Pils',4.8],
 ['Laurentius','Helles',5.5]]],
['Pyraser Landbrauerei','Pyraser','Thalmässing','Mittelfranken','DE','nrw','brown','#bcc199','#807942','#78734a',[
 ['Kellerbier','Kellerbier',4.8],
 ['Landbier','Landbier',5.2,{l:'#ddd0b3',a:'#a72e17',i:'#943b2a'}],
 ['Rotbier','Spezialbier',4.6,{l:'#762218',a:'#ac7b61',i:'#e9ddc4'}],
 ['Helles','Helles',4.9,{l:'#15a4d7',a:'#f1e4d1',i:'#f7f9f3'}],
 ['Angerwirts Weizen Hell','Weißbier',5.2,{l:'#e0d8c5',a:'#175394',i:'#275484'}]]],
['Brauerei Wiethaler','Wiethaler','Neunhof bei Lauf','Mittelfranken','DE','swing','brown','#beb049','#f7e47b','#57501c',[
 ['Goldstoff Hell','Helles',5.4],
 ['Lager Hell','Lager',4.8,{l:'#ecf2c5',a:'#b9c28c',i:'#6d7d5a'}],
 ['Landbier Dunkel','Dunkel',4.9,{l:'#60352c',a:'#d6bfa6',i:'#f2eeec'}],
 ['Weihnachts Festbier','Festbier',5.5,{l:'#16246c',a:'#c4d0f1',i:'#f2f5f7'}],
 ['Hoptimum Pale Ale','Pale Ale',5.8,{l:'#24734c',a:'#dbede5',i:'#ddebe5'}]]],
['Privatbrauerei Kesselring','Kesselring','Marktsteft','Unterfranken','DE','nrw','brown','#315e23','#dfcf9f','#e0d9c0',[
 ['Urfränkisches Landbier Hell','Landbier',5.0],
 ['Urfränkisches Landbier Original','Dunkel',5.3,{l:'#e2debf',a:'#cbbc7e',i:'#722d1d'}],
 ['Steinie² Original','Spezialbier',5.3,{l:'#fdfee7',a:'#d2251f',i:'#bb3b36'}],
 ['Urfränkisches Winterbier Spezial','Festbier',5.5,{l:'#eee2d2',a:'#bba29a',i:'#472b62'}],
 ['Urfränkisches Landbier Doppelbock','Doppelbock',7.5,{l:'#ede5cf',a:'#ba9d8a',i:'#3d2b18'}]]],
['Rhanerbräu','Rhaner','Schönthal','Oberpfalz','DE','nrw','brown','#ecc7b1','#d64532','#c15547',[
 ['Sagenhaftes Rotbier','Spezialbier',4.5],
 ['Maxi-Bock','Bock',6.5,{l:'#463c6b',a:'#bfb48f',i:'#f5f3e7'}],
 ['1283 Hell','Helles',4.8,{l:'#174c7e',a:'#ffe726',i:'#f8eb81'}],
 ['Kellerbier','Kellerbier',5.2,{l:'#a98766',a:'#eed6b0',i:'#fbf9f3'}],
 ['1904 RPM Pale Märzen','Märzen',5.6,{l:'#202e31',a:'#92b0a5',i:'#eedfd2'}]]],
['Brauerei Kummert','Kummert','Amberg','Oberpfalz','DE','nrw','brown','#afc3c3','#fff9f1','#3a4035',[
 ['27er Urtyp','Helles',4.8],
 ['Hausbier Dunkles Zoigl','Kellerbier',4.9,{l:'#5b1d19',a:'#d46668',i:'#f5e8db'}],
 ['Hell','Helles',4.9,{l:'#dbbd8e',a:'#faedda',i:'#63221e'}],
 ['Bockbier Doppelbock','Doppelbock',7.9,{l:'#684f48',a:'#fff0df',i:'#fef0e0'}],
 ['33er Pils','Pils',4.9,{l:'#687946',a:'#f0e5df',i:'#eee6e1'}]]],
['Brauerei Bruckmüller','Bruckmüller','Amberg','Oberpfalz','DE','nrw','brown','#fde3ae','#2a1a10','#a84023',[
 ['Hell','Helles',5.0],
 ['Kellerbier','Kellerbier',5.3,{l:'#b5a683',a:'#454377',i:'#4b4a70'}],
 ['Knappentrunk','Dunkel',5.3,{l:'#fde1ab',i:'#a97453'}],
 ['Weizen Falk Dunkles Falk','Dunkles Weißbier',5.3,{l:'#f2d396',i:'#734d38'}],
 ['Pils 03','Pils',4.7,{l:'#bab499',a:'#655934',i:'#5f563a'}]]],
['Privatbrauerei Sterk','Sterk','Raigering','Oberpfalz','DE','nrw','brown','#dec5ac','#7c464a','#754d50',[
 ['Raigeringer Edelhell','Helles',4.9],
 ['Pandurenblut','Helles',5.7,{l:'#bd4647',a:'#e4cedc',i:'#e1d1db'}],
 ['Raigeringer Festbier','Festbier',5.4,{l:'#8b464a',a:'#a9817a',i:'#e4d8dd'}],
 ['Raigeringer Doppelbock','Doppelbock',7.5,{l:'#442b3c',a:'#9d888f',i:'#e3d6df'}]]],
['Privatbrauerei Hösl','Hösl','Mitterteich','Oberpfalz','DE','nrw','brown','#683839','#e3d2b3','#ece6cf',[
 ['Zünftiges Wirtshaus-Bier','Helles',5.2],
 ['Edelpilsener','Pils',4.9,{l:'#174132',a:'#b4b07e',i:'#c8c59c'}],
 ['Mein Helles','Helles',4.8,{l:'#f3f0ea',a:'#134429',i:'#193e2a'}],
 ['Märzen','Märzen',5.6,{l:'#544b51',a:'#cfd7e4',i:'#d2d8e1'}],
 ['Abt Andreas Traditionstrunk','Dunkel',4.9,{l:'#cbae1d',a:'#5c3019',i:'#533322'}]]],
['Schlossbrauerei Naabeck','Naabecker','Schwandorf','Oberpfalz','DE','nrw','brown','#fdfbfa','#d5180b','#bb2f25',[
 ['Hell','Helles',5.1],
 ['Dunkel','Dunkel',5.1,{l:'#32241f',a:'#dfcca4',i:'#d7c9ac'}],
 ['Spezial','Helles',5.5,{l:'#f9f2f0',a:'#ab4748',i:'#9e5455'}],
 ['Edel Märzen','Märzen',5.7,{l:'#665d26',a:'#97c0c4',i:'#cec3ab'}],
 ['Pils','Pils',5.1,{l:'#825f50',a:'#f1e7df',i:'#f4ede6'}]]],
['Spitalbrauerei Regensburg','Spital','Regensburg','Oberpfalz','DE','nrw','brown','#e3e6e9','#947b63','#8e7b69',[
 ['Helles','Helles',5.0],
 ['Ur-Hell','Helles',4.9,{l:'#514960',a:'#cac076',i:'#e6e5c8'}],
 ['Dunkles','Dunkel',5.4,{l:'#ffffff',a:'#466789',i:'#4f6780'}],
 ['Pils','Pils',5.5,{l:'#4c6b2e',a:'#e3e097',i:'#e6e4ba'}],
 ['Weizen','Weißbier',5.2,{l:'#ebe8e8',a:'#b0b3ae',i:'#9c6f72'}]]],
['Prösslbräu Adlersberg','Prösslbräu','Adlersberg','Oberpfalz','DE','nrw','brown','#d6dbe2','#5a302a','#543530',[
 ['Palmator Dunkler Doppelbock','Doppelbock',7.4],
 ['=Prösslbräu Adlersberg Hell','Helles',5.0,{l:'#eaeaec',a:'#462d33',i:'#433035',u:'Adlersberg Hell'}],
 ['Bayerisch Dunkel','Dunkel',5.0,{l:'#f9f9f8',a:'#6a4735',i:'#63493c'}],
 ['Zwickl','Zwickel',5.2,{l:'#d2b898',a:'#f8e8ca',i:'#9c7362'}],
 ['Adlersberg Kloster-Gold','Helles',5.4,{l:'#e7dfd5',a:'#9e935a',i:'#63472c'}]]],
['Hofmark Brauerei','Hofmark','Loifling','Oberpfalz','DE','nrw','brown','#fff6f2','#8a0a00','#781912',[
 ['Simaro','IPA',8.2],
 ['Bavaria','Helles',5.3,{l:'#e8e9eb',a:'#1c265c',i:'#242c54'}],
 ['Hell','Helles',4.9,{l:'#dcccae',a:'#473921',i:'#423826'}],
 ['Braumeister Zwickl','Zwickel',5.1,{l:'#778a3f',a:'#414c24',i:'#eaeae7'}],
 ['Original Hell','Helles',5.1,{l:'#41332e',a:'#7b7c6e',i:'#9c9c87'}]]],
['Röhrlbräu','Röhrl','Straubing','Niederbayern','DE','nrw','brown','#7e5d4c','#6e80b9','#dcd1cd',[
 ['Bayern Liebe Helles','Helles',4.8],
 ['Bayern Liebe Märzen','Märzen',5.6,{l:'#b6967b',a:'#2a1a10',i:'#693728'}],
 ['=Röhrl Hell','Helles',4.8,{l:'#d9dce4',a:'#79796e',i:'#79796e',u:'Hell'}],
 ['Schwarzer Bruder','Schwarzbier',5.6,{l:'#1a1f29',a:'#cbb64a',i:'#d3dbb3'}],
 ['Gäuboden Festbier','Festbier',5.6,{l:'#b2d0d3',a:'#eac628',i:'#666138'}]]],
['Karmeliten Brauerei','Karmeliten','Straubing','Niederbayern','DE','nrw','brown','#9b8469','#fbdeb0','#f1dcba',[
 ['Kloster Gold','Helles',5.1],
 ['Kloster Urtyp','Helles',4.9,{l:'#4b361b',a:'#ecd78e',i:'#e0d09a'}],
 ['Marie','Helles',3.7,{l:'#c0c4c6',a:'#365974',i:'#3e586c'}],
 ['=Karmeliten Luggi','Helles',4.6,{l:'#8b453a',a:'#cfaba0',i:'#edeaec',u:'Luggi'}],
 ['Kloster Dunkel','Dunkel',5.1,{l:'#c0bb73',a:'#8f874f',i:'#261e1c'}]]],
['Privatbrauerei J. B. Falter','Falter','Regen','Niederbayern','DE','nrw','brown','#cccbce','#793541','#703e47',[
 ['Export Hell','Export',5.3],
 ['Budderl Privat-Pils','Pils',4.9,{l:'#bac4be',a:'#4a482c',i:'#464530'}],
 ['Regenator','Doppelbock',7.3,{l:'#a4544d',a:'#661a19',i:'#dadfe2'}],
 ['Pichelsteiner Festbier','Festbier',5.9,{l:'#dcc19c',a:'#863633',i:'#7b403e'}],
 ['Export Dunkel','Dunkel',5.3,{l:'#c1b8ad',a:'#84755f',i:'#55412f'}]]],
['Weideneder Bräu','Weideneder','Tann','Niederbayern','DE','nrw','brown','#432022','#716f73','#a8a5ab',[
 ['=Weideneder Festbier','Festbier',5.6,{u:'Festbier'}],
 ['Weizengold','Weißbier',5.3,{l:'#522c24',a:'#efe2c2',i:'#cbad92'}]]],
['Bucher Bräu','Bucher','Grafenau','Niederbayern','DE','nrw','brown','#fffee9','#006843','#223723',[
 ['Helles - Das Original','Helles',4.9],
 ['Bären Gold Edel Hell','Helles',5.2,{l:'#dac168',a:'#fbf0ce',i:'#7a7341'}],
 ['Pils','Pils',4.9,{l:'#d6d5c8',a:'#204d36',i:'#264736'}],
 ['Festbier','Festbier',5.6,{l:'#28321e',a:'#fff2d6',i:'#fcf1d9'}],
 ['Goaßerl','Radler',2.0,{l:'#523456',a:'#fee3ba',i:'#f5e1c3'}]]],
['Hutthurmer Bayerwald Brauerei','Hutthurmer','Hutthurm','Niederbayern','DE','nrw','brown','#9dcee5','#eff2f4','#7b4737',[
 ['Helles','Helles',4.9],
 ['Urtyp Hell','Helles',4.9,{l:'#3d6380',a:'#7a6543',i:'#eeeff0'}],
 ['Gourmet','Helles',4.9,{l:'#d3c5a4',a:'#f4f5f5',i:'#744f3d'}],
 ['Kulinator','Doppelbock',7.0,{l:'#cdc1b8',a:'#642943',i:'#5c3144'}],
 ['Winterzauber','Festbier',5.5,{l:'#7f2430',a:'#d5beae',i:'#f4f4f5'}]]],
['Schlossbrauerei Irlbach','Irlbacher','Irlbach','Niederbayern','DE','nrw','brown','#d6dad6','#d51315','#bc2c2e',[
 ['Vollbier Hell','Helles',4.9],
 ['Exzellent','Helles',5.6,{l:'#dbdedd',a:'#9c8e70',i:'#8e5b44'}],
 ['Das Echte Gäuboden Volksfestbier','Festbier',5.6,{l:'#907459',a:'#4a4c4e',i:'#dfcca8'}],
 ['Weihnachts-Festbier','Festbier',5.8,{l:'#6a404e',a:'#b8726a',i:'#f0dcb2'}],
 ['Pils','Pils',5.2,{l:'#d3b9ae',a:'#b06b5d',i:'#a57268'}]]],
['Schwarzbräu','Schwarzbräu','Zusmarshausen','Schwaben','DE','nrw','brown','#548fbc','#575462','#e8ebea',[
 ['Marie Hausbrendel Hell','Helles',4.8],
 ['Aged Bock','Doppelbock',8.1,{l:'#2c0406',a:'#efe2c2',i:'#d5b874'}],
 ['Der Urtyp','Helles',5.5,{l:'#dfddd2',a:'#af060c',i:'#991c20'}],
 ['Ex & Hop','Helles',5.4,{l:'#242324',a:'#d7c881',i:'#ccc18c'}],
 ['Schweden Pils','Pils',5.0,{l:'#eceeef',a:'#7ebadd',i:'#916c46'}]]],
['Thorbräu','Thorbräu','Augsburg','Schwaben','DE','nrw','brown','#467686','#b6a977','#e1d5b9',[
 ['Helles Vollbier','Helles',4.8],
 ['Maximilian\'s Kellerbier','Kellerbier',5.0,{l:'#201515',a:'#bba786',i:'#b4a58d'}],
 ['Augsburger Weisse','Weißbier',5.4,{l:'#e6dfb7',a:'#a8b5b0',i:'#7f6e6e'}],
 ['=Thorbräu Dunkles','Dunkel',5.6,{l:'#b7ae8c',a:'#746950',i:'#312a26',u:'Dunkles'}],
 ['Celtic','Helles',5.0,{l:'#3f281b',a:'#c7ad4d',i:'#cfbf7d'}]]],
['Brauerei Ustersbach','Ustersbacher','Ustersbach','Schwaben','DE','nrw','brown','#ece6be','#2a1a10','#8a5a4e',[
 ['Urhell','Helles',4.9],
 ['Edel-Export','Export',5.5,{l:'#e9dfab',a:'#7e705a',i:'#796f5f'}],
 ['Bayerisch Hefeweizen','Weißbier',5.5,{l:'#ddd1a1',a:'#6a6357',i:'#6a6357'}],
 ['Oberschönenfelder Helles','Helles',5.0,{l:'#bacdc4',a:'#345365',i:'#3a515f'}],
 ['Land-Zwickel','Zwickel',5.1,{l:'#dccfa3',i:'#715a3e'}]]],
['Schlossbrauerei Autenried','Autenrieder','Ichenhausen','Schwaben','DE','nrw','brown','#67191f','#efe2c2','#e3af70',[
 ['Schlossbräu Bernstein Weisse','Weißbier',5.4],
 ['Zwickel','Zwickel',5.0,{l:'#fcf8f7',a:'#92674c',i:'#896955'}],
 ['Schlossbräu Original','Helles',5.3,{l:'#243224',i:'#d5aa74'}],
 ['Pilsner','Pils',5.1,{l:'#02b46f',a:'#f5f7f7',i:'#fafdfd'}],
 ['Leonhardi-Bock','Doppelbock',7.7,{l:'#f4ebd7',a:'#902b1c',i:'#81362b'}]]],
['Memminger Brauerei','Memminger','Memmingen','Schwaben','DE','nrw','brown','#afd4d8','#dec56d','#968555',[
 ['=Memminger Gold','Helles',5.5,{u:'Gold'}],
 ['St. Bonifatius','Bock',6.5],
 ['=Memminger Weißbier','Weißbier',5.1,{l:'#6e6b76',a:'#eaebed',i:'#feffff',u:'Weißbier'}],
 ['Göbel Löwen Original','Helles',5.0,{l:'#aeaca6',a:'#5c2a19',i:'#532e22'}],
 ['Hirsch Bier Urhell','Helles',4.9,{l:'#8d2e21',a:'#242545',i:'#b49b7f'}]]],
['Aktienbrauerei Kaufbeuren','ABK','Kaufbeuren','Schwaben','DE','nrw','brown','#322a2b','#ad9272','#c8b497',[
 ['Allgäu Stoff','Helles',4.9],
 ['Das Blaue Hell','Helles',5.0,{l:'#4a160c',a:'#00acea',i:'#f1e592'}],
 ['=ABK Kellerbier Naturtrüb','Kellerbier',5.1,{l:'#ffed82',a:'#79210f',i:'#110805',u:'Kellerbier Naturtrüb'}],
 ['Dunkles Radler Halbstark','Radler',2.5,{l:'#d9b889',a:'#fff3ca',i:'#181410'}],
 ['Hefeweizen Anno 25','Weißbier',5.3,{l:'#3f301b',a:'#f1d377',i:'#fdf483'}]]],
['Edelweissbrauerei Farny','Farny','Kißlegg','Allgäu','DE','nrw','brown','#dfdfdb','#968e61','#7f5325',[
 ['Kristall-Weizen','Kristallweizen',5.3],
 ['Hefe Weizen','Weißbier',5.3,{l:'#972d28',a:'#dde2de',i:'#edecea'}],
 ['=Farny Hofgutsbier','Helles',5.2,{l:'#dedece',a:'#6b7d40',i:'#764c20',u:'Hofgutsbier'}],
 ['Helles 1833','Helles',4.9,{l:'#033b8c',a:'#d7dcde',i:'#d7dcde'}],
 ['=Farny Winterbier','Festbier',5.5,{l:'#483734',a:'#82754b',i:'#e6e2d6',u:'Winterbier'}]]],
['Zwiefalter Klosterbräu','Zwiefalter','Zwiefalten','Baden-Württemberg','DE','nrw','brown','#000000','#b4b1b0','#fbfbf9',[
 ['1521','Helles',5.1],
 ['Helles Engele','Helles',5.0,{l:'#31b3e5',a:'#f9c785',i:'#f3f0e4'}],
 ['Spezial','Helles',5.3,{l:'#dcbc7b',a:'#130e00',i:'#130e00'}],
 ['Festbier (Herbstbier)','Festbier',5.6,{l:'#191917',a:'#dbb8ae',i:'#eee2df'}],
 ['Benedictus Eisbock','Doppelbock',8.0,{l:'#653179',a:'#d2d1d4',i:'#fefefe'}]]],
['Brauerei Max Leibinger','Leibinger','Ravensburg','Baden-Württemberg','DE','nrw','brown','#6d81a6','#d9c4bc','#d5c6c0',[
 ['=Leibinger Helles','Helles',4.8,{u:'Helles'}],
 ['Edel','Helles',5.5,{l:'#99463d',a:'#d7cbbf',i:'#d4cbc2'}],
 ['=Leibinger Pils','Pils',4.8,{l:'#dcd1c0',a:'#aba39d',i:'#5a3135',u:'Pils'}],
 ['Seeweisse Hell','Weißbier',5.5,{l:'#bdafa2',a:'#7a5d4a',i:'#3a2415'}],
 ['=Leibinger Seeradler naturtrüb','Radler',2.6,{l:'#9dab6e',a:'#5e525a',i:'#5e525a',u:'Seeradler naturtrüb'}]]],
['Ruppaner Brauerei','Ruppaner','Konstanz','Baden-Württemberg','DE','nrw','brown','#e0c7a5','#5f6873','#3f3635',[
 ['=Ruppaner Fischerin vom Bodensee','Helles',4.8,{u:'Fischerin vom Bodensee'}],
 ['Bodensee Pils','Pils',5.0,{l:'#0c391e',a:'#989686',i:'#cfccca'}],
 ['Schimmele','Helles',5.0,{l:'#d2c6a7',a:'#2a1a10',i:'#8e321d'}],
 ['Bio Märzen','Märzen',5.5,{l:'#ded7cc',a:'#ff2610',i:'#af2a19'}],
 ['Spezial Export','Export',5.2,{l:'#d8dadd',a:'#beb1a2',i:'#754e3f'}]]],
['Palmbräu','Palmbräu','Eppingen','Baden-Württemberg','DE','nrw','brown','#493d61','#e1dfdb','#efede7',[
 ['Unser Bestes Spezial Pils','Pils',5.3],
 ['Das Original','Helles',5.2,{l:'#642f13',a:'#efe2c2',i:'#d3af64'}],
 ['Zwickel Hell','Zwickel',4.8,{l:'#f7f3e9',a:'#c50014',i:'#b01525'}],
 ['Hefeweizen','Weißbier',5.2,{l:'#cec0a9',a:'#862140',i:'#792e45'}],
 ['Maulbronner Klosterbräu Hell','Helles',5.3,{l:'#f6e4cc',a:'#2a1a10',i:'#813b1b'}]]],
['Privatbrauerei Hoepfner','Hoepfner','Karlsruhe','Baden-Württemberg','DE','nrw','brown','#d4dbde','#256d3e','#51391e',[
 ['=Hoepfner Pilsner','Pils',4.7,{u:'Pilsner'}],
 ['=Hoepfner Hefe Weizen','Weißbier',4.9,{l:'#ffffff',a:'#ffe89e',i:'#605335',u:'Hefe Weizen'}],
 ['=Hoepfner Export','Export',5.2,{l:'#fdfcfc',a:'#a12428',i:'#913437',u:'Export'}],
 ['Kräusen','Helles',5.1,{l:'#792004',a:'#c1c2bb',i:'#d1d5d5'}],
 ['Goldköpfle','Helles',5.5,{l:'#33332c',a:'#9aa299',i:'#b2b27d'}]]],
['Schönbuch Braumanufaktur','Schönbuch','Böblingen','Baden-Württemberg','DE','nrw','brown','#3a3d19','#d6d7d9','#d6d7d9',[
 ['=Schönbuch Jäger Spezial','Helles',5.4,{u:'Jäger Spezial'}],
 ['Lucky Experience','Helles',5.0,{l:'#4d303f',a:'#d0346c',i:'#f7e612'}],
 ['=Schönbuch Naturtrüb','Helles',4.8,{l:'#f1efed',a:'#2a1a10',i:'#ab9266',u:'Naturtrüb'}],
 ['Horst Hell','Helles',4.8,{l:'#e5c494',a:'#89ae8f',i:'#172125'}],
 ['=Schönbuch Pils','Pils',4.8,{l:'#f0eeeb',a:'#466c21',i:'#46622b',u:'Pils'}]]],
['Glaabsbräu','Glaabsbräu','Seligenstadt','Hessen','DE','nrw','brown','#a52118','#178b4c','#eae5dd',[
 ['Pilsener','Pils',4.7],
 ['1744 Kellerbier','Kellerbier',5.2,{l:'#100e0c',a:'#ffde22',i:'#ebd036'}],
 ['Helles','Helles',4.6,{l:'#bb1c12',a:'#b8a68f',i:'#e9e2d9'}],
 ['=Glaab’s Hopfenlust','Helles',3.8,{l:'#52b739',a:'#d3bda2',i:'#e1dbc9',u:'Glaab’s Hopfenlust',t:'Glaabsbräu'}],
 ['=Glaab\'s Vicky Loves Pale Ale','Pale Ale',5.7,{l:'#850a2e',a:'#d8c2b4',i:'#eae1db',u:'Pale Ale',t:'Glaabsbräu'}]]],
['Privat-Brauerei Schmucker','Schmucker','Mossautal','Hessen','DE','nrw','brown','#e6e5d8','#504032','#4c4036',[
 ['Odenwälder Export','Export',5.2],
 ['Gude Pils','Pils',5.0,{l:'#cfc0b4',a:'#584740',i:'#554843'}],
 ['Meister Pils','Pils',4.9,{l:'#f0e59d',a:'#3f3220',i:'#3b3124'}],
 ['Rosé Bock','Doppelbock',8.0,{l:'#d6cbc5',a:'#a98983',i:'#0b0c0b'}],
 ['Bio Landbier','Landbier',5.0,{l:'#d3d0c4',a:'#2a1a10',i:'#865730'}]]],
['Hütt-Brauerei','Hütt','Baunatal','Hessen','DE','nrw','brown','#f6ebe1','#949241','#a33b1a',[
 ['=Hütt Naturtrüb','Helles',4.9,{u:'Naturtrüb'}],
 ['=Hütt Lux Klassik Pils','Pils',4.9,{l:'#dcdbd9',a:'#913926',i:'#834234',u:'Lux Klassik Pils'}],
 ['=Hütt Helles','Helles',4.8,{l:'#287ea9',a:'#f5f4bf',i:'#f3f4d6',u:'Helles'}],
 ['=Knallhütter Pilsner','Pils',4.9,{l:'#fbf2dd',a:'#a1a776',i:'#95583e',u:'Knallhütter Pilsner'}],
 ['Luxus Pils','Pils',4.9,{l:'#181717',a:'#a3845e',i:'#e5dec6'}]]],
['Alsfelder Landbrauerei','Alsfelder','Alsfeld','Hessen','DE','nrw','brown','#c6d8d7','#8f7654','#87755c',[
 ['Vogelsberger Naturbursche Bio Helles','Helles',4.9]]],
['Brauerei Grohe','Grohe','Darmstadt','Hessen','DE','nrw','brown','#fffff8','#93273d','#853545',[
 ['Kleiner Bock','Bock',6.2],
 ['Hell','Helles',5.1,{l:'#e5e5da',a:'#7a3435',i:'#713d3e'}],
 ['Pale Ale','Pale Ale',5.6,{l:'#32797d',a:'#4fc1ba',i:'#f3eda0'}],
 ['Bock','Bock',6.2,{l:'#c4b7ab',a:'#e7e8e3',i:'#782c1f'}],
 ['Märzen','Märzen',5.1,{l:'#c1b3a3',a:'#e6e6dc',i:'#743412'}]]],
['Darmstädter Privatbrauerei','Darmstädter','Darmstadt','Hessen','DE','nrw','brown','#131312','#efe2c2','#a4925d',[
 ['Braustübl Pilsner','Pils',4.8],
 ['=Darmstädter Braustübl Helles','Helles',5.2,{l:'#e3cea5',a:'#2a1a10',i:'#a77a5b',u:'Braustübl Helles'}],
 ['Naturtrübes Helles','Helles',5.2,{l:'#f8f2d8',a:'#c9b599',i:'#725c4d'}],
 ['Braustübl Weissbier Hefe-Hell','Weißbier',4.8,{l:'#648fb4',a:'#d3ceb3',i:'#cfcbb7'}],
 ['Mokka Stout','Stout',6.2,{l:'#adaf92',a:'#564d3d',i:'#26211d'}]]],
['Privatbrauerei Bischoff','Bischoff','Winnweiler','Pfalz','DE','nrw','brown','#077527','#4ec261','#fbffbe',[
 ['Pfälzer Hell','Helles',5.2],
 ['Falkensteiner Dry Hopped Wheat','Weißbier',5.2,{l:'#df5702',a:'#dbcda6',i:'#eee6c9'}],
 ['Falkensteiner Ur-Weisse','Weißbier',5.2],
 ['=Bischoff Premium Pilsner','Pils',4.9,{l:'#c5c7cb',a:'#47443e',i:'#47443e',u:'Premium Pilsner'}],
 ['Pils','Pils',4.7]]],
['Brauerei G. A. Bruch','Bruch','Saarbrücken','Saarland','DE','nrw','brown','#ed2a0c','#fdedde','#f9ede2',[
 ['Saarbrücker Hell','Helles',4.8],
 ['Zwickel','Zwickel',4.8,{l:'#f6f3e5',a:'#b6a182',i:'#afa089'}],
 ['Festbock','Bock',6.8,{l:'#742d2f',a:'#e4d6d2',i:'#f4ece8'}],
 ['No. 1 Pilsener','Pils',4.8,{l:'#efe1e1',a:'#2a1a10',i:'#875e47'}],
 ['Landbier 1702','Dunkel',5.5,{l:'#d8c9bd',a:'#63302d',i:'#5c3634'}]]],
['Vulkan Brauerei','Vulkan','Mendig','Rheinland-Pfalz','DE','nrw','brown','#41978e','#845a4f','#dbdab2',[
 ['Bio Pale Ale','Pale Ale',5.6],
 ['Bio Hell','Helles',4.9,{l:'#567b5b',a:'#c3222d',i:'#e9d0af'}],
 ['Bio Dunkel','Dunkel',5.1,{l:'#515e70',a:'#cbcdcf',i:'#cbcdcf'}],
 ['Bio Limitiert Sud 10 Eifeler Rohnatur','Helles',4.9,{l:'#008745',a:'#90c200',i:'#c8db65'}],
 ['Pils','Pils',4.9,{l:'#ffffff',a:'#c93d1f',i:'#b34b35'}]]],
['Erzquell Brauerei Bielstein','Erzquell','Wiehl','Bergisches Land','DE','nrw','brown','#1d1917','#a4a7a9','#bbbfc1',[
 ['Zunft Kölsch','Kölsch',4.8],
 ['Bergisches Landbier','Landbier',4.8,{l:'#695044',a:'#c0c1c5',i:'#cacbd0'}],
 ['Bergischer Sportsfreund','Alkoholfrei',0.0,{l:'#644942',a:'#7a9dab',i:'#ebe8de'}],
 ['Bergischer Radler','Radler',2.4,{l:'#d2ecfa',a:'#98c894',i:'#718261'}],
 ['Bergischer Radler Alkoholfrei','Radler',0.2,{l:'#ddf1fa',a:'#d9d996',i:'#60877b'}]]],
['Brauerei Bosch','Bosch','Bad Laasphe','Siegerland','DE','nrw','brown','#bfaf8f','#3d4139','#3d4139',[
 ['Braunbier','Dunkel',5.0],
 ['Pils','Pils',5.0,{l:'#4c593f',a:'#c2b8b0',i:'#cac3bf'}],
 ['Porter','Stout',5.3,{l:'#c6b5a3',a:'#3f3421',i:'#3b3325'}],
 ['Lager Hell','Lager',5.1,{l:'#404b47',a:'#b3a49b',i:'#cfc5c1'}],
 ['Weizen','Weißbier',5.3,{l:'#463d25',a:'#7e7f73',i:'#7e7f73'}]]],
['Warburger Brauerei','Warburger','Warburg','Ostwestfalen','DE','nrw','brown','#e8d9c9','#0037cb','#0827a9',[
 ['Bio Helles','Helles',5.2],
 ['Urtyp','Dunkel',5.0,{l:'#18312d',a:'#8c8c88',i:'#c2ced8'}],
 ['Pils','Pils',4.8,{l:'#1f1e5c',a:'#f0dcc1',i:'#eadbc7'}],
 ['=Warburger Landbier','Landbier',5.0,{l:'#5a331c',a:'#b3ae84',i:'#cfceb9',u:'Landbier'}],
 ['=Warburger Weisse','Weißbier',5.2,{l:'#2c39b6',a:'#4089f1',i:'#fbfdfd',u:'Weisse'}]]],
['Privatbrauerei Strate','Strate','Detmold','Ostwestfalen','DE','nrw','brown','#e0e4d7','#492a39','#452e39',[
 ['Thusnelda-Bier','Helles',4.8],
 ['Herb','Helles',4.8,{l:'#525025',a:'#ffdeab',i:'#f5dcb5'}],
 ['Pilsener','Pils',4.8,{l:'#f9d89b',a:'#2a1a10',i:'#573f2c'}],
 ['Landbier','Dunkel',4.8,{l:'#fde3ae',a:'#665d28',i:'#79331f'}],
 ['Kellerbier','Kellerbier',4.8,{l:'#d9c19f',a:'#2a1a10',i:'#6c3c30'}]]],
['Brauerei Allersheim','Allersheimer','Holzminden','Niedersachsen','DE','nrw','brown','#ede5dc','#8c7d55','#857a5c',[
 ['Gutsherren Pils','Pils',4.9],
 ['Gutsherren Landbier','Dunkel',5.0,{l:'#ccc0b8',a:'#828f6b',i:'#6a4f3f'}],
 ['Gutsherren Hell','Helles',5.0,{l:'#dfe3e5',a:'#557782',i:'#5b747c'}],
 ['=Allersheim Urpils','Pils',4.8,{l:'#cfc5b6',a:'#2a1a10',i:'#a76d58',u:'Allersheim Urpils',t:'Allersheimer'}],
 ['=Allersheim Landbier Dunkel','Dunkel',5.0,{l:'#30120c',a:'#9d2820',i:'#d2b58c',u:'Dunkel',t:'Allersheimer'}]]],
['Brauerei Pinkus Müller','Pinkus','Münster','Münsterland','DE','nrw','brown','#7bd8c9','#9ca09b','#776159',[
 ['=Pinkus Special','Helles',5.1,{u:'Special'}],
 ['=Pinkus Pils','Pils',5.0,{l:'#088646',a:'#abb17c',i:'#d7e0e6',u:'Pils'}],
 ['Hefe-Weizen','Weißbier',5.0,{l:'#c4b415',a:'#dee0df',i:'#361b13'}],
 ['=Original Pinkus','Helles',5.1,{l:'#d22924',a:'#b29877',i:'#ebdece',u:'Original Pinkus'}],
 ['Müllers Malz','Alkoholfrei',0.0,{l:'#654341',a:'#ffedba',i:'#f9f0d6'}]]],
['Brauerei Schwelm','Schwelmer','Schwelm','Ruhrgebiet','DE','nrw','brown','#b8ac76','#62754f','#7a482a',[
 ['=Schwelmer Bernstein','Pale Ale',4.8,{u:'Bernstein'}]]],
['Privatbrauerei Wittingen','Wittinger','Wittingen','Niedersachsen','DE','nrw','brown','#cfcfde','#444963','#484c5f',[
 ['Lüttjes Pilsener','Pils',4.7],
 ['Pilsner','Pils',4.9,{l:'#10121d',a:'#8c776b',i:'#b8aba4'}],
 ['1429 Das Original','Helles',5.1,{l:'#80736c',a:'#1d252b',i:'#1f2529'}],
 ['Lüttjes Export','Export',4.9,{l:'#8e8a8a',a:'#4d4242',i:'#4d4242'}],
 ['Lüttjes Schwarzbier','Schwarzbier',4.9,{l:'#8d816b',a:'#050c05',i:'#040704'}]]],
['Gilde Brauerei','Gilde','Hannover','Niedersachsen','DE','nrw','brown','#12232b','#efe7ef','#eee8ee',[
 ['=Gilde Pilsener','Pils',4.9,{u:'Pilsener'}],
 ['Ratskeller','Kellerbier',4.9,{l:'#cbe5f3',a:'#693329',i:'#613931'}],
 ['=Gilde Scorpions','Helles',4.8,{l:'#9a7f63',a:'#f4dd9f',i:'#1e1c1f',u:'Scorpions'}],
 ['Lindener Spezial','Helles',5.1,{l:'#cac3c9',a:'#cd0005',i:'#b4191d'}],
 ['=Gilde Radler','Radler',2.5,{l:'#dde1ea',a:'#0e1a29',i:'#0a0713',u:'Radler'}]]],
['Dithmarscher Privatbrauerei','Dithmarscher','Marne','Schleswig-Holstein','DE','nrw','brown','#cad3cd','#454139','#454139',[
 ['Urtyp','Helles',4.9],
 ['Pilsener','Pils',4.8,{l:'#e5d894',a:'#603b0c',i:'#553a17'}],
 ['Dunkel','Dunkel',4.9,{l:'#643127',a:'#9d7d5f',i:'#decfc6'}],
 ['Achtern Diek Landbier Pils','Pils',4.8,{l:'#26492e',a:'#7f9eab',i:'#c0c5bd'}],
 ['Naturtrüb','Helles',4.8,{l:'#5e3716',a:'#efe2c2',i:'#d9c286'}]]],
['Darguner Brauerei','Darguner','Dargun','Mecklenburg-Vorpommern','DE','nrw','brown','#fcf6e3','#3e6239','#425d3e',[
 ['Premium Pilsener','Pils',4.9],
 ['Schloss Pilsener (Netto)','Pils',4.9,{l:'#16761b',a:'#2ac32d',i:'#95dc94'}],
 ['Schloss Export (Netto)','Export',5.2,{l:'#bb1915',a:'#e8998d',i:'#dca299'}],
 ['Schloss Edel (Netto)','Helles',4.9,{l:'#ffece1',a:'#ffd995',i:'#977a46'}],
 ['Stier-Bier Pilsener','Pils',5.0,{l:'#0b2b2f',a:'#e5ebec',i:'#e6eaeb'}]]],
['Nörten-Hardenberger Brauerei','Nörten-Hardenberger','Nörten-Hardenberg','Niedersachsen','DE','nrw','brown','#718064','#b3cbcc','#b6c8c9',[
 ['Pils','Pils',4.8],
 ['Helles','Helles',5.2,{l:'#c2bfd3',a:'#8a8399',i:'#8a8399'}]]],
['Brauerei Weimar-Ehringsdorf','Ehringsdorfer','Weimar','Thüringen','DE','nrw','brown','#dae3de','#2b693b','#33613f',[
 ['Urbräu','Helles',4.8],
 ['Weimarer Hell','Helles',5.0,{l:'#e5d8c6',a:'#8abce5',i:'#a48b7e'}],
 ['Ritter­bräu','Dunkel',4.9,{l:'#6e1230',a:'#e3bfb3',i:'#ddc2b9'}],
 ['Bonifatius Bock','Bock',6.5,{l:'#e4e6e6',a:'#2a1a10',i:'#b55d1b'}]]],
['Privatbrauerei Gessner','Gessner','Sonneberg','Thüringen','DE','nrw','brown','#494d42','#d1d8d8','#d1d8d8',[
 ['Original Festbier','Festbier',5.6],
 ['Premium Pils','Pils',4.9,{l:'#dac38c',a:'#4a6357',i:'#193137'}],
 ['Alt Sumbarcher Dunkel','Alt',5.2,{l:'#441b12',a:'#e8b489',i:'#dcb595'}],
 ['=Gessner Dunkler Bock','Bock',6.8,{l:'#3c2f2d',a:'#7b695d',i:'#d9cec6',u:'Dunkler Bock'}],
 ['=Gessner Heller Doppelbock','Doppelbock',7.5,{l:'#645625',a:'#c4cbb6',i:'#dbd4a2',u:'Heller Doppelbock'}]]],
['Brauerei Neunspringe','Neunspringer','Worbis','Thüringen','DE','nrw','brown','#f9f8f8','#137495','#246c84',[
 ['Helles','Helles',4.9],
 ['Luther Urtyp','Dunkel',5.2,{l:'#0a194a',a:'#c81311',i:'#f5f1cc'}],
 ['Luther Porter','Stout',4.9,{l:'#151217',a:'#98241b',i:'#f6f3d1'}],
 ['Luther Starck Bier','Bock',7.0,{l:'#532623',a:'#a13926',i:'#cfbeb3'}],
 ['Luther Reformations Bier Pilsner','Pils',5.0,{l:'#413626',a:'#a92614',i:'#dac9bb'}]]],
['Altenburger Brauerei','Altenburger','Altenburg','Thüringen','DE','nrw','brown','#100e0b','#ae9371','#ebe2cb',[
 ['Premium Pils','Pils',4.9],
 ['Hell','Helles',4.9,{l:'#0d0c0b',a:'#596c77',i:'#c3c7b8'}],
 ['Winterbier','Festbier',5.5,{l:'#220814',a:'#e5d4d0',i:'#e2d6d3'}],
 ['Bock','Bock',7.0,{l:'#130d0f',a:'#e6d9cb',i:'#e3d9cf'}],
 ['Karli\'s Kellerbier','Kellerbier',4.9,{l:'#13110f',a:'#eadfc2',i:'#e5ddc7'}]]],
['Watzdorfer Traditions- & Spezialitätenbrauerei','Watzdorfer','Bad Blankenburg','Thüringen','DE','nrw','brown','#c2b584','#2a1a10','#593c2a',[
 ['=Watzdorfer 1411 Festpils','Pils',4.9,{u:'1411 Festpils'}],
 ['=Watzdorfer Burg Pils','Pils',4.9,{l:'#687b49',a:'#80ae72',i:'#f2e4c1',u:'Burg Pils'}],
 ['=Watzdorfer Landbier','Landbier',4.9,{l:'#aab096',a:'#817b41',i:'#25472f',u:'Landbier'}],
 ['=Watzdorfer Schwarzbier','Schwarzbier',5.1,{l:'#342c28',a:'#af1c28',i:'#cec76b',u:'Schwarzbier'}],
 ['Hell','Helles',4.9,{l:'#b7cccc',a:'#567e7d',i:'#5b7978'}]]],
['Meininger Privatbrauerei','Meininger','Meiningen','Thüringen','DE','nrw','brown','#9ea6a9','#67726c','#67726c',[
 ['Fläminger Pilsner','Pils',4.9],
 ['Fläminger Spezial','Helles',5.3,{l:'#aab7be',a:'#152d2c',i:'#182a29'}]]],
['Privatbrauerei Eibau','Eibauer','Eibau','Sachsen','DE','nrw','brown','#012fab','#ebe4be','#e5e0c4',[
 ['Schwarzbier','Schwarzbier',4.5],
 ['Zwick\'l','Zwickel',5.2,{l:'#d2dade',a:'#b82b34',i:'#a63d44'}],
 ['Lausitzer Dunkel','Dunkel',4.2,{l:'#fa0012',a:'#f8eac0',i:'#f1e6c7'}],
 ['Summer Mint','Radler',2.5,{l:'#748a52',a:'#f9fbf9',i:'#f9fbf9'}],
 ['Zwick\'l Dunkel','Zwickel',6.7,{l:'#100f0f',a:'#b80c15',i:'#8a393d'}]]],
['Bergquell-Brauerei Löbau','Löbauer','Löbau','Sachsen','DE','nrw','brown','#24201b','#c42128','#ebe2da',[
 ['Lausitzer Porter','Stout',4.2],
 ['Kirsch Porter','Radler',4.0,{l:'#2d221d',a:'#b61d1d',i:'#ede5e2'}],
 ['Erdbeer Porter','Radler',4.0,{l:'#1d0b0f',a:'#d7e4da',i:'#d9e2db'}],
 ['Porter + Punsch','Radler',4.0,{l:'#2f251f',a:'#b8211c',i:'#e8dad4'}],
 ['Hell','Helles',4.6,{l:'#e8e0ce',a:'#a89c7b',i:'#93674b'}]]],
['Privatbrauerei Christian Fiedler','Fiedler','Oberscheibe','Sachsen','DE','nrw','brown','#c3ccca','#367631','#3e6d3a',[
 ['=Fiedler Pilsner','Pils',4.7,{u:'Pilsner'}],
 ['=Fiedler Magisterbräu Schwarzbier','Schwarzbier',4.7,{l:'#bcb4a7',a:'#551618',i:'#4d1e20',u:'Magisterbräu Schwarzbier'}],
 ['=Fiedler Orgelpfeifenbräu','Helles',4.7,{l:'#f9f5e4',a:'#3e552c',i:'#3f5031',u:'Orgelpfeifenbräu'}],
 ['=Fiedler Kupfer','Spezialbier',5.5,{l:'#e2e8de',a:'#2a1a10',i:'#9c5a26',u:'Kupfer'}],
 ['=Fiedler Abrahamsbock','Bock',6.1,{l:'#dbe0dd',a:'#ffed7d',i:'#902d22',u:'Abrahamsbock'}]]],
['Mauritius Privatbrauerei','Mauritius','Zwickau','Sachsen','DE','nrw','brown','#231614','#977c6b','#bcb3a1',[
 ['REWE Kosmonaut Helles','Helles',5.1],
 ['Sachsengold Landbier','Landbier',4.8,{l:'#f3dcba',a:'#2a1a10',i:'#a47b5a'}],
 ['Trabi Deluxe','Helles',5.0,{l:'#5d610f',a:'#dbb300',i:'#e0c73e'}],
 ['Zwickauer Bock Dunkel','Bock',7.1,{l:'#23130e',a:'#f3d7ae',i:'#ead5b7'}],
 ['Zwickauer Winterbier','Zwickel',5.7,{l:'#01347f',a:'#6d4149',i:'#dae0db'}]]],
['Privatbrauerei Wochinger','Wochinger','Traunstein','Oberbayern','DE','nrw','brown','#5c261a','#9c7b68','#aa846a',[
 ['Export Hell','Export',5.3],
 ['Urtrunk','Helles',5.3],
 ['Hefe Weisse','Weißbier',5.1,{l:'#d1cbd4',a:'#9e775f',i:'#754331'}],
 ['Export Dunkel','Dunkel',4.9,{l:'#aec1b9',a:'#83988a',i:'#6a5249'}],
 ['Pils','Pils',4.8,{l:'#c3c6c8',a:'#4e4943',i:'#4e4943'}]]],
['Privatbrauerei Schnitzlbaumer','Schnitzlbaumer','Traunstein','Oberbayern','DE','nrw','brown','#ede7d0','#005e96','#0c5b8a',[
 ['Lagerbier Hell','Lager',4.9],
 ['Export Dunkel','Dunkel',5.2,{l:'#2d0d0c',a:'#e4dbbd',i:'#fffef4'}],
 ['Export Hell','Export',5.2,{l:'#266027',a:'#efe7c7',i:'#fffef4'}],
 ['=Schnitzei Weiße Hell','Weißbier',5.5,{l:'#294c78',a:'#f7e5ab',i:'#fcfcf3',u:'Schnitzei Weiße Hell',t:'Schnitzlbaumer'}],
 ['Traunsteiner Zwickl','Zwickel',5.2,{l:'#f1e7cc',a:'#2a1a10',i:'#a78350'}]]],
['Brauerei Hönig','Hönig','Tiefenellern','Oberfranken','DE','swing','brown','#f0f3cb','#e0d08c','#725a41',[
 ['Lagerbier ungespundet','Kellerbier',4.8],
 ['Posthörnla','Dunkel',5.2,{l:'#ede5c0',a:'#8d4542',i:'#834e4c'}],
 ['Pils','Pils',4.8,{l:'#f8fddf',a:'#a39a74',i:'#59485e'}],
 ['Bockbier Hell','Bock',7.2,{l:'#eedca5',a:'#b39868',i:'#816450'}],
 ['Zwickl','Zwickel',4.9,{l:'#daddc4',a:'#5e5454',i:'#5e5454'}]]],
['Brauerei Sauer','Roßdorfer','Roßdorf am Forst','Oberfranken','DE','swing','brown','#f8eecc','#585839','#54543d',[
 ['Urbräu','Helles',4.9],
 ['Pils','Pils',4.9,{l:'#536849',a:'#f8e0a9',i:'#f2edd2'}],
 ['Braunbier','Dunkel',4.9,{l:'#cacabf',a:'#919481',i:'#5c5d4a'}],
 ['Frühlingsmärzen','Märzen',5.5,{l:'#bec881',a:'#f5f6d6',i:'#4a7b5b'}],
 ['Bock Hell','Bock',7.0,{l:'#fff5d4',a:'#44825b',i:'#524537'}]]],
['Brauerei Will','Will','Schederndorf','Oberfranken','DE','swing','brown','#f9f8fd','#bdbbbc','#0a0a0d',[
 ['Dunkles Landbier','Dunkel',5.3],
 ['Helles Sommerbier','Helles',4.8],
 ['Hefeweizen','Weißbier',5.5],
 ['Heller Winterbock','Bock',7.2,{l:'#cbccce',a:'#737575',i:'#2c241e'}]]],
['Brauerei Kraus','Kraus','Hirschaid','Oberfranken','DE','swing','brown','#442521','#d64248','#f7f5f7',[
 ['Hirschen Trunk','Dunkel',5.5],
 ['Edelpils','Pils',4.7,{l:'#313a33',a:'#e7eae8',i:'#f9f9f7'}],
 ['=Krausen Lager','Dunkel',4.7,{l:'#d8af9b',a:'#342d25',i:'#322d27',u:'Krausen Lager'}],
 ['Vollbier','Helles',4.7,{l:'#101114',a:'#2b3a4b',i:'#cad2df'}],
 ['Weißbier Hefetrüb','Weißbier',5.5,{l:'#e4ecf0',a:'#7a605c',i:'#766360'}]]],
['Wagner-Bräu Kemmern','Wagner-Bräu','Kemmern','Oberfranken','DE','swing','brown','#b72b1b','#3e7985','#fefefd',[
 ['Vollbier','Helles',5.2],
 ['Ungespundetes Lagerbier','Kellerbier',5.0,{l:'#f2e8dc',a:'#2a1a10',i:'#823f30'}],
 ['Premium Pils','Pils',4.8,{l:'#87b2a9',a:'#fff7ed',i:'#fdf7ef'}],
 ['Bock','Bock',6.6,{l:'#ddd2ae',a:'#2a1a10',i:'#862d14'}],
 ['Kuckuck','Helles',5.8,{l:'#f8dcae',a:'#2a1a10',i:'#a54628'}]]],
['Brauerei Schroll','Schroll','Nankendorf','Oberfranken','DE','swing','brown','#f2dfbb','#6f6748','#582d2b',[
 ['Nankendorfer Landbier','Landbier',5.2],
 ['Nankendorfer Helles','Helles',5.2,{l:'#faf9e9',a:'#a2a75f',i:'#a45d4b'}],
 ['Nankendorfer Trüber Hammel','Helles',5.2,{l:'#fffdd1',a:'#2a1a10',i:'#be6e41'}],
 ['Nankendorfer Weizenbier','Weißbier',5.5],
 ['Nankendorfer Bockbier Dunkel','Bock',7.0,{l:'#f2ecdd',a:'#d3b595',i:'#874a38'}]]],
['Held-Bräu','Held-Bräu','Oberailsfeld','Oberfranken','DE','swing','brown','#e3e9e6','#aca26f','#44583d',[
 ['Hell','Helles',4.9],
 ['Altfränkisches Bauernbier','Dunkel',5.3,{l:'#b6844f',a:'#2a1a10',i:'#6f2c1a'}],
 ['Festbier','Festbier',5.3,{l:'#585958',a:'#919493',i:'#cad3e1'}],
 ['Zwickl','Zwickel',4.9,{l:'#fefff8',a:'#c3bc6f',i:'#586941'}],
 ['Gössweinsteiner Wallfahrtsbier','Helles',5.3,{l:'#731a2a',a:'#ece0ce',i:'#f6eee0'}]]],
['Privatbrauerei Hofmann','Hofmann','Pahres','Mittelfranken','DE','nrw','brown','#d4c096','#970400','#88120f',[
 ['Helles Landbier','Landbier',5.0],
 ['Pils','Pils',5.0,{l:'#002b14',a:'#fef8ca',i:'#f7f3d1'}],
 ['Lagerbier Unfiltriert','Lager',5.2,{l:'#ff8e0d',a:'#2a1a10',i:'#72361b'}],
 ['Hopfen Gold','Helles',4.9,{l:'#c0b4a7',a:'#663738',i:'#603d3e'}],
 ['Dunkel','Dunkel',5.2,{l:'#d1cea9',a:'#3e1309',i:'#371710'}]]],
['Brauerei Penning-Zeißler','Penning-Zeißler','Hetzelsdorf','Oberfranken','DE','swing','brown','#fef1c0','#aba56e','#62513b',[
 ['Fränkisches Vollbier','Dunkel',5.0],
 ['Weihnachts-Festbier','Festbier',5.5,{l:'#251590',a:'#9185ba',i:'#e0dbb1'}],
 ['Frühlingsbier','Helles',5.5,{l:'#ffe7a9',a:'#bfb36b',i:'#7e6641'}],
 ['Weihnachtsbock','Bock',6.5,{l:'#ded0b1',a:'#ad935a',i:'#574230'}],
 ['Leicht','Light Lager',2.8,{l:'#ffebac',a:'#c6b76c',i:'#866f46'}]]],
['Nikl-Bräu','Nikl-Bräu','Pretzfeld','Oberfranken','DE','swing','brown','#bfbfc0','#615143','#2c2521',[
 ['Michala Dunkles Kellerbier','Kellerbier',5.1],
 ['Zwickel Helles Lagerbier','Zwickel',5.1,{l:'#c8c6ca',a:'#8c8573',i:'#322b28'}],
 ['Weiße Eule Helles Hefeweißbier','Weißbier',5.5,{l:'#e7e7e8',a:'#587695',i:'#29282c'}],
 ['Helles Festbier','Festbier',5.8,{l:'#e8e7d2',a:'#3b372a',i:'#39362c'}],
 ['Summerale','Pale Ale',3.2,{l:'#fefefe',a:'#565252',i:'#565252'}]]],
['Elch-Bräu Thuisbrunn','Elch-Bräu','Thuisbrunn','Oberfranken','DE','swing','brown','#332522','#f2ebeb','#fcfafa',[
 ['Nix Amore','Helles',4.9],
 ['Dunkel','Dunkel',4.9,{l:'#302120',a:'#f5eef4',i:'#fdfcfd'}],
 ['Pils','Pils',4.9,{l:'#312322',a:'#e8f2f1',i:'#fcf9fb'}],
 ['Weizen','Weißbier',5.2,{l:'#e3e3ef',a:'#93635b',i:'#362628'}],
 ['1.21 GIGAWATT','Doppelbock',8.0,{l:'#36221d',a:'#d1d4d8',i:'#e6e9e7'}]]],
['Brauerei Friedmann','Friedmann','Gräfenberg','Oberfranken','DE','swing','brown','#bbbcb3','#f9f9db','#5b556b',[
 ['Fränkisches Landbier','Landbier',4.9],
 ['Ritter Wirnt Trunk','Dunkel',5.6,{l:'#73776e',a:'#f9fffd',i:'#f9fffd'}],
 ['Pils','Pils',5.2,{l:'#eae9d4',a:'#2a1a10',i:'#b29673'}],
 ['Sigi\'s Lager','Lager',5.1,{l:'#e6b680',a:'#fffddf',i:'#b2543c'}],
 ['Hefeweizen','Weißbier',5.2,{l:'#fdedcc',a:'#ffc37c',i:'#b88157'}]]],
['Brauerei Gradl','Gradl','Leups','Oberfranken','DE','swing','brown','#eece80','#662928','#5e3130',[
 ['Leupser Dunkel','Dunkel',4.9],
 ['Leupser Pils','Pils',4.9,{l:'#eeca78',a:'#602222',i:'#582a2a'}],
 ['Leupser Bock','Bock',7.2,{l:'#e6bb80',a:'#361b0e',i:'#311d13'}]]],
['Schlossbrauerei Reckendorf','Reckendorfer','Reckendorf','Oberfranken','DE','nrw','brown','#484335','#c1b47a','#fbf9da',[
 ['Keller-Bier','Kellerbier',5.0],
 ['Helle Freude','Helles',5.2,{l:'#393731',a:'#bdbe8e',i:'#faf8d1'}],
 ['Alt-Hausbrauerbier','Alt',4.4,{l:'#a64639',a:'#ead5aa',i:'#ede6c3'}],
 ['Schlössla Festtagsbier','Festbier',5.4,{l:'#5c5543',a:'#faffe8',i:'#f8fceb'}],
 ['Edel-Pils','Pils',4.8,{l:'#bfb988',a:'#fffbd6',i:'#51483d'}]]],
['Brauerei Hennemann','Hennemann','Sambach','Oberfranken','DE','swing','brown','#9a4c3f','#ffd581','#f9e1b2',[
 ['Zwickelbier Naturtrüb','Zwickel',4.9],
 ['Lagerbier','Lager',4.9,{l:'#6c7e9c',a:'#7e4656',i:'#e8d0ad'}],
 ['Sommergold','Helles',4.9,{l:'#628dac',a:'#9ba4cc',i:'#d6d5d3'}],
 ['Bockbier Dunkel','Bock',6.8,{l:'#cebd92',a:'#f0e9d3',i:'#654955'}]]],
['Löwen-Bräu Hennemann','Löwen-Bräu Stublang','Stublang','Oberfranken','DE','swing','brown','#efe3c4','#1f5a32','#1f3a22',[
 ['Dunkles Landbier','Dunkel',5.0],
 ['Lagerbier','Lager',5.2],
 ['Sepperla Kellerbier','Kellerbier',5.2],
 ['Land-Pils','Pils',4.9]]],
['Brauerei Rothenbach','Aufsesser','Aufseß','Oberfranken','DE','swing','brown','#fefff4','#6f86e0','#6d7dbf',[
 ['Wegseidla Helles Vollbier','Helles',4.8],
 ['Seidla Hell','Helles',4.9,{l:'#b2d2dd',a:'#854d5e',i:'#7e5461'}],
 ['Zwickl','Zwickel',4.8,{l:'#fef4c1',a:'#2a1a10',i:'#b19066'}],
 ['Dunkel','Dunkel',4.7,{l:'#d5bbac',a:'#92594f',i:'#895f58'}],
 ['Pils','Pils',5.0,{l:'#b4d4af',a:'#7f7d69',i:'#7f7d69'}]]],
['Brauerei Meister','Meister','Unterzaunsbach','Oberfranken','DE','swing','brown','#ddc48f','#2a1a10','#5e4130',[
 ['Vollbier','Dunkel',4.9],
 ['Hell','Helles',4.8,{l:'#fbf4bf',a:'#7f878f',i:'#7f878f'}],
 ['Zwickl-Bier','Zwickel',4.9,{l:'#fdf4bc',a:'#668448',i:'#667c50'}],
 ['Festbier','Festbier',5.5,{l:'#f29080',a:'#bf5342',i:'#af5f52'}]]],
['Krug-Bräu','Krug-Bräu','Breitenlesau','Oberfranken','DE','swing','brown','#8f7750','#c1bc99','#2b281e',[
 ['Breitenlesauer Dunkles Lager','Dunkel',5.0],
 ['Breitenlesauer Hell','Helles',4.8,{l:'#5da3b5',a:'#cdc8bb',i:'#5c3c32'}],
 ['Breitenlesauer Ur-Stoff','Helles',5.4,{l:'#fdfdd3',a:'#e0d09a',i:'#7f604c'}],
 ['Breitenlesauer Gaas-Seidla','Radler',2.7,{l:'#442623',a:'#f03c49',i:'#e6cfbe'}],
 ['Breitenlesauer Winterbier','Festbier',5.5,{l:'#c2827e',a:'#8c4449',i:'#e5e1d2'}]]],
['Lindenbräu Gräfenberg','Lindenbräu','Gräfenberg','Oberfranken','DE','swing','brown','#8acf6d','#4d9551','#1d4f39',[
 ['Vollbier','Dunkel',5.2],
 ['Fritzle','Helles',5.2,{l:'#343c35',a:'#a4cb8d',i:'#e9f3e3'}],
 ['Tennen Hell','Helles',4.8,{l:'#e5ead5',a:'#679396',i:'#6d8e90'}],
 ['Weizen','Weißbier',5.2,{l:'#fff1cc',a:'#ffcc7c',i:'#a69256'}],
 ['Pilsner','Pils',5.0,{l:'#528791',a:'#edf3f0',i:'#eef2f0'}]]],
['Brauerei Hetzel','Hetzel','Frauendorf','Oberfranken','DE','swing','brown','#e72531','#e78e81','#f3d7c8',[
 ['Frauendorfer Vollbier','Dunkel',4.9],
 ['Frauendorfer Premium Landbier','Landbier',4.9,{l:'#3f3c35',a:'#c4d9c7',i:'#c7d6c9'}],
 ['Frauendorfer Hell','Helles',4.4,{l:'#2b3038',a:'#77adce',i:'#9ebdd0'}],
 ['Frauendorfer Rauchbier','Rauchbier',5.4,{l:'#311101',a:'#efe2c2',i:'#cd923a'}],
 ['Frauendorfer Pils','Pils',5.3,{l:'#284d3b',a:'#f3e0ae',i:'#eadcb7'}]]],
['Gampertbräu','Gampert','Weißenbrunn','Oberfranken','DE','swing','brown','#166828','#f2f5e8','#f1f3ea',[
 ['Förster Pils','Pils',4.9],
 ['Förster Hell','Helles',4.4,{l:'#00963d',a:'#48d4ef',i:'#f4fcf7'}],
 ['Osterbier','Helles',5.5,{l:'#3f3d2f',a:'#6f734c',i:'#f3f4e3'}],
 ['Kättlbier','Helles',5.5,{l:'#0ca142',a:'#fafcf2',i:'#f9fbf3'}],
 ['Weihnachtsbier','Festbier',5.5,{l:'#0f326e',a:'#caccba',i:'#f5f3dc'}]]],
['Brauerei Schübel','Schübel','Stadtsteinach','Oberfranken','DE','nrw','brown','#ebe5ee','#fa2f27','#df4842',[
 ['a fränkisch','Helles',4.9],
 ['Drachenseidla','Dunkel',4.9,{l:'#53674a',a:'#fade8e',i:'#ecd79c'}],
 ['Nordeck-Trunk','Helles',4.9,{l:'#cfc694',a:'#f6f4e0',i:'#643e31'}],
 ['Hell (Kellerbier unfiltriert)','Kellerbier',4.9,{l:'#dfc5ae',a:'#933536',i:'#874142'}],
 ['Kellerbock','Bock',7.2,{l:'#fdf9ec',a:'#8c2717',i:'#7d3226'}]]],
['Becher-Bräu','Becher-Bräu','Bayreuth','Oberfranken','DE','swing','brown','#f2f3ee','#4ab4e6','#653c33',[
 ['Kräußen Pils','Pils',4.7],
 ['Vollbier','Helles',5.0,{l:'#3a2d22',a:'#3482d0',i:'#dbc48b'}],
 ['Stadtbier','Helles',5.6,{l:'#613718',a:'#f0cd7a',i:'#e1c789'}],
 ['=Becher Jean Paul','Dunkel',5.5,{l:'#ceb297',a:'#2a1a10',i:'#5b4233',u:'Becher Jean Paul',t:'Becher-Bräu'}],
 ['Bock','Doppelbock',7.5,{l:'#561807',a:'#efe2c2',i:'#d5bc8b'}]]],
['Brauerei Murmann','Murmann','Untersiemau','Oberfranken','DE','swing','brown','#d2c396','#fffabd','#7a292c',[
 ['Fränkisches Kellerbier','Kellerbier',5.0],
 ['Lager Urtyp','Lager',4.9,{l:'#e14a56',a:'#89704a',i:'#fbf9e7'}],
 ['Prinz Eugen Dunkel','Dunkel',5.1,{l:'#ebecf0',a:'#e1b68c',i:'#653c2d'}],
 ['Weisse','Weißbier',5.2,{l:'#b6210a',a:'#dbb28b',i:'#d1b295'}]]],
['Dorn-Bräu Ammerndorf','Ammerndorfer','Ammerndorf','Mittelfranken','DE','nrw','brown','#f5ece7','#348bbd','#4686ab',[
 ['Hell','Helles',4.6],
 ['Spezial','Helles',5.3,{l:'#f6f3f0',a:'#f94838',i:'#e05d51'}],
 ['Landbier Dunkel','Dunkel',5.6,{l:'#f8f3ee',a:'#2a1a10',i:'#a26353'}],
 ['KellerTrunk','Kellerbier',4.9,{l:'#f6f4f2',a:'#926754',i:'#8a6a5c'}],
 ['Bock','Bock',6.2,{l:'#f6f1ec',a:'#d2463d',i:'#bf5750'}]]],
['Kaiser-Bräu','Veldensteiner','Neuhaus an der Pegnitz','Mittelfranken','DE','nrw','brown','#ead2b1','#5e3141','#583743',[
 ['=Veldensteiner Rotbier','Spezialbier',5.4,{u:'Rotbier'}],
 ['=Veldensteiner Vollbier Hell','Helles',5.1,{l:'#ddc09e',a:'#332937',i:'#322b35',u:'Vollbier Hell'}],
 ['=Veldensteiner Kräusen Helles','Helles',5.1,{l:'#423b4d',a:'#e2c49d',i:'#ecd9c0',u:'Kräusen Helles'}],
 ['=Veldensteiner Mandarina Bavaria Weissbier','Weißbier',5.4,{l:'#ffc978',a:'#2a1a10',i:'#9a541b',u:'Weißbier'}],
 ['Antoniter Bayerisch Hell','Helles',5.0,{l:'#422628',a:'#a18f94',i:'#f9ce79'}]]],
['Winkler Bräu','Winkler Bräu','Lengenfeld','Oberpfalz','DE','nrw','brown','#d1bca7','#2a1a10','#896251',[
 ['Kupfer Spezial','Spezialbier',5.5],
 ['Helfenberger Hell','Helles',5.0,{l:'#29203b',a:'#fcfef0',i:'#fefdf6'}],
 ['Kupfer Bock','Bock',6.4,{l:'#442b37',a:'#a58896',i:'#ebddd7'}],
 ['Pils','Pils',4.7,{l:'#ced3cd',a:'#464a63',i:'#4a4d5f'}],
 ['Kupfer Alkoholfrei','Alkoholfrei',0.5,{l:'#cbb799',a:'#7c5946',i:'#755b4d'}]]],
['Brauerei Winkler','Winkler','Amberg','Oberpfalz','DE','nrw','brown','#d7cbcb','#82838c','#3c3f3d',[
 ['Amberger Zoigl','Kellerbier',5.2],
 ['Amberger Hell','Helles',4.8,{l:'#314762',a:'#9399a6',i:'#dadee4'}],
 ['(Alt) Amberger Hefe-Weizen','Weißbier',5.2,{l:'#c7c0bd',a:'#563c3b',i:'#523f3e'}],
 ['Helle Freude','Helles',4.7,{l:'#294d95',a:'#a4a9b1',i:'#dce2ee'}],
 ['Amberger Pils','Pils',4.7,{l:'#d5ddf2',a:'#727e99',i:'#292f34'}]]],
['Brauerei Simon','Simon','Lauf an der Pegnitz','Mittelfranken','DE','swing','brown','#411313','#e4bf91','#d9be9c',[
 ['Spezial','Dunkel',5.6],
 ['Hell','Helles',5.1,{l:'#5a2218',a:'#f3b976',i:'#eac494'}],
 ['Weißbier','Weißbier',5.4,{l:'#5b1b14',a:'#e4ba8a',i:'#d8b996'}],
 ['Bock Hell','Bock',7.0,{l:'#fee8ad',a:'#731f10',i:'#66281d'}],
 ['Schwarze Kuni','Dunkles Weißbier',7.0,{l:'#372227',a:'#e6cea9',i:'#deccb1'}]]],
['Brauerei Dinkel','Dinkel','Stublang','Oberfranken','DE','swing','brown','#ffe73c','#feff98','#847d26',[
 ['Stublanger Kellerbier','Kellerbier',4.7],
 ['Stublanger Lagerbier','Lager',4.7,{l:'#3a4a25',a:'#bfb173',i:'#c0b88f'}],
 ['Stublanger Hell','Helles',4.7,{l:'#f5c582',a:'#489dc5',i:'#5897b5'}],
 ['Stublanger Hausmasdä Pils','Pils',5.0,{l:'#de7f77',a:'#ece0c6',i:'#f2f0e5'}],
 ['Stublanger Bockbier','Bock',6.8]]],
['Brauerei Scheubel','Stern-Bräu','Schlüsselfeld','Oberfranken','DE','swing','brown','#363e3a','#ded2a9','#deddd4',[
 ['Vollbier Hell','Helles',5.0],
 ['Festbier','Festbier',5.5,{l:'#d4bc7a',a:'#304246',i:'#334043'}]]],
['Schwanen-Bräu','Schwanen-Bräu','Ebermannstadt','Oberfranken','DE','swing','brown','#ecffba','#5b6849','#5a644d',[
 ['Lager','Dunkel',5.1],
 ['Pils','Pils',4.9,{l:'#697691',a:'#fffffc',i:'#fffffc'}],
 ['Bock','Bock',7.2,{l:'#cc1f05',a:'#fff7ea',i:'#fff7ea'}],
 ['Hell','Helles',4.9,{l:'#7f8cab',a:'#fdfff2',i:'#fcfef3'}]]],
['Brauhaus Binkert','Main Seidla','Breitengüßbach','Oberfranken','DE','nrw','brown','#cfcbc9','#2a1a10','#8e4121',[
 ['=Main Seidla Amber Spezial','Pale Ale',5.9,{u:'Amber Spezial'}],
 ['=Main Seidla Helles','Helles',4.9,{l:'#c2c4c8',a:'#235fa0',i:'#204264',u:'Helles'}],
 ['=Main Seidla Keller','Kellerbier',4.9,{l:'#c9c9c6',a:'#2e3f16',i:'#2d3a1b',u:'Keller'}],
 ['=Main Seidla Original','Helles',4.9,{l:'#ccc6c6',a:'#680300',i:'#5b0f0d',u:'Original'}],
 ['=Main Seidla Craft India Pale Ale','IPA',6.2,{l:'#efdab0',i:'#873f16',u:'Craft India Pale Ale'}]]],
['Schlossbrauerei Hohenthann','Hohenthanner','Hohenthann','Niederbayern','DE','nrw','brown','#bcc3b8','#4e7355','#536e58',[
 ['Tannen Hell','Helles',5.0],
 ['Bayrisch Pale Ale','Pale Ale',5.6,{l:'#b0464a',a:'#d1deda',i:'#d3dcd9'}],
 ['Blau Weisse','Weißbier',5.6,{l:'#237085',a:'#d0deda',i:'#d2dcd9'}],
 ['Märzen Festbier','Märzen',5.6,{l:'#b9beb2',a:'#907c59',i:'#65371e'}],
 ['Maibock','Maibock',6.4,{l:'#7a8d52',a:'#bec8b6',i:'#dee9e6'}]]],
['Schlossbrauerei Herrngiersdorf','Herrngiersdorfer','Herrngiersdorf','Niederbayern','DE','nrw','brown','#33392b','#d15d45','#c9a68a',[
 ['Grantler Hell','Helles',4.9],
 ['Hallertauer Hopfen Cuvee','Helles',4.8,{l:'#d8e3d7',a:'#265633',i:'#2c5036'}],
 ['Grantler Festmärzen','Märzen',5.6,{l:'#f4f6f8',a:'#a20a00',i:'#921810'}],
 ['Weihnachts-Grantler','Festbier',6.0,{l:'#110e19',a:'#816054',i:'#8d7c76'}],
 ['Publiner','Dunkel',5.3,{l:'#75c6d3',a:'#25929b',i:'#003c38'}]]],
['Spezial-Brauerei Schierling','Schierlinger','Schierling','Oberpfalz','DE','nrw','brown','#4e3730','#b5b7a8','#e5e5dd',[
 ['Hell','Helles',4.9],
 ['Pils','Pils',5.0,{l:'#b3b0a6',a:'#3a3547',i:'#3b3745'}],
 ['Roggen','Pale Ale',5.0,{l:'#dbddcf',a:'#645444',i:'#605448'}],
 ['Hell Alkoholfrei','Alkoholfrei',0.5,{l:'#d5d6c3',a:'#4a3735',i:'#473938'}],
 ['Natur Radler','Radler',2.5,{l:'#e5dbbd',a:'#e6cd6c',i:'#272424'}]]],
['Brauerei Pöllinger','Pöllinger','Pfeffenhausen','Niederbayern','DE','nrw','brown','#9fb8d0','#2f65aa','#2a5389',[
 ['Hopfenkönig Helles','Helles',4.8],
 ['Pater Vinzenz','Helles',4.9,{l:'#8c8f92',a:'#494647',i:'#494647'}],
 ['Hopfenkistl Export','Export',5.2,{l:'#a34746',a:'#a09da8',i:'#c6d1d8'}],
 ['Hopfenkistl Helles','Helles',4.9,{l:'#52a099',a:'#c1d8cf',i:'#c4d5ce'}],
 ['=Pöllinger Helles','Helles',4.9,{l:'#293b5b',a:'#c9cac8',i:'#ffffff',u:'Helles'}]]],
['Graminger Weißbräu','Graminger','Altötting','Oberbayern','DE','nrw','brown','#f9e69a','#5f3417','#563620',[
 ['Kirta','Weißbier',5.0],
 ['=Graminger Schwarzfahrer','Alkoholfrei',0.5,{l:'#1e1318',a:'#f0f1f1',i:'#f0f1f1',u:'Schwarzfahrer'}],
 ['=Graminger Deife Märzen','Märzen',5.6,{l:'#d10816',a:'#3c080a',i:'#f7e7a4',u:'Deife Märzen'}],
 ['=Graminger Weissbier','Weißbier',5.4,{l:'#fae79b',a:'#1355c4',i:'#222a3e',u:'Weissbier'}],
 ['Berggeist','Bock',6.8,{l:'#1f150d',a:'#ffe790',i:'#fbf7c1'}]]],
['Klosterbrauerei Baumburg','Baumburger','Altenmarkt an der Alz','Oberbayern','DE','nrw','brown','#755248','#aa9673','#e0d9c6',[
 ['Export Hell','Export',5.2],
 ['Kloster Weiße','Weißbier',4.8,{l:'#5b3b44',a:'#b69f7a',i:'#ccb894'}],
 ['=Baumburger Hell','Helles',4.8,{l:'#ffe783',a:'#2d8830',i:'#7f572f',u:'Hell'}],
 ['Kloster Dunkel','Dunkel',5.5,{l:'#5c130a',a:'#eec997',i:'#e3c7a2'}],
 ['=Baumburger Pils','Pils',4.8,{l:'#714139',a:'#c4b99d',i:'#e1d4b6',u:'Pils'}]]],
['Zötler Privatbrauerei','Zötler','Rettenberg','Allgäu','DE','nrw','brown','#20345e','#e7ddd1','#f3f1f0',[
 ['Bayerisch Hell','Helles',4.9],
 ['Hefeweizen Hell','Weißbier',5.2,{l:'#575e63',a:'#a1a180',i:'#b6b9b0'}],
 ['1447 Kellerbier naturtrüb','Kellerbier',4.9,{l:'#c1b7a8',a:'#71654c',i:'#6c6351'}],
 ['Herzsolo','Helles',5.2,{l:'#594540',a:'#c0afa0',i:'#e4e0d8'}]]],
['Ankerbräu Nördlingen','Ankerbräu','Nördlingen','Schwaben','DE','nrw','brown','#353132','#a49f84','#d9d7b9',[
 ['Flöff','Spezialbier',4.5]]],
['Privatbrauerei Höss','Hirschbräu','Sonthofen','Allgäu','DE','nrw','brown','#e7ebed','#576368','#576368',[
 ['Holzar-Bier','Helles',5.2],
 ['=Doppel-Hirsch Dunkel','Bock',7.2,{l:'#ffe968',a:'#2a1a10',i:'#8d6930',u:'Doppel-Hirsch Dunkel',t:'Hirschbräu'}],
 ['Allgäuer Hüttenbier','Helles',5.2,{l:'#1d3921',a:'#709c6c',i:'#dcd6b5'}],
 ['Adlerkönig Urtyp Hell','Helles',4.7,{l:'#341c16',a:'#e8c5a4',i:'#dfc5ad'}],
 ['=Weisser Hirsch Allgäuer Weizen','Weißbier',5.2,{l:'#998923',a:'#bbad95',i:'#c6baac',u:'Weißbier',t:'Hirschbräu'}]]],
['Kronenbrauerei Schimpf','Schimpf','Remmingsheim','Baden-Württemberg','DE','nrw','brown','#3d4930','#b6b698','#d4d3c8',[
 ['s‘Höpfle Bio Alkoholfrei','Alkoholfrei',0.5],
 ['Halbe Spezial','Helles',5.2,{l:'#4d2d1d',a:'#b59672',i:'#d8c7b0'}],
 ['Hell','Helles',5.0,{l:'#c1b497',a:'#67988a',i:'#795835'}],
 ['Weihnachtsbier','Helles',5.2,{l:'#503528',a:'#a39784',i:'#cec5b5'}],
 ['Hefeweizen Hell','Weißbier',5.0,{l:'#522d1a',a:'#d9c2a2',i:'#decdb8'}]]],
['Privatbrauerei Rogg','Rogg','Lenzkirch','Schwarzwald','DE','nrw','brown','#ceb693','#76bb8d','#4a4947',[
 ['=Rogg Zipfel','Helles',5.1,{u:'Zipfel'}],
 ['Lenzkircher Pils','Pils',4.9,{l:'#cebea2',a:'#9f8c6b',i:'#3a392d'}],
 ['Landbier','Landbier',4.8,{l:'#76b3d7',a:'#82374c',i:'#784150'}],
 ['Hefe Weisse','Weißbier',5.5,{l:'#d2c251',a:'#73bba3',i:'#583c20'}],
 ['Lenzkircher Hefe-Weizen Hell','Weißbier',5.2,{l:'#f6f4f2',a:'#6a9787',i:'#404844'}]]],
['Rotochsen Brauerei','Rotochsen','Ellwangen','Baden-Württemberg','DE','nrw','brown','#1f0f0b','#b6aeae','#c1b8b6',[
 ['Edel-Export','Export',5.2],
 ['=Ellwanger Rotochsen Stiftsherren Pils','Pils',4.7,{l:'#bbb5b5',a:'#572a23',i:'#502f2a',u:'Pils'}],
 ['=Ellwanger Rotochsen Hefe-Weizen Hell','Weißbier',5.3,{l:'#e5e5e6',a:'#998671',i:'#6e3534',u:'Weißbier'}],
 ['=Ellwanger Rotochsen Kristall-Weizen','Kristallweizen',5.1,{l:'#dbd8d5',a:'#6b3541',i:'#643c45',u:'Kristallweizen'}],
 ['Ellwanger Weihnachtsbier','Festbier',5.4,{l:'#c7afa2',a:'#402731',i:'#1d1724'}]]],
['Schlossbrauerei Stein','Schlossbrauerei Stein','Traunreut','Oberbayern','DE','nrw','brown','#dbe5ed','#1f5195','#2e5386',[
 ['Hell','Helles',4.9],
 ['Export','Export',5.3,{l:'#dae8ea',a:'#3b6f42',i:'#426847'}],
 ['Alkoholfreies Bio Zwickl','Alkoholfrei',0.5,{l:'#d3dbe2',a:'#9a8c85',i:'#c36a34'}],
 ['Naturtrübes Bio Zwickl','Zwickel',5.3,{l:'#d3dae0',a:'#c6262e',i:'#b13b41'}],
 ['Almbier','Helles',3.5,{l:'#d9e5ed',a:'#4492d6',i:'#4783b6'}]]],
['Privatbrauerei Schweiger','Schweiger','Markt Schwaben','Oberbayern','DE','nrw','brown','#a2384c','#cfa8a7','#ffffff',[
 ['1516 Bayrisch Hell','Helles',4.9],
 ['Helles Export','Export',5.3,{l:'#fffffe',a:'#b82337',i:'#a53645'}],
 ['Weiße','Weißbier',5.2,{l:'#87475b',a:'#b3a5a7',i:'#fefcf1'}],
 ['Goasserl','Radler',2.6,{l:'#fff5ea',a:'#a32647',i:'#93364f'}],
 ['Aurum','Helles',5.3,{l:'#4f4832',a:'#cdd1ca',i:'#cdd1ca'}]]],
['Schlossbrauerei Au-Hallertau','Auer','Au in der Hallertau','Oberbayern','DE','nrw','brown','#140d0b','#d8ceb7','#e4dcd3',[
 ['=Auer Helles','Helles',4.9,{u:'Helles'}],
 ['=Hallertauer Mandarina','Helles',4.9,{l:'#312211',a:'#948c63',i:'#c4c7ac',u:'Hallertauer Mandarina'}],
 ['Hopfen Festbier','Festbier',6.0,{l:'#e2dca8',a:'#ab9c55',i:'#382519'}],
 ['Kellerbier','Kellerbier',5.5,{l:'#ddd3dd',a:'#642633',i:'#5c2e38'}],
 ['Ecco','Helles',4.9,{l:'#e90f23',a:'#a4181a',i:'#c9b7b8'}]]],
['Rössle-Bräu','Rössle-Bräu','Ehingen','Baden-Württemberg','DE','nrw','brown','#d0d5d8','#777b8d','#131e42',[
 ['Edel-Spezial','Helles',5.2],
 ['Edel-Ross','Helles',5.2,{l:'#4c251e',a:'#a76b58',i:'#a87d70'}],
 ['Kraftbier Weißes Roß','Weißbier',5.6,{l:'#2b2023',a:'#ddd0d0',i:'#dbd2d2'}],
 ['Albkolben','Helles',5.5]]],
['Brauerei Dachsbräu','Dachsbräu','Weilheim','Oberbayern','DE','nrw','brown','#938b81','#dedbda','#221d24',[
 ['=Dachs Hefeweizen','Weißbier',5.0,{u:'Dachs Hefeweizen',t:'Dachsbräu'}],
 ['=Dachs Hell','Helles',5.5,{u:'Dachs Hell',t:'Dachsbräu'}],
 ['Weilheimer Ur-Hell','Helles',5.5,{l:'#f4f4ef',a:'#9ad7bb',i:'#865041'}],
 ['Weilheimer Festbier','Festbier',6.3,{l:'#e8eeed',a:'#9d8862',i:'#783d2d'}],
 ['Ulimator Dunkler Doppelbock','Doppelbock',7.5,{l:'#351e0d',a:'#d5ba9f',i:'#dfd0bc'}]]],
['Pflugbrauerei','Pflug','Hörvelsingen','Baden-Württemberg','DE','nrw','brown','#202030','#939e7f','#d0d5c6',[
 ['=Pflug Spezial','Helles',5.1,{u:'Spezial'}],
 ['=Pflug Keller Pils','Pils',4.8,{l:'#532f2a',a:'#8a988c',i:'#cac5ac',u:'Keller Pils'}],
 ['=Pflug Dunkles Kellerbier','Kellerbier',5.4,{l:'#38211e',a:'#a7a889',i:'#c4c2a1',u:'Dunkles Kellerbier'}],
 ['=Pflug Hefe-Weizen','Weißbier',5.4,{l:'#2d2d2b',a:'#416a68',i:'#aca784',u:'Hefe-Weizen'}],
 ['=Pflug Bockbier Naturtrüb','Doppelbock',7.5,{l:'#2b2d27',a:'#838063',i:'#c0bea9',u:'Bockbier Naturtrüb'}]]],
['Kronen-Brauerei','Kronen','Laupheim','Baden-Württemberg','DE','nrw','brown','#edf0f2','#99906d','#884d34',[
 ['Weisse','Weißbier',5.0],
 ['Hell','Helles',4.8,{l:'#e0cdb6',a:'#ff0517',i:'#a51c25'}],
 ['Kellerbier','Kellerbier',5.2,{l:'#ecbd7e',a:'#2a1a10',i:'#643324'}],
 ['=Kronen Spezial','Helles',5.0,{l:'#e5d9d3',a:'#974343',i:'#8c4e4e',u:'Spezial'}],
 ['Heimatfestbier','Festbier',5.2,{l:'#b7d1d1',a:'#789671',i:'#945944'}]]],
['Berg Brauerei','Berg','Ehingen-Berg','Baden-Württemberg','DE','nrw','brown','#d0b99e','#46403b','#46403b',[
 ['=Berg Original Hell','Helles',5.0,{u:'Original Hell'}],
 ['Ulrichsbier','Helles',5.3,{l:'#f1e0d0',a:'#b9967d',i:'#804b36'}],
 ['Jubel Bier','Helles',5.3,{l:'#e9d3ac',a:'#365293',i:'#425787'}],
 ['=Berg Hefeweizen','Weißbier',5.1,{l:'#e9d1b8',a:'#898279',i:'#684c3c',u:'Hefeweizen'}],
 ['=Berg Weihnachtsbier','Festbier',5.8,{l:'#386842',a:'#ddc792',i:'#ece4cc',u:'Weihnachtsbier'}]]],
['Mohrenbrauerei','Mohren','Dornbirn','Vorarlberg','AT','nrw','brown','#f8f8f8','#8b2026','#7d2e32',[
 ['Spezial','Helles',5.6],
 ['Pale Ale','Pale Ale',5.0,{l:'#130723',a:'#4d363a',i:'#dac08c'}],
 ['Pfiff','Helles',4.9,{l:'#ffffff',a:'#75533a',i:'#6d5442'}],
 ['Kellerbier','Kellerbier',5.7,{l:'#0a1e6a',a:'#e1c68a',i:'#d6c295'}],
 ['Helles','Helles',5.1,{l:'#faf9fb',a:'#ddd0a6',i:'#5e4337'}]]],
['Zwönitzer Brauerei','Zwönitzer','Zwönitz','Sachsen','DE','nrw','brown','#33261c','#f0dfaa','#e7dab3',[
 ['Ziegenbock','Doppelbock',7.5],
 ['Winterstern','Festbier',6.0,{l:'#cdca8e',a:'#793027',i:'#442926'}],
 ['Rauchbier','Rauchbier',5.0,{l:'#2c3230',a:'#5a8070',i:'#c6c387'}],
 ['=Zwönitzer Urbock','Bock',6.8,{l:'#dfd569',a:'#6a895b',i:'#343730',u:'Urbock'}],
 ['Feieromd Bier','Dunkel',4.9,{l:'#230e06',a:'#efe2c2',i:'#c9b882'}]]],
['Privatbrauerei Specht','Specht','Ehrenfriedersdorf','Sachsen','DE','nrw','brown','#302118','#666961','#dfbf96',[
 ['Greifensteinquell Landbier','Landbier',4.8],
 ['Pilsener','Pils',4.8,{l:'#7c9f77',a:'#f0ebd0',i:'#ece8d4'}],
 ['=Schwarzer Specht','Bock',6.1,{l:'#2a150e',a:'#aba484',i:'#a6a189',u:'Schwarzer Specht'}],
 ['Spezial','Helles',5.0,{l:'#342c25',a:'#7f8485',i:'#adb1b0'}],
 ['Bockbier','Bock',6.1,{l:'#a4000d',a:'#52301b',i:'#b4ad9e'}]]],
['Lang-Bräu','Lang-Bräu','Schönbrunn','Oberfranken','DE','nrw','brown','#e8e9e8','#c8bfaf','#98744e',[
 ['Hell','Helles',4.5],
 ['Naturtrübs Super Ale','Pale Ale',4.9,{l:'#dfe0de',a:'#875551',i:'#805b58'}],
 ['Lager','Lager',4.5,{l:'#fc2d0b',a:'#ffcf7a',i:'#f5cc84'}],
 ['Bock','Doppelbock',7.5,{l:'#ecc379',a:'#2a1a10',i:'#845b39'}],
 ['Märzen Spezial','Märzen',5.5,{l:'#e1dcd2',a:'#2a1a10',i:'#aa6846'}]]],
['Brauerei Göller','Göller Drosendorf','Drosendorf','Oberfranken','DE','swing','brown','#1b1a28','#8e87a5','#e0e4f2',[
 ['Lagerbier','Lager',4.9],
 ['Märzen','Märzen',5.5,{l:'#c2cce1',a:'#3f3b62',i:'#43405d'}],
 ['Urstoff','Dunkel',4.9,{l:'#dde7ee',a:'#474a75',i:'#4d4f6f'}]]],
['Brauhaus zum Sternla','Sternla','Bamberg','Oberfranken','DE','nrw','brown','#e9dfd8','#fccd78','#978452',[
 ['Märzen','Märzen',5.0],
 ['Export','Export',5.1],
 ['Helles Kellerbier','Kellerbier',4.7],
 ['Sommerbier','Helles',4.5],
 ['Zwickel','Zwickel',4.8]]],
['Ambräusianum','Ambräusianum','Bamberg','Oberfranken','DE','nrw','brown','#f5f4f4','#d09291','#a51b1c',[
 ['Hell','Helles',5.0],
 ['U³ Ungespundet','Kellerbier',5.4],
 ['Bernsteinweizen','Weißbier',5.6],
 ['Bock','Bock',7.0,{l:'#046a28',a:'#e7e2e4',i:'#f4f8f6'}]]],
['Kieler Brauerei','Kieler','Kiel','Schleswig-Holstein','DE','swing','brown','#a39b7f','#697051','#223023',[
 ['=Kieler Bier','Helles',4.8,{u:'Bier'}],
 ['Helles Pils','Pils',4.8],
 ['Dunkel','Dunkel',4.8,{l:'#341f0c',a:'#efe2c2',i:'#876d43'}]]],
['Brauerei Wippra','Wippraer','Wippra','Sachsen-Anhalt','DE','nrw','brown','#37332f','#beb57b','#e7cf9e',[
 ['=Wippra Pilsener','Pils',5.0,{u:'Wippra Pilsener',t:'Wippraer'}],
 ['=Wippra Kellerbier','Kellerbier',5.0,{l:'#0d0803',a:'#2f3255',i:'#343650',u:'Wippra Kellerbier',t:'Wippraer'}],
 ['Mansfelder Kupferbier','Spezialbier',5.4,{l:'#851f29',a:'#b74b41',i:'#bd8877'}],
 ['=Wippraer Männerbräu','Helles',5.0,{l:'#72625e',a:'#93898f',i:'#1d1516',u:'Männerbräu'}],
 ['=Wippra Bockbier Hell','Bock',6.4,{l:'#c5bba0',a:'#592b29',i:'#53312f',u:'Wippra Bockbier Hell',t:'Wippraer'}]]],
['Traugott Simon Bräu','Traugott Simon','Köln','Rheinland','DE','nrw','brown','#8a8f90','#3d331f','#393223',[
 ['=Traugott Simon Pilsener','Pils',4.8,{u:'Pilsener'}],
 ['Weizen Hefetrüb','Weißbier',4.9,{l:'#180f0b',a:'#8f7962',i:'#9a8d7c'}],
 ['=Traugott Simon Kölsch','Kölsch',4.8,{l:'#110804',a:'#6e6563',i:'#6e6563',u:'Kölsch'}],
 ['=Traugott Simon Export','Export',5.3,{l:'#e7e9e7',a:'#681420',i:'#5d1f28',u:'Export'}],
 ['=Traugott Simon Alt','Alt',4.8,{l:'#d3e2dd',a:'#1b4141',i:'#203c3c',u:'Alt'}]]],
['Saarfürst Merziger Brauhaus','Saarfürst','Merzig','Saarland','DE','nrw','brown','#341f0c','#efe2c2','#876d43',[
 ['Biereiche','Dunkel',5.3],
 ['=Saarfürst Hell','Helles',4.9,{u:'Hell'}],
 ['Sommerweizen','Weißbier',4.8],
 ['Bockbier','Bock',7.2],
 ['Weizen','Weißbier',4.8]]],
['Grosswald Brauerei','Grosswald','Heusweiler','Saarland','DE','nrw','brown','#abaeb5','#494642','#494642',[
 ['Hofgut-Pils','Pils',5.1],
 ['Zwickel naturtrüb','Zwickel',5.1,{l:'#293121',a:'#6b6e52',i:'#aeafa4'}],
 ['Festtrunk','Festbier',5.5,{l:'#645d45',a:'#adae8e',i:'#d7e0d1'}],
 ['Landbier','Landbier',5.1,{l:'#6d7040',a:'#b0aa78',i:'#362a24'}],
 ['=Grosswald Urweizen','Weißbier',5.3,{l:'#b7b6b6',a:'#336a5a',i:'#222019',u:'Urweizen'}]]],
['Eschweger Klosterbrauerei','Eschweger','Eschwege','Hessen','DE','nrw','brown','#e7e7e2','#5c438b','#5f4c82',[
 ['Klosterbräu Helles','Helles',4.9],
 ['=Eschweger Premium Pils','Pils',4.8,{l:'#f6f6f5',a:'#542d61',i:'#51345a',u:'Premium Pils'}],
 ['Jacobinus Schwarzbier','Schwarzbier',4.9,{l:'#3f3425',a:'#a1988d',i:'#eae2d4'}],
 ['Jacobinus Zwickl','Zwickel',4.8,{l:'#9d897a',a:'#dcbb99',i:'#5d3e38'}],
 ['Jacobinus Hefe-Weizen','Weißbier',5.7,{l:'#274d6f',a:'#ccbca5',i:'#e4d6c3'}]]],
['Hessische Löwenbier Brauerei','Löwenbier','Baunatal','Hessen','DE','nrw','brown','#5a4738','#f5f0cf','#f0ecd4',[
 ['Pilsner','Pils',5.0],
 ['Brauer Schorsch\'s Kellerbier','Kellerbier',5.2,{l:'#fdfce8',a:'#603e15',i:'#563d1f'}]]],
['Hirsch-Brauerei Honer','Hirsch','Wurmlingen','Baden-Württemberg','DE','nrw','brown','#646c73','#eeeadc','#ece9de',[
 ['=Hirsch Hefe Weisse','Weißbier',5.4,{u:'Hefe Weisse'}],
 ['=Hirsch Helles','Helles',4.8,{l:'#e0d6b0',a:'#0d5389',i:'#1d5179',u:'Helles'}],
 ['Zwickl','Zwickel',5.2,{l:'#979875',a:'#2b3118',i:'#292e1b'}],
 ['Pils','Pils',5.0,{l:'#a79c95',a:'#8b6855',i:'#435340'}],
 ['=Hirsch Gold','Helles',5.2,{l:'#7f786d',a:'#c1b198',i:'#ebe6df',u:'Gold'}]]],
['Lahnsteiner Brauerei','Lahnsteiner','Lahnstein','Rheinland-Pfalz','DE','nrw','brown','#221817','#e7cba2','#dec9ab',[
 ['Zwickel Bier','Zwickel',4.9],
 ['=Lahnsteiner Helles','Helles',5.0,{l:'#947153',a:'#e8ddd1',i:'#e5ddd4',u:'Helles'}],
 ['Martinator','Doppelbock',8.0,{l:'#4a413a',a:'#b39f82',i:'#ad9e88'}],
 ['=Lahnsteiner Pils','Pils',4.9,{l:'#321809',a:'#efe2c2',i:'#c8944a',u:'Pils'}],
 ['Grutbier','Spezialbier',4.9,{l:'#3c6f49',a:'#afb3b2',i:'#cad3ce'}]]],
['Rhönbrauerei Dittmar','Rhön','Kaltennordheim','Thüringen','DE','nrw','brown','#9b9a7b','#4d4d3f','#4d4d3f',[
 ['=Rhöner Pils','Pils',4.9,{u:'Rhöner Pils'}],
 ['=Rhöner Hell','Helles',5.1,{l:'#d1dfdd',a:'#3982b6',i:'#47393d',u:'Rhöner Hell'}],
 ['=Rhöner Land Premium','Helles',4.9,{l:'#dfdfbe',a:'#528589',i:'#382b26',u:'Rhöner Land Premium'}],
 ['=Rhöner Kellerbier','Kellerbier',4.9,{l:'#411e1f',a:'#b59b9f',i:'#b29ea1',u:'Rhöner Kellerbier'}],
 ['=Rhöner Hopfensinfonie','Bock',6.0,{l:'#fffffe',a:'#120e0c',i:'#110e0d',u:'Rhöner Hopfensinfonie'}]]],
['Hochstiftliches Brauhaus Motten','Will-Bräu','Motten','Unterfranken','DE','nrw','brown','#eccf99','#956a51','#8c6c5a',[
 ['Maria Ehrenberger Pilgerstoff','Dunkel',5.4],
 ['Pilgerstoff','Helles',5.1,{l:'#efcfa1',a:'#7b5c47',i:'#745d4e'}],
 ['Helles','Helles',4.9,{l:'#ccd4d5',a:'#6f3e4f',i:'#694451'}],
 ['Original Bayerisch Malz','Alkoholfrei',0.0,{l:'#f6f6f5',a:'#845449',i:'#7c5951'}],
 ['Hefe Weizen','Weißbier',5.4,{l:'#c6d3d5',a:'#255381',i:'#315375'}]]],
['Westerwald-Brauerei','Hachenburger','Hachenburg','Rheinland-Pfalz','DE','nrw','brown','#353f74','#adafa5','#e6e6d5',[
 ['=Hachenburger Hell','Helles',4.8,{u:'Hell'}],
 ['=Hachenburger Pils','Pils',4.9,{l:'#e6eef0',a:'#32241b',i:'#2f251e',u:'Pils'}],
 ['Westerwald-Bräu','Helles',5.2,{l:'#fef8dd',a:'#2a1a10',i:'#a36e47'}],
 ['=Hachenburger Weizen','Weißbier',5.1,{l:'#593d1d',a:'#f3e888',i:'#ebecbe',u:'Weizen'}],
 ['=Hachenburger Zwickel','Zwickel',5.1,{l:'#ffffff',a:'#5f4033',i:'#594239',u:'Zwickel'}]]],
['Lausitzer Original','Lausitzer','Neuwiese','Sachsen','DE','nrw','brown','#1d1e2d','#efe2c2','#c5a185',[
 ['=Lausitzer Original Lausi Premium Pils','Pils',5.0,{u:'Pils'}],
 ['=Lausitzer Original Weißbier','Weißbier',5.0,{l:'#5d4b44',a:'#dad2d8',i:'#dad2d8',u:'Original Weißbier'}]]],
['Braumanufaktur Forsthaus Templin','Potsdamer','Potsdam','Brandenburg','DE','nrw','brown','#ebbe4e','#d8faff','#121221',[
 ['=Potsdamer Stange','Helles',4.3,{u:'Stange'}],
 ['Hell','Helles',4.5,{l:'#dbcead',a:'#444226',i:'#403f2a'}],
 ['Werdersches','Dunkel',4.4,{l:'#28433d',a:'#e0f0ed',i:'#e2eeec'}],
 ['Dunkel','Dunkel',4.4,{l:'#1e0f0d',a:'#e0ca9d',i:'#d7c7a6'}],
 ['Edelmalz','Alkoholfrei',0.0,{l:'#856971',a:'#d5be9e',i:'#edead2'}]]],
];
/* ---------- Aufklappen ---------- */
(function(){
 const norm=s=>String(s).toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ø/g,'o').replace(/æ/g,'ae').replace(/ł/g,'l').replace(/đ/g,'d');
 const slug=s=>norm(s).replace(/['’]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const lum=h=>{const n=parseInt(h.slice(1),16);return (0.299*(n>>16)+0.587*((n>>8)&255)+0.114*(n&255))/255};
 const hash=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h};
 // Land der bisherigen 34 Biere
 const OLD_CC={guinness:'IE','pilsner-urquell':'CZ',budvar:'CZ','sierra-nevada':'US','punk-ipa':'GB'};
 const ids=new Set(), names=new Set();
 BEERS.forEach(b=>{b.country=b.country||OLD_CC[b.id]||'DE';ids.add(b.id);names.add(slug(b.name))});
 // gleiche Biere unter anderem Namen (nicht doppelt aufnehmen)
 const ALIAS=new Set(['augustiner-lagerbier-hell','guinness-draught','tegernseer-hell','rothaus-pils-tannenzaepfle','paulaner-hefe-weissbier','schneider-weisse-tap-7-unser-original','weihenstephaner-hefeweissbier','erdinger-weissbier','franziskaner-hefe-weissbier','jever-pilsener','krombacher-pils','becks-pils','bitburger-pils','koestritzer-schwarzbier','budweiser-budvar-original','pilsner-urquell','sierra-nevada-pale-ale','brewdog-punk-ipa','ayinger-celebrator','andechser-doppelbock-dunkel','schoenramer-pils','giesinger-erhellung','moenchshof-kellerbier','spaten-muenchner-hell','hofbraeu-original','loewenbraeu-original','paulaner-oktoberfest-bier','tegernseer-spezial','augustiner-edelstoff','weihenstephaner-vitus','ayinger-kellerbier','paulaner-muenchner-hell','mahrs-braeu-au-ungespundet','aecht-schlenkerla-rauchbier','schlenkerla-rauchbier-maerzen']);
 let added=0;
 CATALOG_RAW.forEach(br=>{
  const [brewery,brand,city,region,cc,shape,glass,label,acc,ink,list]=br;
  list.forEach(x=>{
   const [v,style,abv,o0]=x,o=o0||{};
   const full=v[0]==='='?v.slice(1):brand+' '+v;
   let id=slug(full);
   if(names.has(id)||ALIAS.has(id))return;
   if(ids.has(id))id=slug(full+' '+city);
   if(ids.has(id))return;
   const M=STYLE_META[style]||{};
   let sh=o.s||shape;if(!o.s&&M.w&&sh!=='can'&&sh!=='swing')sh='longneck';
   let L=o.l||label,A=o.a||acc,I=o.i||ink;
   if(style==='Radler'&&!o.l){L='#f6e27a'}
   if(Math.abs(lum(L)-lum(I))<0.38)I=lum(L)>0.5?'#2a1a10':'#f6ecd0';
   const sub=(o.u||(v[0]==='='?style:v)).toUpperCase().slice(0,26);
   const C=COUNTRIES[cc]||[cc,''];
   const origin=cc==='DE'?(region&&region!==city?city+', '+region:city):(cc==='GB'?city+', '+region:city+', '+C[0]);
   const tl=M.t||['Ein Bier mit eigenem Charakter.'],t=tl[hash(id)%tl.length];
   const intro=[`Von ${brewery} aus ${city}. `,`Gebraut in ${city} – ${brewery}. `,`Aus ${city}: ${brewery}. `][hash(id+'x')%3];
   BEERS.push({id,name:full,brewery,style,abv,origin,country:cc,cat:1,
    svg:{shape:sh,glass:o.g||glass,label:L,label2:A,ink:I,cap:lum(L)<0.25?L:A,neck:A,text:o.t||brand,sub},
    desc:intro+t});
   ids.add(id);names.add(id);added++;
  });
 });
 // Bundesland / bayerischer Regierungsbezirk für den Regionen-Filter
 const BY='Bayern',NRW='Nordrhein-Westfalen',RLP='Rheinland-Pfalz',BW='Baden-Württemberg';
 const RM={'Bayern':[BY,'Oberbayern'],'Oberbayern':[BY,'Oberbayern'],'Niederbayern':[BY,'Niederbayern'],'Oberpfalz':[BY,'Oberpfalz'],
  'Franken':[BY,'Franken'],'Oberfranken':[BY,'Franken'],'Mittelfranken':[BY,'Franken'],'Unterfranken':[BY,'Franken'],'Rhön':[BY,'Franken'],
  'Schwaben':[BY,'Schwaben'],'Allgäu':[BY,'Schwaben'],'Schwarzwald':[BW],'Baden-Württemberg':[BW],'Eifel':[RLP],'Pfalz':[RLP],'Rheinland-Pfalz':[RLP],
  'Siegerland':[NRW],'Sauerland':[NRW],'Ruhrgebiet':[NRW],'Ostwestfalen':[NRW],'Bergisches Land':[NRW],'Münsterland':[NRW],'Niederrhein':[NRW],'Rheinland':[NRW],
  'Friesland':['Niedersachsen'],'Rügen':['Mecklenburg-Vorpommern']};
 const CITY={'Augsburg':[BY,'Schwaben'],'Kempten':[BY,'Schwaben'],'Oettingen':[BY,'Schwaben'],'Kutzenhausen':[BY,'Schwaben'],'Regensburg':[BY,'Oberpfalz'],'Laaber':[BY,'Oberpfalz'],'Neumarkt':[BY,'Oberpfalz'],
  'Abensberg':[BY,'Niederbayern'],'Riedenburg':[BY,'Niederbayern'],'Kelheim':[BY,'Niederbayern'],'Kelheim-Weltenburg':[BY,'Niederbayern'],'Leutkirch':[BW],'Kißlegg':[BW],'München-Giesing':[BY,'Oberbayern'],'Bremen':['Bremen'],'Hamburg':['Hamburg'],'Berlin':['Berlin']};
 BEERS.forEach(b=>{if((b.country||'DE')!=='DE')return;const pr=(b.origin||'').split(',').map(x=>x.trim()),c=CITY[pr[0]]||RM[pr[1]]||(pr[1]?[pr[1]]:null);if(c){b.state=c[0];if(c[1])b.reg=c[1]}});
 // Suchindex (Umlaute & Akzente egal)
 const TRAPPIST=['Chimay','Orval','Rochefort','Westmalle','Westvleteren','Achel','La Trappe'];
 BEERS.forEach(b=>{if(b.cat&&TRAPPIST.some(t=>b.name.startsWith(t))){b.kw='Trappist Trappistenbier Kloster';b.desc='Echtes Trappistenbier aus der Abtei. '+b.desc}});
 // geläufige Schreibweisen
 const KW={'Brauhaus Leikeim':'Leikheim Leikheil Bügelflasche','Familienbrauerei Jacob':'Jacobs Hammersee'};
 BEERS.forEach(b=>{const k=KW[b.brewery];if(k)b.kw=((b.kw||'')+' '+k).trim()});
 BEERS.forEach(b=>{const C=COUNTRIES[b.country]||['',''],M=STYLE_META[b.style]||{};b.hay=norm([b.name,b.brewery,b.style,b.origin,C[0],M.g||'',b.kw||'',b.state||'',b.reg||''].join(' '))});
 STYLES=Object.keys(STYLE_META);
 const BYREG=['Franken','Oberbayern','Niederbayern','Oberpfalz','Schwaben'];
 window.HM_CATALOG={added,norm,BYREG};
})();
