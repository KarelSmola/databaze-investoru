# AGENTS.md – Databáze investorů (pilot ČR)

Návod pro AI agenty a vývojáře, kteří na projektu pracují. Uživatelský přehled a postup nasazení je v [README.md](README.md).

## O projektu

Webová aplikace k úloze „Spolehlivá databáze investorů“: metodika (kapitoly 0–11), pilotní databáze 30 VC subjektů a 25 kol financování (data v1.1, stav k 11. 10. 2026), metriky s Wilsonovými intervaly, nezávislá kontrola naslepo, kritéria go/no-go, kalkulačka nákladů a zdroje 1–68. UI je celé v češtině, design přebírá vzhled [clientelo.cz](https://www.clientelo.cz/).

**Zdroj pravdy je předávací dokument** `_zadani_llm_outputs/outputs/Claude/predavaci_dokument_databaze_investoru.md` (verze 2.0). Odkazy typu „FR-13“, „AT-17“ nebo „O-1“ v kódu odkazují na jeho sekce:

| Sekce dokumentu | Obsah |
|---|---|
| 5 | Moduly M1–M9, funkční (FR-xx) a nefunkční (NFR-xx) požadavky |
| 6 | Datový model, DDL, pravidla seedu |
| 7 | API |
| 8 | Business logika: rozhodovací strom, metriky, kalkulačka, go/no-go |
| 9 | Akceptační testy AT-01 až AT-70 |
| 10 | Otevřené otázky O-1 až O-6 |
| Příloha A, B, C | Seed data, kapitoly 1–11, zdroje 1–68 |

## Příkazy

```bash
npm run dev          # Vite na :5173; /api/* obsluhuje stejný router jako Vercel
npm test             # Vitest: akceptační testy bez databáze
npm run typecheck    # tsc --noEmit (strict)
npm run lint         # ESLint
npm run build        # typecheck + produkční build do dist/
npm run db:migrate   # aplikuje nové soubory z db/migrations
npm run db:seed      # idempotentní seed verze 1.1 (--force smaže i hodnocení kontrolora)
npm run db:validate  # AT-01 až AT-17 proti Neonu
npm run db:setup     # migrate + seed + validate
```

Před dokončením změny spusť `npm run typecheck && npm run lint && npm test`. Po změně seedu, migrací nebo `server/data.ts` spusť i `npm run db:validate`.

## Stack a architektura

- **Frontend:** React 19 + TypeScript (strict), Vite, React Router 7, `react-markdown` + `remark-gfm`.
- **API:** Vercel Functions v Node.js. **Jediná funkce** `api/router.ts`; `vercel.json` přepisuje `/api/<cesta>` na `/api/router?path=<cesta>`.
- **Databáze:** Neon (PostgreSQL 17, `aws-eu-central-1`), driver `@neondatabase/serverless` (HTTP `neon()`, transakce přes `sql.transaction([...])`; seed a migrace přes `Pool`).
- **Validace:** Zod u všech zapisujících endpointů. **Testy:** Vitest.

```
Prohlížeč (src/) ──fetch /api/*──▶ api/router.ts ─▶ server/node.ts ─▶ server/router.ts ─▶ server/routes/*.ts
                                                                                              │
                         shared/ (čistá logika, bez DB a UI) ◀────────────────────────────────┤
                                                                                              ▼
                                                                                         Neon (server/db.ts)
```

| Adresář | Obsah |
|---|---|
| `api/` | Jen `router.ts` – vstupní bod pro Vercel. Nepřidávej sem další soubory. |
| `server/` | `router.ts` (tabulka cest `CESTY`), `node.ts` (adaptér req/res), `http.ts`, `db.ts`, `data.ts` (`nactiVerzi()` načte celou verzi dat jednou transakcí), `csv.ts`, `routes/*.ts` (handlery) |
| `shared/` | Čistá logika sdílená frontendem i API: `typy.ts`, `api.ts` (typy odpovědí, `naPilotData()`), `wilson.ts`, `kappa.ts`, `metriky.ts`, `strom.ts`, `kontrola.ts`, `gonogo.ts`, `filtry.ts`, `format.ts`, `ciselniky.ts`, `kalkulacka/` |
| `src/` | SPA: `pages/` (moduly M1–M9 + Verze), `components/`, `api.ts` (`api()`, `useApi()`), `verze.tsx` (kontext vybrané verze dat), `obsah.ts` (načítá `content/`), `styles.css` |
| `content/` | Kapitoly 0–11, TL;DR, závěr, zadání – **doslovně** z předávacího dokumentu |
| `data/` | `pilot_v1.1.json` (Příloha A), `zdroje.json` (Příloha C) |
| `db/` | `migrations/*.sql`, `migrate.ts`, `seed.ts`, `validate.ts`, `env.ts` |
| `tests/` | Akceptační testy sekce 9 |
| `_zadani_llm_outputs/` | Zadání a výstupy LLM, ze kterých aplikace vychází (jen ke čtení) |

## Konvence kódu

- **Pojmenování česky** (bez diakritiky v identifikátorech): `spravce`, `kolo`, `ucast`, `nactiVerzi`, `vypocetAI`. Drž se toho i v nových souborech. Komentáře a texty UI česky s diakritikou.
- **Importy:** v `server/`, `shared/`, `api/`, `db/` a `tests/` piš relativní importy **s příponou `.js`** (`'../shared/metriky.js'`) – kód běží jako ESM na Vercelu. V `src/` se importuje bez přípony.
- **`shared/` nesmí záviset na DB ani na Reactu.** Výpočty patří sem, aby je šlo testovat a používat na obou stranách.
- **Formátování čísel a dat** jen přes `shared/format.ts` (`cislo`, `kc`, `procento`, `datum`, `castka`): mezera jako oddělovač tisíců, desetinná čárka, data `D. M. RRRR`, částečná data bez dne (NFR-01).
- **Popisky číselníků** jsou v `shared/ciselniky.ts`; v komponentách hodnoty číselníků nepřekládej ručně.
- Komentáře jsou krátké a vysvětlují „proč“; odkazuj na FR/AT/kapitolu, pokud kód plní konkrétní požadavek.

## Doménová pravidla, která nesmíš porušit

- **Doslovné texty.** Pole `*_text` (sloupce tabulky kap. 7.1) a soubory v `content/` se nikdy nepřepisují ani „neopravují“ (NFR-04, FR-20). Strukturovaná pole jsou z nich odvozená a ukládají se vedle nich.
- **Částka kola ≠ tiket.** `kolo.castka_kola` je velikost celého kola, uložená jednou na kole. Nikdy ji nezobrazuj jako tiket investora ani ji nesčítej přes investory (kap. 3.2, AT-14, AT-15).
- **Verze 1.1 je zmrazená.** Úpravy dat záznamů jdou jen do nezmrazené verze (`POST /api/verze`) a každá změna se zapíše do `historie_zmen`. Zápis do zmrazené verze vrací 409. Hodnocení kontrolora, ruční vstupy go/no-go a varianty kalkulačky nejsou data verze a ukládají se i u zmrazené verze.
- **Režim naslepo (FR-51).** `GET /api/kontrola/zaznamy` nesmí vrátit pole ze `SKRYTA_POLE_KONTROLY` (`shared/api.ts`) ani text prozrazující hodnocení (např. „kontrolní negativní případ“ v `subjekt_text`), dokud kontrolor záznam neohodnotí. Při přidání nového pole do `SpravceApi` zvaž, jestli nepatří mezi skrytá.
- **Metriky** (`shared/metriky.ts`) se počítají z příznaků v datech, metriky tiketu a fondu jen ze stupně A. Test v `tests/metriky.test.ts` hlídá, že příznaky odpovídají pravidlům kap. 7.3.
- **Kalkulačka:** výchozí parametry v `shared/kalkulacka/parametry.ts` musí přesně reprodukovat čísla dokumentu (AT-50 až AT-70). Model 9.4 přebírá N, QA, řízení, právo, infrastrukturu, rezervu a údržbu z modelu 9.3.
- **Rozhodovací strom** (`shared/strom.ts`): hraniční případy kap. 2.2 jsou v `HRANICNI_PRIPADY` a slouží jako testy AT-30 až AT-42 i jako tabulka v UI.
- Aplikace nestahuje data z webu a nepoužívá placené zdroje (NFR-03).

## Postupy

**Nový endpoint API:** napiš handler do `server/routes/<modul>.ts` (vstup validuj Zodem, chyby vyhazuj jako `HttpChyba`), přidej řádek do `CESTY` v `server/router.ts` a typ odpovědi do `shared/api.ts`. Nový soubor do `api/` nepřidávej – Hobby plán Vercelu má limit 12 funkcí.

**Změna schématu:** vytvoř nový soubor `db/migrations/000N_popis.sql` (idempotentní, `IF NOT EXISTS`). Existující migrace neupravuj – `0001_init.sql` je doslovné DDL ze sekce 6.3. Uprav `server/data.ts`, případně `db/seed.ts` a kopírování verze v `server/routes/verze.ts`, pak spusť `npm run db:migrate` a `npm run db:validate`.

**Nová stránka:** komponenta v `src/pages/`, lazy import a `<Route>` v `src/App.tsx`, položka v `MENU` v `src/components/Layout.tsx`. Data načítej přes `useApi()` s parametrem `verze` z `useVerze()`.

**Citace a odkazy na kapitoly:** v Markdownu je řeší `pripravMarkdown()` (`src/components/Markdown.tsx`), v doslovných textech z dat komponenta `TextSCitacemi` (`src/components/Text.tsx`). `[n]` vede na `/zdroje#zdroj-n`, „kap. 9.4.6“ na `/metodika/9#k-9-4-6`.

## Design

Barvy, písma a rozměry jsou jako CSS proměnné v `:root` v `src/styles.css` (paleta clientelo.cz: teal `--teal #00666c`, tmavá `--teal-dd #06322f`, červený akcent `--red #b23132`, text `--ink #13302e`). Nadpisy `Lora`, text `Lexend` (Google Fonts v `index.html`). Nové barvy nepřidávej mimo tyto proměnné. Používej existující třídy (`karta`, `tl tl-primarni`, `stitek st-*`, `tabulka-obal`, `eyebrow`, `mrizka mrizka-*`). Rozložení musí fungovat od šířky 375 px bez vodorovného posouvání stránky; široké tabulky obal do `.tabulka-obal`.

## Prostředí a tajné údaje

- `DATABASE_URL` (pooled, pro API) a `DATABASE_URL_UNPOOLED` (migrace, seed) jsou v lokálním `.env`, který je v `.gitignore`. Šablona je `.env.example`. Connection string nikdy necommituj, nevypisuj do výstupu ani nevkládej do kódu SPA.
- Neon projekt `databaze-investoru` (ID `old-sun-07993505`), výchozí větev `main` s daty v1.1. Větev `test-zapisy` byla vytvořena pro testy zápisů a obsahuje testovací hodnocení a verzi 1.2.
- Repozitář: https://github.com/KarelSmola/databaze-investoru (větev `main`).

## Pracovní pravidla pro AI agenty

- **Komunikace s uživatelem česky.** UI, komentáře i commit zprávy jsou v češtině.
- **Dev server:** pokud spuštění přes `.claude/launch.json` skončí chybou `EPERM: uv_cwd` (macOS omezuje přístup do `~/Documents`), spusť `npx vite --port 5173 --strictPort` na pozadí a v prohlížeči otevři `http://localhost:5173`.
- **Testy zápisů do databáze** (kontrola, go/no-go, nové verze) dělej proti větvi `test-zapisy` nebo nové testovací větvi Neonu, ne proti `main` – na `main` jsou data v1.1. Druhý dev server pro testovací větev spusť s `DATABASE_URL=<connection string větve> npx vite --port 5174`.
- **Destruktivní operace** (mazání větví, `DELETE` nad daty, `db:seed --force`) jen po výslovném souhlasu uživatele.
- **Ověření změn UI:** po úpravě stránky ji zkontroluj v prohlížeči na desktopu i v mobilní šířce (375 px) a ověř, že `document.documentElement.scrollWidth` nepřesahuje šířku okna.
- **Git:** commit a push jen na požádání. Soubory v `.github/workflows/` nejde pushnout, dokud uživatel nespustí `gh auth refresh -h github.com -s workflow`.

## Stav a otevřené body

- **Přihlášení a role (O-1)** nejsou implementované; kontrolor se identifikuje jen jménem. Nepřidávej autentizaci bez zadání.
- **CI:** `.github/workflows/ci.yml` je připravený lokálně, ale necommitnutý – token `gh` nemá oprávnění `workflow`.
- **Nasazení na Vercel** zatím neproběhlo.
- **O-5:** úroveň zdroje u části dokladů je `null` (doplní kontrolor). **O-6:** sektory a fáze jsou prázdné, doplní se v nezmrazené verzi.
