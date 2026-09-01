import { NextResponse } from 'next/server'
import { buildPartnerAdsAffiliateUrl, fetchPartnerAdsFeed } from '../../../../src/lib/partner-ads'

export async function GET() {
  const feedUrl = process.env.PARTNER_ADS_FEED_URL
  const merchant = process.env.PARTNER_ADS_MERCHANT || 'Partner-ads'
  const linkTemplate = process.env.PARTNER_ADS_PRODUCT_LINK_TEMPLATE
  const uidPrefix = process.env.PARTNER_ADS_UID_PREFIX || 'dealradar'

  if (!feedUrl) {
    return NextResponse.json({ ok: false, configured: false, message: 'PARTNER_ADS_FEED_URL is not configured yet.' }, { status: 200 })
  }

  try {
    const products = await fetchPartnerAdsFeed(feedUrl, merchant)
    const priced = products.filter((product) => product.referencePrice && product.referencePrice > product.currentPrice)
    const inStock = products.filter((product) => product.inStock !== false)
    const affiliateReady = Boolean(linkTemplate)

    const sample = products.slice(0, 10).map((product) => ({
      ...product,
      affiliateUrl: product.affiliateUrl || (
        linkTemplate && product.productUrl
          ? buildPartnerAdsAffiliateUrl(linkTemplate, product.productUrl, `${uidPrefix}-${product.id}`)
          : null
      ),
    }))

    return NextResponse.json({
      ok: true,
      configured: true,
      merchant,
      affiliateReady,
      products: products.length,
      productsWithReferencePrice: priced.length,
      inStock: inStock.length,
      sample,
    })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      configured: true,
      message: error instanceof Error ? error.message : 'Unable to read Partner-ads feed',
    }, { status: 502 })
  }
}
