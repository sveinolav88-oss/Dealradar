import Link from 'next/link';
import DealStyles from './deal-styles';
import { getAllPartnerDeals } from '../../src/lib/all-partner-deals';

const money = new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 });

function slugify(value: string) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90);
}

export const dynamic = 'force-dynamic';

export default async function DealsPage() {
  const result = await getAllPartnerDeals();
  const publishable = result.deals;

  return <><DealStyles /><main className="deals-page">
    <header className="deals-header"><Link href="/" className="deals-brand"><span className="brandmark">◉</span>DealRadar</Link><div className="deals-nav"><Link href="/">Forsiden</Link><Link href="/deals">Alle deals</Link><Link href="/#categories">Kategorier</Link></div></header>

    <section className="deals-hero"><div><span className="eyebrow light">DEALRADAR · LIVE</span><h1>Deals som tåler et nærmere blikk.</h1><p>Vi analyserer ekte produktdata fra {result.partnerCount} godkjente partnerprogrammer og løfter frem produktene som faktisk passerer DealRadar-motoren.</p></div><div className="method-card"><span>SCORING</span><strong>Pris + førpris + tilgjengelighet</strong><small>Kun godkjente affiliateprogrammer kan publiseres med affiliate-lenke.</small></div></section>

    <section className="deal-list-wrap"><div className="deal-list-head"><div><span className="section-kicker">LIVE PARTNERFEEDS</span><h2>{publishable.length ? 'De sterkeste dealene akkurat nå' : 'Vi leter etter de sterke dealene'}</h2></div><span className="demo-badge">{result.successfulFeeds.length}/{result.partnerCount} feeds aktive</span></div>
      {result.errors.length > 0 && <div className="data-note"><div className="data-note-icon">!</div><div><h2>Noen produktfeeds svarer ikke akkurat nå.</h2><p>{result.errors.map((error) => error.merchant).join(', ')} er midlertidig utilgjengelig. De andre feedene fortsetter å fungere.</p></div></div>}
      {publishable.length === 0 ? <div className="data-note"><div className="data-note-icon">✦</div><div><h2>Ingen produkter passerer terskelen akkurat nå.</h2><p>Det er med vilje. DealRadar skal ikke kalle noe en god deal bare fordi en butikk viser en høy førpris.</p></div></div> : <div className="deal-grid">{publishable.map((deal) => {
        const discount = deal.referencePrice ? Math.round((1 - deal.currentPrice / deal.referencePrice) * 100) : 0;
        const slug = slugify(deal.name) || deal.id;
        return <Link className="deal-card" href={`/deals/${slug}?id=${encodeURIComponent(deal.id)}`} key={`${deal.merchant}-${deal.id}`}><div className="deal-art" style={deal.imageUrl ? { backgroundImage: `url(${deal.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}><span>{deal.category}</span><b>◉</b></div><div className="deal-body"><div className="deal-meta"><span>{deal.merchant}</span><strong>{deal.score.score}/100</strong></div><h3>{deal.name}</h3><div className="deal-price"><b>{money.format(deal.currentPrice)}</b>{deal.referencePrice ? <del>{money.format(deal.referencePrice)}</del> : null}{discount > 0 ? <mark>−{discount}%</mark> : null}</div><div className="deal-reasons">{deal.score.reasons.slice(0,2).map((reason)=><span key={reason}>✓ {reason}</span>)}</div><div className="deal-footer"><span>{deal.score.label}</span><span>Se deal →</span></div></div></Link>;
      })}</div>}
    </section>

    <section className="data-note"><div className="data-note-icon">✦</div><div><h2>DealRadar skal fortjene ordet «deal».</h2><p>Vi bruker ekte produktdata og filtrerer hardt. Når vi bygger opp egne prisobservasjoner over tid, blir vurderingen enda sterkere fordi vi kan se hva produktene faktisk har kostet – ikke bare hva butikken oppgir som førpris.</p></div></section>
  </main></>;
}
