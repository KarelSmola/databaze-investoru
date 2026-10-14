import { z } from 'zod'
import { db } from '../db.js'
import { nactiVerzi, overNezmrazeno, VYCHOZI_VERZE } from '../data.js'
import { HttpChyba, json, type Odpoved, type Pozadavek } from '../http.js'
import { filtruj, PRIZNAKY, type Priznak } from '../../shared/filtry.js'
import type { DetailSpravceOdpoved, SeznamSpravcuOdpoved } from '../../shared/api.js'

export function parsujFiltr(q: Pozadavek['query']) {
  const priznak = (q.priznak ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter((x): x is Priznak => x in PRIZNAKY)
  return { stav: q.stav || undefined, stupen: q.stupen || undefined, skupina: q.skupina || undefined, kategorie: q.kategorie || undefined, q: q.q || undefined, priznak }
}

/** GET /api/spravci – seznam s filtry FR-11 a fulltextem FR-12. */
export async function seznam(p: Pozadavek): Promise<Odpoved> {
  const d = await nactiVerzi(p.query.verze ?? VYCHOZI_VERZE)
  const spravci = filtruj(d.spravci, d.kola, parsujFiltr(p.query))
  const odp: SeznamSpravcuOdpoved = { verze: d.verze, celkem: d.spravci.length, spravci, kola: d.kola }
  return json(odp)
}

/** GET /api/spravci/:id – detail správce. */
export async function detail(p: Pozadavek, id: string): Promise<Odpoved> {
  const d = await nactiVerzi(p.query.verze ?? VYCHOZI_VERZE)
  const s = d.spravci.find((x) => x.id === Number(id))
  if (!s) throw new HttpChyba(404, `Správce ${id} neexistuje.`)
  const koloIds = new Set(s.ucasti.map((u) => u.kolo_id))
  const spoluinvestori: DetailSpravceOdpoved['spoluinvestori'] = {}
  for (const k of koloIds) {
    spoluinvestori[k] = d.spravci
      .filter((x) => x.id !== s.id)
      .flatMap((x) => x.ucasti.filter((u) => u.kolo_id === k).map((u) => ({ id: x.id, nazev: x.nazev, role: u.role })))
  }
  const odp: DetailSpravceOdpoved = { verze: d.verze, spravce: s, kola: d.kola.filter((k) => koloIds.has(k.id)), spoluinvestori }
  return json(odp)
}

const textPole = z.string().trim().max(2000).nullable()
const EDITOVATELNA = {
  nazev: z.string().trim().min(1).max(300),
  dalsi_nazvy: z.array(z.string().trim().min(1)).max(50),
  kategorie: z.enum(['VC', 'PE', 'CVC', 'FO', 'andel', 'velky_soukromy_investor', 'fond_fondu', 'holding_CVC', 'nejasny', 'neinvestor']),
  typ_osoby: z.enum(['PO', 'FO']),
  skupina_relevance: z.enum(['1', '2a', '2b']).nullable(),
  ico: textPole,
  lei: textPole,
  zeme: textPole,
  sektory: z.array(z.string().trim().min(1)).max(50),
  faze: z.array(z.string().trim().min(1)).max(50),
  stav_aktivity: z.enum(['aktivni', 'historicky', 'kandidat', 'watchlist', 'vyrazen']),
  stupen: z.enum(['A', 'B', 'C', 'X']).nullable(),
  poznamka_stupne: textPole,
  ma_primarni_doklad_24m: z.boolean(),
  je_skutecny_investor_predbezne: z.boolean().nullable(),
  tiket_deklarovany: z.boolean(),
  fond_s_typem_a_datem: z.boolean().nullable(),
  fond_castka_uvedena: z.boolean().nullable(),
  datum_kontroly: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  namitka_gdpr: z.boolean().nullable(),
} as const

type EditPole = keyof typeof EDITOVATELNA
export const EDITOVATELNA_POLE = Object.keys(EDITOVATELNA) as EditPole[]

const UpravaSchema = z.object({
  zmeny: z.record(z.string(), z.unknown()),
  duvod: z.string().trim().min(3, 'Uveďte důvod změny.'),
  autor: z.string().trim().min(1, 'Uveďte autora změny.'),
})

const naText = (v: unknown) => (v == null ? null : Array.isArray(v) ? JSON.stringify(v) : String(v))

/** PATCH /api/spravci/:id?verze= – změna polí v nezmrazené verzi; každá změna jde do historie_zmen (FR-17). */
export async function uprav(p: Pozadavek, id: string): Promise<Odpoved> {
  const verze = p.query.verze
  if (!verze) throw new HttpChyba(400, 'Chybí parametr verze.')
  const info = await overNezmrazeno(verze)
  const vstup = UpravaSchema.parse(p.body)
  const sql = db()
  const puvodni = await sql.query('SELECT * FROM spravce WHERE verze_id = $1 AND id = $2', [verze, Number(id)])
  if (!puvodni.length) throw new HttpChyba(404, `Správce ${id} ve verzi ${verze} neexistuje.`)
  const stary = puvodni[0]

  const dotazy = []
  let pocet = 0
  for (const [pole, hodnota] of Object.entries(vstup.zmeny)) {
    if (!(pole in EDITOVATELNA)) throw new HttpChyba(400, `Pole ${pole} nelze měnit.`)
    const nova = EDITOVATELNA[pole as EditPole].parse(hodnota)
    const staraHodnota = stary[pole] instanceof Date ? (stary[pole] as Date).toISOString().slice(0, 10) : stary[pole]
    if (JSON.stringify(staraHodnota ?? null) === JSON.stringify(nova ?? null)) continue
    pocet++
    // Název sloupce je ověřen proti EDITOVATELNA, nelze jím podstrčit SQL.
    dotazy.push(sql.query(`UPDATE spravce SET ${pole} = $1 WHERE verze_id = $2 AND id = $3`, [nova, verze, Number(id)]))
    dotazy.push(
      sql.query(
        `INSERT INTO historie_zmen (verze_z, verze_do, entita, entita_id, pole, stara_hodnota, nova_hodnota, duvod, autor)
         VALUES ($1, $2, 'spravce', $3, $4, $5, $6, $7, $8)`,
        [info.zdrojova_verze ?? verze, verze, String(id), pole, naText(staraHodnota), naText(nova), vstup.duvod, vstup.autor],
      ),
    )
  }
  if (dotazy.length) await sql.transaction(dotazy)
  return json({ zmeneno: pocet })
}
