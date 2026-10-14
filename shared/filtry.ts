import { poleVKonfliktu } from './metriky.js'
import type { KoloData, SpravceData } from './typy.js'

/** Filtry FR-11 a fulltext FR-12 nad seznamem správců. */

export type Priznak = 'tiket' | 'fond_typ_datum' | 'fond_castka' | 'konflikt' | 'primarni_24m'

export const PRIZNAKY: Record<Priznak, string> = {
  tiket: 'Má deklarovaný tiket',
  fond_typ_datum: 'Má fond s typem a datem',
  fond_castka: 'Má částku fondu v jakékoli podobě',
  konflikt: 'Obsahuje konflikt',
  primarni_24m: 'Má primární doklad ≤24 měsíců',
}

export interface Filtr {
  stav?: string
  stupen?: string
  skupina?: string
  kategorie?: string
  q?: string
  priznak?: Priznak[]
}

/** Odstraní diakritiku a převede na malá písmena. */
export function normalizujText(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

type SpravceFiltr = Pick<
  SpravceData,
  | 'nazev'
  | 'dalsi_nazvy'
  | 'stav_aktivity'
  | 'stupen'
  | 'skupina_relevance'
  | 'kategorie'
  | 'tiket_deklarovany'
  | 'fond_s_typem_a_datem'
  | 'fond_castka_uvedena'
  | 'ma_primarni_doklad_24m'
  | 'fondy'
  | 'tiket'
  | 'ucasti'
  | 'udalosti'
>

export function splnujePriznak(s: SpravceFiltr, p: Priznak): boolean {
  switch (p) {
    case 'tiket':
      return s.tiket_deklarovany
    case 'fond_typ_datum':
      return s.fond_s_typem_a_datem === true
    case 'fond_castka':
      return s.fond_castka_uvedena === true
    case 'konflikt':
      return poleVKonfliktu(s).length > 0
    case 'primarni_24m':
      return s.ma_primarni_doklad_24m
  }
}

export function filtruj<T extends SpravceFiltr>(spravci: T[], kola: Pick<KoloData, 'id' | 'firma'>[], f: Filtr): T[] {
  const firma = new Map(kola.map((k) => [k.id, k.firma]))
  const q = f.q ? normalizujText(f.q.trim()) : ''
  return spravci.filter((s) => {
    if (f.stav && s.stav_aktivity !== f.stav) return false
    if (f.stupen && (f.stupen === 'null' ? s.stupen !== null : s.stupen !== f.stupen)) return false
    if (f.skupina && (f.skupina === 'null' ? s.skupina_relevance !== null : s.skupina_relevance !== f.skupina)) return false
    if (f.kategorie && s.kategorie !== f.kategorie) return false
    for (const p of f.priznak ?? []) if (!splnujePriznak(s, p)) return false
    if (q) {
      const texty = [
        s.nazev,
        ...s.dalsi_nazvy,
        ...s.ucasti.map((u) => firma.get(u.kolo_id) ?? ''),
        ...s.udalosti.map((u) => u.firma ?? ''),
      ]
      if (!texty.some((t) => normalizujText(t).includes(q))) return false
    }
    return true
  })
}
