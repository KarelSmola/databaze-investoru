import { Children, isValidElement, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'
import { idNadpisu, odkazKapitoly, RE_KAPITOLA } from '../obsah'

/** Převede citace \[n\] na odkazy do modulu Zdroje a textové odkazy na kapitoly na interní odkazy (FR-21, FR-22). */
export function pripravMarkdown(md: string): string {
  return md
    .split('\n')
    .map((radek) => {
      if (/^#{1,6}\s/.test(radek)) return radek
      const s = radek.replace(RE_KAPITOLA, (cele, _k, _m, cislo: string) => {
        const href = odkazKapitoly(cislo)
        return href ? `[${cele}](${href})` : cele
      })
      return s.replace(/\\\[(\d+)\\\]/g, (_x, n: string) => `[\\[${n}\\]](/zdroje#zdroj-${n})`)
    })
    .join('\n')
}

function text(uzly: ReactNode): string {
  return Children.toArray(uzly)
    .map((u) => (typeof u === 'string' || typeof u === 'number' ? String(u) : isValidElement<{ children?: ReactNode }>(u) ? text(u.props.children) : ''))
    .join('')
}

const nadpis =
  (Tag: 'h2' | 'h3' | 'h4' | 'h5') =>
  ({ children }: { children?: ReactNode }) => <Tag id={idNadpisu(text(children))}>{children}</Tag>

const komponenty: Components = {
  h1: nadpis('h2'),
  h2: nadpis('h2'),
  h3: nadpis('h3'),
  h4: nadpis('h4'),
  h5: nadpis('h5'),
  a: ({ href, children }) => {
    if (href?.startsWith('/')) {
      const cit = href.startsWith('/zdroje#')
      return (
        <Link to={href} className={cit ? 'cit' : undefined}>
          {children}
        </Link>
      )
    }
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  },
}

export function Markdown({ md, className = 'prose' }: { md: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={komponenty}>
        {pripravMarkdown(md)}
      </ReactMarkdown>
    </div>
  )
}
