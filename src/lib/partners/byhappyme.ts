import { buildPartnerAdsAffiliateUrl, fetchPartnerAdsFeed } from '../partner-ads'
import { calculateDealScore } from '../deal-engine'

/** Approved Partner-ads program: Byhappyme Norge (program 7287). */
export const byhappymeConfig = {
  merchant: 'Byhappyme.com',
  programId: '7287',
  partnerId: '57447',
  bannerId: '69200',
  feedId: '43',
  feedUrl: 'https://www.partner-ads.com/no/feed_udlaes.php?partnerid=57447&bannerid=69197&feedid=43',
  affiliateTemplate: 'https://www.partner-ads.com/no/klikbanner.php?partnerid=57447&bannerid=69200&htmlurl=PRODUKTLINK',
  commissionPercent: 10,
  cookieDays: 40,
  approved: true,
} as const

export function byhappymeFeedUrl() {
  return process.env.BYHAPPYME_FEED_URL || byhappymeConfig.feedUrl
}

export function byhappymeAffiliateTemplate() {
  return process.env.BYHAPPYME_PRODUCT_LINK_TEMPLATE || byhappymeConfig.affiliateTemplate
}

export async function getByhappymeDeals() {
  const products = await fetchPartnerAdsFeed(byhappymeFeedUrl(), byhappymeConfig.merchant)
  const template = byhappymeAffiliateTemplate()

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
      publishable: Boolean(byhappymeConfig.approved && affiliateUrl && score.publishable),
    }
  })
}
