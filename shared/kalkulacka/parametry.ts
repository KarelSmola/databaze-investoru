/** Parametry kalkulačky nákladů (sekce 8.5; kap. 8, 9.3, 9.4). Výchozí hodnoty reprodukují čísla dokumentu. */

export type Scenar = 'minimalni' | 'realisticky' | 'plny'
export const SCENARE: Scenar[] = ['minimalni', 'realisticky', 'plny']
export const SCENAR_NAZEV: Record<Scenar, string> = {
  minimalni: 'Minimální',
  realisticky: 'Realistický',
  plny: 'Plný',
}

export interface Sazby {
  analytik: number
  inzenyr: number
  rizeni: number
}

export interface ParametryPilot {
  analytik_h: number
  kontrolor_h: number
  metodik_h: number
  rezerva: number
}

export interface ParametryCR {
  zaznamy: number
  h_na_zaznam: number
  hledani_h: number
  kontrola_h: number
  metodika_h: number
  rizeni_h: number
  rezerva: number
  udrzba_min: number
  udrzba_max: number
}

/** Model bez AI triáže (kap. 9.3). Společné položky využívá i model 9.4. */
export interface ParametryBezAI {
  N: number
  h_overeni: number
  lok_podil: number
  h_lok: number
  qa_podil: number
  h_qa: number
  ing_h: number
  rizeni_h: number
  pravo_kc: number
  infra_llm_data_kc: number
  rezerva: number
  udrzba_min: number
  udrzba_max: number
}

/** Model s AI triáží (kap. 9.4). N, QA, řízení, právo, infrastruktura, rezerva a údržba přebírá z 9.3. */
export interface ParametryAI {
  auto_podil: number
  h_vyjimka: number
  audit_podil: number
  h_audit: number
  lok_podil_vyjimek: number
  h_lok: number
  llm_kc_na_zaznam: number
  ing_navic_h: number
}

export interface ParametryKalkulacky {
  kurz: number
  sazby: Sazby
  pilot: ParametryPilot
  cr: ParametryCR
  bezAI: Record<Scenar, ParametryBezAI>
  sAI: Record<Scenar, ParametryAI>
}

const spolecne = { h_lok: 0.15, h_qa: 0.5, rezerva: 0.15, udrzba_min: 0.25, udrzba_max: 0.35 }

export const VYCHOZI_PARAMETRY: ParametryKalkulacky = {
  kurz: 25,
  sazby: { analytik: 800, inzenyr: 1500, rizeni: 1200 },
  pilot: { analytik_h: 40, kontrolor_h: 12, metodik_h: 8, rezerva: 0.2 },
  cr: {
    zaznamy: 300,
    h_na_zaznam: 0.8,
    hledani_h: 60,
    kontrola_h: 30,
    metodika_h: 30,
    rizeni_h: 30,
    rezerva: 0.2,
    udrzba_min: 0.3,
    udrzba_max: 0.4,
  },
  bezAI: {
    minimalni: { ...spolecne, N: 15000, h_overeni: 0.35, lok_podil: 0, qa_podil: 0.05, ing_h: 1500, rizeni_h: 600, pravo_kc: 300000, infra_llm_data_kc: 150000 },
    realisticky: { ...spolecne, N: 30000, h_overeni: 0.4, lok_podil: 0.3, qa_podil: 0.05, ing_h: 3000, rizeni_h: 1200, pravo_kc: 600000, infra_llm_data_kc: 500000 },
    plny: { ...spolecne, N: 60000, h_overeni: 0.5, lok_podil: 0.4, qa_podil: 0.1, ing_h: 5000, rizeni_h: 2500, pravo_kc: 1500000, infra_llm_data_kc: 1200000 },
  },
  sAI: {
    minimalni: { auto_podil: 0.8, h_vyjimka: 0.5, audit_podil: 0.1, h_audit: 0.2, lok_podil_vyjimek: 0, h_lok: 0.2, llm_kc_na_zaznam: 50, ing_navic_h: 500 },
    realisticky: { auto_podil: 0.75, h_vyjimka: 0.5, audit_podil: 0.1, h_audit: 0.2, lok_podil_vyjimek: 0.3, h_lok: 0.2, llm_kc_na_zaznam: 50, ing_navic_h: 800 },
    plny: { auto_podil: 0.7, h_vyjimka: 0.5, audit_podil: 0.1, h_audit: 0.2, lok_podil_vyjimek: 0.4, h_lok: 0.2, llm_kc_na_zaznam: 50, ing_navic_h: 1000 },
  },
}

export function klonuj(p: ParametryKalkulacky): ParametryKalkulacky {
  return structuredClone(p)
}
