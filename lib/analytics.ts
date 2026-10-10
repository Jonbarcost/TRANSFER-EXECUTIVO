import { visitOrigin } from './site.ts';
import type { ErrorCode } from './i18n.ts';

export const CONSENT_KEY = 'transfer.measurement.v1';
export type MeasurementChoice = 'accepted' | 'rejected';
type EventName = 'quote_start' | 'quote_success' | 'quote_error' | 'whatsapp_click';
type EventParams = { contact_location?: 'quote' | 'footer'; trip_type?: 'one_way' | 'round_trip'; error_code?: ErrorCode };
type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    transferMeasurement?: { id: string; active: boolean; debug: boolean };
  }
}

// O número da propriedade GA4 e o número da conta Ads NÃO são IDs de medição.
export function measurementId(value = '', deployment?: string): string {
  return deployment !== 'preview' && /^G-[A-Z0-9]{10}$/.test(value.trim()) ? value.trim() : '';
}

// Mantém atribuição, mas não envia parâmetros arbitrários nem o fragmento da URL.
export function measurementUrl(href: string): string {
  const url = new URL(href);
  const allowed = /^(utm_(source|medium|campaign|id|term|content)|gclid|dclid|gbraid|wbraid)$/;
  for (const key of [...url.searchParams.keys()]) {
    if (!allowed.test(key)) url.searchParams.delete(key);
  }
  url.hash = '';
  return url.href;
}

export function readMeasurementChoice(): MeasurementChoice | null {
  try {
    const saved = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? 'null');
    const age = Date.now() - saved?.time;
    return saved && (saved.choice === 'accepted' || saved.choice === 'rejected') &&
      age >= 0 && age < 180 * 24 * 60 * 60 * 1000 ? saved.choice : null;
  } catch { return null; }
}

const denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
const granted = { ...denied, analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'granted' };

// Chamado somente após aceite. Um único carregador e um único config por documento.
export function startMeasurement(id: string): boolean {
  if (typeof window === 'undefined' || !measurementId(id)) return false;
  const existing = window.transferMeasurement;
  if (existing) {
    if (existing.id !== id) return false;
    if (!existing.active) {
      existing.active = true;
      Object.assign(window, { [`ga-disable-${id}`]: false });
      window.gtag?.('consent', 'update', granted);
    }
    return true;
  }
  // Não instala por cima de uma tag que outro código/GTM já tenha carregado.
  if (window.gtag || document.querySelector('script[src*="googletagmanager.com/"], script[src*="google-analytics.com/"]')) return false;
  const debug = new URLSearchParams(window.location.search).get('analytics_debug') === '1';
  window.transferMeasurement = { id, active: true, debug };
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer!.push(arguments); };
  window.gtag('consent', 'default', denied);
  window.gtag('consent', 'update', granted);
  window.gtag('js', new Date());
  window.gtag('config', id, {
    page_location: measurementUrl(window.location.href),
    page_referrer: document.referrer ? new URL(document.referrer).origin : '',
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ...(debug ? { debug_mode: true } : {}),
  });
  const script = document.createElement('script');
  script.id = 'transfer-google-tag';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
  return true;
}

export function stopMeasurement(): void {
  const state = window.transferMeasurement;
  if (!state) return;
  state.active = false;
  Object.assign(window, { [`ga-disable-${state.id}`]: true });
  window.gtag?.('consent', 'update', denied);
  // Remove os cookies de medição acessíveis neste domínio, sem tocar nos demais.
  const parts = window.location.hostname.split('.');
  const domains = ['', ...parts.map((_, i) => `; domain=.${parts.slice(i).join('.')}`)];
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0];
    if (/^(_ga($|_)|_gcl_)/.test(name)) {
      for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    }
  }
}

export function saveMeasurementChoice(choice: MeasurementChoice): void {
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, time: Date.now() })); } catch { /* vale só nesta página */ }
}

export function trackEvent(name: EventName, params: EventParams = {}): boolean {
  if (typeof window === 'undefined' || !window.transferMeasurement?.active || !window.gtag) return false;
  const { id, debug } = window.transferMeasurement;
  // Lista fechada: jamais passar endereços, datas, observações ou a URL/mensagem do WhatsApp.
  try { window.gtag('event', name, {
    send_to: id,
    language: document.documentElement.lang,
    visit_origin: visitOrigin(window.location.search) || 'unspecified',
    ...(params.contact_location ? { contact_location: params.contact_location } : {}),
    ...(params.trip_type ? { trip_type: params.trip_type } : {}),
    ...(params.error_code ? { error_code: params.error_code } : {}),
    ...(debug ? { debug_mode: true } : {}),
  }); } catch { return false; } // Medição nunca deve interromper a cotação ou a abertura do WhatsApp.
  return true;
}
