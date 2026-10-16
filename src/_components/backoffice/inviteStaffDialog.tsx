'use client';

import { inviteStaff } from '@/_actions/backoffice/inviteStaff';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { FormError } from '@/_components/students/formError';
import { useAlertHook } from '@/_hooks/alertHook';
import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';
import { useServerAction } from 'zsa-react';
import type { BackofficeTier } from '@/_types/backofficeStaff';

interface InviteStaffFieldsProps {
  email: string;
  tier: BackofficeTier;
  disabled: boolean;
  onEmailChange: (value: string) => void;
  onTierChange: (value: BackofficeTier) => void;
}

function InviteStaffFields({
  email,
  tier,
  disabled,
  onEmailChange,
  onTierChange,
}: InviteStaffFieldsProps) {
  const emailId = useId();
  const tierId = useId();

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor={emailId}>E-mail</Label>
        <Input
          id={emailId}
          type="email"
          required
          value={email}
          disabled={disabled}
          onChange={event => onEmailChange(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={tierId}>Nível de acesso</Label>
        <select
          id={tierId}
          value={tier}
          disabled={disabled}
          onChange={event => onTierChange(event.target.value as BackofficeTier)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="EQUIPE">Equipe</option>
          <option value="ADMIN">Admin interno</option>
        </select>
      </div>
    </>
  );
}

interface InviteStaffFormProps {
  onDone: () => void;
}

function InviteStaffForm({ onDone }: InviteStaffFormProps) {
  const router = useRouter();
  const { openError } = useAlertHook();
  const { execute, isPending } = useServerAction(inviteStaff);
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState<BackofficeTier>('EQUIPE');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const [, failure] = await execute({ email, tier });
    if (failure) {
      setError(failure.message);
      return;
    }
    onDone();
    openError('Convite enviado.', 'Pronto!', 'success');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InviteStaffFields
        email={email}
        tier={tier}
        disabled={isPending}
        onEmailChange={setEmail}
        onTierChange={setTier}
      />
      <FormError message={error} />
      <DialogFooter>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Enviando...' : 'Enviar convite'}
        </Button>
      </DialogFooter>
    </form>
  );
}

/** Invites a new internal staff member, by email and tier (US-007). */
export function InviteStaffDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Convidar membro</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar para a equipe Vita Flow</DialogTitle>
          <DialogDescription>
            A pessoa recebe um e-mail para definir a própria senha e ativar o
            acesso.
          </DialogDescription>
        </DialogHeader>
        <InviteStaffForm onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
