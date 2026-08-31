const categories = ['📱 Elektronikk','🎮 Gaming','🏠 Hjem','🏕️ Camping','⚽ Sport'];

const demoDeals = [
  {drop:'−32 %',name:'Premium elektronikk',price:'2 799 kr',old:'4 099 kr',score:94},
  {drop:'−27 %',name:'Gaming-utstyr',price:'1 499 kr',old:'2 049 kr',score:89},
  {drop:'−24 %',name:'Utstyr til hjemmet',price:'899 kr',old:'1 189 kr',score:86},
];

export default function Home() {
  return <>
    <nav className="nav"><div className="logo">Deal<span>Radar</span></div><div className="navlinks"><a href="#deals">Dagens deals</a><a href="#categories">Kategorier</a><a href="#about">Slik fungerer det</a></div></nav>
    <header className="hero"><h1>Vi finner deals.<br/>Du sparer penger.</h1><p>DealRadar skal samle interessante prisfall fra norske nettbutikker og gjøre det enkelt å finne tilbudene som faktisk er verdt å klikke på.</p><div className="search"><input aria-label="Søk" placeholder="Søk etter et produkt …"/><button>Søk</button></div></header>
    <main className="wrap" id="deals"><div className="sectionhead"><div><h2>🔥 Dagens beste deals</h2><div className="muted">Første versjon – ekte affiliate-produktdata kobles på når programmene er godkjent.</div></div></div>
      <div className="cats" id="categories">{categories.map(c=><span className="cat" key={c}>{c}</span>)}</div>
      <section className="grid">{demoDeals.map(d=><article className="card" key={d.name}><div className="pic">Produktbilde</div><div className="body"><span className="badge">{d.drop}</span><h3>{d.name}</h3><div><span className="price">{d.price}</span><span className="old">{d.old}</span></div><div className="score">⭐ Deal Score <strong>{d.score}/100</strong></div><span className="cta">Se deal →</span><div className="disclosure">Eksempelvisning. Kun produkter med aktiv affiliate-lenke skal publiseres som ekte deals.</div></div></article>)}</section>
      <section className="about" id="about"><h2>Hvordan DealRadar fungerer</h2><p className="muted">Vi skal hente produktdata fra godkjente affiliate-programmer, følge prisene over tid og prioritere tilbud som ser reelt gode ut. Hovedregelen er enkel: <strong>Ingen affiliate-lenke = ingen DealRadar-deal.</strong></p></section>
    </main><footer className="footer">© 2026 DealRadar · Prisene kan endres. Kontroller alltid pris hos butikken før kjøp.</footer>
  </>;
}
