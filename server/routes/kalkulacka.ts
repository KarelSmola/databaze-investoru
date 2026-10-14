import { z } from 'zod'
import { db } from '../db.js'
import { HttpChyba, json, type Odpoved, type Pozadavek } from '../http.js'

/** GET /api/kalkulacka/varianty */
export async function seznam(): Promise<Odpoved> {
  const r = await db().query('SELECT id, nazev, parametry, vytvoreno::text FROM kalkulacka_varianta ORDER BY vytvoreno DESC')
  return json(r)
}

const VariantaSchema = z.object({ nazev: z.string().trim().min(1).max(200), parametry: z.record(z.string(), z.unknown()) })

/** POST /api/kalkulacka/varianty – uloží pojmenovanou variantu parametrů (FR-76). */
export async function uloz(p: Pozadavek): Promise<Odpoved> {
  const v = VariantaSchema.parse(p.body)
  const r = await db().query('INSERT INTO kalkulacka_varianta (nazev, parametry) VALUES ($1, $2) RETURNING id, nazev, parametry, vytvoreno::text', [
    v.nazev,
    JSON.stringify(v.parametry),
  ])
  return json(r[0], 201)
}

/** DELETE /api/kalkulacka/varianty/:id */
export async function smaz(_p: Pozadavek, id: string): Promise<Odpoved> {
  const r = await db().query('DELETE FROM kalkulacka_varianta WHERE id = $1 RETURNING id', [Number(id)])
  if (!r.length) throw new HttpChyba(404, 'Varianta neexistuje.')
  return json({ ok: true })
}
