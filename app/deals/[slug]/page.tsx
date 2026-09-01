import Link from 'next/link';
import { notFound } from 'next/navigation';
import DealStyles from '../deal-styles';
import { getAllPartnerDeals } from '../../../src/lib/all-partner-deals';

const money = new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });

function slugify(value: string) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DealDetail({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const [{ slug }, { id }] = await Promise.all([params, searchParams]);
  const result = await getAllPartnerDeals();
  const deal = result.deals.find((item) => item.id === id || slugify(item.name) === slug);
  if (!deal) notFound();

  const discount = deal.referencePrice && deal.referencePrice > deal.currentPrice
    ? Math.round((1 - deal.currentPrice / deal.referencePrice) * 100)
    : 0;
  const score = deal.score.score;
  const scoreWidth = Math.min(100, Math.max(0, score));
  const priceWidth = Math.min(100, Math.max(0, discount * 2));
  const related = result.deals
    .filter((item) => item.id !== deal.id && item.category === deal.category)
    .slice(0, 3);

  return <><DealStyles/><main className="detail-page">
    <header className="deals-header">
      <Link href="/" className="deals-brand"><span className="brandmark">◉</span>DealRadar</Link>
      <Link href="/deals" className="back-link">← Alle deals</Link>
    </header>

    <div className="detail-wrap">
      <div
        className="detail-art"
        style={deal.imageUrl ? { backgroundImage: `url(${deal.imageUrl})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : undefined}
      >
        <span>{deal.category}</span><b>◉</b>
      </div>

      <article className="detail-content">
        <div className="live-detail-badges"><span className="live-badge">LIVE DEAL</span><span className="merchant-badge">{deal.merchant}</span></div>
        <p className="detail-brand">{deal.merchant}</p>
        <h1>{deal.name}</h1>
        <p className="detail-description">Vi har funnet dette produktet i en aktiv partnerfeed. DealRadar vurderer prisen ut fra tilgjengelig prisinformasjon og publiserer bare produkter som passerer terskelen vår.</p>

        <div className="score-panel">
          <div><span>DEALRADAR SCORE</span><strong>{score}<em>/100</em></strong><b>{deal.score.label}</b></div>
          <div className="score-bars">
            <label><span>Prisfall mot oppgitt referanse</span><i><u style={{width:`${priceWidth}%`}}/></i></label>
            <label><span>Samlet deal-vurdering</span><i><u style={{width:`${scoreWidth}%`}}/></i></label>
            <label><span>Tilgjengelighet</span><i><u style={{width: deal.inStock ? '100%' : '0%'}}/></i></label>
          </div>
        </div>

        <div className="price-summary">
          <div><small>Nå</small><strong>{money.format(deal.currentPrice)}</strong></div>
          {deal.referencePrice ? <div><small>Oppgitt referanse</small><del>{money.format(deal.referencePrice)}</del></div> : null}
          {discount > 0 ? <mark>−{discount}%</mark> : null}
        </div>

        <div className="why-good">
          <h2>Hvorfor får den {score}/100?</h2>
          {deal.score.reasons.map((reason)=><p key={reason}>✓ {reason}</p>)}
          <p>✓ {deal.inStock ? 'Produktet er registrert som tilgjengelig.' : 'Produktet er ikke registrert som tilgjengelig.'}</p>
        </div>

        <div className="purchase-box">
          <div><span className="section-kicker">AKTIV PARTNER</span><strong>{deal.merchant}</strong><small>Prisen kan endres hos butikken. Sjekk alltid pris og lagerstatus før kjøp.</small></div>
          <a className="buy-cta" href={deal.affiliateUrl ?? deal.productUrl ?? '#'} target="_blank" rel="nofollow sponsored noopener">Se deal hos {deal.merchant} →</a>
        </div>

        <div className="affiliate-note"><strong>Affiliate-lenke</strong><span>DealRadar kan få provisjon hvis du handler via denne lenken. Det påvirker ikke prisen din. Vi merker affiliate-lenker tydelig.</span></div>
      </article>
    </div>

    {related.length > 0 && <section className="related-deals"><div><span className="section-kicker">FLERE FRA SAMME KATEGORI</span><h2>Andre deals du kanskje liker</h2></div><div className="related-grid">{related.map((item) => <Link href={`/deals/${slugify(item.name)}?id=${encodeURIComponent(item.id)}`} key={`${item.merchant}-${item.id}`}><span>{item.merchant}</span><strong>{item.name}</strong><b>{money.format(item.currentPrice)}</b><em>{item.score.score}/100 →</em></Link>)}</div></section>}
  </main></>;
}
