import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { procento } from '../../shared/format'
import type { Podil } from '../../shared/wilson'
import type { StavAktivity, Stupen, StavHodnoty } from '../../shared/typy'
import { STAV_HODNOTY } from '../../shared/ciselniky'

export function Nacitani({ text = 'Načítám…' }: { text?: string }) {
  return <div className="spinner">{text}</div>
}

export function ChybaBox({ chyba }: { chyba: string }) {
  return (
    <div className="chyba" role="alert">
      {chyba}
    </div>
  )
}

export function Hlavicka({ eyebrow, nadpis, children }: { eyebrow?: string; nadpis: ReactNode; children?: ReactNode }) {
  return (
    <div className="stranka-hlavicka">
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1>{nadpis}</h1>
      {children}
    </div>
  )
}

/** Štítek stupně a stavu záznamu (FR-18). */
export function StupenStitek({ stupen, stav }: { stupen: Stupen | null | undefined; stav: StavAktivity | undefined }) {
  if (stav === 'vyrazen') return <span className="stitek st-X">X · vyřazen</span>
  if (stav === 'watchlist') return <span className="stitek st-W">Watchlist</span>
  if (stav === 'kandidat') return <span className="stitek st-C">C · kandidát</span>
  if (stav === 'historicky') return <span className="stitek st-C">C · historický</span>
  if (stupen === 'A') return <span className="stitek st-A">A</span>
  if (stupen === 'B') return <span className="stitek st-B">B</span>
  return <span className="stitek st-neutral">{stupen ?? '—'}</span>
}

export function StavHodnotyStitek({ stav }: { stav: StavHodnoty }) {
  const cls = stav === 'overeno' ? 'st-ok' : stav === 'konflikt' ? 'st-konflikt' : 'st-neutral'
  return <span className={`stitek ${cls}`}>{STAV_HODNOTY[stav]}</span>
}

/** Vizualizace Wilsonova intervalu s bodovým odhadem a volitelným prahem. */
export function IntervalPas({ p, prah }: { p: Podil; prah?: number }) {
  return (
    <div>
      <div className="interval" aria-label={`Wilsonův interval ${procento(p.wilson.dolni)} až ${procento(p.wilson.horni)}`}>
        <div className="interval-pas" style={{ left: `${p.wilson.dolni * 100}%`, width: `${(p.wilson.horni - p.wilson.dolni) * 100}%` }} />
        {prah != null && <div className="interval-prah" style={{ left: `${prah * 100}%` }} title={`Práh ${procento(prah, 0)}`} />}
        <div className="interval-bod" style={{ left: `${p.podil * 100}%` }} />
      </div>
      <div className="radek-stred mala muted" style={{ justifyContent: 'space-between' }}>
        <span>0 %</span>
        <span>100 %</span>
      </div>
    </div>
  )
}

export function Podilu({ p }: { p: Podil }) {
  return (
    <>
      {p.citatel}/{p.jmenovatel} = {procento(p.podil)}
    </>
  )
}

export function Wilson({ p }: { p: Podil }) {
  return (
    <>
      {procento(p.wilson.dolni)}–{procento(p.wilson.horni)}
    </>
  )
}

/** Posune stránku na kotvu z URL (React Router to sám nedělá). */
export function useKotva(pripraveno = true) {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (!pripraveno) return
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = decodeURIComponent(hash.slice(1))
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30)
    return () => window.clearTimeout(t)
  }, [hash, pathname, pripraveno])
}

export function Zalozky<T extends string>({ hodnoty, aktivni, zmen }: { hodnoty: [T, string][]; aktivni: T; zmen: (t: T) => void }) {
  return (
    <div className="zalozky" role="tablist">
      {hodnoty.map(([k, n]) => (
        <button key={k} role="tab" aria-selected={k === aktivni} className={k === aktivni ? 'aktivni' : ''} onClick={() => zmen(k)}>
          {n}
        </button>
      ))}
    </div>
  )
}

export function stahni(url: string) {
  const a = document.createElement('a')
  a.href = url
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
}
