# Transfer Executivo Rio — Codex

Leia `CLAUDE.md` antes de editar. Ele contém as decisões obrigatórias do produto.

## Ambiente

- Node.js 24 e npm; executar `bash scripts/setup-codex.sh` na raiz.
- Desenvolvimento: `npm run dev -- --hostname 0.0.0.0` (porta 3000).
- Verificação: `npm test` e `npm run build`.
- `GEOAPIFY_API_KEY` é usada apenas no servidor. Configure-a no ambiente ou em `.env.local`, que está ignorado pelo Git. Nunca imprima nem versione seu valor.
- Sem a chave, testes unitários e build continuam disponíveis; autocomplete e cotação reais exigem a chave e acesso a `api.geoapify.com`.

## Limites

- Não adicionar dependências. Use Next.js, React, TypeScript, CSS puro e `node:test`.
- Preserve preços em `lib/pricing.ts`, APIs e validações em tarefas de visual.
- Interface em 15 idiomas; textos novos devem ter as mesmas chaves em todos. Árabe em RTL, campos livres com `dir="auto"`, WhatsApp sempre em português.
- Não escolher automaticamente a primeira sugestão de endereço.
- Fotos locais otimizadas e licenciadas, com atribuição em `public/images/CREDITS.md`.
- Não inventar avaliações, credenciais, frota ou garantias.
- Conferir 390px e 1280px em português, inglês e árabe, foco visível, ausência de rolagem horizontal e fluxo de cotação.
- Trabalhar na branch solicitada; commits pequenos. Não fazer force-push.

## Entrega

Informar o que foi testado de fato e quaisquer bloqueios. Não declarar publicação ou integração funcionando sem verificar o resultado.
