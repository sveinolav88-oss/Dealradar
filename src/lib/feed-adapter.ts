export type FeedProduct = {
  id: string
  ean?: string | null
  brand?: string | null
  name: string
  merchant: string
  category: string
  currentPrice: number
  referencePrice?: number | null
  imageUrl?: string
  productUrl?: string
  affiliateUrl?: string | null
  inStock?: boolean
}

/**
 * Adapter boundary for future affiliate feeds.
 * Keep provider-specific mapping here so the rest of DealRadar remains provider-agnostic.
 */
export interface ProductFeedAdapter {
  provider: string
  fetchProducts(): Promise<FeedProduct[]>
}

function normalizeEan(value: unknown) {
  const digits = String(value ?? '').replace(/\D/g, '')
  return digits.length >= 8 && digits.length <= 14 ? digits : null
}

export function normalizeFeedProduct(raw: Record<string, unknown>): FeedProduct | null {
  const id = String(raw.id ?? raw.productId ?? '').trim()
  const name = String(raw.name ?? raw.productName ?? '').trim()
  const merchant = String(raw.merchant ?? raw.store ?? '').trim()
  const category = String(raw.category ?? 'other').trim()
  const currentPrice = Number(raw.currentPrice ?? raw.price)

  if (!id || !name || !merchant || !Number.isFinite(currentPrice) || currentPrice <= 0) return null

  return {
    id,
    ean: normalizeEan(raw.ean ?? raw.EAN ?? raw.ean13 ?? raw.gtin),
    brand: raw.brand == null ? null : String(raw.brand).trim() || null,
    name,
    merchant,
    category,
    currentPrice,
    referencePrice: raw.referencePrice == null ? null : Number(raw.referencePrice),
    imageUrl: raw.imageUrl ? String(raw.imageUrl) : undefined,
    productUrl: raw.productUrl ? String(raw.productUrl) : undefined,
    affiliateUrl: raw.affiliateUrl ? String(raw.affiliateUrl) : null,
    inStock: raw.inStock == null ? true : Boolean(raw.inStock),
  }
}
