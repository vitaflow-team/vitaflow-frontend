'use client';

import { createExercise } from '@/_actions/exercises/createExercise';
import { submitExercise } from '@/_actions/exercises/submitExercise';
import { updateExercise } from '@/_actions/exercises/updateExercise';
import { useAlertHook } from '@/_hooks/alertHook';
import {
  EXERCISE_SAVE_FALLBACK,
  exerciseSaveDestination,
  exerciseSaveMessage,
} from '@/_lib/exerciseFormOutcome';
import { EMPTY_EXERCISE_FORM } from '@/_lib/exercisePayload';
import {
  exerciseCatalogSchema,
  type ExerciseCatalogFormData,
  type ExerciseCatalogFormInput,
} from '@/_schema/exerciseCatalog';
import type { ExerciseFormMethods } from '@/_types/exerciseFormMethods';
import type { ExerciseFormMode } from '@/_types/exerciseFormMode';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';

function saveExercise(mode: ExerciseFormMode, values: ExerciseCatalogFormData) {
  if (mode.kind === 'edit') return updateExercise({ ...values, id: mode.id });
  if (mode.kind === 'create') return createExercise(values);
  return submitExercise(values);
}

/** Form state plus the save flow for the three exercise forms. */
export function useExerciseForm(
  mode: ExerciseFormMode,
  defaultValues: ExerciseCatalogFormInput = EMPTY_EXERCISE_FORM
) {
  const router = useRouter();
  const { openError } = useAlertHook();
  const methods: ExerciseFormMethods = useForm({
    resolver: zodResolver(exerciseCatalogSchema) as Resolver<
      ExerciseCatalogFormInput,
      unknown,
      ExerciseCatalogFormData
    >,
    defaultValues,
  });

  async function onSubmit(values: ExerciseCatalogFormData) {
    const [, error] = await saveExercise(mode, values);
    if (error) {
      openError(error.message || EXERCISE_SAVE_FALLBACK, 'Atenção!', 'error');
      return;
    }

    openError(exerciseSaveMessage(mode), 'Pronto!', 'success');
    const destination = exerciseSaveDestination(mode);
    if (destination) {
      router.push(destination);
      return;
    }
    methods.reset(EMPTY_EXERCISE_FORM);
    router.refresh();
  }

  return { methods, onSubmit: methods.handleSubmit(onSubmit) };
}
