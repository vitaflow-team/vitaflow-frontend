'use client';

import { Button } from '@/_components/ui/button';
import { Form } from '@/_components/ui/form';
import { useExerciseForm } from '@/_hooks/useExerciseForm';
import type { ExerciseCatalogFormInput } from '@/_schema/exerciseCatalog';
import type { ExerciseFormMode } from '@/_types/exerciseFormMode';
import {
  ExerciseOptionalFields,
  ExerciseRequiredFields,
} from './exerciseFormFields';

const SUBMIT_LABELS: Record<ExerciseFormMode['kind'], string> = {
  submit: 'Enviar para revisão',
  create: 'Publicar exercício',
  edit: 'Salvar alterações',
};

interface ExerciseFormProps {
  mode: ExerciseFormMode;
  defaultValues?: ExerciseCatalogFormInput;
}

/**
 * One form for the educator submission and the backoffice create and edit.
 * Missing required fields are caught here, before anything is sent
 * (US-006.EC-1, US-010.EC-3).
 */
export function ExerciseForm({ mode, defaultValues }: ExerciseFormProps) {
  const { methods, onSubmit } = useExerciseForm(mode, defaultValues);
  const busy = methods.formState.isSubmitting;

  return (
    <Form {...methods}>
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-1">
        <ExerciseRequiredFields methods={methods} disabled={busy} />
        <ExerciseOptionalFields methods={methods} disabled={busy} />
        <Button type="submit" disabled={busy} className="w-full sm:w-fit">
          {busy ? 'Salvando…' : SUBMIT_LABELS[mode.kind]}
        </Button>
      </form>
    </Form>
  );
}
