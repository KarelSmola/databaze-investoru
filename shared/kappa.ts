/**
 * Cohenovo kappa pro dvojice hodnocení: κ = (p_o − p_e) / (1 − p_e).
 * p_e se počítá z marginálních četností kategorií obou hodnotitelů.
 */
export function cohenKappa<T extends string>(dvojice: Array<[T, T]>): number | null {
  const n = dvojice.length
  if (n === 0) return null
  let shody = 0
  const a = new Map<T, number>()
  const b = new Map<T, number>()
  for (const [x, y] of dvojice) {
    if (x === y) shody++
    a.set(x, (a.get(x) ?? 0) + 1)
    b.set(y, (b.get(y) ?? 0) + 1)
  }
  const po = shody / n
  let pe = 0
  for (const [kat, ca] of a) pe += (ca / n) * ((b.get(kat) ?? 0) / n)
  if (pe === 1) return po === 1 ? 1 : 0
  return (po - pe) / (1 - pe)
}

export function median(hodnoty: number[]): number | null {
  if (hodnoty.length === 0) return null
  const s = [...hodnoty].sort((x, y) => x - y)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}
