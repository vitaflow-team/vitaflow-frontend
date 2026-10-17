'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/_components/ui/alert-dialog';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { useCloneDay } from '@/_hooks/useCloneDay';
import { WEEKDAY_LABELS } from '@/_lib/mealPlanWeekdays';
import type {
  MealPlanDraft,
  MealPlanVersion,
  Weekday,
} from '@/_types/mealPlan';
import { useState } from 'react';
import { CloneSourcePicker, type SourceMode } from './cloneSourcePicker';

interface CloneDayDialogProps {
  clientId: string;
  targetWeekday: Weekday;
  draft: MealPlanDraft;
  versions: MealPlanVersion[];
  /** Optional: the dialog already closes itself and the clone hook already
   * refreshes the page's server data once cloned. */
  onCloned?: (draft: MealPlanDraft) => void;
}

function OverwriteConfirmDialog({
  weekday,
  open,
  onOpenChange,
  onConfirm,
}: {
  weekday: Weekday;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Sobrescrever {WEEKDAY_LABELS[weekday]}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Este dia já tem refeições. Elas serão substituídas pela cópia.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Sobrescrever
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Clones another day's meals onto this one (US-013), from the current draft or a past version. */
export function CloneDayDialog({
  clientId,
  targetWeekday,
  draft,
  versions,
  onCloned,
}: CloneDayDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<SourceMode>('draft');
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const {
    versionContent,
    loadVersionContent,
    clone,
    isPending,
    error,
    awaitingConfirm,
    confirmOverwrite,
    cancelConfirm,
  } = useCloneDay({
    clientId,
    targetWeekday,
    onCloned: next => {
      setOpen(false);
      onCloned?.(next);
    },
  });

  const draftSourceDays = draft.days.filter(
    day => day.weekday !== targetWeekday && day.meals.length > 0
  );
  const versionSourceDays = (versionContent?.days ?? []).filter(
    day => day.meals.length > 0
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            Clonar dia
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Clonar para {WEEKDAY_LABELS[targetWeekday]}
            </DialogTitle>
          </DialogHeader>
          <CloneSourcePicker
            mode={mode}
            onModeChange={setMode}
            draftSourceDays={draftSourceDays}
            versions={versions}
            selectedVersion={selectedVersion}
            onSelectVersion={version => {
              setSelectedVersion(version);
              loadVersionContent(version);
            }}
            versionSourceDays={versionSourceDays}
            disabled={isPending}
            error={error}
            onSelectDay={clone}
          />
        </DialogContent>
      </Dialog>

      <OverwriteConfirmDialog
        weekday={targetWeekday}
        open={awaitingConfirm !== null}
        onOpenChange={next => {
          if (!next) cancelConfirm();
        }}
        onConfirm={confirmOverwrite}
      />
    </>
  );
}
