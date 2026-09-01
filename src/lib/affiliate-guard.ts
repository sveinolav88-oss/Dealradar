export function isValidAffiliateUrl(value?: string | null): boolean {
  if (!value) return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && url.hostname.length > 0
  } catch {
    return false
  }
}

export function canPublishAffiliateDeal(input: {
  score: number
  affiliateUrl?: string | null
  inStock?: boolean
}) {
  return input.score >= 65 && input.inStock !== false && isValidAffiliateUrl(input.affiliateUrl)
}
