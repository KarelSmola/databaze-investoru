import type { GoNogoVstup } from './api.js'
import type { VysledkyKontroly } from './kontrola.js'
import type { MetrikyPilotu } from './metriky.js'
import { wilson } from './wilson.js'

/** Kritéria go/no-go (sekce 8.7; kap. 11 bod 2 a kap. 9.4.6). */

export type StavKriteria = 'splneno' | 'nesplneno' | 'ceka'

export interface KriteriumDef {
  id: string
  nazev: string
  prah: string
  zdroj: string
  kapitola: '11' | '9.4.6'
  /** Jak se zadává ruční vstup (G-6 až G-11). */
  vstup?: 'podil' | 'hodnota' | 'chybovost'
  jednotka?: string
}

export const KRITERIA: KriteriumDef[] = [
  { id: 'G-1', nazev: 'Spodní mez Wilsonova intervalu pro přesnost zařazení', prah: '≥85 %', zdroj: 'Nezávislá kontrola', kapitola: '11' },
  { id: 'G-2', nazev: 'Zařazení (A+B) s datovaným dokladem', prah: '100 %', zdroj: 'Pilotní databáze / kontrola', kapitola: '11' },
  { id: 'G-3', nazev: 'Správnost polí sektor a fáze', prah: '≥90 %', zdroj: 'Nezávislá kontrola', kapitola: '11' },
  { id: 'G-4', nazev: 'Cohenovo kappa', prah: '≥0,8', zdroj: 'Nezávislá kontrola', kapitola: '11' },
  { id: 'G-5', nazev: 'Medián času na záznam', prah: '≤45 min', zdroj: 'Nezávislá kontrola', kapitola: '11' },
  { id: 'G-6', nazev: 'Podíl automaticky přijatých (pilot automatizace)', prah: '≥70 %', zdroj: 'Ruční vstup', kapitola: '9.4.6', vstup: 'podil' },
  { id: 'G-7', nazev: 'Chybovost automaticky přijatých: horní mez Wilsona', prah: '≤5 %', zdroj: 'Ruční vstup (audit 100 %)', kapitola: '9.4.6', vstup: 'chybovost' },
  { id: 'G-8', nazev: 'Medián ruční práce (výjimky + audit)', prah: '≤0,2 h/záznam', zdroj: 'Ruční vstup', kapitola: '9.4.6', vstup: 'hodnota', jednotka: 'h/záznam' },
  { id: 'G-9', nazev: 'Naměřený náklad LLM', prah: '≤100 Kč/záznam', zdroj: 'Ruční vstup', kapitola: '9.4.6', vstup: 'hodnota', jednotka: 'Kč/záznam' },
  { id: 'G-10', nazev: 'Zlatý vzorek: shoda u vyřazených (X)', prah: '100 %', zdroj: 'Ruční vstup', kapitola: '9.4.6', vstup: 'podil' },
  { id: 'G-11', nazev: 'Zlatý vzorek: shoda polí sektor a fáze', prah: '≥90 %', zdroj: 'Ruční vstup', kapitola: '9.4.6', vstup: 'podil' },
]

export interface VyhodnoceniKriteria extends KriteriumDef {
  stav: StavKriteria
  predbezne: boolean
  /** Číselná hodnota v jednotkách kritéria (podíl 0–1, kappa, minuty, h, Kč). */
  hodnota: number | null
  /** Popis hodnoty pro zobrazení (např. „26/26“). */
  detail: string | null
  vstup_data?: GoNogoVstup | null
}

export interface VysledekGoNogo {
  kriteria: VyhodnoceniKriteria[]
  pilot: StavKriteria
  automatizace: StavKriteria | 'castecne'
  doporuceni: string
}

const prah = (h: number | null, f: (x: number) => boolean): StavKriteria => (h == null ? 'ceka' : f(h) ? 'splneno' : 'nesplneno')

/** Podíl z ručního vstupu: přednostně citatel/jmenovatel, jinak hodnota (0–1, případně v procentech). */
export function podilZeVstupu(v: GoNogoVstup | undefined | null): number | null {
  if (!v) return null
  if (v.citatel != null && v.jmenovatel) return v.citatel / v.jmenovatel
  if (v.hodnota == null) return null
  return v.hodnota > 1 ? v.hodnota / 100 : v.hodnota
}

export function vyhodnotGoNogo(
  metriky: MetrikyPilotu,
  kontrola: VysledkyKontroly | null,
  vstupy: GoNogoVstup[],
): VysledekGoNogo {
  const dokonceno = kontrola?.dokonceno === true
  const predbezne = !dokonceno
  const m = (id: string) => metriky.metriky.find((x) => x.id === id)!.vysledek
  const v = (id: string) => vstupy.find((x) => x.kriterium === id)
  const out: VyhodnoceniKriteria[] = []

  for (const def of KRITERIA) {
    let hodnota: number | null = null
    let detail: string | null = null
    let stav: StavKriteria
    let pred = false
    switch (def.id) {
      case 'G-1': {
        const p = dokonceno ? kontrola!.presnostZarazeni : m('presnost_zarazeni')
        hodnota = p.jmenovatel ? p.wilson.dolni : null
        detail = `${p.citatel}/${p.jmenovatel}`
        stav = prah(hodnota, (x) => x >= 0.85 - 1e-9)
        pred = predbezne
        break
      }
      case 'G-2': {
        const p = m('ab_primarni_doklad')
        hodnota = p.jmenovatel ? p.podil : null
        detail = `${p.citatel}/${p.jmenovatel}`
        stav = prah(hodnota, (x) => x >= 1 - 1e-9)
        pred = predbezne
        break
      }
      case 'G-3': {
        const p = kontrola?.sektorAFaze
        if (p && p.jmenovatel) {
          hodnota = p.podil
          detail = `${p.citatel}/${p.jmenovatel}`
        }
        stav = prah(hodnota, (x) => x >= 0.9 - 1e-9)
        pred = hodnota != null && predbezne
        break
      }
      case 'G-4':
        hodnota = kontrola && kontrola.hodnoceno ? kontrola.kappa : null
        detail = kontrola && kontrola.hodnoceno ? `${kontrola.hodnoceno} hodnocení` : null
        stav = prah(hodnota, (x) => x >= 0.8 - 1e-9)
        pred = hodnota != null && predbezne
        break
      case 'G-5':
        hodnota = kontrola?.medianCasu ?? null
        stav = prah(hodnota, (x) => x <= 45)
        pred = hodnota != null && predbezne
        break
      case 'G-7': {
        const x = v(def.id)
        if (x && x.citatel != null && x.jmenovatel) {
          hodnota = wilson(x.citatel, x.jmenovatel).horni
          detail = `${x.citatel} chyb / ${x.jmenovatel}`
        } else if (x?.hodnota != null) {
          hodnota = x.hodnota > 1 ? x.hodnota / 100 : x.hodnota
        }
        stav = prah(hodnota, (y) => y <= 0.05 + 1e-9)
        break
      }
      case 'G-8':
      case 'G-9': {
        const x = v(def.id)
        hodnota = x?.hodnota ?? null
        stav = prah(hodnota, (y) => y <= (def.id === 'G-8' ? 0.2 : 100) + 1e-9)
        break
      }
      default: {
        // G-6, G-10, G-11: podíly
        const x = v(def.id)
        hodnota = podilZeVstupu(x)
        if (x?.citatel != null && x.jmenovatel) detail = `${x.citatel}/${x.jmenovatel}`
        const meze = def.id === 'G-6' ? 0.7 : def.id === 'G-10' ? 1 : 0.9
        stav = prah(hodnota, (y) => y >= meze - 1e-9)
      }
    }
    out.push({ ...def, hodnota, detail, stav, predbezne: pred, vstup_data: def.vstup ? (v(def.id) ?? null) : undefined })
  }

  const souhrn = (ks: VyhodnoceniKriteria[]): StavKriteria =>
    ks.some((k) => k.stav === 'nesplneno') ? 'nesplneno' : ks.every((k) => k.stav === 'splneno') ? 'splneno' : 'ceka'

  const pilot = souhrn(out.filter((k) => k.kapitola === '11'))
  const auto = out.filter((k) => k.kapitola === '9.4.6')
  let automatizace: VysledekGoNogo['automatizace'] = souhrn(auto)
  if (automatizace === 'nesplneno' && auto.some((k) => k.stav === 'splneno')) automatizace = 'castecne'

  let doporuceni: string
  if (automatizace === 'splneno') doporuceni = 'Všechna kritéria pilotu automatizace splněna → globální rozšíření podle modelu s AI triáží (kap. 9.4).'
  else if (automatizace === 'castecne')
    doporuceni = 'Kritéria splněna jen částečně → zpřísnit práh triáže a počítat s citlivostí z kap. 9.4.5 (≈ 19,9 mil. Kč).'
  else if (automatizace === 'nesplneno')
    doporuceni = 'Automatizace selhala → model bez triáže (kap. 9.3, 21,1 mil. Kč), případně jeho citlivost (≈ 30,7 mil. Kč).'
  else doporuceni = 'Čeká se na výsledky pilotu automatizace (kap. 9.4.6). Rozhodnutí podle kap. 11 bod 4.'

  return { kriteria: out, pilot, automatizace, doporuceni }
}
