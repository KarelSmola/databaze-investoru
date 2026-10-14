import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, useApi } from '../api'
import { useVerze } from '../verze'
import { ChybaBox, Hlavicka, Nacitani } from '../components/Ui'
import { datum, datumCas } from '../../shared/format'
import type { VerzeInfo, ZmenaHistorie } from '../../shared/api'

export function Verze() {
  const { verze, seznam, nastav, obnov } = useVerze()
  const [z, setZ] = useState('1.1')
  const [id, setId] = useState('1.2')
  const [popis, setPopis] = useState('')
  const [zprava, setZprava] = useState<string | null>(null)
  const historie = useApi<ZmenaHistorie[]>(`verze/${encodeURIComponent(verze)}/historie`)

  async function vytvor() {
    setZprava('Vytvářím…')
    try {
      const v = await api<VerzeInfo>('verze', { method: 'POST', body: { z, id: id.trim(), popis: popis || undefined } })
      setZprava(`Verze ${v.id} vytvořena jako kopie ${z}.`)
      obnov()
      nastav(v.id)
    } catch (e) {
      setZprava(e instanceof Error ? e.message : String(e))
    }
  }
  async function zmrazit(v: string) {
    if (!window.confirm(`Zmrazit verzi ${v}? Zmrazenou verzi už nelze přes aplikaci měnit.`)) return
    await api(`verze/${encodeURIComponent(v)}/zmrazit`, { method: 'PUT' })
    obnov()
  }

  return (
    <div className="kontejner stranka">
      <Hlavicka eyebrow="Verzování dat" nadpis="Verze dat a historie změn">
        <p>
          Verze 1.1 je zmrazená (<Link to="/metodika/7#k-7-4">kap. 7.4 bod 1</Link>) a jen ke čtení. Změna vzniká jako nová verze; každá úprava záznamu se
          zapíše do historie (datum, autor, pole, stará a nová hodnota, důvod).
        </p>
      </Hlavicka>

      <div className="tabulka-obal">
        <table>
          <thead>
            <tr>
              <th>Verze</th>
              <th>Stav k</th>
              <th>Popis</th>
              <th>Vznikla z</th>
              <th>Vytvořeno</th>
              <th>Stav</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {seznam.map((v) => (
              <tr key={v.id} className={v.id === verze ? 'zvyrazneno' : undefined}>
                <td>v{v.id}</td>
                <td className="nowrap">{datum(v.stav_k)}</td>
                <td className="mala" style={{ fontWeight: 400 }}>
                  {v.popis}
                </td>
                <td>{v.zdrojova_verze ? `v${v.zdrojova_verze}` : '—'}</td>
                <td className="nowrap mala">{datumCas(v.vytvoreno)}</td>
                <td>{v.zmrazeno ? <span className="stitek st-neutral">zmrazeno</span> : <span className="stitek st-C">upravitelná</span>}</td>
                <td className="nowrap">
                  {v.id !== verze && (
                    <button className="tl tl-text" onClick={() => nastav(v.id)}>
                      Zobrazit
                    </button>
                  )}
                  {!v.zmrazeno && (
                    <button className="tl tl-text" onClick={() => zmrazit(v.id)}>
                      Zmrazit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="karta sekce">
        <h3>Nová verze z existující</h3>
        <div className="radek">
          <div className="pole">
            <label>Z verze</label>
            <select value={z} onChange={(e) => setZ(e.target.value)}>
              {seznam.map((v) => (
                <option key={v.id} value={v.id}>
                  v{v.id}
                </option>
              ))}
            </select>
          </div>
          <div className="pole">
            <label>ID nové verze</label>
            <input value={id} onChange={(e) => setId(e.target.value)} style={{ width: 120 }} />
          </div>
          <div className="pole" style={{ flex: '1 1 260px' }}>
            <label>Popis</label>
            <input value={popis} onChange={(e) => setPopis(e.target.value)} placeholder="např. Doplnění sektorů a fází po kontrole" />
          </div>
          <button className="tl tl-primarni" disabled={!id.trim()} onClick={vytvor}>
            Vytvořit verzi
          </button>
        </div>
        {zprava && <p className="mala mezera-s">{zprava}</p>}
        <p className="mala muted mezera-s" style={{ marginBottom: 0 }}>
          Upravovat záznamy lze v detailu záznamu, pokud je v hlavičce vybraná nezmrazená verze.
        </p>
      </div>

      <section className="sekce">
        <h2>Historie změn verze v{verze}</h2>
        {historie.chyba && <ChybaBox chyba={historie.chyba} />}
        {historie.nacita && !historie.data && <Nacitani />}
        {historie.data && !historie.data.length && <p className="muted">Žádné změny.</p>}
        {historie.data && historie.data.length > 0 && (
          <div className="tabulka-obal">
            <table>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Autor</th>
                  <th>Záznam</th>
                  <th>Pole</th>
                  <th>Stará hodnota</th>
                  <th>Nová hodnota</th>
                  <th>Důvod</th>
                </tr>
              </thead>
              <tbody>
                {historie.data.map((h) => (
                  <tr key={h.id}>
                    <td className="nowrap mala">{datumCas(h.zmeneno)}</td>
                    <td>{h.autor}</td>
                    <td>
                      <Link to={`/databaze/${h.entita_id}`}>#{h.entita_id}</Link>
                    </td>
                    <td>
                      <code>{h.pole}</code>
                    </td>
                    <td className="mala">{h.stara_hodnota ?? '—'}</td>
                    <td className="mala">{h.nova_hodnota ?? '—'}</td>
                    <td className="mala">{h.duvod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
