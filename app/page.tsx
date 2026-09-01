const categories = ['Elektronikk', 'Gaming', 'Hjem', 'Camping', 'Sport', 'Friluft'];

const featureIcons = [
  { icon: '↗', title: 'Prishistorikk', text: 'Vi sjekker historiske priser automatisk.' },
  { icon: '%', title: 'Reelle prisfall', text: 'Vi avslører ekte rabatter.' },
  { icon: '◈', title: 'Sammenligning', text: 'Vi sammenligner på tvers av butikker.' },
  { icon: '↗', title: 'Trygge kjøp', text: 'Kun fra våre utvalgte affiliate-partnere.' },
];

const steps = [
  { n: '01', icon: '⌕', title: 'Vi overvåker priser', text: 'Vi henter priser fra tusenvis av produkter hos våre partnere – hele døgnet.' },
  { n: '02', icon: '◉', title: 'Vi analyserer dataen', text: 'Vår algoritme sjekker pris historikk, prisfall, normalpris og sammenligner med andre butikker.' },
  { n: '03', icon: '✦', title: 'Vi gir en Deal Score', text: 'Hvert tilbud får en score fra 0–100 basert på hvor god dealen faktisk er.' },
  { n: '04', icon: '✓', title: 'Du handler trygt', text: 'Du får kun tilbud med affiliate-lenke til våre partnere – trygt for deg, bra for oss.' },
];

export default function Home() {
  return (
    <div className="site">
      <nav className="nav">
        <a className="brand" href="#top" aria-label="DealRadar hjem"><span className="brandmark">◉</span><span>DealRadar</span></a>
        <div className="navlinks"><a href="#how">Slik fungerer det</a><a href="#categories">Kategorier</a><a href="#alerts">Kommer snart</a><a href="#about">Om oss</a></div>
        <a className="nav-cta" href="#alerts"><span>♧</span> Få varsel når vi lanserer</a>
      </nav>

      <header className="hero" id="top">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">ENDA SMARTERE DEALS</span>
            <h1>Vi finner deals<br /><span>som faktisk er gode.</span></h1>
            <p>DealRadar analyserer tusenvis av priser hver dag og viser deg tilbud som virkelig er verdt pengene.</p>
            <div className="features">{featureIcons.map((f, i) => <div className="feature" key={f.title}><span className={`feature-icon fi-${i}`}>{f.icon}</span><strong>{f.title}</strong><small>{f.text}</small></div>)}</div>
            <a className="primary-cta" href="#alerts"><span>✉</span> Få varsel når vi lanserer</a>
            <span className="cta-note">100% gratis. Ingen spam.</span>
          </div>

          <div className="deal-visual" aria-label="Eksempel på DealRadar Score">
            <div className="radar-grid"></div>
            <div className="deal-head"><span>DEAL RADAR SCORE</span><b>94<em>/100</em></b><div className="stars">★ ★ ★ ★ ◐</div></div>
            <div className="headphone"><div className="ear ear-left"></div><div className="band"></div><div className="ear ear-right"></div></div>
            <div className="price-box"><small>NÅ</small><strong>1 990 kr</strong><del>FØR 2 990 kr</del><mark>−33%</mark></div>
            <div className="checks"><div>◉ Laveste pris siste 90 dager <b>✓</b></div><div>◉ 33% under normalpris <b>✓</b></div><div>◉ Pris har falt 18% siste uke <b>✓</b></div><div>◉ På lager hos 3 butikker <b>✓</b></div></div>
            <div className="mini-chart"><svg viewBox="0 0 260 100" role="img" aria-label="Pris faller over tid"><polyline points="5,18 35,27 60,25 84,40 110,34 135,52 160,47 185,67 210,72 240,84" fill="none" stroke="currentColor" strokeWidth="3"/><circle cx="240" cy="84" r="5" fill="currentColor"/></svg><span>90d&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30d&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Nå</span></div>
          </div>
        </div>
        <div className="partners"><span>Vi samarbeider med<br />kjente butikker</span><b>◈ komplett</b><b>PROSHOP</b><b>◒ Dustin</b><b>Batteriexperten</b><b>◉ eleven</b></div>
      </header>

      <main>
        <section className="how" id="how"><div className="section-title"><span>SLIK FUNGERER DET</span><h2>Slik fungerer DealRadar</h2></div><div className="steps">{steps.map((s, i) => <div className="step" key={s.n}><div className={`step-icon si-${i}`}>{s.icon}</div><small>{s.n}</small><h3>{s.title}</h3><p>{s.text}</p>{i < 3 && <div className="connector">→</div>}</div>)}</div></section>

        <section className="categories" id="categories"><div className="section-title left"><span>FINN DIN NESTE DEAL</span><h2>Kategorier</h2></div><div className="category-grid">{categories.map((c, i) => <a href="#alerts" className="category-card" key={c}><span>{['✦','⌁','⌂','♧','◒','△'][i]}</span><strong>{c}</strong><small>Kommer snart →</small></a>)}</div></section>

        <section className="alerts" id="alerts"><div className="alert-copy"><span className="pill">KOMMER SNART</span><h2>De aller beste dealene.<br />Rett i innboksen.</h2><p>Vi lanserer snart! Bli med på listen vår og vær blant de første som får tilgang til de beste dealene.</p><form className="signup"><input type="email" aria-label="E-postadresse" placeholder="Din e-postadresse" /><button type="button">Meld meg på →</button></form><small>◷ Vi respekterer personvernet ditt. Meld deg av når som helst.</small></div><div className="phone-wrap"><div className="floating bell">♧</div><div className="floating percent">%</div><div className="phone"><div className="phone-top">◉ DealRadar <span>→</span></div><div className="phone-flame">✦</div><strong>Ny toppdeal funnet!</strong><p>Apple AirPods Pro 2</p><div className="phone-price">1 990 kr <span>−28%</span></div><button>Se dealen →</button></div></div></section>
      </main>

      <footer className="footer" id="about"><div className="footer-brand"><span className="brandmark">◉</span><b>DealRadar</b><p>Vi finner deals som faktisk er gode.<br />Basert på data. Ikke syns.</p></div><div className="footer-links"><a href="#about">Om oss</a><a href="#about">Personvern</a><a href="#about">Affiliate-disclosure</a><a href="#about">Kontakt</a></div><div className="copyright">© 2026 DealRadar.no<br />Alle rettigheter reservert.</div></footer>
    </div>
  );
}
