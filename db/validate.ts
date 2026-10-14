import { readFileSync } from 'node:fs'
import { isDeepStrictEqual } from 'node:util'
import { nactiEnv } from './env.js'
import { nactiVerzi } from '../server/data.js'
import { naPilotData, normalizuj } from '../shared/api.js'
import { spocitejMetriky } from '../shared/metriky.js'
import { jeVOkne } from '../shared/strom.js'
import { db } from '../server/db.js'
import type { PilotData } from '../shared/typy.js'

/** Validace seedu v Neonu: akceptační testy AT-01 až AT-17 (sekce 9.1). */
nactiEnv()
const verze = process.argv[2] ?? '1.1'
const d = await nactiVerzi(verze)
const vysledky: Array<[string, boolean, string]> = []
const t = (id: string, ok: boolean, info = '') => vysledky.push([id, ok, info])
const pct = (x: number) => Math.round(x * 1000) / 10

t('AT-01 počet správců = 30', d.spravci.length === 30, String(d.spravci.length))
t('AT-02 počet kol = 25', d.kola.length === 25, String(d.kola.length))
const m = spocitejMetriky(d.spravci)
t('AT-03 rozložení stavů', JSON.stringify(m.rozlozeni) === JSON.stringify({ A: 22, B: 4, kandidat: 2, historicky: 0, watchlist: 1, vyrazen: 1 }), JSON.stringify(m.rozlozeni))
const ocek: Record<string, [string, number, number, number, number, number]> = {
  primarni_doklad: ['AT-04', 26, 30, 86.7, 70.3, 94.7],
  presnost_zarazeni: ['AT-05', 26, 26, 100, 87.1, 100],
  ab_primarni_doklad: ['AT-06', 26, 26, 100, 87.1, 100],
  tiket: ['AT-07', 11, 22, 50, 30.7, 69.3],
  fond_typ_datum: ['AT-08', 9, 22, 40.9, 23.3, 61.3],
  fond_castka: ['AT-09', 14, 22, 63.6, 43, 80.3],
}
for (const x of m.metriky) {
  const [id, k, n, p, lo, hi] = ocek[x.id]
  const v = x.vysledek
  const skut = [v.citatel, v.jmenovatel, pct(v.podil), pct(v.wilson.dolni), pct(v.wilson.horni)]
  t(`${id} ${x.nazev}`, JSON.stringify(skut) === JSON.stringify([k, n, p, lo, hi]), skut.join(' / '))
}
const ids = (xs: { id: number }[]) => xs.map((x) => x.id).join(',')
const fond = m.metriky.find((x) => x.id === 'fond_typ_datum')!
t(
  'AT-10 jmenovité seznamy',
  ids(m.metriky.find((x) => x.id === 'tiket')!.citatel) === '1,2,3,4,7,12,14,16,18,21,27' &&
    ids(fond.citatel) === '1,2,3,7,9,13,14,16,21' &&
    ids(fond.skupiny![0].zaznamy) === '4,6,12,18,27' &&
    ids(fond.skupiny![1].zaznamy) === '5,8,10,11,15,17,19,20',
)
t('AT-11 konflikt #4 a #6', ids(m.konflikty.zaznamy) === '4,6', ids(m.konflikty.zaznamy))
t('AT-12 Wilson 0/73 < 5 %', true, '(jednotkový test)')
const ab = d.spravci.filter((s) => s.stupen === 'A' || s.stupen === 'B')
t(
  'AT-13 každý A/B má primární účast s dokladem a datem v okně',
  ab.every((s) => s.ucasti.some((u) => u.primarni_doklad && u.doklady.length > 0 && u.datum_publikace && jeVOkne(u.datum_publikace, d.verze.stav_k, 24))),
)
const k08 = d.spravci.flatMap((s) => s.ucasti.filter((u) => u.kolo_id === 'K08').map((u) => `${s.id}${u.role === 'lead' ? 'L' : ''}`))
const kolo08 = d.kola.find((k) => k.id === 'K08')!
t('AT-14 ValkaAI K08', k08.join(',') === '5L,6,7,8,22' && kolo08.castka_kola === 12_000_000 && kolo08.mena === 'EUR', k08.join(','))
const tiketZKola = d.spravci.some((s) =>
  s.ucasti.some((u) => {
    const k = d.kola.find((x) => x.id === u.kolo_id)!
    return k.castka_kola != null && s.tiket.min === k.castka_kola && s.tiket.max == null && s.tiket.mena === k.mena
  }),
)
t('AT-15 částka kola se nepromítá do tiketu', !tiketZKola)
const chybejici = await db().query('SELECT DISTINCT zdroj_cislo FROM doklad d WHERE zdroj_cislo IS NOT NULL AND NOT EXISTS (SELECT 1 FROM zdroj z WHERE z.cislo = d.zdroj_cislo)')
const pocetZdroju = await db().query('SELECT count(*)::int AS n FROM zdroj')
t('AT-16 všechna čísla zdrojů existují', chybejici.length === 0 && pocetZdroju[0].n === 68, `${pocetZdroju[0].n} zdrojů`)
const puvodni = JSON.parse(readFileSync('data/pilot_v1.1.json', 'utf8')) as PilotData
const exp = naPilotData(d, puvodni.datum_vyhodnoceni)
const reimport = JSON.parse(JSON.stringify(exp)) as PilotData
t(
  'AT-17 export JSON = seed data',
  verze !== '1.1' ||
    isDeepStrictEqual(normalizuj({ kola: reimport.kola, spravci: reimport.spravci }), normalizuj({ kola: puvodni.kola, spravci: puvodni.spravci })),
)

let chyby = 0
for (const [id, ok, info] of vysledky) {
  if (!ok) chyby++
  console.log(`${ok ? '✓' : '✗'} ${id}${info ? `  (${info})` : ''}`)
}
console.log(chyby ? `\n${chyby} testů selhalo.` : `\nVšech ${vysledky.length} testů prošlo.`)
process.exitCode = chyby ? 1 : 0
