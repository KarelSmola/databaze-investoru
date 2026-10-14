import { readFileSync, existsSync } from 'node:fs'

/** Načte lokální .env (jen pro skripty; na Vercelu nastavuje proměnné integrace Neon). */
export function nactiEnv(): void {
  if (!existsSync('.env')) return
  for (const radek of readFileSync('.env', 'utf8').split('\n')) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(radek)
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

export function connectionString(unpooled = true): string {
  nactiEnv()
  const url = (unpooled ? process.env.DATABASE_URL_UNPOOLED : undefined) ?? process.env.DATABASE_URL
  if (!url) throw new Error('Chybí DATABASE_URL (viz .env.example).')
  return url
}
