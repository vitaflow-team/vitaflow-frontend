import { AppError } from '@/_lib/AppError';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock, fetchPlanClaimsMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
  fetchPlanClaimsMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));
vi.mock('@/_lib/fetchPlanClaims', () => ({
  fetchPlanClaims: fetchPlanClaimsMock,
}));
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  unstable_rethrow: vi.fn(),
}));

import { activateWorkout } from './activateWorkout';
import { checkWorkoutConflicts } from './checkWorkoutConflicts';
import { createWorkout } from './createWorkout';
import { deactivateWorkout } from './deactivateWorkout';
import { deleteWorkout } from './deleteWorkout';
import { duplicateWorkout } from './duplicateWorkout';
import { saveWorkout } from './saveWorkout';
import { searchLibraryExercises } from './searchLibraryExercises';

const STUDENT = '01890a5d-ac96-774b-bcce-b302099a8057';
const WORKOUT = '01890a5d-ac96-774b-bcce-b302099a8099';
const TREE = { id: WORKOUT, title: 'Hipertrofia', sessions: [] };
const SAVE = {
  studentId: STUDENT,
  workoutId: WORKOUT,
  title: 'Hipertrofia',
  sessions: [{ name: 'Peito', exercises: [] }],
};

const ACTIONS = [
  ['createWorkout', () => createWorkout({ studentId: STUDENT, title: 'T' })],
  ['saveWorkout', () => saveWorkout(SAVE)],
  [
    'activateWorkout',
    () => activateWorkout({ studentId: STUDENT, workoutId: WORKOUT }),
  ],
  [
    'deactivateWorkout',
    () => deactivateWorkout({ studentId: STUDENT, workoutId: WORKOUT }),
  ],
  [
    'deleteWorkout',
    () => deleteWorkout({ studentId: STUDENT, workoutId: WORKOUT }),
  ],
  [
    'duplicateWorkout',
    () =>
      duplicateWorkout({
        studentId: STUDENT,
        workoutId: WORKOUT,
        studentIds: [STUDENT],
      }),
  ],
  [
    'checkWorkoutConflicts',
    () => checkWorkoutConflicts({ studentId: STUDENT, exerciseIds: [WORKOUT] }),
  ],
  ['searchLibraryExercises', () => searchLibraryExercises({ q: 'supino' })],
] as const;

describe('educator workout actions', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    fetchPlanClaimsMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'educator-1' } });
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'PHYSICAL_EDUCATOR' });
    apiClientMock.mockResolvedValue(TREE);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it.each(ACTIONS)('%s rejects a caller without a session', async (_, run) => {
    authMock.mockResolvedValue(null);

    const [, error] = await run();

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it.each(ACTIONS)(
    '%s rejects a caller who is not an educator',
    async (_, run) => {
      fetchPlanClaimsMock.mockResolvedValue({ productType: 'NUTRITIONIST' });

      const [, error] = await run();

      expect(error).toBeTruthy();
      expect(apiClientMock).not.toHaveBeenCalled();
    }
  );

  it('UT-089 reports a student gone as a message, not a crash', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('x', 404, 'student_not_found')
    );

    const [, error] = await createWorkout({ studentId: STUDENT, title: 'T' });

    expect(error?.message).toBe('Aluno não encontrado.');
  });

  it('refuses a malformed student id before calling the backend', async () => {
    const [, error] = await createWorkout({
      studentId: '../admin',
      title: 'T',
    });

    expect(error).toBeTruthy();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('creates a draft for the student with the trimmed title', async () => {
    await createWorkout({ studentId: STUDENT, title: '  Força  ' });

    expect(apiClientMock).toHaveBeenCalledWith(
      `/educator/students/${STUDENT}/workouts`,
      { method: 'POST', body: JSON.stringify({ title: 'Força' }) }
    );
  });

  it('UT-100 returns not_found as an outcome when saving for a gone student', async () => {
    apiClientMock.mockRejectedValue(new AppError('x', 404));

    const [result, error] = await saveWorkout(SAVE);

    expect(error).toBeNull();
    expect(result).toEqual({ outcome: 'not_found' });
  });

  it('UT-099 returns active_invalid when the server refuses an invalid active workout', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('x', 422, 'workout_active_invalid')
    );

    const [result] = await saveWorkout(SAVE);

    expect(result).toEqual({ outcome: 'active_invalid' });
  });

  it('UT-095 maps another failure to a safe message without the backend text', async () => {
    apiClientMock.mockRejectedValue(new AppError('SQL syntax error near', 500));

    const [, error] = await saveWorkout(SAVE);

    expect(error).toBeTruthy();
    expect(error?.message).not.toContain('SQL');
  });

  it('sends the whole tree and the saved ids in one request', async () => {
    await saveWorkout(SAVE);

    expect(apiClientMock).toHaveBeenCalledTimes(1);
    const [path, init] = apiClientMock.mock.calls[0];
    expect(path).toBe(`/educator/students/${STUDENT}/workouts/${WORKOUT}`);
    expect(init.method).toBe('PUT');
    expect(JSON.parse(init.body)).toEqual({
      title: 'Hipertrofia',
      sessions: [{ name: 'Peito', exercises: [] }],
    });
  });

  it('UT-112 activates and returns the refused sessions on a 422', async () => {
    apiClientMock.mockResolvedValueOnce(TREE);
    const [activated] = await activateWorkout({
      studentId: STUDENT,
      workoutId: WORKOUT,
    });
    expect(activated).toEqual({ outcome: 'activated', workout: TREE });

    const problems = [
      { code: 'empty_session', sessionLabel: 'B', sessionName: 'Costas' },
    ];
    const refusal = new AppError('x', 422, 'workout_not_activatable');
    refusal.details = problems;
    apiClientMock.mockRejectedValueOnce(refusal);

    const [refused] = await activateWorkout({
      studentId: STUDENT,
      workoutId: WORKOUT,
    });

    expect(refused).toEqual({ outcome: 'not_activatable', problems });
  });

  it('UT-115 shows an error and no outcome when activation fails otherwise', async () => {
    apiClientMock.mockRejectedValue(new AppError('boom', 500));

    const [result, error] = await activateWorkout({
      studentId: STUDENT,
      workoutId: WORKOUT,
    });

    expect(result).toBeNull();
    expect(error).toBeTruthy();
  });

  it('UT-114 treats a 404 on delete as already deleted', async () => {
    apiClientMock.mockRejectedValue(new AppError('x', 404));

    const [, error] = await deleteWorkout({
      studentId: STUDENT,
      workoutId: WORKOUT,
    });

    expect(error).toBeNull();
  });

  it('UT-114 explains that the active workout cannot be deleted', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('x', 409, 'workout_is_active')
    );

    const [, error] = await deleteWorkout({
      studentId: STUDENT,
      workoutId: WORKOUT,
    });

    expect(error?.message).toBe('Desative o treino antes de excluí-lo.');
  });

  it('UT-116 refuses an empty list and more than 20 students', async () => {
    const none = await duplicateWorkout({
      studentId: STUDENT,
      workoutId: WORKOUT,
      studentIds: [],
    });
    const many = await duplicateWorkout({
      studentId: STUDENT,
      workoutId: WORKOUT,
      studentIds: Array.from({ length: 21 }, () => STUDENT),
    });

    expect(none[1]).toBeTruthy();
    expect(many[1]).toBeTruthy();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('UT-118 says that no copies were made when a target is not found', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('x', 404, 'duplicate_targets_invalid')
    );

    const [, error] = await duplicateWorkout({
      studentId: STUDENT,
      workoutId: WORKOUT,
      studentIds: [STUDENT],
    });

    expect(error?.message).toContain('Nenhuma cópia foi criada');
  });

  it('UT-105 sends the search text encoded as plain text', async () => {
    apiClientMock.mockResolvedValue([]);

    await searchLibraryExercises({ q: `50% _x_ "a" <img src=x>` });

    const [path] = apiClientMock.mock.calls[0];
    expect(path).toBe(
      `/exercises?q=${encodeURIComponent(`50% _x_ "a" <img src=x>`)}`
    );
    expect(path).not.toContain('<');
    expect(path).not.toContain('"');
  });

  it('UT-104 turns a failed search into a message', async () => {
    apiClientMock.mockRejectedValue(new AppError('x', 500));

    const [, error] = await searchLibraryExercises({ q: 'supino' });

    expect(error?.message).toBeTruthy();
  });

  it('UT-109 turns a failed conflict check into an error the picker ignores', async () => {
    apiClientMock.mockRejectedValue(new AppError('x', 500));

    const [result, error] = await checkWorkoutConflicts({
      studentId: STUDENT,
      exerciseIds: [WORKOUT],
    });

    expect(result).toBeNull();
    expect(error).toBeTruthy();
  });
});
