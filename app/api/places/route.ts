import { BASE } from '@/lib/pricing';

// Sugestões de endereço. O cliente escolhe uma delas; nunca usamos a 1ª automaticamente.
export async function GET(req: Request) {
  const text = new URL(req.url).searchParams.get('q')?.trim() ?? '';
  if (text.length < 3) return Response.json([]);

  const params = new URLSearchParams({
    text,
    lang: 'pt',
    filter: 'countrycode:br',
    bias: `proximity:${BASE.lon},${BASE.lat}`,
    format: 'json',
    limit: '5',
    apiKey: process.env.GEOAPIFY_API_KEY ?? '',
  });
  const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${params}`);
  if (!res.ok) return Response.json({ error: 'Busca de endereço indisponível.' }, { status: 502 });

  const { results = [] } = await res.json();
  return Response.json(
    results.map((r: Record<string, unknown>) => ({
      label: r.formatted,
      lat: r.lat,
      lon: r.lon,
      city: r.city,
      state_code: r.state_code,
    })),
  );
}
