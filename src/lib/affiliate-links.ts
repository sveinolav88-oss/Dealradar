import { isValidAffiliateUrl } from './affiliate-guard'

export type AffiliateProgram = {
  merchant: string
  approved: boolean
}

/**
 * Central gate for affiliate publication.
 * DealRadar never invents tracking URLs: a program must be explicitly approved
 * and the feed/affiliate system must provide the actual tracking URL.
 */
export function resolveAffiliateUrl(program: AffiliateProgram, feedAffiliateUrl?: string | null) {
  if (!program.approved) return null
  if (!feedAffiliateUrl || !isValidAffiliateUrl(feedAffiliateUrl)) return null
  return feedAffiliateUrl
}

export function canUseAffiliateProgram(program: AffiliateProgram) {
  return Boolean(program.approved && program.merchant.trim())
}
