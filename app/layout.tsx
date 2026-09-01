import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dealradar.no'),
  title: {
    default: 'DealRadar – Finn deals som faktisk er gode',
    template: '%s | DealRadar',
  },
  description: 'DealRadar analyserer pris, historikk og tilgjengelighet for å finne norske nettbutikk-tilbud som faktisk er gode.',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'nb_NO',
    url: 'https://dealradar.no',
    siteName: 'DealRadar',
    title: 'DealRadar – Finn deals som faktisk er gode',
    description: 'Prisdata, historikk og DealRadar Score gjør det enklere å skille ekte prisfall fra markedsføring.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DealRadar – Finn deals som faktisk er gode',
    description: 'Se hvilke tilbud som faktisk fortjener ordet deal.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="no"><body>{children}</body></html>;
}
