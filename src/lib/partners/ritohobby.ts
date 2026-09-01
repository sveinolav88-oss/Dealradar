import { buildPartnerAdsAffiliateUrl, fetchPartnerAdsFeed } from '../partner-ads'
import { calculateDealScore } from '../deal-engine'

/** Approved Partner-ads program: Ritohobby.no (program 5588). */
export const ritoHobbyConfig = {
  merchant: 'Ritohobby.no',
  programId: '5588',
  partnerId: '57447',
  bannerId: '50621',
  feedId: '2',
  feedUrl: 'https://www.partner-ads.com/no/feed_udlaes.php?partnerid=57447&bannerid=50620&feedid=2',
  affiliateTemplate: 'https://www.partner-ads.com/no/klikbanner.php?partnerid=57447&bannerid=50621&htmlurl=PRODUKTLINK',
  commissionPercent: 7,
  cookieDays: 21,
  approved: true,
} as const

export function ritoHobbyFeedUrl() {
  return process.env.RITO_HOBBY_FEED_URL || ritoHobbyConfig.feedUrl
}

export function ritoHobbyAffiliateTemplate() {
  return process.env.RITO_HOBBY_PRODUCT_LINK_TEMPLATE || ritoHobbyConfig.affiliateTemplate
}

export async function getRitoHobbyDeals() {
  const products = await fetchPartnerAdsFeed(ritoHobbyFeedUrl(), ritoHobbyConfig.merchant)
  const template = ritoHobbyAffiliateTemplate()

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
      publishable: Boolean(ritoHobbyConfig.approved && affiliateUrl && score.publishable),
    }
  })
}
