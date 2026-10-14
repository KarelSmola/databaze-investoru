import type {
  CastkaData,
  KoloData,
  PilotData,
  Rozhodnuti,
  SpravceData,
  TypChyby,
  UcastData,
  UdalostData,
  Zdroj,
} from './typy.js'

/** Typy odpovědí API (sekce 7). */

export interface Doklad {
  id: number
  zdroj_cislo: number | null
  zdroj_text: string | null
  url: string | null
  uroven_zdroje: number | null
  datum_udalosti: string | null
  datum_publikace: string | null
  datum_kontroly: string | null
  nezavislost_skupina: string | null
}

export interface VerzeInfo {
  id: string
  stav_k: string
  zmrazeno: boolean
  popis: string | null
  zdrojova_verze: string | null
  vytvoreno: string
}

export interface UcastApi extends UcastData {
  id: number
  podil_castka: number | null
  poznamka: string | null
  doklady: Doklad[]
}

export interface UdalostApi extends UdalostData {
  id: number
  poznamka: string | null
  doklady: Doklad[]
}

export interface CastkaApi extends CastkaData {
  id: number
  poznamka: string | null
  doklady: Doklad[]
}

export interface FondApi {
  id: number
  nazev: string | null
  poznamka: string | null
  hodnoty: CastkaApi[]
}

export interface SpravceApi extends Omit<SpravceData, 'ucasti' | 'udalosti' | 'fondy' | 'tiket'> {
  ucasti: UcastApi[]
  udalosti: UdalostApi[]
  fondy: FondApi[]
  tiket: CastkaApi
  ico: string | null
  lei: string | null
  zeme: string | null
  sektory: string[]
  faze: string[]
  datum_kontroly: string | null
  namitka_gdpr: boolean | null
  doklady_zaznamu: Doklad[]
}

export interface KoloApi extends KoloData {
  ico_firmy: string | null
  datum_udalosti: string | null
  doklady: Doklad[]
}

export interface Dataset {
  verze: VerzeInfo
  kola: KoloApi[]
  spravci: SpravceApi[]
}

export interface SeznamSpravcuOdpoved {
  verze: VerzeInfo
  celkem: number
  spravci: SpravceApi[]
  kola: KoloApi[]
}

export interface DetailSpravceOdpoved {
  verze: VerzeInfo
  spravce: SpravceApi
  kola: KoloApi[]
  /** Ostatní účastníci kol, ve kterých správce figuruje. */
  spoluinvestori: Record<string, { id: number; nazev: string; role: string | null }[]>
}

export interface DetailKolaOdpoved {
  verze: VerzeInfo
  kolo: KoloApi
  ucastnici: { spravce: { id: number; nazev: string; stupen: string | null; stav_aktivity: string }; ucast: UcastApi }[]
}

export interface ZdrojApi extends Zdroj {
  spravci: { id: number; nazev: string }[]
  kola: { id: string; firma: string }[]
}

/** Pole, která kontrolor v režimu naslepo nevidí (FR-51). */
export const SKRYTA_POLE_KONTROLY = [
  'stupen',
  'stav_aktivity',
  'stav_text',
  'poznamka_stupne',
  'opravy_7_2',
  'ma_primarni_doklad_24m',
  'je_skutecny_investor_predbezne',
  'tiket_deklarovany',
  'fond_s_typem_a_datem',
  'fond_castka_uvedena',
  'kontrolni_negativni_pripad',
] as const

export interface Hodnoceni {
  id: number
  verze_id: string
  spravce_id: number
  kontrolor: string
  rozhodnuti_kontrolora: Rozhodnuti
  shoda: boolean | null
  chybne_pole: string | null
  typ_chyby: TypChyby | null
  cas_min: number | null
  pole_spravne: Partial<Record<PoleKontroly, boolean>> | null
  poznamka: string | null
  ulozeno: string
}

export type PoleKontroly = 'sektor' | 'faze' | 'tiket' | 'fond'
export const POLE_KONTROLY: PoleKontroly[] = ['sektor', 'faze', 'tiket', 'fond']

export type ZaznamKontrolora = Partial<SpravceApi> &
  Pick<SpravceApi, 'id' | 'nazev' | 'ucasti' | 'udalosti' | 'fondy' | 'tiket'> & {
    odkryto: boolean
    rozhodnuti_v: Rozhodnuti | null
    hodnoceni: Hodnoceni | null
  }

export interface ReferencniPolozka {
  id: number
  nazev_investora: string
  zdroj: string
  datum: string | null
  spravce_id: number | null
}

export interface GoNogoVstup {
  kriterium: string
  hodnota: number | null
  citatel: number | null
  jmenovatel: number | null
  poznamka: string | null
  zadano: string
}

export interface KalkulackaVarianta {
  id: number
  nazev: string
  parametry: unknown
  vytvoreno: string
}

export interface ZmenaHistorie {
  id: number
  verze_z: string
  verze_do: string
  entita: string
  entita_id: string
  pole: string
  stara_hodnota: string | null
  nova_hodnota: string | null
  duvod: string
  autor: string
  zmeneno: string
}

/** Převod datasetu z API na formát Přílohy A (export JSON, reimport seedem). */
export function naPilotData(d: Dataset, datumVyhodnoceni?: string): PilotData {
  const castka = (c: CastkaApi): CastkaData => ({
    text: c.text,
    min: c.min,
    max: c.max,
    mena: c.mena,
    typ_castky: c.typ_castky,
    rozhodne_datum: c.rozhodne_datum,
    stav_hodnoty: c.stav_hodnoty,
    stupen_pole: c.stupen_pole,
    zdroje: c.zdroje,
    poznamka: c.poznamka,
  })
  return {
    verze: d.verze.id,
    stav_k: d.verze.stav_k,
    datum_vyhodnoceni: datumVyhodnoceni ?? d.verze.stav_k,
    kola: d.kola.map((k) => ({
      id: k.id,
      firma: k.firma,
      zeme_firmy: k.zeme_firmy,
      kolo: k.kolo,
      castka_kola: k.castka_kola,
      mena: k.mena,
      castka_text: k.castka_text,
      datum_publikace: k.datum_publikace,
      zdroje: k.zdroje,
      poznamka: k.poznamka,
    })),
    spravci: d.spravci.map((s) => {
      const out: SpravceData = {
        id: s.id,
        nazev: s.nazev,
        dalsi_nazvy: s.dalsi_nazvy,
        kategorie: s.kategorie,
        typ_osoby: s.typ_osoby,
        skupina_relevance: s.skupina_relevance,
        subjekt_text: s.subjekt_text,
        skupina_text: s.skupina_text,
        investice_text: s.investice_text,
        datum_zdroj_text: s.datum_zdroj_text,
        fond_text: s.fond_text,
        tiket_text: s.tiket_text,
        stav_text: s.stav_text,
        stav_aktivity: s.stav_aktivity,
        stupen: s.stupen,
        poznamka_stupne: s.poznamka_stupne,
        ucasti: s.ucasti.map((u) => ({
          kolo_id: u.kolo_id,
          role: u.role,
          podil_stav: u.podil_stav,
          primarni_doklad: u.primarni_doklad,
          zdroj_text: u.zdroj_text,
          datum_publikace: u.datum_publikace,
          zdroje: u.zdroje,
          poznamka: u.poznamka,
        })),
        udalosti: s.udalosti.map((u) => ({
          typ_udalosti: u.typ_udalosti,
          firma: u.firma,
          castka: u.castka,
          mena: u.mena,
          datum_udalosti: u.datum_udalosti,
          datum_publikace: u.datum_publikace,
          primarni_doklad: u.primarni_doklad,
          zdroj_text: u.zdroj_text,
          zdroje: u.zdroje,
          poznamka: u.poznamka,
        })),
        fondy: s.fondy.map((f) => ({ nazev: f.nazev, hodnoty: f.hodnoty.map(castka), poznamka: f.poznamka })),
        tiket: castka(s.tiket),
        opravy_7_2: s.opravy_7_2,
        ma_primarni_doklad_24m: s.ma_primarni_doklad_24m,
        je_skutecny_investor_predbezne: s.je_skutecny_investor_predbezne,
        tiket_deklarovany: s.tiket_deklarovany,
        fond_s_typem_a_datem: s.fond_s_typem_a_datem,
        fond_castka_uvedena: s.fond_castka_uvedena,
        kontrolni_negativni_pripad: s.kontrolni_negativni_pripad,
        ico: s.ico,
        lei: s.lei,
        zeme: s.zeme,
        sektory: s.sektory,
        faze: s.faze,
      }
      if (s.doklady_zaznamu.length) out.zdroje_zaznamu = s.doklady_zaznamu.map((d) => d.zdroj_cislo!).filter((x) => x != null)
      return out
    }),
  }
}

/** Normalizace pro porovnání (AT-17): odstraní klíče s null, undefined nebo prázdným polem. */
export function normalizuj(x: unknown): unknown {
  if (Array.isArray(x)) return x.map(normalizuj)
  if (x && typeof x === 'object') {
    const o: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(x)) {
      if (v == null || (Array.isArray(v) && v.length === 0)) continue
      o[k] = normalizuj(v)
    }
    return o
  }
  return x
}
