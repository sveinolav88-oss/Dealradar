import { NextResponse } from 'next/server'
import { getAllPartnerDeals } from '../../../../src/lib/all-partner-deals'
import { databaseConfigured, persistDealSnapshot } from '../../../../src/lib/persistence'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  return request.headers.get('authorization') === `Bearer ${secret}`
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  if (!databaseConfigured()) {
    return NextResponse.json({ ok: false, error: 'DATABASE_URL is not configured' }, { status: 503 })
  }

  try {
    const result = await getAllPartnerDeals()
    const snapshot = await persistDealSnapshot(result.deals)

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      feeds: result.successfulFeeds,
      feedErrors: result.errors,
      dealsConsidered: result.deals.length,
      ...snapshot,
    })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : 'Price ingestion failed',
    }, { status: 500 })
  }
}
