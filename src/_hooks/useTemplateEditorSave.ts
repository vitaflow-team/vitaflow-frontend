'use client';

import { createTemplate } from '@/_actions/clinicalRecords/createTemplate';
import { updateTemplate } from '@/_actions/clinicalRecords/updateTemplate';
import { toFieldInput } from '@/_lib/templateFieldDrafts';
import type { Template, TemplatePurpose } from '@/_types/clinicalRecords';
import type { TemplateFieldDraft } from '@/_types/templateFieldDraft';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

interface UseTemplateEditorSaveInput {
  purpose: TemplatePurpose;
  existing?: Template;
  onSaved: () => void;
}

/** Creates or updates a template from its current name/field drafts. */
export function useTemplateEditorSave({
  purpose,
  existing,
  onSaved,
}: UseTemplateEditorSaveInput) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const create = useServerAction(createTemplate);
  const update = useServerAction(updateTemplate);
  const isPending = create.isPending || update.isPending;

  async function save(name: string, fields: TemplateFieldDraft[]) {
    setError(null);
    const body = { name, fields: fields.map(toFieldInput) };
    const [, actionError] = existing
      ? await update.execute({ id: existing.id, ...body })
      : await create.execute({ purpose, ...body });

    if (actionError) {
      setError(actionError.message);
      return;
    }
    router.refresh();
    onSaved();
  }

  return { save, isPending, error };
}
