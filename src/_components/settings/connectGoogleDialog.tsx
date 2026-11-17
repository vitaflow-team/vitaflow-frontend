'use client';

import { FormError } from '@/_components/students/formError';
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
import { InputPassword } from '@/_components/ui/inputPass';
import { Label } from '@/_components/ui/label';
import { useStartGoogleLink } from '@/_hooks/useStartGoogleLink';
import { useId, useState, type FormEvent } from 'react';

/**
 * The password step itself. Kept apart from the dialog shell so it can be
 * rendered, and tested, without opening one.
 */
export function ConnectGooglePasswordForm() {
  const { start, isPending, errorMessage } = useStartGoogleLink();
  const [password, setPassword] = useState('');
  const passwordId = useId();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await start(password);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor={passwordId}>Sua senha atual</Label>
        <InputPassword
          id={passwordId}
          value={password}
          autoComplete="current-password"
          disabled={isPending}
          onChange={event => setPassword(event.target.value)}
        />
      </div>
      <FormError message={errorMessage} />
      <DialogFooter>
        <Button type="submit" disabled={isPending || !password}>
          {isPending ? 'Abrindo o Google...' : 'Continuar com o Google'}
        </Button>
      </DialogFooter>
    </form>
  );
}

/**
 * An account with staff access confirms its current password before going
 * to Google (US-005 AC-3): control of the Google account alone must never
 * be enough to gain staff access.
 */
export function ConnectGoogleDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="w-full sm:w-fit">
          Conectar Google
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirme sua senha</DialogTitle>
          <DialogDescription>
            Sua conta tem acesso à equipe Vita Flow. Para conectar o Google,
            confirme primeiro a senha desta conta.
          </DialogDescription>
        </DialogHeader>
        <ConnectGooglePasswordForm />
      </DialogContent>
    </Dialog>
  );
}
