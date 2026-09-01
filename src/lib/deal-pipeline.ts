import { calculateDealScore, DealInput, PricePoint } from './deal-engine'

export type CatalogProduct = {
  id: string
  name: string
  slug: string
  category: string
  merchant: string
  imageUrl?: string
  productUrl?: string
  affiliateUrl?: string | null
  currentPrice: number
  referencePrice?: number | null
  history30?: PricePoint[]
  history90?: PricePoint[]
  competitorPrices?: number[]
  inStock?: boolean
}

export type ScoredDeal = CatalogProduct & ReturnType<typeof calculateDealScore>

export function scoreCatalog(products: CatalogProduct[]): ScoredDeal[] {
  return products
    .map(product => ({
      ...product,
      ...calculateDealScore(product as DealInput),
    }))
    .sort((a, b) => b.score - a.score)
}

export function getPublishableDeals(products: CatalogProduct[]): ScoredDeal[] {
  return scoreCatalog(products).filter(product => product.publishable && !!product.affiliateUrl)
}

export function buildPriceSnapshot(product: CatalogProduct, observedAt = new Date().toISOString()) {
  return {
    productId: product.id,
    price: product.currentPrice,
    observedAt,
  }
}
