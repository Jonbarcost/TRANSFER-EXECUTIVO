# Transfer Executivo Rio

Site de uma página para um motorista de transfer executivo no RJ: o cliente informa origem, destino, data, horário, ida/volta e passageiros, recebe distância, tempo e uma **faixa** de preço e envia o pedido pelo WhatsApp.

## Filosofia (obrigatória)

Antes de cada arquivo, função, dependência ou abstração: isso precisa existir? Existe solução mais curta? Resolve um problema real? Dá para fazer com menos dependências? A abstração será reutilizada? Se der para simplificar, simplifique. Clareza > esperteza; produto funcionando > arquitetura perfeita.

Fora do MVP: banco de dados, login, painel, pagamento, mapa visual, bibliotecas extras.

## Stack decidida

Next.js (App Router) + TypeScript, CSS puro, `next/font`, testes com `node:test`. Dependências: só `next`, `react`, `react-dom`, `typescript`.
Mapas: **Geoapify** (Address Autocomplete + Routing), chamado só pelo servidor. Google descartado por falta de faturamento. Exibir "Powered by Geoapify" com link.

Arquivos: `app/[lang]/{layout,page}.tsx`, `app/[lang]/opengraph-image.jpg` (+ `.alt.txt`), `app/globals.css`, `app/api/places/route.ts`, `app/api/quote/route.ts`, `app/{robots,sitemap}.ts`, `app/icon.png`, `next.config.ts`, `components/{Home,QuoteForm}.tsx`, `lib/pricing.ts` (+ teste), `lib/i18n.ts` (+ teste), `lib/site.ts` (+ teste), `public/images/` (fotos + `CREDITS.md`), `docs/marketing/` (entregas e kits de divulgação). Ambiente do Codex: `AGENTS.md`, `CODEX.md`, `scripts/setup-codex.sh`.

## Regras de negócio

- **Área atendida:** origem no estado do RJ. Origem em cidade vizinha de outro estado só é aceita se o destino for no RJ (lista de cidades em `pricing.ts`).
- **Base do motorista:** Copacabana (o Centro é próximo; um único ponto basta por enquanto).
- **Preço = km do passageiro (origem → destino) × R$ 3,50**, mínimo de R$ 50 por trajeto, **+ pedágios**. Sem taxa fixa e sem cobrar o deslocamento vazio do motorista (decisão de 2026-10-08: com eles o preço ficava alto demais).
- **Ida e volta:** 2 trajetos; no mesmo dia soma a espera (horas entre a chegada e a volta × R$/h).
- **Preços somente em `lib/pricing.ts`** (objeto `PRICING`). Nenhum valor de API assumido sem confirmação no painel do provedor.
- O resultado mostra uma **faixa sujeita a confirmação**, nunca um preço fechado.
- Campo **Observações** opcional (voo, cadeirinha, necessidades especiais), incluído na mensagem do WhatsApp.
- Horários em `-03:00` (America/Sao_Paulo, sem horário de verão).
- **Idiomas:** interface em 15 idiomas (`lib/i18n.ts`), **um endereço por idioma**: `/` em português e `/en`, `/es`… para os outros (páginas estáticas em `app/[lang]/`; `next.config.ts` faz `/` mostrar `/pt` e `/pt` levar para `/`). O idioma vem do endereço, nunca do navegador: o seletor no topo navega (mantendo `?origem=`) e o atalho só oferece o idioma do navegador. Nada redireciona sozinho. Árabe em RTL. A API devolve códigos de erro; o texto é traduzido no navegador. A mensagem do WhatsApp é sempre em português; as Observações vão como o cliente escreveu, marcadas com o idioma.
- **Imagens:** fotos reais licenciadas em `public/images/` (créditos em `CREDITS.md`, link no rodapé). A imagem do Cristo tem direitos da Mitra Arquiepiscopal do Rio; para uso comercial, a autorização por escrito é o caminho seguro.
- **Pedágios:** tabela `TOLLS` em `lib/pricing.ts` (posição, tarifa de automóvel, sentido, fim de semana, fonte/pendência em `check`). A praça é cobrada quando a geometria da rota passa perto dela; a volta usa a rota invertida. Somados fora da margem de ±10%. Se a rota tem trecho pedagiado sem praça conhecida, ou sai do RJ, o site avisa que pode haver pedágio não incluído. Tarifas mudam todo ano: revisar a tabela a cada reajuste.
- **Mensagens de confiança:** só afirmações verdadeiras pelo funcionamento do site. Nada sobre carro, seguro, credenciais ou pontualidade sem o motorista confirmar.
- **Origem da visita:** `?origem=instagram`, `?origem=hotel-x` (letras sem acento, números, `-` e `_`, até 40 caracteres) vira a linha "Origem do contato: ..." no fim da mensagem do WhatsApp. Nada é guardado no site.
- **SEO:** `SITE.url` é o endereço público usado no canonical, no hreflang, no sitemap, no Open Graph e nos dados estruturados; trocar ali se houver domínio próprio. Título e descrição de cada idioma ficam em `lib/i18n.ts` (`metaTitle`, `metaDescription`). Cada página aponta para si mesma (canonical) e para as outras 14 (hreflang, com `/` como `x-default`). Os dados estruturados (`app/[lang]/page.tsx`) só levam dados reais, e o que estiver neles precisa estar visível na página (por isso o WhatsApp no rodapé). O `robots.txt` bloqueia só `/api/`. Na imagem principal usar `loading="eager"` e `fetchPriority="high"` (`priority` ficou obsoleto no Next.js 16). `subsets` das fontes define só o que é pré-carregado.

## Estado atual

PASSO 0 concluído (2026-10-08): `scripts/check-geoapify.mjs` rodou os 7 trajetos sem erro. Constatações:
- Autocomplete devolve `state_code` ("RJ") e `city`, suficientes para a regra de área atendida.
- A 1ª sugestão nem sempre é a pretendida (ex.: "Copacabana Palace" → Windsor Palace; "Ipanema" → hotel em Copacabana; "Paraty" traz "Araquari, SC" na 3ª): o cliente precisa escolher na lista, nunca usar a 1ª automaticamente.
- Rota com vários pontos (base → origem → destino → base) funciona numa chamada e devolve `legs` por trecho.
- `traffic=approximated` aumenta o tempo em ~2× (ex.: Galeão → Copacabana 25 → 61 min). Decidir qual tempo exibir.
- Pedágio: só vem a indicação `toll` no trecho, sem valor. Valores, se usados, ficam em `PRICING`.

MVP implementado (2026-10-08): `npm test` (6 testes), `npm run build`, fluxo completo testado no navegador com a API real.
- Cotação faz 2 chamadas de rota origem → destino (sem trânsito e `traffic=approximated`); o tempo é exibido como faixa entre as duas.
- Pedágios somados pela tabela `TOLLS` (2026-10-08), testados em rotas reais (Búzios, Petrópolis, Juiz de Fora, São Paulo, Angra, Teresópolis, Nova Friburgo, Linha Amarela).

Confirmado pelo motorista: R$ 3,50/km, máximo 4 passageiros, cidades vizinhas = todos os 38 municípios de MG/SP/ES que fazem divisa com o RJ (calculado pela malha municipal do IBGE).
Também confirmados: espera R$ 40/h, faixa ±10%. Taxa fixa removida. Mínimo de R$ 50 e soma dos pedágios confirmados pelo motorista. Pendências dos pedágios estão no campo `check` de cada praça.

Liberado para divulgação (2026-10-08): o motorista testou o site publicado no celular (cotação + WhatsApp), conferiu as licenças das fotos e resolveu a autorização da imagem do Cristo. Proteção contra uso abusivo da API não foi feita por decisão dele; refazer se o consumo do Geoapify (3.000 créditos/dia no plano grátis, ~8–14 por cotação) ficar alto.

SEO técnico (2026-10-08, detalhes e pendências em `docs/marketing/01-seo-tecnico.md`): metadados, imagem de compartilhamento, ícone, `robots.txt`, `sitemap.xml`, dados estruturados, `?origem=` e ajustes de desempenho publicados. Conferido com `npm test`, `npm run build` e navegador (390 e 1280 px; PT, EN e AR) com as APIs simuladas; no site publicado, página, `robots.txt`, `sitemap.xml` e `/api/places`. Não conferidos: Teste de Pesquisa Aprimorada e PageSpeed Insights.
URLs por idioma (2026-10-08): opção A aprovada pelo responsável e publicada, junto com a permanência do WhatsApp no rodapé. Conferido no build local: nas 15 páginas, idioma, título, descrição, canonical, hreflang, Open Graph e dados estruturados; fluxo de cotação em PT, EN e AR (390 e 1280 px); seletor e atalho de idioma. No site publicado: `/`, `/en`, `/ar`, `/ru`, `/pt` e o sitemap. As marcações hreflang não foram lidas diretamente no site publicado. O responsável testou o site publicado no celular (cotação real aberta com `?origem=teste`, mensagem do WhatsApp e troca de idioma pelo seletor) e informou que deu tudo certo.
