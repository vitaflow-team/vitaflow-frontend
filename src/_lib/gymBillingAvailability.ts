import type { BillingAccount } from '@/_types/billing';
import type { GymBillingAvailability } from '@/_types/gymBillingAvailability';
import type { LoadFailure } from '@/_types/loadFailure';

/**
 * What stands between the gym owner and charging monthly fees. A billing
 * account that could not be read is treated as `READY`: the backend refuses a
 * link it cannot bill with its own message, so a failed read never blocks.
 */
export function gymBillingAvailability(
  account: BillingAccount | LoadFailure
): GymBillingAvailability {
  if (typeof account === 'string') return 'READY';
  if (!account.premium) return 'SUBSCRIPTION_REQUIRED';
  if (account.status === 'RECONNECT_NEEDED') return 'RECONNECT_NEEDED';
  return account.connected ? 'READY' : 'NOT_CONNECTED';
}

const HINTS: Record<Exclude<GymBillingAvailability, 'READY'>, string> = {
  NOT_CONNECTED:
    'Conecte a conta Asaas da academia para cobrar as mensalidades dos alunos.',
  RECONNECT_NEEDED:
    'A chave Asaas da academia precisa ser reconectada para emitir cobranças.',
  SUBSCRIPTION_REQUIRED:
    'A cobrança da academia exige uma assinatura ativa. Regularize o plano para cobrar as mensalidades.',
};

/** Why the monthly fee is unavailable, or `null` when it is available. */
export function availabilityHint(
  availability: GymBillingAvailability
): string | null {
  return availability === 'READY' ? null : HINTS[availability];
}
