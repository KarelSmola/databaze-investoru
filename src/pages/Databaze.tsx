import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { qs, useApi } from '../api'
import { useVerze } from '../verze'
import { TextSCitacemi, CitaceSeznam } from '../components/Text'
import { ChybaBox, Hlavicka, Nacitani, StupenStitek, Zalozky, stahni, useKotva } from '../components/Ui'
import { KATEGORIE, STAV_AKTIVITY } from '../../shared/ciselniky'
import { PRIZNAKY, type Priznak } from '../../shared/filtry'
import { castka, datum } from '../../shared/format'
import type { SeznamSpravcuOdpoved } from '../../shared/api'

const FILTRY = ['stav', 'stupen', 'skupina', 'kategorie', 'q', 'priznak'] as const

export function Databaze() {
  const { verze } = useVerze()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [q, setQ] = useState(params.get('q') ?? '')
  const zalozka = (params.get('pohled') as 'spravci' | 'kola') ?? 'spravci'
  useKotva()

  // Fulltext s krátkým zpožděním, ať se nedotazujeme na každý stisk klávesy.
  useEffect(() => {
    const t = window.setTimeout(() => {
      if ((params.get('q') ?? '') === q) return
      const p = new URLSearchParams(params)
      if (q) p.set('q', q)
      else p.delete('q')
      setParams(p, { replace: true })
    }, 250)
    return () => window.clearTimeout(t)
  }, [q, params, setParams])

  const filtr = useMemo(() => Object.fromEntries(FILTRY.map((k) => [k, params.get(k) ?? ''])), [params])
  const priznaky = (filtr.priznak ? filtr.priznak.split(',') : []) as Priznak[]
  const { data, chyba, nacita } = useApi<SeznamSpravcuOdpoved>(`spravci${qs({ verze, ...filtr })}`)

  const nastav = (k: string, v: string) => {
    const p = new URLSearchParams(params)
    if (v) p.set(k, v)
    else p.delete(k)
    setParams(p, { replace: true })
  }
  const prepniPriznak = (pr: Priznak) => {
    const nove = priznaky.includes(pr) ? priznaky.filter((x) => x !== pr) : [...priznaky, pr]
    nastav('priznak', nove.join(','))
  }
  const filtrovano = FILTRY.some((k) => filtr[k])
  const exportUrl = (format: 'csv' | 'json') => `/api/export${qs({ format, verze, ...filtr })}`
  const vse = useApi<SeznamSpravcuOdpoved>(zalozka === 'kola' ? `spravci${qs({ verze })}` : null)

  return (
    <div className="kontejner stranka">
      <Hlavicka eyebrow={`Modul M2 · data v${verze}`} nadpis="Pilotní databáze">
        <p>
          30 VC subjektů a 25 kol financování (stav k 11. 10. 2026). Texty sloupců jsou doslovně podle tabulky{' '}
          <Link to="/metodika/7#k-7-1">kap. 7.1</Link>, citace vedou na zdroje. Částka kola je atribut kola, nikdy tiket investora (
          <Link to="/metodika/3#k-3-2">kap. 3.2</Link>).
        </p>
      </Hlavicka>

      <Zalozky
        hodnoty={[
          ['spravci', 'Investoři (správci)'],
          ['kola', 'Kola financování'],
        ]}
        aktivni={zalozka}
        zmen={(z) => nastav('pohled', z === 'spravci' ? '' : z)}
      />

      {zalozka === 'spravci' && (
        <>
          <div className="filtry">
            <div className="pole">
              <label htmlFor="q">Fulltext</label>
              <input id="q" type="search" placeholder="Investor, další názvy, financovaná firma…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="pole">
              <label htmlFor="stav">Stav aktivity</label>
              <select id="stav" value={filtr.stav} onChange={(e) => nastav('stav', e.target.value)}>
                <option value="">Vše</option>
                {Object.entries(STAV_AKTIVITY).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div className="pole">
              <label htmlFor="stupen">Stupeň</label>
              <select id="stupen" value={filtr.stupen} onChange={(e) => nastav('stupen', e.target.value)}>
                <option value="">Vše</option>
                {['A', 'B', 'C', 'X'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option value="null">bez stupně (watchlist)</option>
              </select>
            </div>
            <div className="pole">
              <label htmlFor="skupina">Skupina relevance</label>
              <select id="skupina" value={filtr.skupina} onChange={(e) => nastav('skupina', e.target.value)}>
                <option value="">Vše</option>
                <option value="1">1 – působí z ČR</option>
                <option value="2a">2a – investice do české PO</option>
                <option value="2b">2b – firma s českými zakladateli</option>
                <option value="null">neuvedena</option>
              </select>
            </div>
            <div className="pole">
              <label htmlFor="kategorie">Kategorie</label>
              <select id="kategorie" value={filtr.kategorie} onChange={(e) => nastav('kategorie', e.target.value)}>
                <option value="">Vše</option>
                {Object.entries(KATEGORIE).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="radek-stred" style={{ marginBottom: 16, justifyContent: 'space-between' }}>
            <div className="radek-stred">
              {(Object.keys(PRIZNAKY) as Priznak[]).map((p) => (
                <label key={p} className="zaskrt">
                  <input type="checkbox" checked={priznaky.includes(p)} onChange={() => prepniPriznak(p)} />
                  {PRIZNAKY[p]}
                </label>
              ))}
            </div>
            <div className="radek-stred">
              {filtrovano && (
                <button
                  className="tl tl-text"
                  onClick={() => {
                    setQ('')
                    setParams(new URLSearchParams(), { replace: true })
                  }}
                >
                  Zrušit filtry
                </button>
              )}
              <button className="tl tl-obrys tl-mala" onClick={() => stahni(exportUrl('csv'))}>
                Export CSV{filtrovano ? ' (výběr)' : ''}
              </button>
              <button className="tl tl-obrys tl-mala" onClick={() => stahni(exportUrl('json'))}>
                Export JSON{filtrovano ? ' (výběr)' : ''}
              </button>
            </div>
          </div>

          {chyba && <ChybaBox chyba={chyba} />}
          {nacita && !data && <Nacitani />}
          {data && (
            <>
              <p className="mala muted">
                Zobrazeno {data.spravci.length} z {data.celkem} záznamů.
              </p>
              <div className="tabulka-obal" style={{ opacity: nacita ? 0.6 : 1 }}>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Subjekt</th>
                      <th>Sk.</th>
                      <th>Doložená investice (firma, kolo, kolo celkem)</th>
                      <th>Datum / zdroj</th>
                      <th>Fond (typ, datum)</th>
                      <th>Tiket (deklarovaný)</th>
                      <th>Stav</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.spravci.map((s) => (
                      <tr key={s.id} className="klik" onClick={(e) => !(e.target as HTMLElement).closest('a') && navigate(`/databaze/${s.id}`)}>
                        <td className="num">{s.id}</td>
                        <td style={{ minWidth: 170 }}>
                          <Link to={`/databaze/${s.id}`} style={{ fontWeight: 600 }}>
                            {s.subjekt_text}
                          </Link>
                          <div className="mala muted">{KATEGORIE[s.kategorie]}</div>
                        </td>
                        <td>{s.skupina_text}</td>
                        <td className="siroky">
                          <TextSCitacemi text={s.investice_text} />
                        </td>
                        <td style={{ minWidth: 150 }}>
                          <TextSCitacemi text={s.datum_zdroj_text} />
                        </td>
                        <td className="siroky">
                          <TextSCitacemi text={s.fond_text} />
                        </td>
                        <td style={{ minWidth: 150 }}>
                          <TextSCitacemi text={s.tiket_text} />
                        </td>
                        <td style={{ minWidth: 140 }}>
                          <StupenStitek stupen={s.stupen} stav={s.stav_aktivity} />
                          {s.stav_text !== s.stupen && (
                            <div className="mala muted mezera-s">
                              <TextSCitacemi text={s.stav_text} />
                            </div>
                          )}
                          {s.stav_aktivity !== 'aktivni' && s.poznamka_stupne && (
                            <div className="mala mezera-s" style={{ color: 'var(--red-d)' }}>
                              <TextSCitacemi text={s.poznamka_stupne} />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {!data.spravci.length && (
                      <tr>
                        <td colSpan={8} className="muted">
                          Žádný záznam neodpovídá filtrům.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {zalozka === 'kola' && vse.nacita && !vse.data && <Nacitani />}
      {zalozka === 'kola' && vse.chyba && <ChybaBox chyba={vse.chyba} />}
      {zalozka === 'kola' && vse.data && (
        <div className="tabulka-obal">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Firma</th>
                <th>Kolo</th>
                <th className="num">Kolo celkem</th>
                <th>Publikace</th>
                <th>Investoři v databázi</th>
                <th>Zdroje</th>
              </tr>
            </thead>
            <tbody>
              {vse.data.kola.map((k) => (
                <tr key={k.id} className="klik" onClick={(e) => !(e.target as HTMLElement).closest('a') && navigate(`/kola/${k.id}`)}>
                  <td>{k.id}</td>
                  <td>
                    <Link to={`/kola/${k.id}`} style={{ fontWeight: 600 }}>
                      {k.firma}
                    </Link>
                    {k.zeme_firmy && <span className="muted"> ({k.zeme_firmy})</span>}
                  </td>
                  <td>{k.kolo ?? '—'}</td>
                  <td className="num">{k.castka_text ?? castka(k.castka_kola, k.mena)}</td>
                  <td className="nowrap">{datum(k.datum_publikace)}</td>
                  <td>
                    {vse.data!.spravci
                      .filter((s) => s.ucasti.some((u) => u.kolo_id === k.id))
                      .map((s) => s.nazev)
                      .join(', ')}
                  </td>
                  <td>
                    <CitaceSeznam cisla={k.zdroje} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
