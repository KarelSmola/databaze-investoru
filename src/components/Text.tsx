import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { odkazKapitoly, RE_KAPITOLA } from '../obsah'

/** Odkaz na zdroj n v modulu Zdroje (FR-15). */
export function Citace({ n }: { n: number }) {
  return (
    <Link className="cit" to={`/zdroje#zdroj-${n}`} title={`Zdroj ${n}`}>
      [{n}]
    </Link>
  )
}

function odkazyKapitol(text: string, klic: string): ReactNode[] {
  const out: ReactNode[] = []
  let posl = 0
  for (const m of text.matchAll(RE_KAPITOLA)) {
    const href = odkazKapitoly(m[3])
    if (!href) continue
    out.push(text.slice(posl, m.index))
    out.push(
      <Link key={`${klic}-${m.index}`} to={href}>
        {m[0]}
      </Link>,
    )
    posl = m.index! + m[0].length
  }
  out.push(text.slice(posl))
  return out
}

/** Doslovný text s citacemi [n] jako odkazy na zdroje a odkazy na kapitoly. */
export function TextSCitacemi({ text }: { text: string | null | undefined }) {
  if (!text) return <>—</>
  const casti = text.split(/(\[\d+\])/g)
  return (
    <>
      {casti.map((c, i) => {
        const m = /^\[(\d+)\]$/.exec(c)
        if (m) return <Citace key={i} n={Number(m[1])} />
        return <Fragment key={i}>{odkazyKapitol(c, String(i))}</Fragment>
      })}
    </>
  )
}

export function CitaceSeznam({ cisla }: { cisla: number[] }) {
  if (!cisla.length) return null
  return (
    <>
      {cisla.map((n) => (
        <Citace key={n} n={n} />
      ))}
    </>
  )
}
