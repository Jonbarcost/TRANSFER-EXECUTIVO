# Auditoria de medição — 10/10/2026

## Resultado e evidências

A vinculação Analytics–Ads está confirmada pelo aviso automático consultado, mas ela não instala a tag no site nem comprova que uma conversão foi recebida. Não foi possível validar os painéis autenticados nesta auditoria: o Analytics redirecionou para o login Google, que retornou **502 / Connection refused**. Não foram alteradas configurações de conta, campanhas, orçamento, conversões ou variáveis de produção.

| Camada | Evidência observada | Situação |
| --- | --- | --- |
| Código publicado | Branch `claude/transfer-executivo-rio-mbh6y0`, commit `0724cb8171d02746520790e85eb101a826735792` | Sem gtag, GTM, GA4, Ads, dataLayer ou eventos de conversão |
| Publicação Vercel | Projeto `transfer-executivo`, deployment `dpl_ASxDrunedzxBAzDqegWseD4N8T3p`, mesmo commit | READY; HTML de `https://transfer-executivo-amber.vercel.app/` sem tag Google |
| Variáveis Vercel | Listagem de chaves, sem ler o segredo | Só `GEOAPIFY_API_KEY`; nenhuma variável GA4/Ads |
| Trabalho paralelo | Consulta das branches e PRs abertos | Uma branch; nenhum PR aberto antes desta alteração |
| Atribuição | `/pt?utm_source=google&utm_medium=cpc&gclid=auditoria_teste` retorna 308 com os parâmetros no destino | Preservada nesse redirecionamento; seletor de idioma também mantém `location.search` no código |
| Contato | `QuoteForm` abre `wa.me` com mensagem pré-preenchida; rodapé abre conversa | Site observa o clique, não o envio da mensagem, reserva, pagamento ou conclusão do serviço |
| Painéis | Não acessíveis | ID do fluxo `G-…`, medição otimizada, destinos da tag, marcação automática, eventos principais e ações de conversão ainda não conferidos |

**Conclusão:** a publicação inspecionada não tem instrumentação no site para enviar os eventos deste funil. Não há evidência de recebimento em Tempo real, DebugView ou Google Ads. Não confundir essa conclusão com uma consulta ao histórico da propriedade, que não foi possível.

## Ajuste proposto neste PR

- Um carregador `gtag.js`, somente GA4, condicionado a `NEXT_PUBLIC_GA_MEASUREMENT_ID` válido. Sem dependências novas, GTM ou tag Ads paralela.
- `VERCEL_ENV=preview` desativa a medição, mesmo que a variável seja herdada. Sem ID, não aparece o controle de medição nem é carregada uma tag.
- Inicialização idempotente por documento e bloqueio da instalação quando outra tag Google já existe. Se aparecer outra implementação, revisar e escolher uma única responsável; não tentar contornar esse bloqueio.
- O `config` gera a visualização inicial. Não há segundo `page_view` manual. A troca de idioma atual recarrega o documento; não foi adicionado observador de rotas SPA.
- Escolha opcional em “Preferências de medição”, abaixo do rodapé, nos 15 idiomas. Antes do aceite e após recusa inicial: nenhuma tag Google. Aceite permite medição de Analytics e anúncios, com personalização e Google Signals desativados. A retirada bloqueia eventos seguintes e remove cookies de medição acessíveis no domínio. Escolha guardada por até 180 dias; sem acesso ao armazenamento, vale apenas naquela página.
- Parâmetros manuais limitados ao contexto do funil. Não se envia nome, telefone, endereço, coordenadas, data da viagem, observações, mensagem ou URL completa do WhatsApp. Não se envia preço como receita.
- `page_location` preserva somente UTMs e identificadores de clique de campanha; `page_referrer` fica limitado à origem. Nunca colocar dados pessoais em UTMs. O `?origem=` existente continua no WhatsApp e entra como `visit_origin` validado, sem ser tratado como UTM.
- Falha de medição não bloqueia cotação nem o link. Submissão concorrente do cálculo é impedida para não produzir resultados/eventos duplicados por uma segunda submissão enquanto a primeira está pendente.

### Contrato de eventos

Todos os eventos manuais usam `send_to` com o mesmo ID GA4, `language` e `visit_origin`. Só interações posteriores ao aceite são medidas; nada é reconstituído retroativamente.

| Evento | Gatilho | Parâmetros adicionais | Conversão |
| --- | --- | --- | --- |
| `page_view` | Inicialização da tag após aceite, uma vez por documento | URL filtrada; referrer sem query | Não |
| `quote_start` | Primeira alteração do formulário após aceite | Nenhum | Não |
| `quote_success` | Resposta bem-sucedida do cálculo | `trip_type`: `one_way` / `round_trip` | Não; é somente estimativa |
| `quote_error` | Falha de seleção, API, leitura da resposta ou conexão | `error_code`: código conhecido, nunca mensagem livre | Não |
| `whatsapp_click` | Clique no link da cotação ou do rodapé | `contact_location`: `quote` / `footer`; `trip_type` na cotação | Candidato a microconversão de intenção de contato |

Cada clique intencional produz um evento. Dois cliques separados continuam sendo duas interações, não dois leads comprovados. `quote_error` não cobre tentativas bloqueadas pela validação HTML nativa antes do submit. Um bloqueador de anúncios ou uma falha de rede pode impedir a entrega mesmo com o evento enfileirado.

Não emitir `generate_lead`, `purchase` ou receita neste MVP: não há confirmação de envio da mensagem nem venda observável. A confirmação de lead exigiria uma evidência do atendimento ou integração apropriada, fora deste ajuste.

## Antes de ativar em produção

1. **Confirmar o fluxo existente.** Em Analytics → Administrador → Fluxos de dados, selecionar o fluxo web cujo URL é `https://transfer-executivo-amber.vercel.app`. Copiar o ID **G-…** e conferir que pertence à propriedade vinculada. Não usar o ID numérico da propriedade nem o número da conta Ads; não criar outra propriedade/fluxo só para preencher a variável.
2. **Desativar Medição otimizada nesse fluxo antes da ativação.** A medição manual cobre este funil. Em especial, cliques de saída automáticos capturam `link_url`, e o `wa.me?...text=` deste site contém trajeto e observações. Formulários automáticos também não representam contatos enviados. A visualização básica continua vindo do `config`; não criar outra tag/evento automático equivalente. Conferir também destinos e detecção automática na configuração da Google tag. Essas opções de painel não foram verificadas e o código não as desliga remotamente.
3. **Conferir ações existentes no Ads.** Ver origem, evento, categoria, contagem e status primária/secundária. Se já existir uma ação que mede o mesmo clique por tag Ads ou GTM, escolher uma rota de medição antes de importar outra. Duas ações distintas não são deduplicadas apenas por medirem o mesmo clique.
4. **Usar GA4 como única origem desta microconversão.** Após confirmar os eventos, marcar `whatsapp_click` como evento principal e criar/importar **uma** ação para a conta Ads vinculada. Iniciar como **secundária**, para observação, com contagem **Uma** quando disponível. “Uma” é por interação com anúncio, não deduplicação universal entre ações. Não promover automaticamente para primária nem alterar metas de campanhas. Definir o nome como “Clique no WhatsApp — intenção de contato”, sem chamar de reserva confirmada.
5. **Conferir marcação automática do Ads.** Preservar `gclid`, `gbraid`, `wbraid` e UTMs nos URLs; o `?origem=` é informação complementar. Não acrescentar parâmetros pessoais.
6. **Ativar somente após 1–3.** Cadastrar `NEXT_PUBLIC_GA_MEASUREMENT_ID` em Vercel → projeto `transfer-executivo` → Environment Variables → **Production**. Mesclar a alteração revisada e gerar novo deployment; a página é estática e a variável pública é incorporada no build. Não inserir novamente o snippet do assistente Google, GTM, plugin ou `AW-…` no layout.

## Validação de ponta a ponta

Não basta observar o e-mail de vinculação ou um HTTP 2xx da coleta. É necessário conferir a propriedade e os eventos no painel.

1. Abrir uma janela limpa no domínio publicado com `?analytics_debug=1&origem=teste&utm_source=qa&utm_medium=manual&utm_campaign=integracao`. O modo debug só é habilitado explicitamente por esse parâmetro. Não inventar um GCLID real ou clicar em anúncio próprio para gerar conversão de teste.
2. Antes de aceitar, conferir no Network: **zero** carregamentos de `gtag/js` e zero envios do site para Analytics. Recusar e repetir a verificação; cotação e WhatsApp devem continuar disponíveis.
3. Em “Preferências de medição”, permitir. Conferir **um** script `gtag/js` para o ID correto e **um** `page_view` para aquele documento. O `tid` da coleta deve ser o ID confirmado; nenhum segundo `config`/destino nativo Ads deve ter sido acrescentado por este PR.
4. Editar o formulário: um `quote_start`. Calcular uma rota válida: um `quote_success`. Simular falha de cálculo: `quote_error`, sem `quote_success` para essa tentativa. Clicar uma vez no WhatsApp da cotação: um `whatsapp_click` com `contact_location=quote`; no rodapé, `footer`. Não é preciso enviar a mensagem.
5. No DebugView da **propriedade correta**, confirmar os nomes e parâmetros. Nas requisições, conferir que não aparecem endereço, observações, data de viagem, conteúdo do `text` do WhatsApp ou parâmetros arbitrários. Não deve haver `click` automático com `link_url` contendo a mensagem. Se houver, interromper a ativação e revisar o passo 2.
6. Alterar PT → EN → AR: uma visualização por documento carregado; campanha e `?origem=` preservados; sem eventos duplicados por montagem. Verificar as telas em 390px e 1280px, foco de teclado, RTL e ausência de rolagem horizontal.
7. Retirar o aceite: conferir bloqueio de eventos seguintes; recarregar para conferir que não é baixada a tag. Reaceitar no mesmo documento não pode criar um segundo carregador/config. Conferir o mesmo resultado após a preferência mudar em outra aba.
8. Voltar a uma URL sem `analytics_debug`. Usar filtro de tráfego de desenvolvedor/teste conforme a configuração da propriedade; o parâmetro debug, sozinho, não garante exclusão de relatórios. Confirmar Tempo real separadamente do DebugView.
9. No Ads, conferir a origem **Google Analytics (GA4)**, evento exato, ação única e diagnóstico. Uma visita direta de QA não comprova atribuição a anúncio. O recebimento atribuído depende de interação legítima elegível e das janelas/configurações; a importação pode levar até 24h e não inclui histórico anterior à importação. Confrontar “Todas as conversões” para ações secundárias, sem esperar que apareçam automaticamente na coluna “Conversões”.

## Verificado nesta entrega

- Setup do projeto com Node 24 e dependências do lockfile, sem dependências novas.
- `npm test`: **20 testes aprovados** (13 existentes + 7 de medição).
- Testes de ID/preview, URL de campanha, ausência de eventos antes da ativação, inicialização repetida, tag preexistente, lista fechada de parâmetros, retirada/reaceite e expiração da preferência. Google foi simulado; estes testes não comprovam entrega remota.
- `npm run build`: aprovado com TypeScript e geração das 15 páginas de idioma.
- `git diff --check`: aprovado.
- HTML publicado e redirecionamento com parâmetros conferidos por HTTP; não foi feita cotação real nem enviada mensagem.
- Revisão do código React: tag após hidratação/aceite, efeito idempotente, remoção do listener de storage, estados locais e sem novos pacotes.
- **Não verificado:** inspeção visual responsiva/fluxo no navegador local (o ambiente do navegador recusou a conexão local), requisições reais da tag, DebugView, Tempo real, importação e atribuição no Ads. O PR permanece rascunho até obter o ID, conferir o painel e executar esses passos. A instalação proposta não foi publicada em produção.

## Reversão

Remover/esvaziar a variável e gerar novo deployment desativa a integração e o controle de medição. Para reverter o código, reverter o commit deste PR. Não excluir propriedade, fluxo ou histórico. Ações eventualmente importadas no painel precisam de revisão própria; esse PR não cria nem apaga ações por API.

## Fontes oficiais consultadas

- [Google Ads — criar conversões a partir do Analytics](https://support.google.com/google-ads/answer/2375435): vinculação, marcação automática, importação, contagem, ações secundárias e atraso de processamento.
- [GA4 — medição otimizada](https://support.google.com/analytics/answer/9216061): eventos automáticos, `link_url` e formulário.
- [Google — visualizações de página](https://developers.google.com/analytics/devguides/collection/ga4/views): `config`, visualização inicial e duplicação com envio manual.
- [Google — consent mode](https://developers.google.com/tag-platform/security/guides/consent): estado padrão, atualização e retirada.
- [GA4 — DebugView](https://support.google.com/analytics/answer/7201382): diagnóstico de eventos em modo de depuração.
