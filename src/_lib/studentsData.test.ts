import { AppError } from '@/_lib/AppError';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock } = vi.hoisted(() => ({ apiClientMock: vi.fn() }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('next/navigation', () => ({ unstable_rethrow: vi.fn() }));

import {
  isLoadFailure,
  loadAssessments,
  loadDeclarationAccepted,
  loadStudent,
  loadStudents,
} from './studentsData';

const ID = '01890a5d-ac96-774b-bcce-b302099a8057';

describe('students loaders', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('asks the list for the search and page, never cached', async () => {
    apiClientMock.mockResolvedValue({ items: [], total: 0 });

    await loadStudents({ search: 'joão', page: 2 });

    expect(apiClientMock).toHaveBeenCalledWith(
      '/educator/students?page=2&search=jo%C3%A3o',
      { method: 'GET', cache: 'no-store' }
    );
  });

  it('UT-167 reads a malformed id as not found without calling the backend', async () => {
    expect(await loadStudent('not-a-uuid')).toBe('not-found');
    expect(await loadAssessments('../x', 1)).toBe('not-found');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('UT-167 reads a 404 as not found and a refusal as forbidden', async () => {
    apiClientMock.mockRejectedValueOnce(new AppError('x', 404));
    apiClientMock.mockRejectedValueOnce(new AppError('x', 403));

    expect(await loadStudent(ID)).toBe('not-found');
    expect(await loadAssessments(ID, 1)).toBe('forbidden');
  });

  it('reads any other failure as failed', async () => {
    apiClientMock.mockRejectedValue(new AppError('boom', 500));

    expect(await loadStudents({ page: 1 })).toBe('failed');
  });

  it('returns the student when found', async () => {
    apiClientMock.mockResolvedValue({ id: ID, name: 'Diego' });

    const student = await loadStudent(ID);

    expect(isLoadFailure(student)).toBe(false);
    expect(student).toMatchObject({ id: ID });
  });

  it('reads the declaration status as a boolean', async () => {
    apiClientMock.mockResolvedValueOnce({ accepted: true });
    apiClientMock.mockResolvedValueOnce({ accepted: false });
    apiClientMock.mockRejectedValueOnce(new AppError('x', 500));

    expect(await loadDeclarationAccepted()).toBe(true);
    expect(await loadDeclarationAccepted()).toBe(false);
    expect(await loadDeclarationAccepted()).toBe('failed');
  });
});
