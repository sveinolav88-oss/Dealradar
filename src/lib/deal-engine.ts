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
    return { score: 0, label: 'WATCH', publishable: false, reasons: ['Invalid current price'] }
  }

  const history30Low = lowest(input.history30)
  const history90Low = lowest(input.history90)
  const history90Avg = average(input.history90)
  const competitorLow = input.competitorPrices?.length ? Math.min(...input.competitorPrices) : null

  const reference = input.referencePrice && input.referencePrice > currentPrice ? input.referencePrice : null
  const referenceDiscount = reference ? clamp((1 - currentPrice / reference) * 100) : 0
  const historyDiscount = history90Avg ? clamp((1 - currentPrice / history90Avg) * 100) : 0
  const competitorDiscount = competitorLow && competitorLow > currentPrice ? clamp((1 - currentPrice / competitorLow) * 100) : 0

  // Being below the recent low is a particularly strong signal; matching the low is positive but less strong.
  const below30Low = history30Low ? currentPrice < history30Low : false
  const at90Low = history90Low ? currentPrice <= history90Low * 1.005 : false

  let score = 35
  score += Math.min(referenceDiscount * 0.55, 25)
  score += Math.min(historyDiscount * 0.75, 25)
  score += Math.min(competitorDiscount * 0.35, 10)
  if (below30Low) score += 8
  else if (at90Low) score += 4
  if (input.inStock === false) score -= 30

  score = Math.round(clamp(score))
  const label = score >= 90 ? 'EXCEPTIONAL' : score >= 80 ? 'GREAT' : score >= 65 ? 'GOOD' : 'WATCH'

  const reasons: string[] = []
  if (referenceDiscount >= 20) reasons.push(`${Math.round(referenceDiscount)}% below reference price`)
  if (historyDiscount >= 10) reasons.push(`${Math.round(historyDiscount)}% below 90-day average`)
  if (below30Low) reasons.push('Below the recorded 30-day low')
  else if (at90Low) reasons.push('At or near the recorded 90-day low')
  if (competitorDiscount >= 5) reasons.push(`${Math.round(competitorDiscount)}% below the lowest competitor price`)
  if (input.inStock === false) reasons.push('Currently out of stock')
  if (!reasons.length) reasons.push('Not enough evidence of a meaningful price advantage')

  return { score, label, publishable: score >= 65 && input.inStock !== false, reasons }
}
