import { Link } from 'react-router-dom'
import { useApi } from '../api'
import { useVerze } from '../verze'
import { Rozlozeni } from '../components/Rozlozeni'
import { VysledkyKontrolyPanel } from '../components/VysledkyKontroly'
import { ChybaBox, Hlavicka, IntervalPas, Nacitani, Podilu, useKotva, Wilson } from '../components/Ui'
import type { Metrika, MetrikyPilotu, ZaznamRef } from '../../shared/metriky'
import type { MetrikyOdpoved } from '../typyOdpovedi'

const PRAHY: Record<string, number> = { presnost_zarazeni: 0.85, ab_primarni_doklad: 1 }

function Cipy({ z }: { z: ZaznamRef[] }) {
  if (!z.length) return <span className="muted mala">žádné</span>
  return (
    <div className="cipy">
      {z.map((x) => (
        <Link key={x.id} className="cip" to={`/databaze/${x.id}`}>
          #{x.id} {x.nazev}
        </Link>
      ))}
    </div>
  )
}

function MetrikaKarta({ m }: { m: Metrika }) {
  return (
    <div className="karta" id={m.id}>
      <div className="radek-stred" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h3 style={{ margin: 0 }}>{m.nazev}</h3>
        <span className="kpi-hodnota" style={{ fontSize: 26 }}>
          <Podilu p={m.vysledek} />
        </span>
      </div>
      <p className="mala muted" style={{ margin: '6px 0 0' }}>
        {m.popis} Wilsonův 95% interval <b style={{ color: 'var(--teal)' }}>{<Wilson p={m.vysledek} />}</b>
        {PRAHY[m.id] != null && ' · čárkovaně práh go/no-go'}.
      </p>
      <IntervalPas p={m.vysledek} prah={m.id === 'presnost_zarazeni' ? PRAHY[m.id] : undefined} />
      <div className="mrizka mrizka-2 mezera-s">
        <div>
          <div className="mala" style={{ fontWeight: 600, marginBottom: 6 }}>
            V čitateli ({m.citatel.length})
          </div>
          <Cipy z={m.citatel} />
        </div>
        {m.skupiny ? (
          m.skupiny.map((s) => (
            <div key={s.nazev}>
              <div className="mala" style={{ fontWeight: 600, marginBottom: 6 }}>
                {s.nazev} ({s.zaznamy.length})
              </div>
              <Cipy z={s.zaznamy} />
            </div>
          ))
        ) : (
          <div>
            <div className="mala" style={{ fontWeight: 600, marginBottom: 6 }}>
              Kritérium nesplňuje ({m.nesplnuje.length})
            </div>
            <Cipy z={m.nesplnuje} />
          </div>
        )}
      </div>
    </div>
  )
}

function Sada({ m }: { m: MetrikyPilotu }) {
  return (
    <>
      <div className="karta">
        <h3>Rozložení stavů</h3>
        <Rozlozeni r={m.rozlozeni} celkem={m.pocet} />
      </div>
      <div className="kroky mezera">
        {m.metriky.map((x) => (
          <MetrikaKarta key={x.id} m={x} />
        ))}
        <div className="karta" id="konflikt">
          <h3>Pole ve stavu „konflikt“</h3>
          <p className="mala muted">
            Nerozhodnutelný rozpor zdrojů: uvedou se obě hodnoty se stavem „konflikt“ (<Link to="/metodika/5">kap. 5</Link>). Záznamů:{' '}
            {m.konflikty.zaznamy.length}, polí: {m.konflikty.pocetPoli}.
          </p>
          <Cipy z={m.konflikty.zaznamy} />
        </div>
      </div>
    </>
  )
}

export function Metriky() {
  const { verze } = useVerze()
  const { data, chyba, nacita } = useApi<MetrikyOdpoved>(`metriky?verze=${encodeURIComponent(verze)}`)
  useKotva(!!data)

  return (
    <div className="kontejner stranka">
      <Hlavicka eyebrow={`Modul M5 · data v${verze}`} nadpis="Metriky pilotu">
        <p>
          Metriky <Link to="/metodika/7#k-7-3">kap. 7.3</Link> počítané z dat včetně Wilsonových 95% intervalů a jmenovitých seznamů záznamů, aby šly
          přepočítat. Metriky tiketu a fondu se počítají jen ze stupně A.
        </p>
      </Hlavicka>
      {chyba && <ChybaBox chyba={chyba} />}
      {nacita && !data && <Nacitani />}
      {data && (
        <>
          {!data.kontrola?.dokonceno && (
            <div className="upozorneni" style={{ marginBottom: 20 }}>
              <b>Předběžné – bez nezávislé kontroly.</b> Hodnotila jedna osoba; „skutečný investor“ je předběžné hodnocení autora. Po dokončení kontroly se
              přesnost zařazení přepočítá podle rozhodnutí kontrolora.
            </div>
          )}
          {data.poKontrole ? (
            <>
              <h2>Po nezávislé kontrole</h2>
              <Sada m={data.poKontrole} />
              <h2 className="sekce">Předběžné (verze dat)</h2>
              <Sada m={data.predbezne} />
            </>
          ) : (
            <Sada m={data.predbezne} />
          )}

          <div className="info mezera">
            Čas na jeden záznam se v této rešerši kontrolovaně neměřil, údaj proto chybí. Měřit se bude v kontrolní fázi.
          </div>

          <section className="sekce" id="kontrola">
            <h2>Metriky nezávislé kontroly (kap. 7.4 bod 4)</h2>
            {data.kontrola ? (
              <VysledkyKontrolyPanel v={data.kontrola} />
            ) : (
              <p className="muted">
                Zatím žádné hodnocení kontrolora. Kontrolu naslepo lze provést v modulu <Link to="/kontrola">Nezávislá kontrola</Link>.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  )
}
