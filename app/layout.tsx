import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { SITE } from '@/lib/site';
import './globals.css';

// `subsets` define só o que é pré-carregado. As demais faixas (latin-ext, cirílico…) continuam no CSS e o
// navegador baixa quando o idioma precisa; pré-carregar todas atrasava a imagem principal no celular.
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const display = Playfair_Display({ subsets: ['latin'], weight: '500', variable: '--font-display', display: 'swap' });

// A imagem de compartilhamento e o ícone vêm dos arquivos app/opengraph-image.jpg e app/icon.png.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: '/', siteName: SITE.name, title: SITE.title, description: SITE.description, locale: 'pt_BR' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${display.variable}`}>{children}</body>
    </html>
  );
}
