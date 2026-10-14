import type { VerzeInfo } from '../shared/api'
import type { MetrikyPilotu } from '../shared/metriky'
import type { VysledkyKontroly } from '../shared/kontrola'

export interface MetrikyOdpoved {
  verze: VerzeInfo
  predbezne: MetrikyPilotu
  kontrola: VysledkyKontroly | null
  poKontrole: MetrikyPilotu | null
}
