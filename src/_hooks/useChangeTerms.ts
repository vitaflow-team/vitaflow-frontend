import { changeBillingTerms } from '@/_actions/academia/changeBillingTerms';
import { prepareTermsChange } from '@/_lib/gymBillingForm';
import { useState, type FormEvent } from 'react';
import { useServerAction } from 'zsa-react';

/** The fields and submit of the change-terms form: a term left empty is left as it is. */
export function useChangeTerms(clientId: string, onChanged: () => void) {
  const { execute, isPending } = useServerAction(changeBillingTerms);
  const [dueDay, setDueDay] = useState<number | null>(null);
  const [amountText, setAmountText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaved(false);
    const prepared = prepareTermsChange({ clientId, dueDay, amountText });
    if (!prepared.ok) return setError(prepared.message);

    const [, actionError] = await execute(prepared.input);
    setError(actionError?.message ?? null);
    if (actionError) return;
    setSaved(true);
    onChanged();
  }

  return {
    dueDay,
    setDueDay,
    amountText,
    setAmountText,
    error,
    saved,
    isPending,
    submit,
  };
}
