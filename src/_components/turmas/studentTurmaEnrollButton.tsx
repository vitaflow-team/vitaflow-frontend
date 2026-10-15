'use client';

import { cancelTurmaEnrollment } from '@/_actions/turmas/cancelTurmaEnrollment';
import { enrollTurma } from '@/_actions/turmas/enrollTurma';
import { Button } from '@/_components/ui/button';
import { FormError } from '@/_components/students/formError';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

interface StudentTurmaEnrollButtonProps {
  turmaId: string;
  enrolled: boolean;
  isFull: boolean;
}

export function StudentTurmaEnrollButton({
  turmaId,
  enrolled,
  isFull,
}: StudentTurmaEnrollButtonProps) {
  const router = useRouter();
  const enroll = useServerAction(enrollTurma);
  const cancel = useServerAction(cancelTurmaEnrollment);
  const [error, setError] = useState<string | null>(null);
  const isPending = enroll.isPending || cancel.isPending;

  async function handleEnroll() {
    setError(null);
    const [, failure] = await enroll.execute({ turmaId });
    if (failure) {
      setError(failure.message);
      return;
    }
    router.refresh();
  }

  async function handleCancel() {
    setError(null);
    const [, failure] = await cancel.execute({ turmaId });
    if (failure) {
      setError(failure.message);
      return;
    }
    router.refresh();
  }

  if (enrolled) {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          Já inscrito
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => void handleCancel()}
        >
          Cancelar inscrição
        </Button>
        <FormError message={error} />
      </div>
    );
  }

  if (isFull) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button type="button" variant="outline" size="sm" disabled>
          Turma cheia
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        size="sm"
        disabled={isPending}
        onClick={() => void handleEnroll()}
      >
        {enroll.isPending ? 'Inscrevendo...' : 'Inscrever-se'}
      </Button>
      <FormError message={error} />
    </div>
  );
}
