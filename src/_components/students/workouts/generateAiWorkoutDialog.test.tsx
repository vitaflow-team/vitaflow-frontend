import { describe, expect, it, vi } from 'vitest';

// `generateAiWorkoutDialog.tsx` imports the real Server Action, which pulls
// in `apiClient.ts`'s eager server-env validation — mocked here the same
// way `mealPlanAiGenerator.test.tsx` mocks its own action, since this file
// only exercises the effect-independent render and the pure
// `handleAiWorkoutReady` callback, never the action itself.
vi.mock(
  '@/_actions/students/workouts/postEducatorAiWorkoutConversation',
  () => ({
    postEducatorAiWorkoutConversation: {},
  })
);
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

import { renderToStaticMarkup } from 'react-dom/server';
import type { WorkoutTree } from '@/_types/educatorWorkouts';
import {
  GenerateAiWorkoutDialog,
  handleAiWorkoutReady,
} from './generateAiWorkoutDialog';

const TREE: WorkoutTree = {
  id: 'w1',
  title: 'Treino gerado por IA',
  status: 'DRAFT',
  weeklyFrequency: 3,
  updatedAt: new Date().toISOString(),
  sessions: [],
};

describe('GenerateAiWorkoutDialog', () => {
  // UT-021
  it('renders the "Gerar com IA" trigger', () => {
    const html = renderToStaticMarkup(
      <GenerateAiWorkoutDialog studentId="student-1" />
    );

    expect(html).toContain('Gerar com IA');
  });
});

describe('handleAiWorkoutReady', () => {
  it('on a ready result, closes the dialog and opens the fresh draft in the editor', () => {
    const closeDialog = vi.fn();
    const openEditor = vi.fn();

    handleAiWorkoutReady(TREE, { closeDialog, openEditor });

    expect(closeDialog).toHaveBeenCalledTimes(1);
    expect(openEditor).toHaveBeenCalledWith('w1');
  });
});
