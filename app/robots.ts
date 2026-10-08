import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

// As APIs só servem ao formulário: robôs não precisam delas e cada chamada gasta créditos do Geoapify.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
