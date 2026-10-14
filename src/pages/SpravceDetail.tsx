import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, useApi } from '../api'
import { useVerze } from '../verze'
import { CastkaRadek } from '../components/Castka'
import { Doklady } from '../components/Doklady'
import { CitaceSeznam, TextSCitacemi } from '../components/Text'
import { ChybaBox, Nacitani, StupenStitek, useKotva } from '../components/Ui'
import { KATEGORIE, STAV_AKTIVITY, TYP_UDALOSTI } from '../../shared/ciselniky'
import { castka, datum } from '../../shared/format'
import type { DetailSpravceOdpoved, SpravceApi } from '../../shared/api'

const SKUPINA: Record<string, string> = { '1': '1 – působí z ČR', '2a': '2a – investice do české PO', '2b': '2b – zahraniční firma s českými zakladateli' }

export function SpravceDetail() {
  const { id } = useParams()
  const { verze, info } = useVerze()
  const { data, chyba, nacita, obnov } = useApi<DetailSpravceOdpoved>(`spravci/${id}?verze=${encodeURIComponent(verze)}`)
  useKotva(!!data)

  if (chyba)
    return (
      <div className="kontejner stranka">
        <ChybaBox chyba={chyba} />
      </div>
    )
  if (nacita && !data)
    return (
      <div className="kontejner stranka">
        <Nacitani />
      </div>
    )
  if (!data) return null
  const s = data.spravce
  const kolo = new Map(data.kola.map((k) => [k.id, k]))

  return (
    <div className="kontejner stranka">
      <div className="mala" style={{ marginBottom: 14 }}>
        <Link to="/databaze">← Pilotní databáze</Link>
      </div>
      <div className="eyebrow">
        Záznam #{s.id} · data v{data.verze.id}
      </div>
      <h1>{s.nazev}</h1>
      <div className="radek-stred" style={{ marginBottom: 18 }}>
        <StupenStitek stupen={s.stupen} stav={s.stav_aktivity} />
        <span className="stitek st-neutral">{KATEGORIE[s.kategorie]}</span>
        <span className="stitek st-neutral">Stav: {STAV_AKTIVITY[s.stav_aktivity]}</span>
        <span className="stitek st-neutral">Skupina {s.skupina_relevance ?? '—'}</span>
        {s.kontrolni_negativni_pripad && <span className="stitek st-W">Kontrolní negativní případ</span>}
      </div>
      {s.poznamka_stupne && (
        <div className={s.stav_aktivity === 'aktivni' ? 'info' : 'upozorneni'} style={{ marginBottom: 20 }}>
          <b>Poznámka ke stupni:</b> <TextSCitacemi text={s.poznamka_stupne} />
        </div>
      )}

      <div className="mrizka mrizka-2" style={{ alignItems: 'start' }}>
        <div className="karta">
          <h3>Identita</h3>
          <dl className="vlastnosti">
            <dt>Subjekt (kap. 7.1)</dt>
            <dd>{s.subjekt_text}</dd>
            <dt>Dřívější a další názvy</dt>
            <dd>{s.dalsi_nazvy.length ? s.dalsi_nazvy.join(', ') : '—'}</dd>
            <dt>Typ osoby</dt>
            <dd>{s.typ_osoby === 'PO' ? 'Právnická osoba' : 'Fyzická osoba'}</dd>
            <dt>Česká relevance</dt>
            <dd>{s.skupina_relevance ? SKUPINA[s.skupina_relevance] : '—'}</dd>
            <dt>IČO / LEI / země</dt>
            <dd>
              {s.ico ?? '—'} / {s.lei ?? '—'} / {s.zeme ?? '—'}
            </dd>
            <dt>Sektory, fáze</dt>
            <dd>
              {s.sektory.length || s.faze.length ? (
                `${s.sektory.join(', ') || '—'}; ${s.faze.join(', ') || '—'}`
              ) : (
                <span className="muted">pilot neobsahuje (O-6), doplní kontrola nebo v1.2</span>
              )}
            </dd>
            {s.doklady_zaznamu.length > 0 && (
              <>
                <dt>Doklady k záznamu</dt>
                <dd>
                  <Doklady doklady={s.doklady_zaznamu} />
                </dd>
              </>
            )}
          </dl>
        </div>
        <div className="karta">
          <h3>Tiket a fondy</h3>
          <dl className="vlastnosti">
            <dt>Tiket (kap. 7.1)</dt>
            <dd>
              <TextSCitacemi text={s.tiket_text} />
            </dd>
            <dt>Tiket – struktura</dt>
            <dd>
              <CastkaRadek c={s.tiket} />
            </dd>
            <dt>Fond (kap. 7.1)</dt>
            <dd>
              <TextSCitacemi text={s.fond_text} />
            </dd>
            {s.fondy.map((f) => (
              <FondBlok key={f.id} f={f} />
            ))}
          </dl>
        </div>
      </div>

      <section className="sekce">
        <h2>Účasti v kolech financování</h2>
        <p className="muted mala">
          Částka kola je velikost celého kola, ne tiket investora; přes investory se nesčítá (<Link to="/metodika/3#k-3-2">kap. 3.2</Link>).
        </p>
        {s.ucasti.length ? (
          <div className="tabulka-obal">
            <table>
              <thead>
                <tr>
                  <th>Firma</th>
                  <th>Kolo</th>
                  <th className="num">Kolo celkem</th>
                  <th>Role</th>
                  <th>Podíl investora</th>
                  <th>Primární doklad</th>
                  <th>Doklady</th>
                  <th>Spoluinvestoři v databázi</th>
                </tr>
              </thead>
              <tbody>
                {s.ucasti.map((u) => {
                  const k = kolo.get(u.kolo_id)
                  return (
                    <tr key={u.id}>
                      <td>
                        <Link to={`/kola/${u.kolo_id}`} style={{ fontWeight: 600 }}>
                          {k?.firma ?? u.kolo_id}
                        </Link>
                        {k?.zeme_firmy && <span className="muted"> ({k.zeme_firmy})</span>}
                        {u.poznamka && <div className="mala muted">{u.poznamka}</div>}
                      </td>
                      <td>{k?.kolo ?? '—'}</td>
                      <td className="num">kolo celkem {k?.castka_text ?? castka(k?.castka_kola, k?.mena)}</td>
                      <td>{u.role ?? <span className="muted">neuvedeno</span>}</td>
                      <td>{u.podil_castka != null ? castka(u.podil_castka, k?.mena) : u.podil_stav === 'nezverejneno' ? 'nezveřejněno' : u.podil_stav}</td>
                      <td>{u.primarni_doklad ? <span className="stitek st-ok">ano</span> : <span className="stitek st-ne">ne</span>}</td>
                      <td style={{ minWidth: 240 }}>
                        <Doklady doklady={u.doklady} />
                      </td>
                      <td className="mala">
                        {(data.spoluinvestori[u.kolo_id] ?? []).map((x, i) => (
                          <span key={x.id}>
                            {i > 0 && ', '}
                            <Link to={`/databaze/${x.id}`}>{x.nazev}</Link>
                            {x.role === 'lead' && ' (lead)'}
                          </span>
                        ))}
                        {!(data.spoluinvestori[u.kolo_id] ?? []).length && <span className="muted">—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">Žádná doložená účast v kole financování.</p>
        )}
        <p className="mala mezera-s">
          <b>Text kap. 7.1:</b> <TextSCitacemi text={s.investice_text} /> · <b>Datum / zdroj:</b> <TextSCitacemi text={s.datum_zdroj_text} />
        </p>
      </section>

      {s.udalosti.length > 0 && (
        <section className="sekce">
          <h2>Ostatní události</h2>
          <p className="muted mala">Exit, závazek LP nebo doklad jen z agregátoru se jako doklad o investici do firmy nepočítají.</p>
          <div className="tabulka-obal">
            <table>
              <thead>
                <tr>
                  <th>Typ</th>
                  <th>Firma</th>
                  <th className="num">Částka</th>
                  <th>Událost</th>
                  <th>Zdroj</th>
                </tr>
              </thead>
              <tbody>
                {s.udalosti.map((u) => (
                  <tr key={u.id}>
                    <td>{TYP_UDALOSTI[u.typ_udalosti]}</td>
                    <td>{u.firma ?? '—'}</td>
                    <td className="num">{castka(u.castka, u.mena)}</td>
                    <td>{datum(u.datum_udalosti)}</td>
                    <td>
                      {u.zdroj_text ?? '—'} <CitaceSeznam cisla={u.zdroje} />
                      {u.datum_publikace && <span className="muted mala"> · {datum(u.datum_publikace)}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="sekce mrizka mrizka-2" style={{ alignItems: 'start' }}>
        <div className="karta-tint">
          <h3>Příznaky metrik (kap. 7.3)</h3>
          <dl className="vlastnosti">
            <dt>Primární doklad ≤24 měsíců</dt>
            <dd>{ano(s.ma_primarni_doklad_24m)}</dd>
            <dt>Skutečný investor (předběžně)</dt>
            <dd>{ano(s.je_skutecny_investor_predbezne)}</dd>
            <dt>Deklarovaný tiket</dt>
            <dd>{ano(s.tiket_deklarovany)}</dd>
            <dt>Fond s typem a datem</dt>
            <dd>{ano(s.fond_s_typem_a_datem)}</dd>
            <dt>Částka fondu uvedena</dt>
            <dd>{ano(s.fond_castka_uvedena)}</dd>
          </dl>
        </div>
        <div className="karta-tint">
          <h3>Opravy z kap. 7.2</h3>
          {s.opravy_7_2.length ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {s.opravy_7_2.map((o, i) => (
                <li key={i}>
                  <TextSCitacemi text={o} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted" style={{ margin: 0 }}>
              Žádné opravy.
            </p>
          )}
        </div>
      </section>

      {info && !info.zmrazeno && <UpravaZaznamu s={s} verze={verze} poUlozeni={obnov} />}
      {info?.zmrazeno && (
        <p className="mala muted sekce">
          Verze {verze} je zmrazená a jen ke čtení. Změny se dělají v nové verzi (<Link to="/verze">Verze dat</Link>).
        </p>
      )}
    </div>
  )
}

function ano(v: boolean | null) {
  if (v == null) return <span className="muted">— (počítá se jen u stupně A)</span>
  return v ? <span className="stitek st-ok">ano</span> : <span className="stitek st-ne">ne</span>
}

function FondBlok({ f }: { f: SpravceApi['fondy'][number] }) {
  return (
    <>
      <dt>{f.nazev ?? 'Fond'}</dt>
      <dd style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {f.hodnoty.map((h) => (
          <CastkaRadek key={h.id} c={h} />
        ))}
        {f.poznamka && <span className="mala muted">{f.poznamka}</span>}
      </dd>
    </>
  )
}

/** Úprava záznamu v nezmrazené verzi; každá změna se zapíše do historie (FR-17). */
function UpravaZaznamu({ s, verze, poUlozeni }: { s: SpravceApi; verze: string; poUlozeni: () => void }) {
  const [f, setF] = useState({
    stupen: s.stupen ?? '',
    stav_aktivity: s.stav_aktivity,
    kategorie: s.kategorie,
    skupina_relevance: s.skupina_relevance ?? '',
    poznamka_stupne: s.poznamka_stupne ?? '',
    ico: s.ico ?? '',
    zeme: s.zeme ?? '',
    sektory: s.sektory.join(', '),
    faze: s.faze.join(', '),
  })
  const [duvod, setDuvod] = useState('')
  const [autor, setAutor] = useState('')
  const [stav, setStav] = useState<string | null>(null)
  const seznam = (t: string) =>
    t
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)

  async function uloz() {
    setStav('Ukládám…')
    try {
      const r = await api<{ zmeneno: number }>(`spravci/${s.id}?verze=${encodeURIComponent(verze)}`, {
        method: 'PATCH',
        body: {
          zmeny: {
            stupen: f.stupen || null,
            stav_aktivity: f.stav_aktivity,
            kategorie: f.kategorie,
            skupina_relevance: f.skupina_relevance || null,
            poznamka_stupne: f.poznamka_stupne || null,
            ico: f.ico || null,
            zeme: f.zeme || null,
            sektory: seznam(f.sektory),
            faze: seznam(f.faze),
          },
          duvod,
          autor,
        },
      })
      setStav(r.zmeneno ? `Uloženo, změněno polí: ${r.zmeneno}.` : 'Beze změny.')
      setDuvod('')
      poUlozeni()
    } catch (e) {
      setStav(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <section className="sekce karta">
      <h3>Upravit záznam ve verzi {verze}</h3>
      <p className="mala muted">Každá změna se uloží do historie (datum, autor, pole, stará a nová hodnota, důvod).</p>
      <div className="filtry">
        <div className="pole">
          <label>Stupeň</label>
          <select value={f.stupen} onChange={(e) => setF({ ...f, stupen: e.target.value })}>
            <option value="">— (watchlist)</option>
            {['A', 'B', 'C', 'X'].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <div className="pole">
          <label>Stav aktivity</label>
          <select value={f.stav_aktivity} onChange={(e) => setF({ ...f, stav_aktivity: e.target.value as typeof f.stav_aktivity })}>
            {Object.entries(STAV_AKTIVITY).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="pole">
          <label>Kategorie</label>
          <select value={f.kategorie} onChange={(e) => setF({ ...f, kategorie: e.target.value as typeof f.kategorie })}>
            {Object.entries(KATEGORIE).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="pole">
          <label>Skupina relevance</label>
          <select value={f.skupina_relevance} onChange={(e) => setF({ ...f, skupina_relevance: e.target.value })}>
            <option value="">—</option>
            <option value="1">1</option>
            <option value="2a">2a</option>
            <option value="2b">2b</option>
          </select>
        </div>
        <div className="pole">
          <label>IČO</label>
          <input value={f.ico} onChange={(e) => setF({ ...f, ico: e.target.value })} />
        </div>
        <div className="pole">
          <label>Země</label>
          <input value={f.zeme} onChange={(e) => setF({ ...f, zeme: e.target.value })} />
        </div>
        <div className="pole">
          <label>Sektory (čárkou)</label>
          <input value={f.sektory} onChange={(e) => setF({ ...f, sektory: e.target.value })} />
        </div>
        <div className="pole">
          <label>Fáze (čárkou)</label>
          <input value={f.faze} onChange={(e) => setF({ ...f, faze: e.target.value })} />
        </div>
      </div>
      <div className="pole" style={{ marginBottom: 12 }}>
        <label>Poznámka ke stupni</label>
        <textarea rows={2} value={f.poznamka_stupne} onChange={(e) => setF({ ...f, poznamka_stupne: e.target.value })} />
      </div>
      <div className="radek">
        <div className="pole" style={{ flex: '2 1 280px' }}>
          <label>Důvod změny *</label>
          <input value={duvod} onChange={(e) => setDuvod(e.target.value)} />
        </div>
        <div className="pole" style={{ flex: '1 1 160px' }}>
          <label>Autor *</label>
          <input value={autor} onChange={(e) => setAutor(e.target.value)} />
        </div>
        <button className="tl tl-primarni" disabled={!duvod.trim() || !autor.trim()} onClick={uloz}>
          Uložit změny
        </button>
      </div>
      {stav && <p className="mala mezera-s">{stav}</p>}
    </section>
  )
}
