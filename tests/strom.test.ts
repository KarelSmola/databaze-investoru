import { describe, expect, it } from 'vitest'
import { HRANICNI_PRIPADY, hraniceOkna, jeVOkne, oknoAktivityMesice, rozhodni } from '../shared/strom.js'

describe('AT-30 až AT-42: hraniční případy kap. 2.2', () => {
  for (const p of HRANICNI_PRIPADY) {
    it(`${p.id} ${p.pripad} → ${p.ocekavanoText}`, () => {
      expect(p.ocekavano).toContain(rozhodni(p.vstup).vysledek)
    })
  }

  it('AT-31 Miton má poznámku holding/CVC', () => {
    const p = HRANICNI_PRIPADY.find((x) => x.id === 'AT-31')!
    expect(rozhodni(p.vstup).poznamka).toMatch(/holding\/CVC/)
  })
})

describe('okno aktivity (sekce 8.3)', () => {
  it('VC/CVC/anděl 24, ostatní 36 měsíců', () => {
    expect(oknoAktivityMesice('VC')).toBe(24)
    expect(oknoAktivityMesice('andel')).toBe(24)
    expect(oknoAktivityMesice('PE')).toBe(36)
    expect(oknoAktivityMesice('FO')).toBe(36)
  })
  it('hranice VC pro pilot je 2024-10-11', () => expect(hraniceOkna('2026-10-11', 24)).toBe('2024-10-11'))
  it('částečná data', () => {
    expect(jeVOkne('2024-10-11', '2026-10-11', 24)).toBe(true)
    expect(jeVOkne('2024-10-10', '2026-10-11', 24)).toBe(false)
    expect(jeVOkne('2024-10', '2026-10-11', 24)).toBe(true)
    expect(jeVOkne('2023', '2026-10-11', 36)).toBe(true)
    expect(jeVOkne('2022', '2026-10-11', 36)).toBe(false)
  })
  it('kroky stromu', () => {
    const z = {
      identita_overitelna: true,
      investuje_do_podilu: true,
      kategorie: 'VC' as const,
      doklad: 'v_okne' as const,
      ceska_relevance: '1' as const,
      kategorie_urcitelna: true,
      otevrena_otazka: false,
    }
    expect(rozhodni({ ...z, identita_overitelna: false }).vysledek).toBe('vyrazen')
    expect(rozhodni({ ...z, doklad: 'starsi' }).vysledek).toBe('historicky')
    expect(rozhodni({ ...z, ceska_relevance: null }).vysledek).toBe('mimo_rozsah')
    expect(rozhodni({ ...z, otevrena_otazka: true }).vysledek).toBe('zarazen_B')
    expect(rozhodni({ ...z, kategorie: 'velky_soukromy_investor', pocet_dolozenych_investic: 1 }).vysledek).toBe('kandidat')
  })
})
