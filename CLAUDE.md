# Transfer Executivo Rio

Site de uma página para um motorista de transfer executivo no RJ: o cliente informa origem, destino, data, horário, ida/volta e passageiros, recebe distância, tempo e uma **faixa** de preço e envia o pedido pelo WhatsApp.

## Filosofia (obrigatória)

Antes de cada arquivo, função, dependência ou abstração: isso precisa existir? Existe solução mais curta? Resolve um problema real? Dá para fazer com menos dependências? A abstração será reutilizada? Se der para simplificar, simplifique. Clareza > esperteza; produto funcionando > arquitetura perfeita.

Fora do MVP: banco de dados, login, painel, pagamento, mapa visual, bibliotecas extras.

## Stack decidida

Next.js (App Router) + TypeScript, CSS puro, `next/font`, testes com `node:test`. Dependências: só `next`, `react`, `react-dom`, `typescript`.
Mapas: **Geoapify** (Address Autocomplete + Routing), chamado só pelo servidor. Google descartado por falta de faturamento. Exibir "Powered by Geoapify" com link.

Arquivos previstos: `app/{layout,page}.tsx`, `app/globals.css`, `app/api/places/route.ts`, `app/api/quote/route.ts`, `components/QuoteForm.tsx`, `lib/pricing.ts` (+ teste), `lib/site.ts`.

## Regras de negócio

- **Área atendida:** origem no estado do RJ. Origem em cidade vizinha de outro estado só é aceita se o destino for no RJ (lista de cidades em `pricing.ts`).
- **Base do motorista:** Copacabana (o Centro é próximo; um único ponto basta por enquanto).
- **Preço = km do passageiro (origem → destino) × R$ 3,50**, com mínimo por trajeto. Sem taxa fixa e sem cobrar o deslocamento vazio do motorista (decisão de 2026-10-08: com eles o preço ficava alto demais).
- **Ida e volta:** 2 trajetos; no mesmo dia soma a espera (horas entre a chegada e a volta × R$/h).
- **Preços somente em `lib/pricing.ts`** (objeto `PRICING`). Nenhum valor de API assumido sem confirmação no painel do provedor.
- O resultado mostra uma **faixa sujeita a confirmação**, nunca um preço fechado.
- Campo **Observações** opcional (voo, cadeirinha, necessidades especiais), incluído na mensagem do WhatsApp.
- Horários em `-03:00` (America/Sao_Paulo, sem horário de verão).

## Estado atual

PASSO 0 concluído (2026-10-08): `scripts/check-geoapify.mjs` rodou os 7 trajetos sem erro. Constatações:
- Autocomplete devolve `state_code` ("RJ") e `city`, suficientes para a regra de área atendida.
- A 1ª sugestão nem sempre é a pretendida (ex.: "Copacabana Palace" → Windsor Palace; "Ipanema" → hotel em Copacabana; "Paraty" traz "Araquari, SC" na 3ª): o cliente precisa escolher na lista, nunca usar a 1ª automaticamente.
- Rota com vários pontos (base → origem → destino → base) funciona numa chamada e devolve `legs` por trecho.
- `traffic=approximated` aumenta o tempo em ~2× (ex.: Galeão → Copacabana 25 → 61 min). Decidir qual tempo exibir.
- Pedágio: só vem a indicação `toll` no trecho, sem valor. Valores, se usados, ficam em `PRICING`.

MVP implementado (2026-10-08): `npm test` (6 testes), `npm run build`, fluxo completo testado no navegador com a API real.
- Cotação faz 2 chamadas de rota origem → destino (sem trânsito e `traffic=approximated`); o tempo é exibido como faixa entre as duas.
- Pedágio: exibido "valor não incluído" quando algum passo do trecho tem `toll`.

Confirmado pelo motorista: R$ 3,50/km, máximo 4 passageiros, cidades vizinhas = todos os 38 municípios de MG/SP/ES que fazem divisa com o RJ (calculado pela malha municipal do IBGE).
Também confirmados: espera R$ 40/h, faixa ±10%. Taxa fixa removida. Pendente: manter ou não o mínimo de R$ 120; como incluir o valor dos pedágios.
