# Spolehlivá databáze investorů v ČR: plán, pravidla, zdroje, pilot na VC fondech a odhad nákladů na globální rozšíření

Spolehlivou databázi investorů v ČR lze z veřejných dat postavit, ale jen pro regulované a mediálně viditelné investory. Realisticky jde o zhruba 350–600 ověřených záznamů v ČR: asi 60–90 aktivních VC investorů, 40–70 PE investorů, 150–300 investičních vehiklů z registru ČNB se skutečnou investicí do firem, 20–40 family office a 50–150 veřejně vystupujících andělů. Spolehlivost je vysoká (A) u fondů s registrací u ČNB nebo v CVCA, kde je doložená transakce. U family office a andělů je nízká až střední (C), protože jejich kapitál (AUM) zpravidla veřejně dostupný není. Klíčovým filtrem proti „náhodným firmám“ je pravidlo „žádná doložená investice za 24 měsíců, žádný záznam“. Samotná registrace, název s „investicí“ nebo „fond“ v názvu nestačí.

## TL;DR

- **Kdo v databázi bude:** jen subjekt, který má alespoň jednu doloženou investici do firmy (konkrétní cílová firma, zdroj, datum) za posledních 24 měsíců a navíc buď registraci (ČNB/ESMA/EIF/NRI), nebo veřejně deklarovanou investiční strategii. Holdingy, M&A poradci, crowdfundingové platformy, banky, retailoví správci a realitní fondy se vyřazují. CVC a akcelerátory se zařazují jen s vlastním kapitálem a doloženými tikety.
- **Kolik a jak spolehlivě:** ČNB ke konci roku 2025 evidovala 55 investičních společností, 360 investičních fondů s právní osobností, 326 podfondů a 412 správců dle § 15 ZISIF.\[1\] Drtivá většina z nich ale do startupů ani do firem v PE smyslu neinvestuje. Reálné jádro trhu tvoří zhruba 100 VC investic ročně (Ambit)\[2\] a databáze CzechCrunch se „100+ startupovými investory“. Přesnost záznamů u VC/PE v pilotu dosahuje ~90 %, úplnost AUM jen ~60–70 %.
- **Svět:** realistický rozsah je 40–60 tisíc institucionálních investorů (VC + PE + FO). Pro orientaci: NVCA uvádí 2 984 VC firem jen v USA, Deloitte 8 030 single family office globálně a Preqin pokrývá 31 653 aktivních PE firem. Realistický scénář vyjde na ~1,2–1,6 mil. EUR (30–40 mil. Kč) za první vybudování a ~0,4–0,6 mil. EUR ročně za údržbu. Placené datové zdroje by sice snížily práci, ale porušily by podmínku „jen veřejná data“.

## Key Findings

1. **Registry ČNB jsou nutné, ale ne dostatečné.** Statistika ČNB eviduje ke konci listopadu 2025 1 025 rezidentských investičních fondů. Z toho je 172 nemovitostních a 534 „ostatních“, akciových je jen 123.\[3\] Registrace dokládá, že subjekt existuje a je regulovaný. Nedokládá ale, že investuje do firem. Většina FKI jsou realitní, dluhopisové nebo „wealth“ vehikly.
2. **Správci podle § 15 ZISIF jsou rizikovou skupinou.** ČNB nad nimi nevykonává dohled.\[4\] Podle ČNB „není zákonem oprávněna zkoumat pravdivost nebo přesnost předložených informací“.\[5\] V roce 2025 jich ČNB 27 sankčně vymazala.\[1\] Zápis v tomto seznamu proto nikdy nesmí sám o sobě znamenat stupeň jistoty A.
3. **Pro VC je nejlepší referenční množinou kombinace CVCA + CzechCrunch + Ambit + NRI/EIF.** CVCA zveřejňuje u řádných členů velikost fondů, preferovaný tiket, sektory a portfolio. Data jsou ale často zastaralá: u Credo Ventures CVCA stále uvádí „Volume of Funds Managed EUR 170 million“, přestože podle Vestbee (24. 3. 2026) Credo uzavřelo pátý fond Credo Stage 5 na 88 mil. USD, z něhož plánuje investovat 1–5 mil. USD do zhruba 30 firem (7–8 nových investic ročně).
4. **Evidence skutečných majitelů je veřejnosti nepřístupná.** Ministerstvo spravedlnosti ji podle esm.justice.cz „dne 17. prosince 2025 znepřístupnilo… veřejnosti“ v reakci na rozhodnutí Nejvyššího soudu (27 Cdo 1368/2024, 27 Cdo 1548/2024) a Nejvyššího správního soudu (4 As 219/2024, 1 Afs 193/2024). To zásadně omezuje ověřování vlastnických struktur family office a holdingů z veřejných dat.
5. **U family office a andělů není AUM veřejně dostupné.** Pole „celkový kapitál“ bude u nich převážně prázdné nebo jen odhadnuté (stupeň C). To je potřeba přiznat, ne zakrývat.

## 1) Definice a datový model

### Definice kategorií

| Kategorie | Pracovní definice pro databázi | Typický doklad |
|---|---|---|
| **VC fond** | Profesionálně řízený fond nebo správce investující vlastní či svěřený kapitál do minoritních podílů v rané až růstové fázi (pre-seed až Series B+) inovativních firem s exitovou strategií | Registrace (ČNB/ESMA/lux. regulace), web se strategií, doložené investiční kolo |
| **Private equity** | Fond nebo správce investující do zavedených neveřejných firem, typicky majoritně (buyout, MBO/MBI, growth, konsolidace) | Člen CVCA, Invest Europe, výroční zpráva, akvizice v OR |
| **Family office (SFO/MFO)** | Struktura spravující majetek jedné rodiny (SFO) nebo několika rodin (MFO), která přímo investuje do firem nebo do fondů\[6\] | Veřejně oznámená investice (média, OR), vlastní web |
| **Business angel** | Fyzická osoba investující vlastní peníze do raných firem,\[7\] která **veřejně vystupuje** jako investor\[8\] | Mediálně doložená investice, členství v CBAA nebo klubu, vlastní veřejné prohlášení |
| **Velký soukromý investor** | Fyzická osoba nebo její investiční holding s opakovanými přímými investicemi do firem nad 1 mil. EUR (např. osoby z žebříčků Forbes s investičním vehiklem) | Doložené transakce v médiích a OR, investiční vehikl s veřejnou strategií |
| **CVC (doplňková kategorie)** | Samostatný vehikl korporace nebo banky s investičním mandátem (např. Inven Capital ze skupiny ČEZ)\[9\] | Jako u VC |

### Povinná pole záznamu

| Pole | Popis | Povinné | Zdroj / poznámka |
|---|---|---|---|
| `id`, `nazev`, `aliasy` | Obchodní název, značka a právní entity (fond, správce, GP) | Ano | Web, OR |
| `ico` / zahraniční reg. č. | IČO správce i fondu (často odlišné) | Ano, pokud existuje | ARES API |
| `typ_investora` | VC / PE / FO / angel / velký soukromý / CVC | Ano | Klasifikace dle pravidel níže |
| `regulace` | ČNB (IS, SICAV, FKI, § 15), EuVECA, lux. AIFM, bez regulace | Ano | JERRS ČNB, ESMA |
| `sektory` | Kontrolovaný slovník (SaaS, fintech, deeptech, cleantech, healthtech, průmysl…) | Ano | Web, CVCA |
| `faze` | pre-seed / seed / A / B+ / growth / buyout | Ano | Web, CVCA, transakce |
| `tiket_min`, `tiket_max`, `mena` | Typický tiket | Ano (může být „neuvedeno“) | Web, CVCA, média |
| `kapital_typ` + `kapital_hodnota` | AUM / velikost fondu / cílová velikost / first close | Ano (může být „neveřejné“) | Tiskové zprávy, výroční zprávy, Sbírka listin |
| `geografie` | Cílové regiony | Ano | Web |
| `doklad_investice[]` | Cílová firma, kolo, částka, datum, role (lead/co), URL zdroje, datum publikace | **Ano, min. 1 ≤ 24 měsíců** | Média, tiskové zprávy, OR |
| `zdroj_pole[]` | Pro každé pole: URL, název zdroje, datum zdroje, datum ověření | Ano | — |
| `jistota_pole` + `jistota_zaznam` | A/B/C (viz kap. 4) | Ano | — |
| `stav` | aktivní / neaktivní (>24 měs. bez investice) / zaniklý / v likvidaci | Ano | OR, ARES |
| `posledni_overeni` | Datum | Ano | — |

Doporučení: držet oddělené entity **správce (GP/management company)** a **fond (vehikl)** a propojit je vazbou. Příklad: DEPO Ventures, s.r.o. jako správce\[10\] a DEPO Ventures One SCSp jako lucemburský fond.\[11\] Jinak vznikají duplicity a chybná AUM.

## 2) Pravidla zařazení a vyřazení

### Zařazení (všechna tři kritéria musí platit)

1. **Investiční aktivita:** alespoň 1 doložená investice do konkrétní firmy za posledních 24 měsíců (u PE a FO 36 měsíců, protože transakcí je méně). Doklad musí obsahovat název cílové firmy, datum a ověřitelný zdroj.
2. **Identita:** dohledatelná právní entita (IČO nebo zahraniční registrační číslo) nebo, u fyzické osoby, veřejný investorský profil.
3. **Investiční mandát:** veřejně deklarovaná strategie (web, statut, CVCA profil) **nebo** registrace jako investiční fond či správce (ČNB, ESMA EuVECA, zahraniční AIFM) **nebo** opakované investice (≥ 2 doložené).

### Rozhodnutí pro hraniční skupiny

| Skupina | Rozhodnutí | Zdůvodnění |
|---|---|---|
| Holdingy bez investiční činnosti | **Vyřadit** | Nemají mandát ani opakované investice. Zařadit jen tehdy, pokud mají ≥ 2 doložené minoritní investice a deklarovanou strategii (pak jako „velký soukromý investor“) |
| Poradci, M&A boutique, advokátní kanceláře | **Vyřadit** | Investice zprostředkovávají, samy neinvestují. Typicky jde o přidružené členy CVCA (např. BDO, KSB, PKF APOGEO, TMF)\[12\] |
| Crowdfundingové platformy | **Vyřadit jako investora** | Jsou zprostředkovatelem a kapitál patří davu. Výjimkou je samostatný fond platformy s vlastním kapitálem, který se eviduje zvlášť |
| CVC | **Zařadit jako „CVC“** | Jen samostatný vehikl s mandátem a doloženými investicemi (Inven Capital, Seed Starter ČS). Ad hoc akvizice korporací ne |
| Banky | **Vyřadit** | Výjimkou je jejich VC/PE vehikl jako CVC. Banka jako LP fondu není přímý investor do firem |
| Správci retailových fondů (UCITS, podílové fondy) | **Vyřadit** | Investují do kotovaných cenných papírů, ne do soukromých firem. Výjimkou je jejich samostatný VC fond (např. J&T Ventures I OPF v rámci J&T IS)\[13\] |
| Realitní fondy | **Vyřadit** | Investují do nemovitostí, ne do firem. Zadání se týká investorů do firem |
| Neaktivní a zaniklé subjekty | **Přesunout do archivu** | Více než 24 (u PE 36) měsíců bez investice, likvidace, výmaz z OR nebo seznamu ČNB |
| Startupy samotné | **Vyřadit** | Častá chyba scrapingu (firma „XY Ventures s.r.o.“, která je ve skutečnosti produktová firma) |
| Akcelerátory | **Bez vlastního kapitálu vyřadit, s kapitálem zařadit** | Např. Czech Founders VC nabízí v akceleraci investici ~1 mil. Kč, proto se zařazuje\[14\] |
| Fondy fondů (NRI, EIF) | **Zařadit jako „LP/fond fondů“, oddělená tabulka** | Do firem neinvestují přímo, ale jsou nejlepším zdrojem pro objevování VC fondů\[15\]\[16\] |
| Nový fond bez první investice | **Watchlist, ne hlavní databáze** | Např. IP Lab Ventures Fund I: EIF oznámil ~27 mil. EUR, ale investice zatím nejsou doložené\[17\] |

### Zvláštní pravidla pro fyzické osoby (angel investoři, velcí soukromí investoři)

- **Právní titul:** oprávněný zájem (čl. 6 odst. 1 písm. f GDPR) s provedeným balančním testem. Zpracovávají se jen údaje, které osoba **sama zveřejnila v roli investora** (rozhovory, tiskové zprávy, vlastní web, veřejný LinkedIn profil, členství v CBAA).
- **Minimalizace:** jméno, investorská role, sektory, doložené investice a veřejně uvedený tiket. **Nezpracovávat** rok narození, bydliště, rodinné vazby ani odhad osobního jmění, pokud ho osoba sama nezveřejnila.
- **Transparentnost:** informační povinnost dle čl. 14 GDPR (např. e-mail nebo veřejné oznámení), právo námitky a výmazu. Do 30 dní umožnit opt-out.
- **Jen veřejně vystupující investoři:** anděl, o kterém víme jen z neveřejných zdrojů nebo z OR jako o společníkovi startupu, **se nezařazuje**. Společník v OR není nutně investor; může jít o zakladatele nebo zaměstnance.

## 3) Mapa českých veřejných zdrojů

| Zdroj | Co obsahuje | Aktuálnost | Spolehlivost | Pokrytí pro účel | Přístup |
|---|---|---|---|---|---|
| **ČNB – JERRS (seznamy regulovaných subjektů)** | Investiční společnosti, investiční fondy, podfondy, FKI, osoby dle § 15 ZISIF, depozitáři\[5\]\[18\] | Průběžně | Vysoká pro existenci. U § 15 jen evidenční\[4\]\[19\] | Vysoké pro regulované, nízké pro „investuje do firem“ | Web, export seznamů |
| **ČNB – Zpráva o výkonu dohledu 2025** | Souhrnné počty: 55 IS, 360 fondů s právní osobností (30 samosprávných), 326 podfondů, 350 podílových fondů, 412 správců dle § 15\[1\] | Roční (k 31. 12. 2025) | Vysoká | Kalibrace odhadu | PDF |
| **ČNB – Seznam investičních fondů pro MFS** | Seznam rezidentských fondů (k 31. 8. 2025)\[20\] se strategií (akciové/dluhopisové/nemovitostní/ostatní)\[21\] | Čtvrtletně | Vysoká | Filtrování nerealitních fondů | Soubor ke stažení |
| **ESMA registr EuVECA/EuSEF** | Manažeři a fondy s EU značkou EuVECA\[22\] | Průběžně | Vysoká | Malé pro ČR (počet neověřen) | Web, JSON/XML (data.europa.eu)\[23\] |
| **Obchodní rejstřík + Sbírka listin (justice.cz)** | Statutáři, společníci, výroční zprávy fondů (vlastní kapitál, portfolio, NAV) | Výroční zprávy se zpožděním 6–12 měsíců | Vysoká (úřední) | Klíčové pro AUM českých SICAV/FKI | Ruční, OCR PDF |
| **ARES** | IČO, sídlo, právní forma, CZ-NACE, stav subjektu | Denně | Vysoká | Identita a detekce zániku | REST API (omezení při > ~500 dotazů/min)\[24\] |
| **Evidence skutečných majitelů** | Skuteční majitelé | Od 17. 12. 2025 **veřejnosti nepřístupná**\[25\] | — | Nepoužitelná | Jen dálkový přístup povinných osob |
| **CVCA – řádní a přidružení členové** | Profil řádného člena: velikost fondů, typ investic, tiket, sektory, geografie, počet dealů v ČR, portfolio\[26\] | Nerovnoměrně (některé profily z let 2020–2023)\[10\] | Střední až vysoká (samodeklarace) | Jádro PE a části VC | Web (scraping) |
| **CVCA Private Equity Report** | Roční přehled transakcí PE/VC v ČR (např. „Deal activity in 2023“, září 2024)\[27\] | Roční, zpoždění ~9 měsíců | Vysoká | Doklady transakcí | PDF |
| **Invest Europe / EDC** | Agregátní statistiky (EDC: 4 000 firem, 10 900 fondů, 86 700 portfoliových firem)\[28\] | Roční/pololetní | Vysoká, ale jen agregáty | Kalibrace, ne seznam | PDF, placené detaily |
| **NRB / NRI** | Programy fondů fondů: DeepTech fond (až 1 mld. Kč, 5–7 VC fondů), Fond Ukrajina (DEPO Ventures One, 94–141 mil. Kč), Inovační fond Trojmoří, IPO fond, výroční zprávy\[11\]\[16\]\[29\]\[30\]\[31\] | Průběžně | Vysoká | Seznam vybraných VC správců | Web, PDF |
| **EIF – „EIF in my country: Czechia“** | CZFoF (50 mil. EUR), RRFCZ FoF (55 mil. EUR, 3 VC fondy), CEFoF, 3SI\[15\]\[32\] | Průběžně | Vysoká | Seznam fondů s EIF kapitálem | Web, tiskové zprávy |
| **CzechInvest / CzechStartups.gov.cz** | Reporty trhu (např. „Startupy a Česko – trendy 2025“), adresáře\[33\] | Roční | Střední | Objevování | Web |
| **CzechCrunch (Startupové Česko, měsíční „dealy“, CC+ databáze)** | Každé oznámené kolo: startup, suma, fáze, investoři. Žebříček nejaktivnějších fondů.\[34\]\[35\] CC+ „100+ startupových investorů“\[36\] | Měsíčně, ročně | Střední až vysoká (část částek je odhad, jak CC sama uvádí)\[36\] | **Nejlepší zdroj dokladů VC investic** | Veřejné články zdarma, databáze CC+ placená |
| **Forbes Česko, HN, E15, Hrot24, Lupa** | Fundraising fondů, rozhovory, žebříčky (rodinné firmy, nejbohatší Češi)\[37\]\[38\] | Průběžně | Střední | FO, velcí investoři, PE | Ruční |
| **Ambit VC Deals Report** | ~100 VC investic v ČR za rok 2025, mediány tiketů\[2\]\[39\]\[40\]\[41\] | Roční | Střední až vysoká (Ambit se účastnil 40+ dealů)\[41\] | Kalibrace tiketů | PDF/PR |
| **Czech Founders – roční přehled** | 79 transakcí, 13,49 mld. Kč (2025)\[42\] | Roční | Střední | Kalibrace | PR |
| **CBAA, EBAN** | Asociace andělů. CBAA vznikla 2019\[43\] a v roce 2020 měla 7 členů zastupujících cca 30 andělů\[43\]\[44\] | Nepravidelně | Střední | Andělé (malé pokrytí) | Web |
| **Dealroom, Crunchbase, Tracxn (veřejné části)** | Profily investorů, počty investic\[45\]\[46\] | Průběžně | Střední (agregace, chyby v duplicitách) | Křížová kontrola | Omezený veřejný náhled |
| **JIC – „Velký přehled českých VC fondů“** | Tikety a zaměření fondů\[47\] | Nepravidelně | Střední | Tikety | Web |
| **Weby investorů a veřejný LinkedIn** | Strategie, portfolio, tým | Různé | Střední (marketing) | Doplňkové | Ruční; LinkedIn neautomatizovat (podmínky služby) |

**Zjištěný konflikt mezi zdroji:** objem FKI uvádí AKAT za Q3 2025 jako 813,4 mld. Kč,\[48\] ČNB ke konci roku 2025 jako 1 245,5 mld. Kč aktiv.\[1\] Rozdíl je zřejmě metodický (čistá aktiva vs. aktiva, jiný okruh fondů a jiné datum). V databázi vždy uvádět zdroj a definici.

## 4) Metodika ověřování pravosti a zařazení

### Čtyřúrovňový proces

1. **Úroveň 1 – identita (automaticky):** IČO přes ARES (stav, právní forma, NACE 64.30/66.30 jako signál), zápis v JERRS ČNB nebo ESMA, u zahraničních vehiklů lucemburský RCS.
2. **Úroveň 2 – mandát (poloautomaticky):** web investora (strategie, tým, portfolio), CVCA profil, statut fondu. LLM klasifikace „investiční strategie do firem vs. reality/dluhopisy“, u nejistých případů s lidskou kontrolou.
3. **Úroveň 3 – doložená investice (ručně nebo poloautomaticky):** konkrétní transakce ze zdroje s datem (CzechCrunch, tisková zpráva, CVCA report, výroční zpráva, změna společníka v OR).
4. **Úroveň 4 – křížová kontrola:** alespoň 2 nezávislé zdroje pro typ investora a pro doklad investice. Tisková zpráva investora a jeho převzetí médii **nejsou** nezávislé zdroje.

### Stupnice jistoty

| Stupeň | Podmínky | Příklad |
|---|---|---|
| **A** | Registrace nebo úřední zdroj + ≥ 1 transakce ≤ 24 měs. potvrzená ≥ 2 nezávislými zdroji | Kaya VC: CVCA člen + Supernova Series A (09/2025) v CzechCrunch i FinSMEs/Tracxn\[45\] |
| **B** | Jeden kvalitní zdroj transakce + web se strategií, bez registrace nebo bez druhého zdroje | Lighthouse Ventures: DecisionRules seed (05/2025) dle Tracxn\[46\] |
| **C** | Jen deklarace nebo mediální zmínka bez transakce ≤ 24 měs., nebo údaj je odhad | Family office se „20–30“ odhadem trhu; AUM andělů\[49\] |
| **X** | Vyřazeno nebo watchlist | IP Lab Ventures Fund I (bez doložené investice) |

Stupeň jistoty se přiděluje **i po polích**. Příklad: záznam A může mít AUM jen se stupněm C, pokud jde o cílovou velikost fondu, a ne o uzavřený fond.

### Pravidla pro konflikty

1. Úřední zdroj (ČNB, Sbírka listin, ESMA) má přednost před samodeklarací investora, ta před médii a média před agregátory (Tracxn, Crunchbase).
2. Novější údaj má přednost, pokud jde o stejnou metriku. **Neslučovat** cílovou velikost, first close, final close a AUM všech fondů. Příklad: Purple Ventures 2 cílí na 40+ mil. EUR, ale podle Hrot24 měl na začátku roku 2025 26 mil. EUR.\[50\]\[51\]
3. Neřešitelný konflikt se uloží jako dvě hodnoty s příznakem `konflikt=true`.

### Aktualizace a detekce zániku

- **Měsíčně:** diff seznamů JERRS ČNB (výmazy § 15, odnětí licencí; v roce 2025 např. ENERN Investments na vlastní žádost a CARDUUS odnětím),\[1\] ARES stav (likvidace, insolvence).
- **Měsíčně:** parsování měsíčních přehledů dealů CzechCrunch pro nové doklady investic a nové investory.
- **Čtvrtletně:** re-score aktivity. Kdo nemá investici 24 měsíců, přejde na „neaktivní“.
- **Ročně:** výroční zprávy ze Sbírky listin (AUM), CVCA a Ambit reporty.

## 5) Odhad velikosti okruhu v ČR

| Kategorie | Výchozí čísla | Realisticky identifikovatelné (s doloženou investicí) | Pokrytí | Přesnost záznamu |
|---|---|---|---|---|
| **VC fondy a investoři (vč. CVC, akcelerátorů s kapitálem)** | Ambit: ~100 VC investic v ČR za 2025.\[2\] CzechCrunch: databáze „100+ startupových investorů“. i5invest (2021): 46 VC fondů v CEE regionu.\[36\]\[40\]\[52\] CVCA: ≥ 25 řádných členů na webu, VC menšina | **60–90** českých aktivních + 100–200 zahraničních investujících do českých firem | 85–95 % (vůči CC+/CVCA) | ~90 % |
| **PE fondy** | CVCA: řádní členové převážně PE (Genesis, ARX, Jet, Mid Europa, Enterprise, Abris, Innova, Versute, MAM, Thein, Stratum, SkyLimit, Espira, EVERITA…).\[26\] CVCA LinkedIn: 19 řádných a 49 přidružených členů (nedatováno)\[53\] | **40–70** (vč. zahraničních s CZ transakcí) | 80–90 % | ~90 % (AUM ~80 %) |
| **Regulované vehikly ČNB investující do firem** | 360 fondů s právní osobností + 326 podfondů + 412 § 15.\[1\] Z 1 025 rezidentských fondů je 123 akciových a 534 „ostatních“\[3\] | **150–300** po vyřazení realitních a dluhopisových fondů a vehiklů bez transakce | 60–75 % (strategie FKI často neveřejná) | 75–85 % |
| **Family office** | Dana Halušková ve Wealth Magazínu (2025, „Family Offices na vzestupu“) uvádí, že „v Česku podle současných odhadů funguje kolem 20 až 30 rodinných kanceláří“, a jako příklady jmenuje Multi Family Office, Family Office Partners a Consillium Family Office. Metodiku odhadu neuvádí. Forbes: žebříčky rodinných firem (175 firem v roce 2022) a nejbohatších Čechů jako zdroj kandidátů | **20–40** (např. TCF Capital Tomáše Čupra, Family Office Partners)\[49\]\[54\] | 30–50 % | 70–80 % u typu, AUM < 30 % |
| **Business angels (veřejně vystupující)** | CBAA 2020: 7 členů, cca 30 andělů.\[44\] Průzkum Nápad roku: několik desítek andělů s 661 mil. Kč, průměrně 4 startupy, 2,3 mil. Kč na investici. Měsíční dealy CC jmenují anděly (např. Václav Muchna, Martin Bernátek)\[55\]\[56\] | **50–150** | 20–40 % (většina andělů nevystupuje veřejně) | ~80 % (tiket často chybí) |
| **Velcí soukromí investoři** | Forbes Nejbohatší Češi, investiční skupiny (Rockaway, BD Partners, Pale Fire Capital…)\[57\]\[58\]\[59\] | **30–60** | 50–70 % | 80 %, AUM C |

**Celkem: ~350–600 ověřených záznamů**, z toho ~60 % se stupněm A/B.

Odhad stojí na poměru „počet aktivních investorů na transakci“. Při ~80–100 oznámených kolech ročně (Czech Founders: 79 transakcí, Ambit: ~100)\[2\]\[42\] a průměrně 2–3 investorech na kolo vychází 150–250 unikátních investorů ročně. Zhruba polovina z nich je zahraničních.

## 6) Pilotní ověření: VC investoři v ČR

### Návrh pilotu

- **Vzorek:** 25 záznamů (rozšiřitelných na 50). Výběr: řádní VC členové CVCA, fondy z programů NRI a EIF a top aktivní fondy dle CzechCrunch 2024/2025.
- **Postup na záznam:** ARES/JERRS → web → ≥ 1 transakce ≤ 24 měs. → druhý nezávislý zdroj → vyplnění polí se zdroji. Odhad času je 20–40 minut na záznam.

### Pilotní vzorek (desk research, stav k 10/2026)

| # | Investor | Doložená investice (firma, kolo, datum, zdroj) | Velikost fondu / kapitál (zdroj) | Typický tiket | Sektory / fáze | Jistota |
|---|---|---|---|---|---|---|
| 1 | **Credo Ventures** | Supernova, Series A 9,2 mil. USD, 30. 9. 2025 (FinSMEs/Tracxn, CB Insights). Delta Green, 05/2024 (Fxstreet 25. 6. 2024)\[60\]\[61\] | Fond IV 75 mil. EUR, celkem ~250 mil. EUR (CzechCrunch). Pátý fond Credo Stage 5: 88 mil. USD podle Vestbee (24. 3. 2026), přes 1,8 mld. Kč podle Forbesu (**konflikt s CVCA 170 mil. EUR**) | 50 tis.–10 mil. EUR (CVCA),\[10\] do 5 mil. EUR (PODIM)\[26\]\[62\] | Software, AI, CEE; pre-seed/seed\[62\] | A |
| 2 | **Kaya VC** | Supernova, Series A, 30. 9. 2025 (Tracxn).\[45\] 7 dealů v 2024 (CzechCrunch)\[34\] | Pátý fond 70 mil. EUR po first close (CzechCrunch, Ambit)\[40\]\[63\] | 1–3 mil. EUR (CzechCrunch)\[63\] | Generalista, CEE/východ; seed–A\[63\]\[64\] | A |
| 3 | **Purple Ventures** | Choice, Series A 7,1 mil. USD, 16. 3. 2026 (CB Insights). 13 investic v 2025 (Hrot24)\[61\]\[65\] | Fond II: cíl 40+ mil. EUR, 26 mil. EUR k 1Q 2025 (Hrot24)\[50\]\[51\] | 6–19 mil. Kč (CzechCrunch)\[66\] | Digitální zdraví, energetika, fintech; pre-seed/seed\[65\]\[67\] | A |
| 4 | **Czech Founders VC** | Maxfusion, 14. 1. 2026. Merchantee, 9. 6. 2026 (CzechCrunch)\[14\] | Neuvedeno (nástupce United Founders, Ambit)\[40\]\[41\] | 50–350 tis. EUR (JIC)\[47\] | B2B tech, pre-seed\[47\] | A |
| 5 | **Lighthouse Ventures** | DecisionRules seed, 7. 5. 2025. Fleetfox seed, 3. 11. 2025 (Tracxn)\[46\] | Neveřejné | Neuvedeno | Enterprise SW, fintech; seed\[46\] | B |
| 6 | **Reflex Capital** | Grid.online 1,5 mil. EUR, 02/2025 (CzechCrunch 3. 3. 2025, Tracxn). Choice, 03/2026\[61\]\[68\]\[69\] | Vlastní kapitál. „~150 mil. EUR nasazeno“ (TeaserClub, **slabý zdroj → C**)\[70\] | Neuvedeno | SaaS, marketplace; seed–A\[71\] | A (AUM C) |
| 7 | **J&T Ventures** | ValkaAI pre-seed 12 mil. EUR, 24. 2. 2026 (CzechCrunch). Grid.online 02/2025\[45\]\[59\] | Podle J&T Banky „více než 90 milionů eur ve třech investičních fondech kvalifikovaných investorů“: J&T Ventures I 7 mil. EUR, J&T Ventures II 48 mil. EUR, J&T Ventures III spuštěn koncem roku 2024 | 0,5–2,5 mil. EUR (LinkedIn J&T Ventures)\[72\] vs. „až 3 miliony eur“ (J&T Banka) – **konflikt** | Agnostik, CEE/SEE; seed\[72\] | A |
| 8 | **Rockaway Ventures** | ValkaAI, lead, 24. 2. 2026 (CzechCrunch)\[59\] | Rockaway dříve oznámil 2,5 mld. Kč pro startupy (Forbes, starší údaj)\[57\] | Neuvedeno | Tech; pre-seed–growth | B |
| 9 | **Tensor Ventures** | ValkaAI 02/2026 (CzechCrunch). Wultra Series A, 15. 1. 2025 (Tracxn)\[45\]\[59\] | CVCA 20 mil. EUR (zastaralé).\[10\] Fond z RRFCZ FoF (EIF).\[17\]\[26\] CC: „půl miliardy z veřejných peněz“\[35\] | 250 tis.–1 mil. EUR (CVCA)\[10\]\[26\] | Deeptech; seed\[26\] | A |
| 10 | **DEPO Ventures** | DEPO Ventures One vybrán NRI pro Fond Ukrajina, 26. 8. 2026 (NRB)\[11\]\[73\] – **jde o LP závazek, ne o investici do firmy**. Kardi AI, DriveX (CzechCrunch, 2022)\[74\] | CVCA 5,5 mil. EUR.\[10\]\[26\] NRI vklad 94 mil. Kč, až 141 mil. Kč\[29\] | 50–300 tis. EUR (CVCA)\[10\]\[26\] | Agnostik, CEE, Ukrajina | B (potřeba transakce ≤ 24 měs.) |
| 11 | **Nation 1 (N1)** | Myriad AI pre-seed 2 mil. USD (CzechCrunch, červencové dealy, rok k ověření).\[35\] Daytrip Series B (CC, leden 2024)\[56\] | CVCA 35 mil. EUR\[26\] | 50 tis.–1,5 mil. EUR (CVCA)\[26\] | Tech, CZ; pre-seed/seed\[26\] | B |
| 12 | **Presto Ventures** | Choice, 03/2026 (CB Insights). Lakmoos pre-seed 300 tis. EUR (CC, 03/2024)\[61\]\[66\] | Neuvedeno | Neuvedeno | SW, pre-seed/seed | A |
| 13 | **Inven Capital** (CVC ČEZ) | Ember Series A 11 mil. GBP (CC, 03/2024). Wint 35 mil. USD (CC)\[66\]\[75\] | 250 + 250 mil. EUR (CVCA, aktualizováno 19. 11. 2025)\[10\]\[26\] | 2–30 mil. EUR\[26\] | Cleantech; growth\[26\] | A |
| 14 | **Tilia Impact Ventures** | Arbonics, kolo 5,5 mil. EUR (CC, leden 2024)\[56\] | Tilia Impact II s EIF jako lead investorem (EIB, 2023)\[76\] | Neuvedeno | Klima, vzdělávání, zdraví; seed\[76\] | B |
| 15 | **Soulmates Ventures** | Rightcharge seed 47 mil. Kč, lead, 23. 10. 2025 (Fxstreet)\[77\] | Neuvedeno | Neuvedeno | Seed | B |
| 16 | **i&i Biotech Fund** | Nanoligent 1 mil. EUR (CzechCrunch)\[78\] | Fond podpořený EIF (CVCA)\[10\]\[26\] | Neuvedeno | Biotech, spin-offy\[26\] | B |
| 17 | **BD Partners** | ValkaAI 02/2026 (CC). TRIFFT seed 17. 7. 2025 (Tracxn)\[46\]\[59\] | Neveřejné (Bartoníček, Duvieusart)\[59\] | Neuvedeno | Tech | B |
| 18 | **JIC Ventures** | FaceUp Series A 5 mil. USD, 19. 5. 2026 (CzechCrunch)\[79\] | „Stovky milionů“ Kč, start 7. 4. 2026 (CC)\[80\] | Neuvedeno | Jihomoravské startupy | A |
| 19 | **Gi21 Capital** | FaceUp 05/2026 (CC). Fleetfox 11/2025 (Tracxn)\[46\]\[79\] | Neveřejné | Neuvedeno | Tech | B |
| 20 | **Orbit Capital** | ThreatMark, investice 13 mil. USD (CC, leden 2024)\[56\] | Growth Equity „scaling to EUR 200 mil.“, Venture Debt 30 mil. EUR (CVCA)\[26\] | Neuvedeno | Growth, venture debt | B (stáří dokladu) |
| 21 | **Seed Starter ČS** (CVC) | Investown (CC, 05/2022 – **zastaralé**)\[74\] | Neuvedeno | Neuvedeno | Seed | C → doplnit |
| 22 | **Zaka VC** | Sifted: top 10 aktivních early-stage fondů CEE (CC)\[35\] | Neuvedeno | Neuvedeno | Early-stage | C → doplnit transakci |
| 23 | **TCF Capital** (FO Tomáše Čupra) | Pozice v Keboola, FlexDog, Rossum (CC)\[54\] | Hlavní aktivum Rohlik Group\[54\] | Neuvedeno | Tech | B (FO) |
| 24 | **Springtide Ventures / Tachles** | ThreatMark (CC, leden 2024)\[56\] | Neuvedeno | Neuvedeno | Tech | C |
| 25 | **IP Lab Ventures Fund I** | Žádná doložená investice | ~27 mil. EUR z NPO přes EIF, cíl > 50 mil. EUR (fundsforNGOs, 28. 9. 2026)\[17\] | Neuvedeno | Transfer technologií, AI\[17\] | **X – watchlist** |

### Předběžné měření na vzorku (desk pilot)

| Metrika | Výsledek | Komentář |
|---|---|---|
| Záznamy splňující „skutečný investor“ (≥ 1 doložená investice) | 24/25 = **96 %** | Vyřazen IP Lab (watchlist) |
| Záznamy s dokladem ≤ 24 měsíců | 17/25 = **68 %** | U DEPO, N1, Orbit, Seed Starter, Zaka, Springtide, Tilia je potřeba dohledat novější transakci |
| Stupeň A | 11/25 = **44 %** | |
| Vyplněnost: sektory / fáze | 100 % / 96 % | |
| Vyplněnost: tiket | 11/25 = **44 %** | Fondy tiket často nezveřejňují |
| Vyplněnost: velikost fondu/AUM | 16/25 = **64 %** | Z toho ≥ 3 zastaralé (CVCA profily z let 2020–2023) |
| Zjištěné konflikty | 3 (Credo AUM, Purple velikost, FKI objem AKAT vs. ČNB) | |

Tyto hodnoty jsou z kancelářského pilotu a slouží jako výchozí odhad. Plný pilot musí každý záznam nezávisle ověřit druhou osobou.

### Metodika měření přesnosti

- **Precision po záznamech:** podíl záznamů, které jsou skutečnými investory správného typu (TP/(TP+FP)). Cíl ≥ 95 %.
- **Precision po polích:** pro každé pole podíl hodnot shodných s ručně ověřenou „zlatou“ hodnotou. Tolerance: tiket ±25 %, AUM stejná metrika a ±10 %, datum ±1 měsíc. Cíl ≥ 90 % u typu, sektoru a fáze, ≥ 80 % u tiketu a AUM.
- **Falešně pozitivní:** kategorizace chyb (holding, poradce, startup, realitní fond, neaktivní).
- **Chybějící údaje:** míra vyplněnosti po polích.
- **Recall:** vůči referenčnímu seznamu = sjednocení řádných VC členů CVCA + fondů NRI/EIF + investorů jmenovaných v CzechCrunch Startupové Česko 2024–2025. Cíl ≥ 85 %.
- **Inter-rater shoda:** 20 % vzorku ověří dva analytici; Cohenovo κ u typu investora ≥ 0,8.

**Šablona vyhodnocení (řádek na záznam):**

| ID | Název | Typ (DB) | Typ (zlatý) | TP/FP | Doklad OK (A/N) | Datum dokladu | Sektory OK | Fáze OK | Tiket OK | AUM OK | Chybějící pole | Jistota | Ověřil | Datum | Poznámka |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

## 7) Odhad nákladů na rozšíření na celý svět

### Velikost globálního okruhu

| Kategorie | Veřejné odhady | Cílový počet do databáze |
|---|---|---|
| VC | NVCA 2026 Yearbook: 2 984 VC firem v USA (první pokles z 3 054). Evropa: i5invest 443 VC fondů (2021, podhodnocené)\[52\]\[81\] | 8 000–12 000 aktivních globálně |
| PE | Preqin pokrývá 31 653 aktivních firem (marketingové číslo, vč. všech private capital). Invest Europe EDC: 4 000 firem\[28\]\[82\] | 10 000–15 000 |
| Family office | Deloitte 2024: 8 030 SFO (Severní Amerika 3 180, APAC 2 290, Evropa 2 020). Jiné odhady 3 500–20 000\[83\]\[84\]\[85\] | 3 000–5 000 (jen s veřejnou investicí) |
| Andělé | Spolehlivý globální počet veřejně neexistuje | 10 000–30 000 veřejně vystupujících |
| **Celkem** | | **~30 000–60 000 institucionálních + 10–30 tis. andělů** |

### Regionální registry a specifika

- **USA:** SEC Form ADV (IAPD, poradci soukromých fondů vč. AUM – výborný veřejný zdroj velikosti), Form D (EDGAR, oznámené emise fondů i startupů – doklad fundraisingu).
- **UK:** Companies House API (zdarma), FCA register.
- **EU:** ESMA registr EuVECA/EuSEF, národní regulátoři (BaFin, AMF, CSSF Lucembursko – klíčové, protože tam sídlí mnoho CEE fondů). Rejstříky skutečných majitelů jsou v řadě zemí uzavřené od rozsudku velkého senátu SDEU z 22. 11. 2022 ve spojených věcech C-37/20 a C-601/20 (WM a Sovim SA v. Luxembourg Business Registers). Podle něj „the general public's access to information on beneficial ownership constitutes a serious interference with the fundamental rights to respect for private life and to the protection of personal data“. Například německý Transparenzregister přestal data veřejnosti poskytovat ještě týž den (Morgan Lewis).
- **Asie:** jazyková bariéra (čínština, japonština, korejština). Výrazně nižší dostupnost registrů; LLM překlad je nutný.
- **Jazyk:** zhruba 25–30 jazyků mediálních zdrojů. LLM extrakce snižuje cenu, ale vyžaduje vzorkovou kontrolu.

### Rozpad nákladů (kurz 25 Kč/EUR)

| Položka | Minimální | Realistický | Plný |
|---|---|---|---|
| Rozsah | 15 000 záznamů (VC+PE, US/EU/UK), bez andělů | 40 000 (VC+PE+FO, globálně) | 80 000 (vč. andělů, APAC, LP) |
| Ruční ověření (20 % / 50 % / 100 % záznamů, 25 min, 25 EUR/h) | 31 tis. EUR | 208 tis. EUR | 833 tis. EUR |
| Druhé ověření a QA (10 % vzorku) | 8 tis. EUR | 25 tis. EUR | 80 tis. EUR |
| Inženýrství (scrapery, registrové konektory, entity resolution) | 120 tis. EUR (2 FTE × 6 měs.) | 300 tis. EUR (3 FTE × 9 měs.) | 600 tis. EUR (5 FTE × 12 měs.) |
| LLM zpracování (extrakce z ~1–5 mil. článků a stránek) | 10 tis. EUR | 40 tis. EUR | 120 tis. EUR |
| Infrastruktura, proxy, úložiště | 15 tis. EUR | 40 tis. EUR | 80 tis. EUR |
| Právní (GDPR DPIA, balanční testy, ToS) | 20 tis. EUR | 50 tis. EUR | 100 tis. EUR |
| Rezerva 15 % | 31 tis. EUR | 99 tis. EUR | 272 tis. EUR |
| **Celkem build** | **~235 tis. EUR (~5,9 mil. Kč)** | **~760 tis. EUR – při zahrnutí řízení projektu ~1,2–1,6 mil. EUR (30–40 mil. Kč)** | **~2,1–2,5 mil. EUR (52–62 mil. Kč)** |
| **Roční údržba** (re-check 25–35 % záznamů, monitoring) | ~120 tis. EUR (3 mil. Kč) | ~400–600 tis. EUR (10–15 mil. Kč) | ~0,9–1,2 mil. EUR (22–30 mil. Kč) |

**Alternativa s placenými daty:** licence PitchBook, Preqin nebo Dealroom (řádově desítky tisíc EUR ročně na uživatele, cena se veřejně neuvádí) by snížila ruční práci zhruba o 50–70 %. Porušila by ale podmínku veřejných dat a licence obvykle zakazují redistribuci. Doporučení: placená data používat jen jako **referenční množinu pro měření recall**, ne jako zdroj záznamů.

## 8) Rizika a omezení

| Riziko | Dopad | Opatření |
|---|---|---|
| **GDPR u andělů a fyzických osob** | Sankce, stížnosti | Jen veřejně vystupující investoři, balanční test, čl. 14 informace, opt-out, minimalizace |
| **Uzavření evidence skutečných majitelů (17. 12. 2025)** | Nelze veřejně ověřit majitele FO a holdingů\[86\] | Opírat se o OR (společníci, statutáři), výroční zprávy a mediální zdroje; přiznat nižší jistotu |
| **Zastaralost dat** | CVCA profily z let 2020–2023, velikosti fondů | Pole `datum_zdroje`, automatický downgrade jistoty po 18 měsících |
| **Nedostupnost AUM u FO a andělů** | Prázdné povinné pole | Hodnota „neveřejné“ místo odhadu; odhad jen se stupněm C a uvedenou metodikou |
| **„Náhodné firmy“** (s.r.o. s „invest“ nebo „ventures“ v názvu, pseudofondy) | Falešně pozitivní záznamy | Pravidlo doložené investice; varování ČNB před „pseudofondy“ a správci § 15;\[4\]\[87\] kontrola NACE a výkazů\[88\] |
| **Duplicity** (správce vs. fond, značka vs. entita, CZ vs. LU vehikl) | Nadhodnocené počty a AUM | Model správce↔fond, entity resolution na IČO, doméně a jménech partnerů |
| **Mediální odhady částek** | CzechCrunch uvádí, že částky jsou „v některých případech kvalifikovanými odhady“\[36\] | Pole `castka_typ` = oznámená / odhad |
| **Rozdílné metodiky trhu** | 2025: CC 9,8 mld. Kč v kolech vs. Czech Founders 13,49 mld. Kč vs. Ambit ~100 investic\[2\]\[36\]\[40\]\[42\] | Uvádět zdroj a definici, nesčítat |
| **Pomalost Sbírky listin** | AUM se zpožděním 6–12 měsíců | Uvádět „AUM k datu“ |

## Recommendations

1. **Začít pilotem 50 VC záznamů za 3–4 týdny** (1 analytik + 0,5 inženýra) podle šablony výše. Za úspěch považovat precision po záznamech ≥ 95 % a recall ≥ 85 % vůči CVCA + NRI/EIF + CzechCrunch.
2. **Pak rozšířit na PE (CVCA, CVCA reporty, Sbírka listin) a regulované vehikly ČNB.** Při tom filtrovat podle strategie v seznamu fondů ČNB a vyřadit nemovitostní a dluhopisové fondy.
3. **Family office a anděly vést v samostatné vrstvě s nižší jistotou** a se striktním GDPR režimem. Nepředstírat úplnost.
4. **Globální rozšíření stavět po regionech podle kvality registrů:** USA (Form ADV/D) → UK → EU (ESMA + Lucembursko) → APAC. Realistický rozpočet je 1,2–1,6 mil. EUR na vybudování a 0,4–0,6 mil. EUR ročně na údržbu.

## Caveats

- Počty pro ČR (350–600 záznamů) jsou odhadem odvozeným z počtu transakcí, registrů ČNB a členů asociací. Přesný počet FKI investujících do firem z veřejných dat bez filtrace JERRS nezjistíme. Počet českých EuVECA manažerů nebyl ověřen.
- Počet řádných členů CVCA se liší: na webu je ≥ 25 profilů, nedatovaný LinkedIn uvádí 19.\[53\] Údaj o CBAA (7 členů, cca 30 andělů) je z roku 2020.\[44\]
- Pilotní tabulka je desk research. U několika dokladů z měsíčních přehledů CzechCrunch není v dostupném výňatku přesné datum (označeno „k ověření“). Údaje z Tracxn, CB Insights a TeaserClub jsou agregátorské a vyžadují potvrzení primárním zdrojem.
- Nákladové scénáře jsou modelové (sazba 25 EUR/h, 25 min na záznam, kurz 25 Kč/EUR). Ceny placených databází nejsou veřejné.

## Sources

1. <https://www.cnb.cz/export/sites/cnb/cs/dohled-financni-trh/.galleries/souhrnne_informace_fin_trhy/zpravy_o_vykonu_dohledu/download/dnft_2025_cz.pdf>
2. [Investoři do startupů jsou vybíravější, ale do zvolených firem dávají víc](https://www.investicniweb.cz/startupy/322602-jak-presvedcit-investory-aby-vsadili-prave-na-vas-startup)
3. [Komentář ke statistice investičních fondů - Česká národní banka](https://www.cnb.cz/cs/statistika/menova_bankovni_stat/harm_stat_data/komentar-ke-statistice-investicnich-fondu/index.html)
4. [Role ČNB u správců podle § 15 zákona o investičních společnostech a investičních fondech - Česká národní banka](https://www.cnb.cz/cs/dohled-financni-trh/vykon-dohledu/upozorneni-pro-verejnost/Role-CNB-u-spravcu-podle-15-zakona-o-investicnich-spolecnostech-a-investicnich-fondech/)
5. [Role ČNB u správců podle § 15 zákona o investičních ...](https://kzfinance.cz/aktuality/upozorneni-pro-verejnost-role-cnb-u-spravcu-podle-ss-15-zakona-o-investicnich-spolecnostech-a-investicnich-fondech)
6. [Family office](https://en.wikipedia.org/wiki/Family_office)
7. [Kdo jsou andělští investoři a jak mohou byznysu v Česku pomoci?](https://www.bway.cz/kdo-jsou-andelsti-investori-a-jak-mohou-byznysu-v-cesku-pomoci/)
8. [Andělský investor](https://cs.wikipedia.org/wiki/And%C4%9Blsk%C3%BD_investor)
9. [CVCA & SLOVCA Awards 2024 EN](https://www.awards2024.eu/en/cvca-slovca-awards-2024-en/)
10. [Membership – CVCA](https://cvca.cz/en/membership/)
11. [NRI dokončila výběr venture kapitálového fondu pro program Fond Ukrajina - NRB](https://www.nrb.cz/nri-dokoncila-vyber-venture-kapitaloveho-fondu-pro-program-fond-ukrajina/)
12. [Associate members](https://cvca.cz/en/category/associate-members/)
13. [VÝROČNÍ ZPRÁVA 2025 J&T PERSPEKTIVA otevřený podílový fond 1](https://www.jtis.cz/download/1/3/2/4/5/Vyrocni-zprava-PER-2025.pdf)
14. [Czech Founders VC - CzechCrunch](https://cc.cz/tag/czech-founders-vc/)
15. [RRF Czech Republic Fund of Funds](https://www.eif.org/equity-products/all/rrf-czech-republic)
16. [Národní rozvojová investiční společně s MPO připravily DeepTech fond pro startupy - NRB](https://www.nrb.cz/narodni-rozvojova-investicni-spolecne-s-mpo-pripravily-deeptech-fond-pro-startupy/)
17. [European Investment Fund backs first Czech IP Lab Ventures Fund I with about €27 million to commercialize AI and deep-tech research - fundsforNGOs News](https://news.fundsforngos.org/2026/09/28/eif-backs-czech-ai-tech-transfer-fund-ip-lab-ventures-27m/)
18. [Seznamy a evidence - Česká národní banka](https://www.cnb.cz/cs/dohled-financni-trh/seznamy/)
19. [Správa majetku srovnatelná s obhospodařováním - alternativní fond dle § 15 ZISIF](https://akschejbal.cz/sprava-majetku-srovnatelna-s-obhospodarovanim-alternativni-fond-dle-15-zisif)
20. [Seznam investičních fondů v ČR - Česká národní banka](https://www.cnb.cz/cs/cnb-news/kalendar/Seznam-investicnich-fondu-v-CR-00009)
21. [Statistika investičních fondů - Česká národní banka](https://www.cnb.cz/cs/cnb-news/kalendar/Statistika-investicnich-fondu-00001/)
22. [Databases and Registers](https://www.esma.europa.eu/publications-and-data/databases-and-registers)
23. [Venture Capital and Social Entrepreneurship Funds](https://data.europa.eu/data/datasets/euveca_eusef?locale=en)
24. [ARES — co to je a jak v něm vyhledat firmu - FIRMIN s.r.o.](https://www.firmin.cz/slovnik/ares)
25. [Informační systém evidence skutečných majitelů - Ministerstvo spravedlnosti České republiky](https://esm.justice.cz/ias/issm/rejstrik;jsessionid=VOFByftheAJ9Zvkz-AftH10w)
26. [Full members – CVCA](https://cvca.cz/en/category/full-members/)
27. [CVCA Private Equity Report Deal activity in 2023 September 2024](https://www.slovca.sk/files/attachments/CVCA%20Report%202023%20final.pdf)
28. [Invest Europe](https://en.wikipedia.org/wiki/Invest_Europe)
29. [NRI dokončila výběr venture kapitálového fondu pro program Fond Ukrajina - Finak](https://www.finak.cz/nri-dokoncila-vyber-venture-kapitaloveho-fondu-pro-program-fond-ukrajina/)
30. [2025 VÝROČNÍ ZPRÁVA](https://www.nrinvesticni.cz/wp-content/uploads/2026/03/NRB_VZ2025_Investicni_final-s-vyrokem.pdf)
31. [Stát chce investovat miliardu do startupů](https://www.irozhlas.cz/ekonomika/dulezity-signal-verejnosti-stat-planuje-investovat-miliardu-do-startupu_2608170620_vdv)
32. [EIF in my country](https://www.eif.org/supporting-smes/eif-near-me/czechia)
33. [Startupy v Česku rostou. Podpora a investice však zaostávají. AI dominuje trendům roku 2025 - CzechStartups.gov.cz](https://czechstartups.gov.cz/novinky/startupy-v-cesku-rostou-podpora-a-investice-vsak-zaostavaji-ai-dominuje-trendum-roku-2025/)
34. [České startupy v roce 2024: Nabraly víc peněz, klesl počet investic - CzechCrunch](https://cc.cz/jaky-byl-rok-2024-pro-ceske-startupy-odrazily-se-ode-dna-celkem-ziskaly-pres-16-miliard/)
35. [Startupoví investoři zažívají nejhorší rok za posledních devět let. Fondy mají problém nabrat peníze](https://cc.cz/startupovi-investori-zazivaji-nejhorsi-rok-za-poslednich-devet-let-fondy-maji-problem-nabrat-penize/)
36. [Startupové Česko v roce 2025 | Data a trendy](https://cc.cz/startupovecesko/)
37. [175 největších rodinných firem Česka](https://forbes.cz/lists/nejvetsi-rodinne-firmy-ceska-2022/)
38. [Největší rodinné firmy 2025](https://forbes.cz/lists/nejvetsi-rodinne-firmy-2025/)
39. [Investice do českých startupů: Méně dealů, větší investice, přísnější investoři - Wealth Magazín](https://wmag.cz/investice-do-ceskych-startupu-mene-dealu-vetsi-investice-prisnejsi-investori/)
40. [Investice do českých startupů: méně dealů, větší investice, přísnější investoři](https://www.businessinfo.cz/clanky/investice-do-ceskych-startupu-mene-dealu-vetsi-investice-prisnejsi-investori/)
41. [Investice do českých startupů: méně dealů, větší investice, přísnější investoři](https://vedavyzkum.cz/inovace-a-transfer/inovace-a-transfer/investice-do-ceskych-startupu-mene-dealu-vetsi-investice-prisnejsi-investori)
42. [Startupy v roce 2025 bojovaly. Proudily do nich investice za 13,5 miliardy, většinu pobraly tři největší firmy - Lupa.cz](https://www.lupa.cz/clanky/startupy-v-roce-2025-bojovaly-proudily-do-nich-investice-za-13-5-miliardy-vetsinu-pobraly-tri-nejvetsi-firmy/)
43. [Více andělských investorů a investorek. Akademie naučí, jak investovat do startupů](https://www.businessinfo.cz/clanky/vice-andelskych-investoru-a-investorek-akademie-nauci-jak-investovat-do-startupu/)
44. [Andělské investování a Czech Business Angel Association](https://mf.gov.cz/assets/attachments/Prezentace_2020-08_Andelske-investovani-a-Czech-Business-Angel-Association-Jiri-Hlavenka.pdf)
45. [J&T Ventures - 2025 Investor Profile, Portfolio, Team & Investment Trends - Tracxn](https://tracxn.com/d/venture-capital/jt-ventures/__XO2tn_42b6rRRL8shlSHj-qHpCvbbdjvsYq_AFxUSOA)
46. [Lighthouse Ventures - 2026 Investor Profile, Portfolio, Team & Investment Trends - Tracxn](https://tracxn.com/d/venture-capital/lighthouse-ventures/__cVHA2k8xbb8KzLdcrEpPAIYwYudLSJ9i-LWU2jecbQI)
47. [Velký přehled (nejen) českých Venture Capital fondů](https://www.jic.cz/cz/magazin/jicblog/velky-prehled-ceskych-venture-capital-fondu)
48. [Fondy kvalifikovaných investorů posílily. Majetek se vyšplhal na 813 miliard korun](https://forbes.cz/fondy-kvalifikovanych-investoru-posilily-majetek-se-vysplhal-na-813-miliard-korun/)
49. [Family Offices na vzestupu: Jak spravují majetek české i zahraniční HNWI rodiny? - Wealth Magazín](https://wmag.cz/family-offices-na-vzestupu-jak-spravuji-majetek-ceske-i-zahranicni-hnwi-rodiny/)
50. [Druhý fond Purple Ventures se úspěšně plní, pět milionů eur už „pracuje“ ve startupech](https://www.hrot24.cz/clanek/druhy-fond-purple-ventures-investice-startupy-HaNWR)
51. [Jan Stanek na LinkedIn: Brněnští Purple Ventures spouští druhý fond, do startupů chtějí…](https://cz.linkedin.com/posts/stanekjan_brn%C4%9Bn%C5%A1t%C3%AD-purple-ventures-spou%C5%A1t%C3%AD-druh%C3%BD-fond-activity-7178298902624780288-aQe2)
52. [European Venture Capital Ecosystem On The Rise - CzechStartups.gov.cz](https://czechstartups.gov.cz/en/novinky/european-venture-capital-ecosystem-on-the-rise/)
53. [Czech Private Equity and Venture Capital Association (CVCA)](https://www.linkedin.com/company/czech-private-equity-and-venture-capital-association-cvca)
54. [Čupr založil fond a české startupy si připsaly další miliardový exit - CzechCrunch](https://cc.cz/tomas-cupr-zalozil-vlastni-fond-a-ceske-startupy-si-pripsaly-dalsi-miliardovy-exit/)
55. [Kdo jsou čeští business angels a jak investují](https://napadroku.cz/blog/kdo-jsou-cesti-business-angels-a-jak-investuji/)
56. [Dealy za více než miliardu korun. Leden v podání českých startupů - CzechCrunch](https://cc.cz/mlade-firmy-ktere-chcete-sledovat-a-dealy-za-vice-nez-miliardu-korun-leden-v-podani-ceskych-startupu/)
57. [Miliardový rok. Investice do českých startupů lámou rekordy, tohle je pět největších](https://forbes.cz/miliardovy-rok-investice-do-ceskych-startupu-lamou-rekordy-tohle-je-pet-nejvetsich/)
58. [České Credo Ventures má pro startupy nový fond a 1,8 miliardy korun. Už v něm nebude Kiska](https://cc.cz/ceske-credo-ventures-ma-pro-startupy-novy-fond-a-18-miliardy-korun-uz-v-nem-nebude-kiska/)
59. [Jeho avataři živě komentují sport. Teď získal rekordní investici - CzechCrunch](https://cc.cz/tvori-avatary-kteri-zvladnou-zive-komentovat-sportovni-zapasy-ted-ziskal-rekordni-investici/)
60. [Miliardový fond Purple Ventures odstartoval. První investice míří do chytré energetiky či HR softwaru](https://www.fxstreet.cz/zpravodajstvi-162178.html)
61. [Reflex Capital Portfolio Investments, Reflex Capital Funds, Reflex Capital Exits](https://www.cbinsights.com/investor/spread-capital)
62. [Credo Ventures](https://podim.org/podim_partner/credo-ventures/)
63. [Dřív vsadila na Rohlík. A teď Kaya lační po dalších jednorožcích - CzechCrunch](https://cc.cz/vsadila-na-rohlik-kdyz-ho-ostatni-investori-takrka-odepisovali-ted-chce-kaya-dalsi-jednorozce/)
64. [Stáli u zrodu startupového Česka. Kaya spravuje miliardy, má dva jednorožce a otevírá pátý fond](https://cc.cz/stali-u-zrodu-startupoveho-ceska-kaya-spravuje-miliardy-ma-dva-jednorozce-a-otevira-paty-fond/)
65. [Purple Ventures šlape na plyn. Fond investoval do 13 startupů a blíží se uzavření čtyřicetimilionového fondu](https://www.hrot24.cz/clanek/purple-ventures-startupy-investice-2025-HpCiz)
66. [Purple, Presto, Kaya a další. Investoři mají apetit, startupové fondy nabírají další miliardy korun](https://cc.cz/purple-presto-kaya-a-dalsi-investori-maji-apetit-startupove-fondy-nabiraji-dalsi-miliardy-korun/)
67. [Purple Ventures spustili druhý fond. Investoval už do chytré energetiky či HR softwaru - Fintree](https://fintree.cz/novinky/purple-ventures-druhy-fond-pro-cee/)
68. [Kteří investoři přináší startupům největší přidanou hodnotu? V top 40 fondech v Evropě jsou i Češi](https://cc.cz/kteri-investori-prinasi-startupum-nejvetsi-pridanou-hodnotu-v-top-40-fondech-v-evrope-jsou-i-cesi/)
69. [Reflex Capital - 2026 Investor Profile, Portfolio, Team & Investment Trends - Tracxn](https://tracxn.com/d/venture-capital/reflex-capital/__t_xUsI7Nl5yoXDVc4E1rAVPmZ5hEr4LlgNyavLZjiac)
70. [Reflex Capital](https://teaserclub.com/investors/reflex-capital)
71. [Investorlist - Reflex Capital](https://investorlist.com/investor/reflex-capital)
72. [J&T Ventures](https://cz.linkedin.com/company/j&t-ventures)
73. [NRI dokončila výběr venture kapitálového fondu pro program Fond Ukrajina](https://www.businessinfo.cz/clanky/nri-dokoncila-vyber-venture-kapitaloveho-fondu-pro-program-fond-ukrajina/)
74. [Světem zmítá investiční bouře. Českým startupům o ní asi neřekli - CzechCrunch](https://cc.cz/svetem-zmita-investicni-boure-ceskym-startupum-o-ni-asi-nerekli-v-kvetnu-ziskaly-pres-tri-miliardy/)
75. [České startupy dosud přilákaly o 70 procent méně peněz od investorů - CzechCrunch](https://cc.cz/ceske-startupy-v-prvni-polovine-roku-prilakaly-o-70-procent-mene-penez-od-investoru-nez-loni/)
76. [Czechia: EIB Group financing of €1.88 billion in 2023 helps the country to grow greener, better connected and more competitive](https://sciencebusiness.net/network-updates/czechia-eib-group-financing-eu188-billion-2023-helps-country-grow-greener-better)
77. [Purple Ventures](https://www.fxstreet.cz/klicova-slova+purple-ventures.html)
78. [Nový fond, odchod Andreje Kisky i tři další partneři. V Credo Ventures se dějí velké věci](https://cc.cz/novy-fond-odchod-andreje-kisky-i-tri-dalsi-partneri-v-credo-ventures-se-deji-velke-veci/)
79. [Ze studentského projektu Češi vyrostli na hodnotu přes půl miliardy - CzechCrunch](https://cc.cz/byl-to-studentsky-projekt-ted-uz-ma-hodnotu-pres-pul-miliardy-nabidky-na-odkup-odmitame-hlasi-cesi/)
80. [Venture - CzechCrunch](https://cc.cz/startupy/venture/)
81. [2026 NVCA Yearbook 2026 NVCA Yearbook - National Venture Capital Association - NVCA](https://nvca.org/2026-nvca-yearbook/)
82. [Private equity database for firms & investors](https://www.preqin.com/data/private-equity)
83. [Deloitte: Number of Family Offices to Grow 75% by 2030](https://www.dakota.com/fundraising-news/deloitte-number-of-family-offices-to-grow-75-by-2030)
84. [Deloitte Projects Strong Growth for Family Offices Worldwide - The Family Office Professional](https://thefopro.com/deloitte-projects-strong-growth-for-family-offices-worldwide/)
85. [The Family Office Market: Does Size Matter?](https://www.forbes.com/sites/francoisbotha/2025/03/02/the-family-office-market-does-size-matter/)
86. [Komu patří firma se už nedozvíte: Klíčová databáze se zavírá - Česká justice](https://www.ceska-justice.cz/2025/11/komu-patri-firma-se-uz-nedozvite-klicova-databaze-se-zavira/)
87. [Specifika fondů kvalifikovaných investorů](https://www.fki-fondy.cz/specifika-fki/)
88. [Upozornění České národní banky na rizika nabízení investičních příležitostí osob podle § 15 ZISIF - Česká národní banka](https://www.cnb.cz/cs/dohled-financni-trh/vykon-dohledu/upozorneni-pro-verejnost/Upozorneni-Ceske-narodni-banky-na-rizika-nabizeni-investicnich-prilezitosti-osob-podle-15-ZISIF/)
