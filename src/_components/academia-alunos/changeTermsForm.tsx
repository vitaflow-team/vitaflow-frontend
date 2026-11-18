'use client';

import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import { useChangeTerms } from '@/_hooks/useChangeTerms';
import { DueDaySelect } from './dueDaySelect';
import { FeeAmountInput } from './feeAmountInput';

interface ChangeTermsFormProps {
  clientId: string;
  onChanged: () => void;
}

/** New due day and/or fee for the fees not yet issued; issued fees keep their terms (US-014). */
export function ChangeTermsForm({ clientId, onChanged }: ChangeTermsFormProps) {
  const form = useChangeTerms(clientId, onChanged);

  return (
    <form
      onSubmit={event => void form.submit(event)}
      className="flex flex-col gap-3 rounded-lg border p-3"
    >
      <span className="text-sm font-medium">Alterar mensalidade</span>
      <p className="text-muted-foreground text-xs">
        Vale só para as mensalidades ainda não emitidas.
      </p>
      <DueDaySelect
        id="terms-due-day"
        label="Novo dia de vencimento"
        value={form.dueDay}
        emptyLabel="Manter o atual"
        disabled={form.isPending}
        onChange={form.setDueDay}
      />
      <FeeAmountInput
        id="terms-fee-amount"
        label="Novo valor (R$)"
        value={form.amountText}
        placeholder="Manter o atual"
        disabled={form.isPending}
        onChange={form.setAmountText}
      />
      <FormError message={form.error} />
      {form.saved && (
        <p role="status" className="text-sm">
          Condições atualizadas.
        </p>
      )}
      <Button type="submit" variant="outline" disabled={form.isPending}>
        {form.isPending ? 'Salvando…' : 'Salvar condições'}
      </Button>
    </form>
  );
}
