import { NextResponse } from 'next/server';
import { demoDeals, getDemoScore } from '../../../lib/demo-deals';
import { getSolarCampDeals } from '../../../src/lib/partners/solarcamp';
import { getRitoHobbyDeals } from '../../../src/lib/partners/ritohobby';
import { getBymollerDeals } from '../../../src/lib/partners/bymoller';
import { getAktivVinterDeals } from '../../../src/lib/partners/aktivvinter';
import { getDogsomeDeals } from '../../../src/lib/partners/dogsome';
import { getByhappymeDeals } from '../../../src/lib/partners/byhappyme';
import { getUtefuglDeals } from '../../../src/lib/partners/utefugl';
import { getKuleSokkerDeals } from '../../../src/lib/partners/kulesokker';
import { getSatanaDeals } from '../../../src/lib/partners/satana';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const feeds = [
    ['SolarCamp.no', getSolarCampDeals],
    ['Ritohobby.no', getRitoHobbyDeals],
    ['ByMoller NO', getBymollerDeals],
    ['AktivVinter.no', getAktivVinterDeals],
    ['Dogsome.no', getDogsomeDeals],
    ['Byhappyme.com', getByhappymeDeals],
    ['Utefugl.no', getUtefuglDeals],
    ['Kule Sokker', getKuleSokkerDeals],
    ['Satana.no', getSatanaDeals],
  ] as const;

  const results = await Promise.allSettled(feeds.map(([, loader]) => loader()));
  const successfulFeeds: string[] = [];
  const failedFeeds: { merchant: string; error: string }[] = [];
  const allDeals: any[] = [];

  results.forEach((result, index) => {
    const merchant = feeds[index][0];
    if (result.status === 'fulfilled') {
      successfulFeeds.push(merchant);
      allDeals.push(...result.value);
    } else {
      failedFeeds.push({
        merchant,
        error: result.reason instanceof Error ? result.reason.message : 'Unknown feed error',
      });
    }
  });

  const deals = allDeals
    .filter((deal) => deal.publishable)
    .sort((a, b) => (b.score?.score ?? 0) - (a.score?.score ?? 0))
    .slice(0, 100);

  if (successfulFeeds.length > 0) {
    return NextResponse.json({
      source: 'partner-ads',
      generatedAt: new Date().toISOString(),
      feeds: successfulFeeds,
      failedFeeds,
      products: allDeals.length,
      publishable: deals.length,
      deals,
    }, { headers: { 'Cache-Control': 's-maxage=900, stale-while-revalidate=3600' } });
  }

  const demo = demoDeals.map((deal) => ({
    ...deal,
    score: getDemoScore(deal),
    demo: true,
    publishable: false,
    reason: 'Ingen Partner-ads produktfeed kunne hentes akkurat nå',
  }));

  return NextResponse.json({
    source: 'demo-fallback',
    generatedAt: new Date().toISOString(),
    failedFeeds,
    deals: demo,
  }, { status: 200, headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } });
}
