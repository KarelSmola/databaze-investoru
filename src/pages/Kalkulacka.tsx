import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, useApi } from '../api'
import { Hlavicka, Zalozky } from '../components/Ui'
import { cislo, datumCas, kc, mil, procento } from '../../shared/format'
import { klonuj, SCENAR_NAZEV, SCENARE, VYCHOZI_PARAMETRY, type ParametryKalkulacky, type Scenar } from '../../shared/kalkulacka/parametry'
import { CITLIVOSTI, vypocetAI, vypocetBezAI, vypocetVse } from '../../shared/kalkulacka/vypocet'
import type { KalkulackaVarianta } from '../../shared/api'

type Zalozka = 'cr' | 'bezAI' | 'sAI' | 'srovnani' | 'citlivosti'

/** Číselný vstup s desetinnou čárkou; `pct` zobrazí podíl v procentech. */
function Num({ value, onChange, pct }: { value: number; onChange: (v: number) => void; pct?: boolean }) {
  const zobraz = (v: number) => cislo(pct ? v * 100 : v, 4).replace(/\s/g, '')
  const [text, setText] = useState(zobraz(value))
  useEffect(() => setText(zobraz(value)), [value]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span className="nowrap">
      <input
        className="cislo-vstup"
        inputMode="decimal"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          const n = Number(e.target.value.replace(/\s/g, '').replace(',', '.'))
          if (e.target.value.trim() !== '' && Number.isFinite(n)) onChange(pct ? n / 100 : n)
        }}
        onBlur={() => setText(zobraz(value))}
      />
      {pct && ' %'}
    </span>
  )
}

function T({ hlavicka, children }: { hlavicka: ReactNode[]; children: ReactNode }) {
  return (
    <div className="tabulka-obal">
      <table>
        <thead>
          <tr>
            {hlavicka.map((h, i) => (
              <th key={i} className={i ? 'num' : undefined}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

const H = (n: number) => `${cislo(n, 2)} h`

export function Kalkulacka() {
  const [params, setParams] = useSearchParams()
  const zalozka = (params.get('z') as Zalozka) ?? 'cr'
  const [p, setP] = useState<ParametryKalkulacky>(() => klonuj(VYCHOZI_PARAMETRY))
  const [nazevVarianty, setNazevVarianty] = useState('')
  const [zprava, setZprava] = useState<string | null>(null)
  const varianty = useApi<KalkulackaVarianta[]>('kalkulacka/varianty')
  const v = useMemo(() => vypocetVse(p), [p])
  const vychozi = JSON.stringify(p) === JSON.stringify(VYCHOZI_PARAMETRY)

  const uprav = (f: (q: ParametryKalkulacky) => void) =>
    setP((x) => {
      const q = klonuj(x)
      f(q)
      return q
    })

  async function ulozVariantu() {
    try {
      await api('kalkulacka/varianty', { method: 'POST', body: { nazev: nazevVarianty.trim(), parametry: p } })
      setNazevVarianty('')
      setZprava('Varianta uložena.')
      varianty.obnov()
    } catch (e) {
      setZprava(e instanceof Error ? e.message : String(e))
    }
  }
  async function smazVariantu(id: number) {
    if (!window.confirm('Smazat uloženou variantu?')) return
    await api(`kalkulacka/varianty/${id}`, { method: 'DELETE' })
    varianty.obnov()
  }
  function nactiVariantu(x: KalkulackaVarianta) {
    // Doplnění chybějících klíčů z výchozích parametrů (kdyby se struktura změnila).
    const ulozene = x.parametry as Partial<ParametryKalkulacky>
    setP({ ...klonuj(VYCHOZI_PARAMETRY), ...ulozene } as ParametryKalkulacky)
    setZprava(`Načtena varianta „${x.nazev}“.`)
  }

  return (
    <div className="kontejner stranka">
      <Hlavicka eyebrow="Modul M8" nadpis="Kalkulačka nákladů">
        <p>
          Rozpočet pilotu a ČR (<Link to="/metodika/8">kap. 8</Link>), celosvětové rozšíření bez AI triáže (<Link to="/metodika/9#k-9-3">9.3</Link>) a s AI
          jako první linií ověřování (<Link to="/metodika/9#k-9-4">9.4</Link>). Výchozí parametry přesně reprodukují čísla dokumentu; všechny parametry lze
          měnit.
        </p>
      </Hlavicka>

      <div className="karta-tint" style={{ marginBottom: 22 }}>
        <div className="radek">
          <div className="pole">
            <label>Sazba analytik (Kč/h)</label>
            <Num value={p.sazby.analytik} onChange={(x) => uprav((q) => (q.sazby.analytik = x))} />
          </div>
          <div className="pole">
            <label>Sazba inženýr (Kč/h)</label>
            <Num value={p.sazby.inzenyr} onChange={(x) => uprav((q) => (q.sazby.inzenyr = x))} />
          </div>
          <div className="pole">
            <label>Řízení a metodika (Kč/h)</label>
            <Num value={p.sazby.rizeni} onChange={(x) => uprav((q) => (q.sazby.rizeni = x))} />
          </div>
          <div className="pole">
            <label>Kurz (Kč/EUR)</label>
            <Num value={p.kurz} onChange={(x) => uprav((q) => (q.kurz = x))} />
          </div>
          <button className="tl tl-obrys" disabled={vychozi} onClick={() => (setP(klonuj(VYCHOZI_PARAMETRY)), setZprava('Obnoveny výchozí parametry.'))}>
            Obnovit výchozí parametry
          </button>
          {!vychozi && <span className="stitek st-C">Upravené parametry</span>}
        </div>
        <div className="radek mezera-s">
          <div className="pole" style={{ flex: '1 1 240px' }}>
            <label>Název varianty</label>
            <input value={nazevVarianty} onChange={(e) => setNazevVarianty(e.target.value)} placeholder="např. Vyšší sazba analytika" />
          </div>
          <button className="tl tl-primarni" disabled={!nazevVarianty.trim()} onClick={ulozVariantu}>
            Uložit variantu
          </button>
          {zprava && <span className="mala">{zprava}</span>}
        </div>
        {varianty.data && varianty.data.length > 0 && (
          <div className="cipy mezera-s">
            {varianty.data.map((x) => (
              <span key={x.id} className="cip">
                <button className="tl tl-text" style={{ padding: 0 }} onClick={() => nactiVariantu(x)} title={`Uloženo ${datumCas(x.vytvoreno)}`}>
                  {x.nazev}
                </button>{' '}
                <button className="tl tl-text" style={{ padding: 0, color: 'var(--muted)' }} onClick={() => smazVariantu(x.id)} aria-label={`Smazat ${x.nazev}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <Zalozky<Zalozka>
        hodnoty={[
          ['cr', 'Pilot a ČR (kap. 8)'],
          ['bezAI', 'Bez AI triáže (9.3)'],
          ['sAI', 'S AI triáží (9.4)'],
          ['srovnani', 'Srovnání (9.4.4)'],
          ['citlivosti', 'Citlivosti'],
        ]}
        aktivni={zalozka}
        zmen={(z) => setParams(z === 'cr' ? {} : { z }, { replace: true })}
      />

      {zalozka === 'cr' && (
        <div className="mrizka mrizka-2" style={{ alignItems: 'start' }}>
          <div>
            <h3>Pilot (2 týdny)</h3>
            <T hlavicka={['Role', 'Hodiny', 'Kč']}>
              <tr>
                <td>Analytik (rešerše, doklady)</td>
                <td className="num">
                  <Num value={p.pilot.analytik_h} onChange={(x) => uprav((q) => (q.pilot.analytik_h = x))} />
                </td>
                <td className="num">{cislo(v.pilot.analytik_kc)}</td>
              </tr>
              <tr>
                <td>Nezávislý kontrolor</td>
                <td className="num">
                  <Num value={p.pilot.kontrolor_h} onChange={(x) => uprav((q) => (q.pilot.kontrolor_h = x))} />
                </td>
                <td className="num">{cislo(v.pilot.kontrolor_kc)}</td>
              </tr>
              <tr>
                <td>Metodik</td>
                <td className="num">
                  <Num value={p.pilot.metodik_h} onChange={(x) => uprav((q) => (q.pilot.metodik_h = x))} />
                </td>
                <td className="num">{cislo(v.pilot.metodik_kc)}</td>
              </tr>
              <tr>
                <td>Mezisoučet</td>
                <td className="num">{cislo(v.pilot.hodiny)}</td>
                <td className="num">{cislo(v.pilot.mezisoucet)}</td>
              </tr>
              <tr>
                <td>
                  Rezerva <Num pct value={p.pilot.rezerva} onChange={(x) => uprav((q) => (q.pilot.rezerva = x))} />
                </td>
                <td />
                <td className="num">{cislo(v.pilot.rezerva)}</td>
              </tr>
              <tr className="zvyrazneno">
                <td>Celkem</td>
                <td />
                <td className="num">{kc(v.pilot.celkem)}</td>
              </tr>
            </T>
            <p className="mala muted mezera-s">Všechny role pilotu jsou počítány sazbou analytika ({cislo(p.sazby.analytik)} Kč/h), shodně s kap. 8.</p>
          </div>
          <div>
            <h3>Plné české pokrytí</h3>
            <T hlavicka={['Položka', 'Hodiny']}>
              <tr>
                <td>
                  Ověření záznamů: <Num value={p.cr.h_na_zaznam} onChange={(x) => uprav((q) => (q.cr.h_na_zaznam = x))} /> h ×{' '}
                  <Num value={p.cr.zaznamy} onChange={(x) => uprav((q) => (q.cr.zaznamy = x))} /> záznamů
                </td>
                <td className="num">{cislo(v.cr.overeni_h, 1)}</td>
              </tr>
              {(
                [
                  ['hledani_h', 'Hledání kandidátů a deduplikace'],
                  ['kontrola_h', 'Nezávislá kontrola vzorku 10 % a vyhodnocení'],
                  ['metodika_h', 'Metodika, GDPR, posouzení oprávněného zájmu (LIA)'],
                  ['rizeni_h', 'Řízení'],
                ] as const
              ).map(([k, n]) => (
                <tr key={k}>
                  <td>{n}</td>
                  <td className="num">
                    <Num value={p.cr[k]} onChange={(x) => uprav((q) => (q.cr[k] = x))} />
                  </td>
                </tr>
              ))}
              <tr>
                <td>Celkem hodin × {cislo(p.sazby.analytik)} Kč</td>
                <td className="num">
                  {cislo(v.cr.hodiny, 1)} h = {cislo(v.cr.mezisoucet)} Kč
                </td>
              </tr>
              <tr>
                <td>
                  Rezerva <Num pct value={p.cr.rezerva} onChange={(x) => uprav((q) => (q.cr.rezerva = x))} />
                </td>
                <td className="num">{cislo(v.cr.rezerva)} Kč</td>
              </tr>
              <tr className="zvyrazneno">
                <td>Celkem</td>
                <td className="num">
                  {kc(v.cr.celkem)} (≈ {cislo(v.cr.eur / 1000, 1)} tis. EUR)
                </td>
              </tr>
              <tr>
                <td>
                  Roční údržba <Num pct value={p.cr.udrzba_min} onChange={(x) => uprav((q) => (q.cr.udrzba_min = x))} /> –{' '}
                  <Num pct value={p.cr.udrzba_max} onChange={(x) => uprav((q) => (q.cr.udrzba_max = x))} /> ceny výstavby včetně rezervy
                </td>
                <td className="num">
                  {cislo(v.cr.udrzba_min)}–{cislo(v.cr.udrzba_max)} Kč
                </td>
              </tr>
            </T>
            <div className="info mezera-s">
              <b>AI v ČR:</b> úspora ≈ {cislo(p.cr.zaznamy)} × 0,5 h × {cislo(p.sazby.analytik)} Kč ≈ {kc(v.cr.ai_uspora_kc)} vs. vývoj pipeline 2 000–6 000
              inženýrských hodin → ruční ověření; česká data jsou zlatý vzorek.
            </div>
          </div>
        </div>
      )}

      {zalozka === 'bezAI' && (
        <>
          <h3>Parametry modelu bez AI triáže</h3>
          <T hlavicka={['Parametr', ...SCENARE.map((s) => SCENAR_NAZEV[s])]}>
            {(
              [
                ['N', 'Počet záznamů N', false],
                ['h_overeni', 'Ruční ověření (h/záznam)', false],
                ['lok_podil', 'Podíl záznamů s lokalizací', true],
                ['h_lok', 'Lokalizace (h/záznam)', false],
                ['qa_podil', 'QA vzorek', true],
                ['h_qa', 'QA (h/záznam)', false],
                ['ing_h', 'Inženýrství (h)', false],
                ['rizeni_h', 'Řízení a metodika (h)', false],
                ['pravo_kc', 'Právo (Kč)', false],
                ['infra_llm_data_kc', 'Infrastruktura, LLM, data (Kč)', false],
                ['rezerva', 'Rezerva', true],
                ['udrzba_min', 'Údržba od', true],
                ['udrzba_max', 'Údržba do', true],
              ] as const
            ).map(([k, n, pct]) => (
              <tr key={k}>
                <td>{n}</td>
                {SCENARE.map((s) => (
                  <td key={s} className="num">
                    <Num pct={pct} value={p.bezAI[s][k]} onChange={(x) => uprav((q) => (q.bezAI[s][k] = x))} />
                  </td>
                ))}
              </tr>
            ))}
          </T>
          <h3 className="sekce">Náklady (kap. 9.3)</h3>
          <VysledkyTabulka p={p} model="bezAI" />
        </>
      )}

      {zalozka === 'sAI' && (
        <>
          <h3>Parametry AI triáže</h3>
          <p className="mala muted">N, QA vzorek, řízení, právo, infrastruktura, rezerva a údržba se přebírají z modelu 9.3. Inženýrství = 9.3 + navíc.</p>
          <T hlavicka={['Parametr', ...SCENARE.map((s) => SCENAR_NAZEV[s])]}>
            {(
              [
                ['auto_podil', 'Podíl automaticky přijatých', true],
                ['h_vyjimka', 'Čas na výjimku (h)', false],
                ['audit_podil', 'Audit automaticky přijatých', true],
                ['h_audit', 'Audit (h/záznam)', false],
                ['lok_podil_vyjimek', 'Lokalizace u výjimek', true],
                ['h_lok', 'Lokalizace (h/záznam)', false],
                ['llm_kc_na_zaznam', 'LLM (Kč/záznam)', false],
                ['ing_navic_h', 'Inženýrství navíc proti 9.3 (h)', false],
              ] as const
            ).map(([k, n, pct]) => (
              <tr key={k}>
                <td>{n}</td>
                {SCENARE.map((s) => (
                  <td key={s} className="num">
                    <Num pct={pct} value={p.sAI[s][k]} onChange={(x) => uprav((q) => (q.sAI[s][k] = x))} />
                  </td>
                ))}
              </tr>
            ))}
          </T>
          <h3 className="sekce">Ruční ověřovací práce na záznam (9.4.2)</h3>
          <T hlavicka={['', ...SCENARE.map((s) => SCENAR_NAZEV[s])]}>
            <tr>
              <td>Výjimky</td>
              {SCENARE.map((s) => (
                <td key={s} className="num">
                  {cislo(v.sAI[s].vyjimky)} × {cislo(p.sAI[s].h_vyjimka, 2)} h = {H(v.sAI[s].vyjimky_h)}
                </td>
              ))}
            </tr>
            <tr>
              <td>Audit automaticky přijatých</td>
              {SCENARE.map((s) => (
                <td key={s} className="num">
                  {cislo(v.sAI[s].audit_zaznamy)} × {cislo(p.sAI[s].h_audit, 2)} h = {H(v.sAI[s].audit_h)}
                </td>
              ))}
            </tr>
            <tr className="zvyrazneno">
              <td>Ruční ověření celkem</td>
              {SCENARE.map((s) => (
                <td key={s} className="num">
                  {H(v.sAI[s].rucni_h)}
                </td>
              ))}
            </tr>
            <tr className="zvyrazneno">
              <td>Na záznam</td>
              {SCENARE.map((s) => (
                <td key={s} className="num">
                  {cislo(v.sAI[s].rucni_na_zaznam, 3, 3)} h
                </td>
              ))}
            </tr>
            <tr>
              <td>Pro srovnání model 9.3</td>
              {SCENARE.map((s) => (
                <td key={s} className="num">
                  {cislo(p.bezAI[s].h_overeni, 2, 2)} h
                </td>
              ))}
            </tr>
          </T>
          <h3 className="sekce">Náklady s AI triáží (9.4.3)</h3>
          <VysledkyTabulka p={p} model="sAI" />
        </>
      )}

      {zalozka === 'srovnani' && (
        <>
          <T hlavicka={['', ...SCENARE.map((s) => SCENAR_NAZEV[s])]}>
            <tr>
              <td>Bez AI triáže (9.3)</td>
              {SCENARE.map((s) => (
                <td key={s} className="num">
                  {kc(v.srovnani[s].bezAI)}
                </td>
              ))}
            </tr>
            <tr>
              <td>S AI triáží (9.4)</td>
              {SCENARE.map((s) => (
                <td key={s} className="num">
                  {kc(v.srovnani[s].sAI)}
                </td>
              ))}
            </tr>
            <tr className="zvyrazneno">
              <td>Úspora</td>
              {SCENARE.map((s) => (
                <td key={s} className="num">
                  {kc(v.srovnani[s].uspora)} ({procento(v.srovnani[s].uspora_podil)})
                </td>
              ))}
            </tr>
            <tr>
              <td>Analytické hodiny</td>
              {SCENARE.map((s) => (
                <td key={s} className="num">
                  {cislo(v.srovnani[s].analyt_h_bezAI)} → {cislo(v.srovnani[s].analyt_h_sAI)}
                </td>
              ))}
            </tr>
          </T>
          <h3 className="sekce">Struktura nákladů (podíl na mezisoučtu)</h3>
          <T hlavicka={['', ...SCENARE.flatMap((s) => [`${SCENAR_NAZEV[s]} 9.3`, `${SCENAR_NAZEV[s]} 9.4`])]}>
            <tr>
              <td>Analytická práce</td>
              {SCENARE.flatMap((s) => [
                <td key={s + 'a'} className="num">
                  {procento(v.bezAI[s].podil_analytiky, 0)}
                </td>,
                <td key={s + 'b'} className="num">
                  {procento(v.sAI[s].podil_analytiky, 0)}
                </td>,
              ])}
            </tr>
            <tr>
              <td>Inženýrství</td>
              {SCENARE.flatMap((s) => [
                <td key={s + 'a'} className="num">
                  {procento(v.bezAI[s].podil_inzenyrstvi, 0)}
                </td>,
                <td key={s + 'b'} className="num">
                  {procento(v.sAI[s].podil_inzenyrstvi, 0)}
                </td>,
              ])}
            </tr>
          </T>
          <p className="mala muted mezera-s">
            Analytické hodiny klesnou zhruba o 60 %, celkové náklady jen o 16–31 % (kap. 9.4.4): část úspory spotřebuje dražší inženýrství a LLM a fixní
            položky zůstávají.
          </p>
        </>
      )}

      {zalozka === 'citlivosti' && <Citlivosti p={p} nastav={setP} />}
    </div>
  )
}

function VysledkyTabulka({ p, model }: { p: ParametryKalkulacky; model: 'bezAI' | 'sAI' }) {
  const r = Object.fromEntries(SCENARE.map((s) => [s, model === 'bezAI' ? vypocetBezAI(p, s) : vypocetAI(p, s)])) as Record<
    Scenar,
    ReturnType<typeof vypocetBezAI> | ReturnType<typeof vypocetAI>
  >
  const radek = (n: string, f: (s: Scenar) => ReactNode, zv = false) => (
    <tr className={zv ? 'zvyrazneno' : undefined}>
      <td>{n}</td>
      {SCENARE.map((s) => (
        <td key={s} className="num">
          {f(s)}
        </td>
      ))}
    </tr>
  )
  return (
    <T hlavicka={['Položka', ...SCENARE.map((s) => `${SCENAR_NAZEV[s]} (${cislo(p.bezAI[s].N / 1000)} tis.)`)]}>
      {radek('Ruční ověření (h)', (s) => cislo(r[s].rucni_h))}
      {radek('Lokalizace (h)', (s) => cislo(r[s].lok_h))}
      {radek('QA vzorek (h)', (s) => cislo(r[s].qa_h))}
      {radek(`Analytické hodiny × ${cislo(p.sazby.analytik)} Kč`, (s) => `${cislo(r[s].analyt_h)} h = ${cislo(r[s].analyt_kc)}`, true)}
      {radek(`Inženýrství × ${cislo(p.sazby.inzenyr)} Kč`, (s) => `${cislo(r[s].ing_h)} h = ${cislo(r[s].ing_kc)}`)}
      {radek(`Řízení a metodika × ${cislo(p.sazby.rizeni)} Kč`, (s) => `${cislo(r[s].rizeni_h)} h = ${cislo(r[s].rizeni_kc)}`)}
      {radek('Právo (DPIA, LIA, více jurisdikcí)', (s) => cislo(r[s].pravo_kc))}
      {radek(model === 'bezAI' ? 'Infrastruktura, LLM, data' : 'Infrastruktura a data', (s) => cislo(r[s].infra_kc))}
      {model === 'sAI' && radek('LLM (Kč × počet záznamů)', (s) => cislo(r[s].llm_kc))}
      {radek('Mezisoučet', (s) => cislo(r[s].mezisoucet))}
      {radek('Rezerva', (s) => cislo(r[s].rezerva))}
      {radek('Celkem Kč', (s) => <b>{cislo(r[s].celkem)}</b>, true)}
      {radek(`Celkem EUR (${cislo(p.kurz)} Kč/EUR)`, (s) => <b>{cislo(r[s].eur)}</b>, true)}
      {radek(`Roční údržba ${procento(p.bezAI.realisticky.udrzba_min, 0)}–${procento(p.bezAI.realisticky.udrzba_max, 0)}`, (s) => `${mil(r[s].udrzba_min)}–${mil(r[s].udrzba_max)} Kč`)}
    </T>
  )
}

function Citlivosti({ p, nastav }: { p: ParametryKalkulacky; nastav: (p: ParametryKalkulacky) => void }) {
  const zakladBez = vypocetBezAI(p, 'realisticky')
  const zakladAI = vypocetAI(p, 'realisticky')
  return (
    <>
      <p className="muted">
        Předdefinované varianty z <Link to="/metodika/9#k-9-3">kap. 9.3</Link> a <Link to="/metodika/9#k-9-4-5">9.4.5</Link>, vždy v realistickém
        scénáři a nad aktuálními parametry.
      </p>
      <T hlavicka={['Varianta', 'Kapitola', 'Základ', 'Varianta', 'Rozdíl', '']}>
        {CITLIVOSTI.map((c) => {
          const q = c.uprav(p)
          const zaklad = c.model === 'bezAI' ? zakladBez : zakladAI
          const r = c.model === 'bezAI' ? vypocetBezAI(q, 'realisticky') : vypocetAI(q, 'realisticky')
          return (
            <tr key={c.id}>
              <td>
                <b>{c.nazev}</b>
                <div className="mala muted">{c.popis}</div>
                {'rucni_na_zaznam' in r && c.model === 'sAI' && (
                  <div className="mala muted">
                    analytické hodiny {cislo(r.analyt_h)} h, ruční práce {cislo(r.rucni_na_zaznam, 2, 2)} h/záznam
                  </div>
                )}
              </td>
              <td>{c.kapitola}</td>
              <td className="num">{kc(zaklad.celkem)}</td>
              <td className="num">
                <b>{kc(r.celkem)}</b>
              </td>
              <td className="num">+{kc(r.celkem - zaklad.celkem)}</td>
              <td>
                <button className="tl tl-obrys tl-mala" onClick={() => nastav(q)}>
                  Použít
                </button>
              </td>
            </tr>
          )
        })}
      </T>
      <p className="mala muted mezera-s">
        I když AI odbaví jen polovinu záznamů, nebo když je LLM třikrát dražší, zůstává varianta s AI levnější než model bez triáže (
        {mil(zakladBez.celkem, 1)} Kč). Dražší je až při souběhu obou nepříznivých předpokladů.
      </p>
    </>
  )
}
