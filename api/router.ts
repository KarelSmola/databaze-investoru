import type { IncomingMessage, ServerResponse } from 'node:http'
import { obsluz } from '../server/node.js'

/**
 * Jediná Vercel Function pro celé API. vercel.json přepisuje /api/<cesta> na /api/router?path=<cesta>,
 * takže se nepřekročí limit počtu funkcí a logika cest je na jednom místě (server/router.ts).
 */
export default async function handler(
  req: IncomingMessage & { body?: unknown; query?: Record<string, string | string[] | undefined> },
  res: ServerResponse,
): Promise<void> {
  await obsluz(req, res, typeof req.query?.path === 'string' ? req.query.path : undefined)
}
