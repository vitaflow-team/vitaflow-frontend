import { planExpiry, type PlanExpiry } from '@/_lib/planExpiry';
import type { ProfileShell } from '@/_types/shell';

export interface PlanSummary {
  name: string;
  detail: PlanExpiry | null;
  cta: { label: 'Conhecer o Premium' | 'Gerenciar plano'; href: string };
}

/**
 * Até a área de configurações ganhar abas, o parâmetro é ignorado pela página e
 * o link simplesmente abre Configurações.
 */
export const PLAN_SETTINGS_HREF = '/restrict/settings?tab=plano';

/** Status em que a assinatura ainda vale e a chamada para ação muda. */
const PAID_STATUSES = ['active', 'trialing', 'past_due'];

const FREE_PLAN_NAME = 'Plano Gratuito';
const UNKNOWN_PLAN_NAME = 'Seu plano';

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
    // Renovar ou expirar já foi decidido pelo backend: aqui só se escreve o que
    // `expiresAt` e `autoRenew` dizem, e sem data não se inventa nada (ADR-004).
    detail: planExpiry({
      expiresAt: input.expiresAt,
      autoRenew: input.autoRenew,
    }),
    cta: {
      label: isPaid ? 'Gerenciar plano' : 'Conhecer o Premium',
      href: PLAN_SETTINGS_HREF,
    },
  };
}
