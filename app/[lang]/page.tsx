import Home from '@/components/Home';
import { LANGS, type Lang } from '@/lib/i18n';
import { SITE } from '@/lib/site';

// Dados estruturados (schema.org) para buscadores: só o que o site já mostra ou o responsável confirmou.
// Sem rua, horário, preço, avaliações ou fotos do carro enquanto ele não informar. Nada sobre motorista.
const business = `${SITE.url}/#business`;
const areaServed = { '@type': 'State', name: 'Rio de Janeiro', containedInPlace: { '@type': 'Country', name: 'Brasil' } };
const jsonLd = (lang: Lang) => ({
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', name: SITE.name, url: SITE.url, inLanguage: Object.keys(LANGS).map((l) => (l === 'pt' ? 'pt-BR' : l)) },
    {
      '@type': 'LocalBusiness',
      '@id': business,
      name: SITE.name,
      description: LANGS[lang].metaDescription,
      url: SITE.url,
      address: { '@type': 'PostalAddress', addressLocality: 'Rio de Janeiro', addressRegion: 'RJ', addressCountry: 'BR' },
      areaServed,
      // O pedido é enviado em português (ver whatsappNote em lib/i18n.ts).
      ...(SITE.whatsapp && {
        telephone: `+${SITE.whatsapp}`,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'reservations',
          telephone: `+${SITE.whatsapp}`,
          url: `https://wa.me/${SITE.whatsapp}`,
          availableLanguage: 'pt-BR',
        },
      }),
    },
    { '@type': 'TaxiService', serviceType: 'Transfer executivo', provider: { '@id': business }, areaServed },
  ],
});

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)).replace(/</g, '\\u003c') }} />
      <Home lang={lang} />
    </>
  );
}
