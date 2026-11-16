'use client';

import { postEducatorAiWorkoutConversation } from '@/_actions/students/workouts/postEducatorAiWorkoutConversation';
import { ConversationChat } from '@/_components/conversation/conversationChat';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { workoutEditorHref } from '@/_lib/workoutLinks';
import { isGeneratedWorkoutTree } from '@/_types/educatorAiWorkout';
import type { WorkoutTree } from '@/_types/educatorWorkouts';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

interface GenerateAiWorkoutDialogProps {
  studentId: string;
}

export interface AiWorkoutReadyCallbacks {
  closeDialog: () => void;
  openEditor: (workoutId: string) => void;
}

/**
 * On a ready result, closes the dialog and opens the fresh draft in the
 * existing editor — the same route a brand-new draft and a regenerate both
 * navigate to (ai-workout-prescription-b2b: "the draft opens in the
 * educator's existing editor for review"). Extracted as a pure function so
 * it's directly unit-testable, mirroring `handleMealPlanReady`.
 */
export function handleAiWorkoutReady(
  tree: WorkoutTree,
  callbacks: AiWorkoutReadyCallbacks
): void {
  callbacks.closeDialog();
  callbacks.openEditor(tree.id);
}

/**
 * The list-level "Gerar com IA" entry point: always creates a brand-new
 * draft, so there is nothing to overwrite and no confirm-overwrite step —
 * unlike the in-editor `RegenerateAiWorkoutButton`, which targets an
 * existing draft and can 409. Configures the shared, generic
 * `ConversationChat` with a thin wrapper around the Server Action that
 * closes over `studentId`, since the generic component only ever calls its
 * `action` with `{conversationId, answer}` and has no way to carry this
 * feature's own path parameter through every call itself.
 */
export function GenerateAiWorkoutDialog({
  studentId,
}: GenerateAiWorkoutDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const action = useCallback(
    (input: { conversationId?: string; answer?: string }) =>
      postEducatorAiWorkoutConversation({ studentId, ...input }),
    [studentId]
  );
  const onReady = (tree: WorkoutTree) =>
    handleAiWorkoutReady(tree, {
      closeDialog: () => setOpen(false),
      openEditor: workoutId => {
        router.push(workoutEditorHref(studentId, workoutId));
        router.refresh();
      },
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          Gerar com IA
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerar treino com IA</DialogTitle>
        </DialogHeader>
        <ConversationChat
          action={action}
          isReady={isGeneratedWorkoutTree}
          onReady={onReady}
          title="Vamos montar o treino"
          premiumTitle="Geração com IA requer o plano Premium"
          premiumMessage="Assine o plano Premium para gerar treinos com IA."
          premiumCtaLabel="Ver planos"
          premiumCtaHref="/restrict/settings?tab=plano"
        />
      </DialogContent>
    </Dialog>
  );
}
