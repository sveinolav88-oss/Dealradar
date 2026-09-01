import { buildPartnerAdsAffiliateUrl, fetchPartnerAdsFeed } from '../partner-ads'
import { calculateDealScore } from '../deal-engine'

/** Approved Partner-ads program: Dogsome (program 10742). */
export const dogsomeConfig = {
  merchant: 'Dogsome.no',
  programId: '10742',
  partnerId: '57447',
  bannerId: '105659',
  feedId: '178',
  feedUrl: 'https://www.partner-ads.com/no/feed_udlaes.php?partnerid=57447&bannerid=105557&feedid=178',
  affiliateTemplate: 'https://www.partner-ads.com/no/klikbanner.php?partnerid=57447&bannerid=105659&htmlurl=PRODUKTLINK',
  commissionPercent: 8,
  cookieDays: 40,
  approved: true,
} as const

export function dogsomeFeedUrl() {
  return process.env.DOGSOME_FEED_URL || dogsomeConfig.feedUrl
}

export function dogsomeAffiliateTemplate() {
  return process.env.DOGSOME_PRODUCT_LINK_TEMPLATE || dogsomeConfig.affiliateTemplate
}

export async function getDogsomeDeals() {
  const products = await fetchPartnerAdsFeed(dogsomeFeedUrl(), dogsomeConfig.merchant)
  const template = dogsomeAffiliateTemplate()

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
      publishable: Boolean(dogsomeConfig.approved && affiliateUrl && score.publishable),
    }
  })
}
