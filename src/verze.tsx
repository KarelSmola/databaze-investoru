import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { nactiLokalne, ulozLokalne, useApi } from './api'
import type { VerzeInfo } from '../shared/api'

interface VerzeKontext {
  verze: string
  info: VerzeInfo | null
  seznam: VerzeInfo[]
  nastav: (v: string) => void
  obnov: () => void
}

const Kontext = createContext<VerzeKontext | null>(null)

/** Vybraná verze dat (výchozí zmrazená 1.1). */
export function VerzeProvider({ children }: { children: ReactNode }) {
  const [verze, setVerze] = useState(() => nactiLokalne('verze') ?? '1.1')
  const { data, obnov } = useApi<VerzeInfo[]>('verze')
  const seznam = useMemo(() => data ?? [], [data])
  const platna = seznam.length && !seznam.some((v) => v.id === verze) ? '1.1' : verze
  const hodnota = useMemo<VerzeKontext>(
    () => ({
      verze: platna,
      info: seznam.find((v) => v.id === platna) ?? null,
      seznam,
      nastav: (v) => {
        ulozLokalne('verze', v)
        setVerze(v)
      },
      obnov,
    }),
    [platna, seznam, obnov],
  )
  return <Kontext.Provider value={hodnota}>{children}</Kontext.Provider>
}

export function useVerze(): VerzeKontext {
  const k = useContext(Kontext)
  if (!k) throw new Error('useVerze mimo VerzeProvider')
  return k
}
