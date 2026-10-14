import { z } from 'zod'
import { db, str } from '../db.js'
import { nactiVerzeInfo, verzeInfo } from '../data.js'
import { HttpChyba, json, type Odpoved, type Pozadavek } from '../http.js'
import type { ZmenaHistorie } from '../../shared/api.js'

/** GET /api/verze – seznam verzí dat. */
export async function seznam(): Promise<Odpoved> {
  const r = await db().query('SELECT id, stav_k::text, zmrazeno, popis, zdrojova_verze, vytvoreno::text FROM verze_dat ORDER BY vytvoreno')
  return json(r.map(verzeInfo))
}

const NovaVerze = z.object({
  z: z.string().min(1),
  id: z.string().trim().regex(/^[0-9A-Za-z._-]{1,20}$/, 'ID verze smí obsahovat jen písmena, číslice, tečku, pomlčku a podtržítko.'),
  popis: z.string().trim().max(2000).optional(),
})

/** POST /api/verze – nová verze jako kopie existující (zmrazeno = false). */
export async function vytvor(p: Pozadavek): Promise<Odpoved> {
  const v = NovaVerze.parse(p.body)
  await nactiVerzeInfo(v.z)
  const sql = db()
  const exist = await sql.query('SELECT 1 FROM verze_dat WHERE id = $1', [v.id])
  if (exist.length) throw new HttpChyba(409, `Verze ${v.id} už existuje.`)

  // Posuny ID pro kopírované řádky se sériovým klíčem; vazby mezi nimi se zachovají.
  const [o] = await sql.query(`SELECT
    (SELECT coalesce(max(id),0) FROM fond) AS fond, (SELECT coalesce(max(id),0) FROM castka) AS castka,
    (SELECT coalesce(max(id),0) FROM ucast) AS ucast, (SELECT coalesce(max(id),0) FROM udalost) AS udalost`)
  const of = Number(o.fond), oc = Number(o.castka), ou = Number(o.ucast), oud = Number(o.udalost)
  const SPRAVCE_SLOUPCE = `id, nazev, dalsi_nazvy, kategorie, typ_osoby, skupina_relevance, ico, lei, zeme, sektory, faze, stav_aktivity, stupen,
    poznamka_stupne, subjekt_text, skupina_text, investice_text, datum_zdroj_text, fond_text, tiket_text, stav_text,
    ma_primarni_doklad_24m, je_skutecny_investor_predbezne, tiket_deklarovany, fond_s_typem_a_datem, fond_castka_uvedena,
    kontrolni_negativni_pripad, opravy_7_2, datum_kontroly, namitka_gdpr`

  await sql.transaction([
    sql.query(
      `INSERT INTO verze_dat (id, stav_k, zmrazeno, popis, zdrojova_verze) SELECT $1, stav_k, false, $2, id FROM verze_dat WHERE id = $3`,
      [v.id, v.popis ?? `Kopie verze ${v.z}`, v.z],
    ),
    sql.query(`INSERT INTO spravce (verze_id, ${SPRAVCE_SLOUPCE}) SELECT $1, ${SPRAVCE_SLOUPCE} FROM spravce WHERE verze_id = $2`, [v.id, v.z]),
    sql.query(
      `INSERT INTO kolo (verze_id, id, firma, zeme_firmy, ico_firmy, kolo, castka_kola, mena, castka_text, datum_udalosti, datum_publikace, poznamka)
       SELECT $1, id, firma, zeme_firmy, ico_firmy, kolo, castka_kola, mena, castka_text, datum_udalosti, datum_publikace, poznamka FROM kolo WHERE verze_id = $2`,
      [v.id, v.z],
    ),
    sql.query(`INSERT INTO fond (id, verze_id, spravce_id, nazev, poznamka) SELECT id + $3, $1, spravce_id, nazev, poznamka FROM fond WHERE verze_id = $2`, [v.id, v.z, of]),
    sql.query(
      `INSERT INTO castka (id, verze_id, spravce_id, fond_id, druh_castky, text, min, max, mena, typ_castky, rozhodne_datum, stav_hodnoty, stupen_pole, poznamka)
       SELECT id + $3, $1, spravce_id, fond_id + $4, druh_castky, text, min, max, mena, typ_castky, rozhodne_datum, stav_hodnoty, stupen_pole, poznamka
       FROM castka WHERE verze_id = $2`,
      [v.id, v.z, oc, of],
    ),
    sql.query(
      `INSERT INTO ucast (id, verze_id, spravce_id, kolo_id, role, podil_castka, podil_stav, primarni_doklad, zdroj_text, datum_publikace, poznamka)
       SELECT id + $3, $1, spravce_id, kolo_id, role, podil_castka, podil_stav, primarni_doklad, zdroj_text, datum_publikace, poznamka FROM ucast WHERE verze_id = $2`,
      [v.id, v.z, ou],
    ),
    sql.query(
      `INSERT INTO udalost (id, verze_id, spravce_id, typ_udalosti, firma, castka, mena, datum_udalosti, datum_publikace, primarni_doklad, zdroj_text, poznamka)
       SELECT id + $3, $1, spravce_id, typ_udalosti, firma, castka, mena, datum_udalosti, datum_publikace, primarni_doklad, zdroj_text, poznamka FROM udalost WHERE verze_id = $2`,
      [v.id, v.z, oud],
    ),
    sql.query(
      `INSERT INTO doklad (verze_id, ucast_id, kolo_verze_id, kolo_id, udalost_id, castka_id, spravce_id, zdroj_cislo, zdroj_text, url,
         uroven_zdroje, datum_udalosti, datum_publikace, datum_kontroly, nezavislost_skupina)
       SELECT $1, ucast_id + $3, CASE WHEN kolo_id IS NULL THEN NULL ELSE $1 END, kolo_id, udalost_id + $4, castka_id + $5, spravce_id,
         zdroj_cislo, zdroj_text, url, uroven_zdroje, datum_udalosti, datum_publikace, datum_kontroly, nezavislost_skupina
       FROM doklad WHERE verze_id = $2 ORDER BY id`,
      [v.id, v.z, ou, oud, oc],
    ),
    sql.query(`SELECT setval('fond_id_seq', (SELECT max(id) FROM fond))`),
    sql.query(`SELECT setval('castka_id_seq', (SELECT max(id) FROM castka))`),
    sql.query(`SELECT setval('ucast_id_seq', (SELECT max(id) FROM ucast))`),
    sql.query(`SELECT setval('udalost_id_seq', (SELECT max(id) FROM udalost))`),
  ])
  return json(await nactiVerzeInfo(v.id), 201)
}

/** PUT /api/verze/:id/zmrazit – zmrazí verzi (další změny jen v nové verzi). */
export async function zmrazit(_p: Pozadavek, id: string): Promise<Odpoved> {
  const r = await db().query('UPDATE verze_dat SET zmrazeno = true WHERE id = $1 RETURNING id', [id])
  if (!r.length) throw new HttpChyba(404, `Verze ${id} neexistuje.`)
  return json(await nactiVerzeInfo(id))
}

/** GET /api/verze/:id/historie – historie změn verze. */
export async function historie(_p: Pozadavek, id: string): Promise<Odpoved> {
  const r = await db().query(
    `SELECT id, verze_z, verze_do, entita, entita_id, pole, stara_hodnota, nova_hodnota, duvod, autor, zmeneno::text
     FROM historie_zmen WHERE verze_do = $1 ORDER BY zmeneno DESC, id DESC`,
    [id],
  )
  const out: ZmenaHistorie[] = r.map((x) => ({
    id: Number(x.id),
    verze_z: String(x.verze_z),
    verze_do: String(x.verze_do),
    entita: String(x.entita),
    entita_id: String(x.entita_id),
    pole: String(x.pole),
    stara_hodnota: str(x.stara_hodnota),
    nova_hodnota: str(x.nova_hodnota),
    duvod: String(x.duvod),
    autor: String(x.autor),
    zmeneno: String(x.zmeneno),
  }))
  return json(out)
}
