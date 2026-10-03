import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authMock, loadCurrentWorkoutMock, loadMyEducatorWorkoutsMock } =
  vi.hoisted(() => ({
    authMock: vi.fn(),
    loadCurrentWorkoutMock: vi.fn(),
    loadMyEducatorWorkoutsMock: vi.fn(),
  }));

vi.mock('@/auth', () => ({ auth: authMock }));
vi.mock('@/_lib/workoutData', () => ({
  loadCurrentWorkout: loadCurrentWorkoutMock,
  isLoadFailure: (result: unknown) => typeof result === 'string',
}));
vi.mock('@/_lib/educatorWorkoutsData', () => ({
  loadMyEducatorWorkouts: loadMyEducatorWorkoutsMock,
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

function renderPage(params: { gerar?: string; plano?: string } = {}) {
  return WorkoutsView({ searchParams: Promise.resolve(params) });
}

beforeEach(() => {
  vi.clearAllMocks();
  authMock.mockResolvedValue({ user: { id: 'user-1' } });
  loadMyEducatorWorkoutsMock.mockResolvedValue([]);
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

function educatorWorkout(id: string, name: string, title: string) {
  return {
    educator: { id, name },
    workout: {
      id: `w-${id}`,
      title,
      weeklyFrequency: 4,
      updatedAt: '2026-10-01T10:00:00.000Z',
      sessions: [
        {
          id: `s-${id}`,
          label: 'A',
          name: 'Peito',
          exercises: [
            {
              name: 'Supino reto',
              muscleGroup: 'Peito',
              sets: 4,
              reps: '8-10',
              load: null,
              videoUrl: null,
            },
          ],
        },
      ],
    },
  };
}

const AI_WORKOUT = { id: 'workout-1', days: [] };

describe('WorkoutsView with educator workouts', () => {
  it('UT-121 shows a switch with the educator workout first and selected', async () => {
    loadCurrentWorkoutMock.mockResolvedValue(AI_WORKOUT);
    loadMyEducatorWorkoutsMock.mockResolvedValue([
      educatorWorkout('e1', 'Thiago Ramos', 'Hipertrofia'),
    ]);

    const markup = renderToStaticMarkup(await renderPage());

    expect(markup).toContain('aria-label="Escolha o treino"');
    expect(markup.indexOf('Treino de Thiago Ramos')).toBeLessThan(
      markup.indexOf('Treino com IA')
    );
    expect(markup).toContain('Hipertrofia');
    expect(markup).not.toContain('data-testid="generated-workout-view"');
    expect(markup).toMatch(/aria-current="page"[^>]*>Treino de Thiago Ramos/);
  });

  it('UT-121 selects the AI workout with ?plano=ia and the educator one with ?plano=educador', async () => {
    loadCurrentWorkoutMock.mockResolvedValue(AI_WORKOUT);
    loadMyEducatorWorkoutsMock.mockResolvedValue([
      educatorWorkout('e1', 'Thiago Ramos', 'Hipertrofia'),
    ]);

    const ai = renderToStaticMarkup(await renderPage({ plano: 'ia' }));
    const educator = renderToStaticMarkup(
      await renderPage({ plano: 'educador' })
    );

    expect(ai).toContain('data-testid="generated-workout-view"');
    expect(ai).not.toContain('Hipertrofia');
    expect(ai).toMatch(/aria-current="page"[^>]*>Treino com IA/);
    expect(educator).toContain('Hipertrofia');
    expect(educator).not.toContain('data-testid="generated-workout-view"');
  });

  it('UT-122 shows the only educator workout directly, with no switch', async () => {
    loadCurrentWorkoutMock.mockResolvedValue(null);
    loadMyEducatorWorkoutsMock.mockResolvedValue([
      educatorWorkout('e1', 'Thiago Ramos', 'Hipertrofia'),
    ]);

    const markup = renderToStaticMarkup(await renderPage());

    expect(markup).toContain('Hipertrofia');
    expect(markup).not.toContain('Escolha o treino');
    expect(markup).not.toContain('data-testid="conversation-chat"');
  });

  it('UT-122 shows the AI workout directly, with no switch, when there is no educator workout', async () => {
    loadCurrentWorkoutMock.mockResolvedValue(AI_WORKOUT);

    const markup = renderToStaticMarkup(
      await renderPage({ plano: 'educador' })
    );

    expect(markup).toBe('<i data-testid="generated-workout-view"></i>');
  });

  it('UT-122 falls back to the AI workout once the educator workout is gone, even for ?plano=educador', async () => {
    loadCurrentWorkoutMock.mockResolvedValue(AI_WORKOUT);
    loadMyEducatorWorkoutsMock.mockResolvedValue([]);

    const markup = renderToStaticMarkup(
      await renderPage({ plano: 'educador' })
    );

    expect(markup).toContain('data-testid="generated-workout-view"');
    expect(markup).not.toContain('Escolha o treino');
  });

  it('UT-125 lists both educators, each labeled, and selects the second by its key', async () => {
    loadCurrentWorkoutMock.mockResolvedValue(null);
    loadMyEducatorWorkoutsMock.mockResolvedValue([
      educatorWorkout('e1', 'Thiago Ramos', 'Hipertrofia'),
      educatorWorkout('e2', 'Marina Costa', 'Funcional'),
    ]);

    const first = renderToStaticMarkup(await renderPage());
    const second = renderToStaticMarkup(
      await renderPage({ plano: 'educador-e2' })
    );

    expect(first).toContain('Treino de Thiago Ramos');
    expect(first).toContain('Treino de Marina Costa');
    expect(first).toContain('Hipertrofia');
    expect(second).toContain('Funcional');
    expect(second).not.toContain('Hipertrofia');
  });

  it('UT-127 keeps the regeneration entry working: ?gerar=1 opens the conversation even with an educator workout', async () => {
    loadCurrentWorkoutMock.mockResolvedValue(AI_WORKOUT);
    loadMyEducatorWorkoutsMock.mockResolvedValue([
      educatorWorkout('e1', 'Thiago Ramos', 'Hipertrofia'),
    ]);

    const markup = renderToStaticMarkup(await renderPage({ gerar: '1' }));

    expect(markup).toContain('data-testid="conversation-chat"');
    expect(markup).toContain('data-has-existing="true"');
    expect(markup).not.toContain('Hipertrofia');
  });

  it('UT-130 renders exactly as before for a user with no educator workout', async () => {
    loadCurrentWorkoutMock.mockResolvedValue(null);

    const none = renderToStaticMarkup(await renderPage());
    expect(none).toBe(
      '<i data-testid="conversation-chat" data-has-existing="false"></i>'
    );

    loadMyEducatorWorkoutsMock.mockResolvedValue('failed');
    const unreadable = renderToStaticMarkup(await renderPage());
    expect(unreadable).toBe(none);
  });

  it('keeps the AI load-failure notice when only the AI read fails and there is no educator workout', async () => {
    loadCurrentWorkoutMock.mockResolvedValue('failed');

    const markup = renderToStaticMarkup(await renderPage());

    expect(markup).toContain('data-testid="load-failure-notice"');
  });

  it('shows the educator workout even when the AI read fails', async () => {
    loadCurrentWorkoutMock.mockResolvedValue('failed');
    loadMyEducatorWorkoutsMock.mockResolvedValue([
      educatorWorkout('e1', 'Thiago Ramos', 'Hipertrofia'),
    ]);

    const markup = renderToStaticMarkup(await renderPage());

    expect(markup).toContain('Hipertrofia');
    expect(markup).not.toContain('data-testid="load-failure-notice"');
  });
});
