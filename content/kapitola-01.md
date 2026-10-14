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

Správce ↔ fond ↔ investice ↔ důkaz. Na každou investici připadá ≥1 důkaz a každý důkaz má URL, datum události, datum publikace, datum kontroly a typ zdroje. Investice je kolo financování: jedno kolo má více investorů (vazba M:N přes účast investora s rolí lead / koinvestor a s jeho podílem). Částka kola se ukládá jednou na kole, podíl investora je samostatné pole.
