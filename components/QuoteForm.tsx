'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { SITE } from '@/lib/site';

type Place = { label: string; lat: number; lon: number; city?: string; state_code?: string };
type Result = {
  km: number;
  minutes: { min: number; max: number };
  toll: boolean;
  price: { min: number; max: number };
};

const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const brDate = (d: string) => d.split('-').reverse().join('/');

function PlaceInput({ label, value, onChange }: { label: string; value: Place | null; onChange: (p: Place | null) => void }) {
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
        placeholder="Digite e escolha na lista"
        autoComplete="off"
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

export default function QuoteForm() {
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Qualquer mudança invalida a estimativa anterior.
  useEffect(() => setResult(null), [origin, destination, date, time, roundTrip, returnDate, returnTime, passengers]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!origin || !destination) return setError('Escolha origem e destino na lista de sugestões.');
    setLoading(true);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, date, time, roundTrip, returnDate, returnTime, passengers }),
      });
      const data = await res.json().catch(() => ({ error: 'Erro inesperado. Tente novamente.' }));
      if (!res.ok) setError(data.error);
      else setResult(data);
    } catch {
      setError('Sem conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const message =
    result && origin && destination
      ? [
          `Olá! Gostaria de confirmar um transfer:`,
          `Origem: ${origin.label}`,
          `Destino: ${destination.label}`,
          `Ida: ${brDate(date)} às ${time}`,
          roundTrip ? `Volta: ${brDate(returnDate)} às ${returnTime}` : 'Somente ida',
          `Passageiros: ${passengers}`,
          notes.trim() && `Observações: ${notes.trim()}`,
          `Estimativa do site: ${brl(result.price.min)} a ${brl(result.price.max)} (${result.km.toLocaleString('pt-BR')} km)`,
        ]
          .filter(Boolean)
          .join('\n')
      : '';

  return (
    <form className="card" onSubmit={submit}>
      <PlaceInput label="Origem" value={origin} onChange={setOrigin} />
      <PlaceInput label="Destino" value={destination} onChange={setDestination} />

      <div className="row">
        <label className="field">
          <span>Data</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label className="field">
          <span>Horário</span>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </label>
      </div>

      <div className="row">
        <label className="field">
          <span>Trajeto</span>
          <select value={roundTrip ? 'ida-volta' : 'ida'} onChange={(e) => setRoundTrip(e.target.value === 'ida-volta')}>
            <option value="ida">Somente ida</option>
            <option value="ida-volta">Ida e volta</option>
          </select>
        </label>
        <label className="field">
          <span>Passageiros</span>
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
            <span>Data da volta</span>
            <input type="date" value={returnDate} min={date} onChange={(e) => setReturnDate(e.target.value)} required />
          </label>
          <label className="field">
            <span>Horário da volta</span>
            <input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} required />
          </label>
        </div>
      )}

      <label className="field">
        <span>Observações (opcional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Número do voo, cadeirinha, necessidades especiais…"
        />
      </label>

      <button className="primary" disabled={loading}>{loading ? 'Calculando…' : 'Calcular estimativa'}</button>
      {error && <p className="error" role="alert">{error}</p>}

      {result && (
        <div className="result" aria-live="polite">
          <p className="price">
            {brl(result.price.min)} a {brl(result.price.max)}
          </p>
          <p>
            {result.km.toLocaleString('pt-BR')} km · {result.minutes.min === result.minutes.max ? result.minutes.min : `${result.minutes.min} a ${result.minutes.max}`} min
            conforme o trânsito{roundTrip && ' (cada trecho)'}
          </p>
          {result.toll && <p>Trajeto com pedágio (valor não incluído).</p>}
          <p className="muted">Estimativa sujeita a confirmação pelo motorista.</p>
          <a
            className="primary whatsapp"
            href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enviar pedido pelo WhatsApp
          </a>
        </div>
      )}
    </form>
  );
}
