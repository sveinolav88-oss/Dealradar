import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DealRadar – Finn de beste dealsene',
  description: 'DealRadar finner interessante prisfall og tilbud fra norske nettbutikker.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="no"><body>{children}</body></html>;
}
