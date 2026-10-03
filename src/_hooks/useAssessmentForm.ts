'use client';

import { createAssessment } from '@/_actions/students/createAssessment';
import { updateAssessment } from '@/_actions/students/updateAssessment';
import { getAssessmentDefaults } from '@/_lib/assessmentFormValues';
import {
  performSave,
  shouldSubmit,
  type AssessmentRequests,
} from '@/_lib/assessmentSaveFlow';
import {
  assessmentSchema,
  type AssessmentFormData,
  type AssessmentFormInput,
} from '@/_schema/assessment';
import type { Assessment } from '@/_types/students';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

interface UseAssessmentFormInput {
  studentId: string;
  /** The assessment being edited; absent when registering a new one. */
  existing?: Assessment;
  /** The newest saved assessment, whose height starts a new one. */
  previous?: Assessment | null;
  declarationAccepted: boolean;
  onSaved: () => void;
}

function useWarnBeforeUnload(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [active]);
}

function useAssessmentRequests(studentId: string) {
  const create = useServerAction(createAssessment);
  const update = useServerAction(updateAssessment);
  const requests: AssessmentRequests = {
    replace: (assessmentId, values) =>
      update.execute({ studentId, assessmentId, ...values }),
    add: (values, acceptDeclaration) =>
      create.execute({
        studentId,
        ...values,
        ...(acceptDeclaration ? { acceptDeclaration: true } : {}),
      }),
  };

  return { requests, isPending: create.isPending || update.isPending };
}

/**
 * Applies each save step to the screen: a failure shows its message and keeps
 * every typed value; a missing declaration holds the values (`awaiting`) until
 * it is accepted (they are sent again) or declined (nothing is saved).
 */
function useAssessmentSave(input: Omit<UseAssessmentFormInput, 'previous'>) {
  const { studentId, existing, declarationAccepted, onSaved } = input;
  const router = useRouter();
  const { requests, isPending } = useAssessmentRequests(studentId);
  const [error, setError] = useState<string | null>(null);
  const [awaiting, setAwaiting] = useState<AssessmentFormData | null>(null);

  async function save(values: AssessmentFormData, acceptNow = false) {
    setError(null);
    const step = await performSave({
      existing,
      declarationAccepted,
      values,
      acceptNow,
      requests,
    });

    if (step.kind === 'declaration') setAwaiting(values);
    else if (step.kind === 'failed') setError(step.message);
    else {
      onSaved();
      router.refresh();
    }
  }

  return {
    save,
    error,
    isPending,
    declarationOpen: awaiting !== null,
    acceptDeclaration: async () => {
      const values = awaiting;
      setAwaiting(null);
      if (values) await save(values, true);
    },
    declineDeclaration: () => setAwaiting(null),
  };
}

/** State and handlers behind the assessment form. */
export function useAssessmentForm(input: UseAssessmentFormInput) {
  const methods = useForm<AssessmentFormInput, unknown, AssessmentFormData>({
    resolver: zodResolver(assessmentSchema) as Resolver<
      AssessmentFormInput,
      unknown,
      AssessmentFormData
    >,
    defaultValues: getAssessmentDefaults({
      existing: input.existing,
      previous: input.previous,
    }),
  });
  const { save, isPending, ...rest } = useAssessmentSave(input);
  useWarnBeforeUnload(methods.formState.isDirty);

  const onSubmit = methods.handleSubmit(values =>
    shouldSubmit(isPending) ? save(values) : undefined
  );

  return {
    methods,
    isPending,
    isDirty: methods.formState.isDirty,
    onSubmit,
    ...rest,
  };
}
