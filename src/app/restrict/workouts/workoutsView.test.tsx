import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authMock, loadCurrentWorkoutMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  loadCurrentWorkoutMock: vi.fn(),
}));

vi.mock('@/auth', () => ({ auth: authMock }));
vi.mock('@/_lib/workoutData', () => ({
  loadCurrentWorkout: loadCurrentWorkoutMock,
  isLoadFailure: (result: unknown) => typeof result === 'string',
}));
vi.mock('@/_components/layout/defaultLayout', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock('./conversationChat', () => ({
  ConversationChat: ({
    hasExistingWorkout,
  }: {
    hasExistingWorkout: boolean;
  }) => (
    <i
      data-testid="conversation-chat"
      data-has-existing={String(hasExistingWorkout)}
    />
  ),
}));
vi.mock('./generatedWorkoutView', () => ({
  GeneratedWorkoutView: () => <i data-testid="generated-workout-view" />,
}));
vi.mock('./loadFailureNotice', () => ({
  LoadFailureNotice: () => <i data-testid="load-failure-notice" />,
}));

import WorkoutsView from './workoutsView';

function renderPage(params: { gerar?: string } = {}) {
  return WorkoutsView({ searchParams: Promise.resolve(params) });
}

beforeEach(() => {
  vi.clearAllMocks();
  authMock.mockResolvedValue({ user: { id: 'user-1' } });
});

describe('WorkoutsView', () => {
  it('renders nothing without a session', async () => {
    authMock.mockResolvedValue(null);

    expect(await renderPage()).toBeNull();
  });

  it('shows the conversational intake when there is no current workout', async () => {
    loadCurrentWorkoutMock.mockResolvedValue(null);

    const markup = renderToStaticMarkup(await renderPage());

    expect(markup).toContain('data-testid="conversation-chat"');
    expect(markup).toContain('data-has-existing="false"');
  });

  it('shows the generated workout when one exists', async () => {
    loadCurrentWorkoutMock.mockResolvedValue({ id: 'workout-1', days: [] });

    const markup = renderToStaticMarkup(await renderPage());

    expect(markup).toContain('data-testid="generated-workout-view"');
  });

  it('re-enters the conversation with ?gerar=1 even when a workout exists', async () => {
    loadCurrentWorkoutMock.mockResolvedValue({ id: 'workout-1', days: [] });

    const markup = renderToStaticMarkup(await renderPage({ gerar: '1' }));

    expect(markup).toContain('data-testid="conversation-chat"');
    expect(markup).toContain('data-has-existing="true"');
  });

  it('shows a load-failure notice when the backend call fails', async () => {
    loadCurrentWorkoutMock.mockResolvedValue('failed');

    const markup = renderToStaticMarkup(await renderPage());

    expect(markup).toContain('data-testid="load-failure-notice"');
  });
});
