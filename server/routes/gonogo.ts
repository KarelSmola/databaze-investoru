import { z } from 'zod'
import { db, num, str } from '../db.js'
import { nactiVerzi, VYCHOZI_VERZE } from '../data.js'
import { HttpChyba, json, type Odpoved, type Pozadavek } from '../http.js'
import { nactiVysledky } from './kontrola.js'
import { spocitejMetriky } from '../../shared/metriky.js'
import { KRITERIA, vyhodnotGoNogo } from '../../shared/gonogo.js'
import type { GoNogoVstup } from '../../shared/api.js'

async function vstupy(): Promise<GoNogoVstup[]> {
  const r = await db().query('SELECT kriterium, hodnota, citatel, jmenovatel, poznamka, zadano::text FROM go_nogo_vstup')
  return r.map((x) => ({
    kriterium: String(x.kriterium),
    hodnota: num(x.hodnota),
    citatel: num(x.citatel),
    jmenovatel: num(x.jmenovatel),
    poznamka: str(x.poznamka),
    zadano: String(x.zadano),
  }))
}

/** GET /api/go-nogo – kritéria sekce 8.7 se stavy splněno / nesplněno / čeká na data. */
export async function seznam(p: Pozadavek): Promise<Odpoved> {
  const d = await nactiVerzi(p.query.verze ?? VYCHOZI_VERZE)
  const kontrola = await nactiVysledky(d)
  return json({ verze: d.verze, kontrolor: kontrola?.kontrolor ?? null, ...vyhodnotGoNogo(spocitejMetriky(d.spravci), kontrola, await vstupy()) })
}

const VstupSchema = z.object({
  hodnota: z.number().nullable().optional(),
  citatel: z.number().int().min(0).nullable().optional(),
  jmenovatel: z.number().int().min(1).nullable().optional(),
  poznamka: z.string().trim().max(2000).nullable().optional(),
})

/** PUT /api/go-nogo/:kriterium – ruční vstup G-6 až G-11. */
export async function uloz(p: Pozadavek, kriterium: string): Promise<Odpoved> {
  const def = KRITERIA.find((k) => k.id === kriterium)
  if (!def?.vstup) throw new HttpChyba(400, `Kritérium ${kriterium} se nezadává ručně.`)
  const v = VstupSchema.parse(p.body)
  if (v.citatel != null && v.jmenovatel != null && v.citatel > v.jmenovatel) throw new HttpChyba(400, 'Čitatel nesmí být větší než jmenovatel.')
  await db().query(
    `INSERT INTO go_nogo_vstup (kriterium, hodnota, citatel, jmenovatel, poznamka) VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (kriterium) DO UPDATE SET hodnota = EXCLUDED.hodnota, citatel = EXCLUDED.citatel,
       jmenovatel = EXCLUDED.jmenovatel, poznamka = EXCLUDED.poznamka, zadano = now()`,
    [kriterium, v.hodnota ?? null, v.citatel ?? null, v.jmenovatel ?? null, v.poznamka ?? null],
  )
  return json({ ok: true })
}

/** DELETE /api/go-nogo/:kriterium – smaže ruční vstup. */
export async function smaz(_p: Pozadavek, kriterium: string): Promise<Odpoved> {
  await db().query('DELETE FROM go_nogo_vstup WHERE kriterium = $1', [kriterium])
  return json({ ok: true })
}
