import type { IncomingMessage, ServerResponse } from 'node:http'
import { segmenty, zpracuj } from './router.js'

/** Adaptér pro Node (Vercel Functions i lokální Vite middleware). */
export async function obsluz(
  req: IncomingMessage & { body?: unknown; query?: Record<string, string | string[] | undefined> },
  res: ServerResponse,
  cesta?: string,
): Promise<void> {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const query: Record<string, string | undefined> = {}
  url.searchParams.forEach((v, k) => (query[k] = v))
  for (const [k, v] of Object.entries(req.query ?? {})) query[k] = Array.isArray(v) ? v[0] : v

  let body: unknown = req.body
  if (body === undefined && req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks: Buffer[] = []
    for await (const c of req) chunks.push(c as Buffer)
    const raw = Buffer.concat(chunks).toString('utf8')
    body = raw ? JSON.parse(raw) : undefined
  } else if (typeof body === 'string' && body) {
    body = JSON.parse(body)
  }

  const segs = segmenty(cesta ?? query.path ?? url.pathname)
  delete query.path
  const odp = await zpracuj({ method: req.method ?? 'GET', cesta: segs, query, body })
  res.statusCode = odp.status
  res.setHeader('cache-control', 'no-store')
  for (const [k, v] of Object.entries(odp.headers ?? {})) res.setHeader(k, v)
  if (odp.text !== undefined) {
    res.end(odp.text)
  } else {
    res.setHeader('content-type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(odp.json ?? null))
  }
}
