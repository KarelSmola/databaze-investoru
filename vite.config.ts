/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** Lokálně obsluhuje /api/* stejným routerem jako Vercel Function (api/router.ts). */
function lokalniApi(): Plugin {
  return {
    name: 'lokalni-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      for (const k of ['DATABASE_URL', 'DATABASE_URL_UNPOOLED']) if (env[k] && !process.env[k]) process.env[k] = env[k]
      server.middlewares.use('/api', async (req, res) => {
        try {
          const mod = (await server.ssrLoadModule('/server/node.ts')) as typeof import('./server/node.js')
          await mod.obsluz(req, res, (req.url ?? '/').split('?')[0])
        } catch (e) {
          console.error(e)
          res.statusCode = 500
          res.end(JSON.stringify({ chyba: String(e) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), lokalniApi()],
  server: { port: 5173 },
  test: { include: ['tests/**/*.test.ts'] },
})
