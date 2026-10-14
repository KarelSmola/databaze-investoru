import { readFileSync } from 'node:fs'
import { Pool, type PoolClient } from '@neondatabase/serverless'
import { connectionString } from './env.js'
import type { CastkaData, PilotData, Zdroj } from '../shared/typy.js'

/**
 * Seed dat pilotu (sekce 6.4). Idempotentní: v transakci smaže a znovu vloží data verze.
 * Použití: npm run db:seed [-- cesta/k/pilot.json] [--force]
 *   --force  smaže i hodnocení kontrolora navázaná na verzi (jinak seed odmítne pokračovat).
 */

const args = process.argv.slice(2)
const force = args.includes('--force')
const cesta = args.find((a) => !a.startsWith('--')) ?? 'data/pilot_v1.1.json'
const pilot = JSON.parse(readFileSync(cesta, 'utf8')) as PilotData
const zdroje = JSON.parse(readFileSync('data/zdroje.json', 'utf8')) as Zdroj[]

/** Úroveň zdroje podle sekce 6.4 bod 5; nejasné zdroje zůstávají null pro kontrolora (O-5). */
const UROVEN: Record<number, 1 | 2 | 3 | 4> = {
  // 1 úřední registr
  1: 1, 2: 1,
  // 2 samodeklarace (weby a tiskové zprávy investorů, CVCA, EIF, NRB, ministerstva)
  5: 2, 6: 2, 8: 2, 9: 2, 10: 2, 11: 2, 16: 2, 17: 2, 24: 2, 26: 2, 49: 2, 54: 2, 57: 2,
  // 3 redakční zpracování (média)
  3: 3, 4: 3, 7: 3, 12: 3, 13: 3, 15: 3, 18: 3, 19: 3, 20: 3, 21: 3, 22: 3, 29: 3, 30: 3, 31: 3,
  33: 3, 34: 3, 35: 3, 36: 3, 37: 3, 38: 3, 39: 3, 40: 3, 41: 3, 42: 3, 43: 3, 44: 3, 45: 3,
  46: 3, 47: 3, 48: 3, 50: 3, 51: 3, 52: 3, 55: 3, 58: 3, 59: 3, 63: 3, 64: 3, 65: 3, 66: 3,
  67: 3, 68: 3,
  // 4 agregátor
  27: 4, 32: 4,
}

/** Citace téže tiskové zprávy se počítají jako jeden zdroj (kap. 5). */
const NEZAVISLOST: Record<number, string> = {
  16: 'TZ Rockaway ValkaAI 24. 2. 2026',
  17: 'TZ Rockaway ValkaAI 24. 2. 2026',
}

const pool = new Pool({ connectionString: connectionString() })
const c = await pool.connect()

async function vlozDoklady(
  cil: { ucast_id?: number; kolo_id?: string; udalost_id?: number; castka_id?: number; spravce_id?: number },
  cisla: number[],
  zdroj_text: string | null,
  datum_udalosti: string | null,
  datum_publikace: string | null,
) {
  for (const cislo of cisla) {
    await c.query(
      `INSERT INTO doklad (verze_id, ucast_id, kolo_verze_id, kolo_id, udalost_id, castka_id, spravce_id,
         zdroj_cislo, zdroj_text, url, uroven_zdroje, datum_udalosti, datum_publikace, datum_kontroly, nezavislost_skupina)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NULL,$14)`,
      [
        pilot.verze,
        cil.ucast_id ?? null,
        cil.kolo_id ? pilot.verze : null,
        cil.kolo_id ?? null,
        cil.udalost_id ?? null,
        cil.castka_id ?? null,
        cil.spravce_id ?? null,
        cislo,
        zdroj_text,
        zdroje.find((z) => z.cislo === cislo)?.url ?? null,
        UROVEN[cislo] ?? null,
        datum_udalosti,
        datum_publikace,
        NEZAVISLOST[cislo] ?? null,
      ],
    )
  }
}

async function vlozCastku(spravce_id: number, fond_id: number | null, druh: 'tiket' | 'fond', h: CastkaData) {
  const r = await c.query<{ id: number }>(
    `INSERT INTO castka (verze_id, spravce_id, fond_id, druh_castky, text, min, max, mena, typ_castky,
       rozhodne_datum, stav_hodnoty, stupen_pole, poznamka)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
    [pilot.verze, spravce_id, fond_id, druh, h.text, h.min, h.max, h.mena, h.typ_castky, h.rozhodne_datum, h.stav_hodnoty, h.stupen_pole, h.poznamka ?? null],
  )
  await vlozDoklady({ castka_id: r.rows[0].id }, h.zdroje, null, null, null)
}

async function smazVerzi(cl: PoolClient, verze: string) {
  const hodnoceni = await cl.query<{ n: string }>('SELECT count(*)::text AS n FROM hodnoceni_kontrolora WHERE verze_id = $1', [verze])
  if (Number(hodnoceni.rows[0].n) > 0) {
    if (!force) throw new Error(`Verze ${verze} má ${hodnoceni.rows[0].n} hodnocení kontrolora. Seed je nepřepíše; použijte --force.`)
    await cl.query('DELETE FROM hodnoceni_kontrolora WHERE verze_id = $1', [verze])
  }
  await cl.query('DELETE FROM doklad WHERE verze_id = $1', [verze])
  await cl.query('DELETE FROM castka WHERE verze_id = $1', [verze])
  await cl.query('DELETE FROM fond WHERE verze_id = $1', [verze])
  await cl.query('DELETE FROM udalost WHERE verze_id = $1', [verze])
  await cl.query('DELETE FROM ucast WHERE verze_id = $1', [verze])
  await cl.query('DELETE FROM kolo WHERE verze_id = $1', [verze])
  await cl.query('DELETE FROM spravce WHERE verze_id = $1', [verze])
}

try {
  await c.query('BEGIN')

  // 1. Verze dat
  await c.query(
    `INSERT INTO verze_dat (id, stav_k, zmrazeno, popis) VALUES ($1, $2, true, $3)
     ON CONFLICT (id) DO UPDATE SET stav_k = EXCLUDED.stav_k, popis = EXCLUDED.popis`,
    [pilot.verze, pilot.stav_k, `Pilot ${pilot.verze}, stav k ${pilot.stav_k}. ${pilot.opravy_13_10_2026 ?? ''}`.trim()],
  )
  // Seed zapisuje i do zmrazené verze – zmrazení chrání data před zápisem přes API.
  await smazVerzi(c, pilot.verze)

  // 2. Zdroje 1–68 (upsert, mohou na ně odkazovat i jiné verze)
  for (const z of zdroje) {
    await c.query(
      `INSERT INTO zdroj (cislo, titulek, url) VALUES ($1,$2,$3)
       ON CONFLICT (cislo) DO UPDATE SET titulek = EXCLUDED.titulek, url = EXCLUDED.url`,
      [z.cislo, z.titulek, z.url],
    )
  }

  // 3. Kola a jejich doklady
  for (const k of pilot.kola) {
    await c.query(
      `INSERT INTO kolo (verze_id, id, firma, zeme_firmy, ico_firmy, kolo, castka_kola, mena, castka_text, datum_udalosti, datum_publikace, poznamka)
       VALUES ($1,$2,$3,$4,NULL,$5,$6,$7,$8,NULL,$9,$10)`,
      [pilot.verze, k.id, k.firma, k.zeme_firmy, k.kolo, k.castka_kola, k.mena, k.castka_text, k.datum_publikace, k.poznamka],
    )
    await vlozDoklady({ kolo_id: k.id }, k.zdroje, null, null, k.datum_publikace)
  }

  // 4. Správci, účasti, události, fondy, tiket, doklady
  for (const s of pilot.spravci) {
    await c.query(
      `INSERT INTO spravce (verze_id, id, nazev, dalsi_nazvy, kategorie, typ_osoby, skupina_relevance, ico, lei, zeme,
         sektory, faze, stav_aktivity, stupen, poznamka_stupne,
         subjekt_text, skupina_text, investice_text, datum_zdroj_text, fond_text, tiket_text, stav_text,
         ma_primarni_doklad_24m, je_skutecny_investor_predbezne, tiket_deklarovany, fond_s_typem_a_datem, fond_castka_uvedena,
         kontrolni_negativni_pripad, opravy_7_2, datum_kontroly, namitka_gdpr)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,NULL,NULL)`,
      [
        pilot.verze, s.id, s.nazev, s.dalsi_nazvy, s.kategorie, s.typ_osoby, s.skupina_relevance,
        s.ico ?? null, s.lei ?? null, s.zeme ?? null, s.sektory ?? [], s.faze ?? [],
        s.stav_aktivity, s.stupen, s.poznamka_stupne,
        s.subjekt_text, s.skupina_text, s.investice_text, s.datum_zdroj_text, s.fond_text, s.tiket_text, s.stav_text,
        s.ma_primarni_doklad_24m, s.je_skutecny_investor_predbezne, s.tiket_deklarovany, s.fond_s_typem_a_datem, s.fond_castka_uvedena,
        s.kontrolni_negativni_pripad, s.opravy_7_2,
      ],
    )
    for (const u of s.ucasti) {
      const r = await c.query<{ id: number }>(
        `INSERT INTO ucast (verze_id, spravce_id, kolo_id, role, podil_castka, podil_stav, primarni_doklad, zdroj_text, datum_publikace, poznamka)
         VALUES ($1,$2,$3,$4,NULL,$5,$6,$7,$8,$9) RETURNING id`,
        [pilot.verze, s.id, u.kolo_id, u.role, u.podil_stav, u.primarni_doklad, u.zdroj_text, u.datum_publikace, u.poznamka ?? null],
      )
      await vlozDoklady({ ucast_id: r.rows[0].id }, u.zdroje, u.zdroj_text, null, u.datum_publikace)
    }
    for (const u of s.udalosti) {
      const r = await c.query<{ id: number }>(
        `INSERT INTO udalost (verze_id, spravce_id, typ_udalosti, firma, castka, mena, datum_udalosti, datum_publikace, primarni_doklad, zdroj_text, poznamka)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
        [pilot.verze, s.id, u.typ_udalosti, u.firma ?? null, u.castka ?? null, u.mena ?? null, u.datum_udalosti ?? null, u.datum_publikace ?? null, u.primarni_doklad, u.zdroj_text, u.poznamka ?? null],
      )
      await vlozDoklady({ udalost_id: r.rows[0].id }, u.zdroje, u.zdroj_text, u.datum_udalosti ?? null, u.datum_publikace ?? null)
    }
    for (const f of s.fondy) {
      const r = await c.query<{ id: number }>(
        'INSERT INTO fond (verze_id, spravce_id, nazev, poznamka) VALUES ($1,$2,$3,$4) RETURNING id',
        [pilot.verze, s.id, f.nazev, f.poznamka ?? null],
      )
      for (const h of f.hodnoty) await vlozCastku(s.id, r.rows[0].id, 'fond', h)
    }
    await vlozCastku(s.id, null, 'tiket', s.tiket)
    if (s.zdroje_zaznamu?.length) await vlozDoklady({ spravce_id: s.id }, s.zdroje_zaznamu, null, null, null)
  }

  await c.query('COMMIT')
  console.log(`Seed verze ${pilot.verze}: ${pilot.spravci.length} správců, ${pilot.kola.length} kol, ${zdroje.length} zdrojů.`)
} catch (e) {
  await c.query('ROLLBACK')
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
} finally {
  c.release()
  await pool.end()
}
