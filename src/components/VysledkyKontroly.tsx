import { Wilson, Podilu } from './Ui'
import { cislo, procento } from '../../shared/format'
import { ROZHODNUTI_NAZEV, TYP_CHYBY } from '../../shared/ciselniky'
import { ROZHODNUTI } from '../../shared/typy'
import type { VysledkyKontroly } from '../../shared/kontrola'
import type { Podil } from '../../shared/wilson'

function Radek({ nazev, p, poznamka }: { nazev: string; p: Podil | null; poznamka?: string }) {
  return (
    <tr>
      <td>{nazev}</td>
      <td className="num">{p && p.jmenovatel ? <Podilu p={p} /> : <span className="muted">čeká na data</span>}</td>
      <td className="num">{p && p.jmenovatel ? <Wilson p={p} /> : '—'}</td>
      <td className="mala muted">{poznamka}</td>
    </tr>
  )
}

/** Metriky kap. 7.4 bod 4 (FR-53). */
export function VysledkyKontrolyPanel({ v }: { v: VysledkyKontroly }) {
  return (
    <div>
      <div className="radek-stred" style={{ marginBottom: 14 }}>
        <span className={`stitek ${v.dokonceno ? 'st-ok' : 'st-W'}`}>
          {v.dokonceno ? 'Kontrola dokončena' : 'Kontrola probíhá'} · {v.hodnoceno}/{v.celkem}
        </span>
        <span className="mala muted">Kontrolor: {v.kontrolor}</span>
      </div>
      <div className="tabulka-obal">
        <table>
          <thead>
            <tr>
              <th>Metrika</th>
              <th className="num">Výsledek</th>
              <th className="num">Wilson 95 %</th>
              <th>Poznámka</th>
            </tr>
          </thead>
          <tbody>
            <Radek nazev="Přesnost zařazení" p={v.presnostZarazeni} poznamka="Zařazení A+B ve verzi dat, které kontrolor potvrdil jako zařazené." />
            <Radek nazev="Shoda rozhodnutí" p={v.shoda} poznamka="Rozhodnutí verze dat = rozhodnutí kontrolora." />
            <Radek nazev="Záchyt" p={v.zachyt} poznamka="Podíl investorů referenčního seznamu (CzechCrunch, 12 měsíců), které databáze zachytila." />
            <Radek nazev="Správnost typu" p={v.spravnostTypu} poznamka="Záznamy bez chyby typu „typ“." />
            <Radek nazev="Správnost pole sektor" p={v.spravnostPoli.sektor} />
            <Radek nazev="Správnost pole fáze" p={v.spravnostPoli.faze} />
            <Radek nazev="Správnost polí sektor a fáze současně" p={v.sektorAFaze} poznamka="Kritérium G-3 (≥90 %)." />
            <Radek nazev="Správnost pole tiket" p={v.spravnostPoli.tiket} />
            <Radek nazev="Správnost pole fond" p={v.spravnostPoli.fond} />
            <Radek nazev="Vyplněnost: sektory (A+B)" p={v.vyplnenost.sektory} />
            <Radek nazev="Vyplněnost: fáze (A+B)" p={v.vyplnenost.faze} />
            <Radek nazev="Vyplněnost: tiket (A+B)" p={v.vyplnenost.tiket} />
            <Radek nazev="Vyplněnost: částka fondu (A+B)" p={v.vyplnenost.fond} />
            <tr>
              <td>Medián času na záznam</td>
              <td className="num">{v.medianCasu != null ? `${cislo(v.medianCasu, 1)} min` : <span className="muted">čeká na data</span>}</td>
              <td className="num">—</td>
              <td className="mala muted">Kritérium G-5 (≤45 min).</td>
            </tr>
            <tr>
              <td>Shoda hodnotitelů (Cohenovo kappa)</td>
              <td className="num">{v.kappa != null ? cislo(v.kappa, 3, 3) : <span className="muted">čeká na data</span>}</td>
              <td className="num">—</td>
              <td className="mala muted">Kritérium G-4 (≥0,8).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mrizka mrizka-2 mezera" style={{ alignItems: 'start' }}>
        <div>
          <h4>Matice rozhodnutí (řádky: verze dat, sloupce: kontrolor)</h4>
          <div className="tabulka-obal">
            <table>
              <thead>
                <tr>
                  <th />
                  {ROZHODNUTI.map((r) => (
                    <th key={r} className="num">
                      {ROZHODNUTI_NAZEV[r]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROZHODNUTI.map((a) => (
                  <tr key={a}>
                    <th style={{ textTransform: 'none' }}>{ROZHODNUTI_NAZEV[a]}</th>
                    {ROZHODNUTI.map((b) => (
                      <td key={b} className="num" style={a === b && v.matice[a][b] ? { background: 'var(--tint)', fontWeight: 600 } : undefined}>
                        {v.matice[a][b] || ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h4>Chyby podle typu</h4>
          <div className="cipy">
            {(Object.keys(v.chyby) as (keyof typeof v.chyby)[]).map((k) => (
              <span key={k} className="cip">
                {TYP_CHYBY[k]}: <b>{v.chyby[k]}</b>
              </span>
            ))}
          </div>
          <p className="mala muted mezera-s">Podíl shod: {procento(v.shoda.podil)}.</p>
        </div>
      </div>
    </div>
  )
}
