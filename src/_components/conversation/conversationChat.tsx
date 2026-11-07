'use client';

import { Button } from '@/_components/ui/button';
import { Card, CardContent } from '@/_components/ui/card';
import { Input } from '@/_components/ui/input';
import { Title } from '@/_components/ui/title';
import {
  conversationReducer,
  eventForAdvance,
  INITIAL_CONVERSATION_STATE,
  type ConversationEvent,
  type ConversationState,
  type ConversationTurnLike,
} from '@/_lib/conversationFlow';
import Link from 'next/link';
import { useEffect, useReducer, useRef } from 'react';
import { useServerAction } from 'zsa-react';
import type {
  TAnyZodSafeFunctionHandler,
  inferServerActionReturnData,
} from 'zsa';

export interface AnswerFormProps {
  answer: string;
  isPending: boolean;
  optional: boolean;
  onAnswerChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onSkip: () => void;
}

/** Presentational and prop-driven (no internal state) so the "Pular"
 * affordance's conditional rendering is directly unit-testable with
 * `renderToStaticMarkup` (frontend-next.md §11) — `ConversationChat`
 * itself can't be, since its state only changes via the effect-driven
 * `advance()` call, which never runs under static server rendering. */
export function AnswerForm({
  answer,
  isPending,
  optional,
  onAnswerChange,
  onSubmit,
  onSkip,
}: AnswerFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        aria-label="Sua resposta"
        value={answer}
        onChange={event => onAnswerChange(event.target.value)}
        disabled={isPending}
        autoFocus
      />
      <Button type="submit" disabled={isPending || !answer.trim()}>
        Enviar
      </Button>
      {optional && (
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onSkip}
        >
          Pular
        </Button>
      )}
    </form>
  );
}

interface PremiumCardProps {
  title: string;
  message: string;
  ctaLabel: string;
  ctaHref: string;
}

/** The Premium-gate terminal state — shared because Premium detection
 * itself is shared infrastructure (ADR-009), copy/link are per feature. */
function PremiumCard({ title, message, ctaLabel, ctaHref }: PremiumCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <Title label={title} />
        <p className="text-muted-foreground max-w-md">{message}</p>
        <Button asChild>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

interface ConversationTranscriptProps {
  state: ConversationState;
}

/** The chat-bubble history plus the current question/reprompt/error — the
 * part of the intake that only ever reads `state`, split out so
 * `ConversationChat` itself stays under the function-length cap. */
function ConversationTranscript({ state }: ConversationTranscriptProps) {
  return (
    <div className="flex flex-col gap-2">
      {state.history.map((turn, index) => (
        <div key={index} className="flex flex-col gap-1">
          <p className="rounded-lg bg-secondary px-4 py-2 w-fit max-w-[80%]">
            {turn.question}
          </p>
          <p className="rounded-lg bg-primary text-primary-foreground px-4 py-2 w-fit max-w-[80%] self-end">
            {turn.answer ? (
              turn.answer
            ) : (
              <span className="italic text-primary-foreground/70">Pulado</span>
            )}
          </p>
        </div>
      ))}
      {state.currentQuestion && (
        <p className="rounded-lg bg-secondary px-4 py-2 w-fit max-w-[80%]">
          {state.currentQuestion}
        </p>
      )}
      {state.reprompt && (
        <p className="text-sm text-destructive">
          Não entendi, pode responder de outra forma?
        </p>
      )}
      {state.loadError && (
        <p className="text-sm text-destructive">{state.loadError}</p>
      )}
    </div>
  );
}

export interface ConversationChatConfig<
  TServerAction extends TAnyZodSafeFunctionHandler,
  TReady extends inferServerActionReturnData<TServerAction>,
> {
  /** The zsa server action driving the intake — called with
   * `{conversationId?, answer?}` (plus whatever extra fields the feature's
   * own input schema requires); must resolve to either a turn shaped like
   * `ConversationTurnLike` or the feature's own `TReady` result. */
  action: TServerAction;
  /** Distinguishes a finished "ready" result from a plain intake turn —
   * each feature owns this distinction (ADR-009). */
  isReady: (
    result: inferServerActionReturnData<TServerAction>
  ) => result is TReady;
  /** Each feature decides its own navigation/refresh behavior once the
   * intake completes — this component never hardcodes it. */
  onReady: (result: TReady) => void;
  title: string;
  premiumTitle: string;
  premiumMessage: string;
  premiumCtaLabel: string;
  premiumCtaHref: string;
  /** When the caller already resolved the first turn itself (e.g. a
   * confirm-overwrite preflight that isn't this component's concern), it
   * seeds the chat with that turn instead of firing the usual empty-input
   * start call on mount. Workout never passes this. */
  initialTurn?: ConversationTurnLike;
}

type AdvanceResultTuple<TReady> = [
  (ConversationTurnLike | TReady) | null | undefined,
  { message: string; code?: string } | null | undefined,
];

/** zsa-react's `execute` type spreads its args conditionally on whether the
 * action's input is `FormData`/`undefined` — never the case for any
 * conversation action here, so every call goes through this simpler,
 * equivalent shape instead of fighting that conditional type. */
function toCallAction<TReady>(
  execute: unknown
): (input: Record<string, unknown>) => Promise<AdvanceResultTuple<TReady>> {
  return execute as (
    input: Record<string, unknown>
  ) => Promise<AdvanceResultTuple<TReady>>;
}

interface UseConversationAdvanceConfig<
  TServerAction extends TAnyZodSafeFunctionHandler,
  TReady extends inferServerActionReturnData<TServerAction>,
> {
  action: TServerAction;
  isReady: (
    result: inferServerActionReturnData<TServerAction>
  ) => result is TReady;
  onReady: (result: TReady) => void;
  initialTurn: ConversationTurnLike | undefined;
}

type Advance = (input: {
  conversationId?: string;
  answer?: string;
}) => Promise<void>;

/** The `submit`/`skip` form handlers, built from the current `state` and
 * the shared `advance` call — split out so `useConversationAdvance` itself
 * stays under the function-length cap. */
function buildFormHandlers(state: ConversationState, advance: Advance) {
  return {
    submit: async (event: React.FormEvent) => {
      event.preventDefault();
      if (!state.answer.trim()) return;
      await advance({
        conversationId: state.conversationId,
        answer: state.answer,
      });
    },
    skip: async () => {
      await advance({ conversationId: state.conversationId, answer: '' });
    },
  };
}

/** Fires exactly once on mount: seeds the chat from `initialTurn` when the
 * caller already resolved it, otherwise fires the usual empty-input start
 * call — split out of `useConversationAdvance` so that hook itself stays
 * under the function-length cap. */
function useStartOnMount(
  initialTurn: ConversationTurnLike | undefined,
  dispatch: (event: ConversationEvent) => void,
  advance: Advance
) {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (initialTurn) {
      dispatch({ type: 'question-received', ...initialTurn });
      return;
    }
    void advance({});
    // Deliberately runs once on mount only, matching the
    // pre-generalization component's own effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Owns the reducer, the server action call, and the mount/submit/skip
 * transitions — split out of `ConversationChat` so that component stays a
 * thin render, under the function-length cap. */
function useConversationAdvance<
  TServerAction extends TAnyZodSafeFunctionHandler,
  TReady extends inferServerActionReturnData<TServerAction>,
>({
  action,
  isReady,
  onReady,
  initialTurn,
}: UseConversationAdvanceConfig<TServerAction, TReady>) {
  const [state, dispatch] = useReducer(
    conversationReducer,
    INITIAL_CONVERSATION_STATE
  );
  const { isPending, execute } = useServerAction(action);
  const callAction = toCallAction<TReady>(execute);

  const advance: Advance = async input => {
    dispatch({ type: 'advance-started' });
    const [result, error] = await callAction(input);
    const event = eventForAdvance<TReady>({
      result: result ?? undefined,
      error: error ?? undefined,
      previousAnswer: input.answer,
      isReady: isReady as (
        result: ConversationTurnLike | TReady
      ) => result is TReady,
    });

    if (event.type === 'ready') {
      onReady(event.result);
      return;
    }
    dispatch(event);
  };

  useStartOnMount(initialTurn, dispatch, advance);

  return {
    state,
    isPending,
    onAnswerChange: (value: string) =>
      dispatch({ type: 'answer-changed', value }),
    ...buildFormHandlers(state, advance),
  };
}

/** The conversational intake (US-001/US-002 for workouts; meal-plan's own
 * equivalent), generalized over the server action, the "ready" result type,
 * and copy/labels (ADR-009) — previously hardcoded to the workout generator
 * at `app/restrict/workouts/conversationChat.tsx`. State-transition
 * decisions live in `conversationReducer`/`eventForAdvance`
 * (`_lib/conversationFlow.ts`), pure functions, so they're unit tested
 * directly (frontend-next.md §11). */
export function ConversationChat<
  TServerAction extends TAnyZodSafeFunctionHandler,
  TReady extends inferServerActionReturnData<TServerAction>,
>({
  action,
  isReady,
  onReady,
  title,
  premiumTitle,
  premiumMessage,
  premiumCtaLabel,
  premiumCtaHref,
  initialTurn,
}: ConversationChatConfig<TServerAction, TReady>) {
  const { state, isPending, onAnswerChange, submit, skip } =
    useConversationAdvance({ action, isReady, onReady, initialTurn });

  if (state.premiumRequired) {
    return (
      <PremiumCard
        title={premiumTitle}
        message={premiumMessage}
        ctaLabel={premiumCtaLabel}
        ctaHref={premiumCtaHref}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Title label={title} />
      <ConversationTranscript state={state} />
      {state.currentQuestion && (
        <AnswerForm
          key={state.turn}
          answer={state.answer}
          isPending={isPending}
          optional={state.optional}
          onAnswerChange={onAnswerChange}
          onSubmit={event => void submit(event)}
          onSkip={() => void skip()}
        />
      )}
    </div>
  );
}
