import { podil, type Podil } from './wilson.js'
import type { CastkaData, FondData, SpravceData, TypCastky } from './typy.js'

/** Vstup pro výpočet metrik – podmnožina SpravceData. */
export type SpravceMetrikaVstup = Pick<
  SpravceData,
  | 'id'
  | 'nazev'
  | 'stupen'
  | 'stav_aktivity'
  | 'ma_primarni_doklad_24m'
  | 'je_skutecny_investor_predbezne'
  | 'tiket_deklarovany'
  | 'fond_s_typem_a_datem'
  | 'fond_castka_uvedena'
  | 'fondy'
  | 'tiket'
>

export interface ZaznamRef {
  id: number
  nazev: string
}

export interface Metrika {
  id: string
  nazev: string
  popis: string
  vysledek: Podil
  /** Záznamy v čitateli. */
  citatel: ZaznamRef[]
  /** Záznamy ve jmenovateli, které kritérium nesplňují. */
  nesplnuje: ZaznamRef[]
  /** Doplňkové jmenovité skupiny (např. „částka uvedena, kritérium nesplňuje“). */
  skupiny?: { nazev: string; zaznamy: ZaznamRef[] }[]
}

export interface MetrikyPilotu {
  pocet: number
  rozlozeni: { A: number; B: number; kandidat: number; historicky: number; watchlist: number; vyrazen: number }
  metriky: Metrika[]
  konflikty: { zaznamy: ZaznamRef[]; pocetPoli: number }
}

const ref = (s: SpravceMetrikaVstup): ZaznamRef => ({ id: s.id, nazev: s.nazev })

function metrika(
  id: string,
  nazev: string,
  popis: string,
  jmenovatel: SpravceMetrikaVstup[],
  splnuje: (s: SpravceMetrikaVstup) => boolean,
): Metrika {
  const cit = jmenovatel.filter(splnuje)
  const nes = jmenovatel.filter((s) => !splnuje(s))
  return { id, nazev, popis, vysledek: podil(cit.length, jmenovatel.length), citatel: cit.map(ref), nesplnuje: nes.map(ref) }
}

export function jeZarazenAB(s: Pick<SpravceData, 'stupen' | 'stav_aktivity'>): boolean {
  return s.stav_aktivity === 'aktivni' && (s.stupen === 'A' || s.stupen === 'B')
}

/** Všechna pole ve stavu „konflikt“ (fondy a tiket). */
export function poleVKonfliktu(s: Pick<SpravceData, 'fondy' | 'tiket'>): CastkaData[] {
  const vse = [...s.fondy.flatMap((f) => f.hodnoty), s.tiket]
  return vse.filter((c) => c.stav_hodnoty === 'konflikt')
}

const maCastku = (c: CastkaData) => c.min != null || c.max != null

/** Typy částek, které metrika fondu uznává (cíl / first close / uzavřený fond / závazky / AUM a jejich varianty). */
const TYPY_FONDU: TypCastky[] = [
  'cil',
  'first_close',
  'uzavreny_fond',
  'zavazky',
  'zavazky_typ_uzavreni_nedohledan',
  'ziskano',
  'alokovano',
  'AUM',
]

/** Pravidlo kap. 7.3: částka má typ, rozhodné datum alespoň s rokem a není v konfliktu. */
export function fondSplnujeKriterium(fondy: FondData[]): boolean {
  if (fondy.some((f) => f.hodnoty.some((h) => h.stav_hodnoty === 'konflikt'))) return false
  return fondy.some((f) =>
    f.hodnoty.some(
      (h) =>
        h.stav_hodnoty === 'overeno' &&
        maCastku(h) &&
        h.typ_castky != null &&
        TYPY_FONDU.includes(h.typ_castky) &&
        h.rozhodne_datum != null &&
        /^\d{4}/.test(h.rozhodne_datum),
    ),
  )
}

/** Částka fondu v jakékoli podobě (i bez data nebo v konfliktu). */
export function fondCastkaUvedena(fondy: FondData[]): boolean {
  return fondy.some((f) =>
    f.hodnoty.some((h) => maCastku(h) && (h.stav_hodnoty === 'overeno' || h.stav_hodnoty === 'konflikt' || h.stav_hodnoty === 'odhad')),
  )
}

export function tiketDeklarovany(tiket: CastkaData): boolean {
  return maCastku(tiket) && (tiket.stav_hodnoty === 'overeno' || tiket.stav_hodnoty === 'odhad')
}

/**
 * Metriky kap. 7.3. `jeSkutecnyInvestor` umožňuje po kontrole nahradit předběžné
 * hodnocení autora rozhodnutím kontrolora.
 */
export function spocitejMetriky(
  spravci: SpravceMetrikaVstup[],
  jeSkutecnyInvestor: (s: SpravceMetrikaVstup) => boolean = (s) => s.je_skutecny_investor_predbezne === true,
): MetrikyPilotu {
  const ab = spravci.filter(jeZarazenAB)
  const a = spravci.filter((s) => jeZarazenAB(s) && s.stupen === 'A')

  const fondTypDatum = metrika(
    'fond_typ_datum',
    'Velikost fondu s typem částky a rozhodným datem (A)',
    'Částka má typ (cíl / first close / uzavřený fond / závazky / AUM), rozhodné datum alespoň s rokem nebo měsícem a není ve stavu „konflikt“.',
    a,
    (s) => s.fond_s_typem_a_datem === true,
  )
  const castkaNesplnuje = a.filter((s) => s.fond_s_typem_a_datem !== true && s.fond_castka_uvedena === true)
  const bezCastky = a.filter((s) => s.fond_castka_uvedena !== true)
  fondTypDatum.skupiny = [
    { nazev: 'Částka uvedena, ale kritérium nesplňuje', zaznamy: castkaNesplnuje.map(ref) },
    { nazev: 'Bez částky fondu', zaznamy: bezCastky.map(ref) },
  ]

  const metriky: Metrika[] = [
    metrika(
      'primarni_doklad',
      'Kandidáti s primárním datovaným dokladem ≤24 měsíců',
      'Podíl všech kandidátů pilotu, kteří mají primární datovaný doklad o investici do firmy z posledních 24 měsíců.',
      spravci,
      (s) => s.ma_primarni_doklad_24m,
    ),
    metrika(
      'presnost_zarazeni',
      'Přesnost zařazení (zařazení A+B, kteří jsou skutečnými investory)',
      'Před kontrolou předběžné hodnocení autora; po kontrole rozhodnutí kontrolora.',
      ab,
      jeSkutecnyInvestor,
    ),
    metrika(
      'ab_primarni_doklad',
      'Zařazení A+B s primárním datovaným dokladem (kritérium go/no-go)',
      'Všichni zařazení musí mít datovaný primární doklad o investici.',
      ab,
      (s) => s.ma_primarni_doklad_24m,
    ),
    metrika(
      'tiket',
      'Deklarovaný tiket (A)',
      'Záznamy stupně A s veřejně deklarovaným tiketem.',
      a,
      (s) => s.tiket_deklarovany,
    ),
    fondTypDatum,
    metrika(
      'fond_castka',
      'Částka fondu v jakékoli podobě (A, i bez data nebo v konfliktu)',
      'Záznamy stupně A, u nichž je uvedena jakákoli částka fondu.',
      a,
      (s) => s.fond_castka_uvedena === true,
    ),
  ]

  const vKonfliktu = spravci.filter((s) => poleVKonfliktu(s).length > 0)
  const rozlozeni = { A: 0, B: 0, kandidat: 0, historicky: 0, watchlist: 0, vyrazen: 0 }
  for (const s of spravci) {
    if (jeZarazenAB(s)) rozlozeni[s.stupen as 'A' | 'B']++
    else if (s.stav_aktivity === 'aktivni') rozlozeni.kandidat++
    else rozlozeni[s.stav_aktivity]++
  }

  return {
    pocet: spravci.length,
    rozlozeni,
    metriky,
    konflikty: {
      zaznamy: vKonfliktu.map(ref),
      pocetPoli: vKonfliktu.reduce((sum, s) => sum + poleVKonfliktu(s).length, 0),
    },
  }
}
