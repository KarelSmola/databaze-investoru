import { Citace } from './Text'
import { datum } from '../../shared/format'
import { UROVEN_ZDROJE } from '../../shared/ciselniky'
import type { Doklad } from '../../shared/api'

/** Seznam dokladů: zdroj, úroveň zdroje (kap. 5), data a skupina nezávislosti. */
export function Doklady({ doklady }: { doklady: Doklad[] }) {
  if (!doklady.length) return <span className="muted">bez dokladu</span>
  return (
    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {doklady.map((d) => (
        <li key={d.id} className="mala">
          {d.zdroj_cislo != null && <Citace n={d.zdroj_cislo} />} {d.zdroj_text && <span>{d.zdroj_text}</span>}
          <span className="muted">
            {d.uroven_zdroje ? ` · úroveň ${d.uroven_zdroje} (${UROVEN_ZDROJE[d.uroven_zdroje]})` : ' · úroveň neurčena'}
            {d.datum_udalosti && ` · událost ${datum(d.datum_udalosti)}`}
            {d.datum_publikace && ` · publikace ${datum(d.datum_publikace)}`}
            {d.datum_kontroly && ` · kontrola ${datum(d.datum_kontroly)}`}
            {d.nezavislost_skupina && ` · nezávislost: ${d.nezavislost_skupina}`}
          </span>
          {d.url && (
            <>
              {' '}
              <a href={d.url} target="_blank" rel="noreferrer" aria-label="Otevřít zdroj">
                ↗
              </a>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}
