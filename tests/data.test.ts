import { describe, expect, it } from 'vitest'
import { jeVOkne } from '../shared/strom.js'
import { pilot, zdroje } from './pomocne.js'

describe('AT-01 až AT-16: seed data pilotu 1.1', () => {
  it('AT-01 počet správců je 30', () => expect(pilot.spravci).toHaveLength(30))
  it('AT-02 počet kol je 25', () => expect(pilot.kola).toHaveLength(25))

  it('AT-03 rozložení stavů', () => {
    const ab = (st: string) => pilot.spravci.filter((s) => s.stav_aktivity === 'aktivni' && s.stupen === st).length
    expect(ab('A')).toBe(22)
    expect(ab('B')).toBe(4)
    expect(pilot.spravci.filter((s) => s.stav_aktivity === 'kandidat').map((s) => s.id)).toEqual([26, 28])
    expect(pilot.spravci.filter((s) => s.stav_aktivity === 'watchlist').map((s) => s.id)).toEqual([29])
    expect(pilot.spravci.filter((s) => s.stav_aktivity === 'vyrazen').map((s) => s.id)).toEqual([30])
  })

  it('AT-11 konflikt: #4 a #6', () => {
    const ids = pilot.spravci
      .filter((s) => [...s.fondy.flatMap((f) => f.hodnoty), s.tiket].some((c) => c.stav_hodnoty === 'konflikt'))
      .map((s) => s.id)
    expect(ids).toEqual([4, 6])
  })

  it('AT-13 každý A/B má primární účast se zdrojem a datem v okně 24 měsíců', () => {
    for (const s of pilot.spravci.filter((x) => x.stupen === 'A' || x.stupen === 'B')) {
      const ok = s.ucasti.some(
        (u) => u.primarni_doklad && u.zdroj_text && u.datum_publikace && jeVOkne(u.datum_publikace, pilot.datum_vyhodnoceni, 24),
      )
      expect(ok, `#${s.id} ${s.nazev}`).toBe(true)
    }
  })

  it('AT-14 kolo ValkaAI (K08): 5 účastníků, #5 lead, 12 mil. EUR jednou na kole', () => {
    const ucastnici = pilot.spravci.flatMap((s) => s.ucasti.filter((u) => u.kolo_id === 'K08').map((u) => ({ id: s.id, role: u.role })))
    expect(ucastnici.map((u) => u.id)).toEqual([5, 6, 7, 8, 22])
    expect(ucastnici.find((u) => u.id === 5)?.role).toBe('lead')
    const k08 = pilot.kola.find((k) => k.id === 'K08')!
    expect(k08.castka_kola).toBe(12_000_000)
    expect(k08.mena).toBe('EUR')
  })

  it('AT-15 částka kola se nepromítá do tiketu', () => {
    for (const s of pilot.spravci) {
      for (const u of s.ucasti) {
        const k = pilot.kola.find((x) => x.id === u.kolo_id)!
        if (k.castka_kola != null && s.tiket.min != null && s.tiket.mena === k.mena) {
          expect(s.tiket.min === k.castka_kola && s.tiket.max == null, `#${s.id} ${k.id}`).toBe(false)
        }
      }
    }
  })

  it('AT-16 všechna čísla zdrojů existují', () => {
    const cisla = new Set(zdroje.map((z) => z.cislo))
    expect(cisla.size).toBe(68)
    const pouzita = [
      ...pilot.kola.flatMap((k) => k.zdroje),
      ...pilot.spravci.flatMap((s) => [
        ...s.ucasti.flatMap((u) => u.zdroje),
        ...s.udalosti.flatMap((u) => u.zdroje),
        ...s.fondy.flatMap((f) => f.hodnoty.flatMap((h) => h.zdroje)),
        ...s.tiket.zdroje,
        ...(s.zdroje_zaznamu ?? []),
      ]),
    ]
    for (const c of pouzita) expect(cisla.has(c), `zdroj ${c}`).toBe(true)
  })

  it('všechna kola mají alespoň jednoho účastníka a účasti odkazují na existující kola', () => {
    const kola = new Set(pilot.kola.map((k) => k.id))
    const pouzita = new Set(pilot.spravci.flatMap((s) => s.ucasti.map((u) => u.kolo_id)))
    for (const k of pouzita) expect(kola.has(k)).toBe(true)
    for (const k of kola) expect(pouzita.has(k), k).toBe(true)
  })
})
