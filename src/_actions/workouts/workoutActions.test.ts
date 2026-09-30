import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { AppError } from '@/_lib/AppError';
import { actionPatchWorkoutExercise } from './patchWorkoutExercise';
import { actionPostConversation } from './postConversation';

const WORKOUT_EXERCISE_ID = '0190aaaa-bbbb-7ccc-8ddd-eeeeffff0000';
const CONVERSATION_ID = '0190aaaa-bbbb-7ccc-8ddd-eeeeffff0001';

function lastCall(): [string, RequestInit] {
  return apiClientMock.mock.calls.at(-1) as [string, RequestInit];
}

beforeEach(() => {
  apiClientMock.mockReset();
  apiClientMock.mockResolvedValue({});
  authMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'user-id' } });
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('actionPostConversation', () => {
  it('starts a new conversation with an empty body', async () => {
    const [, error] = await actionPostConversation({});

    expect(error).toBeNull();
    const [path, init] = lastCall();
    expect(path).toBe('/workouts/conversation');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({});
  });

  it('continues a conversation with the previous answer', async () => {
    await actionPostConversation({
      conversationId: CONVERSATION_ID,
      answer: 'masculino',
    });

    expect(JSON.parse(lastCall()[1].body as string)).toEqual({
      conversationId: CONVERSATION_ID,
      answer: 'masculino',
    });
  });

  it('maps a 402 into the Premium-gate message', async () => {
    apiClientMock.mockRejectedValue(new AppError('nope', 402));

    const [, error] = await actionPostConversation({
      conversationId: CONVERSATION_ID,
      answer: '3',
    });

    expect(error?.message).toBe('Regeneração requer o plano Premium.');
  });

  it('rejects an unauthenticated call before touching the backend', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await actionPostConversation({});

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});

describe('actionPatchWorkoutExercise', () => {
  it('swaps the exercise', async () => {
    await actionPatchWorkoutExercise({
      workoutExerciseId: WORKOUT_EXERCISE_ID,
      exerciseId: WORKOUT_EXERCISE_ID,
    });

    expect(lastCall()[0]).toBe(`/workouts/exercises/${WORKOUT_EXERCISE_ID}`);
    expect(lastCall()[1].method).toBe('PATCH');
    expect(JSON.parse(lastCall()[1].body as string)).toEqual({
      exerciseId: WORKOUT_EXERCISE_ID,
    });
  });

  it('removes the exercise from its day', async () => {
    await actionPatchWorkoutExercise({
      workoutExerciseId: WORKOUT_EXERCISE_ID,
      remove: true,
    });

    expect(JSON.parse(lastCall()[1].body as string)).toEqual({ remove: true });
  });

  it('rejects a non-UUID workoutExerciseId before calling the backend', async () => {
    const [, error] = await actionPatchWorkoutExercise({
      workoutExerciseId: 'not-a-uuid',
    });

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('maps a 400 rejection (contraindicated/empty day/invalid values) to a safe message', async () => {
    apiClientMock.mockRejectedValue(new AppError('nope', 400));

    const [, error] = await actionPatchWorkoutExercise({
      workoutExerciseId: WORKOUT_EXERCISE_ID,
      exerciseId: WORKOUT_EXERCISE_ID,
    });

    expect(error?.message).toBe(
      'Não foi possível salvar esse exercício. Verifique os valores e as restrições cadastradas.'
    );
  });
});
