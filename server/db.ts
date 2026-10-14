import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { HttpChyba } from './http.js'

let instance: NeonQueryFunction<false, false> | null = null

/** HTTP klient Neonu. Connection string je jen na serveru (proměnná prostředí DATABASE_URL). */
export function db(): NeonQueryFunction<false, false> {
  if (!instance) {
    const url = process.env.DATABASE_URL
    if (!url) throw new HttpChyba(500, 'Chybí proměnná prostředí DATABASE_URL.')
    instance = neon(url)
  }
  return instance
}

export type Radek = Record<string, unknown>

export const num = (v: unknown): number | null => (v == null ? null : Number(v))
export const str = (v: unknown): string | null => (v == null ? null : String(v))
