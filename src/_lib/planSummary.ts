import type { ProfileShell } from '@/_types/shell';

export interface PlanSummary {
  name: string;
  detail: { kind: 'renews' | 'cancels'; date: string } | null;
  cta: { label: 'Conhecer o Premium' | 'Gerenciar plano'; href: string };
}

/**
 * Até a área de configurações ganhar abas, o parâmetro é ignorado pela página e
 * o link simplesmente abre Configurações.
 */
export const PLAN_SETTINGS_HREF = '/restrict/settings?tab=plano';

/** Status em que a assinatura ainda vale e a próxima data faz sentido. */
const PAID_STATUSES = ['active', 'trialing', 'past_due'];

const FREE_PLAN_NAME = 'Plano Gratuito';
const UNKNOWN_PLAN_NAME = 'Seu plano';

/** Data curta no fuso de Brasília: dd/mm/aaaa. */
export function formatPlanDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso));
}

export function getPlanSummary(input: ProfileShell | null): PlanSummary {
  // Sem perfil não dá para afirmar nada sobre o plano — um rótulo neutro é mais
  // honesto do que chutar o gratuito, e "Gerenciar plano" não empurra upgrade
  // para quem talvez já seja assinante.
  if (!input) {
    return {
      name: UNKNOWN_PLAN_NAME,
      detail: null,
      cta: { label: 'Gerenciar plano', href: PLAN_SETTINGS_HREF },
    };
  }

  const isPaid = PAID_STATUSES.includes(input.subscriptionStatus ?? '');
  const name = input.productName
    ? `Plano ${input.productName}`
    : FREE_PLAN_NAME;

  return {
    name,
    // Cancelamento agendado tem precedência sobre a renovação: é a data que
    // muda a vida do assinante. Assinatura inativa ou data desconhecida não
    // inventa nada.
    detail: !isPaid
      ? null
      : input.subscriptionCancelAt
        ? { kind: 'cancels', date: formatPlanDate(input.subscriptionCancelAt) }
        : input.subscriptionCurrentPeriodEnd
          ? {
              kind: 'renews',
              date: formatPlanDate(input.subscriptionCurrentPeriodEnd),
            }
          : null,
    cta: {
      label: isPaid ? 'Gerenciar plano' : 'Conhecer o Premium',
      href: PLAN_SETTINGS_HREF,
    },
  };
}
