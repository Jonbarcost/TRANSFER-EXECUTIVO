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
- **Distância do passageiro** = origem → destino. **Distância operacional** = base → origem → destino → base (uma chamada de rota com vários pontos). O retorno vazio já está incluído.
- **Ida e volta no mesmo dia:** a função de preço calcula os cenários "motorista espera" e "volta vazio e busca de novo" a partir dos mesmos trechos; o MVP usa um deles, escolhido por configuração.
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

Próximo passo: implementação.
