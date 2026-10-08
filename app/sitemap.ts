import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

// Só as URLs canônicas. Sem lastmod, priority e changefreq: o Google ignora os dois últimos e só usa
// lastmod quando a data é exata.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.url }];
}
