import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// `conversationChat.tsx` imports the real `actionPostConversation` Server
// Action, which pulls in `apiClient.ts`'s eager server-env validation —
// mocked here the same way sibling tests mock their actions (e.g.
// `teamSection.test.tsx`), since this file only exercises the presentational
// `AnswerForm` piece and never calls the action itself.
vi.mock('@/_actions/workouts/postConversation', () => ({
  actionPostConversation: {},
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

import { AnswerForm, ConversationChat } from './conversationChat';

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

// pdf-export UT-037: `ConversationChat` is what renders instead of
// `GeneratedWorkoutView` when there is no current AI workout — it must
// never render that screen's export link (its own `advance()` effect
// never runs under static rendering, but the initial markup still does).
describe('ConversationChat — pdf-export US-003.EC-1', () => {
  it('UT-037 never renders the AI-workout Exportar PDF link when there is no current workout', () => {
    const html = renderToStaticMarkup(
      <ConversationChat hasExistingWorkout={false} />
    );

    expect(html).not.toContain('/api/workouts/current/pdf');
    expect(html).not.toContain('Exportar PDF');
  });
});
