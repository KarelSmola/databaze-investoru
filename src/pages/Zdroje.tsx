import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../api'
import { useVerze } from '../verze'
import { ChybaBox, Hlavicka, Nacitani, useKotva } from '../components/Ui'
import { kapitolyCitujici, KAPITOLY } from '../obsah'
import { normalizujText } from '../../shared/filtry'
import type { ZdrojApi } from '../../shared/api'

export function Zdroje() {
  const { verze } = useVerze()
  const { data, chyba, nacita } = useApi<ZdrojApi[]>(`zdroje?verze=${encodeURIComponent(verze)}`)
  const [q, setQ] = useState('')
  const kap = useMemo(() => kapitolyCitujici(), [])
  useKotva(!!data)
  const filtr = normalizujText(q)
  const zdroje = (data ?? []).filter((z) => !filtr || normalizujText(`${z.cislo} ${z.titulek} ${z.url}`).includes(filtr))

  return (
    <div className="kontejner stranka">
      <Hlavicka eyebrow="Modul M9" nadpis="Zdroje">
        <p>
          Zdroje 1–68 z vypracování. U každého zdroje zpětné odkazy na kapitoly, záznamy pilotu a kola financování, které ho citují. Agregátory slouží jen
          k nalezení kandidátů, nikdy jako doklad (<Link to="/metodika/4">kap. 4</Link>).
        </p>
      </Hlavicka>
      <div className="pole" style={{ maxWidth: 360, marginBottom: 18 }}>
        <label htmlFor="hledat">Hledat ve zdrojích</label>
        <input id="hledat" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="název, doména, číslo…" />
      </div>
      {chyba && <ChybaBox chyba={chyba} />}
      {nacita && !data && <Nacitani />}
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {zdroje.map((z) => {
          const kapitoly = kap.get(z.cislo) ?? []
          return (
            <li key={z.cislo} id={`zdroj-${z.cislo}`} className="karta" style={{ padding: '14px 18px', scrollMarginTop: 140 }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <span className="kpi-hodnota" style={{ fontSize: 20, minWidth: 34 }}>
                  {z.cislo}
                </span>
                <div style={{ minWidth: 0 }}>
                  <a href={z.url} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>
                    {z.titulek}
                  </a>
                  <div className="mala muted" style={{ overflowWrap: 'anywhere' }}>
                    {z.url}
                  </div>
                  {(kapitoly.length > 0 || z.spravci.length > 0 || z.kola.length > 0) && (
                    <div className="cipy mezera-s">
                      {kapitoly.map((c) => (
                        <Link key={`k${c}`} className="cip" to={`/metodika/${c}`}>
                          Kap. {c}) {KAPITOLY[c].nazev}
                        </Link>
                      ))}
                      {z.spravci.map((s) => (
                        <Link key={`s${s.id}`} className="cip" to={`/databaze/${s.id}`} style={{ background: '#fff' }}>
                          #{s.id} {s.nazev}
                        </Link>
                      ))}
                      {z.kola.map((k) => (
                        <Link key={`r${k.id}`} className="cip" to={`/kola/${k.id}`} style={{ background: '#fff' }}>
                          Kolo {k.firma}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
