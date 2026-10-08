import type { NextConfig } from 'next';

// O português fica na raiz: "/" mostra a página de /pt, e /pt redireciona para "/" (uma URL só por idioma).
const config: NextConfig = {
  rewrites: async () => [{ source: '/', destination: '/pt' }],
  redirects: async () => [{ source: '/pt', destination: '/', permanent: true }],
};

export default config;
