import { db } from '../db.js'
import { VYCHOZI_VERZE } from '../data.js'
import { json, type Odpoved, type Pozadavek } from '../http.js'
import type { ZdrojApi } from '../../shared/api.js'

/** GET /api/zdroje – zdroje 1–68 se zpětnými odkazy na záznamy a kola (FR-81). */
export async function seznam(p: Pozadavek): Promise<Odpoved> {
  const verze = p.query.verze ?? VYCHOZI_VERZE
  const sql = db()
  const [zdroje, odkazy] = await sql.transaction(
    [
      sql.query('SELECT cislo, titulek, url FROM zdroj ORDER BY cislo'),
      sql.query(
        `SELECT DISTINCT d.zdroj_cislo,
                COALESCE(d.spravce_id, u.spravce_id, ud.spravce_id, c.spravce_id) AS spravce_id,
                COALESCE(d.kolo_id, u.kolo_id) AS kolo_id
         FROM doklad d
         LEFT JOIN ucast u ON u.id = d.ucast_id
         LEFT JOIN udalost ud ON ud.id = d.udalost_id
         LEFT JOIN castka c ON c.id = d.castka_id
         WHERE d.verze_id = $1 AND d.zdroj_cislo IS NOT NULL`,
        [verze],
      ),
    ],
    { readOnly: true },
  )
  const [spravci, kola] = await sql.transaction(
    [
      sql.query('SELECT id, nazev FROM spravce WHERE verze_id = $1', [verze]),
      sql.query('SELECT id, firma FROM kolo WHERE verze_id = $1', [verze]),
    ],
    { readOnly: true },
  )
  const nazevS = new Map(spravci.map((s) => [Number(s.id), String(s.nazev)]))
  const firmaK = new Map(kola.map((k) => [String(k.id), String(k.firma)]))
  const out: ZdrojApi[] = zdroje.map((z) => {
    const o = odkazy.filter((x) => Number(x.zdroj_cislo) === Number(z.cislo))
    const sIds = [...new Set(o.map((x) => x.spravce_id).filter((x) => x != null).map(Number))].sort((a, b) => a - b)
    const kIds = [...new Set(o.map((x) => x.kolo_id).filter((x) => x != null).map(String))].sort()
    return {
      cislo: Number(z.cislo),
      titulek: String(z.titulek),
      url: String(z.url),
      spravci: sIds.map((id) => ({ id, nazev: nazevS.get(id) ?? `#${id}` })),
      kola: kIds.map((id) => ({ id, firma: firmaK.get(id) ?? id })),
    }
  })
  return json(out)
}
