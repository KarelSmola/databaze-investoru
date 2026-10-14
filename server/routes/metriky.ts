import { nactiVerzi, VYCHOZI_VERZE } from '../data.js'
import { json, type Odpoved, type Pozadavek } from '../http.js'
import { nactiVysledky } from './kontrola.js'
import { spocitejMetriky } from '../../shared/metriky.js'

/** GET /api/metriky – metriky kap. 7.3; po dokončené kontrole i přepočet podle rozhodnutí kontrolora (FR-43). */
export async function metriky(p: Pozadavek): Promise<Odpoved> {
  const d = await nactiVerzi(p.query.verze ?? VYCHOZI_VERZE)
  const predbezne = spocitejMetriky(d.spravci)
  const kontrola = await nactiVysledky(d)
  const poKontrole = kontrola?.dokonceno
    ? spocitejMetriky(d.spravci, (s) => kontrola.potvrzeniInvestori.includes(s.id))
    : null
  return json({ verze: d.verze, predbezne, kontrola, poKontrole })
}
