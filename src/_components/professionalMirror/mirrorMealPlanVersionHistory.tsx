'use client';

import { getMealPlanVersionContent } from '@/_actions/professionalMirror/getMealPlanVersionContent';
import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { ReadOnlyWeekdayList } from '@/_components/mealPlan/readOnlyWeekdayList';
import { formatRecordedAt } from '@/_lib/formRecordDisplay';
import type { MealPlanVersion } from '@/_types/mealPlan';
import type { MirrorMealPlanVersionContent } from '@/_types/professionalMirror';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

interface MirrorMealPlanVersionHistoryProps {
  versions: MealPlanVersion[];
}

/** Every past published version of the patient's own meal plan, each opening its full read-only content (ADR-008). */
export function MirrorMealPlanVersionHistory({
  versions,
}: MirrorMealPlanVersionHistoryProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MirrorMealPlanVersionContent | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const { execute, isPending } = useServerAction(getMealPlanVersionContent);

  async function openVersion(version: number) {
    setError(null);
    setSelected(null);
    const [content, actionError] = await execute({ version });
    if (actionError) setError(actionError.message);
    else if (content) setSelected(content);
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
        <Button type="button" variant="outline" size="sm">
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
            <ReadOnlyWeekdayList days={selected.days} />
          </div>
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
