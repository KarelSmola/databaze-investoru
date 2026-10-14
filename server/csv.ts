/** CSV se středníkem (Excel v české lokalizaci) a BOM pro správné kódování. */
export function csv(radky: Record<string, unknown>[]): string {
  if (!radky.length) return '﻿'
  const hlavicka = Object.keys(radky[0])
  const bunka = (v: unknown) => {
    const s = v == null ? '' : Array.isArray(v) ? v.join(', ') : String(v)
    return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return '﻿' + [hlavicka.join(';'), ...radky.map((r) => hlavicka.map((h) => bunka(r[h])).join(';'))].join('\r\n') + '\r\n'
}
