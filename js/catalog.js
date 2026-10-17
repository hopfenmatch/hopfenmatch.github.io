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
 // Suchindex (Umlaute & Akzente egal)
 const TRAPPIST=['Chimay','Orval','Rochefort','Westmalle','Westvleteren','Achel','La Trappe'];
 BEERS.forEach(b=>{if(b.cat&&TRAPPIST.some(t=>b.name.startsWith(t))){b.kw='Trappist Trappistenbier Kloster';b.desc='Echtes Trappistenbier aus der Abtei. '+b.desc}});
 BEERS.forEach(b=>{const C=COUNTRIES[b.country]||['',''],M=STYLE_META[b.style]||{};b.hay=norm([b.name,b.brewery,b.style,b.origin,C[0],M.g||'',b.kw||''].join(' '))});
 STYLES=Object.keys(STYLE_META);
 window.HM_CATALOG={added,norm};
})();
