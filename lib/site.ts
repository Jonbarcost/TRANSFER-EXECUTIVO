// Dados do negócio exibidos no site. Confirmar antes de publicar.
export const SITE = {
  name: 'Transfer Executivo Rio',
  description: 'Transfer executivo no Rio de Janeiro: aeroportos, hotéis, Região dos Lagos e Serra.',
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
