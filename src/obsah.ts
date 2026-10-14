/** Statický obsah kapitol 0–11 a úvodu (content/*.md, doslovně z předávacího dokumentu). */

const soubory = import.meta.glob('../content/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

const soubor = (nazev: string) => soubory[`../content/${nazev}.md`] ?? ''

export const NAZEV = soubor('nazev').replace(/\*\*/g, '').trim()
export const ZAVER = soubor('zaver').trim()
export const TLDR = soubor('tldr').trim()
export const ZADANI = soubor('zadani').trim()

export interface Podkapitola {
  cislo: string
  nazev: string
  id: string
  uroven: number
}

export interface Kapitola {
  cislo: number
  nazev: string
  text: string
  podkapitoly: Podkapitola[]
}

export function idNadpisu(text: string): string | undefined {
  const m = /^(\d{1,2}(?:\.\d{1,2})*)[).\s]/.exec(text.trim())
  return m ? `k-${m[1].replace(/\./g, '-')}` : undefined
}

export const KAPITOLY: Kapitola[] = Array.from({ length: 12 }, (_, n) => {
  const text = soubor(`kapitola-${String(n).padStart(2, '0')}`)
  const prvni = text.split('\n')[0].replace(/^#+\s*/, '')
  const nazev = prvni.replace(/^\d+\)\s*/, '')
  const podkapitoly: Podkapitola[] = []
  for (const r of text.split('\n')) {
    const m = /^(#{3,4})\s+(.*)$/.exec(r)
    if (!m) continue
    const id = idNadpisu(m[2])
    if (!id) continue
    const c = /^(\S+)\s+(.*)$/.exec(m[2])!
    podkapitoly.push({ cislo: c[1], nazev: c[2], id, uroven: m[1].length })
  }
  return { cislo: n, nazev, text, podkapitoly }
})

/** Odkaz na kapitolu nebo podkapitolu, např. „9.4.6“ → /metodika/9#k-9-4-6. */
export function odkazKapitoly(cislo: string): string | null {
  const hlavni = Number(cislo.split('.')[0])
  if (!(hlavni >= 0 && hlavni <= 11)) return null
  return cislo.includes('.') ? `/metodika/${hlavni}#k-${cislo.replace(/\./g, '-')}` : `/metodika/${hlavni}`
}

export const RE_KAPITOLA = /\b(kap\.|kapitol(?:a|e|u|y|ou|ách|ami|ám)?)(\s+)(\d{1,2}(?:\.\d{1,2}){0,2})(?![\d.]\d)/gi

/** Které kapitoly citují zdroj n (zpětné odkazy FR-81). */
export function kapitolyCitujici(): Map<number, number[]> {
  const m = new Map<number, number[]>()
  for (const k of KAPITOLY) {
    for (const x of k.text.matchAll(/\\\[(\d+)\\\]/g)) {
      const c = Number(x[1])
      const arr = m.get(c) ?? []
      if (!arr.includes(k.cislo)) arr.push(k.cislo)
      m.set(c, arr)
    }
  }
  return m
}
