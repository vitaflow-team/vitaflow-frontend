'use client';

import { getVersionContent } from '@/_actions/mealPlan/getVersionContent';
import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { formatRecordedAt } from '@/_lib/formRecordDisplay';
import type { MealPlanDraft, MealPlanVersion } from '@/_types/mealPlan';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';
import { ReadOnlyWeekdayList } from './readOnlyWeekdayList';

interface VersionHistoryPanelProps {
  clientId: string;
  versions: MealPlanVersion[];
}

/** Every past published version, each opening its own full read-only content (US-015). */
export function VersionHistoryPanel({
  clientId,
  versions,
}: VersionHistoryPanelProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MealPlanDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { execute, isPending } = useServerAction(getVersionContent);

  async function openVersion(version: number) {
    setError(null);
    setSelected(null);
    const [draft, actionError] = await execute({ clientId, version });
    if (actionError) setError(actionError.message);
    else if (draft) setSelected(draft);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={next => {
        setOpen(next);
        if (!next) setSelected(null);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Histórico de versões
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de versões</DialogTitle>
        </DialogHeader>

        {selected ? (
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelected(null)}
              className="w-fit"
            >
              ← Voltar
            </Button>
            <ReadOnlyWeekdayList draft={selected} />
          </div>
        ) : versions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma versão publicada ainda.
          </p>
        ) : (
          <ul className="flex flex-col">
            {versions.map(version => (
              <li
                key={version.version}
                className="border-b border-line py-2 last:border-b-0"
              >
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isPending}
                  onClick={() => openVersion(version.version)}
                  className="w-full justify-between"
                >
                  Versão {version.version}
                  <span className="text-muted-foreground text-xs">
                    {formatRecordedAt(version.publishedAt)}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        )}
        <FormError message={error} />
      </DialogContent>
    </Dialog>
  );
}
