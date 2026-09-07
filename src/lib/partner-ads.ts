import { FeedProduct } from './feed-adapter'

type XmlNode = Record<string, string>

function stripCdata(value: string) {
  return value.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '').trim()
}

function decodeXml(value: string) {
  return stripCdata(value)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function first(node: XmlNode, keys: string[]) {
  for (const key of keys) {
    const value = node[key]
    if (value) return decodeXml(value)
  }
  return ''
}

function normalizeEan(value: string) {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 8 && digits.length <= 14 ? digits : null
}

/**
 * Small dependency-free parser for the common Partner-ads product-feed shape.
 * It maps identity fields when the feed exposes them so DealRadar can match
 * the same product across multiple stores.
 */
export function parsePartnerAdsXml(xml: string, merchant: string): FeedProduct[] {
  const products: FeedProduct[] = []
  const blocks = xml.match(/<(?:product|item|vare)\b[^>]*>[\s\S]*?<\/(?:product|item|vare)>/gi) ?? []

  for (const block of blocks) {
    const node: XmlNode = {}
    const fields = block.matchAll(/<([\w:-]+)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g)
    for (const match of fields) node[match[1].toLowerCase()] = match[2]

    const id = first(node, ['id', 'productid', 'vareid', 'sku'])
    const ean = normalizeEan(first(node, ['ean', 'ean13', 'gtin', 'barcode', 'strekkode']))
    const brand = first(node, ['brand', 'brandname', 'merke']) || null
    const name = first(node, ['name', 'productname', 'varenavn', 'title'])
    const category = first(node, ['category', 'categoryname', 'kategorinavn', 'kategori']) || 'other'
    const currentPrice = Number(first(node, ['nypris', 'price', 'currentprice']).replace(/[^0-9,.-]/g, '').replace(',', '.'))
    const referenceRaw = first(node, ['glpris', 'oldprice', 'referenceprice'])
    const referencePrice = referenceRaw ? Number(referenceRaw.replace(/[^0-9,.-]/g, '').replace(',', '.')) : null
    const imageUrl = first(node, ['billedurl', 'imageurl', 'image', 'pictureurl'])
    const productUrl = first(node, ['vareurl', 'producturl', 'url', 'link'])
    const affiliateUrl = first(node, ['affiliateurl', 'trackingurl', 'trackurl']) || null
    const stockRaw = first(node, ['instock', 'stock', 'availability', 'lager']).toLowerCase()
    const inStock = !stockRaw || !/(out|ikke|0|sold|unavailable)/i.test(stockRaw)

    if (!id || !name || !Number.isFinite(currentPrice) || currentPrice <= 0) continue

    products.push({
      id,
      ean,
      brand,
      name,
      merchant,
      category,
      currentPrice,
      referencePrice: Number.isFinite(referencePrice ?? NaN) ? referencePrice : null,
      imageUrl: imageUrl || undefined,
      productUrl: productUrl || undefined,
      affiliateUrl,
      inStock,
    })
  }

  return products
}

/**
 * Creates a Partner-ads deeplink from an actual link template supplied by
 * Partner-ads. DealRadar never guesses the Partner-ads tracking domain or IDs.
 * The template should be copied from Partner-ads' generated PRODUCT/text link.
 */
export function buildPartnerAdsAffiliateUrl(template: string, productUrl: string, uid?: string) {
  if (!template || !productUrl) return null

  try {
    const trackingUrl = new URL(template)
    const destination = new URL(productUrl)

    trackingUrl.searchParams.set('htmlurl', destination.toString())
    if (uid) trackingUrl.searchParams.set('uid', uid)

    return trackingUrl.toString()
  } catch {
    return null
  }
}

export async function fetchPartnerAdsFeed(feedUrl: string, merchant: string): Promise<FeedProduct[]> {
  if (!feedUrl.startsWith('https://')) throw new Error('Partner-ads feed URL must use HTTPS')

  const response = await fetch(feedUrl, {
    cache: 'no-store',
    signal: AbortSignal.timeout(10000),
  })
  if (!response.ok) throw new Error(`Partner-ads feed returned HTTP ${response.status}`)

  const xml = await response.text()
  if (!xml.includes('<')) throw new Error('Partner-ads feed did not return XML')

  return parsePartnerAdsXml(xml, merchant)
}
