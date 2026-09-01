export type PricePoint = { price: number; observedAt: string }

export type DealInput = {
  currentPrice: number
  referencePrice?: number | null
  history30?: PricePoint[]
  history90?: PricePoint[]
  competitorPrices?: number[]
  inStock?: boolean
}

export type DealScore = {
  score: number
  label: 'EXCEPTIONAL' | 'GREAT' | 'GOOD' | 'WATCH'
  publishable: boolean
  reasons: string[]
}

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, n))
const lowest = (points: PricePoint[] = []) => points.length ? Math.min(...points.map(p => p.price)) : null
const average = (points: PricePoint[] = []) => points.length ? points.reduce((s, p) => s + p.price, 0) / points.length : null

export function calculateDealScore(input: DealInput): DealScore {
  const { currentPrice } = input
  if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
    return { score: 0, label: 'WATCH', publishable: false, reasons: ['Ugyldig nåpris'] }
  }

  const history30Low = lowest(input.history30)
  const history90Low = lowest(input.history90)
  const history90Avg = average(input.history90)
  const competitorLow = input.competitorPrices?.length ? Math.min(...input.competitorPrices) : null

  const reference = input.referencePrice && input.referencePrice > currentPrice ? input.referencePrice : null
  const referenceDiscount = reference ? clamp((1 - currentPrice / reference) * 100) : 0
  const historyDiscount = history90Avg ? clamp((1 - currentPrice / history90Avg) * 100) : 0
  const competitorDiscount = competitorLow && competitorLow > currentPrice ? clamp((1 - currentPrice / competitorLow) * 100) : 0

  // A recent price low is stronger evidence than a shop's stated reference price.
  // Reference price can still make a deal publishable, but it cannot by itself create an exceptional score.
  const below30Low = history30Low ? currentPrice < history30Low : false
  const at90Low = history90Low ? currentPrice <= history90Low * 1.005 : false

  let score = 35
  score += Math.min(referenceDiscount * 0.9, 36)
  score += Math.min(historyDiscount * 0.75, 25)
  score += Math.min(competitorDiscount * 0.35, 10)
  if (below30Low) score += 8
  else if (at90Low) score += 4
  if (input.inStock === false) score -= 30

  score = Math.round(clamp(score))
  const label = score >= 90 ? 'EXCEPTIONAL' : score >= 80 ? 'GREAT' : score >= 65 ? 'GOOD' : 'WATCH'

  const reasons: string[] = []
  if (referenceDiscount >= 20) reasons.push(`${Math.round(referenceDiscount)}% under oppgitt referansepris`)
  if (historyDiscount >= 10) reasons.push(`${Math.round(historyDiscount)}% under 90-dagers snittpris`)
  if (below30Low) reasons.push('Lavere enn registrert 30-dagers lavestepris')
  else if (at90Low) reasons.push('På eller nær registrert 90-dagers lavestepris')
  if (competitorDiscount >= 5) reasons.push(`${Math.round(competitorDiscount)}% under laveste konkurrentpris`)
  if (input.inStock === false) reasons.push('Utsolgt akkurat nå')
  if (!reasons.length) reasons.push('Ikke nok dokumentasjon på et tydelig prisfortrinn')

  return { score, label, publishable: score >= 65 && input.inStock !== false, reasons }
}
