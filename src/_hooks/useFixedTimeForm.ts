'use client';

import { createFixedTime } from '@/_actions/students/schedule/createFixedTime';
import { updateFixedTime } from '@/_actions/students/schedule/updateFixedTime';
import {
  draftOf,
  EMPTY_DRAFT,
  validateDraft,
  type FixedTimeDraft,
} from '@/_lib/fixedTimeDraft';
import type { FixedTime } from '@/_types/educatorSchedule';
import type { ScheduleConflict } from '@/_types/scheduleOutcomes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

const NOT_FOUND = 'Este horário não existe mais. Atualize a página.';

/**
 * The add or change form of one fixed time. A conflict or a failed save keeps
 * every typed value; saving is refused while pending and when an edit changes
 * nothing.
 */
export function useFixedTimeForm(
  studentId: string,
  fixedTime: FixedTime | null,
  onDone: () => void
) {
  const router = useRouter();
  const create = useServerAction(createFixedTime);
  const update = useServerAction(updateFixedTime);
  const initial = fixedTime ? draftOf(fixedTime) : EMPTY_DRAFT;
  const [draft, setDraft] = useState<FixedTimeDraft>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [conflict, setConflict] = useState<ScheduleConflict | null>(null);
  const isPending = create.isPending || update.isPending;
  const isDirty = JSON.stringify(draft) !== JSON.stringify(initial);

  function patch(next: Partial<FixedTimeDraft>) {
    setDraft(current => ({ ...current, ...next }));
    setConflict(null);
    setFailure(null);
  }

  async function submit() {
    if (isPending) return;
    const checked = validateDraft(draft);
    setErrors(checked.ok ? {} : checked.errors);
    if (!checked.ok) return;
    setFailure(null);
    setConflict(null);

    if (fixedTime && !isDirty) return;

    const [result, error] = fixedTime
      ? await update.execute({
          studentId,
          fixedTimeId: fixedTime.id,
          ...checked.payload,
        })
      : await create.execute({ studentId, ...checked.payload });
    if (error) return setFailure(error.message);
    if (result.outcome === 'conflict') return setConflict(result.conflict);
    if (result.outcome === 'not_found') return setFailure(NOT_FOUND);

    router.refresh();
    onDone();
  }

  return {
    draft,
    patch,
    errors,
    failure,
    conflict,
    isPending,
    isDirty,
    submit,
  };
}
