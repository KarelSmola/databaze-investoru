import pilotJson from '../data/pilot_v1.1.json'
import zdrojeJson from '../data/zdroje.json'
import type { PilotData, Zdroj } from '../shared/typy.js'

export const pilot = pilotJson as unknown as PilotData
export const zdroje = zdrojeJson as Zdroj[]

/** Zaokrouhlení na desetiny procenta, jak je uvádí dokument. */
export const pct = (x: number) => Math.round(x * 1000) / 10
