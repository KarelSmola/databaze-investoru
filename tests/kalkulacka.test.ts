import { describe, expect, it } from 'vitest'
import { VYCHOZI_PARAMETRY as P } from '../shared/kalkulacka/parametry.js'
import { CITLIVOSTI, srovnani, vypocetAI, vypocetBezAI, vypocetCR, vypocetPilot } from '../shared/kalkulacka/vypocet.js'

const r = (x: number) => Math.round(x)
const r2 = (x: number) => Math.round(x / 10_000) / 100 // mil. Kč na 2 desetinná místa
const cit = (id: string) => CITLIVOSTI.find((c) => c.id === id)!.uprav(P)

describe('AT-50 až AT-52: pilot a ČR', () => {
  it('AT-50 pilot celkem 57 600 Kč', () => expect(vypocetPilot(P).celkem).toBe(57_600))
  it('AT-51 ČR 374 400 Kč (312 000 bez rezervy)', () => {
    const c = vypocetCR(P)
    expect(c.hodiny).toBe(390)
    expect(r(c.mezisoucet)).toBe(312_000)
    expect(r(c.celkem)).toBe(374_400)
    expect(r(c.eur)).toBe(14_976)
  })
  it('AT-52 ČR údržba 112 320–149 760 Kč', () => {
    const c = vypocetCR(P)
    expect([r(c.udrzba_min), r(c.udrzba_max)]).toEqual([112_320, 149_760])
  })
})

describe('AT-53 až AT-61: model bez AI triáže (9.3)', () => {
  const m = vypocetBezAI(P, 'minimalni')
  const re = vypocetBezAI(P, 'realisticky')
  const p = vypocetBezAI(P, 'plny')
  it('AT-53 ruční ověření', () => expect([m.rucni_h, re.rucni_h, p.rucni_h].map(r)).toEqual([5250, 12000, 30000]))
  it('AT-54 lokalizace', () => expect([m.lok_h, re.lok_h, p.lok_h].map(r)).toEqual([0, 1350, 3600]))
  it('AT-55 QA', () => expect([m.qa_h, re.qa_h, p.qa_h].map(r)).toEqual([375, 750, 3000]))
  it('AT-56 analytické hodiny / Kč', () => {
    expect([m.analyt_h, re.analyt_h, p.analyt_h].map(r)).toEqual([5625, 14100, 36600])
    expect([m.analyt_kc, re.analyt_kc, p.analyt_kc].map(r)).toEqual([4_500_000, 11_280_000, 29_280_000])
  })
  it('AT-57 mezisoučet', () => expect([m.mezisoucet, re.mezisoucet, p.mezisoucet].map(r)).toEqual([7_920_000, 18_320_000, 42_480_000]))
  it('AT-58 rezerva', () => expect([m.rezerva, re.rezerva, p.rezerva].map(r)).toEqual([1_188_000, 2_748_000, 6_372_000]))
  it('AT-59 celkem Kč / EUR', () => {
    expect([m.celkem, re.celkem, p.celkem].map(r)).toEqual([9_108_000, 21_068_000, 48_852_000])
    expect([m.eur, re.eur, p.eur].map(r)).toEqual([364_320, 842_720, 1_954_080])
  })
  it('AT-60 údržba', () => {
    expect([m, re, p].map((x) => [r2(x.udrzba_min), r2(x.udrzba_max)])).toEqual([
      [2.28, 3.19],
      [5.27, 7.37],
      [12.21, 17.1],
    ])
  })
  it('AT-61 citlivost 0,75 h ≈ 30,7 mil. Kč (+9,66 mil.)', () => {
    const c = vypocetBezAI(cit('c93_075'), 'realisticky')
    expect(r(c.celkem - re.celkem)).toBe(9_660_000)
    expect(Math.round(c.celkem / 100_000) / 10).toBe(30.7)
  })
})

describe('AT-62 až AT-70: model s AI triáží (9.4)', () => {
  const m = vypocetAI(P, 'minimalni')
  const re = vypocetAI(P, 'realisticky')
  const p = vypocetAI(P, 'plny')
  it('AT-62 výjimky / audit / ruční celkem', () => {
    expect([m, re, p].map((x) => [r(x.vyjimky_h), r(x.audit_h), r(x.rucni_h)])).toEqual([
      [1500, 240, 1740],
      [3750, 450, 4200],
      [9000, 840, 9840],
    ])
  })
  it('AT-63 ruční práce na záznam', () =>
    expect([m, re, p].map((x) => Math.round(x.rucni_na_zaznam * 1000) / 1000)).toEqual([0.116, 0.14, 0.164]))
  it('AT-64 lokalizace / QA', () =>
    expect([m, re, p].map((x) => [r(x.lok_h), r(x.qa_h)])).toEqual([
      [0, 375],
      [450, 750],
      [1440, 3000],
    ]))
  it('AT-65 analytické hodiny / Kč', () =>
    expect([m, re, p].map((x) => [r(x.analyt_h), r(x.analyt_kc)])).toEqual([
      [2115, 1_692_000],
      [5400, 4_320_000],
      [14280, 11_424_000],
    ]))
  it('AT-66 mezisoučet / rezerva / celkem', () =>
    expect([m, re, p].map((x) => [r(x.mezisoucet), r(x.rezerva), r(x.celkem)])).toEqual([
      [6_612_000, 991_800, 7_603_800],
      [14_060_000, 2_109_000, 16_169_000],
      [29_124_000, 4_368_600, 33_492_600],
    ]))
  it('AT-67 EUR / údržba', () => {
    expect([m, re, p].map((x) => r(x.eur))).toEqual([304_152, 646_760, 1_339_704])
    expect([m, re, p].map((x) => [r2(x.udrzba_min), r2(x.udrzba_max)])).toEqual([
      [1.9, 2.66],
      [4.04, 5.66],
      [8.37, 11.72],
    ])
  })
  it('AT-68 úspora', () => {
    const s = (['minimalni', 'realisticky', 'plny'] as const).map((x) => srovnani(P, x))
    expect(s.map((x) => r(x.uspora))).toEqual([1_504_200, 4_899_000, 15_359_400])
    expect(s.map((x) => Math.round(x.uspora_podil * 1000) / 10)).toEqual([16.5, 23.3, 31.4])
  })
  it('AT-69 citlivosti 9.4.5', () => {
    const a = vypocetAI(cit('c945_auto50'), 'realisticky')
    expect(r(a.celkem)).toBe(19_895_000)
    expect(r(a.analyt_h)).toBe(9450)
    expect(Math.round(a.rucni_na_zaznam * 100) / 100).toBe(0.26)
    expect(r(vypocetAI(cit('c945_llm150'), 'realisticky').celkem)).toBe(19_619_000)
    expect(r(vypocetAI(cit('c945_obojí'), 'realisticky').celkem)).toBe(23_345_000)
  })
  it('AT-70 struktura nákladů (realistický)', () => {
    const b = vypocetBezAI(P, 'realisticky')
    expect(Math.round(b.podil_analytiky * 100)).toBe(62)
    expect(Math.round(re.podil_analytiky * 100)).toBe(31)
    expect(Math.round(re.podil_inzenyrstvi * 100)).toBe(41)
  })
})
