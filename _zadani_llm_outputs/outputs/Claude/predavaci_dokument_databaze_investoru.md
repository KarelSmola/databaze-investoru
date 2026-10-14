# Předávací dokument: aplikace „Databáze investorů – pilot ČR“

## 0. Metadata

| Položka | Hodnota |
|---|---|
| Účel dokumentu | Předávací specifikace pro vývoj aplikace v Claude Code |
| Verze dokumentu | 2.0 (nahrazuje verzi 1.0 postavenou na `Claude_output_03.md`) |
| Datum | 13. 10. 2026 |
| Vstupy | `Zadání` (původní zadání, slovensky), `Claude_output_04.md` (vypracování) |
| Stav dat pilotu | k 11. 10. 2026; opravy z kontroly zdrojů 13. 10. 2026 |
| Verze dat pilotu | 1.1 (zmrazená, kap. 7.4 bod 1 v Příloze B) |
| Technologie | SPA, React, TypeScript; databáze Neon (PostgreSQL); kód na GitHubu; nasazení přes Vercel |
| Jazyk aplikace | čeština |

**Změny proti verzi 1.0 dokumentu**

| Oblast | Změna |
|---|---|
| Zdroj | `Claude_output_03.md` → `Claude_output_04.md` (všechny doslovné části převzaty znovu) |
| Pilot | Stupně A 22 / B 4 (dříve 21 / 5); United Founders stupeň A s pojmenovanými investicemi Wonderful.ai a EveryHealth; doplněné zdroje [65]–[68] |
| Metriky | Primární doklad 26/30; tiket 11/22; fond s typem a datem 9/22; nová metrika „částka fondu v jakékoli podobě“ 14/22; nové kritérium „A+B s primárním dokladem“ 26/26; jmenovité seznamy záznamů ke každé metrice |
| Datový model | Investice = kolo financování; vazba M:N správce ↔ kolo přes účast (role, podíl); částka kola uložena jednou na kole (kap. 1.3, 3.2) |
| Náklady | Údržba ČR 112–150 tis. Kč ročně, základ = cena výstavby včetně rezervy (shodně s globálními scénáři) |
| Technologie | Nová sekce 4: SPA React + TypeScript, Neon, GitHub, Vercel; DDL pro PostgreSQL (sekce 6.3), API (sekce 7) |
| Otevřené otázky | Body O-1 až O-10 verze 1.0 vyřešeny ve vypracování verze 04; nový seznam v sekci 10 |

**Struktura dokumentu**

| Část | Obsah |
|---|---|
| 1 | Cíl aplikace |
| 2 | Původní zadání (doslovně) |
| 3 | Výsledky vypracování: název, hlavní závěr, TL;DR, kapitola 0 (doslovně) |
| 4 | Technologie a architektura |
| 5 | Rozsah aplikace: moduly, funkční a nefunkční požadavky |
| 6 | Datový model včetně DDL pro Neon |
| 7 | API (Vercel Functions) |
| 8 | Business logika: rozhodovací strom, stupně, metriky, kalkulačka, triáž, go/no-go |
| 9 | Akceptační testy |
| 10 | Otevřené otázky |
| 11 | Postup implementace |
| Příloha A | Seed data pilotu 1.1: kola a 30 VC subjektů (JSON) |
| Příloha B | Kapitoly 1–11 z `Claude_output_04.md` (doslovně, obsah modulu Metodika) |
| Příloha C | Zdroje 1–68 (doslovně) |

---

## 1. Cíl aplikace

Webová aplikace, která:

1. Zpřístupňuje výsledky vypracování úlohy „Spolehlivá databáze investorů“: metodiku (kapitoly 1–11), srovnání plánů A a B (kapitola 0) a shrnutí (TL;DR).
2. Obsahuje pilotní databázi 30 VC subjektů (stav k 11. 10. 2026, verze dat 1.1) s doloženými koly financování, zdroji, daty, fondy, tikety a stavem zařazení, uloženou v databázi Neon.
3. Počítá metriky pilotu (kap. 7.3) přímo z dat včetně Wilsonových 95% intervalů a jmenovitých seznamů záznamů.
4. Podporuje dokončení měření (kap. 7.4): zmrazenou verzi 1.1, nezávislou kontrolu naslepo, výpočet shody a Cohenova kappa, záchyt vůči referenčnímu seznamu.
5. Vyhodnocuje kritéria go/no-go (kap. 9.4.6 a 11).
6. Obsahuje kalkulačku nákladů (kap. 8, 9.3, 9.4) s výchozími parametry, které přesně reprodukují čísla vypracování, a s možností měnit parametry.
7. Implementuje pravidla zařazení (rozhodovací strom, kap. 2.1) jako interaktivní průvodce a testovatelnou funkci.
8. Datovým modelem odpovídá kapitolám 1.3, 3 a 5, aby šel rozšířit na plné české pokrytí a celý svět.

---

## 2. Původní zadání (doslovně)

> **Spoľahlivá databáza investorov**
>
> Úloha sa týka databázy investorov do firiem: VC fondov, private equity, family office, angel investorov a veľkých súkromných investorov. Kľúčová je spoľahlivosť dát: každý záznam musí byť skutočný investor, nie náhodná firma. Pri každom investorovi musí byť uvedené, v akom sektore pôsobí, do čoho bežne investuje a v akej výške, aký má celkový investičný kapitál a odkiaľ tieto informácie pochádzajú.
>
> Začnite plánom. Z neho musí byť jasné, kto v databáze bude a kto nie, teda podľa akých pravidiel subjekt zaradíte alebo vyradíte. Popíšte tiež, ako overíte pravosť a správne zaradenie záznamov. Odhadnite, aký okruh investorov je možné z verejných zdrojov získať, približne koľko ich bude a aká bude spoľahlivosť dát. Uveďte, z čoho odhad vychádza.
>
> Plán následne overte na menšej vzorke, napríklad na VC fondoch v jednej krajine. Pri každom zázname uveďte zdroj a dátum, ktoré dokladajú, že subjekt skutočne investuje. Na ručne overenej vzorke zmerajte presnosť. Na záver odhadnite náklady na rozšírenie na celý svet.
>
> Používajte výhradne verejne dostupné dáta.

**Mapování požadavků zadání na části aplikace**

| Požadavek zadání | Kapitola vypracování | Modul aplikace |
|---|---|---|
| Typy investorů (VC, PE, FO, andělé, velcí soukromí investoři) | 1.1 | Metodika, Pilotní databáze (pole `kategorie`) |
| Skutečný investor, ne náhodná firma | 2, 5 | Rozhodovací strom, Pilotní databáze (`stupen`, doklady) |
| Sektor, do čeho investuje, výše, celkový kapitál, zdroj | 3 | Datový model, detail záznamu |
| Pravidla zařazení a vyřazení | 2 | Metodika, Rozhodovací strom |
| Ověření pravosti a zařazení | 5 | Metodika, Nezávislá kontrola |
| Okruh, počet, spolehlivost, z čeho odhad vychází | 6 | Metodika |
| Pilot na menší vzorce se zdrojem a datem u každého záznamu | 7.1 | Pilotní databáze |
| Měření přesnosti na ručně ověřené vzorce | 7.3, 7.4 | Metriky, Nezávislá kontrola |
| Náklady na rozšíření na celý svět | 8, 9 | Kalkulačka nákladů |
| Výhradně veřejná data | 4, 10 | Metodika, Zdroje |

---

## 3. Výsledky vypracování (doslovně z `Claude_output_04.md`)

### 3.1 Název

**Spolehlivá databáze investorů: nový plán pro ČR, provedený pilot na 30 VC investorech a odhad nákladů na celý svět (verze s AI jako první linií ověřování)**

### 3.2 Hlavní závěr

Z veřejných zdrojů lze pro ČR sestavit ověřenou databázi zhruba 190–380 skutečně aktivních investorů. Platí to za podmínky, že jednotkou záznamu je správce (investiční organizace nebo osoba) a ne každý fond nebo vehikl zvlášť. Každý zařazený subjekt musí mít datovaný primární doklad o investici do firmy. Pilot na 30 VC subjektech ukázal, že tuto podmínku splní asi 87 % kandidátů. Deklarovaný tiket je ale veřejně dostupný jen u zhruba poloviny záznamů a velikost fondu s typem částky a rozhodným datem jen u zhruba dvou pětin. Plán A tedy rozsah nadsazuje, plán B ho podceňuje a ani jeden z nich neměří spolehlivost přesvědčivě.

### 3.3 TL;DR

- **Kdo v databázi bude:** jen subjekty s datovaným primárním dokladem o investici do firmy. U VC musí být doklad nejvýš 24 měsíců starý, u PE, family office a velkých soukromých investorů nejvýš 36 měsíců. Jednotkou je správce, fondy jsou k němu připojené záznamy. Fondy fondů (EIF, NRI) jdou do oddělené tabulky. Odhad pro ČR je 110–230 investorů působících z ČR a 80–150 zahraničních investorů s doloženou investicí do české firmy. Plán A (350–600) počítá některé subjekty dvakrát, plán B (70–160) vynechává zahraniční investory a anděly.
- **Pilot (30 subjektů, stav k 11. 10. 2026):** 26 z 30 subjektů (87 %, Wilsonův 95% interval 70,3–94,7 %) má primární datovaný doklad z posledních 24 měsíců. 22 subjektů získalo stupeň A, 4 stupeň B, 2 jsou kandidáti k ověření, 1 je na watchlistu a 1 byl vyřazen. Všech 26 zařazených (A+B) má primární datovaný doklad o investici. Deklarovaný tiket je dostupný u 50 % záznamů se stupněm A (interval 30,7–69,3 %). Velikost fondu s typem částky a rozhodným datem je u 41 % (23,3–61,3 %), částka fondu v jakékoli podobě u 64 % (43,0–80,3 %). Výsledky jsou předběžné, dokud je nezkontroluje nezávislá druhá osoba.
- **Náklady:** pilot vyjde na zhruba 58 tis. Kč, plné české pokrytí na zhruba 374 tis. Kč a údržba v ČR na zhruba 112–150 tis. Kč ročně (30–40 % z ceny výstavby včetně rezervy, stejně jako u globálních scénářů). Celosvětové rozšíření s AI jako první linií ověřování (člověk řeší jen výjimky a audit) stojí 7,6 mil. Kč (minimální scénář, 15 tis. záznamů), 16,2 mil. Kč (realistický, 30 tis.) nebo 33,5 mil. Kč (plný, 60 tis.). Proti modelu bez AI triáže (9,1 / 21,1 / 48,9 mil. Kč) jde o úsporu 16–31 %. Ruční práce klesá z 0,35–0,5 na 0,12–0,16 hodiny na záznam. Roční údržba činí 25–35 % ceny výstavby. Rozhodující předpoklady jsou dva: AI sama odbaví 70–80 % záznamů a chybovost těchto záznamů v auditu nepřekročí 5 %. Obojí musí ověřit pilot automatizace (kapitola 9.4.6).

### 3.4 Kapitola 0

#### 0) Srovnání plánů A a B a co z nich přebírá nový plán

##### 0.1 Srovnávací tabulka

| Požadavek zadání | Plán A (Claude) | Plán B (ChatGPT) | Nový plán |
|---|---|---|---|
| Kdo je a není v databázi | Detailní pravidla, stupně A/B/C/X, CVC zařazeny, fondy fondů zvlášť | Dvě skupiny podle české relevance, výčet vyřazených typů | Pravidla z A a česká relevance z B, k tomu rozhodovací strom a testovatelné hraniční případy |
| Ověření pravosti | Hierarchie zdrojů, pravidla pro konflikty | Hodnoty „nezveřejněno / nedohledáno / ověřeno“, nezávislost zdrojů (jedna tisková zpráva ≠ dva důkazy) | Obojí a navíc stupeň jistoty u každého pole |
| Odhad okruhu a počtu | 350–600; kategorie „150–300 vehiklů ČNB“ se překrývá s VC/PE | 70–160 jen ze dvou katalogů | 190–380, triangulace z transakčních dat, katalogů a fondů fondů; skupiny 1 a 2 odděleně |
| Zdroj a datum u každého záznamu | Částečně; část údajů z agregátorů a placené CC+ | Požadováno, ale neprovedeno | Povinné datum události, publikace a kontroly; agregátory jen pro vyhledání kandidátů |
| Pilot na vzorku | 25 VC; vlastní pravidla místy porušena | Žádný | 30 subjektů včetně obtížných případů, pravidla uplatněna striktně |
| Měření přesnosti | Hodnotil tentýž autor, bez intervalů | Dobrá metodika (zmrazení, kontrolor), ale nepoužitá | Metodika z B, předběžná čísla z pilotu, Wilsonovy intervaly, šablona pro kontrolora |
| Globální náklady | Aritmeticky nekonzistentní (součet ~760 tis. EUR vs. uvedených 1,2–1,6 mil. EUR) | Jen lineární model hodin, bez opory v počtu investorů | Kombinovaný model (ruční práce, inženýrství, LLM, právo, QA, údržba), tři scénáře se součty, které sedí; varianta s AI triáží snižuje ruční práci pod 0,2 h na záznam |

##### 0.2 Ověřené a doplněné nedostatky

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

## 4. Technologie a architektura

### 4.1 Technologický stack

| Vrstva | Technologie | Závaznost |
|---|---|---|
| Frontend | SPA, React, TypeScript | závazné |
| Build a dev server | Vite | návrh |
| Routing | React Router (klientský routing) | návrh |
| Vykreslení Markdownu kapitol | `react-markdown` + `remark-gfm` (tabulky) | návrh |
| Backend (API) | Vercel Functions v TypeScriptu (adresář `/api`) | závazné (vyplývá z Vercelu a z toho, že SPA nesmí mít přístup k DB) |
| Databáze | Neon (serverless PostgreSQL) | závazné |
| DB driver | `@neondatabase/serverless` | návrh |
| Migrace | verzované SQL soubory v `db/migrations` (případně Drizzle ORM) | návrh |
| Validace dat | Zod (seed, vstupy API) | návrh |
| Testy | Vitest | návrh |
| Repozitář | GitHub | závazné |
| Nasazení | Vercel napojený na GitHub repozitář | závazné |
| CI | GitHub Actions: typecheck, lint, testy; Vercel build | návrh |

### 4.2 Architektura

```
Prohlížeč (React SPA)
   │  fetch /api/*
   ▼
Vercel Functions (/api/*.ts)  ── sdílená logika (shared/) ──  metriky, Wilson, kappa, strom, kalkulačka
   │  @neondatabase/serverless (DATABASE_URL, jen na serveru)
   ▼
Neon PostgreSQL (data pilotu, zdroje, verze, kontrola, historie)
```

- Connection string k Neonu je jen v proměnných prostředí Vercelu, nikdy v kódu SPA ani v repozitáři.
- Logika výpočtů (`shared/`) je čistý TypeScript bez závislosti na DB a UI; používá ji frontend (kalkulačka, průvodce) i API (metriky) a pokrývají ji jednotkové testy.
- Texty kapitol 0–11 a TL;DR jsou statický obsah verzovaný v Gitu (`content/*.md`) a přibalený do SPA. Data (pilot, zdroje, kontrola, verze, historie) jsou v Neonu.
- SPA routing na Vercelu: `vercel.json` přepisuje všechny cesty mimo `/api/*` na `index.html`.

### 4.3 Prostředí

| Prostředí | Git | Vercel | Neon |
|---|---|---|---|
| Lokální vývoj | libovolná větev | `vercel dev` nebo Vite + lokální funkce | vlastní Neon větev `dev` |
| Preview | pull request | Preview Deployment | Neon větev pro každý preview (integrace Vercel–Neon) |
| Produkce | `main` | Production Deployment | hlavní větev `main` |

Proměnné prostředí: `DATABASE_URL` (pooled, pro API), `DATABASE_URL_UNPOOLED` (migrace a seed). Při použití integrace Vercel–Neon je nastaví integrace.

### 4.4 Struktura repozitáře

```
/
├─ api/                         # Vercel Functions (TypeScript)
│  ├─ spravci/index.ts          # GET seznam s filtry
│  ├─ spravci/[id].ts           # GET detail
│  ├─ kola/[id].ts              # GET detail kola s účastníky
│  ├─ zdroje.ts
│  ├─ metriky.ts
│  ├─ kontrola/...              # hodnocení kontrolora, referenční seznam
│  ├─ verze/...
│  └─ export.ts
├─ shared/                      # čistá logika: wilson.ts, kappa.ts, metriky.ts, strom.ts, kalkulacka/*.ts, typy
├─ src/                         # React SPA (moduly M1–M9)
├─ content/                     # kapitoly 0–11, TL;DR (Markdown, doslovně z Příloh B a sekce 3)
├─ data/
│  ├─ pilot_v1.1.json           # Příloha A
│  └─ zdroje.json               # Příloha C převedená do JSON
├─ db/
│  ├─ migrations/0001_init.sql  # sekce 6.3
│  └─ seed.ts                   # načte data/*.json do Neonu
├─ tests/                       # akceptační testy sekce 9
├─ vercel.json
└─ README.md
```

---

## 5. Rozsah aplikace

### 5.1 Moduly

| ID | Modul | Obsah | Zdroj dat | Priorita |
|---|---|---|---|---|
| M1 | Přehled | Název, hlavní závěr, TL;DR, klíčové metriky počítané z dat, stav pilotu (předběžný / po kontrole) | `content/`, Neon | MVP |
| M2 | Pilotní databáze | 30 subjektů a 25 kol financování: tabulka, filtry, fulltext, detail správce a kola, export | Neon | MVP |
| M3 | Metodika | Kapitoly 0–11 jako navigovatelné stránky | `content/` | MVP |
| M4 | Rozhodovací strom | Interaktivní průvodce kap. 2.1, hraniční případy kap. 2.2 | `shared/strom.ts` | MVP |
| M5 | Metriky pilotu | Metriky kap. 7.3 s Wilsonovými intervaly a jmenovitými seznamy | Neon + `shared/` | MVP |
| M6 | Nezávislá kontrola | Šablona kap. 7.4, hodnocení naslepo, kappa, záchyt | Neon | MVP |
| M7 | Go/no-go | Kritéria kap. 11 bod 2 a kap. 9.4.6 | Neon (M5, M6, ruční vstupy) | MVP |
| M8 | Kalkulačka nákladů | Kap. 8, 9.3, 9.4 včetně citlivostí | `shared/kalkulacka/`; uložené varianty v Neonu | MVP |
| M9 | Zdroje | Zdroje 1–68 se zpětnými odkazy | Neon | MVP |

### 5.2 Funkční požadavky

**M1 Přehled**
- FR-01 Zobrazit název, hlavní závěr a TL;DR (sekce 3).
- FR-02 Zobrazit klíčové metriky z M5 (počítané z dat, ne pevně vepsané) a rozložení stavů A / B / kandidát / watchlist / vyřazen.
- FR-03 Zobrazit stav měření „Předběžné – bez nezávislé kontroly“, dokud v M6 není dokončená kontrola všech 30 záznamů.

**M2 Pilotní databáze**
- FR-10 Tabulka 30 záznamů se sloupci kap. 7.1: #, Subjekt, Sk., Doložená investice (firma, kolo, kolo celkem), Datum / zdroj, Fond (typ, datum), Tiket (deklarovaný), Stav. Texty sloupců zobrazit doslovně (pole `*_text` v Příloze A).
- FR-11 Filtry: stav aktivity, stupeň, skupina relevance (1 / 2a / 2b), kategorie, má deklarovaný tiket, má fond s typem a datem, má částku fondu v jakékoli podobě, obsahuje konflikt, má primární doklad ≤24 měsíců.
- FR-12 Fulltext nad názvy subjektů, dalšími názvy a názvy financovaných firem.
- FR-13 Detail správce: účasti v kolech (firma, kolo, „kolo celkem“, role, podíl, doklady), ostatní události (exit, závazek LP, doklad jen z agregátoru), fondy včetně všech hodnot při konfliktu, tiket, poznámka ke stupni, opravy z kap. 7.2, dřívější názvy.
- FR-14 Detail kola: firma, kolo, částka kola, všichni účastníci z databáze s rolí a podílem, doklady. Částka kola se nikdy nezobrazuje jako tiket investora ani se nesčítá přes investory (kap. 3.2).
- FR-15 Citace `[n]` všude v aplikaci jako odkazy na zdroj n v M9.
- FR-16 Export CSV a JSON (celý dataset i filtrovaný výběr).
- FR-17 Data verze 1.1 jsou jen ke čtení (vynucuje API podle `verze_dat.zmrazeno`). Změna vzniká jako nová verze s historií změn (datum, autor, pole, stará a nová hodnota, důvod).
- FR-18 Stupeň záznamu jako barevný štítek; u stavů kandidát, watchlist, vyřazen zobrazit důvod.

**M3 Metodika**
- FR-20 Kapitoly 1–11 (Příloha B) a kapitola 0 (sekce 3) jako stránky s obsahem a kotvami podkapitol. Text beze změn.
- FR-21 Tabulky renderovat jako tabulky, citace jako odkazy (FR-15).
- FR-22 Textové odkazy typu „kapitola 9.4.6“, „kap. 2.2“, „viz kapitola 10“ převést na interní odkazy.
- FR-23 Z kapitol 7.1, 7.3 a 8–9 odkazovat na živé moduly M2, M5 a M8.

**M4 Rozhodovací strom**
- FR-30 Průvodce kroky 1–5 (sekce 8.1) s výsledkem: vyřazen / watchlist / historický / kandidát / mimo rozsah / zařazen A / zařazen B (s poznámkou ke kategorii).
- FR-31 Tabulka hraničních případů kap. 2.2 s očekávaným rozhodnutím; každý případ lze spustit průvodcem a ověřit shodu.
- FR-32 Funkce `rozhodni(vstup) → výsledek` v `shared/strom.ts` (akceptační testy AT-30 až AT-42).

**M5 Metriky pilotu**
- FR-40 Metriky kap. 7.3 počítat z dat (sekce 8.4) včetně Wilsonova 95% intervalu.
- FR-41 U každé metriky zobrazit jmenovitý seznam záznamů v čitateli, ve skupině „částka uvedena, kritérium nesplňuje“ a bez hodnoty (kap. 7.3).
- FR-42 Počet polí ve stavu „konflikt“ a seznam dotčených záznamů.
- FR-43 Po dokončení kontroly (M6) zobrazit metriky kap. 7.4 bod 4.
- FR-44 Poznámka: „Čas na jeden záznam se v této rešerši kontrolovaně neměřil, údaj proto chybí. Měřit se bude v kontrolní fázi.“

**M6 Nezávislá kontrola**
- FR-50 Formulář podle šablony kap. 7.4 bod 5: ID | rozhodnutí v1.1 | rozhodnutí kontrolora | shoda (A/N) | chybné pole | typ chyby (identita / aktivita / typ / částka / datum) | čas v minutách.
- FR-51 Režim naslepo: kontrolor nevidí rozhodnutí v1.1, stupeň ani poznámky ke stupni, dokud své hodnocení záznamu neuloží. Vidí identitu subjektu a doklady. Vynucuje API (endpoint pro kontrolora tato pole nevrací).
- FR-52 Import referenčního seznamu (všichni investoři uvedení v přehledech CzechCrunch za 12 měsíců) z CSV pro výpočet záchytu; ruční mapování na `spravce.id`.
- FR-53 Výpočet: přesnost zařazení, záchyt, správnost typu, správnost polí (sektor, fáze, tiket, fond), vyplněnost, čas na záznam (medián), shoda hodnotitelů (Cohenovo kappa).
- FR-54 Export výsledků kontroly do CSV.

**M7 Go/no-go**
- FR-60 Kritéria ze sekce 8.7 se stavy splněno / nesplněno / čeká na data. Hodnoty z M5, M6 a z ručně zadaných výsledků pilotu automatizace (uložených v Neonu).

**M8 Kalkulačka nákladů**
- FR-70 Rozpočet pilotu a plného českého pokrytí (kap. 8) s editovatelnými hodinami, sazbami a rezervou; údržba ČR z ceny výstavby včetně rezervy.
- FR-71 Model bez AI triáže (kap. 9.3) a s AI triáží (kap. 9.4) pro tři scénáře, editovatelné parametry, výstupní tabulky ve struktuře dokumentu.
- FR-72 Srovnání (kap. 9.4.4) včetně podílu analytické práce a inženýrství na mezisoučtu.
- FR-73 Citlivosti (kap. 9.3 a 9.4.5) jako předdefinované varianty.
- FR-74 „Obnovit výchozí parametry“; výchozí parametry přesně reprodukují čísla dokumentu (AT-50 až AT-70).
- FR-75 Kurz Kč/EUR 25 (editovatelný).
- FR-76 Uložení pojmenované varianty parametrů do Neonu (tabulka `kalkulacka_varianta`).

**M9 Zdroje**
- FR-80 Seznam zdrojů 1–68 (Příloha C) s klikacími URL.
- FR-81 U každého zdroje zpětné odkazy: kapitoly, pilotní záznamy a kola, která ho citují.

### 5.3 Nefunkční požadavky

- NFR-01 UI v češtině. Čísla v českém formátu (mezera jako oddělovač tisíců, desetinná čárka), data `D. M. RRRR`; částečná data (`RRRR`, `RRRR-MM`) zobrazovat bez dne.
- NFR-02 TypeScript ve strict režimu ve frontendu, API i `shared/`.
- NFR-03 Bez placených API a placených datových zdrojů. Aplikace nestahuje data z webu.
- NFR-04 Původní texty (pole `*_text`) se ukládají vedle strukturovaných hodnot a nikdy se jimi nepřepisují.
- NFR-05 Částky v původní měně s rozhodným datem; přepočet na Kč jen pro zobrazení.
- NFR-06 GDPR: pilot neobsahuje fyzické osoby. Datový model podporuje `typ_osoby = 'FO'` s minimalizací (jméno, role, doložené investice, zdroj) a příznakem námitky.
- NFR-07 Žádné tajné údaje v repozitáři; `DATABASE_URL` jen v prostředí Vercelu a v lokálním `.env` (v `.gitignore`).
- NFR-08 Responzivní UI (desktop, mobil).
- NFR-09 Jednotkové testy pro `shared/` a akceptační testy ze sekce 9 v CI; seed je idempotentní (opakované spuštění dá stejný stav).

### 5.4 Mimo rozsah MVP

- Scraping katalogů, registrů a médií (kap. 9.4.1 krok 1).
- AI pipeline (modely A a B, deterministické kontroly, triáž); v aplikaci jen jako dokumentace a nákladový model. Datový model a sekce 8.6 jsou připraveny pro pozdější implementaci.
- Plné české pokrytí a globální data.

---

## 6. Datový model

Hierarchie podle kap. 1.3: **správce ↔ fond ↔ kolo (investice) ↔ důkaz**. Jedno kolo má více investorů; vazba M:N přes **účast** s rolí (lead / koinvestor) a podílem investora. Částka kola se ukládá jednou na kole; podíl investora je samostatné pole. Každý důkaz má URL, datum události, datum publikace, datum kontroly a typ zdroje.

### 6.1 Číselníky

| Číselník | Hodnoty |
|---|---|
| `kategorie` | `VC`, `PE`, `CVC` (podtyp VC), `FO` (family office), `andel`, `velky_soukromy_investor`, `fond_fondu`, `holding_CVC` (hraniční, k ověření), `nejasny`, `neinvestor` (jen vyřazené: platforma, poradce, banka apod.) |
| `typ_osoby` | `PO`, `FO` |
| `skupina_relevance` | `1`, `2a`, `2b` (vždy výslovně označit), `null` |
| `stav_aktivity` | `aktivni`, `historicky`, `kandidat`, `watchlist`, `vyrazen` |
| `stupen` | `A`, `B`, `C`, `X`, `null` (watchlist) |
| `stav_hodnoty` (kap. 3.1) | `overeno`, `nezverejneno`, `nedohledano`, `odhad` (jen s označením), `konflikt`, `jen_agregator`, `mimo_rozsah`, `neuvedeno` |
| `stupen_pole` (kap. 5) | `overeno`, `samodeklarovano`, `odvozeno`, `konflikt` |
| `uroven_zdroje` (kap. 5) | `1` úřední registr, `2` samodeklarace investora nebo firmy, `3` redakční zpracování, `4` agregátor |
| `typ_udalosti` (mimo kola) | `exit`, `zavazek_LP`, `jen_agregator`, `jiny` |
| `typ_castky` | `cil`, `first_close`, `uzavreny_fond`, `zavazky`, `zavazky_typ_uzavreni_nedohledan`, `ziskano`, `alokovano`, `podfond`, `zavazek_LP`, `AUM`, `neuvedeno` |
| `druh_castky` | `tiket`, `fond`, `aum` |
| `role` | `lead`, `koinvestor`, `null` (neuvedeno) |
| `typ_chyby` (kap. 7.4) | `identita`, `aktivita`, `typ`, `castka`, `datum` |
| `okno_aktivity_mesice` | VC, CVC a anděl 24; PE, FO a velký soukromý investor 36 |

### 6.2 Entity (logický model)

| Entita | Účel | Klíčová pole |
|---|---|---|
| `verze_dat` | Verze datasetu, zmrazení | `id` ('1.1'), `stav_k`, `zmrazeno`, `popis` |
| `zdroj` | Bibliografie 1–68 | `cislo`, `titulek`, `url` |
| `spravce` | Investor (jednotka záznamu) | identita, kategorie, relevance, stav, stupeň, doslovné texty sloupců 7.1, příznaky metrik |
| `fond` | Fond správce | `nazev`, `poznamka` |
| `castka` | Tiket, hodnota fondu, AUM | `druh_castky`, `min`, `max`, `mena`, `typ_castky`, `rozhodne_datum`, `stav_hodnoty`, `stupen_pole`, `text` |
| `kolo` | Kolo financování (investice) | `firma`, `zeme_firmy`, `ico_firmy`, `kolo`, `castka_kola`, `mena`, data |
| `ucast` | Účast správce v kole (M:N) | `role`, `podil_*`, `primarni_doklad`, `zdroj_text` |
| `udalost` | Události mimo kola (exit, závazek LP, jen agregátor) | `typ_udalosti`, `firma`, `castka`, `primarni_doklad` |
| `doklad` | Důkaz k účasti, kolu, události nebo částce | `zdroj_cislo` / `zdroj_text`, `url`, `uroven_zdroje`, 3 data, `nezavislost_skupina` |
| `hodnoceni_kontrolora` | Kap. 7.4 bod 5 | rozhodnutí, shoda, chybné pole, typ chyby, čas |
| `referencni_seznam` | Záchyt | investor z přehledů CzechCrunch, mapování na správce |
| `historie_zmen` | Audit změn mezi verzemi | entita, pole, stará/nová hodnota, důvod, autor |
| `go_nogo_vstup` | Ruční výsledky pilotu automatizace | kritérium, hodnota, datum |
| `kalkulacka_varianta` | Uložené parametry kalkulačky | název, `parametry` (jsonb) |

### 6.3 DDL pro Neon (PostgreSQL, `db/migrations/0001_init.sql`)

```sql
CREATE TABLE verze_dat (
  id            text PRIMARY KEY,                -- '1.1'
  stav_k        date NOT NULL,
  zmrazeno      boolean NOT NULL DEFAULT true,
  popis         text,
  vytvoreno     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE zdroj (
  cislo         integer PRIMARY KEY,             -- 1–68
  titulek       text NOT NULL,
  url           text NOT NULL
);

CREATE TABLE spravce (
  verze_id      text NOT NULL REFERENCES verze_dat(id),
  id            integer NOT NULL,                -- v pilotu 1–30 (pořadí kap. 7.1)
  nazev         text NOT NULL,
  dalsi_nazvy   text[] NOT NULL DEFAULT '{}',
  kategorie     text NOT NULL CHECK (kategorie IN ('VC','PE','CVC','FO','andel','velky_soukromy_investor','fond_fondu','holding_CVC','nejasny','neinvestor')),
  typ_osoby     text NOT NULL CHECK (typ_osoby IN ('PO','FO')),
  skupina_relevance text CHECK (skupina_relevance IN ('1','2a','2b')),
  ico           text,
  lei           text,
  zeme          text,
  sektory       text[] NOT NULL DEFAULT '{}',
  faze          text[] NOT NULL DEFAULT '{}',
  stav_aktivity text NOT NULL CHECK (stav_aktivity IN ('aktivni','historicky','kandidat','watchlist','vyrazen')),
  stupen        text CHECK (stupen IN ('A','B','C','X')),
  poznamka_stupne text,
  -- doslovné texty sloupců kap. 7.1
  subjekt_text  text NOT NULL,
  skupina_text  text NOT NULL,
  investice_text text NOT NULL,
  datum_zdroj_text text NOT NULL,
  fond_text     text NOT NULL,
  tiket_text    text NOT NULL,
  stav_text     text NOT NULL,
  -- příznaky metrik kap. 7.3
  ma_primarni_doklad_24m        boolean NOT NULL,
  je_skutecny_investor_predbezne boolean,
  tiket_deklarovany             boolean NOT NULL,
  fond_s_typem_a_datem          boolean,
  fond_castka_uvedena           boolean,
  kontrolni_negativni_pripad    boolean NOT NULL DEFAULT false,
  opravy_7_2    text[] NOT NULL DEFAULT '{}',
  datum_kontroly date,
  namitka_gdpr  boolean,
  PRIMARY KEY (verze_id, id)
);

CREATE TABLE fond (
  id            serial PRIMARY KEY,
  verze_id      text NOT NULL,
  spravce_id    integer NOT NULL,
  nazev         text,
  poznamka      text,
  FOREIGN KEY (verze_id, spravce_id) REFERENCES spravce(verze_id, id)
);

CREATE TABLE castka (
  id            serial PRIMARY KEY,
  verze_id      text NOT NULL,
  spravce_id    integer NOT NULL,
  fond_id       integer REFERENCES fond(id),     -- vyplněno pro druh 'fond'
  druh_castky   text NOT NULL CHECK (druh_castky IN ('tiket','fond','aum')),
  text          text,
  min           numeric,
  max           numeric,
  mena          text,
  typ_castky    text,
  rozhodne_datum text,                           -- 'RRRR', 'RRRR-MM' nebo 'RRRR-MM-DD'
  stav_hodnoty  text NOT NULL CHECK (stav_hodnoty IN ('overeno','nezverejneno','nedohledano','odhad','konflikt','jen_agregator','mimo_rozsah','neuvedeno')),
  stupen_pole   text CHECK (stupen_pole IN ('overeno','samodeklarovano','odvozeno','konflikt')),
  poznamka      text,
  FOREIGN KEY (verze_id, spravce_id) REFERENCES spravce(verze_id, id)
);

CREATE TABLE kolo (
  verze_id      text NOT NULL REFERENCES verze_dat(id),
  id            text NOT NULL,                   -- 'K01'…
  firma         text NOT NULL,
  zeme_firmy    text,
  ico_firmy     text,
  kolo          text,
  castka_kola   numeric,                         -- velikost celého kola, nikdy tiket investora
  mena          text,
  castka_text   text,
  datum_udalosti text,
  datum_publikace date,
  poznamka      text,
  PRIMARY KEY (verze_id, id)
);

CREATE TABLE ucast (
  id            serial PRIMARY KEY,
  verze_id      text NOT NULL,
  spravce_id    integer NOT NULL,
  kolo_id       text NOT NULL,
  role          text CHECK (role IN ('lead','koinvestor')),
  podil_castka  numeric,
  podil_stav    text NOT NULL DEFAULT 'nezverejneno',
  primarni_doklad boolean NOT NULL,
  zdroj_text    text NOT NULL,
  datum_publikace date,
  poznamka      text,
  FOREIGN KEY (verze_id, spravce_id) REFERENCES spravce(verze_id, id),
  FOREIGN KEY (verze_id, kolo_id) REFERENCES kolo(verze_id, id),
  UNIQUE (verze_id, spravce_id, kolo_id)
);

CREATE TABLE udalost (
  id            serial PRIMARY KEY,
  verze_id      text NOT NULL,
  spravce_id    integer NOT NULL,
  typ_udalosti  text NOT NULL CHECK (typ_udalosti IN ('exit','zavazek_LP','jen_agregator','jiny')),
  firma         text,
  castka        numeric,
  mena          text,
  datum_udalosti text,
  datum_publikace date,
  primarni_doklad boolean NOT NULL DEFAULT false,
  zdroj_text    text,
  poznamka      text,
  FOREIGN KEY (verze_id, spravce_id) REFERENCES spravce(verze_id, id)
);

CREATE TABLE doklad (
  id            serial PRIMARY KEY,
  verze_id      text NOT NULL REFERENCES verze_dat(id),
  ucast_id      integer REFERENCES ucast(id),
  kolo_verze_id text,
  kolo_id       text,
  udalost_id    integer REFERENCES udalost(id),
  castka_id     integer REFERENCES castka(id),
  spravce_id    integer,                         -- doklad k záznamu jako celku (např. HitHit)
  zdroj_cislo   integer REFERENCES zdroj(cislo),
  zdroj_text    text,
  url           text,
  uroven_zdroje smallint CHECK (uroven_zdroje BETWEEN 1 AND 4),
  datum_udalosti text,
  datum_publikace date,
  datum_kontroly date,
  nezavislost_skupina text,
  FOREIGN KEY (kolo_verze_id, kolo_id) REFERENCES kolo(verze_id, id),
  CHECK (num_nonnulls(ucast_id, kolo_id, udalost_id, castka_id, spravce_id) = 1),
  CHECK (zdroj_cislo IS NOT NULL OR zdroj_text IS NOT NULL)
);

CREATE TABLE hodnoceni_kontrolora (
  id            serial PRIMARY KEY,
  verze_id      text NOT NULL,
  spravce_id    integer NOT NULL,
  kontrolor     text NOT NULL,
  rozhodnuti_kontrolora text NOT NULL,           -- A / B / kandidat / historicky / watchlist / vyrazen
  shoda         boolean,                         -- dopočítá API po uložení
  chybne_pole   text,
  typ_chyby     text CHECK (typ_chyby IN ('identita','aktivita','typ','castka','datum')),
  cas_min       numeric,
  pole_spravne  jsonb,                           -- {"sektor":true,"faze":true,"tiket":false,"fond":true}
  poznamka      text,
  ulozeno       timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (verze_id, spravce_id) REFERENCES spravce(verze_id, id),
  UNIQUE (verze_id, spravce_id, kontrolor)
);

CREATE TABLE referencni_seznam (
  id            serial PRIMARY KEY,
  nazev_investora text NOT NULL,
  zdroj         text NOT NULL,
  datum         date,
  spravce_id    integer                          -- namapováno ručně; null = nezachycen
);

CREATE TABLE historie_zmen (
  id            serial PRIMARY KEY,
  verze_z       text NOT NULL,
  verze_do      text NOT NULL,
  entita        text NOT NULL,
  entita_id     text NOT NULL,
  pole          text NOT NULL,
  stara_hodnota text,
  nova_hodnota  text,
  duvod         text NOT NULL,
  autor         text NOT NULL,
  zmeneno       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE go_nogo_vstup (
  kriterium     text PRIMARY KEY,                -- G-6 … G-11
  hodnota       numeric,
  citatel       integer,
  jmenovatel    integer,
  poznamka      text,
  zadano        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE kalkulacka_varianta (
  id            serial PRIMARY KEY,
  nazev         text NOT NULL,
  parametry     jsonb NOT NULL,
  vytvoreno     timestamptz NOT NULL DEFAULT now()
);
```

### 6.4 Pravidla seedu (`db/seed.ts`)

1. Vložit `verze_dat` ('1.1', stav_k 2026-10-11, zmrazeno = true).
2. Vložit `zdroj` 1–68 z Přílohy C.
3. Vložit `kolo` z `kola` (Příloha A) a ke každému kolu doklady z `zdroje` (`kolo_id`).
4. Vložit `spravce`; ke každému `ucasti` → `ucast` + doklady (`ucast_id`); `udalosti` → `udalost` + doklady; `fondy[].hodnoty` → `fond` + `castka` (druh `fond`) + doklady (`castka_id`); `tiket` → `castka` (druh `tiket`) + doklady; `zdroje_zaznamu` → doklady (`spravce_id`).
5. `uroven_zdroje`: registry 1; tiskové zprávy a weby investorů (Rockaway [16][17], CVCA [5], EIF) 2; média 3; agregátory (např. [27]) 4. Při nejistotě ponechat null a doplnit při kontrole.
6. Seed je idempotentní: v transakci smaže a znovu vloží data verze 1.1.
7. Po seedu spustit validaci AT-01 až AT-17.

---

## 7. API (Vercel Functions)

| Metoda a cesta | Účel | Poznámka |
|---|---|---|
| `GET /api/spravci?verze=1.1&stav=&stupen=&skupina=&kategorie=&q=&priznak=` | Seznam pro M2 | filtry FR-11, fulltext FR-12 |
| `GET /api/spravci/:id?verze=1.1` | Detail správce | účasti s koly, události, fondy, tiket, doklady |
| `GET /api/kola/:id?verze=1.1` | Detail kola | všichni účastníci a doklady |
| `GET /api/zdroje` | Seznam zdrojů | se zpětnými odkazy (FR-81) |
| `GET /api/metriky?verze=1.1` | Metriky kap. 7.3 | počítá `shared/metriky.ts`; vrací čitatel, jmenovatel, podíl, Wilson, jmenovité seznamy |
| `GET /api/kontrola/zaznamy?kontrolor=` | Záznamy pro kontrolora | bez polí stupen, stav_text, poznamka_stupne, příznaků metrik, dokud kontrolor záznam neohodnotil |
| `POST /api/kontrola/hodnoceni` | Uložení hodnocení | dopočítá `shoda` |
| `GET /api/kontrola/vysledky` | Metriky kap. 7.4 bod 4 | přesnost, záchyt, kappa, medián času |
| `POST /api/kontrola/referencni-seznam` | Import CSV | |
| `GET /api/go-nogo` / `PUT /api/go-nogo/:kriterium` | Kritéria sekce 8.7 | ruční vstupy G-6 až G-11 |
| `GET/POST /api/kalkulacka/varianty` | Uložené varianty | |
| `GET /api/export?format=csv\|json&verze=1.1` | Export | |
| `POST /api/verze` | Nová verze z existující | kopie dat, `zmrazeno=false`; zápisy jen do nezmrazené verze, každá změna do `historie_zmen` |

Všechny zapisující endpointy vracejí 409, pokud je cílová verze zmrazená.

---

## 8. Business logika

### 8.1 Rozhodovací strom (kap. 2.1)

```
vstup:
  identita_overitelna: bool          # PO přes IČO/LEI/zahraniční registr; FO jménem a vazbou na investici
  investuje_do_podilu: bool          # equity, kvazi-equity, konvertibilní nástroje; false = zprostředkuje/radí/platforma
  kategorie: enum
  doklad: "v_okne" | "jen_fundraising_nebo_LP" | "starsi" | "zadny" | "jen_agregator"
  ceska_relevance: "1" | "2a" | "2b" | null
  kategorie_urcitelna: bool
  otevrena_otazka: bool             # typ, entita, jediný zdroj úrovně 3

okno = 24 pokud kategorie ∈ {VC, CVC, andel}, jinak 36

1. if not identita_overitelna            → VYRAZEN (X)
2. if not investuje_do_podilu            → VYRAZEN (X)
3. if doklad == "jen_fundraising_nebo_LP" → WATCHLIST
   if doklad == "starsi"                  → HISTORICKY (C)
   if doklad in {"zadny","jen_agregator"} → KANDIDAT (C)
4. if ceska_relevance is null            → MIMO_ROZSAH
5. if kategorie_urcitelna and not otevrena_otazka → ZARAZEN A
   else                                   → ZARAZEN B (s poznámkou ke kategorii / otevřené otázce)
```

- „Kandidát“ pro doklad jen z agregátoru vyplývá z kap. 2.2 (poslední řádek) a kap. 5 (stupeň C).
- Velký soukromý investor vyžaduje ≥2 doložené přímé investice, anděl ≥1 jmenovitě doloženou investici (kap. 1.1).
- Pouhé zaměření na „CEE“ relevanci nezakládá (kap. 1.2).
- Hraniční případy kap. 2.2 jsou testovací sada AT-30 až AT-42.

### 8.2 Stupně a zdroje (kap. 5)

- **A:** identita a ≥1 investice v okně aktivity doložená zdrojem úrovně 1–2, případně 3 s pojmenovanými stranami.
- **B:** splňuje A, ale má otevřenou otázku (typ, entita, jediný zdroj úrovně 3).
- **C:** doklad jen z agregátoru nebo mimo okno aktivity (kandidát nebo historický).
- **X:** vyřazen.
- **Konflikt:** platí novější údaj z vyšší úrovně hierarchie; nerozhodnutelný rozpor = obě hodnoty se stavem `konflikt`.
- **Nezávislost:** doklady se stejnou `nezavislost_skupina` se počítají jako jeden zdroj.

### 8.3 Okno aktivity

`v_okne = (datum_udalosti nebo datum_publikace) ≥ datum_vyhodnoceni − okno_aktivity_mesice`. Pro pilot `datum_vyhodnoceni = 2026-10-11`, tedy hranice VC 2024-10-11.

### 8.4 Metriky pilotu (kap. 7.3)

| Metrika | Čitatel | Jmenovatel | Hodnota v1.1 | Wilson 95 % |
|---|---|---|---|---|
| Kandidáti s primárním datovaným dokladem ≤24 měsíců | `ma_primarni_doklad_24m` | všech 30 | 26/30 = 86,7 % | 70,3–94,7 % |
| Přesnost zařazení | A/B a `je_skutecny_investor` | A/B | 26/26 = 100 % | 87,1–100 % |
| Zařazení A+B s primárním datovaným dokladem (kritérium go/no-go) | A/B a `ma_primarni_doklad_24m` | A/B | 26/26 = 100 % | 87,1–100 % |
| Deklarovaný tiket (A) | A a `tiket_deklarovany` | A | 11/22 = 50,0 % | 30,7–69,3 % |
| Velikost fondu s typem částky a rozhodným datem (A) | A a `fond_s_typem_a_datem` | A | 9/22 = 40,9 % | 23,3–61,3 % |
| Částka fondu v jakékoli podobě (A) | A a `fond_castka_uvedena` | A | 14/22 = 63,6 % | 43,0–80,3 % |
| Pole ve stavu „konflikt“ | počet záznamů s `castka.stav_hodnoty = 'konflikt'` | — | 2 (J&T, Czech Founders VC) | — |
| Rozložení stavů | — | — | A 22, B 4, kandidát 2, watchlist 1, vyřazen 1 | — |

Jmenovité seznamy (musí odpovídat kap. 7.3):
- Deklarovaný tiket (11): Credo, Kaya, Purple, Czech Founders VC, Tensor, Inven, Tilia, Reflex, Orbit, United Founders, Depo.
- Fond s typem a datem (9): Credo, Kaya, Purple, Tensor, Jet, Tech Horizons, Tilia, Reflex, United Founders.
- Částka uvedena, kritérium nesplňuje (5): Czech Founders VC a J&T (konflikt), Inven a Orbit (profil CVCA bez data), Depo (typ částky neuveden).
- Bez částky fondu (8): Rockaway, BD Partners, Zaka VC, Seed Starter, i&i Biotech, Lighthouse, Soulmates, Index.

Pravidlo pro `fond_s_typem_a_datem` (kap. 7.3): částka má typ (cíl / first close / uzavřený fond / závazky / AUM), rozhodné datum alespoň s rokem nebo měsícem a není ve stavu „konflikt“. Ve v1.1 je `je_skutecny_investor` předběžné hodnocení autora; po kontrole se použije rozhodnutí kontrolora.

**Wilsonův interval** (z = 1,96; p = k/n):

```
střed  = (p + z²/(2n)) / (1 + z²/n)
okraj  = z · sqrt( p(1−p)/n + z²/(4n²) ) / (1 + z²/n)
interval = [střed − okraj, střed + okraj]
```

**Cohenovo kappa:** `κ = (p_o − p_e) / (1 − p_e)`; `p_o` podíl shod rozhodnutí v1.1 vs. kontrolor, `p_e` očekávaná shoda náhodou z marginálních četností kategorií (A / B / kandidát / historický / watchlist / vyřazen).

**Záchyt:** podíl investorů z referenčního seznamu (CzechCrunch za 12 měsíců), kteří mají `spravce_id`.

### 8.5 Kalkulačka nákladů

#### 8.5.1 Rozpočet pilotu a ČR (kap. 8)

| Parametr | Výchozí |
|---|---|
| Sazba analytik | 800 Kč/h (předpoklad z plánu B, externí juniorní analytik, potvrdit nabídkou) |
| Sazba inženýr | 1 500 Kč/h (předpoklad) |
| Sazba řízení a metodika | 1 200 Kč/h (předpoklad) |
| Kurz | 25 Kč/EUR |

- Pilot: analytik 40 h, kontrolor 12 h, metodik 8 h, vše × 800 Kč = 48 000 Kč; rezerva 20 % = 9 600 Kč; **celkem 57 600 Kč**.
- Plné české pokrytí (~300 záznamů): ověření 0,8 h × 300 = 240 h; hledání kandidátů a deduplikace 60 h; kontrola vzorku 10 % a vyhodnocení 30 h; metodika, GDPR, LIA 30 h; řízení 30 h; 390 h × 800 Kč = 312 000 Kč; s rezervou 20 % **374 400 Kč (≈ 15 tis. EUR)**.
- Údržba ČR = 30–40 % ceny výstavby včetně rezervy = **112 320–149 760 Kč ročně**. Základem údržby je ve všech scénářích (ČR, 9.3, 9.4) celková cena výstavby včetně rezervy.
- AI v ČR: úspora ≈ 300 × 0,5 h × 800 Kč ≈ 120 000 Kč vs. vývoj pipeline 2 000–6 000 inženýrských hodin → ruční ověření; česká data jsou zlatý vzorek.

#### 8.5.2 Model bez AI triáže (kap. 9.3)

| Parametr | Minimální | Realistický | Plný |
|---|---|---|---|
| `N` záznamů | 15 000 | 30 000 | 60 000 |
| `h_overeni` (h/záznam) | 0,35 | 0,40 | 0,50 |
| `lok_podil` | 0 | 0,30 | 0,40 |
| `h_lok` | 0,15 | 0,15 | 0,15 |
| `qa_podil` | 0,05 | 0,05 | 0,10 |
| `h_qa` | 0,5 | 0,5 | 0,5 |
| `ing_h` | 1 500 | 3 000 | 5 000 |
| `rizeni_h` | 600 | 1 200 | 2 500 |
| `pravo_kc` | 300 000 | 600 000 | 1 500 000 |
| `infra_llm_data_kc` | 150 000 | 500 000 | 1 200 000 |
| `rezerva` | 0,15 | 0,15 | 0,15 |
| `udrzba` | 0,25–0,35 | 0,25–0,35 | 0,25–0,35 |

```
rucni_h    = N · h_overeni
lok_h      = N · lok_podil · h_lok
qa_h       = N · qa_podil · h_qa
analyt_h   = rucni_h + lok_h + qa_h
mezisoucet = analyt_h·800 + ing_h·1500 + rizeni_h·1200 + pravo_kc + infra_llm_data_kc
celkem     = mezisoucet · (1 + rezerva)
eur        = celkem / 25
udrzba     = celkem · [0,25 ; 0,35]
```

Citlivost 9.3: `h_overeni = 0,75` v realistickém scénáři → +10 500 h × 800 = +8,4 mil. Kč, s rezervou +9,66 mil. Kč, celkem ≈ 30,7 mil. Kč.

#### 8.5.3 Model s AI triáží (kap. 9.4)

| Parametr | Minimální | Realistický | Plný |
|---|---|---|---|
| `N` | 15 000 | 30 000 | 60 000 |
| `auto_podil` | 0,80 | 0,75 | 0,70 |
| `h_vyjimka` | 0,5 | 0,5 | 0,5 |
| `audit_podil` / `h_audit` | 0,10 / 0,2 | 0,10 / 0,2 | 0,10 / 0,2 |
| `lok_podil_vyjimek` / `h_lok` | 0 / — | 0,30 / 0,2 | 0,40 / 0,2 |
| `qa_podil` / `h_qa` | 0,05 / 0,5 | 0,05 / 0,5 | 0,10 / 0,5 |
| `llm_kc_na_zaznam` | 50 | 50 | 50 |
| `ing_h` (9.3 + navíc) | 1 500 + 500 = 2 000 | 3 000 + 800 = 3 800 | 5 000 + 1 000 = 6 000 |
| `rizeni_h`, `pravo_kc`, `infra_data_kc` | jako 9.3 | jako 9.3 | jako 9.3 |

```
vyjimky    = N · (1 − auto_podil)
vyjimky_h  = vyjimky · h_vyjimka
audit_h    = N · auto_podil · audit_podil · h_audit
rucni_h    = vyjimky_h + audit_h
rucni_na_zaznam = rucni_h / N
lok_h      = vyjimky · lok_podil_vyjimek · h_lok
qa_h       = N · qa_podil · h_qa
analyt_h   = rucni_h + lok_h + qa_h
llm_kc     = N · llm_kc_na_zaznam
mezisoucet = analyt_h·800 + ing_h·1500 + rizeni_h·1200 + pravo_kc + infra_data_kc + llm_kc
celkem     = mezisoucet · 1,15
```

Srovnání (9.4.4): `uspora = celkem_9.3 − celkem_9.4`, `uspora_% = uspora / celkem_9.3`; podíl analytické práce = `analyt_h·800 / mezisoucet`; podíl inženýrství = `ing_h·1500 / mezisoucet`.

Citlivosti 9.4.5 (realistický scénář): `auto_podil = 0,50`; `llm_kc_na_zaznam = 150`; obojí; „audit ukáže chybovost >5 %“ ≈ varianta `auto_podil = 0,50` (≈ 19 900 000 Kč).

### 8.6 Triáž AI (kap. 9.4.1; pro budoucí implementaci)

Automatické přijetí, jen pokud platí vše: oba modely shodně navrhují stupeň A; shoda na kategorii, skupině relevance a dokladu (URL); ≥1 doklad úrovně 1–2 (nebo 3 s pojmenovanými stranami) prošel deterministickou kontrolou; identita potvrzená registrem; žádné pole ve stavu „konflikt“; právnická osoba. Jinak výjimka k člověku.

Deterministické kontroly: URL dostupná a stránka obsahuje jméno investora i financované firmy; datum v okně aktivity; IČO/LEI existuje v ARES, GLEIF nebo registru země; doména zdroje není na seznamu agregátorů; dvě citace téže tiskové zprávy = jeden zdroj. Audit: náhodných 10 % automaticky přijatých. Shoda modelů ≠ správnost.

### 8.7 Kritéria go/no-go

| ID | Kritérium | Práh | Zdroj hodnoty | Hodnota v1.1 | Kapitola |
|---|---|---|---|---|---|
| G-1 | Spodní mez Wilsonova intervalu pro přesnost zařazení | ≥85 % | M6 (po kontrole) | předběžně 87,1 % | 11 |
| G-2 | Zařazení (A+B) s datovaným dokladem | 100 % | M2 / M6 | předběžně 26/26 | 11 |
| G-3 | Správnost polí sektor a fáze | ≥90 % | M6 | čeká na data | 11 |
| G-4 | Cohenovo kappa | ≥0,8 | M6 | čeká na data | 11 |
| G-5 | Medián času na záznam | ≤45 min | M6 | čeká na data | 11 |
| G-6 | Podíl automaticky přijatých (pilot automatizace) | ≥70 % | `go_nogo_vstup` | čeká na data | 9.4.6 |
| G-7 | Chybovost automaticky přijatých: horní mez Wilsona | ≤5 % | `go_nogo_vstup` (audit 100 %) | čeká na data | 9.4.6 |
| G-8 | Medián ruční práce (výjimky + audit) | ≤0,2 h/záznam | `go_nogo_vstup` | čeká na data | 9.4.6 |
| G-9 | Naměřený náklad LLM | ≤100 Kč/záznam | `go_nogo_vstup` | čeká na data | 9.4.6 |
| G-10 | Zlatý vzorek: shoda u vyřazených (X) | 100 % | `go_nogo_vstup` | čeká na data | 9.4.6 |
| G-11 | Zlatý vzorek: shoda polí sektor a fáze | ≥90 % | `go_nogo_vstup` | čeká na data | 9.4.6 |

G-1 a G-2 se v UI označí „předběžně“, dokud nejsou výsledky kontroly. Rozhodnutí po pilotu automatizace (kap. 11 bod 4): vše splněno → model 9.4; částečně → zpřísnit triáž, citlivost 9.4.5 (≈ 19,9 mil. Kč); selhání → model 9.3 (21,1 mil. Kč), případně jeho citlivost (≈ 30,7 mil. Kč). Pro horní mez <5 % při nulové chybovosti je potřeba ≥73 bezchybných záznamů.

---

## 9. Akceptační testy

### 9.1 Data a metriky

| ID | Test | Očekávaný výsledek |
|---|---|---|
| AT-01 | Počet správců v seed datech | 30 |
| AT-02 | Počet kol | 25 |
| AT-03 | Rozložení stavů | A 22, B 4, kandidát 2 (#26, #28), watchlist 1 (#29), vyřazen 1 (#30) |
| AT-04 | Primární doklad ≤24 měsíců | 26/30; 86,7 %; 70,3–94,7 % |
| AT-05 | Přesnost zařazení | 26/26; 100 %; 87,1–100 % |
| AT-06 | A+B s primárním dokladem | 26/26; 100 %; 87,1–100 % |
| AT-07 | Deklarovaný tiket (A) | 11/22; 50,0 %; 30,7–69,3 % |
| AT-08 | Fond s typem a datem (A) | 9/22; 40,9 %; 23,3–61,3 % |
| AT-09 | Částka fondu v jakékoli podobě (A) | 14/22; 63,6 %; 43,0–80,3 % |
| AT-10 | Jmenovité seznamy metrik | shodné se sekcí 8.4 |
| AT-11 | Konflikt | 2 záznamy: #4 Czech Founders VC, #6 J&T Ventures |
| AT-12 | Wilson pro 0/73 | horní mez < 5,0 % |
| AT-13 | Každý A/B má ≥1 účast s `primarni_doklad = true`, dokladem a datem publikace v okně 24 měsíců | splněno |
| AT-14 | Kolo ValkaAI (K08) | 5 účastníků (#5 lead, #6, #7, #8, #22), částka 12 mil. EUR uložená jednou |
| AT-15 | Částka kola se nepromítá do tiketu | žádná `castka` druhu `tiket` nevznikla z `kolo.castka_kola` |
| AT-16 | Všechny čísla zdrojů v datech existují v tabulce `zdroj` | splněno |
| AT-17 | Export CSV/JSON a reimport | identická data |

### 9.2 Rozhodovací strom (hraniční případy kap. 2.2)

| ID | Případ | Očekávaný výsledek |
|---|---|---|
| AT-30 | Holding s jednou dceřinou firmou | vyřazen |
| AT-31 | Holding s opakovanými minoritními investicemi (Miton) | zařazen B, typ „holding/CVC“ |
| AT-32 | Poradce, advokát, M&A boutique (Ambit, Limerock) | vyřazen jako investor |
| AT-33 | Crowdfundingová platforma (HitHit) | vyřazen |
| AT-34 | Banka | vyřazen |
| AT-35 | CVC rameno banky (Seed Starter) s doloženou investicí | zařazen |
| AT-36 | Realitní nebo dluhopisový FKI | vyřazen |
| AT-37 | Dluhový věřitel (CVI) bez majetkové investice | vyřazen z VC/PE |
| AT-38 | Správce podle § 15 ZISIF bez dokladu o investici | kandidát |
| AT-39 | Akcelerátor s doloženou kapitálovou investicí (Czech Founders VC, 40 tis. EUR) | zařazen |
| AT-40 | Nový fond bez investice, jen závazek LP (IP Lab Ventures) | watchlist |
| AT-41 | Startup s „Ventures“ v názvu (ARES nesvědčí o investiční činnosti) | vyřazen |
| AT-42 | Investice doložená jen agregátorem | kandidát |

### 9.3 Kalkulačka (výchozí parametry)

| ID | Výstup | Minimální | Realistický | Plný |
|---|---|---|---|---|
| AT-50 | Pilot celkem | 57 600 Kč | | |
| AT-51 | ČR celkem | 374 400 Kč (312 000 bez rezervy) | | |
| AT-52 | ČR údržba | 112 320–149 760 Kč | | |
| AT-53 | 9.3 ruční ověření (h) | 5 250 | 12 000 | 30 000 |
| AT-54 | 9.3 lokalizace (h) | 0 | 1 350 | 3 600 |
| AT-55 | 9.3 QA (h) | 375 | 750 | 3 000 |
| AT-56 | 9.3 analytické hodiny / Kč | 5 625 / 4 500 000 | 14 100 / 11 280 000 | 36 600 / 29 280 000 |
| AT-57 | 9.3 mezisoučet | 7 920 000 | 18 320 000 | 42 480 000 |
| AT-58 | 9.3 rezerva | 1 188 000 | 2 748 000 | 6 372 000 |
| AT-59 | 9.3 celkem Kč / EUR | 9 108 000 / 364 320 | 21 068 000 / 842 720 | 48 852 000 / 1 954 080 |
| AT-60 | 9.3 údržba | 2,28–3,19 mil. | 5,27–7,37 mil. | 12,21–17,10 mil. |
| AT-61 | 9.3 citlivost 0,75 h | | ≈ 30,7 mil. Kč (+9,66 mil.) | |
| AT-62 | 9.4 výjimky / audit / ruční celkem (h) | 1 500 / 240 / 1 740 | 3 750 / 450 / 4 200 | 9 000 / 840 / 9 840 |
| AT-63 | 9.4 ruční práce na záznam (h) | 0,116 | 0,140 | 0,164 |
| AT-64 | 9.4 lokalizace / QA (h) | 0 / 375 | 450 / 750 | 1 440 / 3 000 |
| AT-65 | 9.4 analytické hodiny / Kč | 2 115 / 1 692 000 | 5 400 / 4 320 000 | 14 280 / 11 424 000 |
| AT-66 | 9.4 mezisoučet / rezerva / celkem Kč | 6 612 000 / 991 800 / 7 603 800 | 14 060 000 / 2 109 000 / 16 169 000 | 29 124 000 / 4 368 600 / 33 492 600 |
| AT-67 | 9.4 celkem EUR / údržba | 304 152 / 1,90–2,66 mil. | 646 760 / 4,04–5,66 mil. | 1 339 704 / 8,37–11,72 mil. |
| AT-68 | 9.4.4 úspora | 1 504 200 (16,5 %) | 4 899 000 (23,3 %) | 15 359 400 (31,4 %) |
| AT-69 | 9.4.5 citlivosti (realistický) | | auto 50 %: 19 895 000 (analyt. 9 450 h, ruční 0,26 h/záznam); LLM 150 Kč: 19 619 000; obojí: 23 345 000 | |
| AT-70 | 9.4.4 struktura (realistický) | | analytická práce 62 % → 31 % mezisoučtu; inženýrství 41 % | |

---

## 10. Otevřené otázky

| ID | Téma | Popis | Návrh |
|---|---|---|---|
| O-1 | Přihlášení a role | Kontrola naslepo vyžaduje oddělit role autor / kontrolor / čtenář. | Neon Auth nebo jiný poskytovatel; pro MVP minimálně přihlášení kontrolora a čtení bez přihlášení. Rozhodnout před implementací M6. |
| O-2 | Veřejnost aplikace | Není určeno, zda je aplikace veřejná, nebo jen pro zadavatele. | Výchozí: neveřejná (Vercel Deployment Protection nebo přihlášení). |
| O-3 | Region Neonu | | AWS eu-central-1 (Frankfurt), shodně s regionem funkcí Vercelu (fra1). |
| O-4 | Stupeň u watchlistu | Vypracování přiřazuje stupně A/B/C/X, u stavu watchlist (#29) stupeň neuvádí. | V datech `stupen = null`; potvrdit. |
| O-5 | Úroveň zdroje u dokladů | Pilot neuvádí úroveň zdroje (1–4) u jednotlivých dokladů. | Seed doplní podle pravidla 6.4 bod 5; nejasné ponechat null pro kontrolora. |
| O-6 | Sektory a fáze | Pilot neobsahuje strukturovaná pole sektor a fáze, která kontrolor hodnotí (kap. 7.4 bod 4, G-3). | Pole v DB připravena prázdná; doplní je kontrola nebo verze 1.2. |

---

## 11. Postup implementace

1. Repozitář na GitHubu: Vite + React + TypeScript, adresáře podle sekce 4.4, ESLint, Vitest, GitHub Actions.
2. Projekt na Vercelu napojený na repozitář; integrace Vercel–Neon (produkční a preview větve); `vercel.json` s přepisem SPA cest.
3. Migrace `0001_init.sql` (sekce 6.3); `data/pilot_v1.1.json` (Příloha A) a `data/zdroje.json` (Příloha C); `db/seed.ts` (sekce 6.4).
4. `shared/`: Wilson, kappa, metriky, rozhodovací strom, kalkulačka; testy AT-04 až AT-12, AT-30 až AT-42, AT-50 až AT-70.
5. API (sekce 7) a validace seedu AT-01 až AT-17.
6. UI: M2 Pilotní databáze a M3 Metodika (`content/` z Přílohy B a sekce 3) s citacemi a interními odkazy.
7. UI: M5 Metriky, M1 Přehled, M9 Zdroje.
8. UI: M8 Kalkulačka s citlivostmi a uloženými variantami.
9. Rozhodnutí O-1; UI: M4 Rozhodovací strom, M6 Nezávislá kontrola (naslepo), M7 Go/no-go.
10. Verzování dat, historie změn, export CSV/JSON.

---


## Příloha A: Seed data pilotu 1.1 (`data/pilot_v1.1.json`)

Pravidla pro data:
- `kola` jsou kola financování (investice); částka kola je uložena jednou na kole. Účast správce v kole (`spravci[].ucasti`) nese roli a podíl; podíl je u všech účastí „nezveřejněno“.
- Pole `subjekt_text`, `skupina_text`, `investice_text`, `datum_zdroj_text`, `fond_text`, `tiket_text`, `stav_text` jsou doslovné texty sloupců tabulky kap. 7.1 (s citacemi bez escapování). Strukturovaná pole jsou z nich odvozena.
- „CC newsletter 2. 1. 2026“ znamená přehled prosincových dealů v CzechCrunch (zdroj [30]).
- Příznaky `ma_primarni_doklad_24m`, `je_skutecny_investor_predbezne`, `tiket_deklarovany`, `fond_s_typem_a_datem`, `fond_castka_uvedena` reprodukují metriky a jmenovité seznamy kap. 7.3. U záznamů mimo stupeň A jsou příznaky fondu `null` (metriky se počítají jen ze stupně A).
- `opravy_7_2` obsahuje body kap. 7.2 týkající se záznamu.
- Čísla v `zdroje` odkazují do Přílohy C.
- `datum_publikace` je datum publikace dokladu; datum události se v pilotu neuvádí (`datum_udalosti` jen u exitu Ready Player Me).

```json
{
 "verze": "1.1",
 "stav_k": "2026-10-11",
 "datum_vyhodnoceni": "2026-10-11",
 "opravy_13_10_2026": "Viz kap. 7.2 (Příloha B) a pole opravy_7_2 u záznamů.",
 "kola": [
  {
   "id": "K01",
   "firma": "Duvo.ai",
   "zeme_firmy": null,
   "kolo": "pre-seed+seed",
   "castka_kola": 16500000,
   "mena": "USD",
   "castka_text": "16,5 mil. USD",
   "datum_publikace": "2026-01-02",
   "zdroje": [
    30
   ],
   "poznamka": null
  },
  {
   "id": "K02",
   "firma": "Picogrid",
   "zeme_firmy": null,
   "kolo": null,
   "castka_kola": 45000000,
   "mena": "USD",
   "castka_text": "45 mil. USD",
   "datum_publikace": "2026-06-02",
   "zdroje": [
    33
   ],
   "poznamka": null
  },
  {
   "id": "K03",
   "firma": "Jutro Medical",
   "zeme_firmy": "PL",
   "kolo": "Series A",
   "castka_kola": 24000000,
   "mena": "EUR",
   "castka_text": "24 mil. EUR",
   "datum_publikace": "2026-01-02",
   "zdroje": [
    30
   ],
   "poznamka": null
  },
  {
   "id": "K04",
   "firma": "Viktor",
   "zeme_firmy": null,
   "kolo": null,
   "castka_kola": 75000000,
   "mena": "USD",
   "castka_text": "75 mil. USD",
   "datum_publikace": "2026-05-20",
   "zdroje": [
    34
   ],
   "poznamka": null
  },
  {
   "id": "K05",
   "firma": "Vetstor",
   "zeme_firmy": null,
   "kolo": "seed",
   "castka_kola": 1000000,
   "mena": "EUR",
   "castka_text": "1 mil. EUR",
   "datum_publikace": "2026-01-02",
   "zdroje": [
    30
   ],
   "poznamka": null
  },
  {
   "id": "K06",
   "firma": "Rightcharge",
   "zeme_firmy": null,
   "kolo": null,
   "castka_kola": 14000000,
   "mena": "CZK",
   "castka_text": "14 mil. Kč",
   "datum_publikace": "2026-09-03",
   "zdroje": [
    19
   ],
   "poznamka": null
  },
  {
   "id": "K07",
   "firma": "Carta Genum",
   "zeme_firmy": null,
   "kolo": "pre-seed",
   "castka_kola": 40000,
   "mena": "EUR",
   "castka_text": "40 tis. EUR",
   "datum_publikace": "2026-01-22",
   "zdroje": [
    15,
    36
   ],
   "poznamka": null
  },
  {
   "id": "K08",
   "firma": "ValkaAI",
   "zeme_firmy": null,
   "kolo": "pre-seed",
   "castka_kola": 12000000,
   "mena": "EUR",
   "castka_text": "12 mil. EUR",
   "datum_publikace": "2026-02-24",
   "zdroje": [
    16,
    17
   ],
   "poznamka": "12 mil. EUR je celé pre-seed kolo pěti fondů a anděla; podíly jednotlivých investorů nejsou zveřejněny (kap. 3.2)."
  },
  {
   "id": "K09",
   "firma": "PangeAI",
   "zeme_firmy": null,
   "kolo": "pre-seed",
   "castka_kola": 1000000,
   "mena": "USD",
   "castka_text": "1 mil. USD",
   "datum_publikace": "2026-01-02",
   "zdroje": [
    30
   ],
   "poznamka": null
  },
  {
   "id": "K10",
   "firma": "WanderWallet",
   "zeme_firmy": null,
   "kolo": "pre-seed",
   "castka_kola": 10500000,
   "mena": "CZK",
   "castka_text": "10,5 mil. Kč",
   "datum_publikace": "2026-04-01",
   "zdroje": [
    42
   ],
   "poznamka": null
  },
  {
   "id": "K11",
   "firma": "GigaScan",
   "zeme_firmy": null,
   "kolo": null,
   "castka_kola": 2100000,
   "mena": "EUR",
   "castka_text": "2,1 mil. EUR",
   "datum_publikace": "2026-09-17",
   "zdroje": [
    39
   ],
   "poznamka": null
  },
  {
   "id": "K12",
   "firma": "Phantasma Labs",
   "zeme_firmy": null,
   "kolo": null,
   "castka_kola": 2100000,
   "mena": "EUR",
   "castka_text": "2,1 mil. EUR",
   "datum_publikace": "2026-09-17",
   "zdroje": [
    39
   ],
   "poznamka": null
  },
  {
   "id": "K13",
   "firma": "Hermetiq",
   "zeme_firmy": null,
   "kolo": null,
   "castka_kola": null,
   "mena": null,
   "castka_text": null,
   "datum_publikace": "2026-09-17",
   "zdroje": [
    39
   ],
   "poznamka": null
  },
  {
   "id": "K14",
   "firma": "AppNava",
   "zeme_firmy": null,
   "kolo": null,
   "castka_kola": null,
   "mena": null,
   "castka_text": null,
   "datum_publikace": "2026-09-17",
   "zdroje": [
    39
   ],
   "poznamka": null
  },
  {
   "id": "K15",
   "firma": "Repsense",
   "zeme_firmy": "LT",
   "kolo": null,
   "castka_kola": 1100000,
   "mena": "EUR",
   "castka_text": "1,1 mil. EUR",
   "datum_publikace": "2026-01-02",
   "zdroje": [
    30
   ],
   "poznamka": null
  },
  {
   "id": "K16",
   "firma": "Andercore",
   "zeme_firmy": "DE",
   "kolo": null,
   "castka_kola": 40000000,
   "mena": "USD",
   "castka_text": "40 mil. USD",
   "datum_publikace": "2026-02-12",
   "zdroje": [
    40
   ],
   "poznamka": null
  },
  {
   "id": "K17",
   "firma": "Atmos Space Cargo",
   "zeme_firmy": null,
   "kolo": null,
   "castka_kola": 25700000,
   "mena": "EUR",
   "castka_text": "25,7 mil. EUR",
   "datum_publikace": "2026-04-22",
   "zdroje": [
    29
   ],
   "poznamka": null
  },
  {
   "id": "K18",
   "firma": "Theorema",
   "zeme_firmy": null,
   "kolo": "pre-seed",
   "castka_kola": 70000000,
   "mena": "CZK",
   "castka_text": "70 mil. Kč",
   "datum_publikace": "2026-04-01",
   "zdroje": [
    42
   ],
   "poznamka": null
  },
  {
   "id": "K19",
   "firma": "Merchantee",
   "zeme_firmy": null,
   "kolo": null,
   "castka_kola": 1800000,
   "mena": "EUR",
   "castka_text": "~1,8 mil. EUR",
   "datum_publikace": "2026-06-09",
   "zdroje": [
    43,
    44
   ],
   "poznamka": null
  },
  {
   "id": "K20",
   "firma": "FluoSphera",
   "zeme_firmy": "CH",
   "kolo": null,
   "castka_kola": 29000000,
   "mena": "CZK",
   "castka_text": "29 mil. Kč",
   "datum_publikace": "2026-02-02",
   "zdroje": [
    15
   ],
   "poznamka": null
  },
  {
   "id": "K21",
   "firma": "eNOugh",
   "zeme_firmy": null,
   "kolo": null,
   "castka_kola": 2700000,
   "mena": "USD",
   "castka_text": "2,7 mil. USD",
   "datum_publikace": "2026-01-02",
   "zdroje": [
    30
   ],
   "poznamka": null
  },
  {
   "id": "K22",
   "firma": "Wonderful.ai",
   "zeme_firmy": null,
   "kolo": null,
   "castka_kola": null,
   "mena": null,
   "castka_text": "částka kola nezveřejněna",
   "datum_publikace": "2025-11-04",
   "zdroje": [
    52
   ],
   "poznamka": "Dalšími investory kola jsou Index Ventures a Bessemer Venture Partners."
  },
  {
   "id": "K23",
   "firma": "EveryHealth",
   "zeme_firmy": null,
   "kolo": null,
   "castka_kola": null,
   "mena": null,
   "castka_text": "částka kola nezveřejněna",
   "datum_publikace": "2025-11-04",
   "zdroje": [
    52
   ],
   "poznamka": "Dalším investorem kola je Taimi."
  },
  {
   "id": "K24",
   "firma": "Aiviro",
   "zeme_firmy": null,
   "kolo": null,
   "castka_kola": 450000,
   "mena": "EUR",
   "castka_text": "450 tis. EUR",
   "datum_publikace": "2026-01-02",
   "zdroje": [
    30
   ],
   "poznamka": null
  },
  {
   "id": "K25",
   "firma": "Whisper",
   "zeme_firmy": null,
   "kolo": null,
   "castka_kola": 300000,
   "mena": "EUR",
   "castka_text": "300 tis. EUR",
   "datum_publikace": "2026-02-02",
   "zdroje": [
    50
   ],
   "poznamka": null
  }
 ],
 "spravci": [
  {
   "id": 1,
   "nazev": "Credo Ventures",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Credo Ventures",
   "skupina_text": "1",
   "investice_text": "Duvo.ai, pre-seed+seed, 16,5 mil. USD; Picogrid, 45 mil. USD[30][33]",
   "datum_zdroj_text": "CC newsletter 2. 1. 2026; Lupa 2. 6. 2026",
   "fond_text": "Stage 5: 88 mil. USD závazků (typ uzavření nezveřejněn), CC a Tech.eu 23. 3. 2026[21][22]",
   "tiket_text": "1–5 mil. USD (CC)[21]",
   "stav_text": "A",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K01",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC newsletter 2. 1. 2026",
     "datum_publikace": "2026-01-02",
     "zdroje": [
      30
     ]
    },
    {
     "kolo_id": "K02",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "Lupa 2. 6. 2026",
     "datum_publikace": "2026-06-02",
     "zdroje": [
      33
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": "Stage 5",
     "hodnoty": [
      {
       "text": "88 mil. USD závazků (typ uzavření nezveřejněn)",
       "min": 88000000,
       "max": null,
       "mena": "USD",
       "typ_castky": "zavazky_typ_uzavreni_nedohledan",
       "rozhodne_datum": "2026-03-23",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        21,
        22
       ]
      }
     ]
    }
   ],
   "tiket": {
    "text": "1–5 mil. USD",
    "min": 1000000,
    "max": 5000000,
    "mena": "USD",
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "overeno",
    "stupen_pole": "samodeklarovano",
    "zdroje": [
     21
    ]
   },
   "opravy_7_2": [
    "Credo: 170 mil. EUR (CVCA, 2020) nahrazuje Stage 5 s 88 mil. USD, [5][21] typ uzavření je nedohledán."
   ],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": true,
   "fond_s_typem_a_datem": true,
   "fond_castka_uvedena": true,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 2,
   "nazev": "Kaya VC",
   "dalsi_nazvy": [
    "Kaya"
   ],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Kaya VC",
   "skupina_text": "1",
   "investice_text": "Jutro Medical (PL), Series A, 24 mil. EUR; Viktor, 75 mil. USD[30][34]",
   "datum_zdroj_text": "CC 2. 1. 2026; Lupa 20. 5. 2026",
   "fond_text": "Fond V: first close 70 mil. EUR, cíl 80 mil. EUR (Vestbee, 25. 6. 2025)[65]",
   "tiket_text": "1–3 mil. EUR první investice (EU-Startups, 25. 6. 2025)[66]",
   "stav_text": "A",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K03",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 2. 1. 2026",
     "datum_publikace": "2026-01-02",
     "zdroje": [
      30
     ]
    },
    {
     "kolo_id": "K04",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "Lupa 20. 5. 2026",
     "datum_publikace": "2026-05-20",
     "zdroje": [
      34
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": "Fond V",
     "hodnoty": [
      {
       "text": "first close 70 mil. EUR",
       "min": 70000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "first_close",
       "rozhodne_datum": "2025-06-25",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        65
       ]
      },
      {
       "text": "cíl 80 mil. EUR",
       "min": 80000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "cil",
       "rozhodne_datum": "2025-06-25",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        65
       ]
      }
     ]
    }
   ],
   "tiket": {
    "text": "1–3 mil. EUR první investice",
    "min": 1000000,
    "max": 3000000,
    "mena": "EUR",
    "typ_castky": null,
    "rozhodne_datum": "2025-06-25",
    "stav_hodnoty": "overeno",
    "stupen_pole": "samodeklarovano",
    "zdroje": [
     66
    ]
   },
   "opravy_7_2": [
    "Doplněné zdroje (13. 10. 2026): Kaya fond a tiket [65][66]."
   ],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": true,
   "fond_s_typem_a_datem": true,
   "fond_castka_uvedena": true,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 3,
   "nazev": "Purple Ventures",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Purple Ventures",
   "skupina_text": "1",
   "investice_text": "Vetstor, seed, 1 mil. EUR;[30] Rightcharge, 14 mil. Kč",
   "datum_zdroj_text": "CC 2. 1. 2026; fxstreet 3. 9. 2026",
   "fond_text": "PV2: >700 mil. Kč získáno, cíl 1 mld. Kč (12. 3. 2026)",
   "tiket_text": "6–19 mil. Kč (CC)[35]",
   "stav_text": "A[18][19]",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K05",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 2. 1. 2026",
     "datum_publikace": "2026-01-02",
     "zdroje": [
      30
     ]
    },
    {
     "kolo_id": "K06",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "fxstreet 3. 9. 2026",
     "datum_publikace": "2026-09-03",
     "zdroje": [
      19
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": "PV2 (Purple Ventures 2)",
     "hodnoty": [
      {
       "text": ">700 mil. Kč získáno",
       "min": 700000000,
       "max": null,
       "mena": "CZK",
       "typ_castky": "ziskano",
       "rozhodne_datum": "2026-03-12",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        18,
        19
       ]
      },
      {
       "text": "cíl 1 mld. Kč",
       "min": 1000000000,
       "max": null,
       "mena": "CZK",
       "typ_castky": "cil",
       "rozhodne_datum": "2026-03-12",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        18,
        19
       ]
      }
     ]
    }
   ],
   "tiket": {
    "text": "6–19 mil. Kč",
    "min": 6000000,
    "max": 19000000,
    "mena": "CZK",
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "overeno",
    "stupen_pole": "samodeklarovano",
    "zdroje": [
     35
    ]
   },
   "opravy_7_2": [],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": true,
   "fond_s_typem_a_datem": true,
   "fond_castka_uvedena": true,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 4,
   "nazev": "Czech Founders VC",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Czech Founders VC",
   "skupina_text": "1",
   "investice_text": "Carta Genum, pre-seed, 40 tis. EUR[15][36]; Spicy Cells (jen agregátor)",
   "datum_zdroj_text": "Lupa 22. 1. 2026; CC newsletter 2. 2. 2026",
   "fond_text": "konflikt: ~30 mil. EUR (Lupa)[37] vs. 250 mil. Kč od 45 zakladatelů (CzechCrunch)[63]",
   "tiket_text": "~1 mil. Kč na vstupu, další financování do ~6 mil. Kč (CC, 5. 2. 2025)[64]",
   "stav_text": "A",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": "Akcelerátor; zařazen díky doložené kapitálové investici (kap. 2.2).",
   "ucasti": [
    {
     "kolo_id": "K07",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "Lupa 22. 1. 2026; CC newsletter 2. 2. 2026",
     "datum_publikace": "2026-01-22",
     "zdroje": [
      15,
      36
     ]
    }
   ],
   "udalosti": [
    {
     "typ_udalosti": "jen_agregator",
     "firma": "Spicy Cells",
     "primarni_doklad": false,
     "zdroj_text": "jen agregátor",
     "zdroje": []
    }
   ],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": "~30 mil. EUR (Lupa)",
       "min": 30000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "neuvedeno",
       "rozhodne_datum": null,
       "stav_hodnoty": "konflikt",
       "stupen_pole": null,
       "zdroje": [
        37
       ]
      },
      {
       "text": "250 mil. Kč od 45 zakladatelů (CzechCrunch)",
       "min": 250000000,
       "max": null,
       "mena": "CZK",
       "typ_castky": "neuvedeno",
       "rozhodne_datum": null,
       "stav_hodnoty": "konflikt",
       "stupen_pole": null,
       "zdroje": [
        63
       ]
      }
     ]
    }
   ],
   "tiket": {
    "text": "~1 mil. Kč na vstupu, další financování do ~6 mil. Kč",
    "min": 1000000,
    "max": 6000000,
    "mena": "CZK",
    "typ_castky": null,
    "rozhodne_datum": "2025-02-05",
    "stav_hodnoty": "overeno",
    "stupen_pole": "samodeklarovano",
    "zdroje": [
     64
    ]
   },
   "opravy_7_2": [
    "„Czech Founders: 79 transakcí“ je ve skutečnosti údaj ROLU.cz. Czech Founders VC a United Founders jsou dva různé subjekty. [4][52]"
   ],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": true,
   "fond_s_typem_a_datem": false,
   "fond_castka_uvedena": true,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 5,
   "nazev": "Rockaway Ventures",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Rockaway Ventures",
   "skupina_text": "1",
   "investice_text": "ValkaAI, pre-seed, 12 mil. EUR (lead)",
   "datum_zdroj_text": "TZ Rockaway 24. 2. 2026",
   "fond_text": "nedohledáno v primárním zdroji",
   "tiket_text": "nezveřejněno",
   "stav_text": "A[17]",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K08",
     "role": "lead",
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "TZ Rockaway 24. 2. 2026",
     "datum_publikace": "2026-02-24",
     "zdroje": [
      16,
      17
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": "nedohledáno v primárním zdroji",
       "min": null,
       "max": null,
       "mena": null,
       "typ_castky": null,
       "rozhodne_datum": null,
       "stav_hodnoty": "nedohledano",
       "stupen_pole": null,
       "zdroje": []
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "nezverejneno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": false,
   "fond_castka_uvedena": false,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 6,
   "nazev": "J&T Ventures",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "J&T Ventures",
   "skupina_text": "1",
   "investice_text": "ValkaAI, pre-seed, kolo 12 mil. EUR (citace D. Polacha v TZ)",
   "datum_zdroj_text": "TZ Rockaway 24. 2. 2026",
   "fond_text": "konflikt 40 vs. 120 mil. EUR[27][28]",
   "tiket_text": "nezveřejněno",
   "stav_text": "A[17]",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K08",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "TZ Rockaway 24. 2. 2026 (citace D. Polacha v TZ)",
     "datum_publikace": "2026-02-24",
     "zdroje": [
      17
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": "40 mil. EUR",
       "min": 40000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "neuvedeno",
       "rozhodne_datum": null,
       "stav_hodnoty": "konflikt",
       "stupen_pole": null,
       "zdroje": [
        27
       ],
       "poznamka": "agregátor, jen vodítko"
      },
      {
       "text": "120 mil. EUR",
       "min": 120000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "neuvedeno",
       "rozhodne_datum": null,
       "stav_hodnoty": "konflikt",
       "stupen_pole": null,
       "zdroje": [
        28
       ]
      }
     ],
     "poznamka": "Spravovaný objem; konflikt zdrojů (kap. 5)."
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "nezverejneno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": false,
   "fond_castka_uvedena": true,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 7,
   "nazev": "Tensor Ventures",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Tensor Ventures",
   "skupina_text": "1",
   "investice_text": "ValkaAI, pre-seed, kolo 12 mil. EUR; PangeAI, pre-seed, 1 mil. USD[30]",
   "datum_zdroj_text": "TZ 24. 2. 2026; CC 2. 1. 2026",
   "fond_text": "koinvestiční fond: cíl 1,25 mld. Kč, z toho 500 mil. Kč od MPO a EIF (Hrot24, 14. 5. 2024)[38]",
   "tiket_text": "250 tis.–1 mil. EUR (CVCA, 2023)[5]",
   "stav_text": "A[17]",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K08",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "TZ 24. 2. 2026",
     "datum_publikace": "2026-02-24",
     "zdroje": [
      17
     ]
    },
    {
     "kolo_id": "K09",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 2. 1. 2026",
     "datum_publikace": "2026-01-02",
     "zdroje": [
      30
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": "koinvestiční fond",
     "hodnoty": [
      {
       "text": "cíl 1,25 mld. Kč",
       "min": 1250000000,
       "max": null,
       "mena": "CZK",
       "typ_castky": "cil",
       "rozhodne_datum": "2024-05-14",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        38
       ]
      },
      {
       "text": "z toho 500 mil. Kč od MPO a EIF",
       "min": 500000000,
       "max": null,
       "mena": "CZK",
       "typ_castky": "zavazky",
       "rozhodne_datum": "2024-05-14",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        38
       ]
      }
     ]
    }
   ],
   "tiket": {
    "text": "250 tis.–1 mil. EUR (CVCA, 2023)",
    "min": 250000,
    "max": 1000000,
    "mena": "EUR",
    "typ_castky": null,
    "rozhodne_datum": "2023",
    "stav_hodnoty": "overeno",
    "stupen_pole": "samodeklarovano",
    "zdroje": [
     5
    ]
   },
   "opravy_7_2": [
    "Doplněné zdroje (13. 10. 2026): datum článku Hrot24 u Tensoru (14. 5. 2024)."
   ],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": true,
   "fond_s_typem_a_datem": true,
   "fond_castka_uvedena": true,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 8,
   "nazev": "BD Partners",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "BD Partners",
   "skupina_text": "1",
   "investice_text": "ValkaAI, pre-seed, kolo 12 mil. EUR; WanderWallet, pre-seed, kolo 10,5 mil. Kč[42]",
   "datum_zdroj_text": "TZ Rockaway 24. 2. 2026; CC newsletter 1. 4. 2026",
   "fond_text": "nezveřejněno",
   "tiket_text": "nezveřejněno",
   "stav_text": "A[17]",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K08",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "TZ Rockaway 24. 2. 2026",
     "datum_publikace": "2026-02-24",
     "zdroje": [
      17
     ]
    },
    {
     "kolo_id": "K10",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC newsletter 1. 4. 2026",
     "datum_publikace": "2026-04-01",
     "zdroje": [
      42
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": null,
       "min": null,
       "max": null,
       "mena": null,
       "typ_castky": null,
       "rozhodne_datum": null,
       "stav_hodnoty": "nezverejneno",
       "stupen_pole": null,
       "zdroje": []
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "nezverejneno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": false,
   "fond_castka_uvedena": false,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 9,
   "nazev": "Jet Venture 1 (Jet Investment)",
   "dalsi_nazvy": [
    "Jet Investment",
    "Jet Venture 1"
   ],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Jet Venture 1 (Jet Investment)",
   "skupina_text": "1",
   "investice_text": "GigaScan 2,1 mil. EUR, Phantasma Labs 2,1 mil. EUR, Hermetiq, AppNava[39]",
   "datum_zdroj_text": "CC 17. 9. 2026",
   "fond_text": "cíl „až 50 mil. EUR“[39]",
   "tiket_text": "nezveřejněno",
   "stav_text": "A",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K11",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 17. 9. 2026",
     "datum_publikace": "2026-09-17",
     "zdroje": [
      39
     ]
    },
    {
     "kolo_id": "K12",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 17. 9. 2026",
     "datum_publikace": "2026-09-17",
     "zdroje": [
      39
     ]
    },
    {
     "kolo_id": "K13",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 17. 9. 2026",
     "datum_publikace": "2026-09-17",
     "zdroje": [
      39
     ]
    },
    {
     "kolo_id": "K14",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 17. 9. 2026",
     "datum_publikace": "2026-09-17",
     "zdroje": [
      39
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": "Jet Venture 1",
     "hodnoty": [
      {
       "text": "cíl „až 50 mil. EUR“",
       "min": null,
       "max": 50000000,
       "mena": "EUR",
       "typ_castky": "cil",
       "rozhodne_datum": "2026-09-17",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        39
       ]
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "nezverejneno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": true,
   "fond_castka_uvedena": true,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 10,
   "nazev": "Zaka VC",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Zaka VC",
   "skupina_text": "1",
   "investice_text": "Vetstor, seed, kolo 1 mil. EUR[30]",
   "datum_zdroj_text": "CC 2. 1. 2026",
   "fond_text": "jen agregátor (C)",
   "tiket_text": "nezveřejněno",
   "stav_text": "A",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K05",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 2. 1. 2026",
     "datum_publikace": "2026-01-02",
     "zdroje": [
      30
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": "jen agregátor (C)",
       "min": null,
       "max": null,
       "mena": null,
       "typ_castky": null,
       "rozhodne_datum": null,
       "stav_hodnoty": "jen_agregator",
       "stupen_pole": null,
       "zdroje": []
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "nezverejneno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [
    "Doplněné zdroje (13. 10. 2026): Zaka VC (newsletter CC 2. 1. 2026 = zdroj [30])."
   ],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": false,
   "fond_castka_uvedena": false,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 11,
   "nazev": "Seed Starter (ČS)",
   "dalsi_nazvy": [
    "Seed Starter"
   ],
   "kategorie": "CVC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Seed Starter (ČS), CVC",
   "skupina_text": "1",
   "investice_text": "Repsense (LT), 1,1 mil. EUR[30]",
   "datum_zdroj_text": "CC 2. 1. 2026",
   "fond_text": "nezveřejněno",
   "tiket_text": "nezveřejněno",
   "stav_text": "A",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": "CVC rameno banky; banka sama vyřazena, CVC rameno zařazeno (kap. 2.2).",
   "ucasti": [
    {
     "kolo_id": "K15",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 2. 1. 2026",
     "datum_publikace": "2026-01-02",
     "zdroje": [
      30
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": null,
       "min": null,
       "max": null,
       "mena": null,
       "typ_castky": null,
       "rozhodne_datum": null,
       "stav_hodnoty": "nezverejneno",
       "stupen_pole": null,
       "zdroje": []
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "nezverejneno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": false,
   "fond_castka_uvedena": false,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 12,
   "nazev": "Inven Capital (ČEZ)",
   "dalsi_nazvy": [
    "Inven Capital"
   ],
   "kategorie": "CVC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Inven Capital (ČEZ), CVC",
   "skupina_text": "1",
   "investice_text": "Andercore (DE), 40 mil. USD",
   "datum_zdroj_text": "deutsche-startups.de 12. 2. 2026",
   "fond_text": "250 + 250 mil. EUR (CVCA)[5]",
   "tiket_text": "2–30 mil. EUR (CVCA)[5]",
   "stav_text": "A[40]",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K16",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "deutsche-startups.de 12. 2. 2026",
     "datum_publikace": "2026-02-12",
     "zdroje": [
      40
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": "podfondy",
     "hodnoty": [
      {
       "text": "250 mil. EUR",
       "min": 250000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "podfond",
       "rozhodne_datum": null,
       "stav_hodnoty": "overeno",
       "stupen_pole": "samodeklarovano",
       "zdroje": [
        5
       ]
      },
      {
       "text": "250 mil. EUR",
       "min": 250000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "podfond",
       "rozhodne_datum": null,
       "stav_hodnoty": "overeno",
       "stupen_pole": "samodeklarovano",
       "zdroje": [
        5
       ]
      }
     ],
     "poznamka": "Fond ≠ AUM organizace; každý údaj samostatně (kap. 3.2). Profil CVCA bez data."
    }
   ],
   "tiket": {
    "text": "2–30 mil. EUR (CVCA)",
    "min": 2000000,
    "max": 30000000,
    "mena": "EUR",
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "overeno",
    "stupen_pole": "samodeklarovano",
    "zdroje": [
     5
    ]
   },
   "opravy_7_2": [],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": true,
   "fond_s_typem_a_datem": false,
   "fond_castka_uvedena": true,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 13,
   "nazev": "Tech Horizons",
   "dalsi_nazvy": [
    "Presto Tech Horizons"
   ],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Tech Horizons (dříve Presto Tech Horizons)",
   "skupina_text": "1",
   "investice_text": "Atmos Space Cargo, 25,7 mil. EUR[29]",
   "datum_zdroj_text": "CC 22. 4. 2026",
   "fond_text": "cíl 150 mil. EUR (plánovaný objem investic, 6/2024)[41]",
   "tiket_text": "nezveřejněno",
   "stav_text": "A",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": "Dříve Presto Tech Horizons; přejmenování a odchod tří partnerů [29].",
   "ucasti": [
    {
     "kolo_id": "K17",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 22. 4. 2026",
     "datum_publikace": "2026-04-22",
     "zdroje": [
      29
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": "cíl 150 mil. EUR (plánovaný objem investic)",
       "min": 150000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "cil",
       "rozhodne_datum": "2024-06",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        41
       ]
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "nezverejneno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [
    "Presto Tech Horizons je nově Tech Horizons. [29]"
   ],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": true,
   "fond_castka_uvedena": true,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 14,
   "nazev": "Tilia Impact Ventures",
   "dalsi_nazvy": [
    "Tilia"
   ],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Tilia Impact Ventures",
   "skupina_text": "1",
   "investice_text": "Theorema, pre-seed, 70 mil. Kč[42]",
   "datum_zdroj_text": "CC newsletter 1. 4. 2026",
   "fond_text": "Tilia II: 26 z 32 mil. EUR (first close, 9/2023)[20]",
   "tiket_text": "300 tis.–1,5 mil. EUR první tiket (Vestbee, rozhovor s GP A. Grayem, 14. 3. 2024)[67]",
   "stav_text": "A",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K18",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC newsletter 1. 4. 2026",
     "datum_publikace": "2026-04-01",
     "zdroje": [
      42
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": "Tilia II",
     "hodnoty": [
      {
       "text": "26 mil. EUR (first close)",
       "min": 26000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "first_close",
       "rozhodne_datum": "2023-09",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        20
       ]
      },
      {
       "text": "cíl 32 mil. EUR",
       "min": 32000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "cil",
       "rozhodne_datum": "2023-09",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        20
       ]
      }
     ]
    }
   ],
   "tiket": {
    "text": "300 tis.–1,5 mil. EUR první tiket (rozhovor s GP A. Grayem)",
    "min": 300000,
    "max": 1500000,
    "mena": "EUR",
    "typ_castky": null,
    "rozhodne_datum": "2024-03-14",
    "stav_hodnoty": "overeno",
    "stupen_pole": "samodeklarovano",
    "zdroje": [
     67
    ]
   },
   "opravy_7_2": [
    "Tilia: 62,7 mil. Kč (CVCA) je zastaralý údaj. [5]",
    "Doplněné zdroje (13. 10. 2026): Tilia tiket (místo nedohledatelného příspěvku na LinkedInu rozhovor na Vestbee) [67]."
   ],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": true,
   "fond_s_typem_a_datem": true,
   "fond_castka_uvedena": true,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 15,
   "nazev": "i&i Biotech Fund",
   "dalsi_nazvy": [
    "i&i Bio"
   ],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "i&i Biotech Fund",
   "skupina_text": "1",
   "investice_text": "Theorema, pre-seed, kolo 70 mil. Kč (v newsletteru jako „i&i Bio“)",
   "datum_zdroj_text": "CC newsletter 1. 4. 2026",
   "fond_text": "nezveřejněno",
   "tiket_text": "nezveřejněno",
   "stav_text": "A[42]",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K18",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC newsletter 1. 4. 2026",
     "datum_publikace": "2026-04-01",
     "zdroje": [
      42
     ],
     "poznamka": "V newsletteru jako „i&i Bio“."
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": null,
       "min": null,
       "max": null,
       "mena": null,
       "typ_castky": null,
       "rozhodne_datum": null,
       "stav_hodnoty": "nezverejneno",
       "stupen_pole": null,
       "zdroje": []
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "nezverejneno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": false,
   "fond_castka_uvedena": false,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 16,
   "nazev": "Reflex Capital",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Reflex Capital",
   "skupina_text": "1",
   "investice_text": "Merchantee, ~1,8 mil. EUR (lead)[43][44]",
   "datum_zdroj_text": "Lupa 9. 6. 2026; CFOtech 15. 6. 2026",
   "fond_text": "Fond III: uzavřen na 22 mil. EUR (~540 mil. Kč; původní cíl 20 mil. EUR), CC 22. 12. 2023[68]",
   "tiket_text": "~1 mil. EUR, výjimečně ~2 mil. EUR (CC 22. 12. 2023)[68]",
   "stav_text": "A",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K19",
     "role": "lead",
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "Lupa 9. 6. 2026; CFOtech 15. 6. 2026",
     "datum_publikace": "2026-06-09",
     "zdroje": [
      43,
      44
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": "Fond III",
     "hodnoty": [
      {
       "text": "uzavřen na 22 mil. EUR (~540 mil. Kč)",
       "min": 22000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "uzavreny_fond",
       "rozhodne_datum": "2023-12-22",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        68
       ]
      },
      {
       "text": "původní cíl 20 mil. EUR",
       "min": 20000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "cil",
       "rozhodne_datum": "2023-12-22",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        68
       ]
      }
     ]
    }
   ],
   "tiket": {
    "text": "~1 mil. EUR, výjimečně ~2 mil. EUR",
    "min": 1000000,
    "max": 2000000,
    "mena": "EUR",
    "typ_castky": null,
    "rozhodne_datum": "2023-12-22",
    "stav_hodnoty": "overeno",
    "stupen_pole": "samodeklarovano",
    "zdroje": [
     68
    ]
   },
   "opravy_7_2": [
    "Doplněné zdroje (13. 10. 2026): Reflex fond a tiket [68]; zdroj upřesnil typ částky: fond byl uzavřen na 22 mil. EUR."
   ],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": true,
   "fond_s_typem_a_datem": true,
   "fond_castka_uvedena": true,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 17,
   "nazev": "Lighthouse Ventures",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Lighthouse Ventures",
   "skupina_text": "1",
   "investice_text": "Merchantee, kolo ~1,8 mil. EUR (koinvestor)[43]",
   "datum_zdroj_text": "CFOtech 15. 6. 2026",
   "fond_text": "nezveřejněno",
   "tiket_text": "nezveřejněno",
   "stav_text": "A",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K19",
     "role": "koinvestor",
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CFOtech 15. 6. 2026",
     "datum_publikace": "2026-06-15",
     "zdroje": [
      43
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": null,
       "min": null,
       "max": null,
       "mena": null,
       "typ_castky": null,
       "rozhodne_datum": null,
       "stav_hodnoty": "nezverejneno",
       "stupen_pole": null,
       "zdroje": []
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "nezverejneno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": false,
   "fond_castka_uvedena": false,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 18,
   "nazev": "Orbit Capital",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Orbit Capital",
   "skupina_text": "1",
   "investice_text": "Jutro Medical (PL), 24 mil. EUR[30]",
   "datum_zdroj_text": "CC 2. 1. 2026",
   "fond_text": "growth: „scaling to EUR 200 mil.“ (CVCA)[5]",
   "tiket_text": "6–15 mil. EUR (CVCA)[5]",
   "stav_text": "A",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K03",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 2. 1. 2026",
     "datum_publikace": "2026-01-02",
     "zdroje": [
      30
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": "growth",
     "hodnoty": [
      {
       "text": "„scaling to EUR 200 mil.“ (CVCA)",
       "min": null,
       "max": 200000000,
       "mena": "EUR",
       "typ_castky": "cil",
       "rozhodne_datum": null,
       "stav_hodnoty": "overeno",
       "stupen_pole": "samodeklarovano",
       "zdroje": [
        5
       ]
      }
     ],
     "poznamka": "Profil CVCA bez data."
    }
   ],
   "tiket": {
    "text": "6–15 mil. EUR (CVCA)",
    "min": 6000000,
    "max": 15000000,
    "mena": "EUR",
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "overeno",
    "stupen_pole": "samodeklarovano",
    "zdroje": [
     5
    ]
   },
   "opravy_7_2": [
    "Orbit a Soulmates: pomocná rešerše je vedla jako „bez aktivity“, ale v přehledech CzechCrunch mají doklady z prosince 2025, února a září 2026. [15][19]"
   ],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": true,
   "fond_s_typem_a_datem": false,
   "fond_castka_uvedena": true,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 19,
   "nazev": "Soulmates Ventures",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Soulmates Ventures",
   "skupina_text": "1",
   "investice_text": "FluoSphera (CH), 29 mil. Kč; Rightcharge, kolo 14 mil. Kč (lead)",
   "datum_zdroj_text": "CC 2. 2. 2026; fxstreet 3. 9. 2026",
   "fond_text": "nezveřejněno",
   "tiket_text": "nezveřejněno",
   "stav_text": "A[15][19]",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K20",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 2. 2. 2026",
     "datum_publikace": "2026-02-02",
     "zdroje": [
      15
     ]
    },
    {
     "kolo_id": "K06",
     "role": "lead",
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "fxstreet 3. 9. 2026",
     "datum_publikace": "2026-09-03",
     "zdroje": [
      19
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": null,
       "min": null,
       "max": null,
       "mena": null,
       "typ_castky": null,
       "rozhodne_datum": null,
       "stav_hodnoty": "nezverejneno",
       "stupen_pole": null,
       "zdroje": []
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "nezverejneno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [
    "Orbit a Soulmates: pomocná rešerše je vedla jako „bez aktivity“, ale v přehledech CzechCrunch mají doklady z prosince 2025, února a září 2026. [15][19]"
   ],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": false,
   "fond_castka_uvedena": false,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 20,
   "nazev": "Index Ventures",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "2b",
   "subjekt_text": "Index Ventures",
   "skupina_text": "2b",
   "investice_text": "Duvo.ai, pre-seed+seed, kolo 16,5 mil. USD; eNOugh, kolo 2,7 mil. USD[30]",
   "datum_zdroj_text": "CC 2. 1. 2026",
   "fond_text": "mimo rozsah pilotu",
   "tiket_text": "nezveřejněno",
   "stav_text": "A (relevance 2b doložena: obě kola jsou v přehledu dealů českých zakladatelů; zda jde o 2a, se neověřovalo, na zařazení to nemá vliv)",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": "Relevance 2b doložena: obě kola jsou v přehledu dealů českých zakladatelů; zda jde o 2a, se neověřovalo, na zařazení to nemá vliv.",
   "ucasti": [
    {
     "kolo_id": "K01",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 2. 1. 2026",
     "datum_publikace": "2026-01-02",
     "zdroje": [
      30
     ]
    },
    {
     "kolo_id": "K21",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 2. 1. 2026",
     "datum_publikace": "2026-01-02",
     "zdroje": [
      30
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": "mimo rozsah pilotu",
       "min": null,
       "max": null,
       "mena": null,
       "typ_castky": null,
       "rozhodne_datum": null,
       "stav_hodnoty": "mimo_rozsah",
       "stupen_pole": null,
       "zdroje": []
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "nezverejneno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [
    "Index Ventures (2b): relevance je doložena tím, že CzechCrunch obě kola řadí mezi dealy českých zakladatelů. Sídlo firem rozhoduje jen o tom, zda jde o 2a nebo 2b, na zařazení nemá vliv."
   ],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": false,
   "fond_castka_uvedena": false,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 21,
   "nazev": "United Founders",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "United Founders",
   "skupina_text": "1",
   "investice_text": "Wonderful.ai (s Index Ventures a Bessemer) a EveryHealth (s Taimi), první oznámené investice fondu; částky kol nezveřejněny[52]",
   "datum_zdroj_text": "CC 4. 11. 2025",
   "fond_text": "cíl 80 mil. EUR, závazky 17 mil. EUR (Rockaway 15, tým 2), CC 4. 11. 2025[52][45]",
   "tiket_text": "100 tis.–1 mil. EUR[46]",
   "stav_text": "A",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K22",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 4. 11. 2025",
     "datum_publikace": "2025-11-04",
     "zdroje": [
      52
     ]
    },
    {
     "kolo_id": "K23",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 4. 11. 2025",
     "datum_publikace": "2025-11-04",
     "zdroje": [
      52
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": "cíl 80 mil. EUR",
       "min": 80000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "cil",
       "rozhodne_datum": "2025-11-04",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        52,
        45
       ]
      },
      {
       "text": "závazky 17 mil. EUR (Rockaway 15, tým 2)",
       "min": 17000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "zavazky",
       "rozhodne_datum": "2025-11-04",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        52,
        45
       ]
      }
     ]
    }
   ],
   "tiket": {
    "text": "100 tis.–1 mil. EUR",
    "min": 100000,
    "max": 1000000,
    "mena": "EUR",
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "overeno",
    "stupen_pole": "samodeklarovano",
    "zdroje": [
     46
    ]
   },
   "opravy_7_2": [
    "United Founders: stupeň A (13. 10. 2026). Primární článek CzechCrunch ze 4. 11. 2025 [52] jmenuje obě investice: Wonderful.ai a EveryHealth. Údaj o AMI Labs (jen agregátor) se nepoužívá."
   ],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": true,
   "fond_s_typem_a_datem": true,
   "fond_castka_uvedena": true,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 22,
   "nazev": "Fond Naše Česko",
   "dalsi_nazvy": [],
   "kategorie": "nejasny",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Fond Naše Česko",
   "skupina_text": "1",
   "investice_text": "ValkaAI, pre-seed, kolo 12 mil. EUR",
   "datum_zdroj_text": "TZ Rockaway 24. 2. 2026",
   "fond_text": "nezveřejněno",
   "tiket_text": "nezveřejněno",
   "stav_text": "B (typ nejasný)[17]",
   "stav_aktivity": "aktivni",
   "stupen": "B",
   "poznamka_stupne": "Typ nejasný.",
   "ucasti": [
    {
     "kolo_id": "K08",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "TZ Rockaway 24. 2. 2026",
     "datum_publikace": "2026-02-24",
     "zdroje": [
      17
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": null,
       "min": null,
       "max": null,
       "mena": null,
       "typ_castky": null,
       "rozhodne_datum": null,
       "stav_hodnoty": "nezverejneno",
       "stupen_pole": null,
       "zdroje": []
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "nezverejneno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": null,
   "fond_castka_uvedena": null,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 23,
   "nazev": "JIC Ventures",
   "dalsi_nazvy": [
    "JIC"
   ],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "JIC Ventures",
   "skupina_text": "1",
   "investice_text": "Aiviro, 450 tis. EUR[30]",
   "datum_zdroj_text": "CC 2. 1. 2026",
   "fond_text": "cíl 400 mil. Kč, ke spuštění 7. 4. 2026 alokováno 320 mil. Kč[47][48]",
   "tiket_text": "do 1 mil. EUR, pre-seed/seed[48][49]",
   "stav_text": "B (investice předchází startu fondu, entitu nutno ověřit)",
   "stav_aktivity": "aktivni",
   "stupen": "B",
   "poznamka_stupne": "Investice předchází startu fondu, entitu nutno ověřit.",
   "ucasti": [
    {
     "kolo_id": "K24",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 2. 1. 2026",
     "datum_publikace": "2026-01-02",
     "zdroje": [
      30
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": "cíl 400 mil. Kč",
       "min": 400000000,
       "max": null,
       "mena": "CZK",
       "typ_castky": "cil",
       "rozhodne_datum": null,
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        47,
        48
       ]
      },
      {
       "text": "ke spuštění 7. 4. 2026 alokováno 320 mil. Kč",
       "min": 320000000,
       "max": null,
       "mena": "CZK",
       "typ_castky": "alokovano",
       "rozhodne_datum": "2026-04-07",
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        47,
        48
       ]
      }
     ]
    }
   ],
   "tiket": {
    "text": "do 1 mil. EUR, pre-seed/seed",
    "min": null,
    "max": 1000000,
    "mena": "EUR",
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "overeno",
    "stupen_pole": "samodeklarovano",
    "zdroje": [
     48,
     49
    ]
   },
   "opravy_7_2": [],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": true,
   "fond_s_typem_a_datem": null,
   "fond_castka_uvedena": null,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 24,
   "nazev": "Crescendo Ventures",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Crescendo Ventures",
   "skupina_text": "1",
   "investice_text": "Aiviro, kolo 450 tis. EUR (s JIC Ventures)[30]",
   "datum_zdroj_text": "CC 2. 1. 2026",
   "fond_text": "nezveřejněno",
   "tiket_text": "nezveřejněno",
   "stav_text": "B (identita: ověřit vazbu na Crescendo Equity Partners, který je v témže newsletteru uveden jako kupec Phonexie)",
   "stav_aktivity": "aktivni",
   "stupen": "B",
   "poznamka_stupne": "Identita: ověřit vazbu na Crescendo Equity Partners, který je v témže newsletteru uveden jako kupec Phonexie.",
   "ucasti": [
    {
     "kolo_id": "K24",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 2. 1. 2026",
     "datum_publikace": "2026-01-02",
     "zdroje": [
      30
     ],
     "poznamka": "s JIC Ventures"
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": null,
       "min": null,
       "max": null,
       "mena": null,
       "typ_castky": null,
       "rozhodne_datum": null,
       "stav_hodnoty": "nezverejneno",
       "stupen_pole": null,
       "zdroje": []
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "nezverejneno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [
    "Doplněné zdroje (13. 10. 2026): Crescendo Ventures (newsletter CC 2. 1. 2026 = zdroj [30])."
   ],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": null,
   "fond_castka_uvedena": null,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 25,
   "nazev": "Miton",
   "dalsi_nazvy": [],
   "kategorie": "holding_CVC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Miton",
   "skupina_text": "1",
   "investice_text": "Whisper, 300 tis. EUR[50]",
   "datum_zdroj_text": "CC 2. 2. 2026",
   "fond_text": "nezveřejněno",
   "tiket_text": "nezveřejněno",
   "stav_text": "B (typ holding/VC)",
   "stav_aktivity": "aktivni",
   "stupen": "B",
   "poznamka_stupne": "Typ holding/VC; holding s opakovanými minoritními investicemi (kap. 2.2).",
   "ucasti": [
    {
     "kolo_id": "K25",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC 2. 2. 2026",
     "datum_publikace": "2026-02-02",
     "zdroje": [
      50
     ]
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": null,
       "min": null,
       "max": null,
       "mena": null,
       "typ_castky": null,
       "rozhodne_datum": null,
       "stav_hodnoty": "nezverejneno",
       "stupen_pole": null,
       "zdroje": []
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "nezverejneno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": null,
   "fond_castka_uvedena": null,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 26,
   "nazev": "Presto Ventures",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Presto Ventures",
   "skupina_text": "1",
   "investice_text": "Ready Player Me je exit (prosinec 2025), ne nová investice;[30] Choice jen agregátor",
   "datum_zdroj_text": "CC 2. 1. 2026",
   "fond_text": "—",
   "tiket_text": "—",
   "stav_text": "Kandidát",
   "stav_aktivity": "kandidat",
   "stupen": "C",
   "poznamka_stupne": "V posledních 24 měsících bez primárního dokladu o nové investici.",
   "ucasti": [],
   "udalosti": [
    {
     "typ_udalosti": "exit",
     "firma": "Ready Player Me",
     "datum_udalosti": "2025-12",
     "datum_publikace": "2026-01-02",
     "primarni_doklad": false,
     "zdroj_text": "CC 2. 1. 2026",
     "zdroje": [
      30
     ]
    },
    {
     "typ_udalosti": "jen_agregator",
     "firma": "Choice",
     "primarni_doklad": false,
     "zdroj_text": "jen agregátor",
     "zdroje": []
    }
   ],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": null,
       "min": null,
       "max": null,
       "mena": null,
       "typ_castky": null,
       "rozhodne_datum": null,
       "stav_hodnoty": "neuvedeno",
       "stupen_pole": null,
       "zdroje": []
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "neuvedeno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [
    "Presto Ventures nemá v posledních 24 měsících primární doklad o nové investici, a proto je kandidátem."
   ],
   "ma_primarni_doklad_24m": false,
   "je_skutecny_investor_predbezne": null,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": null,
   "fond_castka_uvedena": null,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 27,
   "nazev": "Depo Ventures",
   "dalsi_nazvy": [
    "DEPO"
   ],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Depo Ventures",
   "skupina_text": "1",
   "investice_text": "WanderWallet, pre-seed, kolo 10,5 mil. Kč (s BD Partners)[42]",
   "datum_zdroj_text": "CC newsletter 1. 4. 2026",
   "fond_text": "5,5 mil. EUR (CVCA, 2023)[5]",
   "tiket_text": "50–300 tis. EUR[5]",
   "stav_text": "A",
   "stav_aktivity": "aktivni",
   "stupen": "A",
   "poznamka_stupne": null,
   "ucasti": [
    {
     "kolo_id": "K10",
     "role": null,
     "podil_stav": "nezverejneno",
     "primarni_doklad": true,
     "zdroj_text": "CC newsletter 1. 4. 2026",
     "datum_publikace": "2026-04-01",
     "zdroje": [
      42
     ],
     "poznamka": "s BD Partners"
    }
   ],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": "5,5 mil. EUR (CVCA, 2023)",
       "min": 5500000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "neuvedeno",
       "rozhodne_datum": "2023",
       "stav_hodnoty": "overeno",
       "stupen_pole": "samodeklarovano",
       "zdroje": [
        5
       ]
      }
     ]
    }
   ],
   "tiket": {
    "text": "50–300 tis. EUR",
    "min": 50000,
    "max": 300000,
    "mena": "EUR",
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "overeno",
    "stupen_pole": "samodeklarovano",
    "zdroje": [
     5
    ]
   },
   "opravy_7_2": [
    "DEPO: závazek LP neplatí jako doklad. Primární doklad o investici do firmy ale existuje: newsletter CzechCrunch z 1. 4. 2026 uvádí Depo Ventures mezi investory WanderWallet. [42] Původní hodnocení „jen agregátor“ bylo chybné, záznam má stupeň A. Opraveno při kontrole zdrojů 13. 10. 2026."
   ],
   "ma_primarni_doklad_24m": true,
   "je_skutecny_investor_predbezne": true,
   "tiket_deklarovany": true,
   "fond_s_typem_a_datem": false,
   "fond_castka_uvedena": true,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 28,
   "nazev": "Nation 1",
   "dalsi_nazvy": [],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "Nation 1",
   "skupina_text": "1",
   "investice_text": "Nic v posledních 24 měsících",
   "datum_zdroj_text": "—",
   "fond_text": "35 mil. EUR (CVCA, 2020)[5]",
   "tiket_text": "50 tis.–1,5 mil. EUR[5]",
   "stav_text": "Kandidát / historický",
   "stav_aktivity": "kandidat",
   "stupen": "C",
   "poznamka_stupne": "Kandidát / historický: žádná doložená investice v posledních 24 měsících.",
   "ucasti": [],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": "35 mil. EUR (CVCA, 2020)",
       "min": 35000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "neuvedeno",
       "rozhodne_datum": "2020",
       "stav_hodnoty": "overeno",
       "stupen_pole": "samodeklarovano",
       "zdroje": [
        5
       ]
      }
     ]
    }
   ],
   "tiket": {
    "text": "50 tis.–1,5 mil. EUR",
    "min": 50000,
    "max": 1500000,
    "mena": "EUR",
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "overeno",
    "stupen_pole": "samodeklarovano",
    "zdroje": [
     5
    ]
   },
   "opravy_7_2": [],
   "ma_primarni_doklad_24m": false,
   "je_skutecny_investor_predbezne": null,
   "tiket_deklarovany": true,
   "fond_s_typem_a_datem": null,
   "fond_castka_uvedena": null,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 29,
   "nazev": "IP Lab Ventures",
   "dalsi_nazvy": [
    "IP Lab Ventures Fund I"
   ],
   "kategorie": "VC",
   "typ_osoby": "PO",
   "skupina_relevance": "1",
   "subjekt_text": "IP Lab Ventures",
   "skupina_text": "1",
   "investice_text": "Jen závazek LP od EIF ~27 mil. EUR, cíl >50 mil. EUR[51]",
   "datum_zdroj_text": "EIF 24. 9. 2026",
   "fond_text": "cíl >50 mil. EUR",
   "tiket_text": "—",
   "stav_text": "Watchlist",
   "stav_aktivity": "watchlist",
   "stupen": null,
   "poznamka_stupne": "Závazek LP do fondu ≠ investice do firmy (kap. 2.2).",
   "ucasti": [],
   "udalosti": [
    {
     "typ_udalosti": "zavazek_LP",
     "firma": null,
     "castka": 27000000,
     "mena": "EUR",
     "datum_publikace": "2026-09-24",
     "primarni_doklad": false,
     "zdroj_text": "EIF 24. 9. 2026 – závazek LP od EIF ~27 mil. EUR",
     "zdroje": [
      51
     ]
    }
   ],
   "fondy": [
    {
     "nazev": "IP Lab Ventures Fund I",
     "hodnoty": [
      {
       "text": "cíl >50 mil. EUR",
       "min": 50000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "cil",
       "rozhodne_datum": null,
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        51
       ]
      },
      {
       "text": "~27 mil. EUR od EIF",
       "min": 27000000,
       "max": null,
       "mena": "EUR",
       "typ_castky": "zavazek_LP",
       "rozhodne_datum": null,
       "stav_hodnoty": "overeno",
       "stupen_pole": null,
       "zdroje": [
        51
       ]
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "neuvedeno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [],
   "ma_primarni_doklad_24m": false,
   "je_skutecny_investor_predbezne": null,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": null,
   "fond_castka_uvedena": null,
   "kontrolni_negativni_pripad": false
  },
  {
   "id": 30,
   "nazev": "HitHit",
   "dalsi_nazvy": [],
   "kategorie": "neinvestor",
   "typ_osoby": "PO",
   "skupina_relevance": null,
   "subjekt_text": "HitHit (kontrolní negativní případ)",
   "skupina_text": "—",
   "investice_text": "Crowdfundingová platforma uvedená v katalogu CzechStartups[9]",
   "datum_zdroj_text": "—",
   "fond_text": "—",
   "tiket_text": "—",
   "stav_text": "Vyřazen",
   "stav_aktivity": "vyrazen",
   "stupen": "X",
   "poznamka_stupne": "Kontrolní negativní případ; crowdfundingová platforma, kapitál patří investorům platformy (kap. 2.2).",
   "ucasti": [],
   "udalosti": [],
   "fondy": [
    {
     "nazev": null,
     "hodnoty": [
      {
       "text": null,
       "min": null,
       "max": null,
       "mena": null,
       "typ_castky": null,
       "rozhodne_datum": null,
       "stav_hodnoty": "neuvedeno",
       "stupen_pole": null,
       "zdroje": []
      }
     ]
    }
   ],
   "tiket": {
    "text": null,
    "min": null,
    "max": null,
    "mena": null,
    "typ_castky": null,
    "rozhodne_datum": null,
    "stav_hodnoty": "neuvedeno",
    "stupen_pole": null,
    "zdroje": []
   },
   "opravy_7_2": [],
   "ma_primarni_doklad_24m": false,
   "je_skutecny_investor_predbezne": false,
   "tiket_deklarovany": false,
   "fond_s_typem_a_datem": null,
   "fond_castka_uvedena": null,
   "kontrolni_negativni_pripad": true,
   "zdroje_zaznamu": [
    9
   ]
  }
 ]
}
```

---

## Příloha B: Kapitoly 1–11 (doslovně z `Claude_output_04.md`; obsah modulu Metodika)

### 1) Rozsah a jednotka záznamu

#### 1.1 Kategorie

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

#### 1.2 Česká relevance

- **Skupina 1 (působí z ČR):** sídlo správce nebo investičního týmu je v ČR, případně má česká pobočka vlastní investiční mandát.
- **Skupina 2 (zahraniční investor relevantní pro ČR):** má doloženou investici v rámci okna aktivity
  - **2a** do české právnické osoby (ověřitelné přes IČO v ARES), nebo
  - **2b** do zahraniční firmy s českými zakladateli (tak to počítají CzechCrunch i ROLU.cz).\[4\]\[12\] Položka 2b se vždy výslovně označí.
- Pouhé zaměření na „CEE“ relevanci nezakládá.

#### 1.3 Datový model

Správce ↔ fond ↔ investice ↔ důkaz. Na každou investici připadá ≥1 důkaz a každý důkaz má URL, datum události, datum publikace, datum kontroly a typ zdroje. Investice je kolo financování: jedno kolo má více investorů (vazba M:N přes účast investora s rolí lead / koinvestor a s jeho podílem). Částka kola se ukládá jednou na kole, podíl investora je samostatné pole.

---

### 2) Pravidla zařazení a vyřazení

#### 2.1 Rozhodovací strom

1. **Je identita ověřitelná?** U právnické osoby přes IČO/LEI nebo zahraniční registr, u fyzické osoby jménem a vazbou na investici. Ne → **vyřazen**.
2. **Investuje vlastní nebo spravovaný kapitál do podílů ve firmách** (equity, kvazi-equity, konvertibilní nástroje)? Jen zprostředkovává, radí nebo provozuje platformu → **vyřazen**.
3. **Existuje datovaný doklad o investici v okně aktivity?** VC a anděl 24 měsíců, PE, FO a velký soukromý investor 36 měsíců.
   - Ano → pokračuj na krok 4.
   - Je doložen jen fundraising nebo závazek LP → **watchlist**.
   - Doklad je starší → **historický**.
4. **Je splněna česká relevance** (skupina 1, 2a nebo 2b)? Ne → mimo rozsah.
5. **Lze určit kategorii?** Ano → **zařazen**, stupeň A nebo B. Nejasné → **zařazen B** s poznámkou ke kategorii.

**Proč 24 a 36 měsíců:** Podle VC Deals Report 2025 kanceláře Ambit (dříve Mavericks), jak ho převzal portál VědaVýzkum.cz (zdroj CzechInvest), proběhlo v roce 2025 v Česku zhruba 100 investic do startupů, přes 80 % z nich šlo do early-stage fáze a medián investice činil 500 tis. EUR.\[31\] CzechCrunch napočítal 75 oznámených kol.\[13\] Aktivní VC proto obvykle oznámí aspoň jednu investici za dva roky. PE dělá v ČR jen jednotky transakcí ročně: CVCA profily uvádějí 1–60 obchodů za celou historii,\[5\] Invest Europe 9 českých firem s buyoutovou nebo růstovou investicí v roce 2024.\[14\] Kratší okno by u PE vyřazovalo skutečné investory.

#### 2.2 Hraniční případy

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

### 3) Datový model a sémantika částek

#### 3.1 Povinná pole

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

#### 3.2 Sémantika částek

- **Tiket ≠ velikost kola.** U ValkaAI je 12 mil. EUR celé pre-seed kolo pěti fondů a anděla.\[16\]\[17\] Podíly jednotlivých investorů zveřejněny nejsou. Částka kola je proto atribut kola, ne investora: u všech šesti investorů ValkaAI se zobrazí jako „kolo celkem 12 mil. EUR“ a jejich podíl zůstane „nezveřejněno“. Částku kola se nesmí započítat do tiketu investora ani sčítat přes investory.
- **Cílová velikost ≠ uzavřené závazky.**
  - Purple Ventures 2 má cíl 1 mld. Kč, přes 700 mil. Kč získal k 12. 3. 2026.\[18\]\[19\]
  - Tilia II hlásila 26 mil. EUR potvrzených z cílových 32 mil. EUR.\[20\]
  - U Credo Stage 5 (88 mil. USD) primární zdroje neuvádějí, zda jde o first close, nebo final close.\[21\]\[22\] Typ uzavření se proto vede jako „nedohledáno“.
- **Fond ≠ AUM organizace.** Inven Capital uvádí na CVCA 250 + 250 mil. EUR v podfondech, každý údaj samostatně.\[5\]
- Částky se vedou v původní měně a s rozhodným datem. Přepočet na Kč se provádí kurzem ČNB k tomuto datu.

---

### 4) Mapa českých veřejných zdrojů

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

### 5) Ověřovací proces a stupně jistoty

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

**Konflikty:** platí novější údaj z vyšší úrovně hierarchie. Pokud se rozpor nedá vyřešit, uvedou se obě hodnoty se stavem „konflikt“. Příklad: J&T Ventures podle jednoho zdroje spravuje 40 mil. EUR (agregátor, jen vodítko),\[27\] podle druhého 120 mil. EUR.\[28\]

**Aktualizace:** transakce průběžně z měsíčního newsletteru CzechCrunch, strategie čtvrtletně, identita, aktivita a kapitál jednou ročně.

**Detekce zániku:** změna názvu nebo týmu (Presto Tech Horizons se podle CzechCrunch přejmenovala na Tech Horizons a odešli tři partneři),\[29\] výmaz z OR nebo ČNB, žádná investice v okně aktivity.

---

### 6) Odhad velikosti okruhu v ČR

#### 6.1 Triangulace bez dvojího počítání

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

#### 6.2 Očekávaná vyplněnost polí

| Pole | Očekávaná vyplněnost | Opora |
|---|---|---|
| Doklad o investici (A/B) | 80–90 % zařazených | Pilot: 26/30 kandidátů |
| Sektory a fáze | 85–95 % | Samodeklarace na webech |
| Tiket | 30–50 % u institucí, <10 % u andělů | Pilot: 11/22 = 50 % |
| Velikost fondu s typem částky a rozhodným datem | 30–45 % u VC a PE; u FO a andělů téměř 0 % | Pilot: 9/22 = 41 % |
| Částka fondu v jakékoli podobě (i bez data nebo v konfliktu) | 55–65 % u VC a PE | Pilot: 14/22 = 64 % |
| IČO (skupina 1) | >95 % | ARES |

---

### 7) Pilot: 30 VC subjektů (stav k 11. 10. 2026)

#### 7.1 Vzorek a výsledky

U každého záznamu je uvedena investice, datum a zdroj. „CC newsletter 2. 1. 2026“ znamená přehled prosincových dealů v CzechCrunch.

| # | Subjekt | Sk. | Doložená investice (firma, kolo, kolo celkem) | Datum / zdroj | Fond (typ, datum) | Tiket (deklarovaný) | Stav |
|---|---|---|---|---|---|---|---|
| 1 | Credo Ventures | 1 | Duvo.ai, pre-seed+seed, 16,5 mil. USD; Picogrid, 45 mil. USD\[30\]\[33\] | CC newsletter 2. 1. 2026; Lupa 2. 6. 2026 | Stage 5: 88 mil. USD závazků (typ uzavření nezveřejněn), CC a Tech.eu 23. 3. 2026\[21\]\[22\] | 1–5 mil. USD (CC)\[21\] | A |
| 2 | Kaya VC | 1 | Jutro Medical (PL), Series A, 24 mil. EUR; Viktor, 75 mil. USD\[30\]\[34\] | CC 2. 1. 2026; Lupa 20. 5. 2026 | Fond V: first close 70 mil. EUR, cíl 80 mil. EUR (Vestbee, 25. 6. 2025)\[65\] | 1–3 mil. EUR první investice (EU-Startups, 25. 6. 2025)\[66\] | A |
| 3 | Purple Ventures | 1 | Vetstor, seed, 1 mil. EUR;\[30\] Rightcharge, 14 mil. Kč | CC 2. 1. 2026; fxstreet 3. 9. 2026 | PV2: >700 mil. Kč získáno, cíl 1 mld. Kč (12. 3. 2026) | 6–19 mil. Kč (CC)\[35\] | A\[18\]\[19\] |
| 4 | Czech Founders VC | 1 | Carta Genum, pre-seed, 40 tis. EUR\[15\]\[36\]; Spicy Cells (jen agregátor) | Lupa 22. 1. 2026; CC newsletter 2. 2. 2026 | konflikt: ~30 mil. EUR (Lupa)\[37\] vs. 250 mil. Kč od 45 zakladatelů (CzechCrunch)\[63\] | ~1 mil. Kč na vstupu, další financování do ~6 mil. Kč (CC, 5. 2. 2025)\[64\] | A |
| 5 | Rockaway Ventures | 1 | ValkaAI, pre-seed, 12 mil. EUR (lead) | TZ Rockaway 24. 2. 2026 | nedohledáno v primárním zdroji | nezveřejněno | A\[17\] |
| 6 | J&T Ventures | 1 | ValkaAI, pre-seed, kolo 12 mil. EUR (citace D. Polacha v TZ) | TZ Rockaway 24. 2. 2026 | konflikt 40 vs. 120 mil. EUR\[27\]\[28\] | nezveřejněno | A\[17\] |
| 7 | Tensor Ventures | 1 | ValkaAI, pre-seed, kolo 12 mil. EUR; PangeAI, pre-seed, 1 mil. USD\[30\] | TZ 24. 2. 2026; CC 2. 1. 2026 | koinvestiční fond: cíl 1,25 mld. Kč, z toho 500 mil. Kč od MPO a EIF (Hrot24, 14. 5. 2024)\[38\] | 250 tis.–1 mil. EUR (CVCA, 2023)\[5\] | A\[17\] |
| 8 | BD Partners | 1 | ValkaAI, pre-seed, kolo 12 mil. EUR; WanderWallet, pre-seed, kolo 10,5 mil. Kč\[42\] | TZ Rockaway 24. 2. 2026; CC newsletter 1. 4. 2026 | nezveřejněno | nezveřejněno | A\[17\] |
| 9 | Jet Venture 1 (Jet Investment) | 1 | GigaScan 2,1 mil. EUR, Phantasma Labs 2,1 mil. EUR, Hermetiq, AppNava\[39\] | CC 17. 9. 2026 | cíl „až 50 mil. EUR“\[39\] | nezveřejněno | A |
| 10 | Zaka VC | 1 | Vetstor, seed, kolo 1 mil. EUR\[30\] | CC 2. 1. 2026 | jen agregátor (C) | nezveřejněno | A |
| 11 | Seed Starter (ČS), CVC | 1 | Repsense (LT), 1,1 mil. EUR\[30\] | CC 2. 1. 2026 | nezveřejněno | nezveřejněno | A |
| 12 | Inven Capital (ČEZ), CVC | 1 | Andercore (DE), 40 mil. USD | deutsche-startups.de 12. 2. 2026 | 250 + 250 mil. EUR (CVCA)\[5\] | 2–30 mil. EUR (CVCA)\[5\] | A\[40\] |
| 13 | Tech Horizons (dříve Presto Tech Horizons) | 1 | Atmos Space Cargo, 25,7 mil. EUR\[29\] | CC 22. 4. 2026 | cíl 150 mil. EUR (plánovaný objem investic, 6/2024)\[41\] | nezveřejněno | A |
| 14 | Tilia Impact Ventures | 1 | Theorema, pre-seed, 70 mil. Kč\[42\] | CC newsletter 1. 4. 2026 | Tilia II: 26 z 32 mil. EUR (first close, 9/2023)\[20\] | 300 tis.–1,5 mil. EUR první tiket (Vestbee, rozhovor s GP A. Grayem, 14. 3. 2024)\[67\] | A |
| 15 | i&i Biotech Fund | 1 | Theorema, pre-seed, kolo 70 mil. Kč (v newsletteru jako „i&i Bio“) | CC newsletter 1. 4. 2026 | nezveřejněno | nezveřejněno | A\[42\] |
| 16 | Reflex Capital | 1 | Merchantee, ~1,8 mil. EUR (lead)\[43\]\[44\] | Lupa 9. 6. 2026; CFOtech 15. 6. 2026 | Fond III: uzavřen na 22 mil. EUR (~540 mil. Kč; původní cíl 20 mil. EUR), CC 22. 12. 2023\[68\] | ~1 mil. EUR, výjimečně ~2 mil. EUR (CC 22. 12. 2023)\[68\] | A |
| 17 | Lighthouse Ventures | 1 | Merchantee, kolo ~1,8 mil. EUR (koinvestor)\[43\] | CFOtech 15. 6. 2026 | nezveřejněno | nezveřejněno | A |
| 18 | Orbit Capital | 1 | Jutro Medical (PL), 24 mil. EUR\[30\] | CC 2. 1. 2026 | growth: „scaling to EUR 200 mil.“ (CVCA)\[5\] | 6–15 mil. EUR (CVCA)\[5\] | A |
| 19 | Soulmates Ventures | 1 | FluoSphera (CH), 29 mil. Kč; Rightcharge, kolo 14 mil. Kč (lead) | CC 2. 2. 2026; fxstreet 3. 9. 2026 | nezveřejněno | nezveřejněno | A\[15\]\[19\] |
| 20 | Index Ventures | 2b | Duvo.ai, pre-seed+seed, kolo 16,5 mil. USD; eNOugh, kolo 2,7 mil. USD\[30\] | CC 2. 1. 2026 | mimo rozsah pilotu | nezveřejněno | A (relevance 2b doložena: obě kola jsou v přehledu dealů českých zakladatelů; zda jde o 2a, se neověřovalo, na zařazení to nemá vliv) |
| 21 | United Founders | 1 | Wonderful.ai (s Index Ventures a Bessemer) a EveryHealth (s Taimi), první oznámené investice fondu; částky kol nezveřejněny\[52\] | CC 4. 11. 2025 | cíl 80 mil. EUR, závazky 17 mil. EUR (Rockaway 15, tým 2), CC 4. 11. 2025\[52\]\[45\] | 100 tis.–1 mil. EUR\[46\] | A |
| 22 | Fond Naše Česko | 1 | ValkaAI, pre-seed, kolo 12 mil. EUR | TZ Rockaway 24. 2. 2026 | nezveřejněno | nezveřejněno | B (typ nejasný)\[17\] |
| 23 | JIC Ventures | 1 | Aiviro, 450 tis. EUR\[30\] | CC 2. 1. 2026 | cíl 400 mil. Kč, ke spuštění 7. 4. 2026 alokováno 320 mil. Kč\[47\]\[48\] | do 1 mil. EUR, pre-seed/seed\[48\]\[49\] | B (investice předchází startu fondu, entitu nutno ověřit) |
| 24 | Crescendo Ventures | 1 | Aiviro, kolo 450 tis. EUR (s JIC Ventures)\[30\] | CC 2. 1. 2026 | nezveřejněno | nezveřejněno | B (identita: ověřit vazbu na Crescendo Equity Partners, který je v témže newsletteru uveden jako kupec Phonexie) |
| 25 | Miton | 1 | Whisper, 300 tis. EUR\[50\] | CC 2. 2. 2026 | nezveřejněno | nezveřejněno | B (typ holding/VC) |
| 26 | Presto Ventures | 1 | Ready Player Me je exit (prosinec 2025), ne nová investice;\[30\] Choice jen agregátor | CC 2. 1. 2026 | — | — | Kandidát |
| 27 | Depo Ventures | 1 | WanderWallet, pre-seed, kolo 10,5 mil. Kč (s BD Partners)\[42\] | CC newsletter 1. 4. 2026 | 5,5 mil. EUR (CVCA, 2023)\[5\] | 50–300 tis. EUR\[5\] | A |
| 28 | Nation 1 | 1 | Nic v posledních 24 měsících | — | 35 mil. EUR (CVCA, 2020)\[5\] | 50 tis.–1,5 mil. EUR\[5\] | Kandidát / historický |
| 29 | IP Lab Ventures | 1 | Jen závazek LP od EIF ~27 mil. EUR, cíl >50 mil. EUR\[51\] | EIF 24. 9. 2026 | cíl >50 mil. EUR | — | Watchlist |
| 30 | HitHit (kontrolní negativní případ) | — | Crowdfundingová platforma uvedená v katalogu CzechStartups\[9\] | — | — | — | Vyřazen |

#### 7.2 Opravy dat z plánu A, které pilot přinesl
- **Credo:** 170 mil. EUR (CVCA, 2020) nahrazuje Stage 5 s 88 mil. USD,\[5\]\[21\] typ uzavření je nedohledán.
- **Presto Tech Horizons** je nově Tech Horizons.\[29\] Presto Ventures nemá v posledních 24 měsících primární doklad o nové investici, a proto je kandidátem.
- **DEPO:** závazek LP neplatí jako doklad. Primární doklad o investici do firmy ale existuje: newsletter CzechCrunch z 1. 4. 2026 uvádí Depo Ventures mezi investory WanderWallet.\[42\] Původní hodnocení „jen agregátor“ bylo chybné, záznam má stupeň A. Opraveno při kontrole zdrojů 13. 10. 2026.
- **„Czech Founders: 79 transakcí“** je ve skutečnosti údaj ROLU.cz. Czech Founders VC a United Founders jsou dva různé subjekty.\[4\]\[52\]
- **Tilia:** 62,7 mil. Kč (CVCA) je zastaralý údaj.\[5\]
- **United Founders: stupeň A (13. 10. 2026).** Tabulka uváděla „2 nejmenované investice“. Primární článek CzechCrunch ze 4. 11. 2025\[52\] ale obě investice jmenuje: Wonderful.ai a EveryHealth. Jde o datovaný doklad úrovně 3 s pojmenovanými stranami, záznam proto splňuje stupeň A. Údaj o AMI Labs (jen agregátor) se nepoužívá.
- **Doplněné zdroje (13. 10. 2026):** Kaya fond a tiket\[65\]\[66\], Tilia tiket (místo nedohledatelného příspěvku na LinkedInu rozhovor na Vestbee)\[67\], Reflex fond a tiket\[68\], Zaka VC a Crescendo Ventures (newsletter CC 2. 1. 2026 = zdroj \[30\]), United Founders (CC 4. 11. 2025 = zdroj \[52\]), datum článku Hrot24 u Tensoru (14. 5. 2024). U Reflexu zdroj upřesnil typ částky: fond byl uzavřen na 22 mil. EUR.
- **Částky kol u koinvestorů:** u všech koinvestorů je nově uvedena celková částka kola ze stejného zdroje jako u ostatních účastníků kola, vždy jako „kolo“. Podíl jednotlivých investorů zveřejněn není (viz 3.2).
- **Index Ventures (2b):** relevance je doložena tím, že CzechCrunch obě kola řadí mezi dealy českých zakladatelů. Sídlo firem rozhoduje jen o tom, zda jde o 2a nebo 2b, na zařazení nemá vliv.
- **Orbit a Soulmates:** pomocná rešerše je vedla jako „bez aktivity“, ale v přehledech CzechCrunch mají doklady z prosince 2025, února a září 2026.\[15\]\[19\] Rešerše neopírající se o primární měsíční přehledy tedy vede k falešně negativním výsledkům.

#### 7.3 Předběžné metriky (jedna osoba, bez nezávislé kontroly)

| Metrika | Výsledek | Wilsonův 95% interval |
|---|---|---|
| Kandidáti s primárním datovaným dokladem ≤24 měsíců | 26/30 = 86,7 % | 70,3–94,7 % |
| Přesnost zařazení (zařazení A+B, kteří jsou skutečnými investory) | 26/26 = 100 % | 87,1–100 % |
| Zařazení A+B s primárním datovaným dokladem (kritérium go/no-go) | 26/26 = 100 % | 87,1–100 % |
| Deklarovaný tiket (A) | 11/22 = 50,0 % | 30,7–69,3 % |
| Velikost fondu s typem částky a rozhodným datem (A) | 9/22 = 40,9 % | 23,3–61,3 % |
| Částka fondu v jakékoli podobě (A, i bez data nebo v konfliktu) | 14/22 = 63,6 % | 43,0–80,3 % |
| Pole ve stavu „konflikt“ | 2 (J&T, Czech Founders VC) | — |

**Které záznamy metriky tvoří (jmenovitě, aby šly přepočítat):**
- *Deklarovaný tiket (11):* Credo, Kaya, Purple, Czech Founders VC, Tensor, Inven, Tilia, Reflex, Orbit, United Founders, Depo.
- *Velikost fondu s typem částky a rozhodným datem (9):* Credo (závazky, 23. 3. 2026), Kaya (first close, 25. 6. 2025), Purple (získáno vs. cíl, 12. 3. 2026), Tensor (cíl, 14. 5. 2024), Jet (cíl, 17. 9. 2026), Tech Horizons (cíl, 6/2024), Tilia (first close, 9/2023), Reflex (uzavřený fond, 22. 12. 2023), United Founders (závazky vs. cíl, 4. 11. 2025).
- *Částka uvedena, ale kritérium nesplňuje (5):* Czech Founders VC a J&T (stav „konflikt“), Inven a Orbit (profil CVCA bez data), Depo (typ částky neuveden).
- *Bez částky fondu (8):* Rockaway, BD Partners, Zaka VC (jen agregátor), Seed Starter, i&i Biotech, Lighthouse, Soulmates, Index.

Pravidlo pro metriku fondu: částka se započítá, jen když má uvedený typ (cíl / first close / uzavřený fond / závazky / AUM), rozhodné datum alespoň s měsícem nebo rokem a není ve stavu „konflikt“. Dřívější údaj 12/21 toto pravidlo nedefinoval a nebylo z něj zřejmé, které záznamy zahrnuje.

Čas na jeden záznam se v této rešerši kontrolovaně neměřil, údaj proto chybí. Měřit se bude v kontrolní fázi.

#### 7.4 Jak měření dokončit
1. **Zmrazení:** tato tabulka a pravidla v kapitole 2 se uloží jako verze 1.1 (stav po opravách z 13. 10. 2026) a před kontrolou se nemění.
2. **Nezávislá kontrola:** druhá osoba bez přístupu k hodnocení naslepo zkontroluje všech 30 záznamů a doklady k nim.
3. **Referenční seznam pro záchyt:** všichni investoři uvedení v přehledech CzechCrunch za 12 měsíců. Spočítá se podíl těch, které databáze zachytila.
4. **Metriky:** přesnost zařazení, záchyt, správnost typu, správnost polí (sektor, fáze, tiket, fond), vyplněnost, čas na záznam a shoda hodnotitelů (Cohenovo kappa).
5. **Šablona vyhodnocení:** ID | rozhodnutí v1.0 | rozhodnutí kontrolora | shoda (A/N) | chybné pole | typ chyby (identita / aktivita / typ / částka / datum) | čas v minutách.

---

### 8) Harmonogram a rozpočet

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

Údržba v ČR vyjde na 30–40 % ceny výstavby včetně rezervy, tedy 112 320–149 760 Kč, zhruba 112–150 tis. Kč ročně. Základem údržby je ve všech scénářích (ČR i 9.3, 9.4) celková cena výstavby včetně rezervy.

**AI v ČR:** pro samotných 300 českých záznamů se AI pipeline nevyplatí. Úspora ruční práce by byla v řádu stovek hodin (zhruba 300 × 0,5 h × 800 Kč ≈ 120 tis. Kč), zatímco vývoj pipeline stojí 2 000–6 000 inženýrských hodin (kapitola 9.4). Česká data se proto ověřují ručně a slouží jako **zlatý vzorek**: AI pipeline se na nich nejdřív spustí a změří, ještě než se pustí do zahraničí. Rozdíly proti ručnímu výsledku ukážou chybovost AI bez dalších nákladů na rešerši.

---

### 9) Celosvětové rozšíření

#### 9.1 Velikost globálního okruhu

| Ukazatel | Hodnota | Zdroj a poznámka |
|---|---|---|
| VC firmy v USA | 3 111 (2024) | NVCA 2025 Yearbook / PitchBook; firmy, které uzavřely fond v posledních 8 ročnících\[53\] |
| US VC v roce 2025 | 15 352 obchodů, 320 mld. USD; 585 fondů získalo 67 mld. USD | NVCA 2026 Yearbook (13. 4. 2026)\[54\]\[55\] |
| Evropa (PE + VC) | Invest Europe sbírá data od >1 750 firem; podle reportu za rok 2025 investovalo 1 854 firem | Invest Europe, 7. 5. 2026\[56\]\[57\] |
| Single family offices | 8 030 (2024): Severní Amerika 3 180, APAC 2 290, Evropa 2 020 | Deloitte Private; odhad z dotazníku mezi 354 SFO\[58\]\[59\] |
| PE firmy celosvětově | Nemám ověřený veřejný počet; 31 653 (Preqin) je marketingové číslo | Neověřeno |

**Scénáře:** minimální 15 tis. záznamů (aktivní VC a PE v hlavních regionech), realistický 30 tis. (navíc FO s přímými investicemi, CVC a klíčoví andělé), plný 60 tis. (navíc širší okruh andělů a historické záznamy). Rozdělení mezi regiony a typy je odhad, ne změřený údaj.

#### 9.2 Regionální registry
- **USA:** Form ADV (data od 1. 1. 2025 na IAPD), poradci s výjimkou z registrace (exempt reporting advisers), Form D.\[60\] Malí VC poradci s méně než 25 mil. USD AUM se u SEC jako ERA registrovat nemohou, pokud nepůsobí v 15 a více státech.\[61\] Registr je proto u nejmenších fondů neúplný.
- **EU:** ESMA (EuVECA), národní dozory, lucemburský RCS/CSSF. Rejstříky skutečných majitelů jsou od rozsudku SDEU C-37/20 a C-601/20 z 22. 11. 2022 v mnoha státech uzavřeny. V ČR se evidence uzavřela 17. 12. 2025\[62\] a novela zavádí přístup na základě oprávněného zájmu.\[24\]
- **APAC:** jazyková a registrová roztříštěnost. Proto se počítá s příplatkem za lokalizaci.

#### 9.3 Kombinovaný model nákladů bez AI triáže (výchozí, aritmeticky konzistentní)

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

#### 9.4 Varianta s AI jako první linií ověřování

**Princip:** člověk už neověřuje každý záznam od nuly. AI připraví celý záznam se zdroji a stupni jistoty podle kapitol 3 a 5. Člověk rozhoduje jen výjimky a kontroluje náhodný vzorek automaticky přijatých záznamů. Pravidla zařazení (kapitola 2) ani hierarchie zdrojů (kapitola 5) se nemění. Mění se jen to, kdo dělá první průchod.

##### 9.4.1 Postup zpracování jednoho záznamu

1. **Sběr kandidátů:** scraping katalogů, registrů a transakčních přehledů jako dosud. Agregátory slouží jen k nalezení kandidáta.
2. **První průchod (model A):** model vyhledá a stáhne doklady, vyplní povinná pole z kapitoly 3.1 a ke každému poli připojí URL, datum události, datum publikace a stupeň pole. Navrhne stupeň záznamu A/B/C/X podle rozhodovacího stromu.
3. **Nezávislý druhý průchod (model B):** jiný model, ideálně od jiného poskytovatele, zpracuje stejného kandidáta bez přístupu k výstupu modelu A.
4. **Deterministické kontroly (bez AI):** URL je dostupná a stránka obsahuje jméno investora i financované firmy; datum spadá do okna aktivity; IČO nebo LEI existuje v ARES, GLEIF nebo registru dané země; doména zdroje není na seznamu agregátorů; dvě citace téže tiskové zprávy se počítají jako jeden zdroj.
5. **Triáž:** záznam se přijme automaticky jen tehdy, když splní všechny podmínky z levého sloupce tabulky. Jinak jde do fronty výjimek k člověku i s rozdíly mezi modely.
6. **Audit:** z automaticky přijatých záznamů se náhodně vybere 10 % a člověk je zkontroluje. Naměřená chybovost řídí přísnost triáže.

| Automatické přijetí (bez člověka) | Výjimka (vždy člověk) |
|---|---|
| Oba modely shodně navrhují stupeň A | Stupeň B, C, nebo neshoda modelů na stupni |
| Shoda na kategorii, skupině relevance a dokladu (URL) | Neshoda v kategorii, relevanci nebo typu částky |
| ≥1 doklad úrovně 1–2 (nebo 3 s pojmenovanými stranami) prošel deterministickou kontrolou | Doklad jen z agregátoru nebo nedostupná stránka |
| Identita potvrzená registrem | Identita nedohledána, holding, nejasný typ (hraniční případy z 2.2) |
| Žádné pole ve stavu „konflikt“ | Jakékoli pole ve stavu „konflikt“ |
| Právnická osoba | Fyzická osoba (anděl, velký soukromý investor) kvůli GDPR a riziku záměny jmen |

**Shoda dvou modelů není totéž co správnost.** Modely mohou sdílet stejnou chybu, například když čerpají ze stejného zavádějícího článku. Přesnost se proto neměří shodou modelů, ale auditem člověkem a nezávislou kontrolou QA vzorku. Shoda modelů slouží jen k třídění.

##### 9.4.2 Předpoklady

| Parametr | Minimální (15 tis.) | Realistický (30 tis.) | Plný (60 tis.) | Zdůvodnění |
|---|---|---|---|---|
| Podíl automaticky přijatých | 80 % | 75 % | 70 % | Plný scénář má víc andělů a FO, kteří jdou vždy k člověku |
| Čas na výjimku | 0,5 h | 0,5 h | 0,5 h | Výjimky jsou těžší případy, proto horní hranice původního modelu |
| Audit automaticky přijatých | 10 % × 0,2 h | 10 % × 0,2 h | 10 % × 0,2 h | Kontrola hotového záznamu s odkazy je rychlejší než rešerše |
| Lokalizace | — | 0,2 h u 30 % výjimek | 0,2 h u 40 % výjimek | Překlad dělá AI; člověk jen u výjimek v místním jazyce |
| QA vzorek (nezávislá kontrola) | beze změny (5 %) | beze změny (5 %) | beze změny (10 %) | Měří celkovou přesnost, nesmí se škrtat |
| LLM (dva průchody a opakování) | 50 Kč / záznam | 50 Kč / záznam | 50 Kč / záznam | Pracovní předpoklad, ne ceník; změří se v pilotu |
| Inženýrství navíc proti 9.3 | +500 h | +800 h | +1 000 h | Skórování, druhý model, deterministické kontroly, fronta výjimek, evaluační sada |

**Ruční ověřovací práce na záznam**

| | Minimální | Realistický | Plný |
|---|---|---|---|
| Výjimky | 3 000 × 0,5 h = 1 500 h | 7 500 × 0,5 h = 3 750 h | 18 000 × 0,5 h = 9 000 h |
| Audit automaticky přijatých | 1 200 × 0,2 h = 240 h | 2 250 × 0,2 h = 450 h | 4 200 × 0,2 h = 840 h |
| **Ruční ověření celkem** | **1 740 h** | **4 200 h** | **9 840 h** |
| **Na záznam** | **0,116 h** | **0,140 h** | **0,164 h** |
| Pro srovnání model 9.3 | 0,35 h | 0,40 h | 0,50 h |

##### 9.4.3 Náklady s AI triáží

| Položka | Minimální (15 tis.) | Realistický (30 tis.) | Plný (60 tis.) |
|---|---|---|---|
| Ruční ověření (h) | 1 740 | 4 200 | 9 840 |
| Lokalizace (h) | 0 | 450 | 1 440 |
| QA vzorek (h) | 375 | 750 | 3 000 |
| **Analytické hodiny × 800 Kč** | 2 115 h = 1 692 000 | 5 400 h = 4 320 000 | 14 280 h = 11 424 000 |
| Inženýrství × 1 500 Kč | 2 000 h = 3 000 000 | 3 800 h = 5 700 000 | 6 000 h = 9 000 000 |
| Řízení a metodika × 1 200 Kč | 600 h = 720 000 | 1 200 h = 1 440 000 | 2 500 h = 3 000 000 |
| Právo (DPIA, LIA, více jurisdikcí) | 300 000 | 600 000 | 1 500 000 |
| Infrastruktura a data | 150 000 | 500 000 | 1 200 000 |
| LLM (50 Kč × počet záznamů) | 750 000 | 1 500 000 | 3 000 000 |
| Mezisoučet | 6 612 000 | 14 060 000 | 29 124 000 |
| Rezerva 15 % | 991 800 | 2 109 000 | 4 368 600 |
| **Celkem Kč** | **7 603 800** | **16 169 000** | **33 492 600** |
| **Celkem EUR (25 Kč/EUR)** | **304 152** | **646 760** | **1 339 704** |
| Roční údržba 25–35 % | 1,90–2,66 mil. Kč | 4,04–5,66 mil. Kč | 8,37–11,72 mil. Kč |

##### 9.4.4 Srovnání s modelem bez AI triáže

| | Minimální | Realistický | Plný |
|---|---|---|---|
| Bez AI triáže (9.3) | 9 108 000 Kč | 21 068 000 Kč | 48 852 000 Kč |
| S AI triáží (9.4) | 7 603 800 Kč | 16 169 000 Kč | 33 492 600 Kč |
| **Úspora** | **1 504 200 Kč (16,5 %)** | **4 899 000 Kč (23,3 %)** | **15 359 400 Kč (31,4 %)** |
| Analytické hodiny | 5 625 → 2 115 | 14 100 → 5 400 | 36 600 → 14 280 |

Analytické hodiny klesnou zhruba o 60 %, celkové náklady ale jen o 16–31 %. Část úspory spotřebuje dražší inženýrství a LLM a fixní položky (řízení, právo) zůstávají. Úspora proto roste s velikostí: v minimálním scénáři ji z velké části pohltí vývoj pipeline, v plném scénáři převáží. Ve struktuře nákladů se mění hlavní položka. V realistickém scénáři tvořila analytická práce 62 % mezisoučtu, s AI triáží 31 %. Největší položkou je teď inženýrství (41 %), které je proto další pákou pro úspory.

##### 9.4.5 Citlivost (realistický scénář)

| Scénář | Co se změní | Celkem Kč |
|---|---|---|
| Základ | — | 16 169 000 |
| AI odbaví jen 50 % záznamů | Výjimky 15 000 × 0,5 h = 7 500 h, audit 1 500 × 0,2 h = 300 h, lokalizace 900 h, QA 750 h; analytické hodiny 9 450 h = 7 560 000 Kč (+3 240 000); ruční práce 0,26 h na záznam | 17 300 000 × 1,15 = **19 895 000** |
| LLM 3× dražší (150 Kč/záznam) | LLM 4 500 000 Kč (+3 000 000) | 17 060 000 × 1,15 = **19 619 000** |
| Obojí současně | +6 240 000 Kč | 20 300 000 × 1,15 = **23 345 000** |
| Audit ukáže chybovost >5 % | Triáž se zpřísní a podíl automaticky přijatých klesne; dopad odpovídá zhruba druhému řádku | ≈ 19 900 000 |

I když AI odbaví jen polovinu záznamů, nebo když je LLM třikrát dražší, zůstává varianta s AI levnější než model bez triáže (21,1 mil. Kč). Dražší je až při souběhu obou nepříznivých předpokladů, a to o zhruba 2,3 mil. Kč.

##### 9.4.6 Co musí pilot automatizace prokázat

Pilot proběhne ve dvou krocích. Nejdřív se AI pipeline spustí na ručně ověřených českých záznamech (zlatý vzorek z kapitol 7 a 8), včetně kontrolních negativních případů (HitHit, Limerock, CVI), které musí vyřadit. Potom následuje pilot na 300 záznamech jednoho zahraničního trhu. V pilotu se na rozdíl od ostrého provozu audituje 100 % automaticky přijatých záznamů, aby byl vzorek dost velký na spolehlivý interval: aby horní mez Wilsonova 95% intervalu klesla pod 5 %, je potřeba aspoň 73 bezchybných záznamů, při několika chybách víc.

Kritéria go/no-go:
- podíl automaticky přijatých záznamů ≥70 %,
- chybovost automaticky přijatých záznamů: horní mez Wilsonova 95% intervalu ≤5 %,
- medián ruční práce ≤0,2 h na záznam (výjimky a audit dohromady),
- naměřený náklad LLM ≤100 Kč na záznam (dvojnásobek předpokladu),
- na zlatém vzorku: 100 % shoda u vyřazených (stupeň X) a ≥90 % shoda u polí sektor a fáze.


---

### 10) Rizika a omezení

- **GDPR u andělů:** právní základ je oprávněný zájem podle čl. 6 odst. 1 písm. f) s písemným posouzením (LIA). Platí informační povinnost podle čl. 14 a minimalizace: jméno, role, doložené investice a zdroj, nic dalšího. Na námitku musí být možné reagovat.
- **Chyby AI:** vymyšlené nebo špatně přiřazené zdroje, záměna jmen (hlavně u fyzických osob) a korelované chyby dvou modelů, které čerpají ze stejného zavádějícího článku. Ošetření: deterministická kontrola URL a obsahu stránky, fyzické osoby vždy přes člověka, audit 10 % automaticky přijatých záznamů a průběžné sledování chybovosti. Pokud se použije externí LLM API, musí zpracování osobních údajů andělů pokrýt DPIA a smlouva se zpracovatelem.
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

### 11) Doporučené pořadí realizace a kritéria go/no-go

1. **Týden 1–2:** dokončit pilot. Nezávislá kontrola 30 záznamů, změření času a záchytu vůči přehledům CzechCrunch za 12 měsíců.
2. **Go/no-go po pilotu:**
   - spodní mez Wilsonova intervalu pro přesnost zařazení ≥85 %,
   - 100 % zařazených s datovaným dokladem,
   - správnost polí sektor a fáze ≥90 %,
   - Cohenovo kappa ≥0,8,
   - medián času ≤45 min na záznam.
3. **Týden 3–10:** plné české pokrytí (VC → PE → skupina 2 → andělé → FO). LIA hotová před zveřejněním údajů o fyzických osobách.
4. **Před globálním rozšířením:** nejdřív spustit AI pipeline na ručně ověřených českých záznamech (zlatý vzorek), pak pilot automatizace na 300 záznamech z jednoho zahraničního trhu (např. Polsko nebo Německo) s kritérii z kapitoly 9.4.6: ≥70 % automaticky přijatých záznamů, chybovost ≤5 % (horní mez Wilsonova intervalu) a ≤0,2 h ruční práce na záznam. Pokud se cíle nesplní jen částečně, práh triáže se zpřísní a počítá se s citlivostí z 9.4.5 (zhruba 19,9 mil. Kč). Pokud automatizace selže úplně, platí model bez triáže (21,1 mil. Kč), případně jeho citlivost (zhruba 30,7 mil. Kč).
5. **Údržba:** měsíčně transakce, čtvrtletně strategie, ročně kapitál a aktivita, s historií změn.

Doporučení: realizovat nový plán v tomto pořadí. Tvrzení o přesnosti zveřejnit až po nezávislé kontrole. Do té doby čísla v kapitole 7.3 prezentovat jako předběžná.

---

## Příloha C: Zdroje 1–68 (doslovně z `Claude_output_04.md`)

Pro `data/zdroje.json` převést na `{"cislo": n, "titulek": "...", "url": "..."}`.

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
20. [Český fond určený na investice se společenskými dopady má dalších 600 milionů. Podpořili ho Winkler či Barta - CzechCrunch](https://cc.cz/cesky-fond-urceny-na-investice-se-spolecenskymi-dopady-ma-dalsich-600-milionu-podporili-ho-winkler-ci-barta/)
21. [Elitní čeští investoři mají dvě miliardy pro startupové rakety - CzechCrunch](https://cc.cz/zazivame-nejvetsi-pokrok-za-20-let-elitni-cesti-investori-maji-dalsi-dve-miliardy-pro-startupove-rakety/)
22. [Credo Ventures raises $88M Fund 5 to double down on pre-seed in CEE and its global diaspora - Tech.eu](https://tech.eu/2026/03/23/credo-ventures-raises-88m-fund-5-to-double-down-on-pre-seed-in-cee-and-its-global-diaspora/)
23. [Evidence skutečných majitelů bude od 17. prosince 2025 neveřejná](https://danovky.cz/cs/evidence-skutecnych-majitelu-bude-od-17-prosince-2025-neverejna)
24. [Evidence skutečných majitelů se změní: přístup už nebude veřejný - Ministerstvo spravedlnosti České republiky - Portál justice](https://msp.gov.cz/en/web/msp/tiskove-zpravy/-/clanek/evidence-skute%C4%8Dn%C3%BDch-majitel%C5%AF-se-zm%C4%9Bn%C3%AD-p%C5%99%C3%ADstup-u%C5%BE-nebude-ve%C5%99ejn%C3%BD)
25. [Komunitní předplatné CC+ - CzechCrunch](https://cc.cz/plus/)
26. [Ambit: Venture Capital Deals Report 2025](https://ambit.law/cs/releases/venture-capitaldeals-report-2025)
27. [J&T Ventures — VC Fund Profile](https://hub.waveup.com/funds/j-t-ventures)
28. [J&T Ventures](https://podim.org/podim_partner/jt-ventures/)
29. [Startupový fond nejbohatšího Čecha opustili někteří partneři a mění název. Jeho mise zůstává stejná](https://cc.cz/tichy-konec-strnadovych-startupovych-partaku-odesli-tri-partneri-fondu-ten-ted-meni-i-nazev/)
30. [Zmapovali jsme všechny investice, které loni oznámily české startupy. Neseme tři dobré a tři špatné zprávy](https://cc.cz/zmapovali-jsme-vsechny-investice-ktere-loni-oznamily-ceske-startupy-neseme-tri-dobre-a-tri-spatne-zpravy/)
31. [Investice do českých startupů: méně dealů, větší investice, přísnější investoři](https://vedavyzkum.cz/inovace-a-transfer/inovace-a-transfer/investice-do-ceskych-startupu-mene-dealu-vetsi-investice-prisnejsi-investori)
32. [Czech Republic Private Equity Firm Investors: M&A Activity, Portfolio Companies, & Contacts](https://mergr.com/czech-republic-private-equity-firm-investors)
33. [České Credo Ventures investovalo do amerického startupu, který vyvíjí technologie pro Pentagon - Lupa.cz](https://www.lupa.cz/aktuality/ceske-credo-ventures-investovalo-do-americkeho-startupu-ktery-vyviji-technologie-pro-pentagon/)
34. [Pražská Kaya se zapojila do investice, která má pomoct rozšířit AI pracovníky po firmách - Lupa.cz](https://www.lupa.cz/aktuality/prazska-kaya-se-zapojila-do-investice-ktera-ma-pomoct-rozsirit-ai-pracovniky-po-firmach/)
35. [Purple, Presto, Kaya a další. Investoři mají apetit, startupové fondy nabírají další miliardy korun](https://cc.cz/purple-presto-kaya-a-dalsi-investori-maji-apetit-startupove-fondy-nabiraji-dalsi-miliardy-korun/)
36. [V Česku získal peníze „virtuální bioinformatik“, umožňuje vědcům bavit se s datovým softwarem jejich jazykem - Lupa.cz](https://www.lupa.cz/aktuality/v-cesku-ziskal-penize-virtualni-bioinformatik-umoznuje-vedcum-bavit-se-s-datovym-softwarem-jejich-jazykem/)
37. [Vít Horký (United Founders): Dokázali jsme, že technologické klenoty umíme ulovit. Hrát na česko-slovenském písečku ale opravdu nestačí - Lupa.cz](https://www.lupa.cz/clanky/vit-horky-united-founders-dokazali-jsme-ze-technologicke-klenoty-umime-ulovit-hrat-na-cesko-slovenskem-pisecku-ale-opravdu-nestaci/)
38. [Přes miliardu na umělou inteligenci i kvantové technologie. Česko přispěje do fondu s venture kapitálem](https://www.hrot24.cz/clanek/pomoc-startupum-v-pre-seedu-do-noveho-investicniho-vc-fondu-od-tensor-ventures-pritecou-stovky-milionu-HaxYp)
39. [Miliardář Fait a spol. investovali za měsíc do startupů 150 milionů - CzechCrunch](https://cc.cz/brnenska-startupova-ofenziva-miliardar-igor-fait-a-spol-investovali-behem-mesice-pres-150-milionu/)
40. [Andercore sammelt 40 Millionen ein – Blockbrain erhält 17,5 Millionen – Twentyfour bekommt 11,8 Millionen - deutsche-startups.de](https://www.deutsche-startups.de/2026/02/12/andercore-sammelt-40-millionen-ein-blockbrain-erhaelt-175-millionen-twentyfour-bekommt-118-millionen/)
41. [Presto Ventures a CSG Michala Strnada rozjíždí investiční fond. Do pokročilých technologií a bezpečnostních inovací plánují zainvestovat 150 milionů eur](https://www.czdefence.cz/clanek/presto-ventures-a-csg-michala-strnada-rozjizdi-investicni-fond-do-pokrocilych-technologii-a-bezpecnostnich-inovaci-planuji-zainvestovat-150-milionu-eur)
42. [Investor jej přesvědčil, že peníze na startup nepotřebuje. Nejlepší rozhodnutí, jaké jsem udělal, říká](https://cc.cz/investor-jej-presvedcil-ze-penize-na-startup-nepotrebuje-nejlepsi-rozhodnuti-jake-jsem-udelal-rika/)
43. [Merchantee raises EUR €1.8 million to expand in Europe - CFOtech UK](https://cfotech.co.uk/story/merchantee-raises-eur-1-8-million-to-expand-in-europe)
44. [Český startup dává e-shopům AI, která za ně rozhoduje na tržištích. S novou investicí vyhlíží další trhy - Lupa.cz](https://www.lupa.cz/aktuality/cesky-startup-dava-e-shopum-ai-ktera-za-ne-rozhoduje-na-trzistich-s-novou-investici-vyhlizi-dalsi-trhy/)
45. [Dvě miliardy pro startupy. Havrlant s Horkým spouštějí fond United Founders](https://forbes.cz/dve-miliardy-pro-evropske-startupy-horky-s-havrlantem-spousteji-fond-united-founders/)
46. [Havrlant spoluzakládá United Founders. Nový fond chce do evropských technologií investovat 2 miliardy - Lupa.cz](https://www.lupa.cz/aktuality/havrlant-spoluzaklada-united-founders-novy-fond-chce-do-evropskych-technologii-investovat-2-miliardy/)
47. [Univerzity jako spolumajitelé. Nový fond JIC má nakopnout české startupy](https://forbes.cz/univerzity-jako-spolumajitele-novy-fond-jic-ma-nakopnout-ceske-startupy/)
48. [V Brně vznikl fond, jaký nemá obdoby. Spojuje soukromníky, město, kraj, univerzity i biskupství - CzechCrunch](https://cc.cz/v-brne-vznikl-fond-jaky-nema-obdoby-spojuje-soukromniky-mesto-kraj-univerzity-i-biskupstvi/)
49. [JIC has launched a venture capital fund for startups - Enterprise Europe Network (tisková zpráva JIC)](https://een.gov.cz/en/news/jic-has-launched-a-venture-capital-fund-for-startups-president-pavel-lukashenko-came-to-brno-to-support-the-development-of-innovation-and-knowledge-economy/)
50. [Poznali se ve školce, z dobročinného projektu teď směřují do byznysu. Automatizují operativu e-shopů - CzechCrunch](https://cc.cz/poznali-se-ve-skolce-z-dobrocinneho-projektu-ted-smeruji-do-byznysu-automatizuji-operativu-e-shopu/)
51. [European Investment Fund backs first Czech IP Lab Ventures Fund I with about €27 million to commercialize AI and deep-tech research - fundsforNGOs News](https://news.fundsforngos.org/2026/09/28/eif-backs-czech-ai-tech-transfer-fund-ip-lab-ventures-27m/)
52. [Nový fond Jakuba Havrlanta: Dal do něj stovky milionů a spojuje stovku úspěšných podnikatelů - CzechCrunch (4. 11. 2025)](https://cc.cz/novy-fond-jakuba-havrlanta-dal-do-nej-stovky-milionu-a-spojuje-stovku-uspesnych-podnikatelu/)
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
63. [Úspěšní čeští startupisté budou pomáhat novým nadějím. Vybrali na to mezi sebou čtvrt miliardy - CzechCrunch](https://cc.cz/uspesni-cesti-startupiste-budou-pomahat-novym-nadejim-vybrali-na-to-mezi-sebou-ctvrt-miliardy/)
64. [Startupoví Czech Founders spouští další akceleraci, nabízí investici milion korun - CzechCrunch](https://cc.cz/live/startupovi-czech-founders-spousti-dalsi-akceleraci-nabizi-investici-milion-korun/)
65. [KAYA secures €70M to invest in CEE startups - Vestbee (25. 6. 2025)](https://www.vestbee.com/blog/articles/kaya-secures-70-m)
66. [With over 45 startups already funded, Czech VC fund KAYA secures €70 million to back more founders from CEE - EU-Startups (25. 6. 2025)](https://www.eu-startups.com/2025/06/with-over-45-startups-already-funded-czech-vc-fund-kaya-secures-e70-million-to-back-more-founders-from-cee/)
67. [VC Of The Month — Tilia Impact Ventures - Vestbee (14. 3. 2024)](https://vestbee.com/insights/articles/vc-of-the-month-tilia-impact-ventures)
68. [Nová síla pro Reflex Capital Ondřeje Fryce. Ve třetím fondu má na startupy přes půl miliardy - CzechCrunch](https://cc.cz/nova-sila-pro-reflex-capital-ondreje-fryce-ve-tretim-fondu-ma-na-startupy-pres-pul-miliardy/)
