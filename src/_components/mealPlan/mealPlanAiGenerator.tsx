'use client';

import { postMealPlanConversation } from '@/_actions/mealPlan/postConversation';
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
import { CONFIRM_OVERWRITE_REQUIRED_MESSAGE } from '@/_lib/mealPlanGenerationErrors';
import {
  isMealPlanDraftResponse,
  type MealPlanConversationTurn,
  type MealPlanDraftResponseDTO,
} from '@/_types/mealPlan';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

interface MealPlanAiGeneratorProps {
  clientId: string;
}

export interface MealPlanReadyCallbacks {
  closeDialog: () => void;
  resetState: () => void;
  refresh: () => void;
}

/**
 * The ready-callback wiring itself, extracted as a pure function so it's
 * directly unit-testable (UT-031) without needing to drive the dialog's
 * effect-based preflight call through a render — the same reasoning that
 * keeps `conversationReducer`/`eventForAdvance` as pure functions separate
 * from `ConversationChat`'s own effect. Closes the intake UI and refreshes
 * the draft view; never navigates away (ADR-004 — this feature never
 * auto-publishes, it only shows the fresh draft in place).
 */
export function handleMealPlanReady(
  draft: MealPlanDraftResponseDTO,
  callbacks: MealPlanReadyCallbacks
): void {
  void draft;
  callbacks.closeDialog();
  callbacks.resetState();
  callbacks.refresh();
}

interface PreflightOutcomeHandlers {
  onOverwriteRequired: () => void;
  onOtherError: (message: string) => void;
  onReady: (draft: MealPlanDraftResponseDTO) => void;
  onTurn: (turn: MealPlanConversationTurn) => void;
}

type PreflightResultTuple = [
  MealPlanConversationTurn | MealPlanDraftResponseDTO | null | undefined,
  { message: string } | null | undefined,
];

/** Classifies one start-call outcome into the right UI reaction — split out
 * so `useMealPlanOverwritePreflight` itself stays under the
 * function-length cap. */
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
  if (isMealPlanDraftResponse(result)) {
    handlers.onReady(result);
    return;
  }
  handlers.onTurn(result);
}

/**
 * Owns the confirm-overwrite retry-on-409 flow (ADR-013) entirely outside
 * the shared, generic conversation layer — that layer has no concept of
 * "overwrite" (meal-plan-specific, ADR-009 keeps it out of the shared
 * layer). Always calls the start action first (never pre-checking draft
 * emptiness client-side); on `confirm_overwrite_required`, flags the
 * confirmation dialog so the caller can retry with `confirmOverwrite: true`.
 */
function useMealPlanOverwritePreflight(
  clientId: string,
  onReady: (draft: MealPlanDraftResponseDTO) => void
) {
  const [initialTurn, setInitialTurn] =
    useState<MealPlanConversationTurn | null>(null);
  const [awaitingOverwriteConfirm, setAwaitingOverwriteConfirm] =
    useState(false);
  const [preflightError, setPreflightError] = useState<string | null>(null);
  const { isPending, execute } = useServerAction(postMealPlanConversation);

  function reset() {
    setInitialTurn(null);
    setAwaitingOverwriteConfirm(false);
    setPreflightError(null);
  }

  async function start(confirmOverwrite = false) {
    setPreflightError(null);
    const outcome = await execute({ clientId, confirmOverwrite });
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

/** Same confirm-overwrite UX `cloneDayDialog.tsx` already uses for its own
 * day-level overwrite (ADR-005/ADR-013), scoped here to the whole draft. */
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
          <AlertDialogTitle>Sobrescrever o plano atual?</AlertDialogTitle>
          <AlertDialogDescription>
            Este plano já tem refeições definidas. Elas serão substituídas pelo
            novo plano gerado com IA.
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

type MealPlanPreflight = ReturnType<typeof useMealPlanOverwritePreflight>;

interface MealPlanIntakeContentProps {
  preflight: MealPlanPreflight;
  onReady: (draft: MealPlanDraftResponseDTO) => void;
}

/** The dialog's body: preflight status, then the shared chat once the
 * first turn resolves — split out so `MealPlanAiGenerator` itself stays
 * under the function-length cap. */
function MealPlanIntakeContent({
  preflight,
  onReady,
}: MealPlanIntakeContentProps) {
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
          action={postMealPlanConversation}
          isReady={isMealPlanDraftResponse}
          onReady={onReady}
          title="Vamos montar o plano alimentar"
          premiumTitle="Geração com IA requer o plano Premium"
          premiumMessage="Assine o plano Premium para gerar planos alimentares com IA."
          premiumCtaLabel="Ver planos"
          premiumCtaHref="/restrict/settings?tab=plano"
          initialTurn={preflight.initialTurn}
        />
      )}
    </>
  );
}

/**
 * This feature's thin configuration of the shared, generalized
 * `ConversationChat` (ADR-009): its own server action, the
 * `MealPlanDraftResponseDTO` ready-type-guard, and a ready-callback that
 * closes the intake and refreshes the draft view — no page navigation
 * (ADR-004). Once `useMealPlanOverwritePreflight` resolves the first turn,
 * it's passed to `ConversationChat` via `initialTurn` — so the real
 * conversation never starts twice.
 */
export function MealPlanAiGenerator({ clientId }: MealPlanAiGeneratorProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const onReady = (draft: MealPlanDraftResponseDTO) =>
    handleMealPlanReady(draft, {
      closeDialog: () => setOpen(false),
      resetState: preflight.reset,
      refresh: () => router.refresh(),
    });
  const preflight = useMealPlanOverwritePreflight(clientId, onReady);

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
            Gerar com IA
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerar plano alimentar com IA</DialogTitle>
          </DialogHeader>
          <MealPlanIntakeContent preflight={preflight} onReady={onReady} />
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
