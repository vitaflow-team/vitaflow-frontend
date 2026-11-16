'use client';

import { postEducatorAiWorkoutConversation } from '@/_actions/students/workouts/postEducatorAiWorkoutConversation';
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
import { ConversationChat } from '@/_components/conversation/conversationChat';
import { CONFIRM_OVERWRITE_REQUIRED_MESSAGE } from '@/_lib/educatorAiWorkoutGenerationErrors';
import { workoutEditorHref } from '@/_lib/workoutLinks';
import {
  isGeneratedWorkoutTree,
  type EducatorAiWorkoutConversationTurn,
} from '@/_types/educatorAiWorkout';
import type { WorkoutTree } from '@/_types/educatorWorkouts';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useServerAction } from 'zsa-react';

interface RegenerateAiWorkoutButtonProps {
  studentId: string;
  workoutId: string;
}

type PreflightResultTuple = [
  EducatorAiWorkoutConversationTurn | WorkoutTree | null | undefined,
  { message: string } | null | undefined,
];

interface PreflightOutcomeHandlers {
  onOverwriteRequired: () => void;
  onOtherError: (message: string) => void;
  onReady: (tree: WorkoutTree) => void;
  onTurn: (turn: EducatorAiWorkoutConversationTurn) => void;
}

/** Classifies one start-call outcome into the right UI reaction — mirrors
 * `mealPlanAiGenerator.tsx`'s own `handlePreflightResult` exactly, scoped to
 * this feature's own ready-type-guard. */
function handlePreflightResult(
  [result, error]: PreflightResultTuple,
  handlers: PreflightOutcomeHandlers
): void {
  if (error) {
    if (error.message === CONFIRM_OVERWRITE_REQUIRED_MESSAGE) {
      handlers.onOverwriteRequired();
    } else {
      handlers.onOtherError(error.message);
    }
    return;
  }
  if (!result) return;
  if (isGeneratedWorkoutTree(result)) {
    handlers.onReady(result);
    return;
  }
  handlers.onTurn(result);
}

/**
 * Owns the confirm-overwrite retry-on-409 flow (ADR-009) outside the shared,
 * generic conversation layer, mirroring `useMealPlanOverwritePreflight`
 * exactly. Always calls the start action first (never pre-checking draft
 * emptiness client-side); on `confirm_overwrite_required`, flags the
 * confirmation dialog so the caller can retry with `confirmOverwrite: true`.
 * Calls the Server Action directly (not the `studentId`-bound wrapper
 * `ConversationChat` uses below) since only this one call needs `workoutId`/
 * `confirmOverwrite` — every later turn targets the same conversation by id.
 */
function useRegenerateOverwritePreflight(
  studentId: string,
  workoutId: string,
  onReady: (tree: WorkoutTree) => void
) {
  const [initialTurn, setInitialTurn] =
    useState<EducatorAiWorkoutConversationTurn | null>(null);
  const [awaitingOverwriteConfirm, setAwaitingOverwriteConfirm] =
    useState(false);
  const [preflightError, setPreflightError] = useState<string | null>(null);
  const { isPending, execute } = useServerAction(
    postEducatorAiWorkoutConversation
  );

  function reset() {
    setInitialTurn(null);
    setAwaitingOverwriteConfirm(false);
    setPreflightError(null);
  }

  async function start(confirmOverwrite = false) {
    setPreflightError(null);
    const outcome = await execute({ studentId, workoutId, confirmOverwrite });
    handlePreflightResult(outcome, {
      onOverwriteRequired: () => setAwaitingOverwriteConfirm(true),
      onOtherError: setPreflightError,
      onReady,
      onTurn: setInitialTurn,
    });
  }

  return {
    initialTurn,
    awaitingOverwriteConfirm,
    preflightError,
    isPending,
    reset,
    start,
    cancelOverwriteConfirm: () => setAwaitingOverwriteConfirm(false),
    confirmOverwrite: () => {
      setAwaitingOverwriteConfirm(false);
      void start(true);
    },
  };
}

interface OverwriteConfirmDialogProps {
  open: boolean;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Same confirm-overwrite UX `mealPlanAiGenerator.tsx`'s own
 * `OverwriteConfirmDialog` uses, scoped to this feature's own draft. */
function OverwriteConfirmDialog({
  open,
  isPending,
  onCancel,
  onConfirm,
}: OverwriteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={next => !next && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sobrescrever o rascunho atual?</AlertDialogTitle>
          <AlertDialogDescription>
            Este treino foi editado manualmente desde a última geração. A edição
            será substituída pelo novo treino gerado com IA.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={onConfirm}>
            Sobrescrever
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type RegeneratePreflight = ReturnType<typeof useRegenerateOverwritePreflight>;

interface RegenerateIntakeContentProps {
  studentId: string;
  preflight: RegeneratePreflight;
  onReady: (tree: WorkoutTree) => void;
}

/** The dialog's body: preflight status, then the shared chat once the
 * first turn resolves — split out so `RegenerateAiWorkoutButton` itself
 * stays under the function-length cap, mirroring
 * `MealPlanIntakeContent`. */
function RegenerateIntakeContent({
  studentId,
  preflight,
  onReady,
}: RegenerateIntakeContentProps) {
  const action = useCallback(
    (input: { conversationId?: string; answer?: string }) =>
      postEducatorAiWorkoutConversation({ studentId, ...input }),
    [studentId]
  );

  return (
    <>
      {preflight.preflightError && (
        <p className="text-sm text-destructive">{preflight.preflightError}</p>
      )}
      {preflight.isPending && !preflight.initialTurn && (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      )}
      {preflight.initialTurn && (
        <ConversationChat
          action={action}
          isReady={isGeneratedWorkoutTree}
          onReady={onReady}
          title="Vamos montar o treino novamente"
          premiumTitle="Geração com IA requer o plano Premium"
          premiumMessage="Assine o plano Premium para gerar treinos com IA."
          premiumCtaLabel="Ver planos"
          premiumCtaHref="/restrict/settings?tab=plano"
          initialTurn={preflight.initialTurn}
        />
      )}
    </>
  );
}

/**
 * The in-editor "Gerar novamente" entry point: always targets this exact,
 * already-open draft's `workoutId` (ADR-011) — never inferred. Unlike the
 * list-level `GenerateAiWorkoutDialog`, this can 409 (the draft may have
 * been edited since its last generation), so it runs the confirm-overwrite
 * preflight before ever handing control to `ConversationChat`.
 */
export function RegenerateAiWorkoutButton({
  studentId,
  workoutId,
}: RegenerateAiWorkoutButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const onReady = (tree: WorkoutTree) => {
    setOpen(false);
    preflight.reset();
    router.push(workoutEditorHref(studentId, tree.id));
    router.refresh();
  };
  const preflight = useRegenerateOverwritePreflight(
    studentId,
    workoutId,
    onReady
  );

  function onOpenChange(next: boolean) {
    setOpen(next);
    preflight.reset();
    if (next) void preflight.start();
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            Gerar novamente
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerar treino novamente com IA</DialogTitle>
          </DialogHeader>
          <RegenerateIntakeContent
            studentId={studentId}
            preflight={preflight}
            onReady={onReady}
          />
        </DialogContent>
      </Dialog>

      <OverwriteConfirmDialog
        open={preflight.awaitingOverwriteConfirm}
        isPending={preflight.isPending}
        onCancel={() => {
          preflight.cancelOverwriteConfirm();
          setOpen(false);
        }}
        onConfirm={preflight.confirmOverwrite}
      />
    </>
  );
}
