import { describe, expect, it, vi } from 'vitest';

// `mealPlanAiGenerator.tsx` imports the real `postMealPlanConversation`
// Server Action, which pulls in `apiClient.ts`'s eager server-env
// validation — mocked here the same way `conversationChat.test.tsx` mocks
// its own action, since this file only exercises the pure `handleMealPlanReady`
// callback wiring and never calls the action itself.
vi.mock('@/_actions/mealPlan/postConversation', () => ({
  postMealPlanConversation: {},
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

import type { MealPlanDraftResponseDTO } from '@/_types/mealPlan';
import { handleMealPlanReady } from './mealPlanAiGenerator';

const DRAFT: MealPlanDraftResponseDTO = { id: 'draft-1', days: [] };

describe('handleMealPlanReady', () => {
  it('UT-031 (happy) on a ready event, closes the dialog, resets its state, and refreshes the draft view — never navigating away', () => {
    const closeDialog = vi.fn();
    const resetState = vi.fn();
    const refresh = vi.fn();

    handleMealPlanReady(DRAFT, { closeDialog, resetState, refresh });

    expect(closeDialog).toHaveBeenCalledTimes(1);
    expect(resetState).toHaveBeenCalledTimes(1);
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
