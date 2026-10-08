'use client';
import Image from 'next/image';
import QuoteForm from '@/components/QuoteForm';
import { LANGS, langPath, type Lang } from '@/lib/i18n';
import { SITE } from '@/lib/site';

const ICONS = [
  'M7 3h10v18l-2-1-3 1-3-1-2 1V3Zm3 5h4m-4 4h4m-4 4h2',
  'M21 11a8 8 0 0 1-8 8H7l-4 3V11a9 9 0 0 1 18 0ZM8 10h8m-8 4h5',
  'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18Z',
];
// Contato visível no rodapé (o mesmo dos dados estruturados): '5521999879096' → '+55 21 99987-9096'.
const PHONE = SITE.whatsapp.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, '+$1 $2 $3-$4');

export default function Home({ lang }: { lang: Lang }) {
  const t = LANGS[lang];
  // Trocar de idioma é ir para a URL daquele idioma, mantendo o ?origem=.
  const go = (next: Lang) => window.location.assign(langPath(next) + window.location.search);
  return (
    <main>
      <a className="skip-link" href="#quote">{t.skipToQuote}</a>
      <nav className="top">
        <a className="brand" href="#" aria-label={SITE.name} dir="ltr">
          <svg className="brand-mark" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="20" cy="20" r="18" /><path d="m25 11-3 11-7 7 3-11 7-7ZM20 0v5m0 30v5M0 20h5m30 0h5" /></svg>
          <span>Transfer Executivo<span className="brand-city">Rio de Janeiro</span></span>
        </a>
        <label className="lang">
          <span className="sr-only">{t.language}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={ICONS[3]} /></svg>
          <select value={lang} onChange={e => go(e.target.value as Lang)} aria-label={t.language}>
            {Object.entries(LANGS).map(([code, d]) => <option key={code} value={code}>{d.langName}</option>)}
          </select>
        </label>
      </nav>
      <section className="hero" aria-labelledby="hero-title">
        <header className="hero-intro">
          <div className="hero-scenery"><Image src="/images/rio.webp" alt="" fill loading="eager" fetchPriority="high" sizes="(max-width: 760px) 100vw, (max-width: 1280px) 55vw, 660px" /></div>
          <div className="hero-copy">
            <p className="eyebrow" dir="ltr"><span /> Rio de Janeiro</p>
            <h1 id="hero-title">{t.heroTitle}</h1>
            <p className="hero-description">{t.heroText}</p>
            <a className="hero-link" href="#quote">{t.planTransfer}<svg className="direction-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg></a>
          </div>
        </header>
        <QuoteForm t={t} lang={lang} />
      </section>
      <section className="reassurance" aria-label={t.trust[1][0]}>
        <div className="nature-watermarks" aria-hidden="true">
          <Image className="nature-blue" src="/images/arara-azul.webp" alt="" width={640} height={960} sizes="(max-width: 760px) 160px, 230px" />
          <Image className="nature-red" src="/images/arara-vermelha.webp" alt="" width={900} height={600} sizes="(max-width: 760px) 170px, 240px" />
          <Image className="nature-capuchin" src="/images/macaco-prego.webp" alt="" width={900} height={715} sizes="(max-width: 760px) 180px, 270px" />
        </div>
        <ul className="trust">{t.trust.map(([title, text], i) => <li key={title}>
          <span className="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[i]} /></svg></span>
          <strong>{title}</strong><span>{text ?? t.whatsappNote}</span>
        </li>)}</ul>
      </section>
      <footer><span className="footer-brand" dir="ltr">{SITE.name}</span><div className="footer-links">
        {SITE.whatsapp && <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" dir="ltr">WhatsApp {PHONE}</a>}
        <a href="/images/CREDITS.md" target="_blank" rel="noopener noreferrer">{t.imageCredits}</a>
        <a href="https://www.geoapify.com/" target="_blank" rel="noopener noreferrer" dir="ltr">Powered by Geoapify</a>
      </div></footer>
    </main>
  );
}
