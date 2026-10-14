▗ ▗   ▖ ▖  Claude Code v2.1.287
           Opus 5.5 · API Usage Billing
 ▘▘   ▝▝   ~/Documents/Coding/databaze-investoru

  ✔ Using flicker-free rendering · if you want to go back, use /tui default
    · Click to move your cursor in the text input
    · Click to expand collapsed tool results
    · By default, text auto-copies when you select it (/config to change)
    · Hold Fn while selecting to use your terminal's native copy instead

  Get to finished work sooner with Opus 5.5. Switch anytime with /model.

❯ @"/Users/karelsmola/Documents/Claude/Databaze_investoru/Outputs/predavaci_dok 
  ument_databaze_investoru.md"                                                  
  Vytvoř mi aplikaci dle přiloženého dokumentu. Design a barvy udělej podle     
  webu https://www.clientelo.cz/. Zatím neřeš role a přihlášování uživatelů do  
  Neon db.                                                                      

  Read 1 file, listed 1 directory, ran 1 shell command (ctrl+o to expand)

⏺ Přečetl jsem specifikaci (sekce 0–11). Teď extrahuji seed data z Přílohy A a
  zdroje z Přílohy C, pak se podívám na design clientelo.cz a postavím aplikaci.

  Read 1 file, ran 5 shell commands (ctrl+o to expand)

⏺ Mám paletu clientelo.cz (teal #00666c, červená #b23132, inkoust #13302e, fonty
  Lora + Lexend). Ještě se podívám na rozvržení stránky a pak začnu stavět.

⏺ Pro tuto aplikaci zatím Neon projekt neexistuje, vytvořím nový
  databaze-investoru ve Frankfurtu (dle O-3).

  Ran 3 shell commands (ctrl+o to expand)

⏺ Data a obsah extrahovány (30 správců, 25 kol, 68 zdrojů, kapitoly 0–11). Neon
  projekt je vytvořen. Teď zakládám projekt (Vite + React + TS, Vercel
  Functions, sdílená logika).

  Ran 5 shell commands (ctrl+o to expand)

⏺ Teď sdílená logika (shared/): Wilson, kappa, metriky, rozhodovací strom,
  kalkulačka, formátování.

⏺ Write(shared/typy.ts)
  ⎿  Wrote 163 lines to shared/typy.ts
       1 // Typy dat pilotu (Příloha A) a odpovědí API.
       2 
       3 export type Kategorie =
       4   | 'VC'
       5   | 'PE'
       6   | 'CVC'
       7   | 'FO'
       8   | 'andel'
       9   | 'velky_soukromy_investor'
      10   | 'fond_fondu'
     … +163 lines (ctrl+o to expand)

⏺ Write(shared/wilson.ts)
  ⎿  Wrote 31 lines to shared/wilson.ts
       1 export interface Interval {
       2   dolni: number
       3   horni: number
       4 }
       5 
       7 export function wilson(k: number, n: number, z = 1.96): Interval
          {
       8   if (n <= 0) return { dolni: 0, horni: 0 }
       9   const p = k / n
      10   const z2 = z * z
     … +23 lines (ctrl+o to expand)

⏺ Write(shared/kappa.ts)
  ⎿  Wrote 28 lines to shared/kappa.ts
       1 /**
       2  * Cohenovo kappa pro dvojice hodnocení: κ = (p_o − p_e) / (1 − 
       3  * p_e se počítá z marginálních četností kategorií obou hodnotit
         elů.
       4  */
         T]>): number | null {
       6   const n = dvojice.length
       7   if (n === 0) return null
       9   const a = new Map<T, number>()
      10   const b = new Map<T, number>()
     … +21 lines (ctrl+o to expand)

⏺ Write(shared/metriky.ts)
  ⎿  Wrote 189 lines to shared/metriky.ts
       1 import { podil, type Podil } from './wilson.js'
       2 import type { CastkaData, FondData, SpravceData, TypCastky } fro
         m './typy.js'
       3 
       4 /** Vstup pro výpočet metrik – podmnožina SpravceData. */
       6   SpravceData,
       7   | 'id'
       8   | 'nazev'
       9   | 'stupen'
      10   | 'stav_aktivity'
     … +209 lines (ctrl+o to expand)

⏺ Write(shared/strom.ts)
  ⎿  Wrote 153 lines to shared/strom.ts
       1 import type { Kategorie, SkupinaRelevance } from './typy.js'
       2 
       3 /** Rozhodovací strom kap. 2.1 (sekce 8.1 předávacího dokumentu)
       4 
       5 export type StavDokladu = 'v_okne' | 'jen_fundraising_nebo_LP' |
          'starsi' | 'zadny' | 'jen_agregator'
       6 
       8   identita_overitelna: boolean
       9   investuje_do_podilu: boolean
      10   kategorie: Kategorie
     … +213 lines (ctrl+o to expand)

⏺ Write(shared/kalkulacka/parametry.ts)
  ⎿  Wrote 105 lines to shared/kalkulacka/parametry.ts
      1 /** Parametry kalkulačky nákladů (sekce 8.5; kap. 8, 9.3, 9.4). V
        ýchozí hodnoty reprodukují čísla dokumentu. */
      2 
      3 export type Scenar = 'minimalni' | 'realisticky' | 'plny'
      4 export const SCENARE: Scenar[] = ['minimalni', 'realisticky', 'pl
      5 export const SCENAR_NAZEV: Record<Scenar, string> = {
      6   minimalni: 'Minimální',
      7   realisticky: 'Realistický',
      8   plny: 'Plný',
      9 }
     … +114 lines (ctrl+o to expand)

⏺ Write(shared/kalkulacka/vypocet.ts)
  ⎿  Wrote 277 lines to shared/kalkulacka/vypocet.ts
       1 import { klonuj, SCENARE, type ParametryKalkulacky, type Scenar 
         } from './parametry.js'
       2 
       3 export interface VysledekPilot {
       4   analytik_kc: number
       6   metodik_kc: number
       7   hodiny: number
       8   mezisoucet: number
       9   rezerva: number
      10   celkem: number
     … +285 lines (ctrl+o to expand)

⏺ Write(shared/format.ts)  ⎿  Wrote 65 lines to shared/format.ts
       1 /** České formátování čísel a dat (NFR-01). */
       2 
       3 const nf = (min: number, max: number) =>
       4   new Intl.NumberFormat('cs-CZ', { minimumFractionDigits: min, m
         aximumFractionDigits: max })
       6 const cache = new Map<string, Intl.NumberFormat>()
       7 function f(min: number, max: number): Intl.NumberFormat {
       8   const k = `${min}-${max}`
       9   let x = cache.get(k)
      10   if (!x) {
     … +65 lines (ctrl+o to expand)

⏺ Write(shared/ciselniky.ts)
  ⎿  Wrote 85 lines to shared/ciselniky.ts
       1 import type { Kategorie, Rozhodnuti, StavAktivity, StavHodnoty, 
         StupenPole, TypCastky, TypChyby, TypUdalosti } from './typy.js'
       2 
       3 export const KATEGORIE: Record<Kategorie, string> = {
       4   VC: 'VC',
       6   CVC: 'CVC (podtyp VC)',
       7   FO: 'Family office',
       8   andel: 'Anděl',
       9   velky_soukromy_investor: 'Velký soukromý investor',
      10   fond_fondu: 'Fond fondů',
     … +77 lines (ctrl+o to expand)

  Read 1 file, ran 1 shell command (ctrl+o to expand)

⏺ Všech 61 akceptačních testů (AT-01–16, AT-04–12, AT-30–42, AT-50–70) prochází.
  Teď databáze: migrace, seed a validace v Neonu.

  Ran 1 shell command (ctrl+o to expand)

⏺ Write(db/seed.ts)
  ⎿  Wrote 184 lines to db/seed.ts
       1 import { readFileSync } from 'node:fs'
       2 import { Pool, type PoolClient } from '@neondatabase/serverless'
       4 import type { CastkaData, PilotData, Zdroj } from '../shared/typ
         y.js'
       5 
       7  * Seed dat pilotu (sekce 6.4). Idempotentní: v transakci smaže 
         a znovu vloží data verze.
       8  * Použití: npm run db:seed [-- cesta/k/pilot.json] [--force]
         nak seed odmítne pokračovat).
      10  */
     … +228 lines (ctrl+o to expand)

  Listed 1 directory, ran 1 shell command (ctrl+o to expand)

⏺ Write(shared/api.ts)
  ⎿  Wrote 293 lines to shared/api.ts
       1 import type {
       2   CastkaData,
       3   KoloData,
       4   PilotData,
       5   Rozhodnuti,
       6   SpravceData,
       7   TypChyby,
       8   UcastData,
       9   UdalostData,
      10   Zdroj,
     … +295 lines (ctrl+o to expand)

⏺ Write(shared/filtry.ts)
  ⎿  Wrote 86 lines to shared/filtry.ts
       1 import { poleVKonfliktu } from './metriky.js'
       2 import type { KoloData, SpravceData } from './typy.js'
       3 
       4 /** Filtry FR-11 a fulltext FR-12 nad seznamem správců. */
       5 
          | 'konflikt' | 'primarni_24m'
       7 
       8 export const PRIZNAKY: Record<Priznak, string> = {
       9   tiket: 'Má deklarovaný tiket',
      10   fond_typ_datum: 'Má fond s typem a datem',
     … +83 lines (ctrl+o to expand)

⏺ Write(shared/kontrola.ts)
  ⎿  Wrote 85 lines to shared/kontrola.ts
       1 import { cohenKappa, median } from './kappa.js'
       2 import { podil, type Podil } from './wilson.js'
       3 import { jeZarazen, rozhodnutiZaznamu, ROZHODNUTI, type Rozhodnu
       4 import { POLE_KONTROLY, type Hodnoceni, type PoleKontroly, type 
         ReferencniPolozka } from './api.js'
       5 
       6 /** Výsledky nezávislé kontroly (kap. 7.4 bod 4, FR-53). */
       8   kontrolor: string | null
       9   hodnoceno: number
      10   celkem: number
     … +97 lines (ctrl+o to expand)

⏺ Píšu vyhodnocení go/no-go a pak serverovou vrstvu (API pro Vercel + lokální
  dev middleware).

⏺ Write(shared/gonogo.ts)
  ⎿  Wrote 163 lines to shared/gonogo.ts
       1 import type { GoNogoVstup } from './api.js'
       2 import type { VysledkyKontroly } from './kontrola.js'
       3 import type { MetrikyPilotu } from './metriky.js'
       4 import { wilson } from './wilson.js'
       5 
         /
       7 
       8 export type StavKriteria = 'splneno' | 'nesplneno' | 'ceka'
       9 
      10 export interface KriteriumDef {
     … +190 lines (ctrl+o to expand)

  Read 1 file (ctrl+o to expand)

⏺ Write(server/data.ts)
  ⎿  Wrote 244 lines to server/data.ts
       1 import { db, num, str, type Radek } from './db.js'
       2 import { HttpChyba } from './http.js'
       3 import type { CastkaApi, Dataset, Doklad, FondApi, KoloApi, Spra
         '
       4 
       5 export const VYCHOZI_VERZE = '1.1'
       6 
       8   return {
       9     id: String(r.id),
      10     stav_k: String(r.stav_k),
     … +269 lines (ctrl+o to expand)

  Read 3 files, ran 1 shell command (ctrl+o to expand)

⏺ API vrstva je hotová. Teď lokální dev server (Vite middleware pro /api) a
  validační skript AT-01–17 proti Neonu.

  Ran 5 shell commands (ctrl+o to expand)

⏺ AT-01 až AT-17 v Neonu procházejí (seed je idempotentní). Kontrola typů a pak
  frontend.

  Ran 2 shell commands (ctrl+o to expand)

⏺ Backend hotový a otypovaný. Teď frontend v designu clientelo.cz — nejdřív
  styly, layout a sdílené komponenty.

⏺ Write(src/styles.css)
  ⎿  Wrote 928 lines to src/styles.css
       1 /* Design podle clientelo.cz: teal + červený akcent, Lora pro na
         dpisy, Lexend pro text. */
       2 :root {
       3   --bg: #ffffff;
       4   --ink: #13302e;
       6   --line: #dce8e7;
       7   --line-2: #cdd8d7;
       8   --teal: #00666c;
       9   --teal-d: #004b50;
      10   --teal-dd: #06322f;
     … +921 lines (ctrl+o to expand)

⏺ Teď index.html, API klient, kontext verzí, layout a sdílené komponenty.

  Read 2 files, ran 4 shell commands (ctrl+o to expand)

⏺ Píšu stránky aplikace (databáze hotová, teď detail správce, kola, metodika a
  další moduly).

  Read 4 files, ran 3 shell commands (ctrl+o to expand)

⏺ Zbývají stránky Go/no-go, Kalkulačka, Zdroje a Verze.

  Ran 1 shell command (ctrl+o to expand)

⏺ Write(src/pages/Kalkulacka.tsx)
  ⎿  Wrote 539 lines to src/pages/Kalkulacka.tsx
       1 import { useEffect, useMemo, useState, type ReactNode } from 're
       2 import { Link, useSearchParams } from 'react-router-dom'
       3 import { api, useApi } from '../api'
       5 import { cislo, datumCas, kc, mil, procento } from '../../shared
       6 import { klonuj, SCENAR_NAZEV, SCENARE, VYCHOZI_PARAMETRY, type 
         ParametryKalkulacky, type Scenar } from '../../shared/kalkulacka
       7 import { CITLIVOSTI, vypocetAI, vypocetBezAI, vypocetVse } from 
         '../../shared/kalkulacka/vypocet'
       9 
         '
     … +631 lines (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

⏺ Celý projekt se přeložil bez chyb typů. Spouštím dev server a ověřuji v
  prohlížeči.

  Ran 3 shell commands (ctrl+o to expand)  ⎿  Error: The dev server exited during startup (code 7). Fix the error in the 
     output below, then start the server again.

     Output:
     /usr/local/lib/node_modules/npm/lib/cli/validate-engines.js:31
         throw err
         ^

     Error: EPERM: operation not permitted, uv_cwd
         at process.wrappedCwd 
     (node:internal/bootstrap/switches/does_own_process_state:142:28)
         at process.cwd (/usr/local/lib/node_modules/npm/node_modules/graceful-f
     s/polyfills.js:10:19)
     … +14 lines (ctrl+o to expand)

  Ran 2 shell commands (ctrl+o to expand)

⏺ Server běží a API odpovídá (fulltext „valka“ najde 5 investorů ValkaAI).
  Otevírám aplikaci v prohlížeči.

  Ran 1 shell command (ctrl+o to expand)

⏺ Ladím vzhled v prohlížeči — opravuji chybějící boční odsazení obsahu.

  Ran 1 shell command (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

⏺ Filtry fungují (konflikt → #4 a #6). Kontroluji detail správce a kola ValkaAI.

  Ran 1 shell command (ctrl+o to expand)

⏺ Kotvy fungují. Pokračuji kontrolou průvodce stromem, metrik a kalkulačky.
⏺ Čtecí části fungují. Zápisové toky (kontrola, go/no-go, varianty, nové verze)
  otestuji na samostatné Neon větvi, aby se hlavní data nezašpinila.

  Ran 2 shell commands (ctrl+o to expand)

⏺ Všechny zápisové toky fungují správně – slepý režim, výpočty
  shody/kappy/záchytu, blokace zmrazené verze (409) i kopírování verze 1.2
  včetně historie. Teď se podívám na UI kontroly s daty.

  Ran 1 shell command (ctrl+o to expand)

⏺ Go/no-go se vyhodnocuje správně. Ještě ověřím obrazovku hodnocení naslepo na
  testovací větvi.

⏺ Kontrola naslepo funguje. Ještě kontrola mobilního zobrazení a produkčního
  buildu.

  Ran 1 shell command (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)
  ⎿  Error: [resize_window] Viewport set to 375x812 (mobile) on this tab (scaled
     down to fit if larger than the pane). Reset it with preset "desktop" as 
     soon as you finish testing; the desktop app also clears a size you set when
     your turn ends or the pane's width changes, so set it again if you still 
     need it. If the user wants to keep a phone or tablet size after your turn, 
     they can pick Mobile or Tablet in the pane's Viewport menu; a custom size 
     you simply set again next turn.


     Tab Context:
     - Executed on tabId: tab-1
     - Available tabs:
       • tabId tab-1: "Databáze investorů – pilot ČR" ("http://localhost:5173/")
     - Viewport: emulating 375x812 (you set this; reset it with preset "desktop"
     when you finish testing; the app also clears it when your turn ends or the
     pane's width changes)
     [navigate] navigated to http://localhost:5173/

     … +27 lines (ctrl+o to expand)

⏺ Mobilní layout už nepřetéká; ověřuji ještě otevírání mobilního menu.

  Ran 1 shell command (ctrl+o to expand)

⏺ Build prochází. Rozdělím ještě bundle na menší části (lazy načítání stránek),
  aby úvodní načtení bylo rychlejší.

  Ran 2 shell commands (ctrl+o to expand)

⏺ Stop Task
  ⎿  DATABASE_URL='postgresql://neondb_owner:<HESLO>@ep-dawn-salad
     -b9pcotlm-pooler.c-7.eu-central-1.aws.neon.tech/neondb?channel_binding
     =require&sslmode=req… · stopped
⏺ Aplikace je hotová a běží lokálně na http://localhost:5173 (otevřená v panelu
  prohlížeče). Data jsou v novém Neon projektu databaze-investoru (Frankfurt).
  Role a přihlašování jsem podle zadání vynechal.

  Ověřeno:
  - npm test: 61 testů prochází. Pokrývají metriky a Wilsonovy intervaly,
    všechny hraniční případy rozhodovacího stromu (AT-30 až AT-42) a všechna
    čísla kalkulačky (AT-50 až AT-70).
  - npm run db:validate: AT-01 až AT-17 procházejí přímo proti Neonu. Patří sem
    i export JSON, který dává stejná data jako seed.
  - Zápisy (kontrola naslepo, kappa, záchyt, go/no-go, uložené varianty
    kalkulačky, nová verze dat s historií změn) jsem zkoušel na samostatné
    testovací větvi Neonu, ne na hlavních datech. Fungují. Zápis do zmrazené
    verze 1.1 vrací chybu 409.
  - Typy, lint a produkční build jsou bez chyb. Na mobilu (375 px) se stránka
    nikde nepřelévá do strany.

  Co aplikace obsahuje: přehled, pilotní databázi (filtry, fulltext, detail
  investora a kola, export CSV/JSON), metodiku (kapitoly 0–11 s odkazy na zdroje
  a mezi kapitolami), interaktivní rozhodovací strom, metriky, nezávislou
  kontrolu, go/no-go, kalkulačku nákladů, zdroje 1–68 a správu verzí dat. Design
  přebírá barvy a písma z clientelo.cz: tmavě zelenou, červený akcent a fonty
  Lora a Lexend.

  Odchylky od dokumentu (podrobně v README.md):
  - Celé API běží jako jedna Vercel funkce místo souboru na každou cestu. Cest
    je 26 a bezplatný plán Vercelu povoluje nejvýš 12 funkcí. Cesty i metody
    odpovídají sekci 7.
  - Přidal jsem druhou migraci: k verzi dat se ukládá, ze které verze vznikla
    (potřebuje to historie změn), a pár indexů.
  - Hodnocení kontrolora, ruční vstupy go/no-go a varianty kalkulačky lze
    ukládat i u zmrazené verze, protože nejde o data verze. Zmrazení blokuje jen
    úpravy záznamů.
  - Kontrolor se zadává jen jménem. Skrytí stupně a poznámek až do uložení
    hodnocení ale hlídá API, ne jen obrazovka.

  Jeden drobný nález: kliknutí na tlačítko „Menu“ v emulovaném mobilním
  zobrazení panelu nereagovalo. Přímo v kódu se menu otevírá správně, takže to
  nejspíš je chyba emulace. Na skutečném telefonu jsem to nezkoušel.

  Do Gitu jsem zatím nic necommitoval (jen jsem založil prázdný repozitář) a na
  Vercel jsem nenasazoval. Soubor .env s přístupem k databázi je vyřazený z
  Gitu.

  Rozhodnutí pro vás:
  - Testovací větev test-zapisy v Neonu: zůstala tam i s testovacím hodnocením,
    verzí 1.2 a variantou kalkulačky. Hlavní data jsou čistá. Mám ji smazat?
  - Nasazení: mám udělat první commit, založit repozitář na GitHubu a projekt na
    Vercelu napojit přes integraci Vercel–Neon?
  - Přihlašování a role: až na ně přijde řada, rozhodnutí z otázky O-1 v
    dokumentu (Neon Auth nebo jiný poskytovatel) bude potřeba před ostrou
    kontrolou.

⏺ Background shell command didn't finish before the previous session ended

❯ udělej commmit a push do main větve na  github do repa                        
  https://github.com/KarelSmola/databaze-investoru                              

  Searched for 1 pattern, ran 2 shell commands (ctrl+o to expand)

⏺ Je to zadání a výstupy, ze kterých aplikace vychází, bez citlivých údajů –
  přidám je do commitu. Před commitem ještě spustím testy a kontrolu typů.

  Ran 2 shell commands (ctrl+o to expand)

⏺ Push selhal, protože GitHub účet nemá oprávnění workflow pro
  .github/workflows/ci.yml. Pushnu zbytek kódu bez tohoto souboru a CI nechám
  připravené lokálně na později.

  Pushed to main (ctrl+o to expand)

⏺ Kód je na GitHubu ve větvi main:
  https://github.com/KarelSmola/databaze-investoru (commit 0e37bb9 jsem kvůli CI
  ještě upravil, takže na GitHubu má jiný hash). Jde jen bez CI, protože GitHub
  soubor s CI odmítl. Před commitem prošly kontrola typů, lint i všech 61
  testů.

  Co v commitu je:
  - Celá aplikace.
  - Složka _zadani_llm_outputs/, kterou jste mezitím do projektu přidal (zadání
    a výstupy, ze kterých aplikace vychází). Zkontroloval jsem ji, citlivé údaje
    neobsahuje.
  - .env s přístupem k databázi v repozitáři není, je vyřazený z Gitu. V
    ostatních souborech jsem přístupové údaje k Neonu nenašel.

  Co chybí – CI (GitHub Actions): přihlášení gh na tomto počítači nemá oprávnění
  měnit soubory GitHub Actions, proto GitHub odmítl .github/workflows/ci.yml.
  Soubor jsem z commitu vyňal a nechal ho lokálně, takže zůstává v git status
  jako nepřidaný. Chcete-li CI zapnout, obnovte oprávnění tímto příkazem (otevře
  se prohlížeč):

  gh auth refresh -h github.com -s workflow

  Pak mi napište a soubor s CI commitnu a pushnu zvlášť.

  Testovací větev test-zapisy v Neonu pořád existuje. Pokud ji nepotřebujete,
  můžu ji smazat.

❯ Do projektu dodělej soubory CLAUDE.md a AGENTS.md s informacemi o projektu.   

  Ran 1 shell command (ctrl+o to expand)

⏺ Write(AGENTS.md)
  ⎿  Wrote 109 lines to AGENTS.md
      1 # AGENTS.md – Databáze investorů (pilot ČR)
      3 Návod pro AI agenty a vývojáře, kteří na projektu pracují. Uživat
      4 
      5 ## O projektu
      7 Webová aplikace k úloze „Spolehlivá databáze investorů“: metodika
        ování (data v1.1, stav k 11. 10. 2026), metriky s Wilsonovými int
         nákladů a zdroje 1–68. UI je celé v češtině, design přebírá vzhl
        ed [clientelo.cz](https://www.clientelo.cz/).
      9 **Zdroj pravdy je předávací dokument** `_zadani_llm_outputs/outpu
        O
     … +195 lines (ctrl+o to expand)

⏺ Write(CLAUDE.md)
  ⎿  Wrote 14 lines to CLAUDE.md
       1 # CLAUDE.md
       3 Hlavní pokyny k projektu jsou v AGENTS.md (architektura, konvenc
         e, doménová pravidla, postupy):
       5 @AGENTS.md
       6 
       8 
       9 - **Komunikace s uživatelem česky.** UI, komentáře i commit zprá
      10 - **Dev server:** `preview_start` podle `.claude/launch.json` mů
         že skončit chybou `EPERM: uv_cwd` (macOS omezuje přístup do `~/D
         ash na pozadí a v prohlížeči otevři `http://localhost:5173`.
     … +18 lines (ctrl+o to expand)

⏺ Přidal jsem do projektu dva soubory, zatím jsou jen lokálně – necommitnul jsem
  je.

  - AGENTS.md je hlavní návod k projektu pro AI agenty i vývojáře:
    - o čem projekt je a že výchozí specifikací je předávací dokument ve složce
      _zadani_llm_outputs/,
    - příkazy, architektura a k čemu slouží jednotlivé adresáře,
    - konvence kódu: české názvy a přípona .js v importech na serveru,
    - pravidla, která se nesmí porušit:
      - doslovné texty se nepřepisují,
      - částka kola není tiket investora,
      - verze 1.1 je zmrazená,
      - kontrolor nesmí vidět hodnocení, dokud záznam sám neohodnotí,
      - kalkulačka musí s výchozími parametry dávat přesně čísla z dokumentu,
    - postupy pro nový endpoint, migraci a stránku, design (barvy clientelo.cz)
      a otevřené body.
  - CLAUDE.md načítá obsah AGENTS.md a doplňuje jen věci specifické pro Claude
    Code:
    - jak spustit dev server, když spuštění přes panel náhledu selže,
    - zápisy testovat jen na testovací větvi Neonu,
    - mazání dat jen s vaším souhlasem,
    - kontrola mobilní šířky po změnách UI,
    - commity jen na požádání.

  AGENTS.md je hlavní soubor, aby se pokyny neduplikovaly. Claude Code ho přes
  CLAUDE.md načte automaticky a ostatní nástroje ho čtou přímo.

  Mám oba soubory commitnout a pushnout do main?

❯ V Claude.md nech jen odkaz na Agents.md a veškeré informace dej tam           

⏺ Update(AGENTS.md)
  ⎿  Added 9 lines
      101  - Neon projekt `databaze-investoru` (ID `old-sun-07993505`), v
           ýchozí větev `main` s daty v1.1. Větev `test-zapisy` byla vytv
           ořena pro testy zápisů a obsahuje testovací hodnocení a verzi 
           1.2.
      102  - Repozitář: https://github.com/KarelSmola/databaze-investoru 
           (větev `main`).
      103  
      104 +## Pracovní pravidla pro AI agenty                            
      105 +                                                              
      106 +- **Komunikace s uživatelem česky.** UI, komentáře i commit zp
          +rávy jsou v češtině.                                          
      107 +- **Dev server:** pokud spuštění přes `.claude/launch.json` sk
          +ončí chybou `EPERM: uv_cwd` (macOS omezuje přístup do `~/Docum
          +ents`), spusť `npx vite --port 5173 --strictPort` na pozadí a 
          +v prohlížeči otevři `http://localhost:5173`.                  
      108 +- **Testy zápisů do databáze** (kontrola, go/no-go, nové verze
          +) dělej proti větvi `test-zapisy` nebo nové testovací větvi Ne
          +onu, ne proti `main` – na `main` jsou data v1.1. Druhý dev ser
          +ver pro testovací větev spusť s `DATABASE_URL=<connection stri
          +ng větve> npx vite --port 5174`.                              
      109 +- **Destruktivní operace** (mazání větví, `DELETE` nad daty, `
          +db:seed --force`) jen po výslovném souhlasu uživatele.        
      110 +- **Ověření změn UI:** po úpravě stránky ji zkontroluj v prohl
          +ížeči na desktopu i v mobilní šířce (375 px) a ověř, že `docum
          +ent.documentElement.scrollWidth` nepřesahuje šířku okna.      
      111 +- **Git:** commit a push jen na požádání. Soubory v `.github/w
          +orkflows/` nejde pushnout, dokud uživatel nespustí `gh auth re
          +fresh -h github.com -s workflow`.                             
      112 +                                                              
      113  ## Stav a otevřené body
      114  
      115  - **Přihlášení a role (O-1)** nejsou implementované; kontrolor
            se identifikuje jen jménem. Nepřidávej autentizaci bez zadání
           .

⏺ Write(CLAUDE.md)
  ⎿  Removed 13 lines
       1 -# CLAUDE.md                                                    
       2 -                                                               
       3 -Hlavní pokyny k projektu jsou v AGENTS.md (architektura, konven
         -ce, doménová pravidla, postupy):                               
       4 -                                                               
       1  @AGENTS.md
       6 -                                                               
       7 -## Specifika pro Claude Code                                   
       8 -                                                               
       9 -- **Komunikace s uživatelem česky.** UI, komentáře i commit zpr
         -ávy jsou v češtině.                                            
      10 -- **Dev server:** `preview_start` podle `.claude/launch.json` m
         -ůže skončit chybou `EPERM: uv_cwd` (macOS omezuje přístup do `~
         -/Documents`). Pak spusť `npx vite --port 5173 --strictPort` pře
         -s Bash na pozadí a v prohlížeči otevři `http://localhost:5173`.
      11 -- **Neon MCP:** projekt `old-sun-07993505`. Zápisové testy API 
         -(kontrola, go/no-go, nové verze) dělej proti větvi `test-zapisy
         -` nebo nové testovací větvi, ne proti `main` – na `main` jsou d
         -ata v1.1. Druhý dev server pro testovací větev spusť s `DATABAS
         -E_URL=<connection string větve> npx vite --port 5174`.         
      12 -- **Destruktivní operace** (mazání větví, `DELETE` nad daty, `d
         -b:seed --force`) jen po výslovném souhlasu uživatele.          
      13 -- **Ověření změn UI:** po úpravě stránky ji zkontroluj v prohlí
         -žeči na desktopu i v mobilní šířce (375 px) a ověř, že `documen
         -t.documentElement.scrollWidth` nepřesahuje šířku okna.         
      14 -- **Git:** commit a push jen na požádání. Soubory v `.github/wo
         -rkflows/` nejde pushnout, dokud uživatel nespustí `gh auth refr
         -esh -h github.com -s workflow`.                                

⏺ Hotovo: CLAUDE.md teď obsahuje jen řádek @AGENTS.md, který Claude Code při
  načtení nahradí obsahem AGENTS.md. Pokyny, které byly dřív jen v CLAUDE.md,
  jsem přesunul do AGENTS.md jako novou sekci „Pracovní pravidla pro AI agenty“.
  Žádné informace se neztratily.

  Oba soubory jsou zatím jen lokálně. Mám je commitnout a pushnout do main?

❯ udělej commit a push                                                          

  Pushed to main (ctrl+o to expand)

⏺ AGENTS.md a CLAUDE.md jsou commitnuté a pushnuté do main na GitHub jako commit
  bdd1c02.

  Mimo commit zůstal jen soubor s CI (.github/). Půjde pushnout, až obnovíte
  oprávnění příkazem gh auth refresh -h github.com -s workflow.

❯ Na Vercelu jsem založil nový projekt                                          
  https://databaze-investoru.vercel.app/databaze a udělal deploy aplikace.      
  Doplň do .env.example chybějící URL a přístupy                                

  Ran 1 shell command (ctrl+o to expand)

⏺ Deploy na https://databaze-investoru.vercel.app běží, ale API vrací chybu 500
  kvůli chybějící proměnné DATABASE_URL – na Vercelu nejsou nastavené přístupy k
  Neonu. Jelikož je repozitář veřejný, doplním do .env.example skutečné adresy,
  ale heslo ponechám jako zástupný text.

⏺ Write(.env.example)
  ⎿  Added 15 lines, removed 4 lines
       1 -# Neon – pooled connection (API)                               
       2 -DATABASE_URL=postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.
         -neon.tech/neondb?sslmode=require                               
       3 -# Neon – direct connection (migrace a seed)                    
       4 -DATABASE_URL_UNPOOLED=postgresql://USER:PASSWORD@HOST.REGION.aw
         -s.neon.tech/neondb?sslmode=require                             
       1 +# Šablona proměnných prostředí. Zkopírujte do .env (je v .gitig
         +nore) a doplňte heslo.                                         
       2 +# Repozitář je veřejný: skutečné heslo sem nikdy nezapisujte.  
       3 +#                                                              
       4 +# Heslo role neondb_owner najdete v Neon Console → projekt data
         +baze-investoru                                                 
       5 +# (ID old-sun-07993505) → Connect. Stejné proměnné je potřeba n
         +astavit i na Vercelu                                           
       6 +# (Project → Settings → Environment Variables), nebo je nastaví
         + integrace Vercel–Neon.                                        
       7 +                                                               
       8 +# Produkční adresa aplikace (Vercel), jen pro informaci – kód j
         +i nepoužívá.                                                   
       9 +APP_URL=https://databaze-investoru.vercel.app                  
      10 +                                                               
      11 +# Neon, větev main – pooled připojení (API, Vercel Functions)  
      12 +DATABASE_URL=postgresql://neondb_owner:<HESLO>@ep-weathered-bre
         +ad-b9lsnc9i-pooler.c-7.eu-central-1.aws.neon.tech/neondb?sslmod
         +e=require&channel_binding=require                              
      13 +                                                               
      14 +# Neon, větev main – přímé připojení (migrace a seed: npm run d
         +b:setup)                                                       
      15 +DATABASE_URL_UNPOOLED=postgresql://neondb_owner:<HESLO>@ep-weat
         +hered-bread-b9lsnc9i.c-7.eu-central-1.aws.neon.tech/neondb?sslm
         +ode=require&channel_binding=require                            

⏺ Bash(python3 - <<'EOF'
      p='AGENTS.md'; s=open(p).read()…)
  ⎿   .env.example | 19 +++++++++++++++----
      AGENTS.md    |  5 +++--
      2 files changed, 18 insertions(+), 6 deletions(-)
  ⎿  Updated AGENTS.md (+3 -2)
       99  
      100  - `DATABASE_URL` (pooled, pro API) a `DATABASE_URL_UNPOOLED` (
           migrace, seed) jsou v lokálním `.env`, který je v `.gitignore`
           . Šablona je `.env.example`. Connection string nikdy necommitu
           j, nevypisuj do výstupu ani nevkládej do kódu SPA.
      101  - Neon projekt `databaze-investoru` (ID `old-sun-07993505`), v
           ýchozí větev `main` s daty v1.1. Větev `test-zapisy` byla vytv
           ořena pro testy zápisů a obsahuje testovací hodnocení a verzi 
           1.2.
      102 -- Repozitář: https://github.com/KarelSmola/databaze-investoru 
          -(větev `main`).                                               
      102 +- Repozitář: https://github.com/KarelSmola/databaze-investoru 
          +(větev `main`, **veřejný** – do commitovaných souborů nikdy ne
          +piš hesla).                                                   
      103 +- Produkce: https://databaze-investoru.vercel.app             
      104  
      105  ## Pracovní pravidla pro AI agenty
      106  
     ...
      115  
      116  - **Přihlášení a role (O-1)** nejsou implementované; kontrolor
            se identifikuje jen jménem. Nepřidávej autentizaci bez zadání
           .
      117  - **CI:** `.github/workflows/ci.yml` je připravený lokálně, al
           e necommitnutý – token `gh` nemá oprávnění `workflow`.
      117 -- **Nasazení na Vercel** zatím neproběhlo.                    
      118 +- **Nasazení:** produkce běží na https://databaze-investoru.ve
          +rcel.app (Vercel projekt napojený na GitHub). Na Vercelu musí 
          +být nastavené `DATABASE_URL` a `DATABASE_URL_UNPOOLED`, jinak 
          +API vrací 500.                                                
      119  - **O-5:** úroveň zdroje u části dokladů je `null` (doplní kon
           trolor). **O-6:** sektory a fáze jsou prázdné, doplní se v nez
           mrazené verzi.

⏺ Do .env.example jsem doplnil skutečné adresy, ale heslo k databázi jsem tam
  nedal. Repozitář je veřejný, takže by ho viděl kdokoli, kdo ho otevře.

  Hlavní problém je ale jinde: API na Vercelu teď nefunguje. /api/verze i
  /api/spravci vracejí chybu 500 „Chybí proměnná prostředí DATABASE_URL.“
  Stránky se načtou, ale bez dat. .env.example je jen šablona v repozitáři a
  Vercel z ní nic nečte, takže přístupy musí být nastavené přímo ve Vercelu.

  Co je v .env.example:
  - APP_URL=https://databaze-investoru.vercel.app jako informace, kód tuto
    proměnnou nepoužívá.
  - DATABASE_URL (připojení pro API) a DATABASE_URL_UNPOOLED (připojení pro
    migrace a seed) se skutečným serverem, uživatelem a databází hlavní větve
    Neonu. Místo hesla je <HESLO> a poznámka, kde ho najít: Neon Console →
    projekt databaze-investoru → Connect.

  V AGENTS.md jsem doplnil produkční adresu, že je repozitář veřejný a že Vercel
  potřebuje obě proměnné. Změny zatím nejsou commitnuté.

  Jak API zprovoznit – jedna z možností:
  1. Ve Vercelu zapnout integraci Vercel–Neon a napojit ji na projekt
     databaze-investoru. Proměnné pak nastaví sama.
  2. Ve Vercelu v Project → Settings → Environment Variables ručně přidat
     DATABASE_URL a DATABASE_URL_UNPOOLED se skutečnými hodnotami z vašeho
     lokálního .env a spustit nový deploy.

  Druhou možnost můžu udělat za vás přes nástroje Vercelu, které mám k
  dispozici. Jde o zápis přístupových údajů do vašeho Vercel účtu, proto chci
  váš souhlas. Mám to nastavit, nebo raději zapnete integraci sám? A mám změny v
  .env.example a AGENTS.md commitnout a pushnout?
❯ hotovo, zkotroluj jestli je vše v pořádku                                     

  Ran 1 shell command (ctrl+o to expand)

⏺ API v produkci funguje a je napojené na hlavní větev Neonu – jen verze 1.1,
  bez testovacích dat, metriky sedí. Teď ověřím ochranu dat a zobrazení v
  prohlížeči.

  Ran 1 shell command (ctrl+o to expand)

⏺ Produkce na https://databaze-investoru.vercel.app je v pořádku.

  - Napojení na databázi: API běží a je připojené na hlavní větev Neonu, ne na
    testovací. Je tam jen zmrazená verze 1.1, bez testovacích hodnocení a bez
    verze 1.2. Funkce běží ve Frankfurtu, stejně jako databáze.
  - Endpointy: všech 10, které jsem zkusil, vrací 200 a odpovídají do 0,2 s –
    výpis a detail správce, kolo, metriky, zdroje, go/no-go, kalkulačka,
    kontrola i export. Neznámá cesta vrací 404.
  - Data: v produkci 30 správců, rozložení A 22 / B 4 / kandidát 2 / watchlist 1
    / vyřazen 1. Všech šest metrik včetně Wilsonových intervalů sedí s
    dokumentem (např. 26/30, interval 70,3–94,7 %).
  - Ochrana dat:
    - Pokus o úpravu záznamu ve zmrazené verzi 1.1 vrací 409, data se nezměnila.
    - Kontrola naslepo v produkci skrývá stupeň, stav i označení „kontrolní
      negativní případ“, u HitHitu je vidět jen název.
  - Stránky: přehled a detail správce se v prohlížeči načítají s daty, v konzoli
    nejsou žádné chyby. Přímé odkazy na podstránky (např. /databaze/8) fungují.

  Lokálně zůstávají necommitnuté úpravy .env.example a AGENTS.md z minula, plus
  složka s CI. Mám .env.example a AGENTS.md commitnout a pushnout?

❯ udělej commit a push                                                          

  Pushed to main (ctrl+o to expand)

⏺ .env.example a AGENTS.md jsou commitnuté a pushnuté do main (commit 3147101).
  Před commitem jsem ověřil, že v nich není heslo k databázi.

  Mimo commit zůstaly dvě věci:
  - .github/ – soubor s CI, který nejde pushnout, dokud neobnovíte oprávnění
    příkazem gh auth refresh -h github.com -s workflow.
  - _shrnuti_jak_projekt_vznikal/ – nová složka, kterou jste do projektu přidal.
    Nezahrnul jsem ji, protože jste o ní nemluvil a neprošel jsem ji. Pokud ji
    chcete mít v repozitáři, zkontroluju ji a commitnu.

❯ zahrň i novou složku _shrnuti......                                           

  Pushed to main, read 1 file, listed 1 directory (ctrl+o to expand)

⏺ Složka _shrnuti_jak_projekt_vznikal/ je commitnutá a pushnutá do main (commit
  34243de). Obsahuje jediný soubor Shrnuti_jak_projekt_vznikal.md; prošel jsem
  ho a žádné přístupové údaje v něm nejsou.

  Mimo repozitář teď zůstává jen soubor s CI v .github/. Pushnout ho půjde, až
  obnovíte oprávnění příkazem gh auth refresh -h github.com -s workflow.

❯ Zkontroluj AGENTS.md a README.md, oprav nesrovnalosti, doplň chybějící        

  Read 1 file, ran 2 shell commands (ctrl+o to expand)

⏺ README nesprávně zmiňuje neexistující CI, chybně popisuje rozsah testů a
  postrádá produkční adresu, proměnné prostředí, úplný přehled API i nově
  přidané složky/soubory – stejné mezery mám i v AGENTS.md. Teď README přepíšu a
  AGENTS.md doplním.

⏺ Write(README.md)
  ⎿  Added 131 lines, removed 28 lines
        1  # Databáze investorů – pilot ČR
        2  
        3 -Webová aplikace podle předávacího dokumentu v2.0: metodika (ka
          -pitoly 0–11), pilotní databáze 30 VC subjektů a 25 kol financo
          -vání (data v1.1, stav k 11. 10. 2026), metriky s Wilsonovými i
          -ntervaly, nezávislá kontrola naslepo, go/no-go, kalkulačka nák
          -ladů a zdroje 1–68. Design podle [clientelo.cz](https://www.cl
          -ientelo.cz/) (teal + červený akcent, Lora a Lexend).          
        3 +Webová aplikace podle předávacího dokumentu v2.0 ([`_zadani_ll
          +m_outputs/outputs/Claude/predavaci_dokument_databaze_investoru
          +.md`](_zadani_llm_outputs/outputs/Claude/predavaci_dokument_da
          +tabaze_investoru.md)). Obsahuje:                              
        4  
        5 +- metodiku (kapitoly 0–11),                                   
        6 +- pilotní databázi 30 VC subjektů a 25 kol financování (data v
          +1.1, stav k 11. 10. 2026),                                    
        7 +- metriky s Wilsonovými intervaly,                            
        8 +- nezávislou kontrolu naslepo,                                
        9 +- kritéria go/no-go,                                          
       10 +- kalkulačku nákladů,                                         
       11 +- zdroje 1–68.                                                
       12 +                                                              
       13 +Design podle [clientelo.cz](https://www.clientelo.cz/) (teal +
          + červený akcent, písma Lora a Lexend). Jak projekt vznikal, po
          +pisuje [`_shrnuti_jak_projekt_vznikal/`](_shrnuti_jak_projekt_
          +vznikal/Shrnuti_jak_projekt_vznikal.md).                      
       14 +                                                              
       15 +- **Produkce:** https://databaze-investoru.vercel.app         
       16 +- **Repozitář:** https://github.com/KarelSmola/databaze-invest
          +oru (veřejný)                                                 
       17 +- **Pokyny pro AI agenty a vývojáře:** [AGENTS.md](AGENTS.md) 
          +(CLAUDE.md na něj jen odkazuje)                               
       18 +                                                              
       19  ## Stack
       20  
        7 -- **Frontend:** SPA, React 19 + TypeScript (strict), Vite, Rea
          -ct Router, `react-markdown` + `remark-gfm`                    
        8 -- **API:** Vercel Functions v TypeScriptu, jediná funkce `api/
          -router.ts` (viz níže)                                         
       21 +- **Frontend:** SPA, React 19 + TypeScript (strict), Vite, Rea
          +ct Router 7, `react-markdown` + `remark-gfm`                  
       22 +- **API:** Vercel Functions (Node.js) v TypeScriptu, jediná fu
          +nkce `api/router.ts`                                          
       23  - **Databáze:** Neon (PostgreSQL 17, `aws-eu-central-1`), driv
           er `@neondatabase/serverless`
       10 -- **Validace a testy:** Zod, Vitest, ESLint; CI v GitHub Actio
          -ns                                                            
       24 +- **Validace a testy:** Zod, Vitest, ESLint                   
       25 +- **Node.js:** ≥ 22                                           
       26  
       27  ## Rychlý start
       28  
       29  ```bash
       30  npm install
       16 -cp .env.example .env   # doplnit DATABASE_URL a DATABASE_URL_U
          -NPOOLED z Neonu                                               
       31 +cp .env.example .env   # doplnit heslo do DATABASE_URL a DATAB
          +ASE_URL_UNPOOLED                                              
       32  npm run db:setup       # migrace + seed + validace AT-01 až AT
           -17
       33  npm run dev            # http://localhost:5173 (API běží ve st
           ejném dev serveru)
       34  ```
       35  
       36 +Do prázdné databáze je potřeba spustit `npm run db:setup`. Nad
          + existující databází, kde už data jsou, stačí `npm run dev`.  
       37 +                                                              
       38 +### Proměnné prostředí                                        
       39 +                                                              
       40 +| Proměnná | K čemu | Kde |                                   
       41 +|---|---|---|                                                 
       42 +| `DATABASE_URL` | Pooled připojení k Neonu pro API | `.env` l
          +okálně, Environment Variables na Vercelu |                    
       43 +| `DATABASE_URL_UNPOOLED` | Přímé připojení pro migrace a seed
          + | `.env` lokálně, Vercel |                                   
       44 +| `APP_URL` | Adresa produkce, jen informativně (kód ji nečte)
          + | `.env.example` |                                           
       45 +                                                              
       46 +`.env` je v `.gitignore`. Heslo role `neondb_owner` je v Neon 
          +Console → projekt `databaze-investoru` (ID `old-sun-07993505`)
          + → Connect. Repozitář je veřejný, takže heslo nepatří do žádné
          +ho commitovaného souboru.                                     
       47 +                                                              
       48 +### Skripty                                                   
       49 +                                                              
       50  | Skript | Co dělá |
       51  |---|---|
       23 -| `npm run dev` | Vite dev server; `/api/*` obsluhuje stejný r
          -outer jako na Vercelu |                                       
       24 -| `npm test` | Akceptační testy AT-01–16, AT-04–12, AT-30–42, 
          -AT-50–70 (bez DB) |                                           
       25 -| `npm run db:migrate` | Aplikuje `db/migrations/*.sql` (evide
          -nce v tabulce `schema_migrace`) |                             
       26 -| `npm run db:seed` | Idempotentní seed verze 1.1 z `data/pilo
          -t_v1.1.json`; `-- cesta.json` pro reimport, `--force` smaže i 
          -hodnocení kontrolora |                                        
       27 -| `npm run db:validate` | AT-01 až AT-17 proti Neonu (včetně e
          -xportu a porovnání se seed daty) |                            
       52 +| `npm run dev` | Vite dev server; `/api/*` obsluhuje stejný r
          +outer jako na Vercelu (plugin `lokalniApi` ve `vite.config.ts`
          +) |                                                           
       53 +| `npm test` | Vitest bez databáze (61 testů, viz níže) |     
       54 +| `npm run typecheck` | `tsc --noEmit` |                      
       55 +| `npm run lint` | ESLint |                                   
       56  | `npm run build` | typecheck + produkční build do `dist/` |
       57 +| `npm run preview` | náhled buildu; **API v něm neběží** (jen
          + frontend) |                                                  
       58 +| `npm run db:migrate` | aplikuje nové soubory z `db/migration
          +s/` (evidence v tabulce `schema_migrace`) |                   
       59 +| `npm run db:seed` | idempotentní seed verze 1.1 z `data/pilo
          +t_v1.1.json`; `npm run db:seed -- cesta.json` pro reimport exp
          +ortu; odmítne pokračovat, pokud verze má hodnocení kontrolora,
          + pokud není zadán `--force` (ten je smaže) |                  
       60 +| `npm run db:validate` | AT-01 až AT-17 proti Neonu (včetně p
          +orovnání exportu se seed daty) |                              
       61 +| `npm run db:setup` | `db:migrate` + `db:seed` + `db:validate
          +` |                                                           
       62  
       63 +### Testy                                                     
       64 +                                                              
       65 +| Soubor | Akceptační testy (sekce 9 dokumentu) |             
       66 +|---|---|                                                     
       67 +| `tests/data.test.ts` | AT-01–03, AT-11, AT-13–16 nad `data/p
          +ilot_v1.1.json` |                                             
       68 +| `tests/metriky.test.ts` | AT-04–12, shoda příznaků s pravidl
          +y kap. 7.3, Cohenovo kappa, medián |                          
       69 +| `tests/strom.test.ts` | AT-30–42 (hraniční případy kap. 2.2)
          +, okno aktivity |                                             
       70 +| `tests/kalkulacka.test.ts` | AT-50–70 (výchozí parametry rep
          +rodukují čísla dokumentu) |                                   
       71 +| `db/validate.ts` | AT-01–17 nad daty v Neonu; AT-17 (export 
          +a reimport) jen zde |                                         
       72 +                                                              
       73 +## Moduly aplikace                                            
       74 +                                                              
       75 +| Cesta | Modul |                                             
       76 +|---|---|                                                     
       77 +| `/` | M1 Přehled: název, závěr, TL;DR, klíčové metriky, stav
          + pilotu |                                                     
       78 +| `/databaze`, `/databaze/:id`, `/kola/:id` | M2 Pilotní datab
          +áze: tabulka kap. 7.1, filtry, fulltext, detail správce a kola
          +, export |                                                    
       79 +| `/metodika`, `/metodika/:cislo` | M3 Metodika: kapitoly 0–11
          + s citacemi a interními odkazy |                              
       80 +| `/strom` | M4 Rozhodovací strom: průvodce a hraniční případy
          + |                                                            
       81 +| `/metriky` | M5 Metriky pilotu |                            
       82 +| `/kontrola` | M6 Nezávislá kontrola: hodnocení naslepo, výsl
          +edky, referenční seznam pro záchyt |                          
       83 +| `/go-nogo` | M7 Kritéria G-1 až G-11 |                      
       84 +| `/kalkulacka` | M8 Kalkulačka nákladů (kap. 8, 9.3, 9.4, cit
          +livosti, uložené varianty) |                                  
       85 +| `/zdroje` | M9 Zdroje 1–68 se zpětnými odkazy |             
       86 +| `/verze` | Verze dat, nová verze z existující, historie změn
          + |                                                            
       87 +                                                              
       88 +## API                                                        
       89 +                                                              
       90 +Všechny cesty mají prefix `/api/`. Parametr `verze` je volitel
          +ný, výchozí `1.1`. Tučně jsou cesty navíc proti sekci 7 dokume
          +ntu.                                                          
       91 +                                                              
       92 +| Metoda a cesta | Účel |                                     
       93 +|---|---|                                                     
       94 +| `GET spravci?verze=&stav=&stupen=&skupina=&kategorie=&q=&pri
          +znak=` | seznam správců s filtry a fulltextem (+ všechna kola)
          + |                                                            
       95 +| `GET spravci/:id` | detail správce včetně účastí, dokladů a 
          +spoluinvestorů |                                              
       96 +| **`PATCH spravci/:id?verze=`** | úprava záznamu v nezmrazené
          + verzi, zápis do `historie_zmen` |                            
       97 +| `GET kola/:id` | kolo se všemi účastníky a doklady |        
       98 +| `GET zdroje` | zdroje se zpětnými odkazy na správce a kola |
       99 +| `GET metriky` | metriky kap. 7.3; po dokončené kontrole i př
          +epočet podle kontrolora |                                     
      100 +| `GET kontrola/zaznamy?kontrolor=` | záznamy pro kontrolora v
          + režimu naslepo |                                             
      101 +| `POST kontrola/hodnoceni` | uložení (přepsání) hodnocení, do
          +počítá shodu |                                                
      102 +| **`GET kontrola/kontrolori`** | kontroloři a počty hodnocení
          + |                                                            
      103 +| `GET kontrola/vysledky?kontrolor=` | metriky kap. 7.4 bod 4 
          +|                                                             
      104 +| **`GET kontrola/export?kontrolor=`** | výsledky kontroly jak
          +o CSV |                                                       
      105 +| **`GET kontrola/referencni-seznam`** | referenční seznam pro
          + záchyt |                                                     
      106 +| `POST kontrola/referencni-seznam` | import CSV s automatický
          +m návrhem mapování |                                          
      107 +| **`PUT kontrola/referencni-seznam/:id`** | ruční mapování na
          + správce |                                                    
      108 +| **`DELETE kontrola/referencni-seznam`** | vymazání seznamu |
      109 +| `GET go-nogo` | kritéria G-1 až G-11 a doporučení |         
      110 +| `PUT go-nogo/:kriterium` | ruční vstup G-6 až G-11 |        
      111 +| **`DELETE go-nogo/:kriterium`** | smazání ručního vstupu |  
      112 +| `GET` / `POST kalkulacka/varianty` | uložené varianty parame
          +trů kalkulačky |                                              
      113 +| **`DELETE kalkulacka/varianty/:id`** | smazání varianty |   
      114 +| `GET export?format=csv\|json` (+ filtry jako u `spravci`) | 
          +export celého datasetu nebo výběru |                          
      115 +| **`GET verze`** | seznam verzí dat |                        
      116 +| `POST verze` | nová verze jako kopie existující (`zmrazeno =
          + false`) |                                                    
      117 +| **`PUT verze/:id/zmrazit`** | zmrazení verze |              
      118 +| **`GET verze/:id/historie`** | historie změn verze |        
      119 +                                                              
      120 +Chyby vrací JSON `{ "chyba": "…" }`: 400 neplatný vstup, 404 n
          +eexistující záznam nebo cesta, 405 nepovolená metoda, 409 zápi
          +s do zmrazené verze nebo duplicitní verze.                    
      121 +                                                              
      122  ## Struktura
      123  
      124  ```
       33 -api/router.ts        Vercel Function – vstup pro celé API     
       34 -server/              router, adaptér pro Node, načítání verze 
          -z Neonu, handlery (routes/)                                   
       35 -shared/              čistá logika bez DB a UI: wilson, kappa, 
          -metriky, strom, kontrola, gonogo, kalkulacka/                 
       36 -src/                 React SPA (pages/ = moduly M1–M9 + verze 
          -dat)                                                          
       37 -content/             kapitoly 0–11, TL;DR, závěr, zadání (dosl
          -ovně z dokumentu)                                             
       38 -data/                pilot_v1.1.json (Příloha A), zdroje.json 
          -(Příloha C)                                                   
       39 -db/                  migrace, seed, validace                  
       40 -tests/               akceptační testy sekce 9                 
      125 +api/router.ts                 Vercel Function – vstupní bod ce
          +lého API                                                      
      126 +server/                       router (tabulka cest), adaptér p
          +ro Node, načítání verze z Neonu, handlery (routes/)           
      127 +shared/                       čistá logika bez DB a UI: wilson
          +, kappa, metriky, strom, kontrola, gonogo, filtry, format, kal
          +kulacka/                                                      
      128 +src/                          React SPA (pages/ = moduly M1–M9
          + + verze dat, components/)                                    
      129 +content/                      kapitoly 0–11, TL;DR, závěr, zad
          +ání (doslovně z dokumentu)                                    
      130 +data/                         pilot_v1.1.json (Příloha A), zdr
          +oje.json (Příloha C)                                          
      131 +db/                           migrace, seed, validace, načtení
          + .env pro skripty                                             
      132 +tests/                        akceptační testy sekce 9        
      133 +public/                       favicon                         
      134 +_zadani_llm_outputs/          zadání, výstupy ChatGPT a Clauda
          +, předávací dokument                                          
      135 +_shrnuti_jak_projekt_vznikal/ shrnutí postupu od zadání po apl
          +ikaci                                                         
      136 +vercel.json                   přepis /api/* na api/router, SPA
          + fallback, region fra1                                        
      137 +vite.config.ts                Vite + plugin lokalniApi pro /ap
          +i v dev serveru                                               
      138 +.claude/launch.json           konfigurace dev serveru pro Clau
          +de Code                                                       
      139  ```
      140  
      141  ## Nasazení na Vercel
      142  
       45 -1. Repozitář na GitHub, projekt na Vercelu napojený na repozit
          -ář (framework Vite).                                          
       46 -2. Integrace Vercel–Neon (nastaví `DATABASE_URL` a `DATABASE_U
          -RL_UNPOOLED`, preview větve), nebo proměnné zadat ručně.      
       47 -3. `vercel.json` přepisuje `/api/*` na jedinou funkci `api/rou
          -ter` a ostatní cesty na `index.html` (SPA); region funkcí `fra
          -1`.                                                           
      143 +Projekt je na Vercelu napojený na GitHub; každý push do `main`
          + spustí produkční deploy.                                     
      144  
      145 +1. Na Vercelu musí být nastavené `DATABASE_URL` a `DATABASE_UR
          +L_UNPOOLED` (ručně, nebo přes integraci Vercel–Neon). Bez nich
          + API vrací 500 „Chybí proměnná prostředí DATABASE_URL.“       
      146 +2. `vercel.json` přepisuje `/api/<cesta>` na `/api/router?path
          +=<cesta>` a ostatní cesty na `index.html` (přímé odkazy na pod
          +stránky SPA). Funkce běží ve `fra1`, stejně jako databáze.    
      147 +3. Migrace a seed se na Vercelu nespouštějí; schéma a data se 
          +zakládají lokálně přes `npm run db:setup` proti produkční data
          +bázi.                                                         
      148 +                                                              
      149  ## Odchylky a doplňky proti specifikaci
      150  
       51 -- **Jedna Vercel Function místo souboru na endpoint.** API má 
          -26 cest; Hobby plán Vercelu má limit 12 funkcí. Cesty i metody
          - odpovídají sekci 7, tabulka je v `server/router.ts`.         
      151 +- **Jedna Vercel Function místo souboru na endpoint.** API má 
          +26 cest a Hobby plán Vercelu má limit 12 funkcí. Cesty i metod
          +y ze sekce 7 zůstávají, tabulka je v `server/router.ts`.      
      152  - **Migrace `0002`:** sloupec `verze_dat.zdrojova_verze` (půvo
           d verze pro `historie_zmen.verze_z`) a indexy. `0001_init.sql`
            je doslovně DDL ze sekce 6.3.
       53 -- **Pole `poznamka`** u účastí, fondů a částek z Přílohy A se 
          -ukládá do existujících sloupců `poznamka` (jinak by export neb
          -yl shodný, AT-17).                                            
       54 -- **Zápisy kontroly, go/no-go a kalkulačky** jsou povolené i n
          -ad zmrazenou verzí – nejde o data verze. 409 vrací zápis dat z
          -áznamu (`PATCH /api/spravci/:id`) do zmrazené verze.          
       55 -- **Přihlášení a role (O-1) nejsou řešeny.** Kontrolor se iden
          -tifikuje jen jménem; režim naslepo vynucuje API (`/api/kontrol
          -a/zaznamy` nevrací stupeň, stav, poznámky ke stupni, příznaky 
          -metrik ani text „kontrolní negativní případ“, dokud kontrolor 
          -záznam neohodnotí).                                           
      153 +- **Pole `poznamka`** u účastí, fondů a částek z Přílohy A se 
          +ukládá do existujících sloupců `poznamka`, aby export byl shod
          +ný se seedem (AT-17).                                         
      154 +- **Export JSON** má formát Přílohy A (`kola`, `spravci`) a jd
          +e znovu načíst seedem. CSV používá středník a BOM kvůli Excelu
          +.                                                             
      155 +- **Zápisy kontroly, go/no-go a kalkulačky** jsou povolené i n
          +ad zmrazenou verzí, protože nejde o data verze. Kód 409 vrací 
          +zápis dat záznamu (`PATCH /api/spravci/:id`) do zmrazené verze
          +.                                                             
      156 +- **Výsledky kontroly v metrikách a go/no-go** se berou od kon
          +trolora s nejvíce hodnoceními. Po dokončení kontroly všech záz
          +namů se přesnost zařazení přepočítá podle jeho rozhodnutí a G-
          +1, G-2 přestanou být „předběžné“.                             
      157 +- **Přihlášení a role (O-1) nejsou řešeny.** Kontrolor se iden
          +tifikuje jen jménem (uloženým v prohlížeči). Režim naslepo vyn
          +ucuje API: `/api/kontrola/zaznamy` nevrací stupeň, stav, pozná
          +mky ke stupni, příznaky metrik ani text „kontrolní negativní p
          +řípad“, dokud kontrolor záznam neohodnotí.                    
      158  - **Úroveň zdroje (O-5)** doplňuje seed podle sekce 6.4 bod 5;
            nejasné zdroje zůstávají `null`. Skupina nezávislosti je zatí
           m jen u tiskové zprávy Rockaway [16][17].
       57 -- **Sektory a fáze (O-6)** jsou prázdné; lze je doplnit v nezm
          -razené verzi (detail záznamu → Upravit).                      
      159 +- **Sektory a fáze (O-6)** jsou prázdné; lze je doplnit v nezm
          +razené verzi (detail záznamu → Upravit záznam).               
      160  
       59 -## Další API cesty navíc                                      
      161 +## Stav                                                       
      162  
       61 -`PATCH /api/spravci/:id?verze=`, `GET /api/verze`, `PUT /api/v
          -erze/:id/zmrazit`, `GET /api/verze/:id/historie`, `GET /api/ko
          -ntrola/kontrolori`, `GET /api/kontrola/export`, `GET|DELETE /a
          -pi/kontrola/referencni-seznam`, `PUT /api/kontrola/referencni-
          -seznam/:id`, `DELETE /api/go-nogo/:kriterium`, `DELETE /api/ka
          -lkulacka/varianty/:id`.                                       
      163 +- Produkce běží, data jsou ve verzi 1.1 (zmrazená), nezávislá 
          +kontrola zatím neproběhla – metriky jsou předběžné.           
      164 +- CI (GitHub Actions) zatím není v repozitáři: workflow čeká, 
          +až token `gh` dostane oprávnění `workflow`. Do té doby se kont
          +roly spouštějí ručně (`npm run typecheck && npm run lint && np
          +m test`).                                                     

⏺ Ověřuji na Vercelu, jestli je projekt napojený na GitHub (kvůli tvrzení o
  automatickém deployi v README).

⏺ Vercel je napojený na GitHub a každý push do main se nasadí, takže tvrzení v
  README platí. Teď doplňuji AGENTS.md.

⏺ Bash(python3 - <<'EOF'
      p='AGENTS.md'; s=open(p).read()…)
  ⎿   AGENTS.md |  25 ++++++----
      README.md | 159 +++++++++++++++++++++++++++++++++++++++++++++++++++--
     ---------
     … +2 lines (ctrl+o to expand)
  ⎿  Updated AGENTS.md (+15 -10)
      1  # AGENTS.md – Databáze investorů (pilot ČR)
      2  
      3 -Návod pro AI agenty a vývojáře, kteří na projektu pracují. Uživa
        -telský přehled a postup nasazení je v [README.md](README.md).   
      3 +Návod pro AI agenty a vývojáře, kteří na projektu pracují. Uživa
        +telský přehled, úplný seznam API a postup nasazení je v [README.
        +md](README.md). `CLAUDE.md` jen načítá tento soubor – všechny po
        +kyny patří sem, ne do `CLAUDE.md`.                              
      4  
      5  ## O projektu
      6  
     ...
      25  npm test             # Vitest: akceptační testy bez databáze
      26  npm run typecheck    # tsc --noEmit (strict)
      27  npm run lint         # ESLint
      28 -npm run build        # typecheck + produkční build do dist/    
      28 +npm run build        # typecheck + produkční build do dist/ (vi
         +te preview pak ukáže jen frontend, bez API)                    
      29  npm run db:migrate   # aplikuje nové soubory z db/migrations
      30 -npm run db:seed      # idempotentní seed verze 1.1 (--force sma
         -že i hodnocení kontrolora)                                     
      30 +npm run db:seed      # idempotentní seed verze 1.1; bez --force
         + odmítne přepsat verzi s hodnoceními kontrolora                
      31  npm run db:validate  # AT-01 až AT-17 proti Neonu
      32  npm run db:setup     # migrate + seed + validate
      33  ```
     ...
      39  - **Frontend:** React 19 + TypeScript (strict), Vite, React Rou
          ter 7, `react-markdown` + `remark-gfm`.
      40  - **API:** Vercel Functions v Node.js. **Jediná funkce** `api/r
          outer.ts`; `vercel.json` přepisuje `/api/<cesta>` na `/api/rout
          er?path=<cesta>`.
      41  - **Databáze:** Neon (PostgreSQL 17, `aws-eu-central-1`), drive
          r `@neondatabase/serverless` (HTTP `neon()`, transakce přes `sq
          l.transaction([...])`; seed a migrace přes `Pool`).
      42 -- **Validace:** Zod u všech zapisujících endpointů. **Testy:** 
         -Vitest.                                                        
      42 +- **Validace:** Zod u všech vstupů s tělem požadavku (POST, PUT
         +, PATCH). **Testy:** Vitest.                                   
      43 +- **Lokální API:** plugin `lokalniApi` ve `vite.config.ts` obsl
         +uhuje `/api/*` v dev serveru stejným routerem jako Vercel, načt
         +e `DATABASE_URL` z `.env` a server načítá přes `ssrLoadModule`,
         + takže změny v `server/` a `shared/` se projeví bez restartu. S
         +kripty v `db/` čtou `.env` přes `db/env.ts`.                   
      44  
      45  ```
      46  Prohlížeč (src/) ──fetch /api/*──▶ api/router.ts ─▶ server/node
          .ts ─▶ server/router.ts ─▶ server/routes/*.ts
     ...
      59  | `content/` | Kapitoly 0–11, TL;DR, závěr, zadání – **doslovně
          ** z předávacího dokumentu |
      60  | `data/` | `pilot_v1.1.json` (Příloha A), `zdroje.json` (Přílo
          ha C) |
      61  | `db/` | `migrations/*.sql`, `migrate.ts`, `seed.ts`, `validat
          e.ts`, `env.ts` |
      61 -| `tests/` | Akceptační testy sekce 9 |                        
      62 -| `_zadani_llm_outputs/` | Zadání a výstupy LLM, ze kterých apl
         -ikace vychází (jen ke čtení) |                                 
      62 +| `tests/` | Akceptační testy sekce 9: `data.test.ts` (AT-01–03
         +, 11, 13–16), `metriky.test.ts` (AT-04–12), `strom.test.ts` (AT
         +-30–42), `kalkulacka.test.ts` (AT-50–70); `pomocne.ts` načítá d
         +ata. AT-17 je jen v `db/validate.ts`. |                        
      63 +| `public/` | Statické soubory (favicon) |                     
      64 +| `_zadani_llm_outputs/` | Zadání a výstupy LLM včetně předávac
         +ího dokumentu (jen ke čtení) |                                 
      65 +| `_shrnuti_jak_projekt_vznikal/` | Shrnutí postupu od zadání p
         +o aplikaci (jen ke čtení) |                                    
      66 +| kořen | `vercel.json` (přepisy cest, region `fra1`), `vite.co
         +nfig.ts`, `tsconfig.json` (jeden pro celý projekt), `eslint.con
         +fig.js`, `.env.example`, `.claude/launch.json` (dev server pro 
         +Claude Code) |                                                 
      67  
      68  ## Konvence kódu
      69  
     … 36 more lines (ctrl+o to expand)

  Ran 1 shell command (ctrl+o to expand)

⏺ Prošel jsem oba soubory proti kódu, konfiguraci a nastavení projektu na
  Vercelu a opravil je. Změny jsou zatím jen lokálně.

  Opravené nesrovnalosti v README.md
  - Tvrdilo, že projekt má CI v GitHub Actions. To v repozitáři není, protože
    soubor workflow čeká na oprávnění. Teď to README uvádí výslovně, i s tím,
    jak kontroly spustit ručně.
  - Rozsah testů byl popsaný nepřesně („AT-01–16“). Opravil jsem ho na skutečné
    pokrytí a doplnil, že AT-17 (export a reimport) se ověřuje jen proti
    databázi.
  - Seznam API obsahoval jen cesty navíc. Teď je v README úplná tabulka všech 26
    cest, cesty navíc proti dokumentu jsou vyznačené tučně, a k ní kódy chyb.

  Doplněno v README.md
  - produkční adresa, repozitář a odkaz na AGENTS.md
  - tabulka proměnných prostředí a kde najít heslo k databázi
  - přehled modulů a jejich adres v aplikaci
  - složky _zadani_llm_outputs/ a _shrnuti_jak_projekt_vznikal/ ve struktuře
    projektu
  - upozornění, že npm run preview ukáže jen frontend bez API
  - popis nasazení: Vercel je napojený na GitHub a každý push do main se nasadí
    (ověřil jsem to na posledních deployích). Migrace a seed se při nasazení
    nespouštějí.
  - dvě další odchylky od dokumentu: formát exportu a to, že metriky a go/no-go
    berou výsledky od kontrolora s nejvíce hodnoceními

  Opraveno a doplněno v AGENTS.md
  - Formulace „Zod u všech zapisujících endpointů“ nebyla přesná, platí jen pro
    požadavky s tělem (POST, PUT, PATCH).
  - Popis přepínače --force u seedu byl zavádějící. Bez něj seed odmítne přepsat
    verzi, která už má hodnocení kontrolora.
  - Doplnil jsem:
    - jak lokálně funguje API v dev serveru,
    - které testy kryjí které akceptační testy,
    - nové složky a soubory v kořeni projektu,
    - pravidlo pro výsledky kontroly,
    - co se ukládá v prohlížeči,
    - Vercel projekt a že push do main znamená nasazení do produkce, takže před
      ním proběhnou testy,
    - že pokyny patří do AGENTS.md, ne do CLAUDE.md.

  Kromě dokumentace jsem smazal prázdnou složku scripts/, kterou jsem dřív
  vytvořil a nic v ní nebylo.

  Mám změny commitnout a pushnout? Push do main spustí i nový deploy na Vercelu,
  ale aplikace samotná se nemění.

❯ udělej commit a push                                                          

  Pushed to main (ctrl+o to expand)

⏺ README.md a AGENTS.md jsou commitnuté a pushnuté do main jako commit d1ecfd3.
  Před tím prošly kontrola typů, lint a všech 61 testů a v souborech není žádné
  heslo.

  Push spustí nový produkční deploy na Vercelu; aplikace samotná se tím nemění.

  Mimo repozitář dál zůstává jen soubor s CI v .github/, protože token gh pořád
  nemá oprávnění workflow.

❯ V sekci Pilotní databáze není na šířku vidět celá tabulka s 30ti záznamy.     
  Uprav tak aby při prohlížení na ntb nebo ext. monitoru byla vidět na šířku    
  celá a nemuselo se v ní horizontálně scrollovat.                              

  Searched for 1 pattern (ctrl+o to expand)
⏺ Bash(python3 - <<'EOF'
      p='src/pages/Databaze.tsx'; s=open(p).read()…)
  ⎿  src/pages/Databaze.tsx:53:    <div className="kontejner kontejner-siro
     ky stranka">
     OK
  ⎿  Updated src/pages/Databaze.tsx (+18 -8)
      50    const vse = useApi<SeznamSpravcuOdpoved>(zalozka === 'kola' ?
           `spravci${qs({ verze })}` : null)
      51  
      52    return (
      53 -    <div className="kontejner stranka">                        
      53 +    <div className="kontejner kontejner-siroky stranka">       
      54        <Hlavicka eyebrow={`Modul M2 · data v${verze}`} nadpis="P
          ilotní databáze">
      55          <p>
      56            30 VC subjektů a 25 kol financování (stav k 11. 10. 2
          026). Texty sloupců jsou doslovně podle tabulky{' '}
     ...
      158                  Zobrazeno {data.spravci.length} z {data.celkem
           } záznamů.
      159                </p>
      160                <div className="tabulka-obal" style={{ opacity: 
           nacita ? 0.6 : 1 }}>
      161 -                <table>                                       
      161 +                <table className="tabulka-pilot">             
      162 +                  <colgroup>                                  
      163 +                    <col className="sl-cislo" />              
      164 +                    <col className="sl-subjekt" />            
      165 +                    <col className="sl-skupina" />            
      166 +                    <col className="sl-investice" />          
      167 +                    <col className="sl-datum" />              
      168 +                    <col className="sl-fond" />               
      169 +                    <col className="sl-tiket" />              
      170 +                    <col className="sl-stav" />               
      171 +                  </colgroup>                                 
      172                    <thead>
      173                      <tr>
      174                        <th>#</th>
     ...
      185                      {data.spravci.map((s) => (
      186                        <tr key={s.id} className="klik" onClick=
           {(e) => !(e.target as HTMLElement).closest('a') && navigate(`/
           databaze/${s.id}`)}>
      187                          <td className="num">{s.id}</td>
      178 -                        <td style={{ minWidth: 170 }}>        
      188 +                        <td>                                  
      189                            <Link to={`/databaze/${s.id}`} style
           ={{ fontWeight: 600 }}>
      190                              {s.subjekt_text}
      191                            </Link>
      192                            <div className="mala muted">{KATEGOR
           IE[s.kategorie]}</div>
      193                          </td>
      194                          <td>{s.skupina_text}</td>
      185 -                        <td className="siroky">               
      195 +                        <td>                                  
      196                            <TextSCitacemi text={s.investice_tex
           t} />
     … 18 more lines (ctrl+o to expand)
  ⎿  Updated src/styles.css (+56 -0)
      464    min-width: 220px;
      465  }
      466  
      467 +/* Široké stránky (pilotní databáze): na notebooku i monitoru 
          +využijí celou šířku. */                                       
      468 +.kontejner-siroky {                                           
      469 +  max-width: 1680px;                                          
      470 +}                                                             
      471 +                                                              
      472 +/* Tabulka pilotu (kap. 7.1): pevné rozložení sloupců, aby se 
          +na šířku ≥1100 px vešla bez posouvání. */                     
      473 +.tabulka-pilot {                                              
      474 +  table-layout: fixed;                                        
      475 +  font-size: 13.5px;                                          
      476 +  line-height: 1.5;                                           
      477 +}                                                             
      478 +.tabulka-pilot th {                                           
      479 +  white-space: normal;                                        
      480 +  font-size: 11px;                                            
      481 +  letter-spacing: 0.03em;                                     
      482 +}                                                             
      483 +.tabulka-pilot th,                                            
      484 +.tabulka-pilot td {                                           
      485 +  padding: 9px 10px;                                          
      486 +  overflow-wrap: break-word;                                  
      487 +  hyphens: auto;                                              
      488 +}                                                             
      489 +.tabulka-pilot .stitek {                                      
      490 +  white-space: normal;                                        
      491 +}                                                             
      492 +.tabulka-pilot .sl-cislo {                                    
      493 +  width: 3%;                                                  
      494 +}                                                             
      495 +.tabulka-pilot .sl-subjekt {                                  
      496 +  width: 12%;                                                 
      497 +}                                                             
      498 +.tabulka-pilot .sl-skupina {                                  
      499 +  width: 4%;                                                  
      500 +}                                                             
      501 +.tabulka-pilot .sl-investice {                                
      502 +  width: 23%;                                                 
      503 +}                                                             
     … 22 more lines (ctrl+o to expand)

⏺ Bash(python3 - <<'EOF'
      p='src/styles.css'; s=open(p).read()…)
  ⎿  0
     000
  ⎿  Updated src/styles.css (+0 -4)
      460    background: var(--tint);
      461    font-weight: 600;
      462  }
      463 -td.siroky {                                                   
      464 -  min-width: 220px;                                           
      465 -}                                                             
      466 -                                                              
      463  /* Široké stránky (pilotní databáze): na notebooku i monitoru 
           využijí celou šířku. */
      464  .kontejner-siroky {
      465    max-width: 1680px;

  Ran 1 shell command (ctrl+o to expand)

⏺ Tabulku jsem přepnul na pevné rozložení sloupců a stránku na širší kontejner.
  Teď ověřuji v prohlížeči při různých šířkách obrazovky.
  ⎿  Error: [computer:wait] waited 3s


     Tab Context:
     - Executed on tabId: seed
     - Available tabs:
       • tabId seed: "Databáze investorů – pilot ČR" 
     ("https://databaze-investoru.vercel.app/databaze/8")
     [resize_window] Viewport set to 1280x800 on this tab (scaled down to fit if
     larger than the pane). Reset it with preset "desktop" as soon as you 
     finish testing; the desktop app also clears a size you set when your turn 
     ends or the pane's width changes, so set it again if you still need it. If 
     the user wants to keep a phone or tablet size after your turn, they can 
     pick Mobile or Tablet in the pane's Viewport menu; a custom size you simply
     set again next turn.


     … +47 lines (ctrl+o to expand)

⏺ Na šířce 1280 px se tabulka vejde celá. Automatické dělení slov ale láme názvy
  jako „Cze-chCrunch“, takže ho vypnu a změřím i další šířky.

⏺ Bash(python3 - <<'EOF'
      p='src/styles.css'; s=open(p).read()…)
  ⎿  0
  ⎿  Updated src/styles.css (+0 -1)
      480  .tabulka-pilot td {
      481    padding: 9px 10px;
      482    overflow-wrap: break-word;
      483 -  hyphens: auto;                                              
      483  }
      484  .tabulka-pilot .stitek {
      485    white-space: normal;

  Ran 1 shell command (ctrl+o to expand)

⏺ Tabulka 30 záznamů v Pilotní databázi je teď na notebooku i externím monitoru
  vidět celá na šířku, bez vodorovného posouvání.

  Ověřil jsem to v prohlížeči při šířkách okna 1100, 1280, 1440 a 1920 px. Ve
  všech se tabulka vejde a žádný text nepřetéká z buňky. Typy, lint a všech 61
  testů prochází.

  Co jsem změnil:
  - Širší stránka: jen u pilotní databáze může obsah sahat až do 1680 px místo
    1240 px, takže na velkém monitoru využije víc místa.
  - Pevné šířky sloupců v procentech: široké sloupce (doložená investice, fond)
    dostávají víc místa, úzké (#, skupina) méně. Text se v buňkách zalamuje do
    více řádků.
  - Zalomitelné hlavičky a menší písmo: dlouhá hlavička „Doložená investice
    (firma, kolo, kolo celkem)“ už neroztahuje sloupec a tabulka má o něco menší
    písmo a odsazení.

  Kompromis:
  - Tabulka je díky zalamování vyšší: zhruba 3 000 px při šířce okna 1440 px.
  - Pod šířkou okna 1100 px (tablet, mobil) se tabulka pořád posouvá do strany,
    ale jen uvnitř svého rámečku, ne celá stránka. Na tak úzké obrazovce by se 8
    sloupců nedalo rozumně číst.

  Změny jsou v src/pages/Databaze.tsx a src/styles.css, zatím jen lokálně. Mám
  je commitnout a pushnout? Push do main je hned nasadí na Vercel.

❯ ano                                                                           

  Pushed to main (ctrl+o to expand)

⏺ Ověřím, že se nový deploy na Vercelu dokončil a v produkci se tabulka vejde.

  Ran 1 shell command (ctrl+o to expand)

⏺ Úprava tabulky je commitnutá, pushnutá do main (commit 11c9b42) a Vercel ji už
  nasadil do produkce.

  Na https://databaze-investoru.vercel.app/databaze se při šířce okna 1280 px
  vejde všech 30 řádků celých na šířku a stránka se nikam neposouvá do strany.

  Mimo repozitář dál zůstává jen soubor s CI v .github/.

⏺ Background shell command didn't finish before the previous session ended

⏺ Auto mode lets Claude handle permission prompts automatically — Claude
  checks each tool call for risky actions and prompt injection before 
  executing. Actions Claude identifies as safe are executed, while 
  actions Claude identifies as risky are blocked and Claude may try a 
  different approach. Ideal for long-running tasks. Sessions are 
  slightly more expensive. Claude can make mistakes that allow harmful 
  commands to run, it's recommended to only use in isolated 
  environments. Shift+Tab to change mode.