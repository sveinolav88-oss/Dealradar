import { getSolarCampDeals } from './partners/solarcamp'
import { getRitoHobbyDeals } from './partners/ritohobby'
import { getByMollerDeals } from './partners/bymoller'
import { getAktivVinterDeals } from './partners/aktivvinter'
import { getDogsomeDeals } from './partners/dogsome'
import { getByhappymeDeals } from './partners/byhappyme'
import { getUtefuglDeals } from './partners/utefugl'
import { getKuleSokkerDeals } from './partners/kulesokker'
import { getSatanaDeals } from './partners/satana'

const partnerLoaders = [
  { merchant: 'SolarCamp.no', load: getSolarCampDeals },
  { merchant: 'Ritohobby.no', load: getRitoHobbyDeals },
  { merchant: 'ByMoller NO', load: getByMollerDeals },
  { merchant: 'AktivVinter.no', load: getAktivVinterDeals },
  { merchant: 'Dogsome.no', load: getDogsomeDeals },
  { merchant: 'Byhappyme.com', load: getByhappymeDeals },
  { merchant: 'Utefugl.no', load: getUtefuglDeals },
  { merchant: 'Kule Sokker', load: getKuleSokkerDeals },
  { merchant: 'Satana.no', load: getSatanaDeals },
] as const

export type PartnerFeedResult = {
  merchant: string
  products: Awaited<ReturnType<(typeof partnerLoaders)[number]['load']>>
}

export async function getAllPartnerDeals() {
  const results = await Promise.allSettled(partnerLoaders.map((partner) => partner.load()))
  const successful: PartnerFeedResult[] = []
  const errors: { merchant: string; error: string }[] = []

  results.forEach((result, index) => {
    const merchant = partnerLoaders[index].merchant
    if (result.status === 'fulfilled') {
      successful.push({ merchant, products: result.value })
    } else {
      errors.push({
        merchant,
        error: result.reason instanceof Error ? result.reason.message : 'Ukjent feed-feil',
      })
    }
  })

  const deals = successful
    .flatMap(({ products }) => products)
    .filter((deal) => deal.publishable)
    .sort((a, b) => b.score.score - a.score.score)
    .slice(0, 100)

  return {
    deals,
    successfulFeeds: successful.map((feed) => ({ merchant: feed.merchant, products: feed.products.length })),
    errors,
    partnerCount: partnerLoaders.length,
  }
}
