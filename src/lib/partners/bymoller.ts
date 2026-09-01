import { buildPartnerAdsAffiliateUrl, fetchPartnerAdsFeed } from '../partner-ads'
import { calculateDealScore } from '../deal-engine'

/** Approved Partner-ads program: ByMoller NO (program 12717). */
export const byMollerConfig = {
  merchant: 'ByMoller NO',
  programId: '12717',
  partnerId: '57447',
  bannerId: '117688',
  feedId: '245',
  feedUrl: 'https://www.partner-ads.com/no/feed_udlaes.php?partnerid=57447&bannerid=117670&feedid=245',
  affiliateTemplate: 'https://www.partner-ads.com/no/klikbanner.php?partnerid=57447&bannerid=117688&htmlurl=PRODUKTLINK',
  commissionPercent: 17.5,
  cookieDays: 40,
  discountCode: 'BM10BTGA',
  approved: true,
} as const

export function byMollerFeedUrl() {
  return process.env.BYMOLLER_FEED_URL || byMollerConfig.feedUrl
}

export function byMollerAffiliateTemplate() {
  return process.env.BYMOLLER_PRODUCT_LINK_TEMPLATE || byMollerConfig.affiliateTemplate
}

export async function getByMollerDeals() {
  const products = await fetchPartnerAdsFeed(byMollerFeedUrl(), byMollerConfig.merchant)
  const template = byMollerAffiliateTemplate()

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
      publishable: Boolean(byMollerConfig.approved && affiliateUrl && score.publishable),
    }
  })
}

// Backwards-compatible alias used by the deals API.
export const getBymollerDeals = getByMollerDeals
