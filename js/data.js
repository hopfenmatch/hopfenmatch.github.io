/* HopfenMatch – Stammdaten & Beispieldaten */
'use strict';
const STYLE_COLORS={Helles:'#f3c236',Pils:'#f6d34c',Lager:'#efbd35',Export:'#eab030',Festbier:'#e9a92a','Weißbier':'#eaa338',Weizenbock:'#c9741f',Kellerbier:'#dc8f2a',Stout:'#1e0e07',Schwarzbier:'#1a0c05',Doppelbock:'#6a2c0e',Rauchbier:'#5c240b','Pale Ale':'#e2952a',IPA:'#e7a02c',Dunkel:'#5a2a0f'};
const STYLES=['Helles','Pils','Lager','Export','Festbier','Weißbier','Weizenbock','Kellerbier','Dunkel','Doppelbock','Stout','Schwarzbier','Rauchbier','Pale Ale','IPA'];
const TAGS=['Malzig','Süffig','Ausgewogen','Mild','Harmonisch','Klassisch','Fruchtig','Spritzig','Banane','Röstig','Cremig','Unverwechselbar','Würzig','Vollmundig','Herb','Erfrischend','Hopfig','Rauchig','Karamell','Schokoladig','Nelke','Zitrus','Kräftig','Trocken','Süßlich','Naturtrüb'];

/* img: echte Bilder aus der Referenz; svg: gezeichnete Flasche
   svg = {shape, glass, label, label2, ink, cap, neck, text, sub, gl} */
const BEERS=[
 {id:'tegernseer-hell',name:'Tegernseer Hell',brewery:'Brauerei Tegernsee',style:'Helles',abv:4.8,origin:'Tegernsee, Bayern',img:{pair:'pair_tegernseer-hell',bot:'bot_tegernseer-hell',hero:'hero_tegernseer'},desc:'Das goldgelbe Helle vom Tegernsee: feine Malzsüße, dezente Hopfenherbe und eine ausgesprochen süffige Art. Ein Klassiker aus dem Herzoglich Bayerischen Brauhaus.'},
 {id:'augustiner-hell',name:'Augustiner Hell',brewery:'Augustiner Bräu München',style:'Helles',abv:5.2,origin:'München, Bayern',img:{pair:'pair_augustiner-hell',bot:'bot_augustiner-hell'},desc:'Münchens älteste Brauerei. Das Lagerbier Hell ist mild, harmonisch und für viele das Maß aller Hellen – mit Kultstatus weit über München hinaus.'},
 {id:'paulaner-weissbier',name:'Paulaner Weißbier',brewery:'Paulaner Brauerei',style:'Weißbier',abv:5.5,origin:'München, Bayern',img:{pair:'pair_paulaner-weissbier',bot:'bot_paulaner-weissbier'},desc:'Naturtrübes Hefeweißbier mit fruchtigen Bananen- und dezenten Nelkenaromen, spritzig und vollmundig.'},
 {id:'guinness',name:'Guinness Draught',short:'Guinness',brewery:'Guinness Brewery',style:'Stout',abv:4.2,origin:'Dublin, Irland',img:{pair:'pair_guinness',bot:'bot_guinness'},desc:'Das berühmte irische Stout mit cremiger Stickstoff-Schaumkrone, Röstaromen von Kaffee und dunkler Schokolade.'},
 {id:'schneider-tap7',name:'Schneider Weisse TAP 7',brewery:'Schneider Weisse',style:'Weißbier',abv:5.4,origin:'Kelheim, Bayern',img:{pair:'pair_schneider-tap7',bot:'bot_schneider-tap7'},desc:'„Unser Original“ – bernsteinfarbenes Weißbier nach dem Rezept von 1872, würzig mit Noten von Nelke, Banane und Karamell.'},
 {id:'bitburger',name:'Bitburger Pils',brewery:'Bitburger Brauerei',style:'Pils',abv:4.8,origin:'Bitburg, Eifel',img:{pair:'pair_bitburger',bot:'bot_bitburger'},desc:'„Bitte ein Bit“ – feinherbes Premium-Pils mit frischer Hopfennote aus der Eifel.'},
 {id:'ayinger-kellerbier',name:'Ayinger Kellerbier',brewery:'Brauerei Aying',style:'Kellerbier',abv:4.9,origin:'Aying, Bayern',img:{pair:'bot_ayinger-kellerbier',bot:'bot_ayinger-kellerbier'},desc:'Unfiltriert und naturtrüb, mit kräftigem Malzkörper und frischer Hefenote – wie direkt aus dem Lagerkeller.'},
 {id:'paulaner-helles',name:'Paulaner Münchner Hell',brewery:'Paulaner Brauerei',style:'Helles',abv:4.9,origin:'München, Bayern',img:{pair:'bot_paulaner-helles',bot:'bot_paulaner-helles'},desc:'Das Münchner Helle von Paulaner: hellgolden, mild-malzig und ein erfrischendes Feierabendbier.'},
 {id:'augustiner-edelstoff',name:'Augustiner Edelstoff',brewery:'Augustiner Bräu München',style:'Export',abv:5.6,origin:'München, Bayern',svg:{shape:'nrw',glass:'brown',label:'#f3ead2',label2:'#1d6b3a',ink:'#7a1c14',cap:'#c9a227',neck:'#1d6b3a',text:'Edelstoff',sub:'AUGUSTINER'},desc:'Spritzig-frisches Exportbier mit feiner Kohlensäure – der „Edelstoff“ unter den Münchner Bieren.'},
 {id:'andechser-doppelbock',name:'Andechser Doppelbock Dunkel',short:'Andechser Doppelbock',brewery:'Klosterbrauerei Andechs',style:'Doppelbock',abv:7.1,origin:'Andechs, Bayern',svg:{shape:'nrw',glass:'brown',label:'#7c1d1a',label2:'#d6b24c',ink:'#f6e7b8',cap:'#d6b24c',neck:'#d6b24c',text:'Andechser',sub:'DOPPELBOCK'},desc:'Tiefdunkles Klosterbier vom Heiligen Berg: vollmundig, malzig-süß mit Röst- und Karamellnoten.'},
 {id:'weihenstephaner-hefe',name:'Weihenstephaner Hefeweissbier',short:'Weihenstephaner Hefe',brewery:'Bayerische Staatsbrauerei Weihenstephan',style:'Weißbier',abv:5.4,origin:'Freising, Bayern',svg:{shape:'longneck',glass:'brown',label:'#fbf6e8',label2:'#1c3f7a',ink:'#1c3f7a',cap:'#1c3f7a',neck:'#1c3f7a',text:'Weihen-stephaner',sub:'HEFEWEISSBIER'},desc:'Aus der ältesten Brauerei der Welt: goldgelb, feinperlig, mit Bananenduft und angenehmer Hefe-Frische.'},
 {id:'weihenstephaner-vitus',name:'Weihenstephaner Vitus',brewery:'Bayerische Staatsbrauerei Weihenstephan',style:'Weizenbock',abv:7.7,origin:'Freising, Bayern',svg:{shape:'longneck',glass:'brown',label:'#f4c430',label2:'#1c3f7a',ink:'#1c3f7a',cap:'#f4c430',neck:'#1c3f7a',text:'Vitus',sub:'WEIZENBOCK'},desc:'Heller Weizenbock mit Aromen von getrockneten Aprikosen und Gewürzen – kräftig und doch elegant.'},
 {id:'franziskaner',name:'Franziskaner Hefe-Weissbier',brewery:'Spaten-Franziskaner-Bräu',style:'Weißbier',abv:5.0,origin:'München, Bayern',svg:{shape:'longneck',glass:'brown',label:'#fdfaf2',label2:'#e0701e',ink:'#3a2a1a',cap:'#e0701e',neck:'#e0701e',text:'Franziskaner',sub:'HEFE-WEISSBIER'},desc:'Spritzig-fruchtiges Hefeweißbier mit dem berühmten Mönch auf dem Etikett.'},
 {id:'erdinger',name:'Erdinger Weissbier',brewery:'Erdinger Weißbräu',style:'Weißbier',abv:5.3,origin:'Erding, Bayern',svg:{shape:'longneck',glass:'brown',label:'#f7f1df',label2:'#12407a',ink:'#12407a',cap:'#12407a',neck:'#c8a74a',text:'Erdinger',sub:'WEISSBIER'},desc:'Feinperliges Weißbier aus Erding, mild-aromatisch mit dezenter Hefenote.'},
 {id:'jever',name:'Jever Pilsener',brewery:'Friesisches Brauhaus zu Jever',style:'Pils',abv:4.9,origin:'Jever, Friesland',svg:{shape:'longneck',glass:'green',label:'#173f2a',label2:'#c9b26a',ink:'#f1e6c2',cap:'#173f2a',neck:'#c9b26a',text:'JEVER',sub:'PILSENER'},desc:'Friesisch herb: kräftige Hopfenbittere, trockenes Finish – eines der herbsten deutschen Pilsbiere.'},
 {id:'rothaus',name:'Rothaus Tannenzäpfle',brewery:'Badische Staatsbrauerei Rothaus',style:'Pils',abv:5.1,origin:'Grafenhausen, Schwarzwald',svg:{shape:'steinie',glass:'brown',label:'#f6efdd',label2:'#b3241c',ink:'#b3241c',cap:'#b3241c',neck:'#b3241c',text:'Tannen-zäpfle',sub:'ROTHAUS PILS'},desc:'Kultpils aus dem Schwarzwald im kleinen 0,33er-Fläschchen mit dem Schwarzwaldmädel.'},
 {id:'krombacher',name:'Krombacher Pils',brewery:'Krombacher Brauerei',style:'Pils',abv:4.8,origin:'Kreuztal, Siegerland',svg:{shape:'longneck',glass:'green',label:'#fbf8ef',label2:'#0f5a32',ink:'#0f5a32',cap:'#c9a227',neck:'#0f5a32',text:'Krombacher',sub:'PILS'},desc:'Mit Felsquellwasser gebraut – mild-herbes Pils aus dem Siegerland.'},
 {id:'becks',name:"Beck's Pils",brewery:'Brauerei Beck',style:'Pils',abv:4.9,origin:'Bremen',svg:{shape:'longneck',glass:'green',label:'#0f6b3a',label2:'#c8102e',ink:'#ffffff',cap:'#0f6b3a',neck:'#c8102e',text:"BECK'S",sub:'PILS'},desc:'Norddeutsches Pils aus Bremen, frisch und klar mit herbem Abgang.'},
 {id:'spaten-hell',name:'Spaten Münchner Hell',brewery:'Spaten-Franziskaner-Bräu',style:'Helles',abv:5.2,origin:'München, Bayern',svg:{shape:'nrw',glass:'brown',label:'#f8f5ec',label2:'#14408f',ink:'#14408f',cap:'#14408f',neck:'#14408f',text:'SPATEN',sub:'MÜNCHNER HELL'},desc:'Das Original-Münchner-Hell von 1894 – mild, ausgewogen und strohgold.'},
 {id:'hofbraeu-original',name:'Hofbräu Original',brewery:'Staatliches Hofbräuhaus München',style:'Helles',abv:5.1,origin:'München, Bayern',svg:{shape:'nrw',glass:'brown',label:'#fbf8f0',label2:'#2b5aa6',ink:'#123a7a',cap:'#2b5aa6',neck:'#2b5aa6',text:'HB',sub:'HOFBRÄU ORIGINAL'},desc:'Das Helle aus dem weltberühmten Hofbräuhaus: süffig und vollmundig.'},
 {id:'loewenbraeu',name:'Löwenbräu Original',brewery:'Löwenbräu München',style:'Helles',abv:5.2,origin:'München, Bayern',svg:{shape:'nrw',glass:'brown',label:'#1e3f86',label2:'#d9b44a',ink:'#f5e9c6',cap:'#1e3f86',neck:'#d9b44a',text:'Löwenbräu',sub:'ORIGINAL'},desc:'Münchner Helles mit dem Löwen – hopfenaromatisch, rund und leicht süß.'},
 {id:'giesinger',name:'Giesinger Erhellung',brewery:'Giesinger Bräu',style:'Helles',abv:5.0,origin:'München-Giesing',svg:{shape:'nrw',glass:'brown',label:'#f3f0e6',label2:'#1a1a1a',ink:'#1a1a1a',cap:'#1a1a1a',neck:'#1a1a1a',text:'Erhellung',sub:'GIESINGER BRÄU'},desc:'Junges Münchner Craft-Helles aus Giesing: unfiltriert-frisch mit floralem Hopfen.'},
 {id:'schlenkerla',name:'Aecht Schlenkerla Rauchbier',brewery:'Brauerei Heller-Trum',style:'Rauchbier',abv:5.1,origin:'Bamberg, Franken',svg:{shape:'nrw',glass:'brown',label:'#efe3c4',label2:'#7a1a12',ink:'#3b1308',cap:'#7a1a12',neck:'#7a1a12',text:'Schlenkerla',sub:'RAUCHBIER MÄRZEN'},desc:'Bambergs berühmtes Rauchbier: Buchenholz-geräuchertes Malz sorgt für intensive Speck-Rauch-Aromen.'},
 {id:'pilsner-urquell',name:'Pilsner Urquell',brewery:'Plzeňský Prazdroj',style:'Pils',abv:4.4,origin:'Pilsen, Tschechien',svg:{shape:'longneck',glass:'green',label:'#f3e9cf',label2:'#b2922f',ink:'#8a1c17',cap:'#b2922f',neck:'#8a1c17',text:'Pilsner Urquell',sub:'SEIT 1842'},desc:'Das erste Pils der Welt: goldene Farbe, Saazer Hopfen und karamellige Malznote.'},
 {id:'budvar',name:'Budweiser Budvar Original',brewery:'Budějovický Budvar',style:'Lager',abv:5.0,origin:'České Budějovice, Tschechien',svg:{shape:'nrw',glass:'green',label:'#f5efe0',label2:'#c1121f',ink:'#c1121f',cap:'#c1121f',neck:'#c1121f',text:'Budvar',sub:'ORIGINAL'},desc:'Böhmisches Lager mit 90 Tagen Reifezeit – vollmundig, mit feiner Saazer-Herbe.'},
 {id:'koestritzer',name:'Köstritzer Schwarzbier',brewery:'Köstritzer Schwarzbierbrauerei',style:'Schwarzbier',abv:4.8,origin:'Bad Köstritz, Thüringen',svg:{shape:'longneck',glass:'brown',label:'#1a1410',label2:'#c9a24a',ink:'#e8cf8a',cap:'#1a1410',neck:'#c9a24a',text:'Köstritzer',sub:'SCHWARZBIER'},desc:'Tiefschwarz und doch leicht: dezente Röstaromen, milde Bittere – Goethes Lieblingsbier.'},
 {id:'moenchshof-keller',name:'Mönchshof Kellerbier',brewery:'Kulmbacher Brauerei',style:'Kellerbier',abv:5.4,origin:'Kulmbach, Franken',svg:{shape:'swing',glass:'brown',label:'#f1e2bf',label2:'#8a3b12',ink:'#5a220b',cap:'#e8e1d2',neck:'#8a3b12',text:'Mönchshof',sub:'KELLERBIER'},desc:'Naturtrübes fränkisches Kellerbier in der Bügelflasche, malzig-würzig und ungefiltert.'},
 {id:'mahrs-au',name:'Mahrs Bräu aU Ungespundet',brewery:'Mahrs Bräu Bamberg',style:'Kellerbier',abv:5.2,origin:'Bamberg, Franken',svg:{shape:'nrw',glass:'brown',label:'#f7f4ea',label2:'#111111',ink:'#111111',cap:'#111111',neck:'#d8b04a',text:'aU',sub:'MAHRS BRÄU'},desc:'Das legendäre „a Ungespundete“ aus Bamberg: hopfig-frisch, unfiltriert, wenig Kohlensäure.'},
 {id:'sierra-nevada',name:'Sierra Nevada Pale Ale',brewery:'Sierra Nevada Brewing Co.',style:'Pale Ale',abv:5.6,origin:'Chico, Kalifornien',svg:{shape:'steinie',glass:'brown',label:'#1f5a3a',label2:'#f2e6c4',ink:'#f2e6c4',cap:'#1f5a3a',neck:'#1f5a3a',text:'Sierra Nevada',sub:'PALE ALE'},desc:'Der Pionier des amerikanischen Craft Beers: Cascade-Hopfen mit Kiefern- und Grapefruitnoten.'},
 {id:'punk-ipa',name:'BrewDog Punk IPA',brewery:'BrewDog',style:'IPA',abv:5.4,origin:'Ellon, Schottland',svg:{shape:'can',glass:'brown',label:'#2fb3c9',label2:'#ffffff',ink:'#ffffff',cap:'#bfc5c8',neck:'#2fb3c9',text:'PUNK IPA',sub:'BREWDOG'},desc:'Tropische Fruchtaromen, kräftige Bittere – das Post-Modern Classic IPA aus Schottland.'},
 {id:'paulaner-oktoberfest',name:'Paulaner Oktoberfest Bier',brewery:'Paulaner Brauerei',style:'Festbier',abv:6.0,origin:'München, Bayern',svg:{shape:'nrw',glass:'brown',label:'#f8f4ea',label2:'#1d4fa0',ink:'#1d4fa0',cap:'#1d4fa0',neck:'#1d4fa0',text:'Oktoberfest',sub:'PAULANER'},desc:'Das Wiesnbier von Paulaner: goldgelb, vollmundig und kräftig eingebraut.'},
 {id:'tegernseer-spezial',name:'Tegernseer Spezial',brewery:'Brauerei Tegernsee',style:'Export',abv:5.6,origin:'Tegernsee, Bayern',svg:{shape:'nrw',glass:'brown',label:'#eef3f6',label2:'#1d3f7a',ink:'#1d3f7a',cap:'#c9a227',neck:'#1d3f7a',text:'Tegernseer',sub:'SPEZIAL'},desc:'Der große Bruder des Hellen: kräftiger, vollmundiger und mit feiner Hopfennote.'},
 {id:'ayinger-celebrator',name:'Ayinger Celebrator',brewery:'Brauerei Aying',style:'Doppelbock',abv:6.7,origin:'Aying, Bayern',svg:{shape:'nrw',glass:'brown',label:'#141414',label2:'#c9a24a',ink:'#e9d39a',cap:'#141414',neck:'#c9a24a',text:'Celebrator',sub:'AYINGER DOPPELBOCK'},desc:'Weltweit prämierter Doppelbock: tiefdunkel, samtig, mit Noten von Pflaume, Kaffee und Karamell.'},
 {id:'schoenramer-pils',name:'Schönramer Pils',brewery:'Private Landbrauerei Schönram',style:'Pils',abv:5.0,origin:'Schönram, Bayern',svg:{shape:'nrw',glass:'brown',label:'#f4efe1',label2:'#2e6b2f',ink:'#2e6b2f',cap:'#2e6b2f',neck:'#2e6b2f',text:'Schönramer',sub:'PILS'},desc:'Eines der besten Pilsbiere Bayerns: feinherb, blumig-hopfig und schlank.'}
];

const USERS={
 sascha:{id:'sascha',name:'Sascha',full:'Sascha Hammel',handle:'@sascha',img:'img/sascha.jpg',city:'München',since:'Januar 2024'},
 martin:{id:'martin',name:'Martin',full:'Martin',handle:'@martin',img:'img/martin.jpg',city:'München',since:'Februar 2024'}
};

const H=3600e3, D=24*H;
/* [user, beer, score, offset(ms vor jetzt), kommentar, tags] */
const SEED_RATINGS=[
 ['sascha','tegernseer-hell',94,26*H,'Wunderbar süffig, malzig und ehrlich herb. Ein Klassiker, der einfach immer passt.',['Malzig','Süffig','Ausgewogen']],
 ['sascha','paulaner-weissbier',91,3*D,'Fruchtig, spritzig, schöne Banane – genau so muss ein Weißbier schmecken.',['Fruchtig','Spritzig','Banane']],
 ['sascha','guinness',90,4*D,'Röstig, cremig, unverwechselbar. Frisch gezapft im Pub ein Gedicht.',['Röstig','Cremig','Unverwechselbar']],
 ['sascha','schneider-tap7',88,5*D,'Würzig und vollmundig, tolle Karamellnote. Etwas schwerer als gedacht.',['Fruchtig','Würzig','Vollmundig']],
 ['sascha','ayinger-kellerbier',91,6*D,'So süffig und ausgewogen! Naturtrüb und richtig frisch.',['Süffig','Naturtrüb','Malzig']],
 ['sascha','bitburger',82,9*D,'Solides Pils, schön herb und erfrischend. Nichts Besonderes, aber zuverlässig.',['Herb','Spritzig','Erfrischend']],
 ['sascha','augustiner-hell',92,12*D,'Mild, harmonisch, klassisch. Das Helle für jeden Biergarten.',['Mild','Harmonisch','Klassisch']],
 ['sascha','augustiner-edelstoff',87,13*D,'Spritziger als das Helle, schön frisch. Perfekt im Sommer.',['Spritzig','Erfrischend','Malzig']],
 ['sascha','pilsner-urquell',87,15*D,'Toller Hopfen, leichte Karamellnote. Vom Fass in Prag noch besser.',['Hopfig','Karamell','Herb']],
 ['sascha','weihenstephaner-hefe',87,16*D,'Sehr rund, feine Banane, cremiger Schaum.',['Banane','Cremig','Fruchtig']],
 ['sascha','andechser-doppelbock',86,18*D,'Mächtig, malzig-süß und schokoladig. Eins reicht.',['Kräftig','Schokoladig','Malzig']],
 ['sascha','rothaus',86,20*D,'Tannenzäpfle – klein, fein, herb. Kultbier!',['Herb','Erfrischend','Klassisch']],
 ['sascha','paulaner-helles',85,22*D,'Ein erfrischendes Helles nach Feierabend.',['Süffig','Mild','Erfrischend']],
 ['sascha','giesinger',85,24*D,'Schön floral, unfiltriert, junge Münchner Brauerei mit Charakter.',['Hopfig','Naturtrüb','Süffig']],
 ['sascha','spaten-hell',84,27*D,'Klassisches Münchner Hell, angenehm mild.',['Mild','Klassisch','Ausgewogen']],
 ['sascha','moenchshof-keller',83,30*D,'Bügelflasche, Plopp, Kellerbier – passt.',['Malzig','Naturtrüb','Würzig']],
 ['sascha','franziskaner',81,33*D,'Fruchtig, aber etwas dünn im Abgang.',['Fruchtig','Spritzig']],
 ['sascha','jever',80,36*D,'Richtig herb – muss man mögen.',['Herb','Trocken','Hopfig']],
 ['sascha','koestritzer',79,40*D,'Leichter als es aussieht, dezente Röstaromen.',['Röstig','Mild']],
 ['sascha','punk-ipa',77,44*D,'Viel Grapefruit, ordentlich bitter. Für zwischendurch okay.',['Zitrus','Hopfig','Fruchtig']],
 ['sascha','erdinger',76,48*D,'Ganz okay, aber da gibt es bessere Weißbiere.',['Mild','Banane']],
 ['sascha','schlenkerla',74,55*D,'Schmeckt wie Schinken im Glas. Spannend, aber nicht meins.',['Rauchig','Malzig','Kräftig']],
 ['sascha','krombacher',72,60*D,'Standard-Pils, eher langweilig.',['Herb','Trocken']],
 ['sascha','becks',68,70*D,'Na ja – zum Grillen geht’s.',['Herb','Spritzig']],
 ['martin','guinness',90,5*H,'Röstig, cremig, unverwechselbar.',['Röstig','Cremig','Unverwechselbar']],
 ['martin','ayinger-kellerbier',96,8*H,'So süffig und ausgewogen! 😍',['Süffig','Ausgewogen','Naturtrüb']],
 ['martin','tegernseer-hell',92,10*D,'Ein bayerischer Klassiker! 🍺',['Malzig','Klassisch','Süffig']],
 ['martin','schneider-tap7',94,2*D,'Bestes Weißbier, das ich kenne. Würzig ohne Ende.',['Würzig','Karamell','Vollmundig']],
 ['martin','mahrs-au',93,3*D,'Das „Ungespundete“ in Bamberg direkt am Hahn – Wahnsinn!',['Hopfig','Naturtrüb','Süffig']],
 ['martin','ayinger-celebrator',94,4*D,'Samtig, dunkel, Pflaume und Kaffee. Ein Fest.',['Schokoladig','Kräftig','Karamell']],
 ['martin','tegernseer-spezial',92,6*D,'Kräftiger als das Helle und richtig rund.',['Vollmundig','Malzig','Ausgewogen']],
 ['martin','weihenstephaner-hefe',93,9*D,'Feinste Banane, super cremig.',['Banane','Cremig','Fruchtig']],
 ['martin','andechser-doppelbock',95,14*D,'Im Bräustüberl auf dem Heiligen Berg – unschlagbar.',['Kräftig','Schokoladig','Malzig']],
 ['martin','augustiner-edelstoff',91,17*D,'Spritzig und edel, nomen est omen.',['Spritzig','Erfrischend']],
 ['martin','augustiner-hell',95,21*D,'Einfach ein perfektes Helles! 🍺',['Mild','Harmonisch','Klassisch']],
 ['martin','paulaner-weissbier',86,19*D,'Gut, aber mir fast zu fruchtig.',['Fruchtig','Banane']],
 ['martin','paulaner-helles',89,11*D,'Ein erfrischendes Helles nach Feierabend!',['Süffig','Erfrischend']],
 ['martin','rothaus',89,23*D,'Kleine Flasche, großes Pils.',['Herb','Klassisch']],
 ['martin','hofbraeu-original',88,25*D,'Wiesn-Feeling auch im Sommer.',['Süffig','Vollmundig']],
 ['martin','spaten-hell',87,28*D,'Mild und ehrlich.',['Mild','Klassisch']],
 ['martin','sierra-nevada',85,31*D,'Schöner Hopfen, für ein Pale Ale top.',['Hopfig','Zitrus']],
 ['martin','franziskaner',85,34*D,'Ordentliches Weißbier.',['Fruchtig','Spritzig']],
 ['martin','koestritzer',84,38*D,'Überraschend leicht und rund.',['Röstig','Mild']],
 ['martin','loewenbraeu',83,41*D,'Süffig, aber etwas süß.',['Süßlich','Süffig']],
 ['martin','schlenkerla',81,46*D,'Rauchig, deftig – zur Brotzeit super.',['Rauchig','Kräftig']],
 ['martin','jever',78,50*D,'Zu herb für mich.',['Herb','Trocken']],
 ['martin','bitburger',75,58*D,'Bitte ein Bit – aber nur eins.',['Herb','Erfrischend']],
 ['martin','krombacher',74,64*D,'Geht so.',['Herb']],
 ['martin','becks',70,75*D,'Fernsehbier.',['Spritzig']]
];
/* Check-ins: Freund trinkt gerade */
const SEED_CHECKINS=[
 ['martin','augustiner-hell',2*H,'Einfach ein perfektes Helles! 🍺']
];
function dayAt(offsetDays,h,m){const d=new Date();d.setDate(d.getDate()+offsetDays);d.setHours(h,m||0,0,0);return d.getTime()}
function seedTastings(){
 const wd=['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'][new Date().getDay()];
 return [
 {id:'t-live',name:wd+' Tasting',date:dayAt(0,19,0),place:'Bei Martin',host:'sascha',participants:['sascha','martin'],status:'live',
  beers:['augustiner-hell','paulaner-weissbier','guinness','schneider-tap7'],
  scores:{'augustiner-hell':{sascha:91,martin:89},'paulaner-weissbier':{sascha:88,martin:92},'guinness':{sascha:95,martin:94},'schneider-tap7':{martin:90}},note:'Bringt Brezn mit! 🥨'},
 {id:'t-okt',name:'Oktoberfest-Nachlese',date:dayAt(13,19,30),place:'Bei Sascha',host:'sascha',participants:['sascha','martin'],status:'planned',
  beers:['paulaner-oktoberfest','augustiner-edelstoff','hofbraeu-original','loewenbraeu','spaten-hell'],scores:{},note:'Festbiere im direkten Vergleich, dazu Hendl.'},
 {id:'t-franken',name:'Franken-Kellerbier-Abend',date:dayAt(27,18,0),place:'Biergarten am Chinesischen Turm',host:'martin',participants:['sascha','martin'],status:'planned',
  beers:['mahrs-au','moenchshof-keller','ayinger-kellerbier','schlenkerla'],scores:{},note:''},
 {id:'t-weiss',name:'Weißbier-Vergleich',date:dayAt(-21,18,30),place:'Bei Martin',host:'martin',participants:['sascha','martin'],status:'done',
  beers:['paulaner-weissbier','weihenstephaner-hefe','franziskaner','erdinger','schneider-tap7'],
  scores:{'paulaner-weissbier':{sascha:90,martin:87},'weihenstephaner-hefe':{sascha:88,martin:93},'franziskaner':{sascha:80,martin:85},'erdinger':{sascha:75,martin:79},'schneider-tap7':{sascha:89,martin:94}},note:''},
 {id:'t-stout',name:'Stout & Dunkles',date:dayAt(-35,20,0),place:'Irish Pub, München',host:'sascha',participants:['sascha','martin'],status:'done',
  beers:['guinness','koestritzer','andechser-doppelbock','schlenkerla'],
  scores:{'guinness':{sascha:92,martin:91},'koestritzer':{sascha:79,martin:84},'andechser-doppelbock':{sascha:87,martin:95},'schlenkerla':{sascha:72,martin:81}},note:''},
 {id:'t-hell',name:'Helles-Battle',date:dayAt(-56,17,0),place:'Augustiner-Keller',host:'sascha',participants:['sascha','martin'],status:'done',
  beers:['tegernseer-hell','augustiner-hell','paulaner-helles','spaten-hell','giesinger'],
  scores:{'tegernseer-hell':{sascha:95,martin:92},'augustiner-hell':{sascha:93,martin:96},'paulaner-helles':{sascha:85,martin:88},'spaten-hell':{sascha:83,martin:86},'giesinger':{sascha:86,martin:84}},note:''}
 ];
}
