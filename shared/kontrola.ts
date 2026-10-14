import { cohenKappa, median } from './kappa.js'
import { podil, type Podil } from './wilson.js'
import { jeZarazen, rozhodnutiZaznamu, ROZHODNUTI, type Rozhodnuti, type SpravceData, type TypChyby } from './typy.js'
import { POLE_KONTROLY, type Hodnoceni, type PoleKontroly, type ReferencniPolozka } from './api.js'

/** Výsledky nezávislé kontroly (kap. 7.4 bod 4, FR-53). */
export interface VysledkyKontroly {
  kontrolor: string | null
  hodnoceno: number
  celkem: number
  dokonceno: boolean
  shoda: Podil
  presnostZarazeni: Podil
  zachyt: Podil | null
  spravnostTypu: Podil
  spravnostPoli: Record<PoleKontroly, Podil>
  sektorAFaze: Podil
  vyplnenost: Record<'sektory' | 'faze' | 'tiket' | 'fond', Podil>
  medianCasu: number | null
  kappa: number | null
  chyby: Record<TypChyby, number>
  matice: Record<Rozhodnuti, Record<Rozhodnuti, number>>
  /** Zařazení A+B (v1.1), které kontrolor potvrdil jako zařazené – pro přepočet metrik. */
  potvrzeniInvestori: number[]
}

type SpravceKontrola = Pick<
  SpravceData,
  'id' | 'nazev' | 'stupen' | 'stav_aktivity' | 'tiket_deklarovany' | 'fond_castka_uvedena'
> & { sektory?: string[]; faze?: string[] }

export function vypocetKontroly(
  spravci: SpravceKontrola[],
  hodnoceni: Pick<Hodnoceni, 'spravce_id' | 'rozhodnuti_kontrolora' | 'typ_chyby' | 'cas_min' | 'pole_spravne'>[],
  referencni: Pick<ReferencniPolozka, 'spravce_id'>[],
  kontrolor: string | null,
): VysledkyKontroly {
  const dle = new Map(spravci.map((s) => [s.id, s]))
  const platna = hodnoceni.filter((h) => dle.has(h.spravce_id))
  const dvojice: Array<[Rozhodnuti, Rozhodnuti]> = platna.map((h) => [rozhodnutiZaznamu(dle.get(h.spravce_id)!), h.rozhodnuti_kontrolora])

  const matice = Object.fromEntries(ROZHODNUTI.map((r) => [r, Object.fromEntries(ROZHODNUTI.map((q) => [q, 0]))])) as VysledkyKontroly['matice']
  for (const [a, b] of dvojice) matice[a][b]++

  const zarazeneHodnocene = platna.filter((h) => jeZarazen(rozhodnutiZaznamu(dle.get(h.spravce_id)!)))
  const potvrzene = zarazeneHodnocene.filter((h) => jeZarazen(h.rozhodnuti_kontrolora))

  const spravnostPoli = Object.fromEntries(
    POLE_KONTROLY.map((p) => {
      const s = platna.filter((h) => h.pole_spravne?.[p] != null)
      return [p, podil(s.filter((h) => h.pole_spravne![p] === true).length, s.length)]
    }),
  ) as Record<PoleKontroly, Podil>

  const sf = platna.filter((h) => h.pole_spravne?.sektor != null && h.pole_spravne?.faze != null)
  const chyby = { identita: 0, aktivita: 0, typ: 0, castka: 0, datum: 0 }
  for (const h of platna) if (h.typ_chyby) chyby[h.typ_chyby]++

  const ab = spravci.filter((s) => jeZarazen(rozhodnutiZaznamu(s)))
  const vypl = (f: (s: SpravceKontrola) => boolean) => podil(ab.filter(f).length, ab.length)

  return {
    kontrolor,
    hodnoceno: platna.length,
    celkem: spravci.length,
    dokonceno: spravci.length > 0 && platna.length === spravci.length,
    shoda: podil(dvojice.filter(([a, b]) => a === b).length, dvojice.length),
    presnostZarazeni: podil(potvrzene.length, zarazeneHodnocene.length),
    zachyt: referencni.length ? podil(referencni.filter((r) => r.spravce_id != null).length, referencni.length) : null,
    spravnostTypu: podil(platna.filter((h) => h.typ_chyby !== 'typ').length, platna.length),
    spravnostPoli,
    sektorAFaze: podil(sf.filter((h) => h.pole_spravne!.sektor && h.pole_spravne!.faze).length, sf.length),
    vyplnenost: {
      sektory: vypl((s) => (s.sektory?.length ?? 0) > 0),
      faze: vypl((s) => (s.faze?.length ?? 0) > 0),
      tiket: vypl((s) => s.tiket_deklarovany),
      fond: vypl((s) => s.fond_castka_uvedena === true),
    },
    medianCasu: median(platna.map((h) => h.cas_min).filter((x): x is number => x != null)),
    kappa: cohenKappa(dvojice),
    chyby,
    matice,
    potvrzeniInvestori: potvrzene.map((h) => h.spravce_id),
  }
}
