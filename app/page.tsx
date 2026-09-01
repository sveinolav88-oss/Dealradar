const categories = ['Elektronikk', 'Gaming', 'Hjem', 'Camping', 'Sport', 'Friluft'];

const featureIcons = [
  { icon: '↗', title: 'Prishistorikk', text: 'Vi ser på utviklingen – ikke bare førprisen.' },
  { icon: '%', title: 'Reelle prisfall', text: 'Rabatten må faktisk være interessant.' },
  { icon: '◈', title: 'Sammenligning', text: 'Vi sammenligner tilgjengelige priser.' },
  { icon: '✓', title: 'Tydelig merking', text: 'Affiliate-lenker skal alltid merkes.' },
];

const steps = [
  { n: '01', icon: '⌕', title: 'Vi følger prisene', text: 'Produkt- og prisdata hentes fra godkjente partnerkilder når feedene er aktive.' },
  { n: '02', icon: '◉', title: 'Vi analyserer', text: 'Prisfall vurderes mot historikk, normalpris, konkurrenter og tilgjengelighet.' },
  { n: '03', icon: '✦', title: 'Vi lager en score', text: 'DealRadar Score fra 0–100 gjør det raskere å se hvor interessant et tilbud er.' },
  { n: '04', icon: '✓', title: 'Du velger selv', text: 'Vi sender deg videre til butikken. Du bestemmer om du vil kjøpe.' },
];

const faqs = [
  ['Hva er DealRadar?', 'DealRadar er en norsk sammenligningstjeneste som skal gjøre det enklere å finne reelle prisfall og gode kjøp.'],
  ['Hvordan avgjør dere om en deal er god?', 'Vi ser på flere datapunkter, blant annet prisutvikling, normalpris, konkurrentpriser og tilgjengelighet. Målet er å unngå å kalle et tilbud godt bare fordi en butikk viser en høy førpris.'],
  ['Koster det noe å bruke DealRadar?', 'Nei. DealRadar skal være gratis for brukeren.'],
  ['Tjener DealRadar penger på kjøp?', 'Enkelte lenker kan være affiliate-lenker. Da kan vi få provisjon hvis du handler via lenken. Dette skal alltid være tydelig merket.'],
];

export default function Home() {
  return (
    <div className="site">
      <nav className="nav">
        <a className="brand" href="#top" aria-label="DealRadar hjem"><span className="brandmark">◉</span><span>DealRadar</span></a>
        <div className="navlinks"><a href="/deals" className="nav-deals">Deals <span>→</span></a><a href="#how">Slik fungerer det</a><a href="#categories">Kategorier</a><a href="#score">Deal Score</a><a href="#about">Om oss</a></div>
        <a className="nav-cta" href="/deals"><span>✦</span> Se dagens deals</a>
      </nav>

      <header className="hero" id="top">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">DEALRADAR · LIVE DEALS</span>
            <h1>Ikke stol på<br /><span>førprisen.</span></h1>
            <p>Vi bygger DealRadar for én ting: å finne ut om et tilbud faktisk er en god deal. Prisdata, historikk og sammenligning samles i én enkel vurdering.</p>
            <div className="features">{featureIcons.map((f, i) => <div className="feature" key={f.title}><span className={`feature-icon fi-${i}`}>{f.icon}</span><strong>{f.title}</strong><small>{f.text}</small></div>)}</div>
            <div className="hero-actions"><a className="primary-cta" href="/deals"><span>✦</span> Se ekte deals nå</a><a className="secondary-cta" href="#how">Slik fungerer det ↓</a></div>
            <span className="cta-note">Gratis å bruke · ingen skjulte abonnement</span>
          </div>

          <div className="deal-visual" aria-label="Eksempel på DealRadar Score">
            <div className="visual-glow"></div><div className="radar-grid"></div>
            <div className="deal-head"><span>EKSEMPEL · IKKE EN EKTE DEAL</span><b>94<em>/100</em></b><div className="stars">★ ★ ★ ★ ◐</div></div>
            <div className="headphone"><div className="ear ear-left"></div><div className="band"></div><div className="ear ear-right"></div></div>
            <div className="price-box"><small>NÅ</small><strong>1 990 kr</strong><del>Eksempel før 2 990 kr</del><mark>−33%</mark></div>
            <div className="checks"><div>◉ Lav pris mot historikk <b>✓</b></div><div>◉ Under beregnet normalpris <b>✓</b></div><div>◉ Tydelig prisfall <b>✓</b></div><div>◉ Tilgjengelig hos partner <b>✓</b></div></div>
            <div className="mini-chart"><svg viewBox="0 0 260 100" role="img" aria-label="Eksempel på prisutvikling"><polyline points="5,18 35,27 60,25 84,40 110,34 135,52 160,47 185,67 210,72 240,84" fill="none" stroke="currentColor" strokeWidth="3"/><circle cx="240" cy="84" r="5" fill="currentColor"/></svg><span>90d&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30d&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nå</span></div>
            <div className="visual-label">Slik kan en deal vurderes</div>
          </div>
        </div>
        <div className="trust-strip"><span><i>01</i> Pris først</span><span><i>02</i> Historikk</span><span><i>03</i> Sammenligning</span><span><i>04</i> Tydelig merking</span><span><i>05</i> Ingen falske tilbud</span></div>
      </header>

      <main>
        <section className="how" id="how"><div className="section-title"><span>SLIK FUNGERER DET</span><h2>Fra prisfall til Deal Score</h2><p>En enkel prosess bygget for å gjøre tilbud lettere å forstå.</p></div><div className="steps">{steps.map((s, i) => <div className="step" key={s.n}><div className={`step-icon si-${i}`}>{s.icon}</div><small>{s.n}</small><h3>{s.title}</h3><p>{s.text}</p>{i < 3 && <div className="connector">→</div>}</div>)}</div></section>

        <section className="score-section" id="score"><div className="score-card"><div className="score-copy"><span className="section-kicker">DEALRADAR SCORE</span><h2>Ett tall. Flere datapunkter.</h2><p>Deal Score skal gjøre det lett å skille et reelt prisfall fra et tilbud som bare ser bra ut i reklamen.</p><div className="score-points"><div><b>Pris</b><span>Hvordan dagens pris står mot historikken.</span></div><div><b>Historikk</b><span>Hvor lavt produktet faktisk har vært.</span></div><div><b>Konkurrenter</b><span>Hvordan prisen står mot andre butikker.</span></div></div></div><div className="score-orb"><span>EKSEMPEL</span><strong>94</strong><small>/100</small><em>STERK DEAL</em></div></div></section>

        <section className="categories" id="categories"><div className="section-title left"><span>FINN DIN NESTE DEAL</span><h2>Kategorier</h2><p>Vi starter med kategorier der prisforskjeller ofte betyr mye.</p></div><div className="category-grid">{categories.map((c, i) => <a href="/deals" className="category-card" key={c}><span>{['✦','⌁','⌂','♧','◒','△'][i]}</span><strong>{c}</strong><small>Se tilgjengelige deals →</small></a>)}</div></section>

        <section className="principles"><div className="principle-main"><span className="section-kicker">VÅRT LØFTE</span><h2>Vi skal ikke finne flest deals.<br /><span>Vi skal finne de beste.</span></h2><p>Et tilbud er ikke automatisk bra fordi det står «−40 %». DealRadar skal belønne dokumenterte prisfall og være åpen om hva vi vet – og hva vi ikke vet.</p></div><div className="principle-list"><div><span>01</span><b>Data fremfor hype</b><small>Pris og historikk skal veie tyngre enn store prosenttall.</small></div><div><span>02</span><b>Tydelig provisjon</b><small>Affiliate-lenker merkes slik at du vet hvordan vi tjener penger.</small></div><div><span>03</span><b>Færre, bedre deals</b><small>Vi vil heller vise 20 gode enn 200 middelmådige.</small></div></div></section>

        <section className="faq"><div className="section-title"><span>SPØRSMÅL</span><h2>Vanlige spørsmål</h2></div><div className="faq-grid">{faqs.map(([q, a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>

        <section className="alerts" id="launch"><div className="alert-copy"><span className="pill">LIVE</span><h2>Finn deals som faktisk er gode.</h2><p>DealRadar kobler på godkjente partnerkilder og analyserer produkter etter pris, historikk, sammenligning og tilgjengelighet.</p><div className="launch-box"><div className="launch-icon">✦</div><div><strong>Se dagens deals</strong><span>Produkter som passerer DealRadar-motoren vises på deals-siden.</span></div></div><small>Affiliate-lenker vil alltid være tydelig merket. DealRadar skal være en tjeneste du kan stole på.</small></div><div className="phone-wrap"><div className="floating bell">✦</div><div className="floating percent">%</div><div className="phone"><div className="phone-top">◉ DealRadar <span>→</span></div><div className="phone-flame">✦</div><strong>Ny toppdeal funnet!</strong><p>Eksempel på fremtidig varsel</p><div className="phone-price">1 990 kr <span>−28%</span></div><a href="/deals">Se deals →</a></div></div></section>
      </main>

      <footer className="footer" id="about"><div className="footer-brand"><span className="brandmark">◉</span><div><b>DealRadar</b><p>Vi finner deals som faktisk er gode.<br />Basert på data. Ikke syns.</p></div></div><div className="footer-links"><a href="/deals">Alle deals</a><a href="#how">Slik fungerer det</a><a href="#categories">Kategorier</a><a href="/personvern">Personvern</a><a href="/affiliate">Affiliate-disclosure</a><a href="mailto:hei@dealradar.no">Kontakt</a></div><div className="copyright">© 2026 DealRadar.no<br />Alle rettigheter reservert.</div></footer>
    </div>
  );
}
