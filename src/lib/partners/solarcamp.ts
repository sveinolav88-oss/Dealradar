import { buildPartnerAdsAffiliateUrl, fetchPartnerAdsFeed } from '../partner-ads'
import { calculateDealScore } from '../deal-engine'

export const solarCampConfig = {
  merchant: 'SolarCamp.no',
  programId: '12781',
  partnerId: '57447',
  bannerId: '118050',
  feedId: '246',
  feedUrl: 'https://www.partner-ads.com/no/feed_udlaes.php?partnerid=57447&bannerid=118046&feedid=246',
  affiliateTemplate: 'https://www.partner-ads.com/no/klikbanner.php?partnerid=57447&bannerid=118050&htmlurl=PRODUKTLINK',
  commissionPercent: 10,
  approved: true,
} as const

export function solarCampFeedUrl() {
  return process.env.PARTNER_ADS_FEED_URL || solarCampConfig.feedUrl
}

export function solarCampAffiliateTemplate() {
  return process.env.PARTNER_ADS_PRODUCT_LINK_TEMPLATE || solarCampConfig.affiliateTemplate
}

export async function getSolarCampDeals() {
  const products = await fetchPartnerAdsFeed(solarCampFeedUrl(), solarCampConfig.merchant)
  const template = solarCampAffiliateTemplate()

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
      publishable: Boolean(solarCampConfig.approved && affiliateUrl && score.publishable),
    }
  })
}
