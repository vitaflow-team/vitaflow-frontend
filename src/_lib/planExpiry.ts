/** Como a data do plano é escrita: renova sozinha ou acaba na data (ADR-004). */
export interface PlanExpiry {
  kind: 'renews' | 'expires';
  label: string;
}

/** Data curta no fuso de Brasília: dd/mm/aaaa. Formatador único do plano. */
export function formatPlanDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso));
}

/**
 * O texto da data do plano a partir do que o backend já decidiu: o frontend não
 * deriva expiração nem olha status, só formata e escolhe a palavra (ADR-004).
 * `kind: 'expires'` é o que marca o tom de alerta para quem renderiza.
 */
export function planExpiry(input: {
  expiresAt: string | null;
  autoRenew: boolean;
}): PlanExpiry | null {
  if (!input.expiresAt) return null;

  const date = formatPlanDate(input.expiresAt);

  return input.autoRenew
    ? { kind: 'renews', label: `Renova em ${date}` }
    : { kind: 'expires', label: `Expira em ${date}` };
}
