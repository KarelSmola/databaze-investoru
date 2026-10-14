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
| Globální náklady | Aritmeticky nekonzistentní (součet ~760 tis. EUR vs. uvedených 1,2–1,6 mil. EUR) | Jen lineární model hodin, bez opory v počtu investorů | Kombinovaný model (ruční práce, inženýrství, LLM, právo, QA, údržba), tři scénáře se součty, které sedí; varianta s AI triáží snižuje ruční práci pod 0,2 h na záznam |

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
