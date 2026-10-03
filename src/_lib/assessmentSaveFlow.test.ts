import type { AssessmentFormData } from '@/_schema/assessment';
import { describe, expect, it, vi } from 'vitest';
import {
  performSave,
  shouldSubmit,
  type AssessmentRequests,
} from './assessmentSaveFlow';

const VALUES: AssessmentFormData = {
  assessedOn: '2026-09-15',
  weightKg: 78.2,
  heightCm: 179,
};

function requests(overrides: Partial<AssessmentRequests> = {}) {
  return {
    replace: vi.fn().mockResolvedValue([{}, null]),
    add: vi.fn().mockResolvedValue([{ outcome: 'saved' }, null]),
    ...overrides,
  } as AssessmentRequests & {
    replace: ReturnType<typeof vi.fn>;
    add: ReturnType<typeof vi.fn>;
  };
}

describe('assessment save flow', () => {
  it('UT-134 sends the parsed number of a decimal-comma input', async () => {
    const api = requests();

    const step = await performSave({
      declarationAccepted: true,
      values: { ...VALUES, weightKg: 78.2 },
      acceptNow: false,
      requests: api,
    });

    expect(step).toEqual({ kind: 'saved' });
    expect(api.add).toHaveBeenCalledWith(
      expect.objectContaining({ weightKg: 78.2 }),
      false
    );
  });

  it('UT-140 asks for the declaration when the backend answers declaration_required', async () => {
    const api = requests({
      add: vi
        .fn()
        .mockResolvedValue([{ outcome: 'declaration_required' }, null]),
    });

    const step = await performSave({
      declarationAccepted: true,
      values: VALUES,
      acceptNow: false,
      requests: api,
    });

    expect(step).toEqual({ kind: 'declaration' });
  });

  it('UT-140 asks for the declaration without a request when it is known to be missing', async () => {
    const api = requests();

    const step = await performSave({
      declarationAccepted: false,
      values: VALUES,
      acceptNow: false,
      requests: api,
    });

    expect(step).toEqual({ kind: 'declaration' });
    expect(api.add).not.toHaveBeenCalled();
  });

  it('UT-140 accepting sends the same values again with acceptDeclaration', async () => {
    const api = requests();

    const step = await performSave({
      declarationAccepted: false,
      values: VALUES,
      acceptNow: true,
      requests: api,
    });

    expect(step).toEqual({ kind: 'saved' });
    expect(api.add).toHaveBeenCalledWith(VALUES, true);
  });

  it('UT-137 reports a failed save with its message', async () => {
    const api = requests({
      add: vi
        .fn()
        .mockResolvedValue([null, { message: 'Verifique os dados.' }]),
    });

    const step = await performSave({
      declarationAccepted: true,
      values: VALUES,
      acceptNow: false,
      requests: api,
    });

    expect(step).toEqual({ kind: 'failed', message: 'Verifique os dados.' });
  });

  it('UT-144 an edit replaces the assessment and never asks for the declaration', async () => {
    const api = requests();

    const step = await performSave({
      existing: { id: 'a1' },
      declarationAccepted: false,
      values: VALUES,
      acceptNow: false,
      requests: api,
    });

    expect(step).toEqual({ kind: 'saved' });
    expect(api.replace).toHaveBeenCalledWith('a1', VALUES);
    expect(api.add).not.toHaveBeenCalled();
  });

  it('reports a failed edit with its message', async () => {
    const api = requests({
      replace: vi
        .fn()
        .mockResolvedValue([null, { message: 'Não encontrada.' }]),
    });

    expect(
      await performSave({
        existing: { id: 'a1' },
        declarationAccepted: true,
        values: VALUES,
        acceptNow: false,
        requests: api,
      })
    ).toEqual({ kind: 'failed', message: 'Não encontrada.' });
  });

  it('UT-136 drops a second submit while one is in flight', () => {
    expect(shouldSubmit(true)).toBe(false);
    expect(shouldSubmit(false)).toBe(true);
  });
});
