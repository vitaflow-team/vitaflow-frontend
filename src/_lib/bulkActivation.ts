import { GYM_BILLING_LIMITS } from '@/_constants/gymBilling';
import type { ActivateBillingInput } from '@/_schema/gymBilling';
import type { ActivationResult } from '@/_types/activationResult';
import type { ActivationSkipReason } from '@/_types/activationSkipReason';
import type { BatchedActivation } from '@/_types/batchedActivation';
import type { EligibleStudent } from '@/_types/eligibleStudent';

/** Runs one activation request; the bound `execute` of the action, or a stand-in in tests. */
export type ActivateExecutor = (
  input: ActivateBillingInput
) => Promise<readonly [ActivationResult | null, { message: string } | null]>;

const INTERRUPTED_MESSAGE =
  'Não foi possível concluir a ativação. Tente novamente.';

const SKIP_LABELS: Record<ActivationSkipReason, string> = {
  tax_id_missing: 'Sem CPF ou CNPJ cadastrado',
  already_billing: 'Já tem cobrança recorrente',
  no_active_plan: 'Sem plano de acesso ativo',
  gateway_failed: 'O Asaas recusou a cobrança',
};

export function skipReasonLabel(reason: ActivationSkipReason): string {
  return SKIP_LABELS[reason];
}

/** Consecutive slices of at most `size` items, in order. */
export function chunk<T>(items: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let start = 0; start < items.length; start += size) {
    batches.push(items.slice(start, start + size));
  }
  return batches;
}

export function mergeActivationResults(
  results: ActivationResult[]
): ActivationResult {
  return {
    activated: results.flatMap(result => result.activated),
    skipped: results.flatMap(result => result.skipped),
  };
}

/** One due day for the whole selection; the fee defaults to each student's plan price. */
export function activationItems(
  clientIds: string[],
  dueDay: number
): ActivateBillingInput['items'] {
  return clientIds.map(clientId => ({ clientId, dueDay }));
}

/**
 * Sends the selection in requests of at most 200 students and merges what
 * each one answers. A request that fails stops the run: what the earlier ones
 * did is kept, and the students not yet sent are counted so the owner can
 * simply activate again (students already billed are skipped, never doubled).
 */
export async function activateInBatches(
  execute: ActivateExecutor,
  items: ActivateBillingInput['items']
): Promise<BatchedActivation> {
  const batches = chunk(items, GYM_BILLING_LIMITS.bulkActivationMaxItems);
  const results: ActivationResult[] = [];
  let sent = 0;

  for (const batch of batches) {
    const [result, error] = await execute({ items: batch });
    if (error || !result) {
      return {
        result: mergeActivationResults(results),
        failure: error?.message ?? INTERRUPTED_MESSAGE,
        notSent: items.length - sent,
      };
    }
    results.push(result);
    sent += batch.length;
  }

  return { result: mergeActivationResults(results), failure: null, notSent: 0 };
}

/** The students whose tax ID is on file: the ones that can be activated without further data. */
export function activatableIds(students: EligibleStudent[]): string[] {
  return students
    .filter(student => student.hasTaxId)
    .map(student => student.clientId);
}

/** Adds the id to the selection, or removes it when it is already there. */
export function toggleSelection(
  selected: string[],
  clientId: string
): string[] {
  return selected.includes(clientId)
    ? selected.filter(id => id !== clientId)
    : [...selected, clientId];
}
