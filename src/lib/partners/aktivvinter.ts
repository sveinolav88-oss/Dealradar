import { buildPartnerAdsAffiliateUrl, fetchPartnerAdsFeed } from '../partner-ads'
import { calculateDealScore } from '../deal-engine'

/** Approved Partner-ads program: AktivVinter.no (program 8158). */
export const aktivVinterConfig = {
  merchant: 'AktivVinter.no',
  programId: '8158',
  partnerId: '57447',
  bannerId: '78802',
  feedId: '52',
  feedUrl: 'https://www.partner-ads.com/no/feed_udlaes.php?partnerid=57447&bannerid=78801&feedid=52',
  affiliateTemplate: 'https://www.partner-ads.com/no/klikbanner.php?partnerid=57447&bannerid=78802&htmlurl=PRODUKTLINK',
  commissionPercent: 8,
  cookieDays: 30,
  approved: true,
} as const

export function aktivVinterFeedUrl() {
  return process.env.AKTIVVINTER_FEED_URL || aktivVinterConfig.feedUrl
}

export function aktivVinterAffiliateTemplate() {
  return process.env.AKTIVVINTER_PRODUCT_LINK_TEMPLATE || aktivVinterConfig.affiliateTemplate
}

export async function getAktivVinterDeals() {
  const products = await fetchPartnerAdsFeed(aktivVinterFeedUrl(), aktivVinterConfig.merchant)
  const template = aktivVinterAffiliateTemplate()

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
      publishable: Boolean(aktivVinterConfig.approved && affiliateUrl && score.publishable),
    }
  })
}
