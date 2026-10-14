import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Hlavicka } from '../components/Ui'
import { KATEGORIE } from '../../shared/ciselniky'
import { HRANICNI_PRIPADY, oknoAktivityMesice, rozhodni, VYSLEDEK_POPIS, type StavDokladu, type VstupStromu, type VysledekStromu } from '../../shared/strom'
import type { Kategorie, SkupinaRelevance } from '../../shared/typy'

type Odpovedi = Partial<VstupStromu> & { relevance_zodpovezena?: boolean; zarazeni_zodpovezeno?: boolean }

const PRAZDNE: Odpovedi = {}

function Volby<T>({ volby, hodnota, zmen }: { volby: [T, string][]; hodnota: T | undefined; zmen: (v: T) => void }) {
  return (
    <div className="volby">
      {volby.map(([v, t]) => (
        <button key={String(v)} className={`volba${hodnota === v ? ' vybrano' : ''}`} onClick={() => zmen(v)}>
          {t}
        </button>
      ))}
    </div>
  )
}

/** Projde odpovědi a vrátí aktuální krok, případně výsledek (průvodce FR-30). */
function stav(o: Odpovedi): { krok: number; vysledek: VysledekStromu | null } {
  const plny = (): VstupStromu => ({
    identita_overitelna: o.identita_overitelna ?? true,
    investuje_do_podilu: o.investuje_do_podilu ?? true,
    kategorie: o.kategorie ?? 'VC',
    doklad: o.doklad ?? 'v_okne',
    ceska_relevance: o.ceska_relevance ?? null,
    kategorie_urcitelna: o.kategorie_urcitelna ?? true,
    otevrena_otazka: o.otevrena_otazka ?? false,
    pocet_dolozenych_investic: o.pocet_dolozenych_investic,
  })
  if (o.identita_overitelna === undefined) return { krok: 1, vysledek: null }
  if (!o.identita_overitelna) return { krok: 1, vysledek: rozhodni(plny()) }
  if (o.investuje_do_podilu === false) return { krok: 2, vysledek: rozhodni(plny()) }
  if (o.investuje_do_podilu === undefined || o.kategorie === undefined) return { krok: 2, vysledek: null }
  if (o.doklad === undefined) return { krok: 3, vysledek: null }
  const r3 = rozhodni({ ...plny(), ceska_relevance: '1' })
  if (r3.krok === 3) return { krok: 3, vysledek: r3 }
  if (!o.relevance_zodpovezena) return { krok: 4, vysledek: null }
  if (o.ceska_relevance == null) return { krok: 4, vysledek: rozhodni(plny()) }
  if (!o.zarazeni_zodpovezeno) return { krok: 5, vysledek: null }
  return { krok: 5, vysledek: rozhodni(plny()) }
}

export function Strom() {
  const [o, setO] = useState<Odpovedi>(PRAZDNE)
  const [pripad, setPripad] = useState<string | null>(null)
  const { krok, vysledek } = stav(o)
  const zmen = (z: Odpovedi) => {
    setPripad(null)
    setO((x) => ({ ...x, ...z }))
  }
  const okno = o.kategorie ? oknoAktivityMesice(o.kategorie) : null
  const tridaKroku = (n: number) => `krok${krok === n && !vysledek ? ' aktivni' : krok > n || (vysledek && vysledek.krok >= n) ? ' hotovo' : ''}`
  const vybranyPripad = HRANICNI_PRIPADY.find((p) => p.id === pripad)

  return (
    <div className="kontejner stranka">
      <Hlavicka eyebrow="Modul M4" nadpis="Rozhodovací strom">
        <p>
          Interaktivní průvodce pravidly zařazení a vyřazení podle <Link to="/metodika/2#k-2-1">kap. 2.1</Link>. Stejnou funkci{' '}
          <code>rozhodni()</code> ověřují akceptační testy AT-30 až AT-42 nad hraničními případy <Link to="/metodika/2#k-2-2">kap. 2.2</Link>.
        </p>
      </Hlavicka>

      <div className="mrizka mrizka-2" style={{ alignItems: 'start' }}>
        <div className="kroky">
          <div className={tridaKroku(1)}>
            <span className="krok-cislo">1</span>
            <b>Je identita ověřitelná?</b>
            <p className="mala muted" style={{ margin: '4px 0 0' }}>
              U právnické osoby přes IČO/LEI nebo zahraniční registr, u fyzické osoby jménem a vazbou na investici.
            </p>
            <Volby
              volby={[
                [true, 'Ano'],
                [false, 'Ne'],
              ]}
              hodnota={o.identita_overitelna}
              zmen={(v) => zmen({ identita_overitelna: v })}
            />
          </div>

          {krok >= 2 && o.identita_overitelna && (
            <div className={tridaKroku(2)}>
              <span className="krok-cislo">2</span>
              <b>Investuje vlastní nebo spravovaný kapitál do podílů ve firmách?</b>
              <p className="mala muted" style={{ margin: '4px 0 0' }}>
                Equity, kvazi-equity, konvertibilní nástroje. Jen zprostředkovává, radí, poskytuje úvěr nebo provozuje platformu → ne.
              </p>
              <Volby
                volby={[
                  [true, 'Ano'],
                  [false, 'Ne'],
                ]}
                hodnota={o.investuje_do_podilu}
                zmen={(v) => zmen({ investuje_do_podilu: v })}
              />
              <div className="pole mezera-s" style={{ maxWidth: 320 }}>
                <label htmlFor="kat">Kategorie (určuje okno aktivity)</label>
                <select id="kat" value={o.kategorie ?? ''} onChange={(e) => zmen({ kategorie: (e.target.value || undefined) as Kategorie | undefined })}>
                  <option value="">Vyberte…</option>
                  {(Object.keys(KATEGORIE) as Kategorie[])
                    .filter((k) => k !== 'neinvestor')
                    .map((k) => (
                      <option key={k} value={k}>
                        {KATEGORIE[k]}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}

          {krok >= 3 && o.investuje_do_podilu && o.kategorie && (
            <div className={tridaKroku(3)}>
              <span className="krok-cislo">3</span>
              <b>Existuje datovaný doklad o investici v okně aktivity ({okno} měsíců)?</b>
              <Volby<StavDokladu>
                volby={[
                  ['v_okne', 'Ano, v okně aktivity'],
                  ['jen_fundraising_nebo_LP', 'Jen fundraising nebo závazek LP'],
                  ['starsi', 'Doklad je starší'],
                  ['zadny', 'Žádný doklad'],
                  ['jen_agregator', 'Doklad jen z agregátoru'],
                ]}
                hodnota={o.doklad}
                zmen={(v) => zmen({ doklad: v })}
              />
              {(o.kategorie === 'andel' || o.kategorie === 'velky_soukromy_investor') && (
                <div className="pole mezera-s" style={{ maxWidth: 320 }}>
                  <label htmlFor="pocet">Počet doložených přímých investic ({o.kategorie === 'andel' ? 'anděl ≥1' : 'velký soukromý investor ≥2'})</label>
                  <input
                    id="pocet"
                    type="number"
                    min={0}
                    value={o.pocet_dolozenych_investic ?? ''}
                    onChange={(e) => zmen({ pocet_dolozenych_investic: e.target.value === '' ? undefined : Number(e.target.value) })}
                  />
                </div>
              )}
            </div>
          )}

          {krok >= 4 && (!vysledek || vysledek.krok >= 4) && (
            <div className={tridaKroku(4)}>
              <span className="krok-cislo">4</span>
              <b>Je splněna česká relevance?</b>
              <p className="mala muted" style={{ margin: '4px 0 0' }}>
                Pouhé zaměření na „CEE“ relevanci nezakládá (<Link to="/metodika/1#k-1-2">kap. 1.2</Link>).
              </p>
              <Volby<SkupinaRelevance | null>
                volby={[
                  ['1', '1 – působí z ČR'],
                  ['2a', '2a – investice do české PO'],
                  ['2b', '2b – firma s českými zakladateli'],
                  [null, 'Ne'],
                ]}
                hodnota={o.relevance_zodpovezena ? (o.ceska_relevance ?? null) : undefined}
                zmen={(v) => zmen({ ceska_relevance: v, relevance_zodpovezena: true })}
              />
            </div>
          )}

          {krok >= 5 && (!vysledek || vysledek.krok >= 5) && (
            <div className={tridaKroku(5)}>
              <span className="krok-cislo">5</span>
              <b>Lze určit kategorii a je bez otevřené otázky?</b>
              <div className="radek-stred mezera-s">
                <label className="zaskrt">
                  <input
                    type="checkbox"
                    checked={o.kategorie_urcitelna === false}
                    onChange={(e) => zmen({ kategorie_urcitelna: !e.target.checked, zarazeni_zodpovezeno: true })}
                  />
                  Kategorie je nejasná
                </label>
                <label className="zaskrt">
                  <input type="checkbox" checked={o.otevrena_otazka === true} onChange={(e) => zmen({ otevrena_otazka: e.target.checked, zarazeni_zodpovezeno: true })} />
                  Otevřená otázka (typ, entita, jediný zdroj úrovně 3)
                </label>
              </div>
              {!o.zarazeni_zodpovezeno && (
                <button className="tl tl-teal tl-mala mezera-s" onClick={() => zmen({ zarazeni_zodpovezeno: true })}>
                  Vyhodnotit
                </button>
              )}
            </div>
          )}
        </div>

        <div style={{ position: 'sticky', top: 140 }}>
          {vysledek ? (
            <div className={`vysledek-karta ${vysledek.vysledek.startsWith('zarazen') ? 'ok' : vysledek.vysledek === 'vyrazen' ? 'ne' : 'neutral'}`}>
              <div className="eyebrow">Výsledek · krok {vysledek.krok}</div>
              <h2 style={{ marginBottom: 8 }}>{VYSLEDEK_POPIS[vysledek.vysledek]}</h2>
              <p style={{ marginBottom: vysledek.poznamka ? 8 : 0 }}>{vysledek.zduvodneni}</p>
              {vysledek.poznamka && (
                <p style={{ margin: 0 }}>
                  <b>Poznámka:</b> {vysledek.poznamka}
                </p>
              )}
              {vybranyPripad && (
                <p className="mala" style={{ margin: '12px 0 0' }}>
                  {vybranyPripad.id}: očekáváno <b>{vybranyPripad.ocekavanoText}</b> –{' '}
                  {vybranyPripad.ocekavano.includes(vysledek.vysledek) ? '✓ shoda' : '✗ neshoda'}
                </p>
              )}
            </div>
          ) : (
            <div className="karta-tint">
              <h3>Výsledek</h3>
              <p className="muted" style={{ margin: 0 }}>
                Odpovězte na otázky vlevo. Výsledek může být: vyřazen, watchlist, historický, kandidát, mimo rozsah, zařazen A nebo zařazen B.
              </p>
            </div>
          )}
          <button className="tl tl-obrys tl-mala mezera-s" onClick={() => (setO(PRAZDNE), setPripad(null))}>
            Začít znovu
          </button>
        </div>
      </div>

      <section className="sekce">
        <h2>Hraniční případy (kap. 2.2)</h2>
        <p className="muted">Každý případ lze spustit průvodcem. Sloupec „Funkce“ ukazuje výsledek <code>rozhodni()</code> a shodu s očekáváním.</p>
        <div className="tabulka-obal">
          <table>
            <thead>
              <tr>
                <th>Test</th>
                <th>Případ</th>
                <th>Očekávané rozhodnutí</th>
                <th>Zdůvodnění</th>
                <th>Funkce</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {HRANICNI_PRIPADY.map((p) => {
                const r = rozhodni(p.vstup)
                const ok = p.ocekavano.includes(r.vysledek)
                return (
                  <tr key={p.id} className={pripad === p.id ? 'zvyrazneno' : ''}>
                    <td className="nowrap">{p.id}</td>
                    <td>{p.pripad}</td>
                    <td>{p.ocekavanoText}</td>
                    <td className="muted">{p.zduvodneni}</td>
                    <td className="nowrap">
                      <span className={`stitek ${ok ? 'st-ok' : 'st-ne'}`}>
                        {ok ? '✓' : '✗'} {VYSLEDEK_POPIS[r.vysledek]}
                      </span>
                    </td>
                    <td>
                      <button
                        className="tl tl-obrys tl-mala"
                        onClick={() => {
                          setO({ ...p.vstup, relevance_zodpovezena: true, zarazeni_zodpovezeno: true })
                          setPripad(p.id)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                      >
                        Spustit
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
