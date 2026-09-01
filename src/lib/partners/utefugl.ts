import { buildPartnerAdsAffiliateUrl, fetchPartnerAdsFeed } from '../partner-ads'
import { calculateDealScore } from '../deal-engine'

/** Approved Partner-ads program: Utefugl.no (program 12417). */
export const utefuglConfig = {
  merchant: 'Utefugl.no',
  programId: '12417',
  partnerId: '57447',
  bannerId: '115896',
  feedId: '240',
  feedUrl: 'https://www.partner-ads.com/no/feed_udlaes.php?partnerid=57447&bannerid=115876&feedid=240',
  affiliateTemplate: 'https://www.partner-ads.com/no/klikbanner.php?partnerid=57447&bannerid=115896&htmlurl=PRODUKTLINK',
  commissionPercent: 8,
  cookieDays: 40,
  approved: true,
} as const

export function utefuglFeedUrl() {
  return process.env.UTEFUGL_FEED_URL || utefuglConfig.feedUrl
}

export function utefuglAffiliateTemplate() {
  return process.env.UTEFUGL_PRODUCT_LINK_TEMPLATE || utefuglConfig.affiliateTemplate
}

export async function getUtefuglDeals() {
  const products = await fetchPartnerAdsFeed(utefuglFeedUrl(), utefuglConfig.merchant)
  const template = utefuglAffiliateTemplate()

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
      publishable: Boolean(utefuglConfig.approved && affiliateUrl && score.publishable),
    }
  })
}
