import { Link, NavLink, useParams } from 'react-router-dom'
import { Markdown } from '../components/Markdown'
import { Hlavicka, useKotva } from '../components/Ui'
import { KAPITOLY } from '../obsah'

/** Odkazy z kapitol na živé moduly (FR-23). */
const ZIVE: Record<number, [string, string][]> = {
  2: [['/strom', 'Rozhodovací strom – interaktivní průvodce a hraniční případy']],
  7: [
    ['/databaze', 'Pilotní databáze – živá tabulka kap. 7.1'],
    ['/metriky', 'Metriky pilotu – výpočet kap. 7.3 z dat'],
    ['/kontrola', 'Nezávislá kontrola – šablona kap. 7.4'],
  ],
  8: [['/kalkulacka?z=cr', 'Kalkulačka – rozpočet pilotu a ČR']],
  9: [
    ['/kalkulacka?z=bezAI', 'Kalkulačka – model bez AI triáže (9.3)'],
    ['/kalkulacka?z=sAI', 'Kalkulačka – model s AI triáží (9.4)'],
    ['/go-nogo', 'Go/no-go – kritéria kap. 9.4.6'],
  ],
  11: [['/go-nogo', 'Go/no-go – kritéria kap. 11']],
}

export function Metodika() {
  const { cislo } = useParams()
  const n = cislo != null ? Number(cislo) : null
  const kap = n != null ? KAPITOLY.find((k) => k.cislo === n) : null
  useKotva()

  if (!kap) {
    return (
      <div className="kontejner stranka">
        <Hlavicka eyebrow="Modul M3" nadpis="Metodika">
          <p>Kapitoly 0–11 vypracování „Spolehlivá databáze investorů“ beze změn textu. Citace vedou na zdroje, odkazy na kapitoly jsou interní.</p>
        </Hlavicka>
        <div className="mrizka mrizka-3">
          {KAPITOLY.map((k) => (
            <Link key={k.cislo} to={`/metodika/${k.cislo}`} className="karta" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>
                Kapitola {k.cislo}
              </div>
              <h3>{k.nazev}</h3>
              <p className="mala muted" style={{ margin: 0 }}>
                {k.podkapitoly
                  .filter((p) => p.uroven === 3)
                  .map((p) => p.nazev)
                  .slice(0, 4)
                  .join(' · ') || ' '}
              </p>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const pred = KAPITOLY.find((k) => k.cislo === kap.cislo - 1)
  const po = KAPITOLY.find((k) => k.cislo === kap.cislo + 1)

  return (
    <div className="kontejner stranka">
      <div className="metodika">
        <aside>
          <div className="eyebrow">Metodika</div>
          <nav className="metodika-nav" aria-label="Kapitoly">
            {KAPITOLY.map((k) => (
              <div key={k.cislo}>
                <NavLink to={`/metodika/${k.cislo}`}>
                  {k.cislo}) {k.nazev}
                </NavLink>
                {k.cislo === kap.cislo && k.podkapitoly.length > 0 && (
                  <div className="obsah-kapitoly">
                    {k.podkapitoly
                      .filter((p) => p.uroven === 3)
                      .map((p) => (
                        <Link key={p.id} to={`/metodika/${k.cislo}#${p.id}`}>
                          {p.cislo} {p.nazev}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>
        <article>
          <div className="eyebrow">Kapitola {kap.cislo}</div>
          {ZIVE[kap.cislo] && (
            <div className="info" style={{ marginBottom: 24 }}>
              <b>Živé moduly:</b>{' '}
              {ZIVE[kap.cislo].map(([to, t], i) => (
                <span key={to + i}>
                  {i > 0 && ' · '}
                  <Link to={to}>{t}</Link>
                </span>
              ))}
            </div>
          )}
          <Markdown md={kap.text} />
          <div className="radek-stred mezera" style={{ justifyContent: 'space-between', maxWidth: 860 }}>
            {pred ? (
              <Link className="tl tl-obrys" to={`/metodika/${pred.cislo}`}>
                ← {pred.cislo}) {pred.nazev}
              </Link>
            ) : (
              <span />
            )}
            {po && (
              <Link className="tl tl-obrys" to={`/metodika/${po.cislo}`}>
                {po.cislo}) {po.nazev} →
              </Link>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
