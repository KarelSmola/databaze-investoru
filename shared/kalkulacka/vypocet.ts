import { klonuj, SCENARE, type ParametryKalkulacky, type Scenar } from './parametry.js'

export interface VysledekPilot {
  analytik_kc: number
  kontrolor_kc: number
  metodik_kc: number
  hodiny: number
  mezisoucet: number
  rezerva: number
  celkem: number
}

export interface VysledekCR {
  overeni_h: number
  hodiny: number
  mezisoucet: number
  rezerva: number
  celkem: number
  eur: number
  udrzba_min: number
  udrzba_max: number
  ai_uspora_kc: number
}

export interface Polozky {
  analyt_h: number
  analyt_kc: number
  ing_h: number
  ing_kc: number
  rizeni_h: number
  rizeni_kc: number
  pravo_kc: number
  infra_kc: number
  llm_kc: number
  mezisoucet: number
  rezerva: number
  celkem: number
  eur: number
  udrzba_min: number
  udrzba_max: number
  podil_analytiky: number
  podil_inzenyrstvi: number
}

export interface VysledekBezAI extends Polozky {
  rucni_h: number
  lok_h: number
  qa_h: number
  rucni_na_zaznam: number
}

export interface VysledekAI extends Polozky {
  vyjimky: number
  vyjimky_h: number
  auto_prijate: number
  audit_zaznamy: number
  audit_h: number
  rucni_h: number
  rucni_na_zaznam: number
  lok_h: number
  qa_h: number
}

export interface Srovnani {
  bezAI: number
  sAI: number
  uspora: number
  uspora_podil: number
  analyt_h_bezAI: number
  analyt_h_sAI: number
}

export function vypocetPilot(p: ParametryKalkulacky): VysledekPilot {
  const s = p.sazby.analytik
  const analytik_kc = p.pilot.analytik_h * s
  const kontrolor_kc = p.pilot.kontrolor_h * s
  const metodik_kc = p.pilot.metodik_h * s
  const mezisoucet = analytik_kc + kontrolor_kc + metodik_kc
  const rezerva = mezisoucet * p.pilot.rezerva
  return {
    analytik_kc,
    kontrolor_kc,
    metodik_kc,
    hodiny: p.pilot.analytik_h + p.pilot.kontrolor_h + p.pilot.metodik_h,
    mezisoucet,
    rezerva,
    celkem: mezisoucet + rezerva,
  }
}

export function vypocetCR(p: ParametryKalkulacky): VysledekCR {
  const c = p.cr
  const overeni_h = c.zaznamy * c.h_na_zaznam
  const hodiny = overeni_h + c.hledani_h + c.kontrola_h + c.metodika_h + c.rizeni_h
  const mezisoucet = hodiny * p.sazby.analytik
  const rezerva = mezisoucet * c.rezerva
  const celkem = mezisoucet + rezerva
  return {
    overeni_h,
    hodiny,
    mezisoucet,
    rezerva,
    celkem,
    eur: celkem / p.kurz,
    udrzba_min: celkem * c.udrzba_min,
    udrzba_max: celkem * c.udrzba_max,
    // Úspora ruční práce AI pipeline v ČR: 300 × 0,5 h × sazba analytika (kap. 8).
    ai_uspora_kc: c.zaznamy * 0.5 * p.sazby.analytik,
  }
}

function polozky(
  p: ParametryKalkulacky,
  scenar: Scenar,
  analyt_h: number,
  ing_h: number,
  llm_kc: number,
): Polozky {
  const b = p.bezAI[scenar]
  const analyt_kc = analyt_h * p.sazby.analytik
  const ing_kc = ing_h * p.sazby.inzenyr
  const rizeni_kc = b.rizeni_h * p.sazby.rizeni
  const mezisoucet = analyt_kc + ing_kc + rizeni_kc + b.pravo_kc + b.infra_llm_data_kc + llm_kc
  const rezerva = mezisoucet * b.rezerva
  const celkem = mezisoucet + rezerva
  return {
    analyt_h,
    analyt_kc,
    ing_h,
    ing_kc,
    rizeni_h: b.rizeni_h,
    rizeni_kc,
    pravo_kc: b.pravo_kc,
    infra_kc: b.infra_llm_data_kc,
    llm_kc,
    mezisoucet,
    rezerva,
    celkem,
    eur: celkem / p.kurz,
    udrzba_min: celkem * b.udrzba_min,
    udrzba_max: celkem * b.udrzba_max,
    podil_analytiky: mezisoucet > 0 ? analyt_kc / mezisoucet : 0,
    podil_inzenyrstvi: mezisoucet > 0 ? ing_kc / mezisoucet : 0,
  }
}

/** Kap. 9.3: kombinovaný model bez AI triáže. */
export function vypocetBezAI(p: ParametryKalkulacky, scenar: Scenar): VysledekBezAI {
  const b = p.bezAI[scenar]
  const rucni_h = b.N * b.h_overeni
  const lok_h = b.N * b.lok_podil * b.h_lok
  const qa_h = b.N * b.qa_podil * b.h_qa
  const analyt_h = rucni_h + lok_h + qa_h
  return {
    ...polozky(p, scenar, analyt_h, b.ing_h, 0),
    rucni_h,
    lok_h,
    qa_h,
    rucni_na_zaznam: b.N > 0 ? rucni_h / b.N : 0,
  }
}

/** Kap. 9.4: varianta s AI jako první linií ověřování. */
export function vypocetAI(p: ParametryKalkulacky, scenar: Scenar): VysledekAI {
  const b = p.bezAI[scenar]
  const a = p.sAI[scenar]
  const vyjimky = b.N * (1 - a.auto_podil)
  const vyjimky_h = vyjimky * a.h_vyjimka
  const auto_prijate = b.N * a.auto_podil
  const audit_zaznamy = auto_prijate * a.audit_podil
  const audit_h = audit_zaznamy * a.h_audit
  const rucni_h = vyjimky_h + audit_h
  const lok_h = vyjimky * a.lok_podil_vyjimek * a.h_lok
  const qa_h = b.N * b.qa_podil * b.h_qa
  const analyt_h = rucni_h + lok_h + qa_h
  const llm_kc = b.N * a.llm_kc_na_zaznam
  return {
    ...polozky(p, scenar, analyt_h, b.ing_h + a.ing_navic_h, llm_kc),
    vyjimky,
    vyjimky_h,
    auto_prijate,
    audit_zaznamy,
    audit_h,
    rucni_h,
    rucni_na_zaznam: b.N > 0 ? rucni_h / b.N : 0,
    lok_h,
    qa_h,
  }
}

/** Kap. 9.4.4: srovnání modelů. */
export function srovnani(p: ParametryKalkulacky, scenar: Scenar): Srovnani {
  const x = vypocetBezAI(p, scenar)
  const y = vypocetAI(p, scenar)
  const uspora = x.celkem - y.celkem
  return {
    bezAI: x.celkem,
    sAI: y.celkem,
    uspora,
    uspora_podil: x.celkem > 0 ? uspora / x.celkem : 0,
    analyt_h_bezAI: x.analyt_h,
    analyt_h_sAI: y.analyt_h,
  }
}

export function vypocetVse(p: ParametryKalkulacky) {
  return {
    pilot: vypocetPilot(p),
    cr: vypocetCR(p),
    bezAI: Object.fromEntries(SCENARE.map((s) => [s, vypocetBezAI(p, s)])) as Record<Scenar, VysledekBezAI>,
    sAI: Object.fromEntries(SCENARE.map((s) => [s, vypocetAI(p, s)])) as Record<Scenar, VysledekAI>,
    srovnani: Object.fromEntries(SCENARE.map((s) => [s, srovnani(p, s)])) as Record<Scenar, Srovnani>,
  }
}

/** Předdefinované citlivosti (kap. 9.3 a 9.4.5), vždy realistický scénář. */
export interface Citlivost {
  id: string
  nazev: string
  kapitola: '9.3' | '9.4.5'
  model: 'bezAI' | 'sAI'
  popis: string
  uprav: (p: ParametryKalkulacky) => ParametryKalkulacky
}

function s(p: ParametryKalkulacky, f: (q: ParametryKalkulacky) => void): ParametryKalkulacky {
  const q = klonuj(p)
  f(q)
  return q
}

export const CITLIVOSTI: Citlivost[] = [
  {
    id: 'c93_075',
    nazev: 'Ruční ověření 0,75 h na záznam',
    kapitola: '9.3',
    model: 'bezAI',
    popis: 'Automatizace nesníží ruční práci pod 0,75 h na záznam.',
    uprav: (p) => s(p, (q) => (q.bezAI.realisticky.h_overeni = 0.75)),
  },
  {
    id: 'c945_auto50',
    nazev: 'AI odbaví jen 50 % záznamů',
    kapitola: '9.4.5',
    model: 'sAI',
    popis: 'Podíl automaticky přijatých záznamů klesne na 50 %.',
    uprav: (p) => s(p, (q) => (q.sAI.realisticky.auto_podil = 0.5)),
  },
  {
    id: 'c945_llm150',
    nazev: 'LLM 3× dražší (150 Kč/záznam)',
    kapitola: '9.4.5',
    model: 'sAI',
    popis: 'Náklad LLM 150 Kč na záznam místo 50 Kč.',
    uprav: (p) => s(p, (q) => (q.sAI.realisticky.llm_kc_na_zaznam = 150)),
  },
  {
    id: 'c945_obojí',
    nazev: 'Obojí současně',
    kapitola: '9.4.5',
    model: 'sAI',
    popis: 'AI odbaví 50 % záznamů a LLM stojí 150 Kč na záznam.',
    uprav: (p) =>
      s(p, (q) => {
        q.sAI.realisticky.auto_podil = 0.5
        q.sAI.realisticky.llm_kc_na_zaznam = 150
      }),
  },
  {
    id: 'c945_audit',
    nazev: 'Audit ukáže chybovost >5 %',
    kapitola: '9.4.5',
    model: 'sAI',
    popis: 'Triáž se zpřísní a podíl automaticky přijatých klesne; dopad odpovídá zhruba variantě „AI odbaví jen 50 %“.',
    uprav: (p) => s(p, (q) => (q.sAI.realisticky.auto_podil = 0.5)),
  },
]
