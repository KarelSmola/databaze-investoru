import { db, num, str, type Radek } from './db.js'
import { HttpChyba } from './http.js'
import type { CastkaApi, Dataset, Doklad, FondApi, KoloApi, SpravceApi, UcastApi, UdalostApi, VerzeInfo } from '../shared/api.js'

export const VYCHOZI_VERZE = '1.1'

export function verzeInfo(r: Radek): VerzeInfo {
  return {
    id: String(r.id),
    stav_k: String(r.stav_k),
    zmrazeno: Boolean(r.zmrazeno),
    popis: str(r.popis),
    zdrojova_verze: str(r.zdrojova_verze),
    vytvoreno: String(r.vytvoreno),
  }
}

export async function nactiVerzeInfo(verze: string): Promise<VerzeInfo> {
  const rows = await db().query(
    'SELECT id, stav_k::text, zmrazeno, popis, zdrojova_verze, vytvoreno::text FROM verze_dat WHERE id = $1',
    [verze],
  )
  if (!rows.length) throw new HttpChyba(404, `Verze dat ${verze} neexistuje.`)
  return verzeInfo(rows[0])
}

function doklad(r: Radek): Doklad {
  return {
    id: Number(r.id),
    zdroj_cislo: num(r.zdroj_cislo),
    zdroj_text: str(r.zdroj_text),
    url: str(r.url),
    uroven_zdroje: num(r.uroven_zdroje),
    datum_udalosti: str(r.datum_udalosti),
    datum_publikace: str(r.datum_publikace),
    datum_kontroly: str(r.datum_kontroly),
    nezavislost_skupina: str(r.nezavislost_skupina),
  }
}

const cisla = (d: Doklad[]) => d.map((x) => x.zdroj_cislo).filter((x): x is number => x != null)

/** Načte celou verzi dat z Neonu jednou transakcí (7 dotazů, jeden HTTP požadavek). */
export async function nactiVerzi(verze: string): Promise<Dataset> {
  const sql = db()
  const [v, spravci, kola, ucasti, udalosti, fondy, castky, doklady] = await sql.transaction(
    [
      sql.query('SELECT id, stav_k::text, zmrazeno, popis, zdrojova_verze, vytvoreno::text FROM verze_dat WHERE id = $1', [verze]),
      sql.query(
        `SELECT id, nazev, dalsi_nazvy, kategorie, typ_osoby, skupina_relevance, ico, lei, zeme, sektory, faze,
                stav_aktivity, stupen, poznamka_stupne, subjekt_text, skupina_text, investice_text, datum_zdroj_text,
                fond_text, tiket_text, stav_text, ma_primarni_doklad_24m, je_skutecny_investor_predbezne, tiket_deklarovany,
                fond_s_typem_a_datem, fond_castka_uvedena, kontrolni_negativni_pripad, opravy_7_2,
                datum_kontroly::text, namitka_gdpr
         FROM spravce WHERE verze_id = $1 ORDER BY id`,
        [verze],
      ),
      sql.query(
        `SELECT id, firma, zeme_firmy, ico_firmy, kolo, castka_kola, mena, castka_text, datum_udalosti,
                datum_publikace::text, poznamka
         FROM kolo WHERE verze_id = $1 ORDER BY id`,
        [verze],
      ),
      sql.query(
        `SELECT id, spravce_id, kolo_id, role, podil_castka, podil_stav, primarni_doklad, zdroj_text,
                datum_publikace::text, poznamka
         FROM ucast WHERE verze_id = $1 ORDER BY id`,
        [verze],
      ),
      sql.query(
        `SELECT id, spravce_id, typ_udalosti, firma, castka, mena, datum_udalosti, datum_publikace::text,
                primarni_doklad, zdroj_text, poznamka
         FROM udalost WHERE verze_id = $1 ORDER BY id`,
        [verze],
      ),
      sql.query('SELECT id, spravce_id, nazev, poznamka FROM fond WHERE verze_id = $1 ORDER BY id', [verze]),
      sql.query(
        `SELECT id, spravce_id, fond_id, druh_castky, text, min, max, mena, typ_castky, rozhodne_datum,
                stav_hodnoty, stupen_pole, poznamka
         FROM castka WHERE verze_id = $1 ORDER BY id`,
        [verze],
      ),
      sql.query(
        `SELECT id, ucast_id, kolo_id, udalost_id, castka_id, spravce_id, zdroj_cislo, zdroj_text, url, uroven_zdroje,
                datum_udalosti, datum_publikace::text, datum_kontroly::text, nezavislost_skupina
         FROM doklad WHERE verze_id = $1 ORDER BY id`,
        [verze],
      ),
    ],
    { readOnly: true },
  )
  if (!v.length) throw new HttpChyba(404, `Verze dat ${verze} neexistuje.`)

  const dokladyDle = (klic: string) => {
    const m = new Map<string, Doklad[]>()
    for (const r of doklady) {
      if (r[klic] == null) continue
      const k = String(r[klic])
      if (!m.has(k)) m.set(k, [])
      m.get(k)!.push(doklad(r))
    }
    return (id: unknown) => m.get(String(id)) ?? []
  }
  const dUcast = dokladyDle('ucast_id')
  const dKolo = dokladyDle('kolo_id')
  const dUdalost = dokladyDle('udalost_id')
  const dCastka = dokladyDle('castka_id')
  const dSpravce = dokladyDle('spravce_id')

  const kolaApi: KoloApi[] = kola.map((r) => {
    const d = dKolo(r.id)
    return {
      id: String(r.id),
      firma: String(r.firma),
      zeme_firmy: str(r.zeme_firmy),
      ico_firmy: str(r.ico_firmy),
      kolo: str(r.kolo),
      castka_kola: num(r.castka_kola),
      mena: str(r.mena),
      castka_text: str(r.castka_text),
      datum_udalosti: str(r.datum_udalosti),
      datum_publikace: str(r.datum_publikace),
      poznamka: str(r.poznamka),
      zdroje: cisla(d),
      doklady: d,
    }
  })

  const castkaApi = (r: Radek): CastkaApi => {
    const d = dCastka(r.id)
    return {
      id: Number(r.id),
      text: str(r.text),
      min: num(r.min),
      max: num(r.max),
      mena: str(r.mena),
      typ_castky: str(r.typ_castky) as CastkaApi['typ_castky'],
      rozhodne_datum: str(r.rozhodne_datum),
      stav_hodnoty: String(r.stav_hodnoty) as CastkaApi['stav_hodnoty'],
      stupen_pole: str(r.stupen_pole) as CastkaApi['stupen_pole'],
      poznamka: str(r.poznamka),
      zdroje: cisla(d),
      doklady: d,
    }
  }

  const spravciApi: SpravceApi[] = spravci.map((r) => {
    const id = Number(r.id)
    const uc: UcastApi[] = ucasti
      .filter((u) => Number(u.spravce_id) === id)
      .map((u) => {
        const d = dUcast(u.id)
        return {
          id: Number(u.id),
          kolo_id: String(u.kolo_id),
          role: str(u.role) as UcastApi['role'],
          podil_castka: num(u.podil_castka),
          podil_stav: String(u.podil_stav),
          primarni_doklad: Boolean(u.primarni_doklad),
          zdroj_text: String(u.zdroj_text),
          datum_publikace: str(u.datum_publikace),
          poznamka: str(u.poznamka),
          zdroje: cisla(d),
          doklady: d,
        }
      })
    const ud: UdalostApi[] = udalosti
      .filter((u) => Number(u.spravce_id) === id)
      .map((u) => {
        const d = dUdalost(u.id)
        return {
          id: Number(u.id),
          typ_udalosti: String(u.typ_udalosti) as UdalostApi['typ_udalosti'],
          firma: str(u.firma),
          castka: num(u.castka),
          mena: str(u.mena),
          datum_udalosti: str(u.datum_udalosti),
          datum_publikace: str(u.datum_publikace),
          primarni_doklad: Boolean(u.primarni_doklad),
          zdroj_text: str(u.zdroj_text),
          poznamka: str(u.poznamka),
          zdroje: cisla(d),
          doklady: d,
        }
      })
    const fo: FondApi[] = fondy
      .filter((f) => Number(f.spravce_id) === id)
      .map((f) => ({
        id: Number(f.id),
        nazev: str(f.nazev),
        poznamka: str(f.poznamka),
        hodnoty: castky.filter((c) => c.druh_castky === 'fond' && Number(c.fond_id) === Number(f.id)).map(castkaApi),
      }))
    const tiketRadek = castky.find((c) => c.druh_castky === 'tiket' && Number(c.spravce_id) === id)
    const tiket: CastkaApi = tiketRadek
      ? castkaApi(tiketRadek)
      : { id: 0, text: null, min: null, max: null, mena: null, typ_castky: null, rozhodne_datum: null, stav_hodnoty: 'neuvedeno', stupen_pole: null, poznamka: null, zdroje: [], doklady: [] }
    return {
      id,
      nazev: String(r.nazev),
      dalsi_nazvy: (r.dalsi_nazvy as string[]) ?? [],
      kategorie: r.kategorie as SpravceApi['kategorie'],
      typ_osoby: r.typ_osoby as SpravceApi['typ_osoby'],
      skupina_relevance: str(r.skupina_relevance) as SpravceApi['skupina_relevance'],
      ico: str(r.ico),
      lei: str(r.lei),
      zeme: str(r.zeme),
      sektory: (r.sektory as string[]) ?? [],
      faze: (r.faze as string[]) ?? [],
      stav_aktivity: r.stav_aktivity as SpravceApi['stav_aktivity'],
      stupen: str(r.stupen) as SpravceApi['stupen'],
      poznamka_stupne: str(r.poznamka_stupne),
      subjekt_text: String(r.subjekt_text),
      skupina_text: String(r.skupina_text),
      investice_text: String(r.investice_text),
      datum_zdroj_text: String(r.datum_zdroj_text),
      fond_text: String(r.fond_text),
      tiket_text: String(r.tiket_text),
      stav_text: String(r.stav_text),
      ma_primarni_doklad_24m: Boolean(r.ma_primarni_doklad_24m),
      je_skutecny_investor_predbezne: r.je_skutecny_investor_predbezne == null ? null : Boolean(r.je_skutecny_investor_predbezne),
      tiket_deklarovany: Boolean(r.tiket_deklarovany),
      fond_s_typem_a_datem: r.fond_s_typem_a_datem == null ? null : Boolean(r.fond_s_typem_a_datem),
      fond_castka_uvedena: r.fond_castka_uvedena == null ? null : Boolean(r.fond_castka_uvedena),
      kontrolni_negativni_pripad: Boolean(r.kontrolni_negativni_pripad),
      opravy_7_2: (r.opravy_7_2 as string[]) ?? [],
      datum_kontroly: str(r.datum_kontroly),
      namitka_gdpr: r.namitka_gdpr == null ? null : Boolean(r.namitka_gdpr),
      ucasti: uc,
      udalosti: ud,
      fondy: fo,
      tiket,
      doklady_zaznamu: dSpravce(id),
    }
  })

  return { verze: verzeInfo(v[0]), kola: kolaApi, spravci: spravciApi }
}

export async function overNezmrazeno(verze: string): Promise<VerzeInfo> {
  const info = await nactiVerzeInfo(verze)
  if (info.zmrazeno) throw new HttpChyba(409, `Verze ${verze} je zmrazená a nelze ji měnit. Vytvořte novou verzi.`)
  return info
}
