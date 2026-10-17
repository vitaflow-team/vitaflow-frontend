'use client';

import { createFormRecord } from '@/_actions/clinicalRecords/createFormRecord';
import { updateFormRecord } from '@/_actions/clinicalRecords/updateFormRecord';
import {
  buildValueInputs,
  missingRequiredField,
  type AnswersByFieldId,
  type FieldAnswer,
} from '@/_lib/formRecordValues';
import type { FormRecord, Template } from '@/_types/clinicalRecords';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

interface UseFormFillingSaveInput {
  clientId: string;
  /** Undefined when the caller has no active template to fill against yet. */
  template: Template | undefined;
  existing: FormRecord | null;
  answers: AnswersByFieldId;
  onSaved: () => void;
}

type ExecuteUpdate = ReturnType<
  typeof useServerAction<typeof updateFormRecord>
>['execute'];
type ExecuteCreate = ReturnType<
  typeof useServerAction<typeof createFormRecord>
>['execute'];

interface SaveOutcome {
  declarationRequired?: boolean;
  errorMessage?: string;
}

interface SaveUpdateInput {
  clientId: string;
  recordId: string;
  values: Array<{ templateFieldId: string; value: FieldAnswer }>;
}

async function saveUpdate(
  update: ExecuteUpdate,
  input: SaveUpdateInput
): Promise<SaveOutcome> {
  const [, actionError] = await update(input);
  return actionError ? { errorMessage: actionError.message } : {};
}

interface SaveCreateInput {
  clientId: string;
  templateId: string;
  values: Array<{ templateFieldId: string; value: FieldAnswer }>;
  acceptDeclaration: boolean;
}

async function saveCreate(
  create: ExecuteCreate,
  input: SaveCreateInput
): Promise<SaveOutcome> {
  const [result, actionError] = await create({
    clientId: input.clientId,
    templateId: input.templateId,
    values: input.values,
    ...(input.acceptDeclaration ? { acceptDeclaration: true } : {}),
  });
  if (actionError) return { errorMessage: actionError.message };
  return { declarationRequired: result?.outcome === 'declaration_required' };
}

/** Validates, saves (create or revise) and surfaces the declaration gate. */
export function useFormFillingSave({
  clientId,
  template,
  existing,
  answers,
  onSaved,
}: UseFormFillingSaveInput) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [awaitingDeclaration, setAwaitingDeclaration] = useState(false);
  const create = useServerAction(createFormRecord);
  const update = useServerAction(updateFormRecord);
  const isPending = create.isPending || update.isPending;

  async function save(acceptDeclaration = false) {
    if (!template) return;

    setError(null);
    const missing = missingRequiredField(template.fields, answers);
    if (missing) {
      setError(`Preencha o campo obrigatório "${missing}".`);
      return;
    }

    const values = buildValueInputs(template.fields, answers);
    const outcome = existing
      ? await saveUpdate(update.execute, {
          clientId,
          recordId: existing.id,
          values,
        })
      : await saveCreate(create.execute, {
          clientId,
          templateId: template.id,
          values,
          acceptDeclaration,
        });

    if (outcome.errorMessage) return setError(outcome.errorMessage);
    if (outcome.declarationRequired) return setAwaitingDeclaration(true);
    router.refresh();
    onSaved();
  }

  return {
    save,
    isPending,
    error,
    awaitingDeclaration,
    acceptDeclaration: () => {
      setAwaitingDeclaration(false);
      save(true);
    },
    declineDeclaration: () => setAwaitingDeclaration(false),
  };
}
