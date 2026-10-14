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

### 9.3 Kombinovaný model nákladů bez AI triáže (výchozí, aritmeticky konzistentní)

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

### 9.4 Varianta s AI jako první linií ověřování

**Princip:** člověk už neověřuje každý záznam od nuly. AI připraví celý záznam se zdroji a stupni jistoty podle kapitol 3 a 5. Člověk rozhoduje jen výjimky a kontroluje náhodný vzorek automaticky přijatých záznamů. Pravidla zařazení (kapitola 2) ani hierarchie zdrojů (kapitola 5) se nemění. Mění se jen to, kdo dělá první průchod.

#### 9.4.1 Postup zpracování jednoho záznamu

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

#### 9.4.2 Předpoklady

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

#### 9.4.3 Náklady s AI triáží

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

#### 9.4.4 Srovnání s modelem bez AI triáže

| | Minimální | Realistický | Plný |
|---|---|---|---|
| Bez AI triáže (9.3) | 9 108 000 Kč | 21 068 000 Kč | 48 852 000 Kč |
| S AI triáží (9.4) | 7 603 800 Kč | 16 169 000 Kč | 33 492 600 Kč |
| **Úspora** | **1 504 200 Kč (16,5 %)** | **4 899 000 Kč (23,3 %)** | **15 359 400 Kč (31,4 %)** |
| Analytické hodiny | 5 625 → 2 115 | 14 100 → 5 400 | 36 600 → 14 280 |

Analytické hodiny klesnou zhruba o 60 %, celkové náklady ale jen o 16–31 %. Část úspory spotřebuje dražší inženýrství a LLM a fixní položky (řízení, právo) zůstávají. Úspora proto roste s velikostí: v minimálním scénáři ji z velké části pohltí vývoj pipeline, v plném scénáři převáží. Ve struktuře nákladů se mění hlavní položka. V realistickém scénáři tvořila analytická práce 62 % mezisoučtu, s AI triáží 31 %. Největší položkou je teď inženýrství (41 %), které je proto další pákou pro úspory.

#### 9.4.5 Citlivost (realistický scénář)

| Scénář | Co se změní | Celkem Kč |
|---|---|---|
| Základ | — | 16 169 000 |
| AI odbaví jen 50 % záznamů | Výjimky 15 000 × 0,5 h = 7 500 h, audit 1 500 × 0,2 h = 300 h, lokalizace 900 h, QA 750 h; analytické hodiny 9 450 h = 7 560 000 Kč (+3 240 000); ruční práce 0,26 h na záznam | 17 300 000 × 1,15 = **19 895 000** |
| LLM 3× dražší (150 Kč/záznam) | LLM 4 500 000 Kč (+3 000 000) | 17 060 000 × 1,15 = **19 619 000** |
| Obojí současně | +6 240 000 Kč | 20 300 000 × 1,15 = **23 345 000** |
| Audit ukáže chybovost >5 % | Triáž se zpřísní a podíl automaticky přijatých klesne; dopad odpovídá zhruba druhému řádku | ≈ 19 900 000 |

I když AI odbaví jen polovinu záznamů, nebo když je LLM třikrát dražší, zůstává varianta s AI levnější než model bez triáže (21,1 mil. Kč). Dražší je až při souběhu obou nepříznivých předpokladů, a to o zhruba 2,3 mil. Kč.

#### 9.4.6 Co musí pilot automatizace prokázat

Pilot proběhne ve dvou krocích. Nejdřív se AI pipeline spustí na ručně ověřených českých záznamech (zlatý vzorek z kapitol 7 a 8), včetně kontrolních negativních případů (HitHit, Limerock, CVI), které musí vyřadit. Potom následuje pilot na 300 záznamech jednoho zahraničního trhu. V pilotu se na rozdíl od ostrého provozu audituje 100 % automaticky přijatých záznamů, aby byl vzorek dost velký na spolehlivý interval: aby horní mez Wilsonova 95% intervalu klesla pod 5 %, je potřeba aspoň 73 bezchybných záznamů, při několika chybách víc.

Kritéria go/no-go:
- podíl automaticky přijatých záznamů ≥70 %,
- chybovost automaticky přijatých záznamů: horní mez Wilsonova 95% intervalu ≤5 %,
- medián ruční práce ≤0,2 h na záznam (výjimky a audit dohromady),
- naměřený náklad LLM ≤100 Kč na záznam (dvojnásobek předpokladu),
- na zlatém vzorku: 100 % shoda u vyřazených (stupeň X) a ≥90 % shoda u polí sektor a fáze.
