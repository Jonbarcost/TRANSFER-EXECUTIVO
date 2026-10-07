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

PASSO 0: validar o Geoapify com `GEOAPIFY_API_KEY=... node scripts/check-geoapify.mjs` (7 trajetos reais). Requer `api.geoapify.com` liberado na rede do ambiente. Só depois disso começa a implementação.
