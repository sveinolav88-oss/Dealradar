import type { Offer } from './types';

/** Affiliate guard used by every future publishing path. */
export function hasValidAffiliateOffer(offer: Offer): boolean {
  return /^https?:\/\//i.test(offer.affiliateUrl.trim());
}

export function filterAffiliateOffers(offers: Offer[]): Offer[] {
  return offers.filter(hasValidAffiliateOffer);
}
