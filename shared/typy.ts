// Typy dat pilotu (Příloha A) a odpovědí API.

export type Kategorie =
  | 'VC'
  | 'PE'
  | 'CVC'
  | 'FO'
  | 'andel'
  | 'velky_soukromy_investor'
  | 'fond_fondu'
  | 'holding_CVC'
  | 'nejasny'
  | 'neinvestor'

export type TypOsoby = 'PO' | 'FO'
export type SkupinaRelevance = '1' | '2a' | '2b'
export type StavAktivity = 'aktivni' | 'historicky' | 'kandidat' | 'watchlist' | 'vyrazen'
export type Stupen = 'A' | 'B' | 'C' | 'X'
export type StavHodnoty =
  | 'overeno'
  | 'nezverejneno'
  | 'nedohledano'
  | 'odhad'
  | 'konflikt'
  | 'jen_agregator'
  | 'mimo_rozsah'
  | 'neuvedeno'
export type StupenPole = 'overeno' | 'samodeklarovano' | 'odvozeno' | 'konflikt'
export type TypUdalosti = 'exit' | 'zavazek_LP' | 'jen_agregator' | 'jiny'
export type TypCastky =
  | 'cil'
  | 'first_close'
  | 'uzavreny_fond'
  | 'zavazky'
  | 'zavazky_typ_uzavreni_nedohledan'
  | 'ziskano'
  | 'alokovano'
  | 'podfond'
  | 'zavazek_LP'
  | 'AUM'
  | 'neuvedeno'
export type DruhCastky = 'tiket' | 'fond' | 'aum'
export type Role = 'lead' | 'koinvestor'
export type TypChyby = 'identita' | 'aktivita' | 'typ' | 'castka' | 'datum'

/** Rozhodnutí o záznamu (šablona kap. 7.4 bod 5). */
export type Rozhodnuti = 'A' | 'B' | 'kandidat' | 'historicky' | 'watchlist' | 'vyrazen'
export const ROZHODNUTI: Rozhodnuti[] = ['A', 'B', 'kandidat', 'historicky', 'watchlist', 'vyrazen']

export interface CastkaData {
  text: string | null
  min: number | null
  max: number | null
  mena: string | null
  typ_castky: TypCastky | null
  rozhodne_datum: string | null
  stav_hodnoty: StavHodnoty
  stupen_pole: StupenPole | null
  zdroje: number[]
  poznamka?: string | null
}

export interface FondData {
  nazev: string | null
  hodnoty: CastkaData[]
  poznamka?: string | null
}

export interface UcastData {
  kolo_id: string
  role: Role | null
  podil_stav: string
  primarni_doklad: boolean
  zdroj_text: string
  datum_publikace: string | null
  zdroje: number[]
  poznamka?: string | null
}

export interface UdalostData {
  typ_udalosti: TypUdalosti
  firma?: string | null
  castka?: number | null
  mena?: string | null
  datum_udalosti?: string | null
  datum_publikace?: string | null
  primarni_doklad: boolean
  zdroj_text: string | null
  zdroje: number[]
  poznamka?: string | null
}

export interface SpravceData {
  id: number
  nazev: string
  dalsi_nazvy: string[]
  kategorie: Kategorie
  typ_osoby: TypOsoby
  skupina_relevance: SkupinaRelevance | null
  subjekt_text: string
  skupina_text: string
  investice_text: string
  datum_zdroj_text: string
  fond_text: string
  tiket_text: string
  stav_text: string
  stav_aktivity: StavAktivity
  stupen: Stupen | null
  poznamka_stupne: string | null
  ucasti: UcastData[]
  udalosti: UdalostData[]
  fondy: FondData[]
  tiket: CastkaData
  opravy_7_2: string[]
  ma_primarni_doklad_24m: boolean
  je_skutecny_investor_predbezne: boolean | null
  tiket_deklarovany: boolean
  fond_s_typem_a_datem: boolean | null
  fond_castka_uvedena: boolean | null
  kontrolni_negativni_pripad: boolean
  zdroje_zaznamu?: number[]
  // Pole, která pilot zatím nevyplňuje (O-6), ale datový model je má.
  ico?: string | null
  lei?: string | null
  zeme?: string | null
  sektory?: string[]
  faze?: string[]
}

export interface KoloData {
  id: string
  firma: string
  zeme_firmy: string | null
  kolo: string | null
  castka_kola: number | null
  mena: string | null
  castka_text: string | null
  datum_publikace: string | null
  zdroje: number[]
  poznamka: string | null
}

export interface PilotData {
  verze: string
  stav_k: string
  datum_vyhodnoceni: string
  opravy_13_10_2026?: string
  kola: KoloData[]
  spravci: SpravceData[]
}

export interface Zdroj {
  cislo: number
  titulek: string
  url: string
}

/** Rozhodnutí záznamu ve verzi dat (A / B podle stupně, jinak podle stavu aktivity). */
export function rozhodnutiZaznamu(s: { stupen: Stupen | null; stav_aktivity: StavAktivity }): Rozhodnuti {
  if (s.stav_aktivity === 'aktivni' && (s.stupen === 'A' || s.stupen === 'B')) return s.stupen
  if (s.stav_aktivity === 'aktivni') return 'kandidat'
  return s.stav_aktivity
}

export function jeZarazen(r: Rozhodnuti): boolean {
  return r === 'A' || r === 'B'
}
