import { AppError } from '@/_lib/AppError';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock } = vi.hoisted(() => ({ apiClientMock: vi.fn() }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('next/navigation', () => ({ unstable_rethrow: vi.fn() }));

import {
  isLoadFailure,
  loadMyEducatorWorkouts,
  loadStudentsForPicker,
  loadWorkoutList,
  loadWorkoutTree,
} from './educatorWorkoutsData';

const STUDENT = '01890a5d-ac96-774b-bcce-b302099a8057';
const WORKOUT = '01890a5d-ac96-774b-bcce-b302099a8099';

describe('educator workouts loaders', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('asks the list for the archived page, never cached', async () => {
    apiClientMock.mockResolvedValue({ active: null });

    await loadWorkoutList(STUDENT, 3);

    expect(apiClientMock).toHaveBeenCalledWith(
      `/educator/students/${STUDENT}/workouts?archivedPage=3`,
      { method: 'GET', cache: 'no-store' }
    );
  });

  it('reads malformed ids as not found without calling the backend', async () => {
    expect(await loadWorkoutList('../x', 1)).toBe('not-found');
    expect(await loadWorkoutTree(STUDENT, 'nope')).toBe('not-found');
    expect(await loadWorkoutTree('nope', WORKOUT)).toBe('not-found');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('UT-089 reads a 404 as not found and a refusal as forbidden', async () => {
    apiClientMock.mockRejectedValueOnce(new AppError('x', 404));
    apiClientMock.mockRejectedValueOnce(new AppError('x', 403));

    expect(await loadWorkoutList(STUDENT, 1)).toBe('not-found');
    expect(await loadWorkoutTree(STUDENT, WORKOUT)).toBe('forbidden');
  });

  it('reads any other failure as failed and logs only the status', async () => {
    apiClientMock.mockRejectedValue(new AppError('secret detail', 500));

    expect(await loadWorkoutList(STUDENT, 1)).toBe('failed');
    expect(console.error).toHaveBeenCalledWith(expect.any(String), {
      status: 500,
    });
  });

  it('tells a failure apart from a loaded value', () => {
    expect(isLoadFailure('not-found')).toBe(true);
    expect(isLoadFailure({ active: null })).toBe(false);
  });

  it('reads every page of students for the duplicate dialog', async () => {
    const page = (ids: string[], total: number) => ({
      items: ids.map(id => ({ id })),
      total,
    });
    apiClientMock
      .mockResolvedValueOnce(page(['a', 'b'], 3))
      .mockResolvedValueOnce(page(['c'], 3));

    const students = await loadStudentsForPicker();

    expect(students).toEqual([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
    expect(apiClientMock).toHaveBeenNthCalledWith(
      2,
      '/educator/students?page=2',
      { method: 'GET', cache: 'no-store' }
    );
  });

  it('stops asking once every student was read', async () => {
    apiClientMock.mockResolvedValue({ items: [{ id: 'a' }], total: 1 });

    await loadStudentsForPicker();

    expect(apiClientMock).toHaveBeenCalledTimes(1);
  });

  it('returns the student side workouts, or a failure', async () => {
    apiClientMock.mockResolvedValueOnce({
      workouts: [{ workout: { id: 'w' } }],
    });
    expect(await loadMyEducatorWorkouts()).toEqual([{ workout: { id: 'w' } }]);

    apiClientMock.mockRejectedValueOnce(new AppError('x', 500));
    expect(await loadMyEducatorWorkouts()).toBe('failed');
  });
});
