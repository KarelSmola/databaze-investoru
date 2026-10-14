import { Link } from 'react-router-dom'
import { useApi } from '../api'
import { useVerze } from '../verze'
import { Markdown } from '../components/Markdown'
import { Rozlozeni } from '../components/Rozlozeni'
import { ChybaBox, IntervalPas, Nacitani, useKotva, Wilson } from '../components/Ui'
import { NAZEV, TLDR, ZADANI, ZAVER } from '../obsah'
import { procento } from '../../shared/format'
import type { MetrikyOdpoved } from '../typyOdpovedi'

const MODULY: [string, string, string][] = [
  ['/databaze', 'Pilotní databáze', '30 subjektů a 25 kol financování s doklady, filtry, fulltextem a exportem.'],
  ['/metodika', 'Metodika', 'Kapitoly 0–11: pravidla zařazení, zdroje, ověřování, odhad okruhu, pilot a náklady.'],
  ['/strom', 'Rozhodovací strom', 'Interaktivní průvodce pravidly zařazení a hraniční případy kap. 2.2.'],
  ['/metriky', 'Metriky pilotu', 'Metriky kap. 7.3 s Wilsonovými intervaly a jmenovitými seznamy záznamů.'],
  ['/kontrola', 'Nezávislá kontrola', 'Hodnocení naslepo, shoda, Cohenovo kappa a záchyt vůči referenčnímu seznamu.'],
  ['/go-nogo', 'Go/no-go', 'Kritéria kap. 11 a 9.4.6 se stavem splněno / nesplněno / čeká na data.'],
  ['/kalkulacka', 'Kalkulačka nákladů', 'Pilot, ČR a celý svět bez AI triáže i s ní, včetně citlivostí.'],
  ['/zdroje', 'Zdroje', 'Zdroje 1–68 se zpětnými odkazy na kapitoly, záznamy a kola.'],
]

export function Prehled() {
  const { verze } = useVerze()
  const { data, chyba, nacita } = useApi<MetrikyOdpoved>(`metriky?verze=${encodeURIComponent(verze)}`)
  useKotva()
  const [hlavni, podtitul] = NAZEV.split(/:\s*/, 2)
  const m = data?.poKontrole ?? data?.predbezne
  const dokonceno = data?.kontrola?.dokonceno === true

  return (
    <>
      <section className="hero">
        <div className="kontejner">
          <div className="eyebrow">Spolehlivá databáze investorů · pilot ČR · data v{verze}</div>
          <h1>
            {hlavni}
            {podtitul && (
              <>
                : <span className="akcent">{podtitul}</span>
              </>
            )}
          </h1>
          <div className="radek-stred" style={{ margin: '18px 0 22px' }}>
            {dokonceno ? (
              <span className="stitek st-ok">Po nezávislé kontrole ({data?.kontrola?.kontrolor})</span>
            ) : (
              <span className="stitek st-W">Předběžné – bez nezávislé kontroly</span>
            )}
            <span className="mala muted">Stav dat pilotu k 11. 10. 2026, opravy z kontroly zdrojů 13. 10. 2026</span>
          </div>
          <p className="zaver">{ZAVER}</p>
          <div className="radek-stred" style={{ marginTop: 24 }}>
            <Link to="/databaze" className="tl tl-primarni">
              Otevřít pilotní databázi
            </Link>
            <Link to="/metodika" className="tl tl-obrys">
              Metodika →
            </Link>
          </div>
        </div>
      </section>

      <div className="kontejner stranka">
        <div className="eyebrow">Klíčové metriky</div>
        <h2>Pilot na 30 VC subjektech</h2>
        <p className="muted" style={{ maxWidth: 760 }}>
          Počítáno přímo z dat v Neonu, ne vepsáno. Wilsonův 95% interval.{' '}
          {!dokonceno && 'Výsledky jsou předběžné, dokud je nezkontroluje nezávislá druhá osoba.'}
        </p>
        {nacita && !data && <Nacitani />}
        {chyba && <ChybaBox chyba={chyba} />}
        {m && (
          <>
            <div className="mrizka mrizka-3 mezera">
              {m.metriky.map((x) => (
                <Link key={x.id} to={`/metriky#${x.id}`} className="karta" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="kpi">
                    <span className="kpi-popis">{x.nazev}</span>
                    <span className="kpi-hodnota">
                      {x.vysledek.citatel}/{x.vysledek.jmenovatel} <span style={{ fontSize: 22 }}>· {procento(x.vysledek.podil)}</span>
                    </span>
                    <span className="kpi-interval">
                      95% interval <Wilson p={x.vysledek} />
                    </span>
                  </div>
                  <IntervalPas p={x.vysledek} />
                </Link>
              ))}
            </div>
            <div className="karta mezera">
              <h3>Rozložení stavů</h3>
              <Rozlozeni r={m.rozlozeni} celkem={m.pocet} />
              <p className="mala muted mezera-s" style={{ marginBottom: 0 }}>
                Pole ve stavu „konflikt“: {m.konflikty.zaznamy.length} záznamy ({m.konflikty.zaznamy.map((z) => z.nazev).join(', ')}).
              </p>
            </div>
          </>
        )}

        <section className="sekce mrizka mrizka-2" style={{ alignItems: 'start' }}>
          <div>
            <div className="eyebrow">TL;DR</div>
            <h2>Shrnutí vypracování</h2>
            <Markdown md={TLDR} />
          </div>
          <div className="pas">
            <div className="eyebrow" style={{ color: '#f2cfcf' }}>
              Původní zadání
            </div>
            <h3>Spoľahlivá databáza investorov</h3>
            <Markdown md={ZADANI.replace(/^>\s?/gm, '').replace(/\*\*Spoľahlivá databáza investorov\*\*\n*/, '')} className="mala" />
          </div>
        </section>

        <section className="sekce">
          <div className="eyebrow">Moduly</div>
          <h2>Co aplikace obsahuje</h2>
          <div className="mrizka mrizka-4 mezera">
            {MODULY.map(([to, nazev, popis], i) => (
              <Link key={to} to={to} className="karta" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="eyebrow" style={{ marginBottom: 6 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3>{nazev}</h3>
                <p className="mala muted" style={{ margin: 0 }}>
                  {popis}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
