import { buildPartnerAdsAffiliateUrl, fetchPartnerAdsFeed } from '../partner-ads'
import { calculateDealScore } from '../deal-engine'

/** Approved Partner-ads program: Kule Sokker (program 8619). */
export const kuleSokkerConfig = {
  merchant: 'Kule Sokker',
  programId: '8619',
  partnerId: '57447',
  bannerId: '84602',
  feedId: '77',
  feedUrl: 'https://www.partner-ads.com/no/feed_udlaes.php?partnerid=57447&bannerid=84601&feedid=77',
  affiliateTemplate: 'https://www.partner-ads.com/no/klikbanner.php?partnerid=57447&bannerid=84602&htmlurl=PRODUKTLINK',
  commissionPercent: 10,
  cookieDays: 40,
  approved: true,
} as const

export function kuleSokkerFeedUrl() {
  return process.env.KULESOKKER_FEED_URL || kuleSokkerConfig.feedUrl
}

export function kuleSokkerAffiliateTemplate() {
  return process.env.KULESOKKER_PRODUCT_LINK_TEMPLATE || kuleSokkerConfig.affiliateTemplate
}

export async function getKuleSokkerDeals() {
  const products = await fetchPartnerAdsFeed(kuleSokkerFeedUrl(), kuleSokkerConfig.merchant)
  const template = kuleSokkerAffiliateTemplate()

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
      publishable: Boolean(kuleSokkerConfig.approved && affiliateUrl && score.publishable),
    }
  })
}
