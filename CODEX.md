# Ambiente de desenvolvimento

Repositório: `Jonbarcost/TRANSFER-EXECUTIVO`.
Branch deste trabalho: `claude/transfer-executivo-rio-mbh6y0`.

1. Abra o repositório no ambiente do Codex e selecione a branch acima.
2. Use Node.js 24 e o comando de preparação `bash scripts/setup-codex.sh`.
3. Para iniciar o site, execute `npm run dev -- --hostname 0.0.0.0` e abra a porta 3000.
4. Para testar a API real, disponibilize `GEOAPIFY_API_KEY` no ambiente de execução do servidor ou em `.env.local` (não versionado). Não use prefixo `NEXT_PUBLIC_`.
5. Antes de entregar: `npm test` e `npm run build`; revise o formulário em 390px e 1280px, português, inglês e árabe.

O setup instala somente as dependências do lockfile. Não instala o Codex CLI nem requer uma chave da OpenAI. O arquivo `AGENTS.md` orienta o agente automaticamente. Estes arquivos preparam o repositório; não representam, por si só, a criação de um ambiente hospedado na conta do Codex.

Rede necessária: registro npm durante instalação; `fonts.googleapis.com` e `fonts.gstatic.com` para o build com next/font; `api.geoapify.com` para autocomplete e rotas reais.

Documentação: https://learn.chatgpt.com/docs/environments/cloud-environment
