# SEO técnico (Agente 1)

Entrega de 8 de outubro de 2026. Publicado em <https://transfer-executivo-amber.vercel.app>.

## 1. O que foi feito

| Item | Situação |
| --- | --- |
| Título, descrição, canonical, Open Graph e Twitter card | Publicado |
| Imagem de compartilhamento (1200 × 630) e ícone do site | Publicado |
| `robots.txt` e `sitemap.xml` | Publicado |
| Dados estruturados (JSON-LD) | Publicado. Falta rodar o teste do Google (seção 6) |
| Origem da visita (`?origem=`) na mensagem do WhatsApp | Publicado |
| Desempenho no celular | Publicado. Medição local: Performance entre 91 e 98 e SEO 100 nas 15 páginas |
| Um endereço por idioma (`/en`, `/es`…), com hreflang | Publicado. Opção A, aprovada pelo responsável em 8/10 (seção 4) |
| Textos no posicionamento executivo: sem a palavra motorista e com o veículo | Publicado. Aprovado pelo responsável em 8/10 |

### Como o site aparece para buscadores e ao compartilhar o link

- **Título:** "Transfer no Rio de Janeiro: aeroportos, hotéis, Serra e Região dos Lagos | Transfer Executivo Rio", e o equivalente em cada idioma. Antes era só o nome do site.
- **Descrição:** diz o que o site faz (aeroportos Galeão e Santos Dumont, hotéis, Serra, Região dos Lagos, estimativa na hora, combinar pelo WhatsApp) e, desde 8/10, que o veículo é confortável e climatizado.
- **Posicionamento (8/10, aprovado pelo responsável):** os textos do site não citam mais motorista. O topo fala em "veículo confortável e climatizado", o segundo item do quadro de vantagens virou "Veículo executivo: confortável, climatizado e limpo", o aviso abaixo do preço ficou "Estimativa sujeita a confirmação" e o do WhatsApp, "O pedido é enviado em português". Vale para os 15 idiomas.
- **Imagem de compartilhamento:** é a imagem que redes sociais e aplicativos de mensagem mostram quando alguém compartilha o link (padrão Open Graph). É um recorte da foto do site (cidade e Enseada de Botafogo) com o nome "Transfer Executivo". A estátua do Cristo fica fora do quadro.
- **Ícone:** a bússola da marca, em PNG. Também acabou com o erro 404 do `favicon.ico` que aparecia no console do navegador.
- **Canonical:** as variações de um endereço (por exemplo, com `?origem=instagram`) apontam para a página daquele idioma, para o Google não tratar como páginas repetidas.

### Um endereço por idioma

| Idioma | Endereço |
| --- | --- |
| Português | `/` (o endereço de sempre) |
| Inglês, espanhol, francês, alemão, italiano, holandês, polonês | `/en`, `/es`, `/fr`, `/de`, `/it`, `/nl`, `/pl` |
| Russo, turco, árabe, hindi, chinês, japonês, coreano | `/ru`, `/tr`, `/ar`, `/hi`, `/zh`, `/ja`, `/ko` |

- Cada página já vem do servidor no seu idioma, com título e descrição traduzidos, e informa ao Google quais são as outras versões (hreflang). O `sitemap.xml` lista as 15.
- O seletor de idioma leva para o endereço do idioma e mantém o `?origem=`.
- **O site não troca mais de idioma sozinho.** Quem abre uma página com o celular em outro idioma vê um atalho de um toque no topo ("Français →", "English →"). O Google pede para oferecer o link em vez de redirecionar.
- Em divulgação para estrangeiros, use o endereço do idioma: `/en?origem=instagram`, `/es?origem=hotel-x`.
- `/pt` não é um endereço à parte: leva para `/`.

### Dados estruturados

O site informa aos buscadores, em formato padrão (schema.org):

- o nome do site e os 15 idiomas da interface;
- o negócio: nome, cidade/estado/país (Rio de Janeiro, RJ, BR), área atendida (estado do Rio de Janeiro), telefone e link do WhatsApp, atendimento em português;
- o serviço: transfer executivo, prestado por esse negócio. O tipo técnico usado é `TaxiService`, que no schema.org significa serviço de veículo com motorista, em geral cobrado por distância; ele não aparece para o visitante.

Só entrou o que o site já mostra ou o motorista confirmou. **Não entraram:** rua, horário de atendimento, preço, avaliações, fotos do carro, idiomas falados pelo motorista. Esses dados estão na lista de pendências (seção 3).

O WhatsApp passou a aparecer no rodapé do site. Motivo: o Google pede que o que está nos dados estruturados esteja visível na página. Se o motorista preferir não mostrar o número no rodapé, é só avisar: sai do rodapé e dos dados estruturados juntos.

### Origem da visita

Qualquer link do site, em qualquer idioma, pode levar `?origem=` no fim:

```text
https://transfer-executivo-amber.vercel.app/?origem=instagram
https://transfer-executivo-amber.vercel.app/en?origem=hotel-atlantico
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

Depois da mudança para um endereço por idioma, medi as 15 páginas (39 execuções): SEO, acessibilidade e boas práticas deram 100 em todas, e Performance ficou entre 91 e 98. Numa bateria anterior, uma execução da página em polonês deu 84. O deslocamento de layout (CLS) é zero em 14 idiomas e 0,024 em russo, porque a fonte cirílica chega depois do texto (o limite do Google é 0,1).

A nota muda de uma execução para outra e de um computador para outro. O número que vale é o do PageSpeed Insights no site publicado (seção 6).

## 2. Arquivos

Criados:

- `app/[lang]/layout.tsx` e `app/[lang]/page.tsx`: a página de cada idioma, com metadados, hreflang e dados estruturados. Substituem `app/layout.tsx` e `app/page.tsx`.
- `app/[lang]/opengraph-image.jpg` e `app/[lang]/opengraph-image.alt.txt`: imagem de compartilhamento e seu texto alternativo.
- `app/icon.png`: ícone do site.
- `app/robots.ts`: libera o site e bloqueia `/api/` (as APIs só servem ao formulário e cada chamada gasta créditos do Geoapify).
- `app/sitemap.ts`: lista os 15 endereços.
- `next.config.ts`: faz `/` mostrar a página em português e `/pt` levar para `/`.
- `lib/site.test.ts`: teste da leitura de `?origem=`.
- `docs/marketing/01-seo-tecnico.md`: este documento.

Alterados:

- `lib/i18n.ts`: título e descrição nos 15 idiomas (`metaTitle`, `metaDescription`), caminho de cada idioma e idioma do navegador para o atalho. O teste `lib/i18n.test.ts` acompanha.
- `lib/site.ts`: endereço público (`SITE.url`) e a função que lê `?origem=`.
- `components/Home.tsx`: idioma vindo do endereço, seletor que navega, atalho de idioma, prioridade da foto principal, WhatsApp no rodapé.
- `components/QuoteForm.tsx`: linha "Origem do contato" na mensagem.
- `app/globals.css`: estilo do atalho de idioma.
- `public/images/CREDITS.md`: registro da imagem de compartilhamento e do ícone.
- `CLAUDE.md`: regras e estado atual.

Não foram alterados: preços (`lib/pricing.ts`), APIs e validações. Nenhuma dependência nova.

## 3. O motorista precisa fazer ou fornecer

Esclarecimento do responsável em 8/10: o negócio é um serviço executivo para clientes exigentes; é ele quem responde pelo negócio e quem vai designar os motoristas. Onde este documento diz "o motorista", leia "o responsável". Nenhuma informação de motorista deve ser divulgada.

Já decidido pelo responsável em 8/10: um endereço por idioma (opção A) e WhatsApp visível no rodapé.

Já feito pelo responsável em 8/10: o teste do site publicado no celular (cotação real aberta com `?origem=teste`, mensagem do WhatsApp e troca de idioma pelo seletor). Ele informou que deu tudo certo.

Também decidido pelo responsável em 8/10: o plano da conta na Vercel e o endereço `transfer-executivo-amber.vercel.app` ficam como estão por enquanto. Ele vai rever os dois quando o serviço começar a dar receita. O que pesar nessa revisão está abaixo, em "Para rever quando houver receita".

Em ordem de prioridade:

1. **Rodar os dois testes do Google** (links na seção 6) e mandar o resultado ou um print. Leva dois minutos.
2. **Dados que faltam** (todos opcionais; sem eles o site funciona, só fica com menos informação para o Google):
   - Horário de atendimento: [PREENCHER PELO MOTORISTA]. No Perfil da Empresa, o Google orienta serviços de transporte e quem só atende com hora marcada a não informar horário (kit `02-perfil-google-e-search-console.md`, passo D3). *Recomendação minha:* se o perfil ficar sem horário, deixar o site sem horário também.
   - Idiomas de atendimento além do português: [PREENCHER PELO MOTORISTA]
   - O número do WhatsApp também atende ligação? [PREENCHER PELO MOTORISTA]
   - Existe endereço comercial que possa ser público? Se não, fica só "Rio de Janeiro, RJ": [PREENCHER PELO MOTORISTA]
   - Fotos reais do veículo, sem motorista (decisão do responsável em 8/10): [PREENCHER PELO MOTORISTA]
   - Quer divulgar um preço "a partir de"? Hoje o site só mostra a faixa calculada: [PREENCHER PELO MOTORISTA]
3. **Pedir a um falante nativo que leia o título e a descrição** dos idiomas mais importantes para o negócio (estão em `lib/i18n.ts`, chaves `metaTitle` e `metaDescription`). Foram escritos seguindo o vocabulário que o site já usa, sem revisão de nativo. *Recomendação minha.*
4. **Código de verificação do Search Console** (quando o Agente 3 chegar nessa etapa). O site está em um endereço `vercel.app`, então a verificação é por uma etiqueta no código ou por um arquivo na raiz do site. O motorista copia o código que o Search Console mostrar e ele é colocado no site.

### Para rever quando houver receita

São os dois pontos que o responsável decidiu deixar como estão em 8/10. Ficam registrados para a revisão.

**Endereço do site.** Um domínio próprio custa R$ 40,00 por ano no Registro.br. O endereço `vercel.app` é gerado pela Vercel: só existe enquanto o site estiver hospedado lá. Com domínio próprio, o endereço continua o mesmo se a hospedagem mudar. Trocar de endereço exige redirecionar o antigo por pelo menos um ano e o Google avisa que a posição pode oscilar durante a mudança; quanto mais lugares tiverem o endereço antigo (Perfil da Empresa, Search Console, QR codes, cartões), mais trabalho dá a troca. *Recomendação minha, não regra do Google:* domínio próprio, que também é mais fácil de falar, de lembrar e de colocar em cartão. No código é uma linha (`SITE.url` em `lib/site.ts`).

**Plano da Vercel.** Constatado em 8/10, ao conferir as regras da hospedagem. Eu não tenho acesso à conta e o plano não foi informado.

- O plano gratuito (Hobby) só permite uso pessoal, não comercial. A Vercel cita "anunciar a venda de um produto ou serviço" como exemplo de uso comercial, e uso comercial exige o plano Pro ou o Enterprise.
- Pelos termos de serviço, a Vercel pode desativar ou remover um site do plano Hobby com ou sem aviso. Quem visita um site pausado vê o erro `503 DEPLOYMENT_PAUSED`.
- O plano aparece em vercel.com, `Settings` → `Billing` → `Plan`. Se já for Pro, não há o que fazer.

Se for Hobby, os caminhos são:

| Caminho | Custo | O que muda |
| --- | --- | --- |
| Passar para o plano Pro da Vercel | US$ 20 por mês, sem impostos. Inclui 1 usuário e US$ 20 de crédito de uso; o que passar do crédito é cobrado à parte | Nada no site nem no endereço |
| Mudar para outra hospedagem | Depende da escolhida | O site precisa ser configurado e testado de novo. Sem domínio próprio, o endereço muda |

Outras hospedagens: nenhuma foi escolhida nem testada. O que conferi nas páginas oficiais:

- **Netlify.** Plano Free de US$ 0 com 300 créditos por mês. Cada publicação em produção gasta 15 créditos, então cabem no máximo 20 publicações por mês, sem contar as visitas. Quando os créditos acabam, o site fica pausado até o ciclo seguinte. Em novembro de 2024 a Netlify declarou que o plano Free aceita projetos comerciais. Não encontrei essa frase na documentação atual, dos planos por créditos, então é preciso confirmar antes. O Next.js roda lá por um adaptador da própria Netlify.
- **Cloudflare.** Plano grátis com 100.000 requisições por dia e 10 ms de CPU por requisição. Exige dois pacotes novos no projeto (`@opennextjs/cloudflare` e `wrangler`), o que a regra do projeto hoje não permite. Não encontrei declaração oficial sobre uso comercial no plano grátis.
- A documentação do Next.js lista as integrações da Netlify e da Cloudflare como não verificadas pela equipe do Next.js: os recursos e a compatibilidade podem variar.

Em caso de dúvida sobre o enquadramento, a Vercel orienta a perguntar ao suporte dela.

## 4. Decisão: um endereço por idioma

Aprovada pelo responsável em 8 de outubro de 2026 e publicada no mesmo dia.

### O problema

O site tinha um endereço só. Ele carregava em português e o navegador trocava o texto para o idioma do aparelho. O Google recomenda o contrário: um endereço para cada idioma. Para páginas que mudam conforme o visitante, ele avisa que pode não rastrear, indexar nem classificar todas as versões. E a documentação não diz com qual idioma de navegador o robô abre a página.

Além disso, só o texto da página trocava de idioma. O título, a descrição e o cartão de compartilhamento eram sempre os em português, porque vêm prontos do servidor.

### Opção A (escolhida): português em `/`, os outros em `/en`, `/es`…

- `/` continua sendo a página em português. O endereço que já tinha sido divulgado não mudou.
- Todas as páginas são estáticas.
- O site deixou de trocar de idioma sozinho; no lugar, o atalho de um toque.

### Opção B (não escolhida): todos com prefixo e `/` redirecionando pelo idioma do navegador

- Manteria a troca automática, com um redirecionamento a cada visita em `/` e uma função no servidor.
- O Google prevê esse desenho (página inicial que redireciona, marcada como `x-default`). Na minha avaliação, fica menos claro o que acontece com o nome do site e o ícone nos resultados, que o Google lê da página inicial.

### O que foi conferido

No build local, igual ao publicado:

- As 15 páginas: idioma e direção do texto, título, descrição, canonical, as 16 marcações hreflang (15 idiomas e `x-default`), Open Graph e dados estruturados.
- `/pt` leva para `/` mantendo o `?origem=`; endereço inexistente dá 404; o sitemap lista os 15 endereços.
- Fluxo de cotação e WhatsApp em português, inglês e árabe, a 390 px e 1280 px, sem rolagem horizontal e sem erro no console.
- Seletor de idioma, botão voltar do navegador e atalho de idioma em oito combinações de idioma de navegador e página.
- Deslocamento de layout: antes, simulando um celular lento, era zero com o navegador em português e 0,013, 0,023 e 0,011 em inglês, francês e alemão, porque o texto mudava de tamanho ao trocar de idioma. Agora é zero nesses casos.

No site publicado: `/`, `/en`, `/ar` e `/ru` com título e canonical do idioma certo; `/pt` levando para `/`; sitemap com os 15 endereços; endereço inexistente com 404.

### Limites conhecidos

- A página de endereço inexistente (404) é a padrão do Next.js, em inglês.
- Russo, polonês e turco usam faixas de fonte que não são pré-carregadas. Em russo isso causa o deslocamento de layout de 0,024 citado na seção 1.

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

Hospedagem e domínio (consultadas em 8/10/2026):

- Vercel, [regras de uso justo](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage): o plano Hobby é restrito a uso pessoal, não comercial; uso comercial exige Pro ou Enterprise; lista de exemplos de uso comercial; na dúvida, perguntar ao suporte.
- Vercel, [termos de serviço](https://vercel.com/legal/terms), seção 4 (Hobby Plan): uso pessoal ou não comercial; a Vercel pode desativar ou remover site do plano Hobby com ou sem aviso.
- Vercel, [por que uma conta ou um site foi pausado](https://vercel.com/kb/guide/why-is-my-account-deployment-blocked): uso comercial no plano Hobby entre as causas; o visitante vê `503 DEPLOYMENT_PAUSED`.
- Vercel, [plano Hobby](https://vercel.com/docs/plans/hobby): onde ver e trocar o plano (`Settings` → `Billing`); até 50 domínios por projeto.
- Vercel, [plano Pro](https://vercel.com/docs/plans/pro-plan): US$ 20 por mês, com 1 usuário e US$ 20 de crédito de uso; preços sem impostos.
- Vercel, [endereços gerados](https://vercel.com/docs/deployments/generated-urls): o endereço `vercel.app` é gerado pela Vercel; um domínio próprio é um endereço a mais.
- Registro.br, [domínios](https://registro.br/dominio/): registro por R$ 40,00 por ano.
- Netlify: [planos por créditos](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/) (Free com 300 créditos por mês; 15 créditos por publicação em produção), [perguntas sobre cobrança](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/billing-faq-for-credit-based-plans/) (site pausado quando os créditos acabam), [anúncio do plano Free, de 12/11/2024](https://www.netlify.com/blog/introducing-netlify-free-plan/) (aceita projetos comerciais) e [Next.js na Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/).
- Cloudflare: [adaptador OpenNext](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/) (pacotes que precisam ser instalados) e [limites do Workers](https://developers.cloudflare.com/workers/platform/limits/).
- Next.js 16.4, documentação que acompanha o pacote instalado: [implantação](https://nextjs.org/docs/app/getting-started/deploying). Adaptadores verificados: Vercel e Bun. Netlify e Cloudflare aparecem como integrações próprias, não verificadas.
- Geoapify, [preços](https://www.geoapify.com/pricing/): o plano Free pode ser usado em sites comerciais, com o link de atribuição (o site já mostra "Powered by Geoapify").

Sem fonte oficial (opinião ou escolha minha, marcada no texto): recomendar domínio próprio; incluir o tipo `TaxiService`, que o Google não lista entre os que geram destaque; pedir revisão de falante nativo; a avaliação sobre a opção B.

## 6. O que não foi possível verificar

O ambiente em que trabalhei não alcança `google.com`, `fonts.googleapis.com`, `api.geoapify.com` nem o site publicado por linha de comando, e não tinha navegador ligado ao computador do responsável.

- **Teste de Pesquisa Aprimorada do Google: não rodei.** O que fiz no lugar: conferi os dados contra o vocabulário do schema.org (pacote `schema-dts`, sem erros) e contra os campos obrigatórios da documentação do Google. Para rodar: [abrir o teste já com o endereço do site](https://search.google.com/test/rich-results?url=https%3A%2F%2Ftransfer-executivo-amber.vercel.app%2F). O teste pode listar campos opcionais ausentes (rua, horário, preço, imagem). São os dados que não temos e que não foram inventados.
- **PageSpeed Insights no site publicado: não rodei.** As notas acima são de um Lighthouse local. Para rodar: [abrir o PageSpeed Insights já com o endereço do site](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Ftransfer-executivo-amber.vercel.app%2F) e olhar a aba "Celular".
- **Cotação real no site publicado: eu não pude testar daqui.** Quem testou foi o responsável, no celular, em 8/10: cotação aberta com `?origem=teste`, mensagem do WhatsApp e troca de idioma pelo seletor. Ele informou que deu tudo certo.
- **Marcações hreflang no site publicado: não li diretamente.** A ferramenta que usei para abrir o site publicado não mostra essas marcações. Elas foram conferidas nas 15 páginas do build local, que é o mesmo código. Para conferir: no PageSpeed Insights, grupo SEO, item sobre `hreflang` válido.
- **Build local.** Rodou com cópias locais das fontes do Google, porque o ambiente não alcança o Google Fonts. O build de verdade rodou na Vercel e terminou com sucesso.
- **Como o Google vai mostrar o site.** Título, descrição, ícone e destaque de empresa são decisões do Google; a documentação diz que nada disso é garantido.
- **Página do WhatsApp sobre o link `wa.me`:** não consegui abrir. O formato do link é o que o site já usava.
- **Títulos e descrições traduzidos:** não passaram por revisão de falante nativo.
- **Textos de 8/10 sobre o veículo, nos outros 14 idiomas:** escritos por mim, sem revisão de falante nativo. "Veículo executivo" ficou literal em inglês, espanhol, italiano e hindi. Nos outros dez idiomas virou uma expressão de padrão elevado, escolhida para não afirmar classe nem modelo de carro (em `lib/i18n.ts`, segundo item de `trust`).
- **Plano da conta na Vercel: não sei qual é.** Não tenho acesso à conta onde o site está e o plano não foi informado. O responsável decidiu manter o plano como está por enquanto (seção 3).
- **Outras hospedagens: nada foi testado.** Só li as páginas oficiais citadas na seção 5. Na Netlify, não encontrei na documentação atual a frase sobre uso comercial no plano Free; na Cloudflare, não encontrei declaração oficial sobre o assunto.
- **Regras do Registro.br para registrar um domínio (por exemplo, documentos exigidos): não consegui ler.** As páginas só abriram o resumo, que traz o preço.

Fora do escopo, mas visto na medição: o link da marca no topo tem nome acessível "Transfer Executivo Rio" e texto visível "Transfer Executivo / Rio de Janeiro". O Lighthouse aponta a diferença (não afeta a nota).
