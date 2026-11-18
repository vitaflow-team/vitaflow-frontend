import type { BillingFormValues } from '@/_types/billingFormValues';
import { DueDaySelect } from './dueDaySelect';
import { FeeAmountInput } from './feeAmountInput';
import { StudentTaxIdInput } from './studentTaxIdInput';

interface BillingFieldsProps {
  values: BillingFormValues;
  onChange: (values: BillingFormValues) => void;
  needsTaxId: boolean;
  disabled: boolean;
}

/** Due day, fee amount (prefilled with the plan price) and, when missing, the tax ID. */
export function BillingFields({
  values,
  onChange,
  needsTaxId,
  disabled,
}: BillingFieldsProps) {
  return (
    <div className="flex flex-col gap-3">
      <DueDaySelect
        id="plan-due-day"
        label="Dia de vencimento"
        value={values.dueDay}
        disabled={disabled}
        onChange={dueDay =>
          onChange({ ...values, dueDay: dueDay ?? values.dueDay })
        }
      />
      <FeeAmountInput
        id="plan-fee-amount"
        label="Valor da mensalidade (R$)"
        value={values.amountText}
        disabled={disabled}
        onChange={amountText => onChange({ ...values, amountText })}
      />
      {needsTaxId && (
        <StudentTaxIdInput
          value={values.cpfCnpj}
          disabled={disabled}
          onChange={cpfCnpj => onChange({ ...values, cpfCnpj })}
        />
      )}
    </div>
  );
}
