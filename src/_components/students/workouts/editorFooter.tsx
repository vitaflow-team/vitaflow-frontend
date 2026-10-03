'use client';

import { Button } from '@/_components/ui/button';
import { FormError } from '../formError';

interface EditorFooterProps {
  isSaving: boolean;
  isDirty: boolean;
  saveError: string | null;
  onSave: () => void;
}

/** The save bar: one button, disabled while saving so a double click sends one request. */
export function EditorFooter({
  isSaving,
  isDirty,
  saveError,
  onSave,
}: EditorFooterProps) {
  return (
    <div className="flex flex-col gap-2">
      <FormError message={saveError} />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" disabled={isSaving} onClick={onSave}>
          {isSaving ? 'Salvando…' : 'Salvar treino'}
        </Button>
        {isDirty && !isSaving && (
          <p className="text-xs text-muted-foreground">
            Há alterações não salvas.
          </p>
        )}
      </div>
    </div>
  );
}
