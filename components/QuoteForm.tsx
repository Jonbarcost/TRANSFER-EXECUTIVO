'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { SITE } from '@/lib/site';
import { fill, type Dict, type ErrorCode, type Lang } from '@/lib/i18n';

type Place = { label: string; lat: number; lon: number; city?: string; state_code?: string };
type Result = {
  km: number;
  minutes: { min: number; max: number };
  toll: boolean;
  price: { min: number; max: number };
};

const brl = (n: number, locale = 'pt-BR') =>
  n.toLocaleString(locale, { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const brDate = (d: string) => d.split('-').reverse().join('/');

type PlaceProps = { label: string; placeholder: string; value: Place | null; onChange: (p: Place | null) => void };

function PlaceInput({ label, placeholder, value, onChange }: PlaceProps) {
  const [text, setText] = useState('');
  const [options, setOptions] = useState<Place[]>([]);

  useEffect(() => {
    if (value || text.trim().length < 3) return setOptions([]);
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/places?q=${encodeURIComponent(text)}`);
      const data = await res.json().catch(() => []);
      setOptions(Array.isArray(data) ? data : []);
    }, 350);
    return () => clearTimeout(timer);
  }, [text, value]);

  return (
    <label className="field place">
      <span>{label}</span>
      <input
        value={value ? value.label : text}
        onChange={(e) => {
          onChange(null);
          setText(e.target.value);
        }}
        placeholder={placeholder}
        autoComplete="off"
        dir="auto"
        required
      />
      {options.length > 0 && (
        <ul className="options">
          {options.map((o) => (
            <li key={`${o.lat},${o.lon},${o.label}`}>
              <button type="button" onClick={() => { onChange(o); setOptions([]); }}>
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </label>
  );
}

export default function QuoteForm({ t, lang }: { t: Dict; lang: Lang }) {
  const [origin, setOrigin] = useState<Place | null>(null);
  const [destination, setDestination] = useState<Place | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [roundTrip, setRoundTrip] = useState(false);
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<ErrorCode | ''>('');
  const [loading, setLoading] = useState(false);

  // Qualquer mudança invalida a estimativa anterior.
  useEffect(() => setResult(null), [origin, destination, date, time, roundTrip, returnDate, returnTime, passengers]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!origin || !destination) return setError('pick');
    setLoading(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, date, time, roundTrip, returnDate, returnTime, passengers }),
      });
      const data = await res.json().catch(() => ({ error: 'route' }));
      if (!res.ok) setError(data.error in t.errors ? data.error : 'route');
      else setResult(data);
    } catch {
      setError('network');
    } finally {
      setLoading(false);
    }
  }

  const langPt = new Intl.DisplayNames(['pt-BR'], { type: 'language' }).of(lang) ?? lang;
  const message =
    result && origin && destination
      ? [
          `Olá! Gostaria de confirmar um transfer:`,
          `Origem: ${origin.label}`,
          `Destino: ${destination.label}`,
          `Ida: ${brDate(date)} às ${time}`,
          roundTrip ? `Volta: ${brDate(returnDate)} às ${returnTime}` : 'Somente ida',
          `Passageiros: ${passengers}`,
          notes.trim() && `Observações${lang === 'pt' ? '' : ` (escritas em ${langPt})`}: ${notes.trim()}`,
          lang !== 'pt' && `Idioma do cliente: ${langPt}`,
          `Estimativa do site: ${brl(result.price.min)} a ${brl(result.price.max)} (${result.km.toLocaleString('pt-BR')} km)`,
        ]
          .filter(Boolean)
          .join('\n')
      : '';

  return (
    <form className="card" onSubmit={submit}>
      <PlaceInput label={t.origin} placeholder={t.placePlaceholder} value={origin} onChange={setOrigin} />
      <PlaceInput label={t.destination} placeholder={t.placePlaceholder} value={destination} onChange={setDestination} />

      <div className="row">
        <label className="field">
          <span>{t.date}</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label className="field">
          <span>{t.time}</span>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </label>
      </div>

      <div className="row">
        <label className="field">
          <span>{t.trip}</span>
          <select value={roundTrip ? 'ida-volta' : 'ida'} onChange={(e) => setRoundTrip(e.target.value === 'ida-volta')}>
            <option value="ida">{t.oneWay}</option>
            <option value="ida-volta">{t.roundTrip}</option>
          </select>
        </label>
        <label className="field">
          <span>{t.passengers}</span>
          <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))}>
            {Array.from({ length: SITE.maxPassengers }, (_, i) => (
              <option key={i + 1}>{i + 1}</option>
            ))}
          </select>
        </label>
      </div>

      {roundTrip && (
        <div className="row">
          <label className="field">
            <span>{t.returnDate}</span>
            <input type="date" value={returnDate} min={date} onChange={(e) => setReturnDate(e.target.value)} required />
          </label>
          <label className="field">
            <span>{t.returnTime}</span>
            <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} required />
          </label>
        </div>
      )}

      <label className="field">
        <span>{t.notes}</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          dir="auto"
          placeholder={t.notesPlaceholder}
        />
      </label>

      <button className="primary" disabled={loading}>{loading ? t.calculating : t.submit}</button>
      {error && (
        <p className="error" role="alert">
          {fill(t.errors[error], { max: SITE.maxPassengers })}
        </p>
      )}

      {result && (
        <div className="result" aria-live="polite">
          <p className="price">
            {brl(result.price.min, lang)} – {brl(result.price.max, lang)}
          </p>
          <p>
            {result.km.toLocaleString(lang)} km ·{' '}
            {fill(t.duration, { min: result.minutes.min, max: result.minutes.max })}
            {roundTrip && ` ${t.eachWay}`}
          </p>
          {result.toll && <p>{t.toll}</p>}
          <p className="muted">{t.disclaimer}</p>
          <a
            className="primary whatsapp"
            href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.whatsapp}
          </a>
          <p className="muted center">{t.whatsappNote}</p>
        </div>
      )}
    </form>
  );
}
