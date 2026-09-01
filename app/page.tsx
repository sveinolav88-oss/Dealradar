const categories = ['Elektronikk', 'Gaming', 'Hjem', 'Camping', 'Sport', 'Friluft'];

const featureIcons = [
  { icon: '↗', title: 'Prishistorikk', text: 'Vi følger prisutviklingen over tid.' },
  { icon: '%', title: 'Reelle prisfall', text: 'Rabatten må faktisk være verdt noe.' },
  { icon: '◈', title: 'Sammenligning', text: 'Vi sammenligner priser og butikker.' },
  { icon: '✓', title: 'Affiliate-lenker', text: 'Deals lenkes til godkjente partnere.' },
];

const steps = [
  { n: '01', icon: '⌕', title: 'Vi overvåker priser', text: 'Når partnerdataene er koblet på, følger DealRadar produkter og prisendringer automatisk.' },
  { n: '02', icon: '◉', title: 'Vi analyserer dataen', text: 'Prisfall vurderes mot historikk, normalpris, lagerstatus og tilgjengelige butikkpriser.' },
  { n: '03', icon: '✦', title: 'Vi gir en Deal Score', text: 'Hver kandidat får en score fra 0–100 som skal svare på det viktigste spørsmålet: er dette faktisk en god deal?' },
  { n: '04', icon: '✓', title: 'Du velger selv', text: 'Når en deal er publisert, går du videre til nettbutikken via en tydelig merket affiliate-lenke.' },
];

export default function Home() {
  return (
    <div className="site">
      <nav className="nav">
        <a className="brand" href="#top" aria-label="DealRadar hjem"><span className="brandmark">◉</span><span>DealRadar</span></a>
        <div className="navlinks"><a href="#how">Slik fungerer det</a><a href="#categories">Kategorier</a><a href="#alerts">Lansering</a><a href="#about">Om oss</a></div>
        <a className="nav-cta" href="#alerts"><span>✦</span> Følg lanseringen</a>
      </nav>

      <header className="hero" id="top">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">UNDER BYGGING · LANSERES SNART</span>
            <h1>Vi finner deals<br /><span>som faktisk er gode.</span></h1>
            <p>DealRadar bygges for én ting: å skille ekte prisfall fra tilbud som bare ser billige ut. Vi analyserer prisdata og gjør det enkelt å se om en deal faktisk er verdt pengene.</p>
            <div className="features">{featureIcons.map((f, i) => <div className="feature" key={f.title}><span className={`feature-icon fi-${i}`}>{f.icon}</span><strong>{f.title}</strong><small>{f.text}</small></div>)}</div>
            <a className="primary-cta" href="#alerts"><span>✦</span> Se hva som kommer</a>
            <span className="cta-note">Gratis å bruke · ingen skjulte abonnement</span>
          </div>

          <div className="deal-visual" aria-label="Eksempel på DealRadar Score">
            <div className="radar-grid"></div>
            <div className="deal-head"><span>EKSEMPEL · DEALRADAR SCORE</span><b>94<em>/100</em></b><div className="stars">★ ★ ★ ★ ◐</div></div>
            <div className="headphone"><div className="ear ear-left"></div><div className="band"></div><div className="ear ear-right"></div></div>
            <div className="price-box"><small>NÅ</small><strong>1 990 kr</strong><del>EKSEMPEL FØR 2 990 kr</del><mark>−33%</mark></div>
            <div className="checks"><div>◉ Laveste pris i perioden <b>✓</b></div><div>◉ Under beregnet normalpris <b>✓</b></div><div>◉ Tydelig prisfall <b>✓</b></div><div>◉ Tilgjengelig hos partner <b>✓</b></div></div>
            <div className="mini-chart"><svg viewBox="0 0 260 100" role="img" aria-label="Eksempel på prisutvikling"><polyline points="5,18 35,27 60,25 84,40 110,34 135,52 160,47 185,67 210,72 240,84" fill="none" stroke="currentColor" strokeWidth="3"/><circle cx="240" cy="84" r="5" fill="currentColor"/></svg><span>90d&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30d&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nå</span></div>
          </div>
        </div>
        <div className="partners"><span>Bygges for norske<br />nettbutikker og deal-jegere</span><b>Prisdata</b><b>Deal Score</b><b>Historikk</b><b>Partnerlenker</b><b>Varsler</b></div>
      </header>

      <main>
        <section className="how" id="how"><div className="section-title"><span>SLIK FUNGERER DET</span><h2>Slik fungerer DealRadar</h2></div><div className="steps">{steps.map((s, i) => <div className="step" key={s.n}><div className={`step-icon si-${i}`}>{s.icon}</div><small>{s.n}</small><h3>{s.title}</h3><p>{s.text}</p>{i < 3 && <div className="connector">→</div>}</div>)}</div></section>

        <section className="categories" id="categories"><div className="section-title left"><span>FINN DIN NESTE DEAL</span><h2>Kategorier</h2></div><div className="category-grid">{categories.map((c, i) => <a href="#alerts" className="category-card" key={c}><span>{['✦','⌁','⌂','♧','◒','△'][i]}</span><strong>{c}</strong><small>Kommer ved lansering →</small></a>)}</div></section>

        <section className="alerts" id="alerts"><div className="alert-copy"><span className="pill">LANSERES SNART</span><h2>De aller beste dealene.<br />Samlet på ett sted.</h2><p>Vi bygger nå motoren som skal hente partnerdata, følge prisutvikling og rangere tilbud etter hvor gode de faktisk er. Når første partnerfeed er godkjent, begynner de ekte dealene å dukke opp.</p><div className="launch-box"><strong>Vil du være tidlig ute?</strong><span>Følg prosjektet – vi åpner DealRadar for alle så snart første datasett er klart.</span><a href="#top">Til toppen ↑</a></div><small>Affiliate-lenker vil være tydelig merket. DealRadar skal aldri late som en annonse er en uavhengig anbefaling.</small></div><div className="phone-wrap"><div className="floating bell">✦</div><div className="floating percent">%</div><div className="phone"><div className="phone-top">◉ DealRadar <span>→</span></div><div className="phone-flame">✦</div><strong>Ny toppdeal funnet!</strong><p>Eksempel på fremtidig varsel</p><div className="phone-price">1 990 kr <span>−28%</span></div><button type="button">Se dealen →</button></div></div></section>
      </main>

      <footer className="footer" id="about"><div className="footer-brand"><span className="brandmark">◉</span><b>DealRadar</b><p>Vi finner deals som faktisk er gode.<br />Basert på data. Ikke syns.</p></div><div className="footer-links"><a href="#about">Om oss</a><a href="/personvern">Personvern</a><a href="/affiliate">Affiliate-disclosure</a><a href="mailto:hei@dealradar.no">Kontakt</a></div><div className="copyright">© 2026 DealRadar.no<br />Alle rettigheter reservert.</div></footer>
    </div>
  );
}
