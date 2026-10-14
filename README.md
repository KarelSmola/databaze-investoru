# Databáze investorů – pilot ČR

Webová aplikace podle předávacího dokumentu v2.0: metodika (kapitoly 0–11), pilotní databáze 30 VC subjektů a 25 kol financování (data v1.1, stav k 11. 10. 2026), metriky s Wilsonovými intervaly, nezávislá kontrola naslepo, go/no-go, kalkulačka nákladů a zdroje 1–68. Design podle [clientelo.cz](https://www.clientelo.cz/) (teal + červený akcent, Lora a Lexend).

## Stack

- **Frontend:** SPA, React 19 + TypeScript (strict), Vite, React Router, `react-markdown` + `remark-gfm`
- **API:** Vercel Functions v TypeScriptu, jediná funkce `api/router.ts` (viz níže)
- **Databáze:** Neon (PostgreSQL 17, `aws-eu-central-1`), driver `@neondatabase/serverless`
- **Validace a testy:** Zod, Vitest, ESLint; CI v GitHub Actions

## Rychlý start

```bash
npm install
cp .env.example .env   # doplnit DATABASE_URL a DATABASE_URL_UNPOOLED z Neonu
npm run db:setup       # migrace + seed + validace AT-01 až AT-17
npm run dev            # http://localhost:5173 (API běží ve stejném dev serveru)
```

| Skript | Co dělá |
|---|---|
| `npm run dev` | Vite dev server; `/api/*` obsluhuje stejný router jako na Vercelu |
| `npm test` | Akceptační testy AT-01–16, AT-04–12, AT-30–42, AT-50–70 (bez DB) |
| `npm run db:migrate` | Aplikuje `db/migrations/*.sql` (evidence v tabulce `schema_migrace`) |
| `npm run db:seed` | Idempotentní seed verze 1.1 z `data/pilot_v1.1.json`; `-- cesta.json` pro reimport, `--force` smaže i hodnocení kontrolora |
| `npm run db:validate` | AT-01 až AT-17 proti Neonu (včetně exportu a porovnání se seed daty) |
| `npm run build` | typecheck + produkční build do `dist/` |

## Struktura

```
api/router.ts        Vercel Function – vstup pro celé API
server/              router, adaptér pro Node, načítání verze z Neonu, handlery (routes/)
shared/              čistá logika bez DB a UI: wilson, kappa, metriky, strom, kontrola, gonogo, kalkulacka/
src/                 React SPA (pages/ = moduly M1–M9 + verze dat)
content/             kapitoly 0–11, TL;DR, závěr, zadání (doslovně z dokumentu)
data/                pilot_v1.1.json (Příloha A), zdroje.json (Příloha C)
db/                  migrace, seed, validace
tests/               akceptační testy sekce 9
```

## Nasazení na Vercel

1. Repozitář na GitHub, projekt na Vercelu napojený na repozitář (framework Vite).
2. Integrace Vercel–Neon (nastaví `DATABASE_URL` a `DATABASE_URL_UNPOOLED`, preview větve), nebo proměnné zadat ručně.
3. `vercel.json` přepisuje `/api/*` na jedinou funkci `api/router` a ostatní cesty na `index.html` (SPA); region funkcí `fra1`.

## Odchylky a doplňky proti specifikaci

- **Jedna Vercel Function místo souboru na endpoint.** API má 26 cest; Hobby plán Vercelu má limit 12 funkcí. Cesty i metody odpovídají sekci 7, tabulka je v `server/router.ts`.
- **Migrace `0002`:** sloupec `verze_dat.zdrojova_verze` (původ verze pro `historie_zmen.verze_z`) a indexy. `0001_init.sql` je doslovně DDL ze sekce 6.3.
- **Pole `poznamka`** u účastí, fondů a částek z Přílohy A se ukládá do existujících sloupců `poznamka` (jinak by export nebyl shodný, AT-17).
- **Zápisy kontroly, go/no-go a kalkulačky** jsou povolené i nad zmrazenou verzí – nejde o data verze. 409 vrací zápis dat záznamu (`PATCH /api/spravci/:id`) do zmrazené verze.
- **Přihlášení a role (O-1) nejsou řešeny.** Kontrolor se identifikuje jen jménem; režim naslepo vynucuje API (`/api/kontrola/zaznamy` nevrací stupeň, stav, poznámky ke stupni, příznaky metrik ani text „kontrolní negativní případ“, dokud kontrolor záznam neohodnotí).
- **Úroveň zdroje (O-5)** doplňuje seed podle sekce 6.4 bod 5; nejasné zdroje zůstávají `null`. Skupina nezávislosti je zatím jen u tiskové zprávy Rockaway [16][17].
- **Sektory a fáze (O-6)** jsou prázdné; lze je doplnit v nezmrazené verzi (detail záznamu → Upravit).

## Další API cesty navíc

`PATCH /api/spravci/:id?verze=`, `GET /api/verze`, `PUT /api/verze/:id/zmrazit`, `GET /api/verze/:id/historie`, `GET /api/kontrola/kontrolori`, `GET /api/kontrola/export`, `GET|DELETE /api/kontrola/referencni-seznam`, `PUT /api/kontrola/referencni-seznam/:id`, `DELETE /api/go-nogo/:kriterium`, `DELETE /api/kalkulacka/varianty/:id`.
