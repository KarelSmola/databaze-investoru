/** Minimální abstrakce HTTP nezávislá na běhovém prostředí (Vercel Functions i Vite dev server). */

export interface Pozadavek {
  method: string
  /** Segmenty cesty za /api/, např. ['spravci', '5']. */
  cesta: string[]
  query: Record<string, string | undefined>
  body: unknown
}

export interface Odpoved {
  status: number
  json?: unknown
  text?: string
  headers?: Record<string, string>
}

export class HttpChyba extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export const json = (data: unknown, status = 200): Odpoved => ({ status, json: data })

export function chyba(e: unknown): Odpoved {
  if (e instanceof HttpChyba) return { status: e.status, json: { chyba: e.message } }
  if (e && typeof e === 'object' && 'issues' in e) return { status: 400, json: { chyba: 'Neplatný vstup', detail: (e as { issues: unknown }).issues } }
  console.error(e)
  return { status: 500, json: { chyba: 'Interní chyba serveru' } }
}
