import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { LANGS, RTL, langPath, type Lang } from '@/lib/i18n';
import { SITE } from '@/lib/site';
import Measurement from '@/components/Measurement';
import { measurementId } from '@/lib/analytics';
import '../globals.css';

// `subsets` define só o que é pré-carregado. As demais faixas (latin-ext, cirílico…) continuam no CSS e o
// navegador baixa quando o idioma precisa; pré-carregar todas atrasava a imagem principal no celular.
const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const display = Playfair_Display({ subsets: ['latin'], weight: '500', variable: '--font-display', display: 'swap' });

type Props = { params: Promise<{ lang: string }> };

// Uma página estática por idioma; qualquer outro caminho dá 404.
export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(LANGS).map((lang) => ({ lang }));

// A imagem de compartilhamento (opengraph-image.jpg, nesta pasta para valer junto com o `openGraph` daqui) e o
// ícone (app/icon.png) entram sozinhos, pela convenção de arquivos do Next.js.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  const { metaTitle: title, metaDescription: description } = LANGS[lang];
  return {
    metadataBase: new URL(SITE.url),
    title,
    description,
    // Cada versão aponta para si mesma (canonical) e para todas as outras (hreflang). "/" é a versão padrão.
    alternates: {
      canonical: langPath(lang),
      languages: { ...Object.fromEntries(Object.keys(LANGS).map((l) => [l, langPath(l as Lang)])), 'x-default': '/' },
    },
    openGraph: { type: 'website', url: langPath(lang), siteName: SITE.name, title, description },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function RootLayout({ children, params }: Props & { children: React.ReactNode }) {
  const lang = (await params).lang as Lang;
  return (
    <html lang={lang === 'pt' ? 'pt-BR' : lang} dir={RTL.includes(lang) ? 'rtl' : 'ltr'}>
      <body className={`${inter.variable} ${display.variable}`}>
        {children}
        <Measurement id={measurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, process.env.VERCEL_ENV)} t={LANGS[lang].measurement} />
      </body>
    </html>
  );
}
