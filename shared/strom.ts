import type { Kategorie, SkupinaRelevance } from './typy.js'

/** Rozhodovací strom kap. 2.1 (sekce 8.1 předávacího dokumentu). */

export type StavDokladu = 'v_okne' | 'jen_fundraising_nebo_LP' | 'starsi' | 'zadny' | 'jen_agregator'

export interface VstupStromu {
  identita_overitelna: boolean
  investuje_do_podilu: boolean
  kategorie: Kategorie
  doklad: StavDokladu
  ceska_relevance: SkupinaRelevance | null
  kategorie_urcitelna: boolean
  otevrena_otazka: boolean
  /** Počet doložených přímých investic (anděl ≥1, velký soukromý investor ≥2; kap. 1.1). */
  pocet_dolozenych_investic?: number
}

export type VysledekTyp =
  | 'vyrazen'
  | 'watchlist'
  | 'historicky'
  | 'kandidat'
  | 'mimo_rozsah'
  | 'zarazen_A'
  | 'zarazen_B'

export interface VysledekStromu {
  vysledek: VysledekTyp
  stupen: 'A' | 'B' | 'C' | 'X' | null
  krok: 1 | 2 | 3 | 4 | 5
  zduvodneni: string
  poznamka?: string
}

export const VYSLEDEK_POPIS: Record<VysledekTyp, string> = {
  vyrazen: 'Vyřazen (X)',
  watchlist: 'Watchlist',
  historicky: 'Historický (C)',
  kandidat: 'Kandidát (C)',
  mimo_rozsah: 'Mimo rozsah',
  zarazen_A: 'Zařazen – stupeň A',
  zarazen_B: 'Zařazen – stupeň B',
}

/** Okno aktivity v měsících: VC, CVC a anděl 24; PE, FO a velký soukromý investor 36. */
export function oknoAktivityMesice(kategorie: Kategorie): 24 | 36 {
  return kategorie === 'VC' || kategorie === 'CVC' || kategorie === 'andel' ? 24 : 36
}

/** Hranice okna aktivity (ISO datum) pro dané datum vyhodnocení. */
export function hraniceOkna(datumVyhodnoceni: string, mesice: number): string {
  const [r, m, d] = datumVyhodnoceni.split('-').map(Number)
  const dt = new Date(Date.UTC(r, m - 1 - mesice, d))
  return dt.toISOString().slice(0, 10)
}

/** Je datum (RRRR, RRRR-MM nebo RRRR-MM-DD) v okně aktivity? Částečné datum se bere jako konec období. */
export function jeVOkne(datum: string, datumVyhodnoceni: string, mesice: number): boolean {
  const hranice = hraniceOkna(datumVyhodnoceni, mesice)
  let plne = datum
  if (/^\d{4}$/.test(datum)) plne = `${datum}-12-31`
  else if (/^\d{4}-\d{2}$/.test(datum)) plne = `${datum}-31`
  return plne >= hranice
}

export function rozhodni(v: VstupStromu): VysledekStromu {
  if (!v.identita_overitelna) {
    return { vysledek: 'vyrazen', stupen: 'X', krok: 1, zduvodneni: 'Identitu nelze ověřit (IČO/LEI, zahraniční registr, u FO jméno a vazba na investici).' }
  }
  if (!v.investuje_do_podilu || v.kategorie === 'neinvestor') {
    return {
      vysledek: 'vyrazen',
      stupen: 'X',
      krok: 2,
      zduvodneni: 'Neinvestuje vlastní ani spravovaný kapitál do podílů ve firmách (jen zprostředkovává, radí, poskytuje úvěr nebo provozuje platformu).',
    }
  }
  const okno = oknoAktivityMesice(v.kategorie)
  switch (v.doklad) {
    case 'jen_fundraising_nebo_LP':
      return { vysledek: 'watchlist', stupen: null, krok: 3, zduvodneni: 'Doložen jen fundraising nebo závazek LP; závazek LP do fondu není investice do firmy.' }
    case 'starsi':
      return { vysledek: 'historicky', stupen: 'C', krok: 3, zduvodneni: `Doklad o investici je starší než okno aktivity (${okno} měsíců).` }
    case 'zadny':
      return { vysledek: 'kandidat', stupen: 'C', krok: 3, zduvodneni: 'Chybí datovaný doklad o investici do firmy.' }
    case 'jen_agregator':
      return { vysledek: 'kandidat', stupen: 'C', krok: 3, zduvodneni: 'Investice je doložena jen agregátorem; agregátor slouží jen k nalezení kandidáta.' }
    case 'v_okne':
      break
  }
  const pocet = v.pocet_dolozenych_investic
  if (v.kategorie === 'velky_soukromy_investor' && pocet != null && pocet < 2) {
    return { vysledek: 'kandidat', stupen: 'C', krok: 3, zduvodneni: 'Velký soukromý investor vyžaduje ≥2 doložené přímé investice (kap. 1.1).' }
  }
  if (v.kategorie === 'andel' && pocet != null && pocet < 1) {
    return { vysledek: 'kandidat', stupen: 'C', krok: 3, zduvodneni: 'Anděl vyžaduje ≥1 jmenovitě doloženou investici (kap. 1.1).' }
  }
  if (v.ceska_relevance == null) {
    return {
      vysledek: 'mimo_rozsah',
      stupen: null,
      krok: 4,
      zduvodneni: 'Není splněna česká relevance (skupina 1, 2a nebo 2b). Pouhé zaměření na „CEE“ relevanci nezakládá.',
    }
  }
  if (v.kategorie_urcitelna && !v.otevrena_otazka) {
    return { vysledek: 'zarazen_A', stupen: 'A', krok: 5, zduvodneni: `Identita, investice v okně aktivity (${okno} měsíců), česká relevance ${v.ceska_relevance} a určitelná kategorie.` }
  }
  const poznamka =
    v.kategorie === 'holding_CVC'
      ? 'Typ „holding/CVC“ – nutno ověřit.'
      : !v.kategorie_urcitelna
        ? 'Kategorie nejasná – nutno ověřit.'
        : 'Otevřená otázka (typ, entita nebo jediný zdroj úrovně 3).'
  return { vysledek: 'zarazen_B', stupen: 'B', krok: 5, zduvodneni: 'Splňuje podmínky zařazení, ale má otevřenou otázku.', poznamka }
}

/** Hraniční případy kap. 2.2 jako testovací sada AT-30 až AT-42. */
export interface HranicniPripad {
  id: string
  pripad: string
  ocekavano: VysledekTyp[]
  ocekavanoText: string
  zduvodneni: string
  vstup: VstupStromu
}

const zaklad: VstupStromu = {
  identita_overitelna: true,
  investuje_do_podilu: true,
  kategorie: 'VC',
  doklad: 'v_okne',
  ceska_relevance: '1',
  kategorie_urcitelna: true,
  otevrena_otazka: false,
}

export const HRANICNI_PRIPADY: HranicniPripad[] = [
  { id: 'AT-30', pripad: 'Holding s jednou dceřinou firmou', ocekavano: ['vyrazen'], ocekavanoText: 'Vyřazen', zduvodneni: 'Nejde o investiční činnost', vstup: { ...zaklad, kategorie: 'neinvestor', investuje_do_podilu: false } },
  { id: 'AT-31', pripad: 'Holding s opakovanými minoritními investicemi (např. Miton)', ocekavano: ['zarazen_B'], ocekavanoText: 'Zařazen B, typ „holding/CVC“', zduvodneni: 'Investuje opakovaně, typ je třeba ověřit', vstup: { ...zaklad, kategorie: 'holding_CVC', kategorie_urcitelna: false } },
  { id: 'AT-32', pripad: 'Poradce, advokát, M&A boutique (Ambit, Limerock)', ocekavano: ['vyrazen'], ocekavanoText: 'Vyřazen jako investor, ponechán jako zdroj', zduvodneni: 'Zprostředkovává', vstup: { ...zaklad, kategorie: 'neinvestor', investuje_do_podilu: false, doklad: 'zadny' } },
  { id: 'AT-33', pripad: 'Crowdfundingová platforma (HitHit)', ocekavano: ['vyrazen'], ocekavanoText: 'Vyřazena', zduvodneni: 'Kapitál patří investorům platformy', vstup: { ...zaklad, kategorie: 'neinvestor', investuje_do_podilu: false } },
  { id: 'AT-34', pripad: 'Banka', ocekavano: ['vyrazen'], ocekavanoText: 'Vyřazena', zduvodneni: 'Rozhoduje samostatný mandát; banka sama investiční mandát do podílů nemá', vstup: { ...zaklad, kategorie: 'neinvestor', investuje_do_podilu: false } },
  { id: 'AT-35', pripad: 'CVC rameno banky (Seed Starter) s doloženou investicí', ocekavano: ['zarazen_A', 'zarazen_B'], ocekavanoText: 'Zařazeno', zduvodneni: 'Rozhoduje samostatný mandát', vstup: { ...zaklad, kategorie: 'CVC' } },
  { id: 'AT-36', pripad: 'Realitní nebo dluhopisový FKI', ocekavano: ['vyrazen'], ocekavanoText: 'Vyřazen', zduvodneni: 'Neinvestuje do podílů ve firmách', vstup: { ...zaklad, kategorie: 'neinvestor', investuje_do_podilu: false } },
  { id: 'AT-37', pripad: 'Dluhový věřitel (CVI) bez majetkové investice', ocekavano: ['vyrazen'], ocekavanoText: 'Vyřazen z VC/PE; zařazen jen s doloženou majetkovou investicí', zduvodneni: 'Úvěr není investice do podílu', vstup: { ...zaklad, kategorie: 'PE', investuje_do_podilu: false } },
  { id: 'AT-38', pripad: 'Správce podle § 15 ZISIF bez dokladu o investici', ocekavano: ['kandidat'], ocekavanoText: 'Kandidát', zduvodneni: 'ČNB tyto správce pouze eviduje, nedohlíží na ně', vstup: { ...zaklad, kategorie: 'nejasny', doklad: 'zadny' } },
  { id: 'AT-39', pripad: 'Akcelerátor s doloženou kapitálovou investicí (Czech Founders VC, 40 tis. EUR)', ocekavano: ['zarazen_A', 'zarazen_B'], ocekavanoText: 'Zařazen', zduvodneni: 'Rozhoduje kapitál, ne program', vstup: { ...zaklad, kategorie: 'VC' } },
  { id: 'AT-40', pripad: 'Nový fond bez investice, jen závazek LP (IP Lab Ventures)', ocekavano: ['watchlist'], ocekavanoText: 'Watchlist', zduvodneni: 'Závazek LP do fondu ≠ investice do firmy', vstup: { ...zaklad, doklad: 'jen_fundraising_nebo_LP' } },
  { id: 'AT-41', pripad: 'Startup s „Ventures“ v názvu (ARES nesvědčí o investiční činnosti)', ocekavano: ['vyrazen'], ocekavanoText: 'Vyřazen', zduvodneni: 'Ověří se přes ARES (CZ-NACE, předmět činnosti)', vstup: { ...zaklad, kategorie: 'neinvestor', investuje_do_podilu: false, doklad: 'zadny' } },
  { id: 'AT-42', pripad: 'Investice doložená jen agregátorem', ocekavano: ['kandidat'], ocekavanoText: 'Kandidát', zduvodneni: 'Agregátor slouží jen k nalezení kandidáta', vstup: { ...zaklad, doklad: 'jen_agregator' } },
]
