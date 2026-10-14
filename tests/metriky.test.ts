import { describe, expect, it } from 'vitest'
import { fondCastkaUvedena, fondSplnujeKriterium, spocitejMetriky, tiketDeklarovany } from '../shared/metriky.js'
import { wilson } from '../shared/wilson.js'
import { cohenKappa, median } from '../shared/kappa.js'
import { pct, pilot } from './pomocne.js'

const m = spocitejMetriky(pilot.spravci)
const dle = (id: string) => m.metriky.find((x) => x.id === id)!

function over(id: string, k: number, n: number, p: number, lo: number, hi: number) {
  const x = dle(id).vysledek
  expect([x.citatel, x.jmenovatel]).toEqual([k, n])
  expect(pct(x.podil)).toBe(p)
  expect(pct(x.wilson.dolni)).toBe(lo)
  expect(pct(x.wilson.horni)).toBe(hi)
}

describe('AT-04 až AT-12: metriky pilotu', () => {
  it('AT-04 primární doklad ≤24 měsíců', () => over('primarni_doklad', 26, 30, 86.7, 70.3, 94.7))
  it('AT-05 přesnost zařazení', () => over('presnost_zarazeni', 26, 26, 100, 87.1, 100))
  it('AT-06 A+B s primárním dokladem', () => over('ab_primarni_doklad', 26, 26, 100, 87.1, 100))
  it('AT-07 deklarovaný tiket (A)', () => over('tiket', 11, 22, 50, 30.7, 69.3))
  it('AT-08 fond s typem a datem (A)', () => over('fond_typ_datum', 9, 22, 40.9, 23.3, 61.3))
  it('AT-09 částka fondu v jakékoli podobě (A)', () => over('fond_castka', 14, 22, 63.6, 43, 80.3))

  it('AT-10 jmenovité seznamy', () => {
    const ids = (xs: { id: number }[]) => xs.map((x) => x.id)
    expect(ids(dle('tiket').citatel)).toEqual([1, 2, 3, 4, 7, 12, 14, 16, 18, 21, 27])
    expect(ids(dle('fond_typ_datum').citatel)).toEqual([1, 2, 3, 7, 9, 13, 14, 16, 21])
    const [nesplnuje, bez] = dle('fond_typ_datum').skupiny!
    expect(ids(nesplnuje.zaznamy)).toEqual([4, 6, 12, 18, 27])
    expect(ids(bez.zaznamy)).toEqual([5, 8, 10, 11, 15, 17, 19, 20])
  })

  it('AT-11 konflikt a rozložení stavů', () => {
    expect(m.konflikty.zaznamy.map((z) => z.id)).toEqual([4, 6])
    expect(m.rozlozeni).toEqual({ A: 22, B: 4, kandidat: 2, historicky: 0, watchlist: 1, vyrazen: 1 })
  })

  it('AT-12 Wilson pro 0/73: horní mez < 5,0 %', () => {
    expect(wilson(0, 73).horni).toBeLessThan(0.05)
    expect(wilson(0, 72).horni).toBeGreaterThan(0.05)
  })

  it('příznaky metrik odpovídají pravidlům kap. 7.3 (záznamy stupně A)', () => {
    for (const s of pilot.spravci.filter((x) => x.stupen === 'A')) {
      expect(fondSplnujeKriterium(s.fondy), `fond #${s.id}`).toBe(s.fond_s_typem_a_datem)
      expect(fondCastkaUvedena(s.fondy), `částka #${s.id}`).toBe(s.fond_castka_uvedena)
      expect(tiketDeklarovany(s.tiket), `tiket #${s.id}`).toBe(s.tiket_deklarovany)
    }
  })
})

describe('Cohenovo kappa a medián', () => {
  it('úplná shoda = 1', () => expect(cohenKappa([['A', 'A'], ['B', 'B'], ['A', 'A']])).toBe(1))
  it('známý příklad', () => {
    // 2×2: a=20, b=5, c=10, d=15 → po=0,7, pe=0,5 → κ=0,4
    const d: Array<[string, string]> = [
      ...Array(20).fill(['A', 'A']),
      ...Array(5).fill(['A', 'B']),
      ...Array(10).fill(['B', 'A']),
      ...Array(15).fill(['B', 'B']),
    ]
    expect(cohenKappa(d)).toBeCloseTo(0.4, 10)
  })
  it('medián', () => {
    expect(median([3, 1, 2])).toBe(2)
    expect(median([4, 1, 2, 3])).toBe(2.5)
    expect(median([])).toBeNull()
  })
})
