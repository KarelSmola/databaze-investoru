# Databáze investorů: jak projekt vznikal

Krátké shrnutí postupu od zadání po pilotní aplikaci.

## Zadání

Navrhnout spolehlivou databázi investorů do firem (VC, PE, family office, andělé, velcí soukromí investoři) **výhradně z veřejných dat**. Součástí byl plán (kdo do databáze patří a kdo ne, jak záznamy ověřit, kolik jich lze získat), ověření plánu na menším vzorku s měřením přesnosti a odhad nákladů na rozšíření na celý svět.

## Postup

1. **Dva nezávislé první návrhy.** Zadání z e-mailu jsem beze změny vložil do ChatGPT a do Clauda. Vznikly dva různé plány (A od Clauda, B od ChatGPT).
2. **Křížová kritika.** Oba výstupy jsem vložil do nových, čistých konverzací (opět jednou ChatGPT, jednou Claude) s pokynem najít slabiny a navrhnout vylepšení. Vznikly dvě revidované verze.
3. **Syntéza.** Obě revize jsem předal Claudovi ke kontrole, odhalení dalších slabin a návrhu případně jiného řešení. Od tohoto bodu jsem pokračoval už jen v Claudovi.
4. **Iterace v projektu Claude.** V desktopové aplikaci Claude jsem založil samostatný projekt, kde se plán postupně zpřesňoval: pravidla zařazení, ověření zdrojů, provedený pilot na 30 českých VC subjektech, nákladový model a varianta s AI jako první linií ověřování. Výsledkem je dokument `Claude_output_04.md`.
5. **Zadání pro vývojáře.** Ve stejném projektu jsem nechal sepsat zadání pro vývoj aplikace, která výstupy zobrazí na webu.
6. **Implementace v Claude Code.** Podle zadání Claude Code naprogramoval aplikaci s pilotními daty. Následně jsem do ní doplnil i celý dokument `Claude_output_04.md`.

## Výsledek

- **Plán** s rozhodovacím stromem pro zařazení, hierarchií zdrojů a stupni jistoty A/B/C/X.
- **Pilot:** 30 VC subjektů, u každého zdroj a datum investice. 26 z 30 (87 %) má primární datovaný doklad z posledních 24 měsíců. Čísla jsou předběžná, dokud je nezkontroluje nezávislá druhá osoba.
- **Odhad pro ČR:** zhruba 190–380 aktivních investorů.
- **Globální náklady:** 7,6 / 16,2 / 33,5 mil. Kč (15 / 30 / 60 tis. záznamů) ve variantě s AI triáží.

## Technologie

React + TypeScript (SPA), databáze Neon, kód na GitHubu, nasazení přes Vercel.

## Stav a co dál

Aplikace je rychlý první prototyp. Primárním cílem bylo zobrazit pilotní data na webu. Frontend a práce s daty potřebují ještě řadu úprav, stejně jako samotný pilot čeká na nezávislou kontrolu.

## Poznámka k přístupu

Nejvíc se osvědčilo nechat dva různé modely pracovat nezávisle a pak je navzájem kritizovat. Každé kolo odhalilo chyby, které předchozí verze přehlédla (dvojí počítání fondů, chybně přiřazené zdroje, zastaralá data, hodnocení vlastní práce týmž autorem).
