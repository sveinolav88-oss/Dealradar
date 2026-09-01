import { NextResponse } from 'next/server'
import { fetchPartnerAdsFeed } from '@/src/lib/partner-ads'

export async function GET() {
  const feedUrl = process.env.PARTNER_ADS_FEED_URL
  const merchant = process.env.PARTNER_ADS_MERCHANT || 'Partner-ads'

  if (!feedUrl) {
    return NextResponse.json({ ok: false, configured: false, message: 'PARTNER_ADS_FEED_URL is not configured yet.' }, { status: 200 })
  }

  try {
    const products = await fetchPartnerAdsFeed(feedUrl, merchant)
    const priced = products.filter((product) => product.referencePrice && product.referencePrice > product.currentPrice)
    const inStock = products.filter((product) => product.inStock !== false)

    return NextResponse.json({
      ok: true,
      configured: true,
      merchant,
      products: products.length,
      productsWithReferencePrice: priced.length,
      inStock: inStock.length,
      sample: products.slice(0, 10),
    })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      configured: true,
      message: error instanceof Error ? error.message : 'Unable to read Partner-ads feed',
    }, { status: 502 })
  }
}
