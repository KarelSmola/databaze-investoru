import { CitaceSeznam } from './Text'
import { StavHodnotyStitek } from './Ui'
import { castka, datum } from '../../shared/format'
import { STUPEN_POLE, TYP_CASTKY } from '../../shared/ciselniky'
import type { CastkaApi } from '../../shared/api'

/** Jedna hodnota částky (tiket, fond, AUM) v původní měně s typem, rozhodným datem a stavem. */
export function CastkaRadek({ c }: { c: CastkaApi }) {
  const strukt =
    c.min != null || c.max != null
      ? c.min != null && c.max != null
        ? `${castka(c.min, null)}–${castka(c.max, c.mena)}`
        : castka(c.min ?? c.max, c.mena)
      : null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px', alignItems: 'baseline' }}>
      <span style={{ fontWeight: 500 }}>{c.text ?? strukt ?? '—'}</span>
      <CitaceSeznam cisla={c.zdroje} />
      <StavHodnotyStitek stav={c.stav_hodnoty} />
      {c.typ_castky && <span className="mala muted">typ: {TYP_CASTKY[c.typ_castky]}</span>}
      {c.rozhodne_datum && <span className="mala muted">k {datum(c.rozhodne_datum)}</span>}
      {c.stupen_pole && <span className="mala muted">pole: {STUPEN_POLE[c.stupen_pole]}</span>}
      {strukt && c.text && <span className="mala muted">({strukt})</span>}
      {c.poznamka && <span className="mala muted">– {c.poznamka}</span>}
    </div>
  )
}
