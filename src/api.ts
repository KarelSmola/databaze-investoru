import { useCallback, useEffect, useState } from 'react'

export class ApiChyba extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export async function api<T>(cesta: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const r = await fetch(`/api/${cesta}`, {
    method: init?.method ?? 'GET',
    headers: init?.body !== undefined ? { 'content-type': 'application/json' } : undefined,
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
  })
  const text = await r.text()
  let data: unknown
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
  if (!r.ok) {
    const zprava = data && typeof data === 'object' && 'chyba' in data ? String((data as { chyba: unknown }).chyba) : `Chyba ${r.status}`
    throw new ApiChyba(r.status, zprava)
  }
  return data as T
}

export function qs(params: Record<string, string | number | boolean | null | undefined | string[]>): string {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === '' || v === false) continue
    if (Array.isArray(v)) {
      if (v.length) p.set(k, v.join(','))
    } else p.set(k, String(v))
  }
  const s = p.toString()
  return s ? `?${s}` : ''
}

export interface StavDotazu<T> {
  data: T | null
  chyba: string | null
  nacita: boolean
  obnov: () => void
}

/** Načte JSON z API; při změně cesty načte znovu. `null` = nenačítat. */
export function useApi<T>(cesta: string | null): StavDotazu<T> {
  const [data, setData] = useState<T | null>(null)
  const [chyba, setChyba] = useState<string | null>(null)
  const [nacita, setNacita] = useState(cesta != null)
  const [verzeObnoveni, setVerzeObnoveni] = useState(0)

  useEffect(() => {
    if (cesta == null) return
    let platne = true
    setNacita(true)
    setChyba(null)
    api<T>(cesta)
      .then((d) => platne && setData(d))
      .catch((e: unknown) => platne && setChyba(e instanceof Error ? e.message : String(e)))
      .finally(() => platne && setNacita(false))
    return () => {
      platne = false
    }
  }, [cesta, verzeObnoveni])

  const obnov = useCallback(() => setVerzeObnoveni((x) => x + 1), [])
  return { data, chyba, nacita, obnov }
}

/** Bezpečné čtení a zápis do localStorage (jen pohodlí uživatele). */
export function nactiLokalne(klic: string): string | null {
  try {
    return localStorage.getItem(klic)
  } catch {
    return null
  }
}
export function ulozLokalne(klic: string, hodnota: string | null): void {
  try {
    if (hodnota == null) localStorage.removeItem(klic)
    else localStorage.setItem(klic, hodnota)
  } catch {
    /* nedostupné úložiště */
  }
}
