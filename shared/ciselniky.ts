import type { Kategorie, Rozhodnuti, StavAktivity, StavHodnoty, StupenPole, TypCastky, TypChyby, TypUdalosti } from './typy.js'

export const KATEGORIE: Record<Kategorie, string> = {
  VC: 'VC',
  PE: 'PE',
  CVC: 'CVC (podtyp VC)',
  FO: 'Family office',
  andel: 'Anděl',
  velky_soukromy_investor: 'Velký soukromý investor',
  fond_fondu: 'Fond fondů',
  holding_CVC: 'Holding/CVC (k ověření)',
  nejasny: 'Nejasný typ',
  neinvestor: 'Neinvestor',
}

export const STAV_AKTIVITY: Record<StavAktivity, string> = {
  aktivni: 'Aktivní',
  historicky: 'Historický',
  kandidat: 'Kandidát',
  watchlist: 'Watchlist',
  vyrazen: 'Vyřazen',
}

export const ROZHODNUTI_NAZEV: Record<Rozhodnuti, string> = {
  A: 'Zařazen A',
  B: 'Zařazen B',
  kandidat: 'Kandidát',
  historicky: 'Historický',
  watchlist: 'Watchlist',
  vyrazen: 'Vyřazen',
}

export const STAV_HODNOTY: Record<StavHodnoty, string> = {
  overeno: 'ověřeno',
  nezverejneno: 'nezveřejněno',
  nedohledano: 'nedohledáno',
  odhad: 'odhad',
  konflikt: 'konflikt',
  jen_agregator: 'jen agregátor',
  mimo_rozsah: 'mimo rozsah',
  neuvedeno: 'neuvedeno',
}

export const STUPEN_POLE: Record<StupenPole, string> = {
  overeno: 'ověřeno',
  samodeklarovano: 'samodeklarováno',
  odvozeno: 'odvozeno',
  konflikt: 'konflikt',
}

export const TYP_CASTKY: Record<TypCastky, string> = {
  cil: 'cíl',
  first_close: 'first close',
  uzavreny_fond: 'uzavřený fond',
  zavazky: 'závazky',
  zavazky_typ_uzavreni_nedohledan: 'závazky (typ uzavření nedohledán)',
  ziskano: 'získáno',
  alokovano: 'alokováno',
  podfond: 'podfond',
  zavazek_LP: 'závazek LP',
  AUM: 'AUM',
  neuvedeno: 'neuveden',
}

export const TYP_UDALOSTI: Record<TypUdalosti, string> = {
  exit: 'Exit',
  zavazek_LP: 'Závazek LP',
  jen_agregator: 'Doklad jen z agregátoru',
  jiny: 'Jiná událost',
}

export const TYP_CHYBY: Record<TypChyby, string> = {
  identita: 'identita',
  aktivita: 'aktivita',
  typ: 'typ',
  castka: 'částka',
  datum: 'datum',
}

export const UROVEN_ZDROJE: Record<number, string> = {
  1: 'úřední registr',
  2: 'samodeklarace investora nebo firmy',
  3: 'redakční zpracování',
  4: 'agregátor',
}
