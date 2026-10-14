import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, nactiLokalne, qs, ulozLokalne, useApi } from '../api'
import { useVerze } from '../verze'
import { CastkaRadek } from '../components/Castka'
import { Doklady } from '../components/Doklady'
import { TextSCitacemi } from '../components/Text'
import { VysledkyKontrolyPanel } from '../components/VysledkyKontroly'
import { ChybaBox, Hlavicka, Nacitani, StupenStitek, Zalozky, stahni } from '../components/Ui'
import { KATEGORIE, ROZHODNUTI_NAZEV, TYP_CHYBY, TYP_UDALOSTI } from '../../shared/ciselniky'
import { castka, cislo, datum, procento } from '../../shared/format'
import { ROZHODNUTI, type Rozhodnuti, type TypChyby } from '../../shared/typy'
import { POLE_KONTROLY, type KoloApi, type PoleKontroly, type ReferencniPolozka, type VerzeInfo, type ZaznamKontrolora } from '../../shared/api'
import type { VysledkyKontroly } from '../../shared/kontrola'

interface ZaznamyOdpoved {
  verze: VerzeInfo
  kontrolor: string
  zaznamy: ZaznamKontrolora[]
  kola: KoloApi[]
}

type Zalozka = 'hodnoceni' | 'vysledky' | 'referencni'

export function Kontrola() {
  const { verze } = useVerze()
  const [params, setParams] = useSearchParams()
  const zalozka = (params.get('z') as Zalozka) ?? 'hodnoceni'
  const [kontrolor, setKontrolor] = useState(() => nactiLokalne('kontrolor') ?? '')
  const [jmeno, setJmeno] = useState(kontrolor)

  const prihlas = () => {
    const j = jmeno.trim()
    ulozLokalne('kontrolor', j || null)
    setKontrolor(j)
  }

  return (
    <div className="kontejner stranka">
      <Hlavicka eyebrow={`Modul M6 · data v${verze}`} nadpis="Nezávislá kontrola">
        <p>
          Šablona <Link to="/metodika/7#k-7-4">kap. 7.4</Link>: druhá osoba naslepo zkontroluje všech 30 záznamů a doklady. Dokud kontrolor záznam neohodnotí,
          API mu nevrací stupeň, stav, poznámky ke stupni ani příznaky metrik.
        </p>
      </Hlavicka>

      <div className="karta-tint radek" style={{ marginBottom: 22 }}>
        <div className="pole" style={{ flex: '1 1 240px' }}>
          <label htmlFor="kontrolor">Jméno kontrolora</label>
          <input id="kontrolor" value={jmeno} onChange={(e) => setJmeno(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && prihlas()} placeholder="např. Jana Nováková" />
        </div>
        <button className="tl tl-teal" onClick={prihlas} disabled={!jmeno.trim() || jmeno.trim() === kontrolor}>
          {kontrolor ? 'Změnit kontrolora' : 'Začít kontrolu'}
        </button>
        {kontrolor && (
          <span className="mala muted">
            Hodnotí: <b>{kontrolor}</b> (bez přihlášení; role a přihlašování se řeší později, O-1)
          </span>
        )}
      </div>

      <Zalozky<Zalozka>
        hodnoty={[
          ['hodnoceni', 'Hodnocení naslepo'],
          ['vysledky', 'Výsledky'],
          ['referencni', 'Referenční seznam (záchyt)'],
        ]}
        aktivni={zalozka}
        zmen={(z) => setParams(z === 'hodnoceni' ? {} : { z }, { replace: true })}
      />

      {zalozka === 'hodnoceni' &&
        (kontrolor ? <Hodnoceni verze={verze} kontrolor={kontrolor} /> : <p className="muted">Zadejte jméno kontrolora a začněte kontrolu.</p>)}
      {zalozka === 'vysledky' && <Vysledky verze={verze} kontrolor={kontrolor} />}
      {zalozka === 'referencni' && <Referencni verze={verze} />}
    </div>
  )
}

function Hodnoceni({ verze, kontrolor }: { verze: string; kontrolor: string }) {
  const { data, chyba, nacita, obnov } = useApi<ZaznamyOdpoved>(`kontrola/zaznamy${qs({ verze, kontrolor })}`)
  const [vybrany, setVybrany] = useState<number | null>(null)
  const zaznamy = useMemo(() => data?.zaznamy ?? [], [data])
  const hotovo = zaznamy.filter((z) => z.hodnoceni).length
  const aktivni = zaznamy.find((z) => z.id === vybrany) ?? null

  useEffect(() => {
    if (vybrany == null && zaznamy.length) setVybrany((zaznamy.find((z) => !z.hodnoceni) ?? zaznamy[0]).id)
  }, [zaznamy, vybrany])

  if (chyba) return <ChybaBox chyba={chyba} />
  if (nacita && !data) return <Nacitani />
  if (!data) return null

  const dalsi = () => {
    const idx = zaznamy.findIndex((z) => z.id === vybrany)
    const n = zaznamy.slice(idx + 1).find((z) => !z.hodnoceni) ?? zaznamy.find((z) => !z.hodnoceni)
    if (n) setVybrany(n.id)
  }

  return (
    <>
      <div className="radek-stred" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <span>
          Ohodnoceno <b>{hotovo}</b> z {zaznamy.length}
          {hotovo === zaznamy.length && <span className="stitek st-ok" style={{ marginLeft: 8 }}>Kontrola dokončena</span>}
        </span>
        <button className="tl tl-obrys tl-mala" onClick={() => stahni(`/api/kontrola/export${qs({ verze, kontrolor })}`)} disabled={!hotovo}>
          Export CSV (šablona 7.4)
        </button>
      </div>
      <div className="mrizka kontrola-mrizka">
        <div className="karta kontrola-seznam">
          {zaznamy.map((z) => (
            <button
              key={z.id}
              onClick={() => setVybrany(z.id)}
              className="volba"
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                gap: 8,
                border: 'none',
                background: z.id === vybrany ? 'var(--tint2)' : 'transparent',
                textAlign: 'left',
              }}
            >
              <span>
                <span className="muted">#{z.id}</span> {z.nazev}
              </span>
              {z.hodnoceni ? <span style={{ color: z.hodnoceni.shoda ? 'var(--teal)' : 'var(--red)' }}>{z.hodnoceni.shoda ? '✓' : '≠'}</span> : null}
            </button>
          ))}
        </div>
        {aktivni && <HodnoceniZaznamu key={aktivni.id} z={aktivni} kola={data.kola} verze={verze} kontrolor={kontrolor} poUlozeni={obnov} dalsi={dalsi} />}
      </div>
    </>
  )
}

type TriStav = 'ano' | 'ne' | ''

function HodnoceniZaznamu({
  z,
  kola,
  verze,
  kontrolor,
  poUlozeni,
  dalsi,
}: {
  z: ZaznamKontrolora
  kola: KoloApi[]
  verze: string
  kontrolor: string
  poUlozeni: () => void
  dalsi: () => void
}) {
  const h = z.hodnoceni
  const [start] = useState(() => Date.now())
  const [rozhodnuti, setRozhodnuti] = useState<Rozhodnuti | ''>(h?.rozhodnuti_kontrolora ?? '')
  const [chybnePole, setChybnePole] = useState(h?.chybne_pole ?? '')
  const [typChyby, setTypChyby] = useState<TypChyby | ''>(h?.typ_chyby ?? '')
  const [cas, setCas] = useState(h?.cas_min != null ? String(h.cas_min) : '')
  const [pole, setPole] = useState<Record<PoleKontroly, TriStav>>(() => {
    const p = h?.pole_spravne ?? {}
    return Object.fromEntries(POLE_KONTROLY.map((k) => [k, p[k] == null ? '' : p[k] ? 'ano' : 'ne'])) as Record<PoleKontroly, TriStav>
  })
  const [poznamka, setPoznamka] = useState(h?.poznamka ?? '')
  const [stav, setStav] = useState<string | null>(null)
  const kolo = new Map(kola.map((k) => [k.id, k]))

  async function uloz() {
    if (!rozhodnuti) return
    setStav('Ukládám…')
    const casMin = cas ? Number(cas.replace(',', '.')) : Math.max(1, Math.round((Date.now() - start) / 60000))
    try {
      await api('kontrola/hodnoceni', {
        method: 'POST',
        body: {
          verze,
          spravce_id: z.id,
          kontrolor,
          rozhodnuti_kontrolora: rozhodnuti,
          chybne_pole: chybnePole || null,
          typ_chyby: typChyby || null,
          cas_min: casMin,
          pole_spravne: Object.fromEntries(POLE_KONTROLY.map((k) => [k, pole[k] === '' ? null : pole[k] === 'ano'])),
          poznamka: poznamka || null,
        },
      })
      setStav(null)
      poUlozeni()
    } catch (e) {
      setStav(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="karta">
      <div className="eyebrow">Záznam #{z.id}</div>
      <h2 style={{ marginBottom: 6 }}>{z.nazev}</h2>
      <div className="radek-stred" style={{ marginBottom: 14 }}>
        <span className="stitek st-neutral">{z.kategorie ? KATEGORIE[z.kategorie] : '—'}</span>
        <span className="stitek st-neutral">Skupina {z.skupina_relevance ?? '—'}</span>
        {z.dalsi_nazvy?.length ? <span className="mala muted">Další názvy: {z.dalsi_nazvy.join(', ')}</span> : null}
        {!z.odkryto && <span className="stitek st-ceka">Režim naslepo</span>}
      </div>

      {z.odkryto && h && (
        <div className={h.shoda ? 'info' : 'upozorneni'} style={{ marginBottom: 16 }}>
          Rozhodnutí v{verze}: <StupenStitek stupen={z.stupen} stav={z.stav_aktivity} /> ({z.rozhodnuti_v ? ROZHODNUTI_NAZEV[z.rozhodnuti_v] : '—'}) · vaše:{' '}
          <b>{ROZHODNUTI_NAZEV[h.rozhodnuti_kontrolora]}</b> · {h.shoda ? 'shoda' : 'neshoda'}
          {z.poznamka_stupne && (
            <div className="mala mezera-s">
              Poznámka ke stupni: <TextSCitacemi text={z.poznamka_stupne} />
            </div>
          )}
        </div>
      )}

      <h4>Doložené investice</h4>
      {z.ucasti.length ? (
        <div className="tabulka-obal" style={{ marginBottom: 14 }}>
          <table>
            <thead>
              <tr>
                <th>Firma</th>
                <th>Kolo</th>
                <th className="num">Kolo celkem</th>
                <th>Role</th>
                <th>Doklady</th>
              </tr>
            </thead>
            <tbody>
              {z.ucasti.map((u) => {
                const k = kolo.get(u.kolo_id)
                return (
                  <tr key={u.id}>
                    <td>{k?.firma}</td>
                    <td>{k?.kolo ?? '—'}</td>
                    <td className="num">{k?.castka_text ?? castka(k?.castka_kola, k?.mena)}</td>
                    <td>{u.role ?? '—'}</td>
                    <td>
                      <Doklady doklady={u.doklady} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="muted mala">Žádná účast v kole.</p>
      )}
      {z.udalosti.length > 0 && (
        <ul className="mala" style={{ marginTop: 0 }}>
          {z.udalosti.map((u) => (
            <li key={u.id}>
              {TYP_UDALOSTI[u.typ_udalosti]}: {u.firma ?? '—'} {u.castka != null && castka(u.castka, u.mena)} · {u.zdroj_text}{' '}
              {u.datum_publikace && `· ${datum(u.datum_publikace)}`} <Doklady doklady={u.doklady} />
            </li>
          ))}
        </ul>
      )}
      <dl className="vlastnosti" style={{ marginBottom: 18 }}>
        <dt>Text investice / datum</dt>
        <dd>
          <TextSCitacemi text={z.investice_text} /> · <TextSCitacemi text={z.datum_zdroj_text} />
        </dd>
        <dt>Fond</dt>
        <dd style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {z.fondy.flatMap((f) => f.hodnoty.map((x) => <CastkaRadek key={x.id} c={x} />))}
        </dd>
        <dt>Tiket</dt>
        <dd>
          <CastkaRadek c={z.tiket} />
        </dd>
        {z.doklady_zaznamu && z.doklady_zaznamu.length > 0 && (
          <>
            <dt>Doklady k záznamu</dt>
            <dd>
              <Doklady doklady={z.doklady_zaznamu} />
            </dd>
          </>
        )}
      </dl>

      <div className="karta-tint">
        <h4>Hodnocení kontrolora</h4>
        <div className="pole">
          <label>Rozhodnutí *</label>
          <div className="volby" style={{ marginTop: 0 }}>
            {ROZHODNUTI.map((r) => (
              <button key={r} className={`volba${rozhodnuti === r ? ' vybrano' : ''}`} onClick={() => setRozhodnuti(r)}>
                {ROZHODNUTI_NAZEV[r]}
              </button>
            ))}
          </div>
        </div>
        <div className="filtry mezera-s">
          <div className="pole">
            <label>Chybné pole</label>
            <input value={chybnePole} onChange={(e) => setChybnePole(e.target.value)} placeholder="např. fond, tiket" />
          </div>
          <div className="pole">
            <label>Typ chyby</label>
            <select value={typChyby} onChange={(e) => setTypChyby(e.target.value as TypChyby | '')}>
              <option value="">bez chyby</option>
              {Object.entries(TYP_CHYBY).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="pole">
            <label>Čas (min)</label>
            <input inputMode="decimal" value={cas} onChange={(e) => setCas(e.target.value)} placeholder="automaticky z času na stránce" />
          </div>
        </div>
        <div className="radek-stred" style={{ marginBottom: 12 }}>
          <span className="mala muted">Správnost polí:</span>
          {POLE_KONTROLY.map((p) => (
            <label key={p} className="radek-stred mala">
              {p === 'sektor' ? 'sektor' : p === 'faze' ? 'fáze' : p}
              <select value={pole[p]} onChange={(e) => setPole({ ...pole, [p]: e.target.value as TriStav })}>
                <option value="">neposouzeno</option>
                <option value="ano">správně</option>
                <option value="ne">chybně</option>
              </select>
            </label>
          ))}
        </div>
        <div className="pole" style={{ marginBottom: 12 }}>
          <label>Poznámka</label>
          <textarea rows={2} value={poznamka} onChange={(e) => setPoznamka(e.target.value)} />
        </div>
        <div className="radek-stred">
          <button className="tl tl-primarni" disabled={!rozhodnuti} onClick={uloz}>
            {h ? 'Uložit změnu hodnocení' : 'Uložit hodnocení'}
          </button>
          {h && (
            <button className="tl tl-obrys" onClick={dalsi}>
              Další neohodnocený →
            </button>
          )}
          {stav && <span className="mala">{stav}</span>}
        </div>
      </div>
    </div>
  )
}

function Vysledky({ verze, kontrolor }: { verze: string; kontrolor: string }) {
  const kontrolori = useApi<{ kontrolor: string; pocet: number; posledni: string }[]>(`kontrola/kontrolori${qs({ verze })}`)
  const [vyber, setVyber] = useState(kontrolor)
  const k = vyber || kontrolori.data?.[0]?.kontrolor || ''
  const { data, chyba, nacita } = useApi<{ vysledky: VysledkyKontroly | null }>(k ? `kontrola/vysledky${qs({ verze, kontrolor: k })}` : null)
  if (kontrolori.data && !kontrolori.data.length) return <p className="muted">Zatím nikdo nehodnotil.</p>
  return (
    <>
      <div className="radek-stred" style={{ marginBottom: 16 }}>
        <label className="radek-stred">
          Kontrolor
          <select value={k} onChange={(e) => setVyber(e.target.value)}>
            {(kontrolori.data ?? []).map((x) => (
              <option key={x.kontrolor} value={x.kontrolor}>
                {x.kontrolor} ({x.pocet})
              </option>
            ))}
          </select>
        </label>
        {k && (
          <button className="tl tl-obrys tl-mala" onClick={() => stahni(`/api/kontrola/export${qs({ verze, kontrolor: k })}`)}>
            Export CSV
          </button>
        )}
      </div>
      {chyba && <ChybaBox chyba={chyba} />}
      {nacita && !data && <Nacitani />}
      {data?.vysledky && <VysledkyKontrolyPanel v={data.vysledky} />}
    </>
  )
}

function Referencni({ verze }: { verze: string }) {
  const { data, chyba, nacita, obnov } = useApi<ReferencniPolozka[]>('kontrola/referencni-seznam')
  const spravci = useApi<{ spravci: { id: number; nazev: string }[] }>(`spravci${qs({ verze })}`)
  const [csv, setCsv] = useState('')
  const [nahradit, setNahradit] = useState(true)
  const [stav, setStav] = useState<string | null>(null)
  const zachyt = useMemo(() => (data?.length ? data.filter((x) => x.spravce_id != null).length / data.length : null), [data])

  async function importuj() {
    setStav('Importuji…')
    try {
      const r = await api<{ importovano: number; namapovano: number }>('kontrola/referencni-seznam', { method: 'POST', body: { csv, nahradit, verze } })
      setStav(`Importováno ${r.importovano} položek, automaticky namapováno ${r.namapovano}.`)
      setCsv('')
      obnov()
    } catch (e) {
      setStav(e instanceof Error ? e.message : String(e))
    }
  }
  async function mapuj(id: number, spravce_id: number | null) {
    await api(`kontrola/referencni-seznam/${id}`, { method: 'PUT', body: { spravce_id } })
    obnov()
  }
  async function smaz() {
    if (!window.confirm('Opravdu vymazat celý referenční seznam?')) return
    await api('kontrola/referencni-seznam', { method: 'DELETE' })
    obnov()
  }

  return (
    <>
      <p className="muted" style={{ maxWidth: 760 }}>
        Referenční seznam = všichni investoři uvedení v přehledech CzechCrunch za 12 měsíců (<Link to="/metodika/7#k-7-4">kap. 7.4 bod 3</Link>). Záchyt je
        podíl těch, které databáze zachytila (mají přiřazený záznam).
      </p>
      <div className="karta" style={{ marginBottom: 20 }}>
        <h3>Import CSV</h3>
        <p className="mala muted">
          Sloupce: <code>nazev_investora;zdroj;datum</code> (datum RRRR-MM-DD, nepovinné). Oddělovač středník nebo čárka, hlavička nepovinná. Mapování na
          záznamy se navrhne podle názvu a lze ho ručně upravit.
        </p>
        <div className="radek-stred" style={{ marginBottom: 10 }}>
          <input
            type="file"
            accept=".csv,text/csv,text/plain"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              if (f) setCsv(await f.text())
            }}
          />
        </div>
        <textarea rows={5} style={{ width: '100%' }} value={csv} onChange={(e) => setCsv(e.target.value)} placeholder={'Credo Ventures;CC newsletter 2. 1. 2026;2026-01-02\nNorthzone;CC newsletter 2. 2. 2026;2026-02-02'} />
        <div className="radek-stred mezera-s">
          <label className="zaskrt">
            <input type="checkbox" checked={nahradit} onChange={(e) => setNahradit(e.target.checked)} />
            Nahradit stávající seznam
          </label>
          <button className="tl tl-teal" disabled={!csv.trim()} onClick={importuj}>
            Importovat
          </button>
          {stav && <span className="mala">{stav}</span>}
        </div>
      </div>
      {chyba && <ChybaBox chyba={chyba} />}
      {nacita && !data && <Nacitani />}
      {data && data.length > 0 && (
        <>
          <div className="radek-stred" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
            <span>
              Záchyt: <b>{procento(zachyt)}</b> ({data.filter((x) => x.spravce_id != null).length}/{cislo(data.length)})
            </span>
            <button className="tl tl-text" onClick={smaz}>
              Vymazat seznam
            </button>
          </div>
          <div className="tabulka-obal">
            <table>
              <thead>
                <tr>
                  <th>Investor</th>
                  <th>Zdroj</th>
                  <th>Datum</th>
                  <th>Záznam v databázi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r.id}>
                    <td>{r.nazev_investora}</td>
                    <td>{r.zdroj}</td>
                    <td>{datum(r.datum)}</td>
                    <td>
                      <select value={r.spravce_id ?? ''} onChange={(e) => mapuj(r.id, e.target.value ? Number(e.target.value) : null)}>
                        <option value="">— nezachycen —</option>
                        {(spravci.data?.spravci ?? []).map((s) => (
                          <option key={s.id} value={s.id}>
                            #{s.id} {s.nazev}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {data && !data.length && <p className="muted">Referenční seznam je prázdný.</p>}
    </>
  )
}
