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

import { AnswerForm } from './conversationChat';

// `ConversationChat` itself mounts via a `useEffect` that never runs under
// `renderToStaticMarkup`, so its state-transition behavior (the
// stale-reprompt fix, the llm_call_failed message, UT-054/UT-056/E2E-006)
// is covered directly by `_lib/conversationAdvance.test.ts`'s pure-function
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
