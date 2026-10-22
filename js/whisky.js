/* HopfenMatch – Whiskykatalog & gezeichnete Whiskyflaschen (SVG). Ids: wk-<slug> */
'use strict';
(function(){
const DATA=String.raw`# P|Brennerei|Marke|Ort|Region|Land|Typ|Form Glas Etikett Akzent Schrift
# Abfüllung: Name|%vol|Typ(optional)   (Name mit = am Anfang: vollständiger Name)
P|Laphroaig Distillery|Laphroaig|Port Ellen|Islay|GB|Single Malt|sh gr #f4f1e6 #1d5a2a #1d1d1d
10 Years Old|40
Quarter Cask|48
Lore|48
Select|40
P|Lagavulin Distillery|Lagavulin|Port Ellen|Islay|GB|Single Malt|rd cl #f2e8cf #8a6a2a #1d1d1d
16 Years Old|43
8 Years Old|48
Distillers Edition|43
P|Ardbeg Distillery|Ardbeg|Port Ellen|Islay|GB|Single Malt|rd gr #111111 #2f7a3a #e9e2c8
Ten|46
Uigeadail|54.2
Corryvreckan|57.1
An Oa|46.6
Wee Beastie 5 Years|47.4
P|Bowmore Distillery|Bowmore|Bowmore|Islay|GB|Single Malt|rd cl #f4eedc #1d3a5c #1d1d1d
12 Years Old|40
15 Years Old|43
18 Years Old|43
P|Bruichladdich Distillery|Bruichladdich|Bruichladdich|Islay|GB|Single Malt|rd cl #8fb8c9 #1d3a5c #1d2a3a
The Classic Laddie|50
Port Charlotte 10|50
Octomore 14.1|59.1
P|Bunnahabhain Distillery|Bunnahabhain|Port Askaig|Islay|GB|Single Malt|rd cl #f2ead2 #1d1d1d #1d1d1d
12 Years Old|46.3
Toiteach a Dhà|46.3
P|Caol Ila Distillery|Caol Ila|Port Askaig|Islay|GB|Single Malt|rd cl #f4eedc #6b4a2a #1d1d1d
12 Years Old|43
Moch|43
P|Kilchoman Distillery|Kilchoman|Bruichladdich|Islay|GB|Single Malt|rd cl #f5efdc #3a5a6b #1d1d1d
Machir Bay|46
Sanaig|46
P|Glenfiddich Distillery|Glenfiddich|Dufftown|Speyside|GB|Single Malt|tri gr #f4eedc #b8922e #1d1d1d
12 Years Old|40
15 Years Solera|40
18 Years Old|40
Fire & Cane|43
P|The Glenlivet Distillery|The Glenlivet|Ballindalloch|Speyside|GB|Single Malt|rd cl #f5efdc #1d3a5c #1d2a3a
12 Years Double Oak|40
Founder’s Reserve|40
15 Years French Oak|40
18 Years Old|43
P|The Macallan Distillery|The Macallan|Craigellachie|Speyside|GB|Single Malt|rd cl #f2e8cf #6b1d24 #2a1a12
12 Years Sherry Oak|40
12 Years Double Cask|40
18 Years Sherry Oak|43
Rare Cask|43
P|The Balvenie Distillery|The Balvenie|Dufftown|Speyside|GB|Single Malt|rd cl #f4eedc #6b4a2a #2a1a12
DoubleWood 12|40
Caribbean Cask 14|43
PortWood 21|40
P|Aberlour Distillery|Aberlour|Aberlour|Speyside|GB|Single Malt|rd cl #f2ead2 #6b1d24 #1d1d1d
12 Years Double Cask|40
A’bunadh|60.1
P|Glenfarclas Distillery|Glenfarclas|Ballindalloch|Speyside|GB|Single Malt|rd cl #f4eedc #8a1c22 #2a1a12
10 Years Old|40
15 Years Old|46
105 Cask Strength|60
P|Cardhu Distillery|Cardhu|Knockando|Speyside|GB|Single Malt|rd cl #f5efdc #b8922e #2a1a10
12 Years Old|40
P|Craigellachie Distillery|Craigellachie|Craigellachie|Speyside|GB|Single Malt|sq cl #111111 #c8a24a #e9e2c8
13 Years Old|46
P|Mortlach Distillery|Mortlach|Dufftown|Speyside|GB|Single Malt|rd cl #f2ead2 #1d1d1d #1d1d1d
12 Years The Wee Witchie|43.4
P|BenRiach Distillery|BenRiach|Elgin|Speyside|GB|Single Malt|rd cl #f4eedc #2a6a8a #1d2a3a
The Original Ten|43
P|Glen Grant Distillery|Glen Grant|Rothes|Speyside|GB|Single Malt|rd cl #f5efdc #8a1c22 #1d1d1d
12 Years Old|43
Arboralis|40
P|Glen Moray Distillery|Glen Moray|Elgin|Speyside|GB|Single Malt|rd cl #f4eedc #1d3a5c #1d1d1d
Classic|40
P|Cragganmore Distillery|Cragganmore|Ballindalloch|Speyside|GB|Single Malt|rd cl #f2ead2 #6b4a2a #2a1a12
12 Years Old|40
P|Speyburn Distillery|Speyburn|Rothes|Speyside|GB|Single Malt|rd cl #f5efdc #1d3a5c #1d1d1d
10 Years Old|40
P|Tamdhu Distillery|Tamdhu|Knockando|Speyside|GB|Single Malt|rd cl #f4eedc #b8922e #2a1a10
12 Years Old|43
P|Benromach Distillery|Benromach|Forres|Speyside|GB|Single Malt|rd cl #f5efdc #a01b1b #1d1d1d
10 Years Old|43
P|Glenmorangie Distillery|Glenmorangie|Tain|Highlands|GB|Single Malt|tri cl #f4eedc #b8922e #2a1a10
The Original 10|40
Lasanta 12|43
Quinta Ruban 14|46
Nectar d’Or|46
Signet|46
P|The Dalmore Distillery|The Dalmore|Alness|Highlands|GB|Single Malt|rd cl #111111 #c8a24a #c8a24a
12 Years Old|40
Cigar Malt Reserve|44
King Alexander III|40
P|Oban Distillery|Oban|Oban|Highlands|GB|Single Malt|rd cl #f2ead2 #6b4a2a #2a1a12
14 Years Old|43
Little Bay|43
P|Dalwhinnie Distillery|Dalwhinnie|Dalwhinnie|Highlands|GB|Single Malt|rd cl #f4eedc #1d3a5c #1d1d1d
15 Years Old|43
P|Clynelish Distillery|Clynelish|Brora|Highlands|GB|Single Malt|rd cl #f5efdc #b8922e #2a1a10
14 Years Old|46
P|Aberfeldy Distillery|Aberfeldy|Aberfeldy|Highlands|GB|Single Malt|rd cl #f4eedc #b8922e #1d1d1d
12 Years Old|40
P|Old Pulteney Distillery|Old Pulteney|Wick|Highlands|GB|Single Malt|sh cl #f2ead2 #1d3a5c #1d2a3a
12 Years Old|40
P|Glendronach Distillery|GlenDronach|Forgue|Highlands|GB|Single Malt|rd cl #f4eedc #6b1d24 #2a1a12
12 Years Original|43
15 Years Revival|46
18 Years Allardice|46
P|Deanston Distillery|Deanston|Doune|Highlands|GB|Single Malt|rd cl #f5efdc #1d1d1d #1d1d1d
12 Years Old|46.3
P|Edradour Distillery|Edradour|Pitlochry|Highlands|GB|Single Malt|sh cl #f2ead2 #6b1d24 #2a1a12
10 Years Old|40
P|Glengoyne Distillery|Glengoyne|Killearn|Highlands|GB|Single Malt|rd cl #f4eedc #2a4a2a #1d1d1d
12 Years Old|43
P|Tomatin Distillery|Tomatin|Tomatin|Highlands|GB|Single Malt|rd cl #f5efdc #1d1d1d #1d1d1d
12 Years Old|43
P|Ardmore Distillery|Ardmore|Kennethmont|Highlands|GB|Single Malt|rd cl #f2ead2 #2a4a2a #1d1d1d
Legacy|40
P|Auchentoshan Distillery|Auchentoshan|Clydebank|Lowlands|GB|Single Malt|rd cl #f4eedc #1d3a5c #1d2a3a
American Oak|40
Three Wood|43
P|Glenkinchie Distillery|Glenkinchie|Pencaitland|Lowlands|GB|Single Malt|rd cl #f5efdc #b8922e #2a1a10
12 Years Old|43
P|Bladnoch Distillery|Bladnoch|Wigtown|Lowlands|GB|Single Malt|rd cl #f4eedc #1d1d1d #1d1d1d
10 Years Old|46.7
P|Springbank Distillery|Springbank|Campbeltown|Campbeltown|GB|Single Malt|rd cl #f2ead2 #1d1d1d #1d1d1d
10 Years Old|46
15 Years Old|46
=Longrow Peated|46
=Hazelburn 10 Years|46
P|Glen Scotia Distillery|Glen Scotia|Campbeltown|Campbeltown|GB|Single Malt|rd cl #f4eedc #2a6a8a #1d2a3a
Double Cask|46
Victoriana|54.2
P|Talisker Distillery|Talisker|Carbost|Islands|GB|Single Malt|rd cl #f5efdc #b33a2a #1d1d1d
10 Years Old|45.8
Storm|45.8
Port Ruighe|45.8
P|Highland Park Distillery|Highland Park|Kirkwall|Islands|GB|Single Malt|rd cl #f2ead2 #1d1d1d #1d1d1d
12 Years Viking Honour|40
18 Years Viking Pride|43
P|Isle of Jura Distillery|Jura|Craighouse|Islands|GB|Single Malt|rd cl #f4eedc #1d1d1d #1d1d1d
10 Years Old|40
P|Arran Distillery|Arran|Lochranza|Islands|GB|Single Malt|rd cl #f5efdc #6b4a2a #1d1d1d
10 Years Old|46
=Machrie Moor|46
P|Tobermory Distillery|Tobermory|Tobermory|Islands|GB|Single Malt|rd cl #f2ead2 #2a6a8a #1d2a3a
12 Years Old|46.3
=Ledaig 10 Years|46.3
P|John Walker & Sons|Johnnie Walker|Kilmarnock|Scotland|GB|Blended Scotch|sq cl #f4eedc #8a1c22 #1d1d1d
Red Label|40
Black Label 12 Years|40
Double Black|40
Gold Label Reserve|40
Blue Label|40
P|Chivas Brothers|Chivas Regal|Paisley|Scotland|GB|Blended Scotch|rd cl #f2ead2 #b8922e #2a1a10
12 Years Old|40
18 Years Gold Signature|40
P|Ballantine’s|Ballantine’s|Dumbarton|Scotland|GB|Blended Scotch|sq cl #f4eedc #8a1c22 #1d1d1d
Finest|40
17 Years Old|40
P|The Famous Grouse|Famous Grouse|Perth|Scotland|GB|Blended Scotch|rd cl #f5efdc #b33a2a #1d1d1d
Finest|40
Smoky Black|40
P|Dewar’s|Dewar’s|Aberfeldy|Scotland|GB|Blended Scotch|rd cl #f2ead2 #1d1d1d #1d1d1d
White Label|40
12 Years Double Aged|40
P|J&B|J&B|London|Scotland|GB|Blended Scotch|rd gr #f4e04a #b33a2a #1d1d1d
Rare|40
P|Grant’s|Grant’s|Dufftown|Scotland|GB|Blended Scotch|tri cl #f5efdc #8a1c22 #1d1d1d
Triple Wood|40
P|Monkey Shoulder|Monkey Shoulder|Dufftown|Scotland|GB|Blended Malt|rd cl #f2ead2 #b8922e #1d1d1d
=Monkey Shoulder|40
P|Compass Box|Compass Box|London|Scotland|GB|Blended Malt|rd cl #f4eedc #1d1d1d #1d1d1d
The Peat Monster|46
Artist Blend|43
P|Big Peat|Big Peat|Glasgow|Islay|GB|Blended Malt|rd cl #f5efdc #3a2a1a #1d1d1d
=Big Peat Islay Blended Malt|46
P|Haig Club|Haig Club|Cameronbridge|Lowlands|GB|Single Grain|sq dk #2a5a9a #c8d8e8 #e9eef4
Clubman|40
P|Jameson|Jameson|Midleton|Cork|IE|Irish Whiskey|rd gr #f4eedc #2a6a2a #1d1d1d
=Jameson Irish Whiskey|40
Black Barrel|40
18 Years|46
P|Midleton Distillery|Redbreast|Midleton|Cork|IE|Single Pot Still|rd cl #f2ead2 #8a1c22 #2a1a12
12 Years Old|40
Cask Strength|58
15 Years Old|46
P|Green Spot|Green Spot|Midleton|Cork|IE|Single Pot Still|sh cl #f4eedc #2a7a3a #1d1d1d
=Green Spot|40
=Yellow Spot 12 Years|46
P|Powers|Powers|Midleton|Cork|IE|Single Pot Still|rd cl #f5efdc #b8922e #2a1a10
Gold Label|43.2
John’s Lane|46
P|Bushmills Distillery|Bushmills|Bushmills|Antrim|GB|Irish Whiskey|rd cl #f4eedc #1d3a5c #1d1d1d
Original|40
Black Bush|40
10 Years Single Malt|40|Single Malt
P|Tullamore D.E.W.|Tullamore D.E.W.|Tullamore|Offaly|IE|Irish Whiskey|rd cl #f2ead2 #2a6a2a #1d1d1d
Original|40
12 Years Special Reserve|40
P|Teeling Whiskey|Teeling|Dublin|Dublin|IE|Irish Whiskey|sh cl #111111 #c8a24a #e9e2c8
Small Batch|46
Single Malt|46|Single Malt
P|Cooley Distillery|Connemara|Riverstown|Louth|IE|Single Malt|rd cl #f4eedc #2a4a2a #1d1d1d
Peated Single Malt|40
P|Writers’ Tears|Writers’ Tears|Carlow|Carlow|IE|Irish Whiskey|rd cl #f5efdc #b8922e #2a1a10
Copper Pot|40
P|Jack Daniel Distillery|Jack Daniel’s|Lynchburg|Tennessee|US|Tennessee Whiskey|sq cl #111111 #f4eedc #f4eedc
Old No. 7|40
Gentleman Jack|40
Single Barrel Select|45
Tennessee Honey|35|Whiskey-Likör
P|George Dickel|George Dickel|Tullahoma|Tennessee|US|Tennessee Whiskey|sq cl #f2ead2 #1d1d1d #1d1d1d
No. 12|45
P|Jim Beam Distillery|Jim Beam|Clermont|Kentucky|US|Bourbon|sq cl #f4eedc #1d1d1d #1d1d1d
White Label|40
Black Extra-Aged|43
Rye|40|Rye
P|Maker’s Mark Distillery|Maker’s Mark|Loretto|Kentucky|US|Bourbon|bb cl #f2ead2 #b33a2a #1d1d1d
=Maker’s Mark|45
46|47
P|Buffalo Trace Distillery|Buffalo Trace|Frankfort|Kentucky|US|Bourbon|rd cl #f4eedc #1d3a5c #1d1d1d
=Buffalo Trace Bourbon|40
=Eagle Rare 10 Years|45
=Blanton’s Original Single Barrel|46.5
=Sazerac Rye|45|Rye
P|Woodford Reserve Distillery|Woodford Reserve|Versailles|Kentucky|US|Bourbon|dc cl #f2ead2 #6b4a2a #1d1d1d
Distiller’s Select|43.2
Double Oaked|45.2
Rye|45.2|Rye
P|Wild Turkey Distillery|Wild Turkey|Lawrenceburg|Kentucky|US|Bourbon|rd cl #f4eedc #8a1c22 #1d1d1d
101|50.5
Rare Breed|58.4
P|Four Roses Distillery|Four Roses|Lawrenceburg|Kentucky|US|Bourbon|rd cl #f5efdc #b33a2a #1d1d1d
=Four Roses Bourbon|40
Small Batch|45
Single Barrel|50
P|Heaven Hill Distillery|Elijah Craig|Bardstown|Kentucky|US|Bourbon|sq cl #f2ead2 #1d1d1d #1d1d1d
Small Batch|47
=Evan Williams Black Label|43
P|Bulleit Distilling|Bulleit|Shelbyville|Kentucky|US|Bourbon|rd cl #f4eedc #b8922e #2a1a10
Bourbon Frontier Whiskey|45
Rye|45|Rye
P|Knob Creek|Knob Creek|Clermont|Kentucky|US|Bourbon|sq cl #f2ead2 #1d1d1d #1d1d1d
9 Years Small Batch|50
Rye|50|Rye
P|Michter’s Distillery|Michter’s|Louisville|Kentucky|US|Bourbon|rd cl #f5efdc #b33a2a #1d1d1d
US*1 Small Batch Bourbon|45.7
US*1 Rye|42.4|Rye
P|Rittenhouse|Rittenhouse|Bardstown|Kentucky|US|Rye|sq cl #f4eedc #b33a2a #1d1d1d
Bottled-in-Bond Rye|50
P|Woodinville Whiskey|Woodinville|Woodinville|Washington|US|Bourbon|rd cl #f2ead2 #1d1d1d #1d1d1d
Straight Bourbon|45
P|Suntory|Yamazaki|Shimamoto|Osaka|JP|Japanese Single Malt|rd cl #f5efdc #1d1d1d #1d1d1d
12 Years|43
Distiller’s Reserve|43
18 Years|43
P|Suntory Hakushu|Hakushu|Hokuto|Yamanashi|JP|Japanese Single Malt|sq cl #f4eedc #2a6a3a #1d1d1d
Distiller’s Reserve|43
12 Years|43
P|Suntory Hibiki|Hibiki|Osaka|Osaka|JP|Japanese Blend|dc cl #f2ead2 #b8922e #2a1a10
Japanese Harmony|43
17 Years|43
P|Suntory Toki|Toki|Osaka|Osaka|JP|Japanese Blend|sq cl #f5efdc #1d1d1d #1d1d1d
=Suntory Toki|43
P|Nikka Whisky|Nikka|Yoichi|Hokkaido|JP|Japanese Blend|sq cl #111111 #c8a24a #e9e2c8
From the Barrel|51.4
Days|40
Coffey Grain|45|Single Grain
=Yoichi Single Malt|45|Japanese Single Malt
=Miyagikyo Single Malt|45|Japanese Single Malt
P|Chichibu Distillery|Chichibu|Chichibu|Saitama|JP|Japanese Single Malt|rd cl #f4eedc #2a4a6b #1d1d1d
The First Ten|50.5
P|Mars Shinshu|Mars|Miyata|Nagano|JP|Japanese Blend|rd cl #f2ead2 #8a1c22 #1d1d1d
Iwai Tradition|40
P|Kavalan Distillery|Kavalan|Yilan|Yilan|TW|Single Malt|rd cl #f5efdc #b8922e #2a1a10
Classic Single Malt|40
Solist Vinho Barrique|57.1
P|Amrut Distilleries|Amrut|Bangalore|Karnataka|IN|Single Malt|rd cl #f4eedc #1d3a5c #1d1d1d
Fusion|50
Peated Indian Single Malt|46
P|Paul John Distillery|Paul John|Goa|Goa|IN|Single Malt|rd cl #f2ead2 #b33a2a #1d1d1d
Brilliance|46
P|Slyrs Destillerie|Slyrs|Schliersee|Bayern|DE|Single Malt|rd cl #f4eedc #1d3a5c #1d2a3a
Bavarian Single Malt Classic|43
Fifty One|51
P|St. Kilian Distillers|St. Kilian|Rüdenau|Franken|DE|Single Malt|rd cl #f5efdc #b33a2a #1d1d1d
Signature Edition|46
Turf Dog|50
P|Finch Whiskydestillerie|Finch|Heroldstatt|Schwäbische Alb|DE|Single Malt|sq cl #111111 #c8a24a #e9e2c8
Schwäbischer Highland Whisky Classic|40|Blended
P|Spreewood Distillers|Stork Club|Schlepzig|Brandenburg|DE|Rye|rd cl #f2ead2 #1d3a5c #1d1d1d
Straight Rye Whiskey|45
P|Hammerschmiede|Glen Els|Zorge|Harz|DE|Single Malt|dc cl #f4eedc #6b1d24 #2a1a12
The Journey|45.9
P|Destillerie Kammer-Kirsch|Black Forest Rothaus|Karlsruhe|Baden|DE|Single Malt|rd cl #f5efdc #b33a2a #1d1d1d
Single Malt|43
P|Penderyn Distillery|Penderyn|Penderyn|Wales|GB|Single Malt|rd cl #f4eedc #b8922e #1d1d1d
Madeira Finish|46
Legend|41
P|Mackmyra Whisky|Mackmyra|Gävle|Gävleborg|SE|Single Malt|rd cl #f2ead2 #1d1d1d #1d1d1d
Svensk Ek|46.1
P|Crown Royal|Crown Royal|Gimli|Manitoba|CA|Canadian Whisky|dc cl #f4eedc #6b2a8a #2a1a3a
Deluxe|40
Northern Harvest Rye|45|Rye
P|Canadian Club|Canadian Club|Windsor|Ontario|CA|Canadian Whisky|rd cl #f5efdc #1d1d1d #1d1d1d
1858 Original|40
P|Starward Distillery|Starward|Melbourne|Victoria|AU|Single Malt|sq cl #f2ead2 #1d1d1d #1d1d1d
Nova|41
P|Sullivans Cove|Sullivans Cove|Hobart|Tasmanien|AU|Single Malt|rd cl #f4eedc #1d3a5c #1d1d1d
American Oak|47.5
P|Distillerie Warenghem|Armorik|Lannion|Bretagne|FR|Single Malt|rd cl #f5efdc #1d3a5c #1d2a3a
Classic|46
P|Säntis Malt|Säntis Malt|Appenzell|Appenzell|CH|Single Malt|rd cl #f4eedc #6b4a2a #1d1d1d
Edition Säntis|40
P|The Lakes Distillery|The Lakes|Cockermouth|England|GB|Single Malt|rd cl #f2ead2 #6b1d24 #2a1a12
The One Signature Blended|46.6|Blended
P|Cotswolds Distillery|Cotswolds|Stourton|England|GB|Single Malt|rd cl #f5efdc #1d1d1d #1d1d1d
Signature Single Malt|46
P|Glen Garioch Distillery|Glen Garioch|Oldmeldrum|Highlands|GB|Single Malt|rd cl #f4eedc #6b1d24 #2a1a12
12 Years Old|48
P|Royal Lochnagar Distillery|Royal Lochnagar|Crathie|Highlands|GB|Single Malt|rd cl #f2ead2 #6b4a2a #2a1a12
12 Years Old|40
P|Loch Lomond Distillery|Loch Lomond|Alexandria|Highlands|GB|Single Malt|rd cl #f5efdc #1d3a5c #1d1d1d
12 Years Old|46
P|GlenAllachie Distillery|GlenAllachie|Aberlour|Speyside|GB|Single Malt|rd cl #f4eedc #1d1d1d #1d1d1d
12 Years Old|46
P|Ailsa Bay Distillery|Ailsa Bay|Girvan|Lowlands|GB|Single Malt|sq cl #f2ead2 #1d1d1d #1d1d1d
Sweet Smoke|48.9
P|Port Ellen Distillery|Port Ellen|Port Ellen|Islay|GB|Single Malt|rd cl #f5efdc #1d1d1d #1d1d1d
Rogue Casks|50.9
P|Ardnamurchan Distillery|Ardnamurchan|Glenbeg|Highlands|GB|Single Malt|rd cl #f4eedc #2a4a2a #1d1d1d
AD Single Malt|46.8
P|Wolfburn Distillery|Wolfburn|Thurso|Highlands|GB|Single Malt|rd cl #f2ead2 #1d3a5c #1d1d1d
Northland|46
P|Old Forester Distillery|Old Forester|Louisville|Kentucky|US|Bourbon|rd cl #f5efdc #b33a2a #1d1d1d
86 Proof|43
1920 Prohibition Style|57.5
P|Barton 1792 Distillery|1792|Bardstown|Kentucky|US|Bourbon|dc cl #f4eedc #1d1d1d #1d1d1d
Small Batch|46.85
P|Angel’s Envy|Angel’s Envy|Louisville|Kentucky|US|Bourbon|rd cl #f2ead2 #b8922e #2a1a10
Port Finish Bourbon|43.3
P|Basil Hayden|Basil Hayden|Clermont|Kentucky|US|Bourbon|rd cl #f5efdc #6b4a2a #1d1d1d
=Basil Hayden Bourbon|40
P|Uncle Nearest|Uncle Nearest|Shelbyville|Tennessee|US|Tennessee Whiskey|rd cl #f4eedc #b8922e #2a1a10
1856 Premium|50
P|WhistlePig Farm|WhistlePig|Shoreham|Vermont|US|Rye|rd cl #f2ead2 #1d1d1d #1d1d1d
10 Years Straight Rye|50
`;
const WHISKY_GROUPS=[['malt','Single Malt'],['blend','Blended'],['bourbon','Bourbon & Tennessee'],['rye','Rye'],['irish','Irish Pot Still & Blend'],['grain','Single Grain'],['likoer','Likör']];
const TG={'Single Malt':'malt','Japanese Single Malt':'malt','Blended Scotch':'blend','Blended Malt':'blend','Japanese Blend':'blend','Blended':'blend','Canadian Whisky':'blend','Bourbon':'bourbon','Tennessee Whiskey':'bourbon','Rye':'rye','Irish Whiskey':'irish','Single Pot Still':'irish','Single Grain':'grain','Whiskey-Likör':'likoer'};
const RN={Islay:'torfig-rauchig mit Jod, Meersalz und Lagerfeuer',Speyside:'fruchtig und elegant mit Apfel, Honig und Vanille',Highlands:'kräftig und vielseitig mit Heide, Malz und Gewürz',Lowlands:'leicht und blumig mit Gras, Zitrus und Getreide',Campbeltown:'ölig und maritim mit Salz und dezentem Rauch',Islands:'maritim mit Pfeffer, Salz und sanftem Rauch',Kentucky:'süß mit Vanille, Karamell und gerösteter Eiche',Tennessee:'mild mit Karamell, Banane und Holzkohle-Filterung'};
const TN={malt:'malzig, komplex und charaktervoll',blend:'rund und zugänglich, mit Malz, Honig und Getreide',bourbon:'süß mit Vanille, Karamell und gerösteter Eiche',rye:'würzig mit Roggen, Pfeffer und Zimt',irish:'weich und dreifach destilliert, mit Honig und grünem Apfel',grain:'leicht und süß mit Vanille und Kokos',likoer:'süß mit Honig und Whiskey'};
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[’'&.*]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function liquor(name,type,reg){const n=name.toLowerCase();
 if(/sherry|oloroso|a’bunadh|uigeadail|lasanta|glendronach|ruban|distillers edition|portwood|port finish|port ruighe|cigar|vinho|double cask|doublewood|105|rare cask|allardice|revival|18/.test(n))return '#8e3c12';
 if(/white label|days|toki|harmony|green spot|original|classic|machir|ten$|10|wee beastie|an oa|haig|clubman|rogue|nova/.test(n)&&reg!=='Kentucky')return '#d9a646';
 if(type==='bourbon'||type==='rye')return '#b0521a';if(type==='likoer')return '#c27a22';return '#c47f28'}
const WHISKIES=[];const seen=new Set();let P=null;
DATA.split('\n').forEach(l=>{l=l.trim();if(!l||l[0]==='#')return;const f=l.split('|');
 if(f[0]==='P'){const lk=f[7].split(' ');P={prod:f[1],brand:f[2],ort:f[3],reg:f[4],cc:f[5],typ:f[6],shape:lk[0],glass:lk[1],label:lk[2],accent:lk[3],ink:lk[4]};return}
 const full=f[0][0]==='='?f[0].slice(1):P.brand+' '+f[0];const typ=f[2]||P.typ,grp=TG[typ]||'malt';
 let id='wk-'+slug(full);if(seen.has(id))id+='-'+slug(P.ort);seen.add(id);
 const age=(full.match(/(\d{1,2})\s*(Years|Jahre)/i)||full.match(/\s(1[0-9]|2[0-5])$/)||[])[1]||'';
 const C=(typeof COUNTRIES!=='undefined'&&COUNTRIES[P.cc])||[P.cc];
 const note=RN[P.reg]||TN[grp];
 const RG=P.reg==='Scotland'?'Schottland':P.reg,LN=RG==='Antrim'?'Nordirland':P.cc==='GB'&&RG!=='Wales'&&RG!=='England'?'Schottland':C[0];
 const desc=`${typ}. Typisch: ${note}${age?`, ${age} Jahre im Fass gereift`:''}. Region ${RG===LN?LN:RG+', '+LN} – ${P.prod}, ${P.ort}.`;
 const sub=(typ==='Japanese Single Malt'?'SINGLE MALT':typ==='Japanese Blend'?'BLENDED WHISKY':typ==='Blended Scotch'?'BLENDED SCOTCH':typ==='Tennessee Whiskey'?'TENNESSEE WHISKEY':typ==='Bourbon'?'KENTUCKY BOURBON':typ).toUpperCase();
 WHISKIES.push({id,kat:'whisky',name:full,brewery:P.prod,style:typ,grp,abv:+f[1]||40,origin:P.ort+', '+P.reg,country:P.cc,reg:P.reg==='Scotland'?'Schottland':P.reg,cat:1,desc,
  svg:{shape:P.shape,glass:P.glass,label:P.label,accent:P.accent,ink:P.ink,liq:liquor(full,grp,P.reg),text:P.brand,sub,age}})});

/* ---------- Zeichnen ---------- */
let _k=0;
function mix(a,b,t){const x=parseInt(a.slice(1),16),y=parseInt(b.slice(1),16);const r=Math.round((x>>16)+((y>>16)-(x>>16))*t),g=Math.round(((x>>8)&255)+(((y>>8)&255)-((x>>8)&255))*t),bl=Math.round((x&255)+((y&255)-(x&255))*t);return '#'+((1<<24)|(r<<16)|(g<<8)|bl).toString(16).slice(1)}
function outline(sh){
 if(sh==='sq')return {p:`M14.8,20 L25.2,20 L25.2,44 Q25.2,52 31,54 L35.6,56 Q36.6,56.6 36.6,58 L36.6,146 Q36.6,148 34.6,148 L5.4,148 Q3.4,148 3.4,146 L3.4,58 Q3.4,56.6 4.4,56 L9,54 Q14.8,52 14.8,44 Z`,nh:5.2,top:20,nb:44,bw:16.6,liq:62,ly:76,lh:50,cap:'tall',sq:1};
 if(sh==='sh')return {p:`M14.4,30 L25.6,30 L25.6,44 Q25.6,52 36.4,58 L36.4,145 Q36.4,148 33.4,148 L6.6,148 Q3.6,148 3.6,145 L3.6,58 Q14.4,52 14.4,44 Z`,nh:5.6,top:30,nb:44,bw:16.4,liq:62,ly:78,lh:48,cap:'cork'};
 if(sh==='dc')return {p:`M15,36 L25,36 L25,50 C25,58 37.6,58 37.6,76 L37.6,140 Q37.6,148 29.6,148 L10.4,148 Q2.4,148 2.4,140 L2.4,76 C2.4,58 15,58 15,50 Z`,nh:5,top:36,nb:50,bw:17.6,liq:72,ly:86,lh:42,cap:'ball'};
 if(sh==='bb')return {p:`M14.6,30 L25.4,30 L25.4,46 Q25.4,54 32,56 Q36.4,57.4 36.4,62 L36.4,146 Q36.4,148 34.4,148 L5.6,148 Q3.6,148 3.6,146 L3.6,62 Q3.6,57.4 8,56 Q14.6,54 14.6,46 Z`,nh:5.4,top:30,nb:46,bw:16.4,liq:64,ly:80,lh:46,cap:'wax',sq:1};
 if(sh==='tri')return {p:`M15.6,14 L24.4,14 L24.4,42 C24.4,58 34,60 34,74 L34,145 Q34,148 31,148 L9,148 Q6,148 6,145 L6,74 C6,60 15.6,58 15.6,42 Z`,nh:4.4,top:14,nb:42,bw:14,liq:70,ly:86,lh:44,cap:'cork',tri:1};
 return {p:`M15.4,18 L24.6,18 L24.6,42 C24.6,54 35,52 35,64 L35,145 Q35,148 32,148 L8,148 Q5,148 5,145 L5,64 C5,52 15.4,54 15.4,42 Z`,nh:4.6,top:18,nb:42,bw:15,liq:66,ly:80,lh:46,cap:'cork'}}
function whiskyBottle(s){
 const id='k'+(++_k),O=outline(s.shape),L=20-O.nh,R=20+O.nh,lq=s.liq;
 const gtint=s.glass==='gr'?'#2f5a34':s.glass==='dk'?s.label:null;
 const lc=gtint?mix(lq,gtint,s.glass==='dk'?0.9:0.38):lq;
 const e0=shade(lc,-0.5),e1=shade(lc,-0.12),e2=shade(lc,0.35);
 let o=`<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${e0}"/><stop offset=".12" stop-color="${e1}"/><stop offset=".3" stop-color="${e2}"/><stop offset=".5" stop-color="${lc}"/><stop offset=".85" stop-color="${e1}"/><stop offset="1" stop-color="${e0}"/></linearGradient>
 <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="${gtint?shade(gtint,-0.3):'#9aa39c'}" stop-opacity=".75"/><stop offset=".3" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="${gtint?shade(gtint,-0.3):'#8a938c'}" stop-opacity=".75"/></linearGradient>
 <linearGradient id="${id}l" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".24"/><stop offset=".3" stop-color="#fff" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient><clipPath id="${id}c"><path d="${O.p}"/></clipPath></defs>`;
 o+=`<ellipse cx="20" cy="149" rx="${O.bw+2}" ry="2.2" fill="#000" opacity=".2"/>`;
 // Glas (leer) + Flüssigkeit bis zur Schulter
 o+=`<path d="${O.p}" fill="url(#${id}g)"/><g clip-path="url(#${id}c)"><rect x="0" y="${O.liq}" width="40" height="${150-O.liq}" fill="url(#${id})"/><rect x="0" y="${O.liq}" width="40" height="1.4" fill="${shade(lc,0.45)}" opacity=".8"/>`;
 if(O.sq)o+=`<rect x="0" y="50" width="${20-O.bw+4.2}" height="100" fill="#000" opacity=".16"/><rect x="${20+O.bw-4.2}" y="50" width="6" height="100" fill="#000" opacity=".26"/><path d="M${20-O.bw+4.2},56 L${20-O.bw+4.2},148 M${20+O.bw-4.2},56 L${20+O.bw-4.2},148" stroke="#fff" stroke-opacity=".35" stroke-width=".5"/>`;
 if(O.tri)o+=`<path d="M${20-O.bw+5},70 L${20-O.bw+5},148 M${20+O.bw-5},70 L${20+O.bw-5},148" stroke="#fff" stroke-opacity=".22" stroke-width=".6"/>`;
 o+=`</g><path d="${O.p}" fill="none" stroke="${gtint?shade(gtint,-0.4):'#6d746e'}" stroke-opacity=".55" stroke-width=".7"/>`;
 // Verschluss
 const cc=s.accent==='#1d1d1d'||s.accent==='#111'?'#202020':s.accent;
 if(O.cap==='tall')o+=`<rect x="${L-1.2}" y="${O.top-14}" width="${2*O.nh+2.4}" height="15" rx="1.4" fill="#1b1b1b"/><rect x="${L-1.2}" y="${O.top-14}" width="${2*O.nh+2.4}" height="15" rx="1.4" fill="url(#${id}l)"/><path d="M${L-1.2},${O.top-3} L${R+1.2},${O.top-3}" stroke="#d9c27a" stroke-width=".7" opacity=".7"/>`;
 else if(O.cap==='ball')o+=`<rect x="${L+1}" y="${O.top-7}" width="${2*O.nh-2}" height="8" fill="#e9e3d2" opacity=".8"/><circle cx="20" cy="${O.top-12}" r="8" fill="url(#${id}g)" stroke="#8a938c" stroke-opacity=".6" stroke-width=".6"/><circle cx="17.4" cy="${O.top-14.6}" r="2.2" fill="#fff" opacity=".6"/>`;
 else if(O.cap==='wax')o+=`<path d="M${L-1.4},${O.top-12} L${R+1.4},${O.top-12} L${R+1.6},${O.top+5} Q${R+1.2},${O.top+11} ${R-0.6},${O.top+8} Q${R-2},${O.top+14} ${20+1.2},${O.top+7} Q20,${O.top+12} ${20-1.6},${O.top+6} Q${L+1.4},${O.top+13} ${L+0.4},${O.top+6} Q${L-1.6},${O.top+9} ${L-1.6},${O.top+4} Z" fill="#b8231b"/><path d="M${L-1.4},${O.top-12} L${R+1.4},${O.top-12} L${R+1.6},${O.top+5} L${L-1.6},${O.top+4} Z" fill="url(#${id}l)"/>`;
 else o+=`<rect x="${L-1.6}" y="${O.top-12}" width="${2*O.nh+3.2}" height="9" rx="1.6" fill="${shade(cc,-0.1)}"/><rect x="${L-1.6}" y="${O.top-12}" width="${2*O.nh+3.2}" height="9" rx="1.6" fill="url(#${id}l)"/><rect x="${L+0.4}" y="${O.top-3.4}" width="${2*O.nh-0.8}" height="4" fill="#c89a62"/><path d="M${L-1.6},${O.top-9} L${R+1.6},${O.top-9}" stroke="#d9c27a" stroke-width=".6" opacity=".8"/>`;
 // Halsband
 o+=`<rect x="${L-0.2}" y="${O.nb-9}" width="${2*O.nh+0.4}" height="6" fill="${s.label}"/><path d="M${L-0.2},${O.nb-8.2} L${R+0.2},${O.nb-8.2} M${L-0.2},${O.nb-3.8} L${R+0.2},${O.nb-3.8}" stroke="${s.accent}" stroke-width=".5"/>`;
 // Etikett
 const lw=2*O.bw-(O.sq?7:3),lx=20-lw/2,ly=O.ly,lh=O.lh,ac=s.accent,ink=s.ink,dark=lumOf(s.label)<0.35;
 const gold=dark?(ac==='#e9e2c8'||ac==='#f4eedc'?'#d8c48a':ac):ac;
 o+=`<g clip-path="url(#${id}c)">`;
 if(O.sq)o+=`<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" rx="0.6" fill="${s.label}"/>`;
 else o+=`<path d="M${lx},${ly+4} Q20,${ly-2.6} ${lx+lw},${ly+4} L${lx+lw},${ly+lh} L${lx},${ly+lh} Z" fill="${s.label}"/>`;
 o+=`<rect x="${lx+1.5}" y="${ly+(O.sq?1.5:4.2)}" width="${lw-3}" height="${lh-(O.sq?3:5.7)}" fill="none" stroke="${gold}" stroke-width=".55"/>`;
 const t1=ly+(O.sq?8:10);
 o+=`<text x="20" y="${t1}" font-family="'Source Sans 3',Arial" font-weight="700" font-size="2.5" fill="${gold}" text-anchor="middle" letter-spacing=".5">${s.cc||''}</text>`;
 o+=labelText(s.text,20,ly+(s.age?16:20),lw-5,ink,s.text.length>10?7:8.2);
 if(s.age){o+=`<text x="20" y="${ly+lh-13.2}" font-family="Lora,Georgia,serif" font-weight="700" font-size="11.5" fill="${gold}" text-anchor="middle">${esc(s.age)}</text><text x="20" y="${ly+lh-9.4}" font-family="'Source Sans 3',Arial" font-weight="700" font-size="2.4" fill="${gold}" text-anchor="middle" letter-spacing=".5">YEARS OLD</text>`}
 else o+=`<path d="M${20-lw*0.2},${ly+lh-15} L${20+lw*0.2},${ly+lh-15}" stroke="${gold}" stroke-width=".5"/><circle cx="20" cy="${ly+lh-15}" r="1.1" fill="${gold}"/>`;
 const sub=s.sub;o+=`<text x="20" y="${ly+lh-4.2}" font-family="'Source Sans 3',Arial,sans-serif" font-weight="700" font-size="${Math.min(3,(lw-5)/(sub.length*0.6)).toFixed(2)}" fill="${ink}" text-anchor="middle" letter-spacing=".3">${esc(sub)}</text>`;
 o+=`<rect x="0" y="${ly-3}" width="40" height="${lh+6}" fill="url(#${id}l)"/></g>`;
 // Glanzlichter
 o+=`<path d="M${20-O.bw+(O.sq?2:3.2)},${O.liq-4} L${20-O.bw+(O.sq?2:3.2)},144" stroke="#fff" stroke-opacity=".42" stroke-width="${O.sq?1.2:1.8}" stroke-linecap="round"/><path d="M${L+1.5},${O.top+3} L${L+1.5},${O.nb-11}" stroke="#fff" stroke-opacity=".45" stroke-width="1" stroke-linecap="round"/>`;
 return o}
function tumbler(s,dx){const id='kq'+(++_k),c=s.liq;
 const g=`M${dx+3},96 L${dx+41},96 L${dx+39},146 Q${dx+39},148 ${dx+37},148 L${dx+7},148 Q${dx+5},148 ${dx+5},146 Z`;
 let o=`<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade(c,-0.35)}"/><stop offset=".35" stop-color="${shade(c,0.3)}"/><stop offset=".6" stop-color="${c}"/><stop offset="1" stop-color="${shade(c,-0.3)}"/></linearGradient><clipPath id="${id}c"><path d="${g}"/></clipPath></defs>`;
 o+=`<ellipse cx="${dx+22}" cy="149" rx="19" ry="2" fill="#000" opacity=".16"/><g clip-path="url(#${id}c)"><rect x="${dx}" y="122" width="44" height="22" fill="url(#${id})"/><rect x="${dx}" y="121" width="44" height="1.6" fill="${shade(c,0.4)}"/>
 <rect x="${dx+11}" y="110" width="15" height="15" rx="2.5" transform="rotate(-12 ${dx+18} 117)" fill="#fff" fill-opacity=".45" stroke="#fff" stroke-opacity=".8" stroke-width=".6"/><rect x="${dx+23}" y="113" width="12" height="12" rx="2" transform="rotate(14 ${dx+29} 119)" fill="#fff" fill-opacity=".35" stroke="#fff" stroke-opacity=".7" stroke-width=".6"/>
 <rect x="${dx+4}" y="143" width="36" height="5" fill="#fff" opacity=".35"/></g>`;
 o+=`<path d="${g}" fill="#fff" fill-opacity=".1" stroke="#8a938c" stroke-opacity=".6" stroke-width=".7"/><path d="M${dx+8},100 L${dx+9},142" stroke="#fff" stroke-opacity=".65" stroke-width="1.3" stroke-linecap="round"/>`;
 return o}
function whiskySVG(b,kind){const s=b.svg;
 if(kind==='pair')return `<svg viewBox="-4 -4 96 158" xmlns="http://www.w3.org/2000/svg" class="bsvg">${whiskyBottle(s)}${tumbler(s,46)}</svg>`;
 return `<svg viewBox="-6 -4 52 158" xmlns="http://www.w3.org/2000/svg" class="bsvg">${whiskyBottle(s)}</svg>`}
window.HM_WHISKY={items:WHISKIES,groups:WHISKY_GROUPS,types:TG,svg:whiskySVG,
 newSvg:st=>({shape:st.shape||'rd',glass:'cl',label:st.label,accent:st.label2,ink:st.label2==='#ffffff'?'#1d1d1d':st.label2,liq:st.grp==='bourbon'||st.grp==='rye'?'#b0521a':'#c47f28',text:(st.brewery||st.name||'Whisky').slice(0,16),sub:(st.style||'WHISKY').toUpperCase(),age:''})};
window.whiskySVG=whiskySVG;
})();
