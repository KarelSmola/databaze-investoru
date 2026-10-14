import { chyba, HttpChyba, type Odpoved, type Pozadavek } from './http.js'
import * as spravci from './routes/spravci.js'
import * as kola from './routes/kola.js'
import * as zdroje from './routes/zdroje.js'
import * as metriky from './routes/metriky.js'
import * as kontrola from './routes/kontrola.js'
import * as gonogo from './routes/gonogo.js'
import * as kalkulacka from './routes/kalkulacka.js'
import * as exportDat from './routes/export.js'
import * as verze from './routes/verze.js'

type Handler = (p: Pozadavek, ...params: string[]) => Promise<Odpoved>

/** Tabulka cest API (sekce 7). `:x` je parametr cesty. */
const CESTY: Array<[string, string, Handler]> = [
  ['GET', 'spravci', spravci.seznam],
  ['GET', 'spravci/:id', spravci.detail],
  ['PATCH', 'spravci/:id', spravci.uprav],
  ['GET', 'kola/:id', kola.detail],
  ['GET', 'zdroje', zdroje.seznam],
  ['GET', 'metriky', metriky.metriky],
  ['GET', 'kontrola/zaznamy', kontrola.zaznamy],
  ['POST', 'kontrola/hodnoceni', kontrola.ulozHodnoceni],
  ['GET', 'kontrola/kontrolori', kontrola.kontrolori],
  ['GET', 'kontrola/vysledky', kontrola.vysledky],
  ['GET', 'kontrola/export', kontrola.exportCsv],
  ['GET', 'kontrola/referencni-seznam', kontrola.referencniSeznam],
  ['POST', 'kontrola/referencni-seznam', kontrola.importReferencni],
  ['DELETE', 'kontrola/referencni-seznam', kontrola.smazReferencni],
  ['PUT', 'kontrola/referencni-seznam/:id', kontrola.mapujReferencni],
  ['GET', 'go-nogo', gonogo.seznam],
  ['PUT', 'go-nogo/:kriterium', gonogo.uloz],
  ['DELETE', 'go-nogo/:kriterium', gonogo.smaz],
  ['GET', 'kalkulacka/varianty', kalkulacka.seznam],
  ['POST', 'kalkulacka/varianty', kalkulacka.uloz],
  ['DELETE', 'kalkulacka/varianty/:id', kalkulacka.smaz],
  ['GET', 'export', exportDat.exportDat],
  ['GET', 'verze', verze.seznam],
  ['POST', 'verze', verze.vytvor],
  ['PUT', 'verze/:id/zmrazit', verze.zmrazit],
  ['GET', 'verze/:id/historie', verze.historie],
]

function shoda(vzor: string, cesta: string[]): string[] | null {
  const casti = vzor.split('/')
  if (casti.length !== cesta.length) return null
  const params: string[] = []
  for (let i = 0; i < casti.length; i++) {
    if (casti[i].startsWith(':')) params.push(decodeURIComponent(cesta[i]))
    else if (casti[i] !== cesta[i]) return null
  }
  return params
}

export async function zpracuj(p: Pozadavek): Promise<Odpoved> {
  try {
    let metodaNepovolena = false
    for (const [metoda, vzor, handler] of CESTY) {
      const params = shoda(vzor, p.cesta)
      if (!params) continue
      if (metoda !== p.method) {
        metodaNepovolena = true
        continue
      }
      return await handler(p, ...params)
    }
    throw new HttpChyba(metodaNepovolena ? 405 : 404, metodaNepovolena ? 'Metoda není povolena.' : 'Neznámý endpoint.')
  } catch (e) {
    return chyba(e)
  }
}

/** Rozloží URL cestu za /api/ na segmenty. */
export function segmenty(cesta: string): string[] {
  return cesta
    .replace(/^\/?(api\/?)?/, '')
    .split('/')
    .filter(Boolean)
}
