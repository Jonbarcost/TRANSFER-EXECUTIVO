import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { SITE } from '@/lib/site';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-body', display: 'swap' });
const display = Playfair_Display({ subsets: ['latin', 'latin-ext', 'cyrillic'], weight: '500', variable: '--font-display', display: 'swap' });

export const metadata: Metadata = { title: SITE.name, description: SITE.description };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${display.variable}`}>{children}</body>
    </html>
  );
}
