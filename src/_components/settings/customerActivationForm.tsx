'use client';

import { activateAsCustomer } from '@/_actions/users/activateAsCustomer';
import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import { Checkbox } from '@/_components/ui/checkbox';
import { Label } from '@/_components/ui/label';
import { useAlertHook } from '@/_hooks/alertHook';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { useServerAction } from 'zsa-react';

interface ConsentCheckboxProps {
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}

function ConsentCheckbox({
  checked,
  disabled,
  onChange,
  children,
}: ConsentCheckboxProps) {
  const id = useId();

  return (
    <div className="flex items-start gap-2">
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={value => onChange(value === true)}
      />
      <Label htmlFor={id} className="h-auto font-normal leading-snug">
        {children}
      </Label>
    </div>
  );
}

function PolicyLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline text-primary"
    >
      {label}
    </Link>
  );
}

/**
 * Both consents must be ticked before the account becomes a customer
 * (US-011). Leaving without submitting changes nothing. After success the
 * page is refreshed: the server sees the new plan and brings the session's
 * plan claims up to date, with no new sign-in.
 */
export function CustomerActivationForm() {
  const router = useRouter();
  const { openError } = useAlertHook();
  const { execute, isPending, error } = useServerAction(activateAsCustomer);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [healthDataConsent, setHealthDataConsent] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const [, failure] = await execute({ termsAccepted, healthDataConsent });
    if (failure) return;
    openError('Você já pode usar o Vita Flow.', 'Pronto!', 'success');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <ConsentCheckbox
        checked={termsAccepted}
        disabled={isPending}
        onChange={setTermsAccepted}
      >
        Li e aceito os <PolicyLink href="/terms" label="Termos de Uso" /> e a{' '}
        <PolicyLink href="/privacy" label="Política de Privacidade" />.
      </ConsentCheckbox>
      <ConsentCheckbox
        checked={healthDataConsent}
        disabled={isPending}
        onChange={setHealthDataConsent}
      >
        Autorizo o tratamento dos meus dados de saúde (peso, altura, medidas,
        treinos e alimentação) que eu vier a registrar na plataforma, conforme a{' '}
        <PolicyLink href="/privacy" label="Política de Privacidade" />.
      </ConsentCheckbox>
      <FormError message={error ? error.message : null} />
      <Button
        type="submit"
        className="w-full sm:w-fit"
        disabled={isPending || !termsAccepted || !healthDataConsent}
      >
        {isPending ? 'Ativando...' : 'Começar a usar como cliente'}
      </Button>
    </form>
  );
}
