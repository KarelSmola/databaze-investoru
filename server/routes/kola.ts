import { nactiVerzi, VYCHOZI_VERZE } from '../data.js'
import { HttpChyba, json, type Odpoved, type Pozadavek } from '../http.js'
import type { DetailKolaOdpoved } from '../../shared/api.js'

/** GET /api/kola/:id – kolo se všemi účastníky (FR-14). Částka kola se nikdy nepřiřazuje investorům. */
export async function detail(p: Pozadavek, id: string): Promise<Odpoved> {
  const d = await nactiVerzi(p.query.verze ?? VYCHOZI_VERZE)
  const kolo = d.kola.find((k) => k.id === id)
  if (!kolo) throw new HttpChyba(404, `Kolo ${id} neexistuje.`)
  const ucastnici: DetailKolaOdpoved['ucastnici'] = d.spravci.flatMap((s) =>
    s.ucasti
      .filter((u) => u.kolo_id === id)
      .map((u) => ({ spravce: { id: s.id, nazev: s.nazev, stupen: s.stupen, stav_aktivity: s.stav_aktivity }, ucast: u })),
  )
  const odp: DetailKolaOdpoved = { verze: d.verze, kolo, ucastnici }
  return json(odp)
}
