import type { ActivationResult } from '@/_types/activationResult';
import { describe, expect, it, vi } from 'vitest';
import {
  activatableIds,
  activateInBatches,
  activationItems,
  chunk,
  mergeActivationResults,
  skipReasonLabel,
} from './bulkActivation';

function ids(count: number, prefix = 'c'): string[] {
  return Array.from({ length: count }, (_, index) => `${prefix}${index}`);
}

function answerAll(): (input: {
  items: { clientId: string }[];
}) => Promise<[ActivationResult, null]> {
  return async ({ items }) => [
    { activated: items.map(item => item.clientId), skipped: [] },
    null,
  ];
}

describe('bulk activation batching', () => {
  it('UT-143 sends 450 selected students as three requests of 200, 200 and 50 and merges the results', async () => {
    const execute = vi.fn(answerAll());

    const outcome = await activateInBatches(
      execute,
      activationItems(ids(450), 10)
    );

    expect(execute.mock.calls.map(([input]) => input.items.length)).toEqual([
      200, 200, 50,
    ]);
    expect(outcome.failure).toBeNull();
    expect(outcome.notSent).toBe(0);
    expect(outcome.result.activated).toHaveLength(450);
    expect(outcome.result.activated.slice(0, 3)).toEqual(['c0', 'c1', 'c2']);
  });

  it('UT-143 keeps the order of the selection across the batches', async () => {
    const execute = vi.fn(answerAll());

    await activateInBatches(execute, activationItems(ids(201), 10));

    expect(execute.mock.calls[0][0].items[199].clientId).toBe('c199');
    expect(execute.mock.calls[1][0].items[0].clientId).toBe('c200');
  });

  it('sends a selection of exactly 200 as one request and an empty one as none', async () => {
    const execute = vi.fn(answerAll());

    await activateInBatches(execute, activationItems(ids(200), 10));
    expect(execute).toHaveBeenCalledTimes(1);

    execute.mockClear();
    const outcome = await activateInBatches(execute, []);
    expect(execute).not.toHaveBeenCalled();
    expect(outcome.result).toEqual({ activated: [], skipped: [] });
  });

  it('merges skipped students of every batch with their reasons', async () => {
    const execute = vi
      .fn()
      .mockResolvedValueOnce([
        {
          activated: ['a'],
          skipped: [{ clientId: 'b', reason: 'tax_id_missing' }],
        },
        null,
      ])
      .mockResolvedValueOnce([
        {
          activated: ['c'],
          skipped: [{ clientId: 'd', reason: 'already_billing' }],
        },
        null,
      ]);

    const outcome = await activateInBatches(
      execute,
      activationItems(ids(201), 10)
    );

    expect(outcome.result.activated).toEqual(['a', 'c']);
    expect(outcome.result.skipped).toEqual([
      { clientId: 'b', reason: 'tax_id_missing' },
      { clientId: 'd', reason: 'already_billing' },
    ]);
  });

  it('stops at a failed batch, keeps what was done and counts what was not sent (US-015.EC-3)', async () => {
    const execute = vi
      .fn()
      .mockResolvedValueOnce([{ activated: ['a'], skipped: [] }, null])
      .mockResolvedValueOnce([null, { message: 'Conecte a conta Asaas' }]);

    const outcome = await activateInBatches(
      execute,
      activationItems(ids(450), 10)
    );

    expect(execute).toHaveBeenCalledTimes(2);
    expect(outcome.result.activated).toEqual(['a']);
    expect(outcome.failure).toBe('Conecte a conta Asaas');
    expect(outcome.notSent).toBe(250);
  });

  it('chunks in order and merges nothing into an empty result', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(mergeActivationResults([])).toEqual({ activated: [], skipped: [] });
  });

  it('uses one due day for the selection and leaves the amount to the plan price', () => {
    expect(activationItems(['a', 'b'], 15)).toEqual([
      { clientId: 'a', dueDay: 15 },
      { clientId: 'b', dueDay: 15 },
    ]);
  });

  it('preselects only the students whose tax ID is on file', () => {
    const students = [
      { clientId: 'a', hasTaxId: true },
      { clientId: 'b', hasTaxId: false },
    ].map(student => ({
      ...student,
      name: student.clientId,
      planName: 'Mensal',
      amountCents: 10000,
    }));

    expect(activatableIds(students)).toEqual(['a']);
  });

  it('names every skip reason in Portuguese', () => {
    expect(skipReasonLabel('tax_id_missing')).toContain('CPF');
    expect(skipReasonLabel('already_billing')).toContain('recorrente');
    expect(skipReasonLabel('no_active_plan')).toContain('plano');
    expect(skipReasonLabel('gateway_failed')).toContain('Asaas');
  });
});
