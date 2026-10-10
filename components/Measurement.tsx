'use client';

import { useEffect, useState } from 'react';
import { CONSENT_KEY, readMeasurementChoice, saveMeasurementChoice, startMeasurement, stopMeasurement, type MeasurementChoice } from '@/lib/analytics';
import type { Dict } from '@/lib/i18n';

export default function Measurement({ id, t }: { id: string; t: Dict['measurement'] }) {
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState<MeasurementChoice | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!id) return;
    const sync = () => {
      const saved = readMeasurementChoice();
      setChoice(saved);
      setOpen(saved === null);
      if (saved === 'accepted') startMeasurement(id);
      else stopMeasurement();
      setReady(true);
    };
    sync();
    const onStorage = (event: StorageEvent) => { if (event.key === CONSENT_KEY || event.key === null) sync(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [id]);

  if (!id || !ready) return null;
  function choose(next: MeasurementChoice) {
    saveMeasurementChoice(next);
    setChoice(next);
    setOpen(false);
    if (next === 'accepted') startMeasurement(id);
    else stopMeasurement();
  }
  return <aside className="measurement" aria-label={t.settings}>
    <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}>{t.settings}</button>
    {open ? <div>
      <p>{t.notice}</p>
      <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">{t.details}</a>
      <div className="measurement-actions">
        <button type="button" onClick={() => choose('accepted')}>{t.accept}</button>
        <button type="button" onClick={() => choose('rejected')}>{t.reject}</button>
      </div>
    </div> : <span role="status">{choice === 'accepted' ? t.enabled : t.disabled}</span>}
  </aside>;
}
