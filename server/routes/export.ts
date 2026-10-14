import { nactiVerzi, VYCHOZI_VERZE } from '../data.js'
import { HttpChyba, type Odpoved, type Pozadavek } from '../http.js'
import { parsujFiltr } from './spravci.js'
import { csv } from '../csv.js'
import { filtruj } from '../../shared/filtry.js'
import { naPilotData } from '../../shared/api.js'
import { KATEGORIE, STAV_AKTIVITY } from '../../shared/ciselniky.js'

/** GET /api/export?format=csv|json&verze= (+ filtry FR-11) – export celého datasetu nebo výběru (FR-16). */
export async function exportDat(p: Pozadavek): Promise<Odpoved> {
  const format = p.query.format ?? 'json'
  if (format !== 'json' && format !== 'csv') throw new HttpChyba(400, 'Formát musí být csv nebo json.')
  const d = await nactiVerzi(p.query.verze ?? VYCHOZI_VERZE)
  const vyber = filtruj(d.spravci, d.kola, parsujFiltr(p.query))
  const ids = new Set(vyber.map((s) => s.id))
  const filtrovano = ids.size !== d.spravci.length
  const kolaIds = new Set(vyber.flatMap((s) => s.ucasti.map((u) => u.kolo_id)))
  const dataset = { ...d, spravci: vyber, kola: filtrovano ? d.kola.filter((k) => kolaIds.has(k.id)) : d.kola }
  const soubor = `databaze_investoru_v${d.verze.id}${filtrovano ? '_vyber' : ''}`

  if (format === 'json') {
    return {
      status: 200,
      text: JSON.stringify(naPilotData(dataset), null, 1),
      headers: { 'content-type': 'application/json; charset=utf-8', 'content-disposition': `attachment; filename="${soubor}.json"` },
    }
  }
  const firma = new Map(d.kola.map((k) => [k.id, k]))
  const radky = vyber.map((s) => ({
    '#': s.id,
    Subjekt: s.subjekt_text,
    'Sk.': s.skupina_text,
    'Doložená investice (firma, kolo, kolo celkem)': s.investice_text,
    'Datum / zdroj': s.datum_zdroj_text,
    'Fond (typ, datum)': s.fond_text,
    'Tiket (deklarovaný)': s.tiket_text,
    Stav: s.stav_text,
    Kategorie: KATEGORIE[s.kategorie],
    'Skupina relevance': s.skupina_relevance ?? '',
    'Stav aktivity': STAV_AKTIVITY[s.stav_aktivity],
    Stupeň: s.stupen ?? '',
    'Poznámka ke stupni': s.poznamka_stupne ?? '',
    'Kola (ID)': s.ucasti.map((u) => u.kolo_id),
    'Financované firmy': s.ucasti.map((u) => firma.get(u.kolo_id)?.firma ?? u.kolo_id),
    'Primární doklad ≤24 m': s.ma_primarni_doklad_24m ? 'ano' : 'ne',
    'Deklarovaný tiket': s.tiket_deklarovany ? 'ano' : 'ne',
    'Fond s typem a datem': s.fond_s_typem_a_datem == null ? '' : s.fond_s_typem_a_datem ? 'ano' : 'ne',
    'Částka fondu uvedena': s.fond_castka_uvedena == null ? '' : s.fond_castka_uvedena ? 'ano' : 'ne',
    Zdroje: [...new Set([...s.ucasti.flatMap((u) => u.zdroje), ...s.fondy.flatMap((f) => f.hodnoty.flatMap((h) => h.zdroje)), ...s.tiket.zdroje])],
  }))
  return {
    status: 200,
    text: csv(radky),
    headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="${soubor}.csv"` },
  }
}
