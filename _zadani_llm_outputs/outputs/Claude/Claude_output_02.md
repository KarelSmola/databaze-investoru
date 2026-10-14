# Spolehlivá databáze investorů: nový plán pro ČR, provedený pilot na 30 VC investorech a odhad nákladů na celý svět

Z veřejných zdrojů lze pro ČR sestavit ověřenou databázi zhruba 190–380 skutečně aktivních investorů. Platí to za podmínky, že jednotkou záznamu je správce (investiční organizace nebo osoba) a ne každý fond nebo vehikl zvlášť. Každý zařazený subjekt musí mít datovaný primární doklad o investici do firmy. Pilot na 30 VC subjektech ukázal, že tuto podmínku splní asi 80 % kandidátů. Údaje o tiketu a velikosti fondu jsou ale veřejně dostupné jen u zhruba poloviny záznamů. Plán A tedy rozsah nadsazuje, plán B ho podceňuje a ani jeden z nich neměří spolehlivost přesvědčivě.

## TL;DR
- **Kdo v databázi bude:** jen subjekty s datovaným primárním dokladem o investici do firmy. U VC musí být doklad nejvýš 24 měsíců starý, u PE, family office a velkých soukromých investorů nejvýš 36 měsíců. Jednotkou je správce, fondy jsou k němu připojené záznamy. Fondy fondů (EIF, NRI) jdou do oddělené tabulky. Odhad pro ČR je 110–230 investorů působících z ČR a 80–150 zahraničních investorů s doloženou investicí do české firmy. Plán A (350–600) počítá některé subjekty dvakrát, plán B (70–160) vynechává zahraniční investory a anděly.
- **Pilot (30 subjektů, stav k 11. 10. 2026):** 24 z 30 subjektů (80 %, Wilsonův 95% interval 62,7–90,5 %) má primární datovaný doklad z posledních 24 měsíců. 20 subjektů získalo stupeň A, 5 stupeň B, 3 jsou kandidáti k ověření, 1 je na watchlistu a 1 byl vyřazen. Deklarovaný tiket je dostupný u 45 % záznamů se stupněm A (interval 25,8–65,8 %), velikost fondu s datem u 55 % (34,2–74,2 %). Výsledky jsou předběžné, dokud je nezkontroluje nezávislá druhá osoba.
- **Náklady:** pilot vyjde na zhruba 58 tis. Kč, plné české pokrytí na zhruba 374 tis. Kč a údržba v ČR na zhruba 100–130 tis. Kč ročně. Celosvětové rozšíření při kombinaci ručního ověřování a automatizace stojí 9,1 mil. Kč (minimální scénář, 15 tis. záznamů), 21,1 mil. Kč (realistický, 30 tis.) nebo 48,9 mil. Kč (plný, 60 tis.). Roční údržba činí 25–35 % ceny výstavby. Rozhodující předpoklad je, že automatizace sníží ruční práci na 0,35–0,5 hodiny na záznam. To musí ověřit pilot.

---

## 0) Srovnání plánů A a B a co z nich přebírá nový plán

### 0.1 Srovnávací tabulka

| Požadavek zadání | Plán A (Claude) | Plán B (ChatGPT) | Nový plán |
|---|---|---|---|
| Kdo je a není v databázi | Detailní pravidla, stupně A/B/C/X, CVC zařazeny, fondy fondů zvlášť | Dvě skupiny podle české relevance, výčet vyřazených typů | Pravidla z A a česká relevance z B, k tomu rozhodovací strom a testovatelné hraniční případy |
| Ověření pravosti | Hierarchie zdrojů, pravidla pro konflikty | Hodnoty „nezveřejněno / nedohledáno / ověřeno“, nezávislost zdrojů (jedna tisková zpráva ≠ dva důkazy) | Obojí a navíc stupeň jistoty u každého pole |
| Odhad okruhu a počtu | 350–600; kategorie „150–300 vehiklů ČNB“ se překrývá s VC/PE | 70–160 jen ze dvou katalogů | 190–380, triangulace z transakčních dat, katalogů a fondů fondů; skupiny 1 a 2 odděleně |
| Zdroj a datum u každého záznamu | Částečně; část údajů z agregátorů a placené CC+ | Požadováno, ale neprovedeno | Povinné datum události, publikace a kontroly; agregátory jen pro vyhledání kandidátů |
| Pilot na vzorku | 25 VC; vlastní pravidla místy porušena | Žádný | 30 subjektů včetně obtížných případů, pravidla uplatněna striktně |
| Měření přesnosti | Hodnotil tentýž autor, bez intervalů | Dobrá metodika (zmrazení, kontrolor), ale nepoužitá | Metodika z B, předběžná čísla z pilotu, Wilsonovy intervaly, šablona pro kontrolora |
| Globální náklady | Aritmeticky nekonzistentní (součet ~760 tis. EUR vs. uvedených 1,2–1,6 mil. EUR) | Jen lineární model hodin, bez opory v počtu investorů | Kombinovaný model (ruční práce, inženýrství, LLM, právo, QA, údržba), tři scénáře se součty, které sedí |

### 0.2 Ověřené a doplněné nedostatky

**Plán A**
1. **Dvojí počítání se potvrdilo.** Statistika ČNB počítá fondy, ne investory. V listopadu 2025 evidovala 1 025 rezidentských investičních fondů: 123 akciových, 72 dluhopisových, 73 smíšených, 172 nemovitostních, 534 ostatních a 51 bez investiční politiky. „Ostatní“ fondy přitom podle ČNB investují hlavně do vkladů, úvěrů a nemovitostí, ne do podílů ve firmách.\[1\] Odvodit z toho „150–300 vehiklů se skutečnou investicí do firem“ nelze. Údaje navíc nejsou k 31. 12. 2025, jak plán A uvádí, ale ke konci listopadu 2025. V prosinci 2025 ČNB fondy překlasifikovala: fondy s proměnným základním kapitálem, které zřizují podfondy, vyřadila ze seznamu jako pomocné finanční instituce.\[2\] Časové řady proto před a po této změně nejsou srovnatelné.
2. **Chybně přiřazený zdroj.** Číslo „79 transakcí, 13,49 mld. Kč za rok 2025“ nepochází od Czech Founders. Je to analýza projektu ROLU.cz. Czech Founders VC je v ní jen jedním z nejaktivnějších investorů.\[3\]\[4\]
3. **Kruhové měření.** Plán uvádí „přesnost ~90 %“ dřív, než pilot proběhl, a pilot hodnotil tentýž autor.
4. **Porušení vlastních pravidel.** DEPO je doloženo závazkem LP do fondu, ne investicí do firmy. V databázi zůstaly záznamy s doklady staršími 24 měsíců a část údajů pochází z agregátorů a z placené CC+.
5. **Zastaralá data převzatá z CVCA.** Profily řádných členů na webu CVCA jsou často z roku 2020. Credo tam má „Volume of Funds Managed EUR 170 million“ a Tilia „CZK 62,7 mil.“.\[5\] Novější údaje jsou jinde: Credo Stage 5 má 88 mil. USD (CzechCrunch, březen 2026), Tilia II podle tiskové zprávy Tilie (Startup Kitchen) oznámila „successful €26 million first closing of its second fund“ s podporou EIF (InvestEU) a České spořitelny.
6. **Nerealizované fondy jako investoři.** DeepTech fond NRI byl podle MPO teprve připravován. Ještě 5. 8. 2026 šlo o návrh na zřízení „Venture fondu NRI“ s 1 mld. Kč pro 5–7 fondů.\[6\]\[7\] Takový fond nemůže být v databázi jako aktivní investor.
7. Dále chybí definice české relevance, sémantika částek, harmonogram a rozpočet pilotu. Rozpor AKAT vs. ČNB zůstal nevysvětlen (viz kapitola 10).

**Plán B**
1. Pilot vůbec neprovedl.
2. **Katalogy jsou nestabilní a nečisté.** Stránka řádných členů CVCA má 27 položek, ale LinkedIn CVCA uvádí 19 řádných členů z celkem 68. Mezi položkami je dluhový věřitel CVI („Direct Lending, Senior Debt, Mezzanine“) a čestný člen Tilia.\[5\]\[8\] Anglická verze CzechStartups ukazuje 44 investorů, ne 52. Katalog navíc obsahuje crowdfundingovou platformu HitHit a M&A poradce Limerock.\[9\]\[10\]
3. Odhad 70–160 nezahrnuje zahraniční investory, i když v měsíčních přehledech CzechCrunch tvoří značnou část jmen v kolech českých startupů.
4. Chybí stupeň jistoty u polí, režim GDPR, zmínka o uzavření evidence skutečných majitelů a globální model opřený o počty investorů.

---

## 1) Rozsah a jednotka záznamu

### 1.1 Kategorie

| Kategorie | Definice pro databázi | Typické doklady |
|---|---|---|
| **VC** | Profesionální správce, který investuje do minoritních podílů v rané a růstové fázi | Tisková zpráva, web, CzechCrunch, EIF |
| **PE** | Správce, který kupuje majoritní nebo významné podíly (buyout, růstový kapitál) | Web, tisková zpráva, CVCA, Sbírka listin |
| **CVC (podtyp VC)** | Investiční rameno korporace nebo banky s vlastním mandátem a opakovanými investicemi | Inven Capital (ČEZ), Seed Starter (Česká spořitelna) |
| **Family office** | Struktura, která spravuje majetek rodiny a doloženě investuje do firem | Výroční zprávy, tiskové zprávy |
| **Anděl** | Fyzická osoba se ≥1 jmenovitě doloženou investicí do firmy | Tisková zpráva financované firmy, CzechCrunch |
| **Velký soukromý investor** | Fyzická osoba nebo osobní holding s ≥2 doloženými přímými investicemi | Média, obchodní rejstřík |
| **Fond fondů** (oddělená tabulka) | Investuje do fondů, ne do firem | EIF CZFoF 50 mil. EUR, RRF FoF 55 mil. EUR\[11\] |

Hranice „≥10 mil. Kč na investici“ z plánu B je zrušena, protože se v praxi ověřit nedá. Velkého soukromého investora vymezuje počet doložených investic, ne jejich výše.

### 1.2 Česká relevance

- **Skupina 1 (působí z ČR):** sídlo správce nebo investičního týmu je v ČR, případně má česká pobočka vlastní investiční mandát.
- **Skupina 2 (zahraniční investor relevantní pro ČR):** má doloženou investici v rámci okna aktivity
  - **2a** do české právnické osoby (ověřitelné přes IČO v ARES), nebo
  - **2b** do zahraniční firmy s českými zakladateli (tak to počítají CzechCrunch i ROLU.cz).\[4\]\[12\] Položka 2b se vždy výslovně označí.
- Pouhé zaměření na „CEE“ relevanci nezakládá.

### 1.3 Datový model

Správce ↔ fond ↔ investice ↔ důkaz. Na každou investici připadá ≥1 důkaz a každý důkaz má URL, datum události, datum publikace, datum kontroly a typ zdroje.

---

## 2) Pravidla zařazení a vyřazení

### 2.1 Rozhodovací strom

1. **Je identita ověřitelná?** U právnické osoby přes IČO/LEI nebo zahraniční registr, u fyzické osoby jménem a vazbou na investici. Ne → **vyřazen**.
2. **Investuje vlastní nebo spravovaný kapitál do podílů ve firmách** (equity, kvazi-equity, konvertibilní nástroje)? Jen zprostředkovává, radí nebo provozuje platformu → **vyřazen**.
3. **Existuje datovaný doklad o investici v okně aktivity?** VC a anděl 24 měsíců, PE, FO a velký soukromý investor 36 měsíců.
   - Ano → pokračuj na krok 4.
   - Je doložen jen fundraising nebo závazek LP → **watchlist**.
   - Doklad je starší → **historický**.
4. **Je splněna česká relevance** (skupina 1, 2a nebo 2b)? Ne → mimo rozsah.
5. **Lze určit kategorii?** Ano → **zařazen**, stupeň A nebo B. Nejasné → **zařazen B** s poznámkou ke kategorii.

**Proč 24 a 36 měsíců:** Podle VC Deals Report 2025 kanceláře Ambit (dříve Mavericks), jak ho citoval BusinessInfo.cz, „v roce 2025 proběhlo v Česku přibližně 100 venture kapitálových investic, čtyři z pěti investic míří do nejranějších fází“, s mediánem investice 500 tis. EUR. CzechCrunch napočítal 75 oznámených kol.\[13\] Aktivní VC proto obvykle oznámí aspoň jednu investici za dva roky. PE dělá v ČR jen jednotky transakcí ročně: CVCA profily uvádějí 1–60 obchodů za celou historii,\[5\] Invest Europe 9 českých firem s buyoutovou nebo růstovou investicí v roce 2024.\[14\] Kratší okno by u PE vyřazovalo skutečné investory.

### 2.2 Hraniční případy

| Případ | Rozhodnutí | Zdůvodnění |
|---|---|---|
| Holding s jednou dceřinou firmou | Vyřazen | Nejde o investiční činnost |
| Holding s opakovanými minoritními investicemi (např. Miton) | Zařazen B, typ „holding/CVC“ | Investuje opakovaně, typ je třeba ověřit |
| Poradce, advokát, M&A boutique (Ambit, Limerock) | Vyřazen jako investor, ponechán jako zdroj | Zprostředkovává |
| Crowdfundingová platforma (HitHit) | Vyřazena | Kapitál patří investorům platformy |
| Banka | Vyřazena; její CVC rameno (Seed Starter) zařazeno | Rozhoduje samostatný mandát |
| Realitní nebo dluhopisový FKI | Vyřazen | Neinvestuje do podílů ve firmách |
| Dluhový věřitel (CVI) | Vyřazen z VC/PE; zařazen jen s doloženou majetkovou investicí | Úvěr není investice do podílu |
| Správce podle § 15 ZISIF bez dokladu o investici | Kandidát | ČNB tyto správce pouze eviduje, nedohlíží na ně |
| Akcelerátor | Zařazen jen s doloženou kapitálovou investicí (Czech Founders VC: 40 tis. EUR)\[15\] | Rozhoduje kapitál, ne program |
| Nový fond bez investice (IP Lab Ventures) | Watchlist | Závazek LP do fondu ≠ investice do firmy |
| Startup s „Ventures“ v názvu | Vyřazen | Ověří se přes ARES (CZ-NACE, předmět činnosti) |
| Investice doložená jen agregátorem | Kandidát | Agregátor slouží jen k nalezení kandidáta |

---

## 3) Datový model a sémantika částek

### 3.1 Povinná pole

| Pole | Povinné | Stavy |
|---|---|---|
| Název, typ, skupina relevance, IČO/LEI, země | Ano | ověřeno / nedohledáno |
| Sektory, fáze | Ano | ověřeno (samodeklarace) / odvozeno z portfolia |
| Tiket | Ano (může zůstat „nezveřejněno“) | ověřeno / nezveřejněno / nedohledáno / odhad (jen s označením) |
| Velikost fondu | Ano | totéž; vždy s typem částky a rozhodným datem |
| AUM organizace | Ne | totéž |
| Poslední investice | Ano | firma, kolo, částka kola, podíl investora, datum události a publikace, URL |
| Stav aktivity | Ano | aktivní / historický / kandidát / watchlist / vyřazen |
| Stupeň jistoty záznamu | Ano | A / B / C / X |

### 3.2 Sémantika částek

- **Tiket ≠ velikost kola.** U ValkaAI je 12 mil. EUR celé pre-seed kolo pěti fondů a anděla.\[16\]\[17\] Podíly jednotlivých investorů zveřejněny nejsou.
- **Cílová velikost ≠ uzavřené závazky.**
  - Purple Ventures 2 má cíl 1 mld. Kč, přes 700 mil. Kč získal k 12. 3. 2026.\[18\]\[19\]
  - Tilia II hlásila 26 mil. EUR potvrzených z cílových 32 mil. EUR.\[20\]
  - U Credo Stage 5 (88 mil. USD) se zdroje rozcházejí, zda jde o first close, nebo final close.\[21\]\[22\] Pole se proto označí jako „konflikt“.
- **Fond ≠ AUM organizace.** Inven Capital uvádí na CVCA 250 + 250 mil. EUR v podfondech, každý údaj samostatně.\[5\]
- Částky se vedou v původní měně a s rozhodným datem. Přepočet na Kč se provádí kurzem ČNB k tomuto datu.

---

## 4) Mapa českých veřejných zdrojů

| Zdroj | Co je zdarma a veřejné | K čemu slouží | Omezení |
|---|---|---|---|
| ČNB: seznamy, JERRS, statistika fondů | Ano (xlsx, měsíčně) | Ověření licence a existence fondu | Počítá fondy, ne investory; přeřazení v prosinci 2025 |
| ARES, obchodní rejstřík, Sbírka listin | Ano | IČO, statutární orgány, účetní závěrky (vlastní kapitál fondu) | Závěrky se ukládají se zpožděním |
| Evidence skutečných majitelů | **Ne.** Pro veřejnost uzavřena od 17. 12. 2025\[23\] | — | Novela s „oprávněným zájmem“ je u vlády\[24\] |
| CVCA, řádní členové | Ano (27 položek) | Hledání kandidátů, samodeklarované tikety | Profily často z roku 2020 |
| CzechStartups (CzechInvest) | Ano (44 investorů v EN verzi) | Hledání kandidátů | Obsahuje crowdfunding a poradce |
| CzechCrunch: měsíční newsletter „dealy českých zakladatelů“, Startupové Česko | Ano | Primární zdroj pro VC transakce | Databáze CC+ je placená, proto se nepoužije; částky jsou místy „kvalifikované odhady“\[12\]\[25\] |
| ROLU.cz, Ambit VC Deals Report | Ano (souhrny) | Triangulace počtů | Ambit data anonymizuje\[26\] |
| EIF (Czechia), NRB/NRI | Ano | Fondy fondů, závazky LP | Závazek LP ≠ investice do firmy |
| Forbes, HN, E15, Hrot24, Lupa, euro.cz | Částečně (paywall) | Doplňkové doklady | Přebírají tiskové zprávy, což není nezávislý zdroj |
| Weby investorů a tiskové zprávy financovaných firem | Ano | Nejsilnější samodeklarace | Marketingový jazyk |
| Tracxn, CB Insights, Crunchbase, Dealroom, PitchBook | Omezeně | **Jen hledání kandidátů** | Nikdy se nepoužijí jako doklad |

---

## 5) Ověřovací proces a stupně jistoty

**Hierarchie zdrojů:**
1. úřední registr (ČNB, OR, ARES, SEC),
2. samodeklarace investora nebo firmy (tisková zpráva, web),
3. redakční zpracování (CzechCrunch, Forbes),
4. agregátor (jen pro nalezení kandidáta).

**Stupeň záznamu:**
- **A:** identita a ≥1 investice v okně aktivity doložená zdrojem úrovně 1–2, případně 3 s pojmenovanými stranami.
- **B:** splňuje A, ale má otevřenou otázku (typ, entita, jediný zdroj úrovně 3).
- **C:** doklad pochází jen z agregátoru nebo je mimo okno aktivity (kandidát nebo historický).
- **X:** vyřazen.

**Stupeň pole:** ověřeno / samodeklarováno / odvozeno / konflikt.

**Nezávislost zdrojů:** dvě média, která přebírají tutéž tiskovou zprávu, se počítají jako jeden zdroj.

**Konflikty:** platí novější údaj z vyšší úrovně hierarchie. Pokud se rozpor nedá vyřešit, uvedou se obě hodnoty se stavem „konflikt“. Příklad: J&T Ventures podle jednoho zdroje spravuje 40 mil. EUR, podle druhého 120 mil. EUR.\[27\]\[28\]

**Aktualizace:** transakce průběžně z měsíčního newsletteru CzechCrunch, strategie čtvrtletně, identita, aktivita a kapitál jednou ročně.

**Detekce zániku:** změna názvu nebo týmu (Presto Tech Horizons se podle CzechCrunch přejmenovala na Tech Horizons a odešli tři partneři),\[29\] výmaz z OR nebo ČNB, žádná investice v okně aktivity.

---

## 6) Odhad velikosti okruhu v ČR

### 6.1 Triangulace bez dvojího počítání

Odhad pracuje se správci. Fondy podle ČNB se počítají jen jako připojené záznamy, nikdy jako další investoři.

| Segment | Odhad | Z čeho vychází |
|---|---|---|
| Skupina 1, VC a CVC | 40–60 | Za 3 měsíce (prosinec 2025 až únor 2026) se v přehledech CzechCrunch objevilo zhruba 23 různých českých institucionálních jmen; trh má 75–100 transakcí ročně (CzechCrunch, ROLU.cz, Ambit)\[4\]\[13\]\[30\]\[31\] |
| Skupina 1, PE | 15–30 | Zhruba 12 PE členů CVCA se sídlem v ČR, k tomu Penta, Hartenberg, CEIP, BHM, RSBC a další z veřejných přehledů\[32\] |
| Skupina 1, FO a velcí soukromí investoři | 15–40 | Nízká jistota; doklady jsou jen u medializovaných investic |
| Skupina 1, andělé | 40–100 | Za dva měsíce newsletterů zhruba 12 jmenovaných andělů; při 24měsíčním okně a minimalizaci osobních údajů vychází 40–100 |
| **Skupina 1 celkem** | **110–230** | |
| Skupina 2 (zahraniční) | 80–150 | Za 3 měsíce zhruba 25 zahraničních fondů v kolech českých zakladatelů (Index, Northzone, Partech, 20VC, EQT, Atomico, Accel, Inovo a další)\[15\] |
| **Celkem** | **190–380** | |
| Fondy fondů (oddělená tabulka) | 3–6 | EIF (CZFoF, RRF FoF, CEFoF),\[11\] NRI po spuštění |

### 6.2 Očekávaná vyplněnost polí

| Pole | Očekávaná vyplněnost | Opora |
|---|---|---|
| Doklad o investici (A/B) | 80–90 % zařazených | Pilot: 24/30 kandidátů |
| Sektory a fáze | 85–95 % | Samodeklarace na webech |
| Tiket | 30–45 % u institucí, <10 % u andělů | Pilot: 45 % |
| Velikost fondu s datem | 45–60 % u VC a PE; u FO a andělů téměř 0 % | Pilot: 55 % |
| IČO (skupina 1) | >95 % | ARES |

---

## 7) Pilot: 30 VC subjektů (stav k 11. 10. 2026)

### 7.1 Vzorek a výsledky

U každého záznamu je uvedena investice, datum a zdroj. „CC newsletter 2. 1. 2026“ znamená přehled prosincových dealů v CzechCrunch.

| # | Subjekt | Sk. | Doložená investice (firma, kolo, kolo celkem) | Datum / zdroj | Fond (typ, datum) | Tiket (deklarovaný) | Stav |
|---|---|---|---|---|---|---|---|
| 1 | Credo Ventures | 1 | Duvo.ai, pre-seed+seed, 16,5 mil. USD; Picogrid, 45 mil. USD\[30\]\[33\] | CC newsletter 2. 1. 2026; Lupa 2. 6. 2026 | Stage 5: 88 mil. USD (konflikt first/final close), CC 23. 3. 2026\[21\] | 1–5 mil. USD (CC)\[21\] | A |
| 2 | Kaya VC | 1 | Jutro Medical (PL), Series A, 24 mil. EUR; Viktor, 75 mil. USD\[30\]\[34\] | CC 2. 1. 2026; Lupa 20. 5. 2026 | Fond V: first close 70 mil. EUR, cíl 80 mil. EUR (Vestbee, 25. 6. 2025) | 1–3 mil. EUR první investice (EU-Startups, 25. 6. 2025) | A |
| 3 | Purple Ventures | 1 | Vetstor, seed, 1 mil. EUR;\[30\] Rightcharge, 14 mil. Kč | CC 2. 1. 2026; fxstreet 3. 9. 2026 | PV2: >700 mil. Kč získáno, cíl 1 mld. Kč (12. 3. 2026) | 6–19 mil. Kč (CC)\[35\] | A\[18\]\[19\] |
| 4 | Czech Founders VC | 1 | Carta Genum, pre-seed, 40 tis. EUR; Spicy Cells, 40 tis. EUR\[36\] | CC 2. 2. a 2. 3. 2026 | konflikt: ~30 mil. EUR (Lupa)\[37\] vs. 250 mil. Kč od 45 zakladatelů (CzechCrunch) | 40 tis. EUR na vstupu, další financování až do 250 tis. EUR (euro.cz) | A |
| 5 | Rockaway Ventures | 1 | ValkaAI, pre-seed, 12 mil. EUR (lead) | TZ Rockaway 24. 2. 2026 | nedohledáno v primárním zdroji | nezveřejněno | A\[17\] |
| 6 | J&T Ventures | 1 | ValkaAI (citace D. Polacha v TZ) | TZ Rockaway 24. 2. 2026 | konflikt 40 vs. 120 mil. EUR\[27\]\[28\] | nezveřejněno | A\[17\] |
| 7 | Tensor Ventures | 1 | ValkaAI; PangeAI, pre-seed, 1 mil. USD\[30\] | TZ 24. 2. 2026; CC 2. 1. 2026 | koinvestiční fond: cíl 1,25 mld. Kč (Hrot24)\[38\] | 250 tis.–1 mil. EUR (CVCA, 2023)\[5\] | A\[17\] |
| 8 | BD Partners | 1 | ValkaAI | TZ Rockaway 24. 2. 2026 | nezveřejněno | nezveřejněno | A\[17\] |
| 9 | Jet Venture 1 (Jet Investment) | 1 | GigaScan 2,1 mil. EUR, Phantasma Labs 2,1 mil. EUR, Hermetiq, AppNava\[39\] | CC 17. 9. 2026 | cíl „až 50 mil. EUR“\[39\] | nezveřejněno | A |
| 10 | Zaka VC | 1 | Vetstor, seed | CC 2. 1. 2026 | jen agregátor (C) | nezveřejněno | A |
| 11 | Seed Starter (ČS), CVC | 1 | Repsense (LT), 1,1 mil. EUR\[30\] | CC 2. 1. 2026 | nezveřejněno | nezveřejněno | A |
| 12 | Inven Capital (ČEZ), CVC | 1 | Andercore (DE), 40 mil. USD | CC 2. 3. 2026 | 250 + 250 mil. EUR (CVCA)\[5\] | 2–30 mil. EUR (CVCA)\[5\] | A\[40\] |
| 13 | Tech Horizons (dříve Presto Tech Horizons) | 1 | Atmos Space Cargo, 25,7 mil. EUR\[29\] | CC 22. 4. 2026 | 150 mil. EUR (6/2024)\[41\] | nezveřejněno | A |
| 14 | Tilia Impact Ventures | 1 | Theorema, pre-seed, 70 mil. Kč\[42\] | CC ~3/2026 | Tilia II: 26 z 32 mil. EUR\[20\] | 300 tis.–1,5 mil. EUR (LinkedIn Tilia) | A |
| 15 | i&i Biotech Fund | 1 | Theorema | CC ~3/2026 | nezveřejněno | nezveřejněno | A\[43\] |
| 16 | Reflex Capital | 1 | Merchantee, ~1,8 mil. EUR (lead)\[44\] | euro.cz 9. 6. 2026 | Fond III: 22 mil. EUR (~540 mil. Kč), CC 22. 12. 2023 | ~1 mil. EUR, výjimečně ~2 mil. EUR (CC 22. 12. 2023) | A |
| 17 | Lighthouse Ventures | 1 | Merchantee (koinvestor)\[44\] | euro.cz 9. 6. 2026 | nezveřejněno | nezveřejněno | A |
| 18 | Orbit Capital | 1 | Jutro Medical (PL), 24 mil. EUR\[30\] | CC 2. 1. 2026 | growth: „scaling to EUR 200 mil.“ (CVCA)\[5\] | 6–15 mil. EUR (CVCA)\[5\] | A |
| 19 | Soulmates Ventures | 1 | FluoSphera (CH), 29 mil. Kč; Rightcharge (lead) | CC 2. 2. 2026; fxstreet 3. 9. 2026 | nezveřejněno | nezveřejněno | A\[15\]\[19\] |
| 20 | Index Ventures | 2b | Duvo.ai, 16,5 mil. USD; eNOugh, 2,7 mil. USD\[30\] | CC 2. 1. 2026 | mimo rozsah pilotu | nezveřejněno | A (relevance 2b, sídlo firem neověřeno) |
| 21 | United Founders | 1 | Spuštění fondu, 2 nejmenované investice; AMI Labs jen přes agregátor citující CC | CC 4. 11. 2025 | cíl 80 mil. EUR, závazek týmu 17 mil. EUR\[37\]\[45\] | 100 tis.–1 mil. EUR\[46\] | B |
| 22 | Fond Naše Česko | 1 | ValkaAI | TZ Rockaway 24. 2. 2026 | nezveřejněno | nezveřejněno | B (typ nejasný)\[17\] |
| 23 | JIC Ventures | 1 | Aiviro, 450 tis. EUR\[30\] | CC 2. 1. 2026 | až 400 mil. Kč (Forbes); fond zahájen 7. 4. 2026\[47\]\[48\] | pre-seed/seed\[49\] | B (investice předchází startu fondu, entitu nutno ověřit) |
| 24 | Crescendo Ventures | 1 | Aiviro | CC 2. 1. 2026 | nezveřejněno | nezveřejněno | B (identita: ověřit vazbu na Crescendo Equity Partners) |
| 25 | Miton | 1 | Whisper, 300 tis. EUR | CC 2. 3. 2026 | nezveřejněno | nezveřejněno | B (typ holding/VC)\[50\] |
| 26 | Presto Ventures | 1 | Ready Player Me je exit (prosinec 2025), ne nová investice;\[30\] Choice jen agregátor | CC 2. 1. 2026 | — | — | Kandidát |
| 27 | Depo Ventures | 1 | Jen agregátor (WanderWallet); profil CVCA bez dat | — | 5,5 mil. EUR (CVCA, 2023)\[5\] | 50–300 tis. EUR\[5\] | Kandidát |
| 28 | Nation 1 | 1 | Nic v posledních 24 měsících | — | 35 mil. EUR (CVCA, 2020)\[5\] | 50 tis.–1,5 mil. EUR\[5\] | Kandidát / historický |
| 29 | IP Lab Ventures | 1 | Jen závazek LP od EIF ~27 mil. EUR, cíl >50 mil. EUR\[51\] | EIF 24. 9. 2026 | cíl >50 mil. EUR | — | Watchlist |
| 30 | HitHit (kontrolní negativní případ) | — | Crowdfundingová platforma uvedená v katalogu CzechStartups\[9\] | — | — | — | Vyřazen |

### 7.2 Opravy dat z plánu A, které pilot přinesl
- **Credo:** 170 mil. EUR (CVCA, 2020) nahrazuje Stage 5 s 88 mil. USD,\[5\]\[21\] se stavem „konflikt“ ohledně uzavření.
- **Presto Tech Horizons** je nově Tech Horizons.\[29\] Presto Ventures nemá v posledních 24 měsících primární doklad o nové investici, a proto je kandidátem.
- **DEPO:** závazek LP neplatí jako doklad. Bez primárního dokladu o investici do firmy je kandidátem.
- **„Czech Founders: 79 transakcí“** je ve skutečnosti údaj ROLU.cz. Czech Founders VC a United Founders jsou dva různé subjekty.\[4\]\[52\]
- **Tilia:** 62,7 mil. Kč (CVCA) je zastaralý údaj.\[5\]
- **Orbit a Soulmates:** pomocná rešerše je vedla jako „bez aktivity“, ale v přehledech CzechCrunch mají doklady z prosince 2025, února a září 2026.\[15\]\[19\] Rešerše neopírající se o primární měsíční přehledy tedy vede k falešně negativním výsledkům.

### 7.3 Předběžné metriky (jedna osoba, bez nezávislé kontroly)

| Metrika | Výsledek | Wilsonův 95% interval |
|---|---|---|
| Kandidáti s primárním datovaným dokladem ≤24 měsíců | 24/30 = 80 % | 62,7–90,5 % |
| Přesnost zařazení (zařazení A+B, kteří jsou skutečnými investory) | 25/25 = 100 % | 86,7–100 % |
| Deklarovaný tiket (A) | 9/20 = 45 % | 25,8–65,8 % |
| Velikost fondu s typem a datem (A) | 11/20 = 55 % | 34,2–74,2 % |
| Pole ve stavu „konflikt“ | 3 (Credo, J&T, Czech Founders VC) | — |

Čas na jeden záznam se v této rešerši kontrolovaně neměřil, údaj proto chybí. Měřit se bude v kontrolní fázi.

### 7.4 Jak měření dokončit
1. **Zmrazení:** tato tabulka a pravidla v kapitole 2 se uloží jako verze 1.0 a před kontrolou se nemění.
2. **Nezávislá kontrola:** druhá osoba bez přístupu k hodnocení naslepo zkontroluje všech 30 záznamů a doklady k nim.
3. **Referenční seznam pro záchyt:** všichni investoři uvedení v přehledech CzechCrunch za 12 měsíců. Spočítá se podíl těch, které databáze zachytila.
4. **Metriky:** přesnost zařazení, záchyt, správnost typu, správnost polí (sektor, fáze, tiket, fond), vyplněnost, čas na záznam a shoda hodnotitelů (Cohenovo kappa).
5. **Šablona vyhodnocení:** ID | rozhodnutí v1.0 | rozhodnutí kontrolora | shoda (A/N) | chybné pole | typ chyby (identita / aktivita / typ / částka / datum) | čas v minutách.

---

## 8) Harmonogram a rozpočet

Sazba 800 Kč/h pro analytika je převzata z plánu B. Pracovní předpoklad je, že jde o externího juniorního analytika. Mzdovou statistikou ověřena není a před zadáním je třeba ji potvrdit nabídkou. Inženýrská sazba 1 500 Kč/h a projektová 1 200 Kč/h jsou rovněž předpoklady. Přepočet: 25 Kč = 1 EUR (zaokrouhleno).

**Pilot (2 týdny)**

| Role | Hodiny | Kč |
|---|---|---|
| Analytik (rešerše, doklady) | 40 | 32 000 |
| Nezávislý kontrolor | 12 | 9 600 |
| Metodik | 8 | 6 400 |
| Mezisoučet | 60 | 48 000 |
| Rezerva 20 % | | 9 600 |
| **Celkem** | | **57 600** |

**Plné české pokrytí (zhruba 300 záznamů, 6–8 týdnů)**

| Položka | Hodiny |
|---|---|
| Ověření záznamů (vážený průměr 0,8 h × 300) | 240 |
| Hledání kandidátů a deduplikace | 60 |
| Nezávislá kontrola vzorku 10 % a vyhodnocení | 30 |
| Metodika, GDPR, posouzení oprávněného zájmu (LIA) | 30 |
| Řízení | 30 |
| **Celkem** | **390 h × 800 = 312 000 Kč; s rezervou 20 % 374 400 Kč (≈ 15 tis. EUR)** |

Údržba v ČR vyjde na 30–40 % ceny výstavby, tedy zhruba 100–130 tis. Kč ročně.

---

## 9) Celosvětové rozšíření

### 9.1 Velikost globálního okruhu

| Ukazatel | Hodnota | Zdroj a poznámka |
|---|---|---|
| VC firmy v USA | 3 111 (2024) | NVCA 2025 Yearbook / PitchBook; firmy, které uzavřely fond v posledních 8 ročnících\[53\] |
| US VC v roce 2025 | 15 352 obchodů, 320 mld. USD; 585 fondů získalo 67 mld. USD | NVCA 2026 Yearbook (13. 4. 2026)\[54\]\[55\] |
| Evropa (PE + VC) | Invest Europe sbírá data od >1 750 firem; podle reportu za rok 2025 investovalo 1 854 firem | Invest Europe, 7. 5. 2026\[56\]\[57\] |
| Single family offices | 8 030 (2024): Severní Amerika 3 180, APAC 2 290, Evropa 2 020 | Deloitte Private; odhad z dotazníku mezi 354 SFO\[58\]\[59\] |
| PE firmy celosvětově | Nemám ověřený veřejný počet; 31 653 (Preqin) je marketingové číslo | Neověřeno |

**Scénáře:** minimální 15 tis. záznamů (aktivní VC a PE v hlavních regionech), realistický 30 tis. (navíc FO s přímými investicemi, CVC a klíčoví andělé), plný 60 tis. (navíc širší okruh andělů a historické záznamy). Rozdělení mezi regiony a typy je odhad, ne změřený údaj.

### 9.2 Regionální registry
- **USA:** Form ADV (data od 1. 1. 2025 na IAPD), poradci s výjimkou z registrace (exempt reporting advisers), Form D.\[60\] Malí VC poradci s méně než 25 mil. USD AUM se u SEC jako ERA registrovat nemohou, pokud nepůsobí v 15 a více státech.\[61\] Registr je proto u nejmenších fondů neúplný.
- **EU:** ESMA (EuVECA), národní dozory, lucemburský RCS/CSSF. Rejstříky skutečných majitelů jsou od rozsudku SDEU C-37/20 a C-601/20 z 22. 11. 2022 v mnoha státech uzavřeny. V ČR se evidence uzavřela 17. 12. 2025\[62\] a novela zavádí přístup na základě oprávněného zájmu.\[24\]
- **APAC:** jazyková a registrová roztříštěnost. Proto se počítá s příplatkem za lokalizaci.

### 9.3 Kombinovaný model nákladů (aritmeticky konzistentní)

Předpoklady: automatizace (scraping, LLM extrakce, entity resolution) sníží ruční ověřování na 0,35 / 0,4 / 0,5 h na záznam. Příplatek za lokalizaci je 0,15 h na záznam u 30 % (realistický scénář) nebo 40 % (plný scénář) záznamů. Kontrola: 0,5 h na záznam ve vzorku 5 % nebo 10 %. Rezerva 15 %.

| Položka | Minimální (15 tis.) | Realistický (30 tis.) | Plný (60 tis.) |
|---|---|---|---|
| Ruční ověření (h) | 5 250 | 12 000 | 30 000 |
| Lokalizace (h) | 0 | 1 350 | 3 600 |
| QA vzorek (h) | 375 | 750 | 3 000 |
| **Analytické hodiny × 800 Kč** | 5 625 h = 4 500 000 | 14 100 h = 11 280 000 | 36 600 h = 29 280 000 |
| Inženýrství × 1 500 Kč | 1 500 h = 2 250 000 | 3 000 h = 4 500 000 | 5 000 h = 7 500 000 |
| Řízení a metodika × 1 200 Kč | 600 h = 720 000 | 1 200 h = 1 440 000 | 2 500 h = 3 000 000 |
| Právo (DPIA, LIA, více jurisdikcí) | 300 000 | 600 000 | 1 500 000 |
| Infrastruktura, LLM, data | 150 000 | 500 000 | 1 200 000 |
| Mezisoučet | 7 920 000 | 18 320 000 | 42 480 000 |
| Rezerva 15 % | 1 188 000 | 2 748 000 | 6 372 000 |
| **Celkem Kč** | **9 108 000** | **21 068 000** | **48 852 000** |
| **Celkem EUR (25 Kč/EUR)** | **364 320** | **842 720** | **1 954 080** |
| Roční údržba 25–35 % | 2,28–3,19 mil. Kč | 5,27–7,37 mil. Kč | 12,21–17,10 mil. Kč |

**Citlivost:** pokud automatizace nesníží ruční práci pod 0,75 h na záznam, vzroste realistický scénář o 10 500 h × 800 Kč = 8,4 mil. Kč. S rezervou to dělá +9,66 mil. Kč, celkem tedy zhruba 30,7 mil. Kč.

---

## 10) Rizika a omezení

- **GDPR u andělů:** právní základ je oprávněný zájem podle čl. 6 odst. 1 písm. f) s písemným posouzením (LIA). Platí informační povinnost podle čl. 14 a minimalizace: jméno, role, doložené investice a zdroj, nic dalšího. Na námitku musí být možné reagovat.
- **Uzavřené rejstříky majitelů** brání ověřit, kdo stojí za vehikly a FO. Taková pole zůstávají ve stavu „nedohledáno“.
- **Odhady v médiích:** CzechCrunch u Startupového Česka výslovně uvádí, že částky jsou místy „kvalifikované odhady“ a vycházejí i z neveřejných informací.\[12\] Takové částky se označí jako odhad.
- **Rozdílné metodiky trhu** pro rok 2025:

| Zdroj | Počet transakcí | Objem | Co počítá |
|---|---|---|---|
| CzechCrunch | 75 kol\[30\] | 9,8 mld. Kč (13,33 mld. Kč včetně exitů)\[12\] | Oznámená kola\[12\]\[13\] |
| ROLU.cz | 79 transakcí | 13,49 mld. Kč | Investice |
| Ambit | zhruba 100 | — | VC investice, včetně neveřejných |

  Žádné z těchto čísel se nesmí použít jako počet investorů.
- **AKAT vs. ČNB:** ČNB vykazuje fondový kapitál rezidentských fondů (1 979,3 mld. Kč k listopadu 2025).\[1\] Číslo AKAT jsem neověřil. Rozdíl je pravděpodobně metodický: jiný okruh fondů, zahraniční fondy distribuované v ČR, rozhodné datum. Pro databázi investorů do firem není podstatný.
- **Pseudofondy a správci podle § 15:** mohou mít jen evidenci bez dohledu. Bez dokladu o investici zůstávají kandidáty.
- **Zastarání:** profily na CVCA i v katalozích stárnou. Rozhoduje datum posledního dokladu.

---

## 11) Doporučené pořadí realizace a kritéria go/no-go

1. **Týden 1–2:** dokončit pilot. Nezávislá kontrola 30 záznamů, změření času a záchytu vůči přehledům CzechCrunch za 12 měsíců.
2. **Go/no-go po pilotu:**
   - spodní mez Wilsonova intervalu pro přesnost zařazení ≥85 %,
   - 100 % zařazených s datovaným dokladem,
   - správnost polí sektor a fáze ≥90 %,
   - Cohenovo kappa ≥0,8,
   - medián času ≤45 min na záznam.
3. **Týden 3–10:** plné české pokrytí (VC → PE → skupina 2 → andělé → FO). LIA hotová před zveřejněním údajů o fyzických osobách.
4. **Před globálním rozšířením:** pilot automatizace na 300 záznamech z jednoho zahraničního trhu (např. Polsko nebo Německo) s cílem ≤0,5 h ruční práce na záznam. Pokud se to nepodaří, počítá se s citlivostním scénářem (zhruba 30,7 mil. Kč místo 21,1 mil. Kč).
5. **Údržba:** měsíčně transakce, čtvrtletně strategie, ročně kapitál a aktivita, s historií změn.

Doporučení: realizovat nový plán v tomto pořadí. Tvrzení o přesnosti zveřejnit až po nezávislé kontrole. Do té doby čísla v kapitole 7.3 prezentovat jako předběžná.

## Sources

1. [Komentář ke statistice investičních fondů - Česká národní banka](https://www.cnb.cz/cs/statistika/menova_bankovni_stat/harm_stat_data/komentar-ke-statistice-investicnich-fondu/index.html)
2. [Seznam investičních fondů - Česká národní banka](https://www.cnb.cz/cs/statistika/menova_bankovni_stat/seznamy-instituci-pro-potreby-menove-a-financni-statistiky/seznam-investicnich-fondu/)
3. [Startupy v roce 2025 bojovaly. Proudily do nich investice za 13,5 miliardy, většinu pobraly tři největší firmy - Lupa.cz](https://www.lupa.cz/clanky/startupy-v-roce-2025-bojovaly-proudily-do-nich-investice-za-13-5-miliardy-vetsinu-pobraly-tri-nejvetsi-firmy/)
4. [Czech Startups Attracted CZK 13.49 Billion in Investments in 2025 according to ROLU.cz](https://startupkitchen.community/czech-startups-attracted-czk-13-49-billion-in-investments-in-2025/)
5. [Full members – CVCA](https://cvca.cz/en/category/full-members/)
6. [Národní rozvojová investiční společně s MPO připravily DeepTech fond pro startupy - NRB](https://www.nrb.cz/narodni-rozvojova-investicni-spolecne-s-mpo-pripravily-deeptech-fond-pro-startupy/)
7. [Ministerstvo chce podpořit české startupy miliardou korun. Finové dali miliardu eur - Ekonomický deník](https://ekonomickydenik.cz/podporit-ceske-startupy-miliarda/)
8. [Czech Private Equity and Venture Capital Association (CVCA)](https://cz.linkedin.com/company/czech-private-equity-and-venture-capital-association-cvca)
9. [Investors - CzechStartups.gov.cz](https://czechstartups.gov.cz/en/startup-ecosystem/investors/)
10. [Homepage - CzechStartups.gov.cz](https://czechstartups.gov.cz/en/)
11. [EIF in my country](https://www.eif.org/supporting-smes/eif-near-me/czechia)
12. [Startupové Česko v roce 2025 | Data a trendy](https://cc.cz/startupovecesko/)
13. [Dva miliardové dealy, tři překonaly hranici půlmiliardy. Toto jsou nejvyšší investice českých startupů](https://cc.cz/dva-miliardove-dealy-tri-prekonaly-hranici-pulmiliardy-toto-jsou-nejvyssi-investice-ceskych-startupu/)
14. [Investeurope](https://www.investeurope.eu/media/wvrnw0lr/20250619_invest-europe_cee-report-2024.pdf)
15. [Lepší později než nikdy. Českým i evropským startupům svítá na dobré časy, důležité jsou pro ně tři novinky](https://cc.cz/lepsi-pozdeji-nez-nikdy-ceskym-i-evropskym-startupum-svita-na-dobre-casy-dulezite-jsou-pro-ne-tri-novinky/)
16. [ValkaAI získává investici 12 milionů eur pod vedením Rockaway Ventures](https://www.rockawaycapital.com/cs/aktuality/valkaai-ziskava-investici-12-milionu-eur-pod-vedenim-rockaway-ventures)
17. [€12M Investment in ValkaAI Led by Rockaway Ventures](https://www.rockawaycapital.com/en/news/e12m-investment-in-valkaai-led-by-rockaway-ventures)
18. [Purple Ventures spouští druhý fond, na startupy chtějí mít miliardu - CzechCrunch](https://cc.cz/brnensti-purple-ventures-spousti-druhy-fond-do-startupu-chteji-proinvestovat-pres-miliardu-korun/)
19. [Purple Ventures](https://www.fxstreet.cz/klicova-slova+purple-ventures.html)
20. [Rozhodují, jestli startup získá peníze. Profily více než stovky investorů jsou už na jednom místě](https://cc.cz/rozhoduji-jestli-startup-ziska-penize-profily-vice-nez-stovky-investoru-jsou-uz-na-jednom-miste/)
21. [Elitní čeští investoři mají dvě miliardy pro startupové rakety - CzechCrunch](https://cc.cz/zazivame-nejvetsi-pokrok-za-20-let-elitni-cesti-investori-maji-dalsi-dve-miliardy-pro-startupove-rakety/)
22. [Venture capital in the Czech Republic](https://en.wikipedia.org/wiki/Venture_capital_in_the_Czech_Republic)
23. [Evidence skutečných majitelů bude od 17. prosince 2025 neveřejná](https://danovky.cz/cs/evidence-skutecnych-majitelu-bude-od-17-prosince-2025-neverejna)
24. [Evidence skutečných majitelů se změní: přístup už nebude veřejný - Ministerstvo spravedlnosti České republiky - Portál justice](https://msp.gov.cz/en/web/msp/tiskove-zpravy/-/clanek/evidence-skute%C4%8Dn%C3%BDch-majitel%C5%AF-se-zm%C4%9Bn%C3%AD-p%C5%99%C3%ADstup-u%C5%BE-nebude-ve%C5%99ejn%C3%BD)
25. [Komunitní předplatné CC+ - CzechCrunch](https://cc.cz/plus/)
26. [Ambit Legal — CEE Law Firm for Ambitious Entrepreneurs](https://ambit.law/en)
27. [J&T Ventures — VC Fund Profile](https://hub.waveup.com/funds/j-t-ventures)
28. [J&T Ventures](https://podim.org/podim_partner/jt-ventures/)
29. [Startupový fond nejbohatšího Čecha opustili někteří partneři a mění název. Jeho mise zůstává stejná](https://cc.cz/tichy-konec-strnadovych-startupovych-partaku-odesli-tri-partneri-fondu-ten-ted-meni-i-nazev/)
30. [Zmapovali jsme všechny investice, které loni oznámily české startupy. Neseme tři dobré a tři špatné zprávy](https://cc.cz/zmapovali-jsme-vsechny-investice-ktere-loni-oznamily-ceske-startupy-neseme-tri-dobre-a-tri-spatne-zpravy/)
31. [Investice do českých startupů: méně dealů, větší investice, přísnější investoři](https://vedavyzkum.cz/inovace-a-transfer/inovace-a-transfer/investice-do-ceskych-startupu-mene-dealu-vetsi-investice-prisnejsi-investori)
32. [Czech Republic Private Equity Firm Investors: M&A Activity, Portfolio Companies, & Contacts](https://mergr.com/czech-republic-private-equity-firm-investors)
33. [České Credo Ventures investovalo do amerického startupu, který vyvíjí technologie pro Pentagon - Lupa.cz](https://www.lupa.cz/aktuality/ceske-credo-ventures-investovalo-do-americkeho-startupu-ktery-vyviji-technologie-pro-pentagon/)
34. [Pražská Kaya se zapojila do investice, která má pomoct rozšířit AI pracovníky po firmách - Lupa.cz](https://www.lupa.cz/aktuality/prazska-kaya-se-zapojila-do-investice-ktera-ma-pomoct-rozsirit-ai-pracovniky-po-firmach/)
35. [Purple, Presto, Kaya a další. Investoři mají apetit, startupové fondy nabírají další miliardy korun](https://cc.cz/purple-presto-kaya-a-dalsi-investori-maji-apetit-startupove-fondy-nabiraji-dalsi-miliardy-korun/)
36. [czech founders vc - Euro.cz](https://www.euro.cz/n/czech-founders-vc/)
37. [Vít Horký (United Founders): Dokázali jsme, že technologické klenoty umíme ulovit. Hrát na česko-slovenském písečku ale opravdu nestačí - Lupa.cz](https://www.lupa.cz/clanky/vit-horky-united-founders-dokazali-jsme-ze-technologicke-klenoty-umime-ulovit-hrat-na-cesko-slovenskem-pisecku-ale-opravdu-nestaci/)
38. [Přes miliardu na umělou inteligenci i kvantové technologie. Česko přispěje do fondu s venture kapitálem](https://www.hrot24.cz/clanek/pomoc-startupum-v-pre-seedu-do-noveho-investicniho-vc-fondu-od-tensor-ventures-pritecou-stovky-milionu-HaxYp)
39. [Miliardář Fait a spol. investovali za měsíc do startupů 150 milionů - CzechCrunch](https://cc.cz/brnenska-startupova-ofenziva-miliardar-igor-fait-a-spol-investovali-behem-mesice-pres-150-milionu/)
40. [AppFactor - Products, Competitors, Financials, Employees, Headquarters Locations](https://www.cbinsights.com/company/appfactor)
41. [Presto Ventures a CSG Michala Strnada rozjíždí investiční fond. Do pokročilých technologií a bezpečnostních inovací plánují zainvestovat 150 milionů eur](https://www.czdefence.cz/clanek/presto-ventures-a-csg-michala-strnada-rozjizdi-investicni-fond-do-pokrocilych-technologii-a-bezpecnostnich-inovaci-planuji-zainvestovat-150-milionu-eur)
42. [Investor jej přesvědčil, že peníze na startup nepotřebuje. Nejlepší rozhodnutí, jaké jsem udělal, říká](https://cc.cz/investor-jej-presvedcil-ze-penize-na-startup-nepotrebuje-nejlepsi-rozhodnuti-jake-jsem-udelal-rika/)
43. [Kaya VC Portfolio Investments, Kaya VC Funds, Kaya VC Exits](https://www.cbinsights.com/investor/enern)
44. [Lighthouse Ventures - Portfolio, Partners, Reviews, News](https://parsers.vc/fund/lhv.vc/)
45. [Dvě miliardy pro startupy. Havrlant s Horkým spouštějí fond United Founders](https://forbes.cz/dve-miliardy-pro-evropske-startupy-horky-s-havrlantem-spousteji-fond-united-founders/)
46. [Havrlant spoluzakládá United Founders. Nový fond chce do evropských technologií investovat 2 miliardy - Lupa.cz](https://www.lupa.cz/aktuality/havrlant-spoluzaklada-united-founders-novy-fond-chce-do-evropskych-technologii-investovat-2-miliardy/)
47. [Univerzity jako spolumajitelé. Nový fond JIC má nakopnout české startupy](https://forbes.cz/univerzity-jako-spolumajitele-novy-fond-jic-ma-nakopnout-ceske-startupy/)
48. [Venture - CzechCrunch](https://cc.cz/startupy/venture/)
49. [JIC Ventures](https://www.caplight.com/investor/jic-cz)
50. [Vůči vládě jsem byl skeptický, přiznává. Teď pracuje na největší změně startupového prostředí v historii Česka](https://cc.cz/vuci-vlade-jsem-byl-skepticky-priznava-ted-pracuje-na-nejvetsi-zmene-startupoveho-prostredi-v-historii-ceska/)
51. [European Investment Fund backs first Czech IP Lab Ventures Fund I with about €27 million to commercialize AI and deep-tech research - fundsforNGOs News](https://news.fundsforngos.org/2026/09/28/eif-backs-czech-ai-tech-transfer-fund-ip-lab-ventures-27m/)
52. [Nový fond Jakuba Havrlanta: Dal do něj stovky milionů a spojuje stovku úspěšných podnikatelů](https://cc.cz/novy-fond-jakuba-havrlanta-dal-do-nej-stovky-milionu-a-spojuje-stovku-uspesnych-podnikatelu/)
53. [YEARBOOK](https://nvca.org/wp-content/uploads/2025/03/2025-NVCA-Yearbook.pdf)
54. [NVCA Releases 2026 Yearbook: Charts a Venture Industry in Transition - National Venture Capital Association - NVCA](https://nvca.org/press_releases/nvca-releases-2026-yearbook-charts-a-venture-industry-in-transition/)
55. [NVCA Releases 2026 Yearbook: Charts a Venture Industry in Transition](https://www.morningstar.com/news/pr-newswire/20260413ph32328/nvca-releases-2026-yearbook-charts-a-venture-industry-in-transition)
56. [Investing in Europe: Private Equity Activity 2025 RESEARCH INVESTING IN EUROPE:](https://www.investeurope.eu/media/2icnrmzc/20260507-invest-europe-activity-data-report-2025.pdf)
57. [Annual activity statistics](https://www.investeurope.eu/publications-policy/publications/2025/activity-data-dashboard/)
58. [Deloitte: Number of Family Offices to Grow 75% by 2030](https://www.dakota.com/fundraising-news/deloitte-number-of-family-offices-to-grow-75-by-2030)
59. [Deloitte Projects Strong Growth for Family Offices Worldwide - The Family Office Professional](https://thefopro.com/deloitte-projects-strong-growth-for-family-offices-worldwide/)
60. [SEC.gov](https://www.sec.gov/foia-services/frequently-requested-documents/form-adv-data)
61. [Exempt Reporting Adviser (ERA): Definition & How to File](https://carta.com/learn/private-funds/regulations/exempt-reporting-adviser/)
62. [Evidence skutečných majitelů](https://ucto.cz/osvc/evidence-skutecnych-majitelu)
