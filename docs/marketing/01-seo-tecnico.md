# SEO técnico (Agente 1)

Entrega de 8 de outubro de 2026. Publicado em <https://transfer-executivo-amber.vercel.app>.
Falta uma decisão do responsável: a estrutura de URLs por idioma (seção 4).

## 1. O que foi feito

| Item | Situação |
| --- | --- |
| Título, descrição, canonical, Open Graph e Twitter card | Publicado |
| Imagem de compartilhamento (1200 × 630) e ícone do site | Publicado |
| `robots.txt` e `sitemap.xml` | Publicado |
| Dados estruturados (JSON-LD) | Publicado. Falta rodar o teste do Google (seção 6) |
| Origem da visita (`?origem=`) na mensagem do WhatsApp | Publicado |
| Desempenho no celular | Publicado. Medição local: Performance 95, SEO 100 |
| URLs por idioma (`/en`, `/es`…) | Proposta pronta e testada em protótipo. **Aguarda aprovação** |

### Como o site aparece para buscadores e ao compartilhar o link

- **Título:** "Transfer no Rio de Janeiro: aeroportos, hotéis, Serra e Região dos Lagos | Transfer Executivo Rio". Antes era só o nome do site.
- **Descrição:** diz o que o site faz (aeroportos Galeão e Santos Dumont, hotéis, Serra, Região dos Lagos, estimativa na hora, combinar pelo WhatsApp).
- **Imagem de compartilhamento:** é a imagem que redes sociais e aplicativos de mensagem mostram quando alguém compartilha o link (padrão Open Graph). É um recorte da foto do site (cidade e Enseada de Botafogo) com o nome "Transfer Executivo". A estátua do Cristo fica fora do quadro.
- **Ícone:** a bússola da marca, em PNG. Também acabou com o erro 404 do `favicon.ico` que aparecia no console do navegador.
- **Canonical:** todas as variações do endereço (por exemplo, com `?origem=instagram`) apontam para a página principal, para o Google não tratar como páginas repetidas.

### Dados estruturados

O site informa aos buscadores, em formato padrão (schema.org):

- o nome do site e os 15 idiomas da interface;
- o negócio: nome, cidade/estado/país (Rio de Janeiro, RJ, BR), área atendida (estado do Rio de Janeiro), telefone e link do WhatsApp, atendimento em português;
- o serviço: transfer com motorista, prestado por esse negócio.

Só entrou o que o site já mostra ou o motorista confirmou. **Não entraram:** rua, horário de atendimento, preço, avaliações, fotos do carro, idiomas falados pelo motorista. Esses dados estão na lista de pendências (seção 3).

O WhatsApp passou a aparecer no rodapé do site. Motivo: o Google pede que o que está nos dados estruturados esteja visível na página. Se o motorista preferir não mostrar o número no rodapé, é só avisar: sai do rodapé e dos dados estruturados juntos.

### Origem da visita

Qualquer link do site pode levar `?origem=` no fim:

```text
https://transfer-executivo-amber.vercel.app/?origem=instagram
https://transfer-executivo-amber.vercel.app/?origem=hotel-atlantico
```

Quando o cliente envia o pedido, a mensagem do WhatsApp termina com:

```text
Origem do contato: instagram
```

- Use só letras minúsculas sem acento, números, `-` e `_`, até 40 caracteres. Fora disso a origem é ignorada (o pedido chega normalmente, sem essa linha).
- O rótulo é "Origem do contato", e não só "Origem", porque a mensagem já tem a linha "Origem:" com o local de embarque.
- Nada é guardado no site: a origem só existe no link e na mensagem.

### Desempenho no celular

Duas mudanças:

1. A foto principal passou a ser baixada com prioridade alta. Antes saía com prioridade baixa.
2. O site pré-carregava seis arquivos de fonte (cerca de 200 KB). Agora pré-carrega dois (letras latinas). Russo, polonês e turco continuam com a mesma fonte; o navegador baixa na hora em que precisa (conferido).

Medição local, Lighthouse 13.5 no modo celular, mediana de 5 execuções (entre parênteses, a menor e a maior nota):

| | Antes | Depois |
| --- | --- | --- |
| Performance | 89 (88 a 93) | 95 (94 a 97) |
| Maior elemento visível (LCP) | 3,7 s | 2,8 s |
| Peso da página | 480 KB | 349 KB |
| SEO | 100 | 100 |
| Boas práticas | 96 | 100 |
| Acessibilidade | 100 | 100 |

"Antes" foi medido logo antes das duas mudanças de desempenho. A nota 96 de boas práticas é do site original, por causa do erro 404 do ícone.

A nota muda de uma execução para outra e de um computador para outro. O número que vale é o do PageSpeed Insights no site publicado (seção 6).

## 2. Arquivos

Criados:

- `app/robots.ts`: libera o site e bloqueia `/api/` (as APIs só servem ao formulário e cada chamada gasta créditos do Geoapify).
- `app/sitemap.ts`: lista a URL do site.
- `app/opengraph-image.jpg` e `app/opengraph-image.alt.txt`: imagem de compartilhamento e seu texto alternativo.
- `app/icon.png`: ícone do site.
- `lib/site.test.ts`: teste da leitura de `?origem=`.
- `docs/marketing/01-seo-tecnico.md`: este documento.

Alterados:

- `lib/site.ts`: endereço público (`SITE.url`), título, descrição e a função que lê `?origem=`.
- `app/layout.tsx`: metadados; fontes com pré-carregamento só da faixa latina.
- `app/page.tsx`: dados estruturados.
- `components/Home.tsx`: prioridade da foto principal; WhatsApp no rodapé.
- `components/QuoteForm.tsx`: linha "Origem do contato" na mensagem.
- `public/images/CREDITS.md`: registro da imagem de compartilhamento e do ícone.
- `CLAUDE.md`: regras e estado atual.

Não foram alterados: preços (`lib/pricing.ts`), APIs e validações. Nenhuma dependência nova.

## 3. O motorista precisa fazer ou fornecer

Em ordem de prioridade:

1. **Aprovar a estrutura de URLs por idioma** (seção 4).
2. **Fazer uma cotação de verdade no celular** (origem, destino, data, calcular, abrir o WhatsApp). O fluxo foi testado aqui com respostas simuladas das APIs; a cotação real no site publicado não pôde ser testada deste ambiente (seção 6).
3. **Rodar os dois testes do Google** (links na seção 6) e mandar o resultado ou um print. Leva dois minutos.
4. **Dizer se o WhatsApp pode ficar no rodapé.**
5. **Decidir o endereço definitivo do site** antes de cadastrar no Search Console e no Perfil da Empresa e antes de imprimir QR codes: continuar em `transfer-executivo-amber.vercel.app` ou registrar um domínio próprio. Trocar depois exige redirecionar o endereço antigo por pelo menos um ano e o Google avisa que a posição pode oscilar durante a mudança. *Recomendação minha, não regra do Google:* um domínio próprio é mais fácil de falar, de lembrar e de colocar em cartão. No código é uma linha (`SITE.url` em `lib/site.ts`).
6. **Dados que faltam** (todos opcionais; sem eles o site funciona, só fica com menos informação para o Google):
   - Horário de atendimento: [PREENCHER PELO MOTORISTA]
   - Idiomas que o motorista fala além do português: [PREENCHER PELO MOTORISTA]
   - O número do WhatsApp também atende ligação? [PREENCHER PELO MOTORISTA]
   - Existe endereço comercial que possa ser público? Se não, fica só "Rio de Janeiro, RJ": [PREENCHER PELO MOTORISTA]
   - Fotos reais do carro e do motorista, tiradas por ele: [PREENCHER PELO MOTORISTA]
   - Quer divulgar um preço "a partir de"? Hoje o site só mostra a faixa calculada: [PREENCHER PELO MOTORISTA]
7. **Código de verificação do Search Console** (quando o Agente 3 chegar nessa etapa). O site está em um endereço `vercel.app`, então a verificação é por uma etiqueta no código ou por um arquivo na raiz do site. O motorista copia o código que o Search Console mostrar e ele é colocado no site.

## 4. Proposta: URLs por idioma (aguarda aprovação)

### O problema

Hoje o site tem um endereço só. Ele carrega em português e o navegador troca o texto para o idioma do aparelho. O Google recomenda o contrário: um endereço para cada idioma. Para páginas que mudam conforme o visitante, ele avisa que pode não rastrear, indexar nem classificar todas as versões. E a documentação não diz com qual idioma de navegador o robô abre a página.

Além disso, só o texto da página troca de idioma. O título, a descrição e o cartão de compartilhamento são sempre os em português, porque vêm prontos do servidor.

### Opção A (recomendada): português em `/`, os outros em `/en`, `/es`…

- `/` continua sendo a página em português. O endereço que já foi divulgado não muda.
- 14 endereços novos: `/en`, `/es`, `/fr`, `/de`, `/it`, `/nl`, `/pl`, `/ru`, `/tr`, `/ar`, `/hi`, `/zh`, `/ja`, `/ko`.
- Cada página já vem do servidor no seu idioma, com título e descrição traduzidos, e avisa ao Google quais são as outras versões (hreflang).
- O seletor de idioma passa a levar para o endereço do idioma e mantém o `?origem=`.
- **O que muda para o visitante:** o site deixa de trocar de idioma sozinho. Quem abrir `/` com o celular em francês vê a página em português com um atalho de um toque, "Français →", no topo. O Google pede para não redirecionar sozinho pelo idioma e sim oferecer o link.
- Todas as páginas continuam estáticas (rápidas).

### Opção B: todos com prefixo (`/pt`, `/en`…) e `/` redireciona pelo idioma do navegador

- Mantém a troca automática de hoje: quem abre `/` vai para `/fr`, `/en`…
- A página em português passa a ser `/pt`. O endereço `/` vira só um redirecionamento, o que acrescenta um passo a cada visita e exige uma função no servidor.
- O Google prevê esse desenho (página inicial que redireciona, marcada como `x-default`). Na minha avaliação, fica menos claro o que acontece com o nome do site e o ícone nos resultados, que o Google lê da página inicial.

### Por que a A

É a mais simples, é a que segue ao pé da letra a recomendação do Google e mantém `/` como uma página de verdade. A B só vale se a troca automática de idioma for indispensável.

### O que já foi testado da opção A

Em um protótipo local, fora do repositório:

- 15 páginas estáticas geradas; `/pt` redireciona para `/`; endereço inexistente dá 404.
- Fluxo de cotação e WhatsApp em português, inglês, árabe, russo e chinês, a 390 px e 1280 px, sem rolagem horizontal e sem erro no console.
- Lighthouse em `/`, `/en` e `/ar` (3 execuções cada): SEO 100; Performance com mediana 93, 95 e 96.
- Deslocamento de layout (CLS) zero em qualquer idioma de navegador. Hoje, simulando um celular lento, ele é zero com o navegador em português e 0,013, 0,023 e 0,011 com o navegador em inglês, francês e alemão: a página aparece em português e o texto muda de tamanho ao trocar de idioma. São valores pequenos (o limite do Google é 0,1).
- O atalho de idioma não desloca a página.

Títulos e descrições nos 14 idiomas foram escritos seguindo o vocabulário que o site já usa. Não passaram por revisão de falante nativo.

## 5. Fontes

Google Search Central:

- [Títulos nos resultados](https://developers.google.com/search/docs/appearance/title-link): título descritivo e conciso, nome do site no começo ou no fim; não há limite de tamanho, o Google corta conforme a tela.
- [Descrições (snippets)](https://developers.google.com/search/docs/appearance/snippet): a descrição deve descrever a página; não há limite de tamanho.
- [URL canônica](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls): `rel="canonical"` é um sinal forte; usar URL absoluta; cada idioma com canonical no próprio idioma.
- [Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): o Google ignora `priority` e `changefreq` e só usa `lastmod` se a data for exata; URLs absolutas; pode ser indicado no `robots.txt`.
- [robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro): controla o que o robô acessa; não serve para tirar página do Google.
- [Regras gerais de dados estruturados](https://developers.google.com/search/docs/appearance/structured-data/sd-policies): JSON-LD é o formato recomendado; não marcar conteúdo que o visitante não vê; aparecer no resultado não é garantido; violação tira o destaque, não a posição.
- [Dados estruturados de empresa local](https://developers.google.com/search/docs/appearance/structured-data/local-business): obrigatórios `name` e `address`; `telephone` e `url` recomendados; avaliações só para sites que avaliam outras empresas.
- [Dados estruturados de organização](https://developers.google.com/search/docs/appearance/structured-data/organization): `contactPoint`; `sameAs` é para perfis em outros sites.
- [Nome do site](https://developers.google.com/search/docs/appearance/site-names): vem dos dados `WebSite` da página inicial.
- [Ícone nos resultados](https://developers.google.com/search/docs/appearance/favicon-in-search): quadrado, mínimo 8 × 8 px, recomendado acima de 48 × 48 px; formatos aceitos incluem PNG (SVG não está na lista); não é garantido.
- [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals): LCP até 2,5 s, INP abaixo de 200 ms, CLS abaixo de 0,1.
- [Versões por idioma (hreflang)](https://developers.google.com/search/docs/specialty/international/localized-versions): cada versão lista a si mesma e todas as outras; URLs completas; `x-default` recomendado; o Google não usa `hreflang` nem o atributo `lang` para detectar o idioma.
- [Sites multilíngues](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites): URLs diferentes por idioma; não redirecionar sozinho pelo idioma, oferecer links; o idioma é detectado pelo texto visível.
- [Páginas que mudam conforme o visitante](https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages): o robô não envia `Accept-Language`; o Google pode não rastrear, indexar ou classificar todas as versões.
- [JavaScript e busca](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics): o Google renderiza a página com Chromium, numa fila separada do rastreamento.
- [Mudança de endereço do site](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes): redirecionamento permanente por pelo menos um ano; a posição pode oscilar durante a mudança.
- [Teste de Pesquisa Aprimorada](https://support.google.com/webmasters/answer/7445569): aceita URL pública ou trecho de código.
- [Verificação no Search Console](https://support.google.com/webmasters/answer/9008080): métodos para propriedade de prefixo de URL (etiqueta HTML, arquivo HTML).
- [Sobre o PageSpeed Insights](https://developers.google.com/speed/docs/insights/v5/about): dados de laboratório (Lighthouse) e dados de usuários reais; nota 90 ou mais é "boa".

Chrome e web.dev:

- [Nota de desempenho do Lighthouse](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring): pesos das métricas e por que a nota varia.
- [Auditoria de canonical](https://developer.chrome.com/docs/lighthouse/seo/canonical) e [de hreflang](https://developer.chrome.com/docs/lighthouse/seo/hreflang).
- [Fetch Priority](https://web.dev/articles/fetch-priority): imagens começam com prioridade baixa; `fetchpriority="high"` na imagem principal.
- [Formas mais eficazes de melhorar os Core Web Vitals](https://web.dev/articles/top-cwv): priorizar o recurso do LCP.
- [Pré-carregamento](https://web.dev/articles/preload-critical-assets): usar com parcimônia.

Outros:

- Meta, [imagens em links compartilhados](https://developers.facebook.com/docs/sharing/webmasters/images): pelo menos 1200 × 630 px, proporção perto de 1,91:1, até 8 MB.
- schema.org, [TaxiService](https://schema.org/TaxiService): "serviço de veículo com motorista para deslocamento local".
- Vercel, [implantação a partir do Git](https://vercel.com/docs/git): cada envio para a branch de produção gera uma publicação.
- Next.js 16.4, documentação que acompanha o pacote instalado (`node_modules/next/dist/docs`): [metadados](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [imagem Open Graph](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image), [ícones](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons), [robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots), [sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap), [JSON-LD](https://nextjs.org/docs/app/guides/json-ld), [internacionalização](https://nextjs.org/docs/app/guides/internationalization), [imagem](https://nextjs.org/docs/app/api-reference/components/image).

Sem fonte oficial (opinião ou escolha minha, marcada no texto): recomendar domínio próprio; incluir o tipo `TaxiService`, que o Google não lista entre os que geram destaque; pedir revisão de falante nativo.

## 6. O que não foi possível verificar

O ambiente em que trabalhei não alcança `google.com`, `fonts.googleapis.com`, `api.geoapify.com` nem o site publicado por linha de comando, e não tinha navegador ligado ao computador do responsável.

- **Teste de Pesquisa Aprimorada do Google: não rodei.** O que fiz no lugar: conferi os dados contra o vocabulário do schema.org (pacote `schema-dts`, sem erros) e contra os campos obrigatórios da documentação do Google. Para rodar: [abrir o teste já com o endereço do site](https://search.google.com/test/rich-results?url=https%3A%2F%2Ftransfer-executivo-amber.vercel.app%2F). O teste pode listar campos opcionais ausentes (rua, horário, preço, imagem). São os dados que não temos e que não foram inventados.
- **PageSpeed Insights no site publicado: não rodei.** As notas acima são de um Lighthouse local. Para rodar: [abrir o PageSpeed Insights já com o endereço do site](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Ftransfer-executivo-amber.vercel.app%2F) e olhar a aba "Celular".
- **Cotação real no site publicado: não testei.** No site publicado conferi a página, o `robots.txt`, o `sitemap.xml` e a busca de endereços (`/api/places` respondeu com sugestões reais). O cálculo (`/api/quote`) não pôde ser chamado daqui. O código das APIs não foi alterado.
- **Build local.** Rodou com cópias locais das fontes do Google, porque o ambiente não alcança o Google Fonts. O build de verdade rodou na Vercel e terminou com sucesso.
- **Como o Google vai mostrar o site.** Título, descrição, ícone e destaque de empresa são decisões do Google; a documentação diz que nada disso é garantido.
- **Qual idioma o Google enxerga hoje** na URL única. A documentação não diz com qual idioma de navegador o robô renderiza.
- **Página do WhatsApp sobre o link `wa.me`:** não consegui abrir. O formato do link é o que o site já usava.
- **Opção B da seção 4:** não foi testada em protótipo. Segue o exemplo do guia de internacionalização do Next.js.

Fora do escopo, mas visto na medição: o link da marca no topo tem nome acessível "Transfer Executivo Rio" e texto visível "Transfer Executivo / Rio de Janeiro". O Lighthouse aponta a diferença (não afeta a nota).
