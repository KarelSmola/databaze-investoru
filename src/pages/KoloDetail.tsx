import { Link, useParams } from 'react-router-dom'
import { useApi } from '../api'
import { useVerze } from '../verze'
import { Doklady } from '../components/Doklady'
import { TextSCitacemi } from '../components/Text'
import { ChybaBox, Nacitani, StupenStitek } from '../components/Ui'
import { castka, datum } from '../../shared/format'
import type { DetailKolaOdpoved } from '../../shared/api'
import type { StavAktivity, Stupen } from '../../shared/typy'

export function KoloDetail() {
  const { id } = useParams()
  const { verze } = useVerze()
  const { data, chyba, nacita } = useApi<DetailKolaOdpoved>(`kola/${id}?verze=${encodeURIComponent(verze)}`)
  return (
    <div className="kontejner stranka">
      <div className="mala" style={{ marginBottom: 14 }}>
        <Link to="/databaze?pohled=kola">← Kola financování</Link>
      </div>
      {chyba && <ChybaBox chyba={chyba} />}
      {nacita && !data && <Nacitani />}
      {data && (
        <>
          <div className="eyebrow">
            Kolo {data.kolo.id} · data v{data.verze.id}
          </div>
          <h1>
            {data.kolo.firma}
            {data.kolo.zeme_firmy && <span className="muted"> ({data.kolo.zeme_firmy})</span>}
          </h1>
          <div className="mrizka mrizka-2" style={{ alignItems: 'start' }}>
            <div className="karta">
              <dl className="vlastnosti">
                <dt>Kolo</dt>
                <dd>{data.kolo.kolo ?? '—'}</dd>
                <dt>Částka kola (celkem)</dt>
                <dd>
                  <b>{data.kolo.castka_text ?? castka(data.kolo.castka_kola, data.kolo.mena)}</b>
                </dd>
                <dt>IČO firmy</dt>
                <dd>{data.kolo.ico_firmy ?? '—'}</dd>
                <dt>Datum události</dt>
                <dd>{datum(data.kolo.datum_udalosti)}</dd>
                <dt>Datum publikace</dt>
                <dd>{datum(data.kolo.datum_publikace)}</dd>
                <dt>Doklady</dt>
                <dd>
                  <Doklady doklady={data.kolo.doklady} />
                </dd>
              </dl>
            </div>
            <div className="info">
              Částka kola je atribut kola a uloží se jen jednou. Nikdy se nezobrazuje jako tiket investora a nesčítá se přes investory; podíly
              jednotlivých investorů zveřejněny nejsou (<Link to="/metodika/3#k-3-2">kap. 3.2</Link>).
              {data.kolo.poznamka && (
                <p style={{ margin: '8px 0 0' }}>
                  <TextSCitacemi text={data.kolo.poznamka} />
                </p>
              )}
            </div>
          </div>
          <section className="sekce">
            <h2>Účastníci z databáze ({data.ucastnici.length})</h2>
            <div className="tabulka-obal">
              <table>
                <thead>
                  <tr>
                    <th>Investor</th>
                    <th>Stupeň</th>
                    <th>Role</th>
                    <th>Podíl</th>
                    <th>Primární doklad</th>
                    <th>Doklady</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ucastnici.map(({ spravce, ucast }) => (
                    <tr key={ucast.id}>
                      <td>
                        <Link to={`/databaze/${spravce.id}`} style={{ fontWeight: 600 }}>
                          #{spravce.id} {spravce.nazev}
                        </Link>
                      </td>
                      <td>
                        <StupenStitek stupen={spravce.stupen as Stupen | null} stav={spravce.stav_aktivity as StavAktivity} />
                      </td>
                      <td>{ucast.role ?? <span className="muted">neuvedeno</span>}</td>
                      <td>{ucast.podil_castka != null ? castka(ucast.podil_castka, data.kolo.mena) : 'nezveřejněno'}</td>
                      <td>{ucast.primarni_doklad ? <span className="stitek st-ok">ano</span> : <span className="stitek st-ne">ne</span>}</td>
                      <td>
                        <Doklady doklady={ucast.doklady} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
