import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, useApi } from '../api'
import { useVerze } from '../verze'
import { ChybaBox, Hlavicka, Nacitani } from '../components/Ui'
import { cislo, datumCas, procento } from '../../shared/format'
import type { StavKriteria, VysledekGoNogo, VyhodnoceniKriteria } from '../../shared/gonogo'

const STAV: Record<StavKriteria | 'castecne', [string, string]> = {
  splneno: ['st-ok', 'Splněno'],
  nesplneno: ['st-ne', 'Nesplněno'],
  ceka: ['st-ceka', 'Čeká na data'],
  castecne: ['st-C', 'Částečně'],
}

function Stav({ s, predbezne }: { s: StavKriteria | 'castecne'; predbezne?: boolean }) {
  return (
    <span className={`stitek ${STAV[s][0]}`}>
      {STAV[s][1]}
      {predbezne ? ' · předběžně' : ''}
    </span>
  )
}

function hodnota(k: VyhodnoceniKriteria): string {
  if (k.hodnota == null) return '—'
  switch (k.id) {
    case 'G-4':
      return cislo(k.hodnota, 3, 3)
    case 'G-5':
      return `${cislo(k.hodnota, 1)} min`
    case 'G-8':
      return `${cislo(k.hodnota, 3)} h/záznam`
    case 'G-9':
      return `${cislo(k.hodnota, 1)} Kč/záznam`
    default:
      return procento(k.hodnota)
  }
}

export function GoNogo() {
  const { verze } = useVerze()
  const { data, chyba, nacita, obnov } = useApi<VysledekGoNogo & { kontrolor: string | null }>(`go-nogo?verze=${encodeURIComponent(verze)}`)
  const [edit, setEdit] = useState<string | null>(null)

  return (
    <div className="kontejner stranka">
      <Hlavicka eyebrow="Modul M7" nadpis="Go/no-go">
        <p>
          Kritéria po pilotu (<Link to="/metodika/11">kap. 11 bod 2</Link>) a pro pilot automatizace (<Link to="/metodika/9#k-9-4-6">kap. 9.4.6</Link>). G-1
          a G-2 jsou předběžné, dokud není dokončena <Link to="/kontrola">nezávislá kontrola</Link>; G-6 až G-11 se zadávají ručně z výsledků pilotu
          automatizace.
        </p>
      </Hlavicka>
      {chyba && <ChybaBox chyba={chyba} />}
      {nacita && !data && <Nacitani />}
      {data && (
        <>
          <div className="mrizka mrizka-2">
            <div className="karta">
              <div className="eyebrow">Pilot ČR (kap. 11)</div>
              <h3>
                <Stav s={data.pilot} />
              </h3>
              <p className="mala muted" style={{ margin: 0 }}>
                {data.kontrolor ? `Podle hodnocení kontrolora ${data.kontrolor}.` : 'Bez hodnocení kontrolora.'}
              </p>
            </div>
            <div className="karta">
              <div className="eyebrow">Pilot automatizace (kap. 9.4.6)</div>
              <h3>
                <Stav s={data.automatizace} />
              </h3>
              <p className="mala" style={{ margin: 0 }}>
                {data.doporuceni}
              </p>
            </div>
          </div>

          {(['11', '9.4.6'] as const).map((kap) => (
            <section key={kap} className="sekce">
              <h2>{kap === '11' ? 'Kritéria po pilotu (G-1 až G-5)' : 'Kritéria pilotu automatizace (G-6 až G-11)'}</h2>
              <div className="tabulka-obal">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Kritérium</th>
                      <th>Práh</th>
                      <th className="num">Hodnota</th>
                      <th>Stav</th>
                      <th>Zdroj hodnoty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.kriteria
                      .filter((k) => k.kapitola === kap)
                      .map((k) => (
                        <tr key={k.id}>
                          <td className="nowrap">{k.id}</td>
                          <td>
                            {k.nazev}
                            {k.vstup_data?.poznamka && <div className="mala muted">{k.vstup_data.poznamka}</div>}
                            {edit === k.id && (
                              <VstupForm
                                k={k}
                                zavri={() => setEdit(null)}
                                poUlozeni={() => {
                                  setEdit(null)
                                  obnov()
                                }}
                              />
                            )}
                          </td>
                          <td className="nowrap">{k.prah}</td>
                          <td className="num">
                            {hodnota(k)}
                            {k.detail && <div className="mala muted">{k.detail}</div>}
                          </td>
                          <td>
                            <Stav s={k.stav} predbezne={k.predbezne} />
                          </td>
                          <td className="mala">
                            {k.zdroj}
                            {k.vstup && (
                              <div>
                                <button className="tl tl-text" onClick={() => setEdit(edit === k.id ? null : k.id)}>
                                  {k.vstup_data ? 'Upravit' : 'Zadat'}
                                </button>
                                {k.vstup_data && <span className="muted">{datumCas(k.vstup_data.zadano)}</span>}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
          <p className="mala muted sekce">
            Pro horní mez Wilsonova intervalu &lt;5 % při nulové chybovosti je potřeba ≥73 bezchybných záznamů (G-7). Rozhodnutí po pilotu automatizace
            podle kap. 11 bod 4: vše splněno → model 9.4; částečně → zpřísnit triáž, citlivost 9.4.5 (≈ 19,9 mil. Kč); selhání → model 9.3 (21,1 mil. Kč),
            případně jeho citlivost (≈ 30,7 mil. Kč).
          </p>
        </>
      )}
    </div>
  )
}

function VstupForm({ k, zavri, poUlozeni }: { k: VyhodnoceniKriteria; zavri: () => void; poUlozeni: () => void }) {
  const v = k.vstup_data
  const [citatel, setCitatel] = useState(v?.citatel != null ? String(v.citatel) : '')
  const [jmenovatel, setJmenovatel] = useState(v?.jmenovatel != null ? String(v.jmenovatel) : '')
  const [hod, setHod] = useState(v?.hodnota != null ? String(v.hodnota) : '')
  const [poznamka, setPoznamka] = useState(v?.poznamka ?? '')
  const [chyba, setChyba] = useState<string | null>(null)
  const n = (s: string) => (s.trim() === '' ? null : Number(s.replace(',', '.')))

  async function uloz() {
    try {
      await api(`go-nogo/${k.id}`, { method: 'PUT', body: { citatel: n(citatel), jmenovatel: n(jmenovatel), hodnota: n(hod), poznamka: poznamka || null } })
      poUlozeni()
    } catch (e) {
      setChyba(e instanceof Error ? e.message : String(e))
    }
  }
  async function smaz() {
    await api(`go-nogo/${k.id}`, { method: 'DELETE' })
    poUlozeni()
  }

  return (
    <div className="karta-tint mezera-s">
      <div className="radek">
        {k.vstup === 'hodnota' ? (
          <div className="pole">
            <label>Hodnota ({k.jednotka})</label>
            <input className="cislo-vstup" inputMode="decimal" value={hod} onChange={(e) => setHod(e.target.value)} />
          </div>
        ) : (
          <>
            <div className="pole">
              <label>{k.vstup === 'chybovost' ? 'Počet chyb' : 'Čitatel'}</label>
              <input className="cislo-vstup" inputMode="numeric" value={citatel} onChange={(e) => setCitatel(e.target.value)} />
            </div>
            <div className="pole">
              <label>{k.vstup === 'chybovost' ? 'Auditovaných záznamů' : 'Jmenovatel'}</label>
              <input className="cislo-vstup" inputMode="numeric" value={jmenovatel} onChange={(e) => setJmenovatel(e.target.value)} />
            </div>
          </>
        )}
        <div className="pole" style={{ flex: '1 1 200px' }}>
          <label>Poznámka</label>
          <input value={poznamka} onChange={(e) => setPoznamka(e.target.value)} />
        </div>
      </div>
      <div className="radek-stred mezera-s">
        <button className="tl tl-teal tl-mala" onClick={uloz}>
          Uložit
        </button>
        {v && (
          <button className="tl tl-text" onClick={smaz}>
            Smazat
          </button>
        )}
        <button className="tl tl-text" onClick={zavri}>
          Zrušit
        </button>
        {chyba && <span className="mala" style={{ color: 'var(--red)' }}>{chyba}</span>}
      </div>
    </div>
  )
}
