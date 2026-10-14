# Databáze investorů: posouzení dvou návrhů a revidovaný plán

Verze 2.0 · 11. října 2026 · Česká republika

**Doporučení:** začít evidencí důkazů a pilotem, který odděleně změří správnost zařazení, správnost údajů, jejich dostupnost a cenu ověření. Počet záznamů nesmí být důležitější než jejich doložitelnost.

Tento dokument je nový realizační plán. Součástí přípravy bylo přečtení zadání, obou dodaných plánů, kontrola jejich vnitřní konzistence a cílené ověření veřejných zdrojů. Nebyl proveden nový investorský pilot ani nezávislý audit všech transakcí uvedených v plánu Claude. Jeho investorům zde nepřidělujeme nové ověřené hodnocení.

**1. Co vyžaduje původní zadání**

Zadání „Spoľahlivá databáza investorov“ požaduje databázi VC, PE, family offices, angelů a velkých soukromých investorů do firem. U každého chce sektory, obvyklý předmět a velikost investice, celkový investiční kapitál a zdroje. Dále požaduje pravidla zařazení a vyřazení, ověření skutečné investiční činnosti, podložený odhad rozsahu a spolehlivosti, pilot s datovanými důkazy, měření přesnosti na ručně ověřené vzorce a náklady celosvětového rozšíření. Používat se mají výhradně veřejná data.

Česká republika je výchozí trh a země pilotu podle uživatelova upřesnění. Globální rozšíření je v této etapě předmětem odhadu, nikoli závazkem nyní sestavit světovou databázi.

Povinné pole s hodnotou „nedohledáno“ je transparentní evidence mezery, ale **není to splněný požadavek na znalost konkrétní částky**. Proto se budou vykazovat dva počty: ověření investoři a investoři s úplným profilem podle zadání. Pokud veřejné zdroje úplný profil neumožní, závěrečná zpráva výslovně uvede rozsah nesplněného požadavku; číslo nebude dopočítávat bez opory.

**2. Posouzení dodaných plánů**

Posuzované dokumenty: `Claude_output_01` a `ChatGPT_output_01.md`, ve verzích dodaných uživatelem.

Claude přináší širší seznam zdrojů a konkrétní seznam kandidátů. ChatGPT lépe odděluje předpoklady od výsledků, rozlišuje typy kapitálu a nepovažuje absenci zpráv automaticky za neaktivitu. Nový plán tyto silné stránky zachovává.

| Zjištění | Kde a proč je problém | Oprava v novém plánu |
|---|---|---|
| Nepodložené měření přesnosti | Claude, „Předběžné měření“: 24/25 = 96 % není doložená precision vůči nezávislé referenci. Řádek Zaka navíc obsahuje žebříček aktivity, nikoli konkrétní transakci. | Oddělit návrh dat, nezávislé ruční posouzení a výpočet metrik. |
| Souhrny neodpovídají tabulce | Claude uvádí tiket u 11/25 záznamů, ale přímo v tabulce je vyplněn u 9/25, tedy 36 %. Označení A je u 10/25, tedy 40 %, nikoli 11/25. To je kontrola dokumentu, ne pravdivosti údajů. | Všechny souhrny generovat z dat; uložit použitý jmenovatel. |
| Vlastní pravidla nejsou důsledně použita | Claude požaduje nedávnou transakci, ale ponechává v pilotu staré či nedatované důkazy. U Inven je A i s uvedenou investicí z března 2024, mimo 24 měsíců k říjnu 2026, a další transakcí bez data. | Investor, aktuálnost důkazu a připravenost k novým investicím budou samostatné atributy. |
| Směšování jednotek a překryvů | Claude přičítá regulované vehikly ke kategoriím VC/PE/FO, přestože se mohou překrývat. Počet účastí v kolech navíc není počet unikátních investorů. | Počítat unikátní organizace a osoby; fondy a účasti vykazovat zvlášť. |
| Nepodložené odhady pokrytí | Claude uvádí procenta pokrytí i bez známého celkového počtu investorů. ChatGPT přiznává nejistotu, ale jeho segmentové intervaly nejsou odvozeny z přepočitatelného modelu. | Použít scénáře počtu kandidátů a úspěšnosti ověření; pokrytí měřit pouze vůči vymezenému veřejnému souboru. |
| Nesrovnatelné hodnoty označené jako konflikt | Claude například srovnává AUM s velikostí nového fondu a cílovou velikost s průběžně získaným kapitálem. Rozdíl sám o sobě není rozpor. | Konflikt vzniká až u stejné entity, metriky, měny a rozhodného období. |
| Zbytečné vyloučení skutečných investorů | Claude vyžaduje u investičních holdingů minoritní podíly a u CVC samostatný vehikl. To může vyřadit investiční skupiny s majoritními akvizicemi či doložené interní CVC týmy. | Rozhoduje investiční činnost a doložený mandát, nikoli minorita nebo právní forma. |
| Příliš široké tolerance údajů | Claude připouští tiket ±25 %, AUM ±10 % a datum ±1 měsíc. To může uznat jako správnou chybně přepsanou částku či datum. | Kontrolovat věrnost zdroji; tolerovat jen vysvětlené zaokrouhlení, převod a původní přesnost data. |
| Výběrové zkreslení pilotu | Claude vybírá známé aktivní fondy. ChatGPT odděluje kalibraci, ale přesně neurčuje náhodný výběr, hraniční testy a jmenovatele. | Samostatná kalibrace, náhodná hodnoticí vzorka a oddělené obtížné případy. |
| Rozpočet nelze plně odvodit | Claude má v realistické variantě položky za 663 tis. EUR; s 15 % jde o 762 450 EUR. Navýšení na 1,2–1,6 mil. EUR není rozpočtově vysvětleno. ChatGPT zahrnuje vyřazené kandidáty jen souhrnně do času na záznam. | Otevřený vzorec pro prověření, doplnění, vyřazení, kontrolu a přípravu. |
| Neveřejná reference | Claude doporučuje placenou databázi pro recall, což není slučitelné se zvoleným režimem výhradně veřejných podkladů. | Stejná podmínka veřejnosti platí i pro testovací referenci. |
| Neúplné splnění požadavku na kapitál | Oba plány správně připouštějí chybějící údaje, ale musí jasněji odlišit úplný profil od ověřené identity investora. | Samostatný přehled úplnosti a mezí splnitelnosti zadání. |

Claudeho 25 řádků lze použít jako seznam podnětů k rešerši. Převzít jejich známky A/B/C nebo souhrnné výsledky jako validované by nebylo správné. Samotné nesrovnalosti v dokumentu také neznamenají, že uvedení investoři ve skutečnosti neinvestují.

**3. Rozsah a jednotka databáze**

Základ tvoří investoři přímo investující do neveřejných provozních firem: kapitálové vstupy, nákup podílů včetně majoritních odkupů a konvertibilní financování. To je pracovní vymezení podle kategorií uvedených v zadání. Čistě úvěrové strategie, burzovní investování a držba nemovitostí budou označeny jako mimo základní rozsah; smíšeného investora nevyloučíme, pokud má doloženou relevantní strategii. Investice do provozní realitně-technologické firmy se posoudí podle činnosti cílové firmy, nikoli pouze názvu sektoru.

Geografické příznaky budou nezávislé:

- **Působí z ČR:** doložené sídlo nebo investiční tým v ČR.
- **Investoval do české firmy:** cílová právnická osoba má české IČO; investiční vazba je doložena.
- **Má výslovný mandát pro ČR:** přímé vyjádření českého zaměření, i když česká transakce zatím doložena není.
- **Česká zakladatelská vazba:** zahraniční firma s českými zakladateli; doplňkový příznak, který nenahrazuje české sídlo.

Pro český základ musí platit alespoň jeden z prvních tří příznaků. Obecné „Europe/CEE“ bez dalšího důkazu nestačí. Zahraniční investor musí mít doloženou skutečnou investici alespoň někde; pouhý mandát nestačí.

Budou odděleny organizace, fyzické osoby, právní entity, fondy a jednotlivé investiční účasti. Jedna organizace se třemi fondy se započítá jednou do počtu organizací a třikrát do počtu fondů. Osoba stojící za holdingem bude mít vazbu na holding, ale jako samostatný investor se započítá jen při doloženém samostatném osobním investování. Společná adresa nebo doména bude signál k prověření, nikoli automatické sloučení.

Klasifikace bude mít dvě osy: **forma investora** (institucionální správce, family office, soukromá investiční skupina, CVC tým, osoba) a **strategie** (VC, growth, buyout, další). Family office může investovat strategií VC; obě informace se uchovají bez dvojího započítání.

U „velkého soukromého investora“ použijeme pro pilot pracovní příznak doložené vlastní jednotlivé investice alespoň 10 mil. Kč. Jde o projektovou konvenci. Neznámá částka nevyřadí doloženého soukromého investora; velikost zůstane neurčená. Nepoužijeme celkovou velikost kola ani odhad osobního jmění.

**4. Rozhodovací pravidla a důkazy**

Záznam lze označit za ověřeného investora, pouze když je vyřešena identita, česká relevance, skutečně realizovaná relevantní investice a klasifikace. Každé rozhodnutí musí mít důvod a zdroj.

| Stav | Pravidlo |
|---|---|
| Ověřený investor | Splňuje všechny základní podmínky a níže uvedený standard transakčního důkazu. |
| Kandidát – nedořešeno | Chybí rozhodující důkaz, datum nebo vazba mezi značkou a entitou; další rešerše může pomoci. |
| Mimo rozsah | Důkazy potvrzují např. pouze poradenství, investice do fondů nebo čistě nemovitostní strategii. |
| Historický / zaniklý | Historické investice uchováme; zánik označíme jen podle konkrétního důkazu. |

Přijatelným transakčním důkazem je buď veřejná účetní/výroční zpráva či dokument přímo dokládající relevantní investici, nebo konkrétní oznámení realizované investice doplněné druhým potvrzením od jiného původce. Potvrzení investora a financované firmy zaznamenáme jako dvě zúčastněné strany, nikoli jako nezávislý audit. Jediné vlastní marketingové tvrzení ponechá případ k dořešení.

U každého důkazu se kontroluje investor, cílová firma, povaha účasti a stav transakce. Záměr, podpis nezavršené akvizice, fundraising fondu nebo závazek LP do fondu není dokončenou investicí fondu do firmy. Zápis osoby jako společníka sám nerozliší investora od zakladatele či zaměstnance.

Katalogy, členské seznamy, portfoliová loga bez dalšího kontextu a agregátory slouží k vyhledání kandidátů. Převzaté tiskové zprávy patří k jedné zdrojové události. Registrace ani členství nepřidají automaticky vyšší důvěryhodnost transakci. Zápis podle § 15 ZISIF má evidenční, nikoli licenční charakter. [ČNB](https://www.cnb.cz/cs/dohled-financni-trh/vykon-dohledu/upozorneni-pro-verejnost/Upozorneni-Ceske-narodni-banky-na-rizika-nabizeni-investicnich-prilezitosti-osob-podle-15-ZISIF/)

Nedávná doložená aktivita bude pomocný filtr posledních 36 měsíců. Absence takového důkazu znamená „současná aktivita nepotvrzena“, nikoli „neinvestuje“. Ochota přijímat nové projekty, stav investičního období fondu a existence organizace se posuzují samostatně. U pilotu ukážeme, kolik záznamů by prošlo také filtrem 24 měsíců.

**5. Údaje a zacházení s kapitálem**

| Oblast | Povinně evidovaný obsah |
|---|---|
| Identita | Interní ID, značka, aliasy, právní název, IČO/registrační číslo, země, web a vazby na fondy |
| Profil | Forma investora, strategie, sektory, fáze firem, geografie a nástroje |
| Obvyklá investice | Minimum/maximum nebo bodová hodnota, měna, první/následná investice, na firmu/na kolo, deklarace či výpočet |
| Kapitál | Hodnota, měna, metrika, subjekt/fond, rozhodné datum, omezení použitelnosti |
| Transakce | Investor, cílová firma, nástroj, realizováno/ohlášeno, datum a jeho přesnost, vlastní podíl či celé kolo |
| Důkaz | ID tvrzení, pole, hodnota, URL, vydavatel, krátký relevantní výňatek, datum publikace, události a kontroly |
| Kontrola | Autor extrakce, kontrolor, verdikt, důvod, změny, čas práce a další kontrola |

Každé věcné pole má vlastní zdroj. Jeden odkaz na úvodní stránku investora nedokládá celý profil.

Kapitál se uloží jako typovaná hodnota: AUM celé organizace, NAV, získané závazky konkrétního fondu, cílová velikost, kumulativně investované prostředky nebo zbývající dostupný kapitál. Tyto veličiny se nezaměňují. U správce s neznámým celkovým kapitálem lze zobrazit známé velikosti jednotlivých fondů, ale nesmí se vydávat za ověřené AUM správce. Historické fondy se nesčítají na dnešní dostupný kapitál.

Rozpětí obvyklé investice přebíráme přednostně z aktuální strategie investora. Zveřejněné jednotlivé transakce zobrazujeme zvlášť. Pokud se později počítá pozorovaný medián, musí být známé vlastní příspěvky investora, počet pozorování i období; nebude označen za jeho deklarovaný obvyklý tiket.

Stavy pole: **doloženo**, **nedohledáno po předepsané rešerši**, **výslovně nezveřejněno**, **rozpor**, **nevztahuje se**. Nula není náhrada chybějící hodnoty. „Nezveřejněno“ použijeme pouze tehdy, pokud to zdroj výslovně říká; samotný neúspěch hledání takový závěr neumožňuje.

Nejdříve porovnáme subjekt, definici a datum; až potom řešíme rozpor. Autorita zdroje závisí na poli: registr pro právní identitu, aktuální strategie pro deklarované investiční rozpětí, příslušná zpráva pro konkrétní kapitálovou metriku. Neplatí univerzální pravidlo, že starý úřední dokument přebije novější informaci o jiné skutečnosti.

**6. Zdroje pro českou realizaci**

| Zdroj | Úloha v projektu |
|---|---|
| [CVCA](https://cvca.cz/clenstvi/) | Kandidáti VC/PE a profesní profily; rozlišit řádné investory a přidružené poskytovatele služeb. |
| [CzechStartups](https://czechstartups.gov.cz/startup-ekosystem/investori/) | Další kandidáti včetně CVC a angel prostředí; filtrovat asociace a platformy. |
| [CBAA](https://www.cbaa.cz/clenstvi/) | Veřejné informace o českém angel prostředí; členství samo není transakční důkaz. |
| [NRB/NRI – příklad oznámení výběru fondu](https://www.nrb.cz/nri-dokoncila-vyber-venture-kapitaloveho-fondu-pro-program-fond-ukrajina/) | Vyhledání fondů a doložení podpory; oddělit financování fondu od jeho investování do firem. |
| [EIF – český RRF fond fondů](https://www.eif.org/equity-products/all/rrf-czech-republic) | Český program a podklad pro hledání správců. EIF na stránce výslovně odlišuje fond fondů od přímých investic do startupů. |
| [ARES](https://ares.gov.cz/ekonomicke-subjekty) a [Veřejný rejstřík](https://www.or.justice.cz/ias/ui/rejstrik) | Identita, vazby a dostupné listiny; obchodní značka nemusí být právní název fondu. |
| [ČNB – seznamy a evidence](https://www.cnb.cz/cs/dohled-financni-trh/seznamy/) | Příslušný regulatorní status; nemá být hlavním filtrem pro skutečné investování. |
| Web investora a financované firmy, veřejné zprávy | Hlavní podklady pro strategii, kapitál a konkrétní realizované investice. |
| Veřejné české zprávy o transakcích | Doplňkové hledání a potvrzení; vždy uložit konkrétní článek, ne jen rubriku či tag. |

Zahraniční zdroj se použije, pokud dokládá investora relevantního pro ČR. Anglický jazyk zdroje nevadí. Veřejné náhledy komerčních databází mohou pomoci s vyhledáním, ale žádné pole ani test nebude záviset na neveřejném obsahu.

Evidence skutečných majitelů není součástí povinného veřejného postupu: ministerstvo uvádí znepřístupnění veřejnosti od 17. 12. 2025. Neprokázanou rodinnou vlastnickou vazbu nenahradíme domněnkou. [Ministerstvo spravedlnosti](https://esm.justice.cz/ias/issm/rejstrik)

U fyzických osob shromažďujeme profesní investorské údaje potřebné pro účel databáze. Před jejich systematickým zpracováním správce projektu určí právní důvod a odpovídající informační postup; automaticky se nepředpokládá, že veřejnost údajů nebo obecný „opt-out“ vše řeší. ÚOOÚ uvádí, že i pro zveřejněné osobní údaje platí požadavek právního důvodu a další povinnosti. [ÚOOÚ](https://uoou.gov.cz/verejnost/qa-otazky-a-odpovedi/zpracovani-udaju-na-internetu)

**7. Kolik investorů lze očekávat**

Při kontrole 11. 10. 2026 obsahovala [anglická stránka řádných členů CVCA](https://cvca.cz/en/category/full-members/) 27 profilových položek včetně čestného člena a [CzechStartups](https://czechstartups.gov.cz/startup-ekosystem/investori/) 52 položek. To je **79 výskytů v katalozích**, nikoli 79 unikátních ověřených investorů. V této etapě jde o orientaci rozsahu; deduplikace i rozhodnutí o zařazení teprve proběhnou.

Pro první českou verzi použijeme přepočitatelný kapacitní odhad:

| Scénář | Unikátní kandidáti po rozšíření rešerše | Předpokládaná úspěšnost ověření | Ověření investoři |
|---|---:|---:|---:|
| Úzký | 120 | 50 % | 60 |
| Střední | 170 | 60 % | 102 |
| Širší | 220 | 70 % | 154 |

**Pracovní výhled je přibližně 60–155 investorů pro první veřejně doloženou verzi**, nikoli odhad všech investorů v ČR. Počty 120–220 i úspěšnost 50–70 % jsou rozpočtové předpoklady: dva katalogy potvrzují existenci desítek kandidátů, další kandidáty má přinést transakční rešerše, PE, family offices a jednotlivci. Výchozí katalogy samy tento širší počet nedokazují. Jde o podmíněný odhad s nízkou jistotou, který nahradí výsledky první inventury a pilotu.

Před spuštěním hlavního sběru vznikne seznam kandidátů s původem a překryvy. Po každé dávce 20 nových kandidátů se změří podíl přijatých a náklady. Po vyčerpání plánovaných zdrojů a dvou dávkách s méně než 10 % nových způsobilých investorů lze uzavřít první vydání; tento pracovní limit není důkazem úplnosti trhu. Segmenty s malým pokrytím uvedeme zvlášť.

Očekáváme nejlepší doložitelnost identity a transakcí u veřejně vystupujících fondů. Kapitál jednotlivců a family offices bude pravděpodobně nejméně dostupný. Chybějící kapitál však nesnižuje automaticky důvěru v dobře doloženou investici. Procenta správnosti a úplnosti se před pilotem nebudou prezentovat jako výsledky.

**8. Pilot a měření kvality**

Pilotní rámec: unikátní kandidáti VC relevantní pro ČR, nalezení ve veřejných seznamech a českých transakčních zprávách. Rámec, datum uzávěrky a pravidla se uloží před hodnoticím výběrem.

Navržený rozsah je **60 různých kandidátů**:

1. **10 pro kalibraci:** odladění definic, formuláře a času rešerše. Jejich výsledky se nezapočítají do hlavního testu.
2. **40 náhodně vybraných ze zbývajícího rámce:** hlavní test; uložit losování a identifikátory, vybírat před znalostí konečného verdiktu.
3. **10 obtížných případů mimo předchozí skupiny:** poradce, fond bez první investice, přejmenování, nerozlišený fond/správce, historická aktivita, CVC, nesprávně připsaná transakce. Výsledky vykázat samostatně, aby jejich záměrný výběr nezkresloval celkový odhad.

Je-li rámec menší, provede se kontrola všech dostupných případů, bez umělého doplňování počtu. Počet kandidátů není závazek dodat stejný počet ověřených investorů. Pokud hlavní test obsahuje méně než 25 přijatých záznamů, bude označen za slabý podklad pro odhad precision a doporučí se dodatečná náhodná dávka; její náklady budou připočteny.

Analytik A provede sběr a uloží původní rozhodnutí i hodnoty. Kontrolor B všech 50 hodnoticích případů ručně posoudí bez přístupu k závěrům A, vlastním hledáním v rámci stejných veřejných podmínek. Neshody se vyřeší společným doloženým posouzením, případně třetím odborníkem. Původní verze A se nepřepíše před výpočtem. Dvě odpovědi stejného AI modelu se nevydávají za nezávislou lidskou kontrolu.

| Metrika | Přesná interpretace |
|---|---|
| Precision zařazení | TP / (TP + FP) mezi přijatými kandidáty hlavního testu |
| Záchyt v rámce testu | TP / (TP + FN) vůči způsobilým případům určeným ruční kontrolou |
| Správnost klasifikace | Shoda formy a strategie u potvrzených investorů |
| Správnost jednotlivých polí | Správné nenulové hodnoty / všechny hodnocené nenulové hodnoty daného pole |
| Dostupnost pole | Ověřené použitelné hodnoty / přijatí investoři, pro které je pole relevantní |
| Úplný profil | Počet investorů s doloženými všemi požadovanými obsahovými údaji včetně příslušného celkového kapitálu |
| Náročnost | Minuty prověření, doplnění, vyřazení a kontroly zvlášť; také čas na jeden publikovaný profil |

Přijatý záznam, který ani referenční kontrola nedokáže doložit, se v konzervativní precision započítá jako chyba. U nedořešených vyřazených případů uvedeme počet a rozpětí záchytu podle možné způsobilosti; nesmí tiše zmizet ze souhrnu. U každé metriky budou absolutní počty a u precision také 95% Wilsonův interval. Při nulovém jmenovateli bude „nelze vyhodnotit“.

Kontrola hodnot vyžaduje shodnou metriku a entitu, částku věrnou zdroji a datum v původní přesnosti. Zdroj uvádějící jen rok se nezmění na vymyšlený den. Kurzový přepočet má vlastní zdroj a datum. Neužijí se plošné tolerance ±25 %.

Pracovní cíl procesu je alespoň 95% bodová precision před opravami, bez zjištěné systémové záměny identity nebo metrik. Malý pilot tento cíl nemůže statisticky garantovat pro celý trh; například 30 správných případů ze 30 má dolní mez dvoustranného 95% Wilsonova intervalu přibližně 88,6 %. U obtížných případů se vyhodnotí jednotlivé chyby samostatně.

Před zveřejněním musí mít každý přijatý záznam základní důkazy a všechny zjištěné chyby musí být opraveny nebo případ vyřazen do nedořešených. Pokud se zjistí systémová chyba, metodika se upraví a ověří na nové vzorce; opravený původní soubor není nový nezávislý test.

Pro ověření přenositelnosti přidáme 10 průzkumných případů mimo VC: 3 PE, 3 family office / soukromé skupiny a 4 osoby. Budou sloužit k odhadu dostupnosti a pracnosti, nikoli k samostatným přesným procentům kvality těchto segmentů.

**9. Realizace, rozpočet pilotu a předání**

Pro pilot postačí propojené tabulky a evidence zdrojů. Vývoj vlastní aplikace, plošných sběračů a globálních konektorů se zahájí až podle výsledků. Automatizace může pomoci s návrhem extrakce a kontrolou struktury; žádný údaj bez zdroje nepřechází do ověřené vrstvy.

| Fáze | Výstup a odpovědnost | Člověkohodiny |
|---|---|---:|
| Pravidla a datový slovník | Vedoucí projektu: rozsah, definice, standard důkazů | 8–12 |
| Inventura zdrojů a kandidátů | Analytik: rámec, deduplikace, příznaky původu | 10–16 |
| Kalibrace 10 případů | Analytik + kontrolor: uzavřená metodika | 6–10 |
| Sběr 50 hodnoticích případů | Analytik: hodnoty, důkazy, časový deník | 24–36 |
| Nezávislé ruční posouzení | Kontrolor: reference, neshody a opravy | 18–26 |
| 10 případů dalších segmentů | Analytik: průzkum dostupnosti a pracnosti | 8–12 |
| Vyhodnocení a předání | Vedoucí: metriky, mezery, přepočtený rozpočet | 4–8 |
| **Celkem** | **70 kandidátů včetně kalibrace a průzkumu** | **78–120** |

Kalendářně plánovat přibližně tři pracovní týdny při dostupnosti analytika a samostatného kontrolora. Časové odhady jsou předběžné; složité případy mohou zůstat nedořešené. Po kalibraci se rozpočet přepočítá podle skutečně změřené pracnosti.

Při modelové sazbě 800 Kč/h činí práce 62 400–96 000 Kč. Po 20% rezervě 74 880–115 200 Kč. S plánovací položkou 0–5 000 Kč na nástroje je celkem přibližně **75–120 tisíc Kč bez DPH**. Nejde o nabídku tržní ceny. Model nezahrnuje vlastní aplikaci ani případné externí právní stanovisko; koordinace je v přípravě a vyhodnocení.

Předají se: metodika, datový slovník, všichni kandidáti a rozhodnutí, investoři/fondy/transakce, důkazy, zmrazené výsledky před kontrolou, lidská reference, opravené vydání, zpráva o kvalitě a propočty nákladů. Formát XLSX/CSV pro data a čitelný dokument pro metodiku; není nutné vyvíjet web.

Přejímka vyžaduje: žádné nevysvětlené duplicity; u každého ověřeného investora identitu, českou relevanci a datovaný důkaz investice; u každé částky význam a zdroj; reprodukovatelné metriky; samostatný seznam chybějících požadavků včetně kapitálu. Pokud úplnost kapitálu neumožňuje původní požadavek splnit, předání to výslovně označí jako omezení, nikoli jako úplné splnění.

**10. Rozšíření v ČR a aktualizace**

Po pilotu se doplní PE, family offices, soukromé skupiny a osoby. Každý nový segment začne malou kalibrací a vlastním měřením náročnosti. Výsledky VC se na ostatní kategorie nepřevezmou bez kontroly.

První české vydání bude uzavřeno seznamem skutečně prohledaných zdrojů a datem. Měsíčně se zpracují nové transakční podněty; čtvrtletně se zkontrolují změny mandátu a rozpětí investic; alespoň ročně identita, kapitál a neaktuální důkazy. U každého pole bude datum posledního ověření. Zánik zdrojového odkazu spustí kontrolu, nikoli automatické vymazání historicky doložené investice.

Zdroje se ukládají s krátkým relevantním výňatkem, případně povolenou kopií dokumentu a jeho verzí. Veřejná dostupnost se neztotožňuje s neomezeným právem hromadně přebírat celý obsah.

**11. Celosvětové rozšíření: transparentní nákladový model**

Přesný celosvětový počet veřejně ověřitelných investorů nyní neznáme. Počty fondů, správců, rodinných kanceláří a osob z odlišných databází nelze prostě sčítat. „Celý svět“ proto musí znamenat výslovně vymezené země, segmenty, veřejné zdroje a datum vydání; úplnost neveřejného trhu nelze slíbit.

Pro každou zemi a segment změříme:

- K: počet prověřených kandidátů; p: podíl přijatých; N = K × p.
- s: čas základního prověření každého kandidáta.
- e: čas doplnění přijatého profilu.
- r: dodatečný čas na rozhodnutí o vyřazení/nedořešení.
- q: čas kontroly přijatého profilu.
- H: příprava zdrojů, konektorů, jazykových postupů a řízení.

**Hodiny = K × s + N × e + (K − N) × r + N × q + H.** Náklady se dopočítají z hodin a sazeb, samostatných nástrojů a explicitní rezervy. Čas kontroly vyřazených se zahrne do r; pilotní nezávislé hodnocení celé vzorky se rozpočtuje zvlášť.

Ilustrační nižší pracnost: p = 0,60; s = 0,15 h; e = 0,45 h; r = 0,10 h; q = 0,25 h, přibližně 1,02 h na publikovaný profil. Vyšší pracnost: p = 0,40; s = 0,25 h; e = 0,75 h; r = 0,25 h; q = 0,50 h, tedy 2,25 h na profil. Jde o předpoklady, nikoli změřené výkony.

| Kapacitní scénář | Publikované profily | Příprava H | Práce s 25% rezervou při 800 Kč/h |
|---|---:|---:|---:|
| První mezinárodní etapa | 1 000 | 200–400 h | 1,22–2,65 mil. Kč |
| Širší mezinárodní pokrytí | 10 000 | 800–1 600 h | 11,0–24,1 mil. Kč |
| Rozsáhlé globální pokrytí | 40 000 | 1 600–3 200 h | 42,4–93,2 mil. Kč |

Tabulka používá zaokrouhlených 1,02–2,25 h na profil. Počty jsou velikosti dodávky, nikoli odhady počtu investorů na světě. Rozpočty nezahrnují DPH, hosting aplikace, externí právní služby ani nástroje pro zpracování; ty se před závazným rozpočtem doplní jako konkrétní položky. Nezahrnují nákup neveřejných dat. Náročné jazyky, nízká výtěžnost a komplikované struktury mohou horní hranici zvýšit.

Globální náklad na požadovaný rozsah se následně vypočte jako součet zemí a segmentů; pro každou novou skupinu zemí nejprve ověříme přibližně 30–50 kandidátů a upravíme sazby a časy. České zdroje jsou základem české etapy; globální etapa bude vyžadovat místní veřejné zdroje, jejichž výběr není součástí nynější české rešerše.

Údržba se nebude určovat jen procentem původního rozpočtu. Příklad pro 10 000 profilů: roční úplná kontrola po 0,25 h = 2 500 h; změny u 20 % profilů po 0,5 h = 1 000 h; provoz a úpravy zdrojů 300–600 h. Celkem 3 800–4 100 h, při 800 Kč/h a 25% rezervě **3,8–4,1 mil. Kč ročně**, plus nástroje a nové profily. Jde o ilustraci režimu, kterou nahradí změřená aktualizační náročnost.

**12. Co má vzniknout jako první**

První pracovní balíček tvoří datový slovník, seznam zdrojů a deduplikovaný rámec kandidátů. Následuje kalibrace 10 případů a přepočet pracnosti. Teprve potom se spustí zmrazený hodnoticí pilot. Rozhodnutí o větším sběru bude vycházet ze tří oddělených výsledků: kolik skutečných investorů lze doložit, kolik má všechny požadované informace a kolik stojí jejich vytvoření a udržování.
