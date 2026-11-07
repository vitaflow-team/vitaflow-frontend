import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// `ConversationChat` calls `useServerAction(action)` internally, which pulls
// in the action's own server-env validation — the `action` prop passed in
// these tests is a stub object, never actually invoked under
// `renderToStaticMarkup` (its `useEffect`-driven `advance()` never runs
// under static rendering, same as before the relocation).
vi.mock('zsa-react', () => ({
  useServerAction: () => ({ isPending: false, execute: vi.fn() }),
}));

import type { TAnyZodSafeFunctionHandler } from 'zsa';
import { AnswerForm, ConversationChat } from './conversationChat';

/** A stand-in action reference — never actually invoked under
 * `renderToStaticMarkup` (see the `zsa-react` mock above), only used so
 * `ConversationChat`'s generic `action`/`isReady` props type-check. */
const stubAction = {} as unknown as TAnyZodSafeFunctionHandler;

// `ConversationChat` itself mounts via a `useEffect` that never runs under
// `renderToStaticMarkup`, so its state-transition behavior (the
// stale-reprompt fix, the llm_call_failed message, UT-054/UT-056/E2E-006)
// is covered directly by `_lib/conversationFlow.test.ts`'s pure-function
// tests instead (frontend-next.md §11). `AnswerForm` below is the one piece
// of `ConversationChat` that's prop-driven, so it's the one piece whose
// markup this file can assert on.

const noop = () => {};

describe('AnswerForm', () => {
  it('UT-055 renders the "Pular" button only when optional is true', () => {
    const withSkip = renderToStaticMarkup(
      <AnswerForm
        answer=""
        isPending={false}
        optional={true}
        onAnswerChange={noop}
        onSubmit={noop}
        onSkip={noop}
      />
    );
    const withoutSkip = renderToStaticMarkup(
      <AnswerForm
        answer=""
        isPending={false}
        optional={false}
        onAnswerChange={noop}
        onSubmit={noop}
        onSkip={noop}
      />
    );

    expect(withSkip).toContain('Pular');
    expect(withoutSkip).not.toContain('Pular');
  });

  it('always renders "Enviar", regardless of optional', () => {
    const markup = renderToStaticMarkup(
      <AnswerForm
        answer=""
        isPending={false}
        optional={true}
        onAnswerChange={noop}
        onSubmit={noop}
        onSkip={noop}
      />
    );

    expect(markup).toContain('Enviar');
  });

  it('disables both buttons while a request is pending', () => {
    const markup = renderToStaticMarkup(
      <AnswerForm
        answer="algo"
        isPending={true}
        optional={true}
        onAnswerChange={noop}
        onSubmit={noop}
        onSkip={noop}
      />
    );

    // Both the submit and skip buttons carry `disabled=""` right before
    // their own `<button` opening tag; the `<input>` field is disabled
    // too (not asserted here — that's `Input`'s own concern, not
    // `AnswerForm`'s button-disabling logic).
    expect(markup).toMatch(/disabled=""[^>]*>Enviar<\/button>/);
    expect(markup).toMatch(/disabled=""[^>]*>Pular<\/button>/);
  });
});

interface StubReady {
  stubId: string;
}

function isStubReady(result: unknown): result is StubReady {
  return typeof result === 'object' && result !== null && 'stubId' in result;
}

describe('ConversationChat — generalized (ADR-009)', () => {
  it('UT-029 (happy) renders with a workout-shaped config exactly as the pre-generalization component did (pdf-export US-003.EC-1)', () => {
    const html = renderToStaticMarkup(
      <ConversationChat
        action={stubAction}
        isReady={isStubReady}
        onReady={noop}
        title="Vamos montar seu treino"
        premiumTitle="Regeneração requer o plano Premium"
        premiumMessage="Você já gerou um treino com IA. Para gerar um novo, assine o plano Premium."
        premiumCtaLabel="Ver planos"
        premiumCtaHref="/restrict/settings?tab=plano"
      />
    );

    // UT-037 (pdf-export): never renders the AI-workout Exportar PDF link
    // when there is no current workout — still true with no current
    // question/history on first render.
    expect(html).not.toContain('/api/workouts/current/pdf');
    expect(html).not.toContain('Exportar PDF');
    expect(html).toContain('Vamos montar seu treino');
  });

  it("UT-030 (happy) renders with a meal-plan-shaped config, showing that feature's own copy — proving the component is genuinely reusable, not coincidentally workout-shaped", () => {
    // `initialTurn` is seeded via the mount `useEffect`, which (like
    // `advance()`) never runs under `renderToStaticMarkup` — this asserts
    // the initial, effect-independent render respects the meal-plan config
    // (title/premium copy), the same way UT-029 asserts the workout one.
    const html = renderToStaticMarkup(
      <ConversationChat
        action={stubAction}
        isReady={isStubReady}
        onReady={noop}
        title="Vamos montar o plano alimentar"
        premiumTitle="Geração com IA requer o plano Premium"
        premiumMessage="Assine o plano Premium para gerar planos alimentares com IA."
        premiumCtaLabel="Ver planos"
        premiumCtaHref="/restrict/settings?tab=plano"
        initialTurn={{
          conversationId: 'conv-mp-1',
          question: 'Qual é o objetivo do plano?',
          reprompt: false,
          optional: false,
        }}
      />
    );

    expect(html).toContain('Vamos montar o plano alimentar');
    expect(html).not.toContain('treino');
    expect(html).not.toContain('Vamos montar seu treino');
  });
});
