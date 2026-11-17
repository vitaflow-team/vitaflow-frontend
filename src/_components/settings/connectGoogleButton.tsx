'use client';

import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import { useStartGoogleLink } from '@/_hooks/useStartGoogleLink';

/** One step for an ordinary account: straight to Google, no password asked. */
export function ConnectGoogleButton() {
  const { start, isPending, errorMessage } = useStartGoogleLink();

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        className="w-full sm:w-fit"
        disabled={isPending}
        onClick={() => start()}
      >
        {isPending ? 'Abrindo o Google...' : 'Conectar Google'}
      </Button>
      <FormError message={errorMessage} />
    </div>
  );
}
