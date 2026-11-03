import { monthName } from '@/_lib/billingDates';
import type { BillingWarning } from '@/_types/billing';

function competenceLabel({
  competenceYear,
  competenceMonth,
}: BillingWarning): string {
  return `${monthName(competenceMonth)} de ${competenceYear}`;
}

/** US-016 (AC-3): the competences whose charge couldn't be canceled at the gateway. */
export function billingWarningsMessage(
  warnings: BillingWarning[]
): string | null {
  if (warnings.length === 0) return null;

  const competences = warnings.map(competenceLabel).join(', ');
  const plural = warnings.length > 1;
  return `Não foi possível cancelar automaticamente a${plural ? 's' : ''} cobrança${
    plural ? 's' : ''
  } de ${competences} no Asaas. Cancele manualmente por lá.`;
}
