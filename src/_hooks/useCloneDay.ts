'use client';

import { cloneDay } from '@/_actions/mealPlan/cloneDay';
import { getVersionContent } from '@/_actions/mealPlan/getVersionContent';
import type { MealPlanDraft, Weekday } from '@/_types/mealPlan';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

interface UseCloneDayInput {
  clientId: string;
  targetWeekday: Weekday;
  onCloned: (draft: MealPlanDraft) => void;
}

export function useCloneDay({
  clientId,
  targetWeekday,
  onCloned,
}: UseCloneDayInput) {
  const router = useRouter();
  const clone = useServerAction(cloneDay);
  const fetchVersion = useServerAction(getVersionContent);
  const [versionContent, setVersionContent] = useState<MealPlanDraft | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [awaitingConfirm, setAwaitingConfirm] = useState<string | null>(null);

  async function loadVersionContent(version: number) {
    setError(null);
    setVersionContent(null);
    const [draft, actionError] = await fetchVersion.execute({
      clientId,
      version,
    });
    if (actionError) setError(actionError.message);
    else if (draft) setVersionContent(draft);
  }

  async function clone_(sourceDayId: string, confirmOverwrite = false) {
    setError(null);
    const [result, actionError] = await clone.execute({
      clientId,
      weekday: targetWeekday,
      sourceDayId,
      ...(confirmOverwrite ? { confirmOverwrite: true } : {}),
    });
    if (actionError) {
      setError(actionError.message);
      return;
    }
    if (result?.outcome === 'confirm_overwrite_required') {
      setAwaitingConfirm(sourceDayId);
      return;
    }
    if (result?.outcome === 'cloned') {
      router.refresh();
      onCloned(result.draft);
    }
  }

  return {
    versionContent,
    loadVersionContent,
    clone: clone_,
    isPending: clone.isPending || fetchVersion.isPending,
    error,
    awaitingConfirm,
    confirmOverwrite: () => {
      const sourceDayId = awaitingConfirm;
      setAwaitingConfirm(null);
      if (sourceDayId) clone_(sourceDayId, true);
    },
    cancelConfirm: () => setAwaitingConfirm(null),
  };
}
