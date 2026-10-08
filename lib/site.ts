// Dados do negócio exibidos no site. Confirmar antes de publicar.
export const SITE = {
  name: 'Transfer Executivo Rio',
  url: 'https://transfer-executivo-amber.vercel.app', // endereço público, sem barra no fim. Trocar se houver domínio próprio.
  // Título e descrição para buscadores e para o cartão que aparece ao compartilhar o link.
  title: 'Transfer no Rio de Janeiro: aeroportos, hotéis, Serra e Região dos Lagos | Transfer Executivo Rio',
  description:
    'Transfer executivo no Rio de Janeiro: aeroportos Galeão e Santos Dumont, hotéis, Serra e Região dos Lagos. Veja a estimativa de preço na hora e combine direto com o motorista pelo WhatsApp.',
  whatsapp: '5521999879096', // só dígitos com DDI, ex.: '5521999999999'. Vazio: o WhatsApp pede o contato.
  maxPassengers: 4, // confirmado pelo motorista
};

// Origem da visita, para o motorista saber de onde veio o cliente: ?origem=instagram, ?origem=hotel-x.
// Aceita só letras sem acento, números, "-" e "_" (até 40 caracteres); o resto é ignorado, porque o valor
// entra na mensagem do WhatsApp.
export function visitOrigin(search: string): string {
  const value = new URLSearchParams(search).get('origem')?.trim().toLowerCase() ?? '';
  return /^[a-z0-9][a-z0-9_-]{0,39}$/.test(value) ? value : '';
}
