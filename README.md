# Databáze investorů – pilot ČR

Webová aplikace podle předávacího dokumentu v2.0 ([`_zadani_llm_outputs/outputs/Claude/predavaci_dokument_databaze_investoru.md`](_zadani_llm_outputs/outputs/Claude/predavaci_dokument_databaze_investoru.md)). Obsahuje:

- metodiku (kapitoly 0–11),
- pilotní databázi 30 VC subjektů a 25 kol financování (data v1.1, stav k 11. 10. 2026),
- metriky s Wilsonovými intervaly,
- nezávislou kontrolu naslepo,
- kritéria go/no-go,
- kalkulačku nákladů,
- zdroje 1–68.

Design podle [clientelo.cz](https://www.clientelo.cz/) (teal + červený akcent, písma Lora a Lexend). Jak projekt vznikal, popisuje [`_shrnuti_jak_projekt_vznikal/`](_shrnuti_jak_projekt_vznikal/Shrnuti_jak_projekt_vznikal.md).

- **Produkce:** https://databaze-investoru.vercel.app
- **Repozitář:** https://github.com/KarelSmola/databaze-investoru (veřejný)
- **Pokyny pro AI agenty a vývojáře:** [AGENTS.md](AGENTS.md) (CLAUDE.md na něj jen odkazuje)

## Stack

- **Frontend:** SPA, React 19 + TypeScript (strict), Vite, React Router 7, `react-markdown` + `remark-gfm`
- **API:** Vercel Functions (Node.js) v TypeScriptu, jediná funkce `api/router.ts`
- **Databáze:** Neon (PostgreSQL 17, `aws-eu-central-1`), driver `@neondatabase/serverless`
- **Validace a testy:** Zod, Vitest, ESLint
- **Node.js:** ≥ 22

## Rychlý start

```bash
npm install
cp .env.example .env   # doplnit heslo do DATABASE_URL a DATABASE_URL_UNPOOLED
npm run db:setup       # migrace + seed + validace AT-01 až AT-17
npm run dev            # http://localhost:5173 (API běží ve stejném dev serveru)
```

Do prázdné databáze je potřeba spustit `npm run db:setup`. Nad existující databází, kde už data jsou, stačí `npm run dev`.

### Proměnné prostředí

| Proměnná | K čemu | Kde |
|---|---|---|
| `DATABASE_URL` | Pooled připojení k Neonu pro API | `.env` lokálně, Environment Variables na Vercelu |
| `DATABASE_URL_UNPOOLED` | Přímé připojení pro migrace a seed | `.env` lokálně, Vercel |
| `APP_URL` | Adresa produkce, jen informativně (kód ji nečte) | `.env.example` |

`.env` je v `.gitignore`. Heslo role `neondb_owner` je v Neon Console → projekt `databaze-investoru` (ID `old-sun-07993505`) → Connect. Repozitář je veřejný, takže heslo nepatří do žádného commitovaného souboru.

### Skripty

| Skript | Co dělá |
|---|---|
| `npm run dev` | Vite dev server; `/api/*` obsluhuje stejný router jako na Vercelu (plugin `lokalniApi` ve `vite.config.ts`) |
| `npm test` | Vitest bez databáze (61 testů, viz níže) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run build` | typecheck + produkční build do `dist/` |
| `npm run preview` | náhled buildu; **API v něm neběží** (jen frontend) |
| `npm run db:migrate` | aplikuje nové soubory z `db/migrations/` (evidence v tabulce `schema_migrace`) |
| `npm run db:seed` | idempotentní seed verze 1.1 z `data/pilot_v1.1.json`; `npm run db:seed -- cesta.json` pro reimport exportu; odmítne pokračovat, pokud verze má hodnocení kontrolora, pokud není zadán `--force` (ten je smaže) |
| `npm run db:validate` | AT-01 až AT-17 proti Neonu (včetně porovnání exportu se seed daty) |
| `npm run db:setup` | `db:migrate` + `db:seed` + `db:validate` |

### Testy

| Soubor | Akceptační testy (sekce 9 dokumentu) |
|---|---|
| `tests/data.test.ts` | AT-01–03, AT-11, AT-13–16 nad `data/pilot_v1.1.json` |
| `tests/metriky.test.ts` | AT-04–12, shoda příznaků s pravidly kap. 7.3, Cohenovo kappa, medián |
| `tests/strom.test.ts` | AT-30–42 (hraniční případy kap. 2.2), okno aktivity |
| `tests/kalkulacka.test.ts` | AT-50–70 (výchozí parametry reprodukují čísla dokumentu) |
| `db/validate.ts` | AT-01–17 nad daty v Neonu; AT-17 (export a reimport) jen zde |

## Moduly aplikace

| Cesta | Modul |
|---|---|
| `/` | M1 Přehled: název, závěr, TL;DR, klíčové metriky, stav pilotu |
| `/databaze`, `/databaze/:id`, `/kola/:id` | M2 Pilotní databáze: tabulka kap. 7.1, filtry, fulltext, detail správce a kola, export |
| `/metodika`, `/metodika/:cislo` | M3 Metodika: kapitoly 0–11 s citacemi a interními odkazy |
| `/strom` | M4 Rozhodovací strom: průvodce a hraniční případy |
| `/metriky` | M5 Metriky pilotu |
| `/kontrola` | M6 Nezávislá kontrola: hodnocení naslepo, výsledky, referenční seznam pro záchyt |
| `/go-nogo` | M7 Kritéria G-1 až G-11 |
| `/kalkulacka` | M8 Kalkulačka nákladů (kap. 8, 9.3, 9.4, citlivosti, uložené varianty) |
| `/zdroje` | M9 Zdroje 1–68 se zpětnými odkazy |
| `/verze` | Verze dat, nová verze z existující, historie změn |

## API

Všechny cesty mají prefix `/api/`. Parametr `verze` je volitelný, výchozí `1.1`. Tučně jsou cesty navíc proti sekci 7 dokumentu.

| Metoda a cesta | Účel |
|---|---|
| `GET spravci?verze=&stav=&stupen=&skupina=&kategorie=&q=&priznak=` | seznam správců s filtry a fulltextem (+ všechna kola) |
| `GET spravci/:id` | detail správce včetně účastí, dokladů a spoluinvestorů |
| **`PATCH spravci/:id?verze=`** | úprava záznamu v nezmrazené verzi, zápis do `historie_zmen` |
| `GET kola/:id` | kolo se všemi účastníky a doklady |
| `GET zdroje` | zdroje se zpětnými odkazy na správce a kola |
| `GET metriky` | metriky kap. 7.3; po dokončené kontrole i přepočet podle kontrolora |
| `GET kontrola/zaznamy?kontrolor=` | záznamy pro kontrolora v režimu naslepo |
| `POST kontrola/hodnoceni` | uložení (přepsání) hodnocení, dopočítá shodu |
| **`GET kontrola/kontrolori`** | kontroloři a počty hodnocení |
| `GET kontrola/vysledky?kontrolor=` | metriky kap. 7.4 bod 4 |
| **`GET kontrola/export?kontrolor=`** | výsledky kontroly jako CSV |
| **`GET kontrola/referencni-seznam`** | referenční seznam pro záchyt |
| `POST kontrola/referencni-seznam` | import CSV s automatickým návrhem mapování |
| **`PUT kontrola/referencni-seznam/:id`** | ruční mapování na správce |
| **`DELETE kontrola/referencni-seznam`** | vymazání seznamu |
| `GET go-nogo` | kritéria G-1 až G-11 a doporučení |
| `PUT go-nogo/:kriterium` | ruční vstup G-6 až G-11 |
| **`DELETE go-nogo/:kriterium`** | smazání ručního vstupu |
| `GET` / `POST kalkulacka/varianty` | uložené varianty parametrů kalkulačky |
| **`DELETE kalkulacka/varianty/:id`** | smazání varianty |
| `GET export?format=csv\|json` (+ filtry jako u `spravci`) | export celého datasetu nebo výběru |
| **`GET verze`** | seznam verzí dat |
| `POST verze` | nová verze jako kopie existující (`zmrazeno = false`) |
| **`PUT verze/:id/zmrazit`** | zmrazení verze |
| **`GET verze/:id/historie`** | historie změn verze |

Chyby vrací JSON `{ "chyba": "…" }`: 400 neplatný vstup, 404 neexistující záznam nebo cesta, 405 nepovolená metoda, 409 zápis do zmrazené verze nebo duplicitní verze.

## Struktura

```
api/router.ts                 Vercel Function – vstupní bod celého API
server/                       router (tabulka cest), adaptér pro Node, načítání verze z Neonu, handlery (routes/)
shared/                       čistá logika bez DB a UI: wilson, kappa, metriky, strom, kontrola, gonogo, filtry, format, kalkulacka/
src/                          React SPA (pages/ = moduly M1–M9 + verze dat, components/)
content/                      kapitoly 0–11, TL;DR, závěr, zadání (doslovně z dokumentu)
data/                         pilot_v1.1.json (Příloha A), zdroje.json (Příloha C)
db/                           migrace, seed, validace, načtení .env pro skripty
tests/                        akceptační testy sekce 9
public/                       favicon
_zadani_llm_outputs/          zadání, výstupy ChatGPT a Clauda, předávací dokument
_shrnuti_jak_projekt_vznikal/ shrnutí postupu od zadání po aplikaci
vercel.json                   přepis /api/* na api/router, SPA fallback, region fra1
vite.config.ts                Vite + plugin lokalniApi pro /api v dev serveru
.claude/launch.json           konfigurace dev serveru pro Claude Code
```

## Nasazení na Vercel

Projekt je na Vercelu napojený na GitHub; každý push do `main` spustí produkční deploy.

1. Na Vercelu musí být nastavené `DATABASE_URL` a `DATABASE_URL_UNPOOLED` (ručně, nebo přes integraci Vercel–Neon). Bez nich API vrací 500 „Chybí proměnná prostředí DATABASE_URL.“
2. `vercel.json` přepisuje `/api/<cesta>` na `/api/router?path=<cesta>` a ostatní cesty na `index.html` (přímé odkazy na podstránky SPA). Funkce běží ve `fra1`, stejně jako databáze.
3. Migrace a seed se na Vercelu nespouštějí; schéma a data se zakládají lokálně přes `npm run db:setup` proti produkční databázi.

## Odchylky a doplňky proti specifikaci

- **Jedna Vercel Function místo souboru na endpoint.** API má 26 cest a Hobby plán Vercelu má limit 12 funkcí. Cesty i metody ze sekce 7 zůstávají, tabulka je v `server/router.ts`.
- **Migrace `0002`:** sloupec `verze_dat.zdrojova_verze` (původ verze pro `historie_zmen.verze_z`) a indexy. `0001_init.sql` je doslovně DDL ze sekce 6.3.
- **Pole `poznamka`** u účastí, fondů a částek z Přílohy A se ukládá do existujících sloupců `poznamka`, aby export byl shodný se seedem (AT-17).
- **Export JSON** má formát Přílohy A (`kola`, `spravci`) a jde znovu načíst seedem. CSV používá středník a BOM kvůli Excelu.
- **Zápisy kontroly, go/no-go a kalkulačky** jsou povolené i nad zmrazenou verzí, protože nejde o data verze. Kód 409 vrací zápis dat záznamu (`PATCH /api/spravci/:id`) do zmrazené verze.
- **Výsledky kontroly v metrikách a go/no-go** se berou od kontrolora s nejvíce hodnoceními. Po dokončení kontroly všech záznamů se přesnost zařazení přepočítá podle jeho rozhodnutí a G-1, G-2 přestanou být „předběžné“.
- **Přihlášení a role (O-1) nejsou řešeny.** Kontrolor se identifikuje jen jménem (uloženým v prohlížeči). Režim naslepo vynucuje API: `/api/kontrola/zaznamy` nevrací stupeň, stav, poznámky ke stupni, příznaky metrik ani text „kontrolní negativní případ“, dokud kontrolor záznam neohodnotí.
- **Úroveň zdroje (O-5)** doplňuje seed podle sekce 6.4 bod 5; nejasné zdroje zůstávají `null`. Skupina nezávislosti je zatím jen u tiskové zprávy Rockaway [16][17].
- **Sektory a fáze (O-6)** jsou prázdné; lze je doplnit v nezmrazené verzi (detail záznamu → Upravit záznam).

## Stav

- Produkce běží, data jsou ve verzi 1.1 (zmrazená), nezávislá kontrola zatím neproběhla – metriky jsou předběžné.
- CI (GitHub Actions) zatím není v repozitáři: workflow čeká, až token `gh` dostane oprávnění `workflow`. Do té doby se kontroly spouštějí ručně (`npm run typecheck && npm run lint && npm test`).
