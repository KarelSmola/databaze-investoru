export interface Interval {
  dolni: number
  horni: number
}

/** Wilsonův interval pro podíl k/n (výchozí 95 %, z = 1,96). */
export function wilson(k: number, n: number, z = 1.96): Interval {
  if (n <= 0) return { dolni: 0, horni: 0 }
  const p = k / n
  const z2 = z * z
  const jmen = 1 + z2 / n
  const stred = (p + z2 / (2 * n)) / jmen
  const okraj = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / jmen
  return { dolni: Math.max(0, stred - okraj), horni: Math.min(1, stred + okraj) }
}

export interface Podil {
  citatel: number
  jmenovatel: number
  podil: number
  wilson: Interval
}

export function podil(citatel: number, jmenovatel: number): Podil {
  return {
    citatel,
    jmenovatel,
    podil: jmenovatel > 0 ? citatel / jmenovatel : 0,
    wilson: wilson(citatel, jmenovatel),
  }
}
