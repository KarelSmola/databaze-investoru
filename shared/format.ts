/** České formátování čísel a dat (NFR-01). */

const nf = (min: number, max: number) =>
  new Intl.NumberFormat('cs-CZ', { minimumFractionDigits: min, maximumFractionDigits: max })

const cache = new Map<string, Intl.NumberFormat>()
function f(min: number, max: number): Intl.NumberFormat {
  const k = `${min}-${max}`
  let x = cache.get(k)
  if (!x) {
    x = nf(min, max)
    cache.set(k, x)
  }
  return x
}

/** Číslo s mezerou jako oddělovačem tisíců a desetinnou čárkou. */
export function cislo(n: number | null | undefined, desetinna = 0, minDesetinna = 0): string {
  if (n == null || Number.isNaN(n)) return '—'
  // Intl pro cs-CZ používá nezlomitelnou mezeru, což je typograficky správně.
  return f(minDesetinna, desetinna).format(n)
}

export function kc(n: number | null | undefined): string {
  return n == null ? '—' : `${cislo(Math.round(n))} Kč`
}

export function procento(p: number | null | undefined, desetinna = 1): string {
  if (p == null || Number.isNaN(p)) return '—'
  return `${cislo(p * 100, desetinna, desetinna)} %`
}

/** „2,28 mil.“ */
export function mil(n: number, desetinna = 2): string {
  return `${cislo(n / 1_000_000, desetinna, desetinna)} mil.`
}

/** Datum ISO (RRRR, RRRR-MM, RRRR-MM-DD) → D. M. RRRR; částečná data bez dne. */
export function datum(d: string | null | undefined): string {
  if (!d) return '—'
  const s = d.slice(0, 10)
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(s)
  if (!m) return d
  const [, r, mes, den] = m
  if (den) return `${Number(den)}. ${Number(mes)}. ${r}`
  if (mes) return `${Number(mes)}/${r}`
  return r
}

export function datumCas(iso: string | null | undefined): string {
  if (!iso) return '—'
  // Postgres vrací „2026-10-13 20:10:19.76+00“; převod na ISO kvůli Safari.
  const d = new Date(iso.replace(' ', 'T').replace(/([+-]\d\d)$/, '$1:00'))
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** Částka v původní měně, např. „12 mil. EUR“, „40 tis. EUR“. */
export function castka(n: number | null | undefined, mena: string | null | undefined): string {
  if (n == null) return '—'
  const m = mena === 'CZK' ? 'Kč' : (mena ?? '')
  const abs = Math.abs(n)
  if (abs >= 1_000_000_000) return `${cislo(n / 1_000_000_000, 2)} mld. ${m}`.trim()
  if (abs >= 1_000_000) return `${cislo(n / 1_000_000, 2)} mil. ${m}`.trim()
  if (abs >= 1_000) return `${cislo(n / 1_000, 1)} tis. ${m}`.trim()
  return `${cislo(n)} ${m}`.trim()
}
