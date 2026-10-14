import { z } from 'zod'
import { db, num, str, type Radek } from '../db.js'
import { nactiVerzi, VYCHOZI_VERZE } from '../data.js'
import { HttpChyba, json, type Odpoved, type Pozadavek } from '../http.js'
import { rozhodnutiZaznamu, ROZHODNUTI, type Rozhodnuti } from '../../shared/typy.js'
import { SKRYTA_POLE_KONTROLY, type Dataset, type Hodnoceni, type ReferencniPolozka, type ZaznamKontrolora } from '../../shared/api.js'
import { vypocetKontroly, type VysledkyKontroly } from '../../shared/kontrola.js'
import { normalizujText } from '../../shared/filtry.js'
import { csv } from '../csv.js'

function hodnoceni(r: Radek): Hodnoceni {
  return {
    id: Number(r.id),
    verze_id: String(r.verze_id),
    spravce_id: Number(r.spravce_id),
    kontrolor: String(r.kontrolor),
    rozhodnuti_kontrolora: String(r.rozhodnuti_kontrolora) as Rozhodnuti,
    shoda: r.shoda == null ? null : Boolean(r.shoda),
    chybne_pole: str(r.chybne_pole),
    typ_chyby: str(r.typ_chyby) as Hodnoceni['typ_chyby'],
    cas_min: num(r.cas_min),
    pole_spravne: (r.pole_spravne as Hodnoceni['pole_spravne']) ?? null,
    poznamka: str(r.poznamka),
    ulozeno: String(r.ulozeno),
  }
}

const SELECT_HODNOCENI = `SELECT id, verze_id, spravce_id, kontrolor, rozhodnuti_kontrolora, shoda, chybne_pole, typ_chyby,
  cas_min, pole_spravne, poznamka, ulozeno::text FROM hodnoceni_kontrolora`

function referencni(r: Radek): ReferencniPolozka {
  return { id: Number(r.id), nazev_investora: String(r.nazev_investora), zdroj: String(r.zdroj), datum: str(r.datum), spravce_id: num(r.spravce_id) }
}

/** Kontrolor s nejvíce hodnoceními ve verzi (výchozí pro výsledky a go/no-go). */
export async function vychoziKontrolor(verze: string): Promise<string | null> {
  const r = await db().query(
    `SELECT kontrolor FROM hodnoceni_kontrolora WHERE verze_id = $1 GROUP BY kontrolor ORDER BY count(*) DESC, max(ulozeno) DESC LIMIT 1`,
    [verze],
  )
  return r.length ? String(r[0].kontrolor) : null
}

/** Výsledky kontroly pro verzi a kontrolora (výchozí = kontrolor s nejvíce hodnoceními). */
export async function nactiVysledky(d: Dataset, kontrolor?: string): Promise<VysledkyKontroly | null> {
  const k = kontrolor ?? (await vychoziKontrolor(d.verze.id))
  if (!k) return null
  const sql = db()
  const [h, ref] = await sql.transaction(
    [
      sql.query(`${SELECT_HODNOCENI} WHERE verze_id = $1 AND kontrolor = $2`, [d.verze.id, k]),
      sql.query('SELECT id, spravce_id FROM referencni_seznam'),
    ],
    { readOnly: true },
  )
  return vypocetKontroly(d.spravci, h.map(hodnoceni), ref.map((r) => ({ spravce_id: num(r.spravce_id) })), k)
}

function pozadujKontrolora(p: Pozadavek): string {
  const k = p.query.kontrolor?.trim()
  if (!k) throw new HttpChyba(400, 'Chybí parametr kontrolor.')
  return k
}

/** GET /api/kontrola/zaznamy?kontrolor= – režim naslepo (FR-51): skrytá pole se vrací až po uložení hodnocení. */
export async function zaznamy(p: Pozadavek): Promise<Odpoved> {
  const kontrolor = pozadujKontrolora(p)
  const verze = p.query.verze ?? VYCHOZI_VERZE
  const d = await nactiVerzi(verze)
  const h = (await db().query(`${SELECT_HODNOCENI} WHERE verze_id = $1 AND kontrolor = $2`, [verze, kontrolor])).map(hodnoceni)
  const out: ZaznamKontrolora[] = d.spravci.map((s) => {
    const moje = h.find((x) => x.spravce_id === s.id) ?? null
    if (moje) return { ...s, odkryto: true, rozhodnuti_v: rozhodnutiZaznamu(s), hodnoceni: moje }
    const skryty: Record<string, unknown> = { ...s }
    for (const pole of SKRYTA_POLE_KONTROLY) delete skryty[pole]
    // Doslovný text sloupce „Subjekt“ může prozradit hodnocení (např. „kontrolní negativní případ“).
    skryty.subjekt_text = s.nazev
    return { ...(skryty as Omit<ZaznamKontrolora, 'odkryto' | 'rozhodnuti_v' | 'hodnoceni'>), odkryto: false, rozhodnuti_v: null, hodnoceni: null }
  })
  return json({ verze: d.verze, kontrolor, zaznamy: out, kola: d.kola })
}

const HodnoceniSchema = z.object({
  verze: z.string().default(VYCHOZI_VERZE),
  spravce_id: z.number().int(),
  kontrolor: z.string().trim().min(1).max(100),
  rozhodnuti_kontrolora: z.enum(ROZHODNUTI as [Rozhodnuti, ...Rozhodnuti[]]),
  chybne_pole: z.string().trim().max(200).nullable().optional(),
  typ_chyby: z.enum(['identita', 'aktivita', 'typ', 'castka', 'datum']).nullable().optional(),
  cas_min: z.number().min(0).max(10000).nullable().optional(),
  pole_spravne: z
    .object({ sektor: z.boolean().nullable(), faze: z.boolean().nullable(), tiket: z.boolean().nullable(), fond: z.boolean().nullable() })
    .partial()
    .nullable()
    .optional(),
  poznamka: z.string().trim().max(2000).nullable().optional(),
})

/** POST /api/kontrola/hodnoceni – uloží (nebo přepíše) hodnocení a dopočítá shodu. */
export async function ulozHodnoceni(p: Pozadavek): Promise<Odpoved> {
  const v = HodnoceniSchema.parse(p.body)
  const sql = db()
  const s = await sql.query('SELECT stupen, stav_aktivity FROM spravce WHERE verze_id = $1 AND id = $2', [v.verze, v.spravce_id])
  if (!s.length) throw new HttpChyba(404, `Záznam ${v.spravce_id} ve verzi ${v.verze} neexistuje.`)
  const puvodni = rozhodnutiZaznamu({ stupen: str(s[0].stupen) as 'A', stav_aktivity: String(s[0].stav_aktivity) as 'aktivni' })
  const shoda = puvodni === v.rozhodnuti_kontrolora
  const pole = v.pole_spravne ? Object.fromEntries(Object.entries(v.pole_spravne).filter(([, x]) => x != null)) : null
  const r = await sql.query(
    `INSERT INTO hodnoceni_kontrolora (verze_id, spravce_id, kontrolor, rozhodnuti_kontrolora, shoda, chybne_pole, typ_chyby, cas_min, pole_spravne, poznamka)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     ON CONFLICT (verze_id, spravce_id, kontrolor) DO UPDATE SET
       rozhodnuti_kontrolora = EXCLUDED.rozhodnuti_kontrolora, shoda = EXCLUDED.shoda, chybne_pole = EXCLUDED.chybne_pole,
       typ_chyby = EXCLUDED.typ_chyby, cas_min = EXCLUDED.cas_min, pole_spravne = EXCLUDED.pole_spravne,
       poznamka = EXCLUDED.poznamka, ulozeno = now()
     RETURNING id, verze_id, spravce_id, kontrolor, rozhodnuti_kontrolora, shoda, chybne_pole, typ_chyby, cas_min, pole_spravne, poznamka, ulozeno::text`,
    [v.verze, v.spravce_id, v.kontrolor, v.rozhodnuti_kontrolora, shoda, v.chybne_pole ?? null, v.typ_chyby ?? null, v.cas_min ?? null, pole ? JSON.stringify(pole) : null, v.poznamka ?? null],
  )
  return json({ hodnoceni: hodnoceni(r[0]), rozhodnuti_v: puvodni }, 201)
}

/** GET /api/kontrola/kontrolori – kontroloři a počty hodnocení. */
export async function kontrolori(p: Pozadavek): Promise<Odpoved> {
  const r = await db().query(
    'SELECT kontrolor, count(*)::int AS pocet, max(ulozeno)::text AS posledni FROM hodnoceni_kontrolora WHERE verze_id = $1 GROUP BY kontrolor ORDER BY pocet DESC',
    [p.query.verze ?? VYCHOZI_VERZE],
  )
  return json(r)
}

/** GET /api/kontrola/vysledky – metriky kap. 7.4 bod 4. */
export async function vysledky(p: Pozadavek): Promise<Odpoved> {
  const d = await nactiVerzi(p.query.verze ?? VYCHOZI_VERZE)
  return json({ verze: d.verze, vysledky: await nactiVysledky(d, p.query.kontrolor || undefined) })
}

/** GET /api/kontrola/export?kontrolor= – šablona kap. 7.4 bod 5 jako CSV (FR-54). */
export async function exportCsv(p: Pozadavek): Promise<Odpoved> {
  const kontrolor = pozadujKontrolora(p)
  const d = await nactiVerzi(p.query.verze ?? VYCHOZI_VERZE)
  const h = (await db().query(`${SELECT_HODNOCENI} WHERE verze_id = $1 AND kontrolor = $2 ORDER BY spravce_id`, [d.verze.id, kontrolor])).map(hodnoceni)
  const radky = h.map((x) => {
    const s = d.spravci.find((y) => y.id === x.spravce_id)!
    return {
      ID: x.spravce_id,
      Subjekt: s.nazev,
      [`Rozhodnutí v${d.verze.id}`]: rozhodnutiZaznamu(s),
      'Rozhodnutí kontrolora': x.rozhodnuti_kontrolora,
      'Shoda (A/N)': x.shoda ? 'A' : 'N',
      'Chybné pole': x.chybne_pole ?? '',
      'Typ chyby': x.typ_chyby ?? '',
      'Čas (min)': x.cas_min ?? '',
      'Sektor správně': x.pole_spravne?.sektor ?? '',
      'Fáze správně': x.pole_spravne?.faze ?? '',
      'Tiket správně': x.pole_spravne?.tiket ?? '',
      'Fond správně': x.pole_spravne?.fond ?? '',
      Poznámka: x.poznamka ?? '',
    }
  })
  return {
    status: 200,
    text: csv(radky),
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="kontrola_v${d.verze.id}_${encodeURIComponent(kontrolor)}.csv"`,
    },
  }
}

/** GET /api/kontrola/referencni-seznam */
export async function referencniSeznam(): Promise<Odpoved> {
  const r = await db().query('SELECT id, nazev_investora, zdroj, datum::text, spravce_id FROM referencni_seznam ORDER BY nazev_investora')
  return json(r.map(referencni))
}

const ImportSchema = z.object({ csv: z.string().min(1).max(2_000_000), nahradit: z.boolean().default(false), verze: z.string().default(VYCHOZI_VERZE) })

/** Rozdělí řádek CSV (oddělovač ; nebo ,) s podporou uvozovek. */
export function parsujCsvRadek(radek: string, odd: string): string[] {
  const out: string[] = []
  let cur = ''
  let uv = false
  for (let i = 0; i < radek.length; i++) {
    const ch = radek[i]
    if (uv) {
      if (ch === '"' && radek[i + 1] === '"') {
        cur += '"'
        i++
      } else if (ch === '"') uv = false
      else cur += ch
    } else if (ch === '"') uv = true
    else if (ch === odd) {
      out.push(cur)
      cur = ''
    } else cur += ch
  }
  out.push(cur)
  return out.map((x) => x.trim())
}

/** POST /api/kontrola/referencni-seznam – import CSV (nazev_investora; zdroj; datum) s automatickým návrhem mapování (FR-52). */
export async function importReferencni(p: Pozadavek): Promise<Odpoved> {
  const v = ImportSchema.parse(p.body)
  const radky = v.csv.replace(/^\uFEFF/, '').split(/\r?\n/).filter((r) => r.trim())
  if (!radky.length) throw new HttpChyba(400, 'CSV je prázdné.')
  const odd = radky[0].includes(';') ? ';' : ','
  let data = radky.map((r) => parsujCsvRadek(r, odd))
  if (/n[aá]zev|investor/i.test(data[0][0] ?? '')) data = data.slice(1)

  const d = await nactiVerzi(v.verze)
  const najdi = (nazev: string): number | null => {
    const n = normalizujText(nazev)
    const s = d.spravci.find((x) => [x.nazev, ...x.dalsi_nazvy].some((y) => normalizujText(y) === n))
    if (s) return s.id
    const castecne = d.spravci.filter((x) => n.length >= 4 && [x.nazev, ...x.dalsi_nazvy].some((y) => normalizujText(y).startsWith(n) || n.startsWith(normalizujText(y))))
    return castecne.length === 1 ? castecne[0].id : null
  }

  const sql = db()
  const dotazy = []
  if (v.nahradit) dotazy.push(sql.query('DELETE FROM referencni_seznam'))
  let namapovano = 0
  for (const [nazev, zdroj, datum] of data) {
    if (!nazev) continue
    const sid = najdi(nazev)
    if (sid != null) namapovano++
    const dt = datum && /^\d{4}-\d{2}-\d{2}$/.test(datum) ? datum : null
    dotazy.push(
      sql.query('INSERT INTO referencni_seznam (nazev_investora, zdroj, datum, spravce_id) VALUES ($1,$2,$3,$4)', [nazev, zdroj || 'CzechCrunch', dt, sid]),
    )
  }
  await sql.transaction(dotazy)
  return json({ importovano: data.filter((r) => r[0]).length, namapovano }, 201)
}

/** PUT /api/kontrola/referencni-seznam/:id – ruční mapování na správce. */
export async function mapujReferencni(p: Pozadavek, id: string): Promise<Odpoved> {
  const v = z.object({ spravce_id: z.number().int().nullable() }).parse(p.body)
  const r = await db().query('UPDATE referencni_seznam SET spravce_id = $1 WHERE id = $2 RETURNING id, nazev_investora, zdroj, datum::text, spravce_id', [
    v.spravce_id,
    Number(id),
  ])
  if (!r.length) throw new HttpChyba(404, 'Položka neexistuje.')
  return json(referencni(r[0]))
}

/** DELETE /api/kontrola/referencni-seznam – vymaže referenční seznam. */
export async function smazReferencni(): Promise<Odpoved> {
  await db().query('DELETE FROM referencni_seznam')
  return json({ ok: true })
}
