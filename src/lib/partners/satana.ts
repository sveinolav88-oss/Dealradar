import { buildPartnerAdsAffiliateUrl, fetchPartnerAdsFeed } from '../partner-ads'
import { calculateDealScore } from '../deal-engine'

/** Approved Partner-ads program: Satana NO (program 10357). */
export const satanaConfig = {
  merchant: 'Satana.no',
  programId: '10357',
  partnerId: '57447',
  bannerId: '101685',
  feedId: '164',
  feedUrl: 'https://www.partner-ads.com/no/feed_udlaes.php?partnerid=57447&bannerid=101682&feedid=164',
  affiliateTemplate: 'https://www.partner-ads.com/no/klikbanner.php?partnerid=57447&bannerid=101685&htmlurl=PRODUKTLINK',
  commissionPercent: 15,
  cookieDays: 7,
  approved: true,
} as const

export function satanaFeedUrl() {
  return process.env.SATANA_FEED_URL || satanaConfig.feedUrl
}

export function satanaAffiliateTemplate() {
  return process.env.SATANA_PRODUCT_LINK_TEMPLATE || satanaConfig.affiliateTemplate
}

export async function getSatanaDeals() {
  const products = await fetchPartnerAdsFeed(satanaFeedUrl(), satanaConfig.merchant)
  const template = satanaAffiliateTemplate()

  return products.map((product) => {
    const score = calculateDealScore({
      currentPrice: product.currentPrice,
      referencePrice: product.referencePrice,
      inStock: product.inStock,
    })

    const affiliateUrl = product.productUrl
      ? buildPartnerAdsAffiliateUrl(template, product.productUrl, `dealradar-${product.id}`)
      : null

    return {
      ...product,
      affiliateUrl,
      score,
      publishable: Boolean(satanaConfig.approved && affiliateUrl && score.publishable),
    }
  })
}
