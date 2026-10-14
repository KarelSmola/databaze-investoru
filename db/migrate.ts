import { readdirSync, readFileSync } from 'node:fs'
import { Pool } from '@neondatabase/serverless'
import { connectionString } from './env.js'

/** Spustí neaplikované migrace z db/migrations v abecedním pořadí. */
const pool = new Pool({ connectionString: connectionString() })
const client = await pool.connect()
try {
  await client.query(`CREATE TABLE IF NOT EXISTS schema_migrace (nazev text PRIMARY KEY, aplikovano timestamptz NOT NULL DEFAULT now())`)
  const hotove = new Set((await client.query<{ nazev: string }>('SELECT nazev FROM schema_migrace')).rows.map((r) => r.nazev))
  const soubory = readdirSync('db/migrations').filter((f) => f.endsWith('.sql')).sort()
  for (const f of soubory) {
    if (hotove.has(f)) {
      console.log(`✓ ${f} (již aplikováno)`)
      continue
    }
    await client.query('BEGIN')
    try {
      await client.query(readFileSync(`db/migrations/${f}`, 'utf8'))
      await client.query('INSERT INTO schema_migrace (nazev) VALUES ($1)', [f])
      await client.query('COMMIT')
      console.log(`→ ${f} aplikováno`)
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    }
  }
} finally {
  client.release()
  await pool.end()
}
