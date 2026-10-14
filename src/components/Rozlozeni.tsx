import type { MetrikyPilotu } from '../../shared/metriky'

const BARVY: [keyof MetrikyPilotu['rozlozeni'], string, string][] = [
  ['A', 'Stupeň A', '#00666c'],
  ['B', 'Stupeň B', '#7fd0c9'],
  ['kandidat', 'Kandidát', '#d9b25f'],
  ['historicky', 'Historický', '#b9a37a'],
  ['watchlist', 'Watchlist', '#f2cfcf'],
  ['vyrazen', 'Vyřazen', '#b23132'],
]

/** Rozložení stavů A / B / kandidát / watchlist / vyřazen (FR-02). */
export function Rozlozeni({ r, celkem }: { r: MetrikyPilotu['rozlozeni']; celkem: number }) {
  const polozky = BARVY.filter(([k]) => r[k] > 0)
  return (
    <div>
      <div className="rozlozeni" role="img" aria-label={polozky.map(([k, n]) => `${n} ${r[k]}`).join(', ')}>
        {polozky.map(([k, n, c]) => (
          <span key={k} style={{ flex: r[k], background: c }} title={`${n}: ${r[k]}`} />
        ))}
      </div>
      <div className="legenda">
        {polozky.map(([k, n, c]) => (
          <span key={k}>
            <i style={{ background: c }} />
            {n} <b>{r[k]}</b>
          </span>
        ))}
        <span className="muted">celkem {celkem}</span>
      </div>
    </div>
  )
}
