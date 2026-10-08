'use client';

import { useEffect, useState } from 'react';
import QuoteForm from '@/components/QuoteForm';
import { LANGS, RTL, detectLang, type Lang } from '@/lib/i18n';
import { SITE } from '@/lib/site';

const ICONS = ['R$', '✓', '⌂', '文'];

export default function Home() {
  const [lang, setLang] = useState<Lang>('pt');
  const t = LANGS[lang];

  // Idioma salvo > idioma do navegador > português.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('lang');
    } catch {}
    setLang(saved && saved in LANGS ? (saved as Lang) : detectLang(navigator.languages ?? [navigator.language]));
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL.includes(lang) ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('lang', lang);
    } catch {}
  }, [lang]);

  return (
    <main>
      <nav className="top">
        <span className="brand">{SITE.name}</span>
        <label className="lang">
          <span className="sr-only">{t.language}</span>
          <select value={lang} onChange={(e) => setLang(e.target.value as Lang)} aria-label={t.language}>
            {Object.entries(LANGS).map(([code, d]) => (
              <option key={code} value={code}>
                {d.langName}
              </option>
            ))}
          </select>
        </label>
      </nav>

      <header className="hero">
        <h1>{t.heroTitle}</h1>
        <p>{t.heroText}</p>
      </header>

      <QuoteForm t={t} lang={lang} />

      <ul className="trust">
        {t.trust.map(([title, text], i) => (
          <li key={title}>
            <span className="icon" aria-hidden>
              {ICONS[i]}
            </span>
            <strong>{title}</strong>
            <span>{text ?? t.whatsappNote}</span>
          </li>
        ))}
      </ul>

      <footer>
        <a href="https://www.geoapify.com/" target="_blank" rel="noopener noreferrer">
          Powered by Geoapify
        </a>
      </footer>
    </main>
  );
}
