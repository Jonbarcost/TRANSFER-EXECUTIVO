import type { MetadataRoute } from 'next';
import { LANGS, langPath, type Lang } from '@/lib/i18n';
import { SITE } from '@/lib/site';

// Uma URL por idioma. Sem lastmod, priority e changefreq: o Google ignora os dois últimos e só usa lastmod
// quando a data é exata. O hreflang fica no <head> de cada página (um método só basta).
export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(LANGS) as Lang[]).map((lang) => ({ url: new URL(langPath(lang), SITE.url).href }));
}
