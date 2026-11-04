import type { ErrorEvent } from '@sentry/nextjs';
import { describe, expect, it } from 'vitest';
import { sentryScrub } from './sentryScrub';

function baseEvent(request: ErrorEvent['request']): ErrorEvent {
  return { type: undefined, request };
}

describe('sentryScrub — frontend beforeSend (ADR-006, US-006)', () => {
  // UT-025 (boundary): request.data is stripped unconditionally.
  it('strips request.data from an event carrying an arbitrary body', () => {
    const event = baseEvent({
      data: { weightKg: 82, heightCm: 180, anamnese: 'texto clínico' },
    });

    const scrubbed = sentryScrub(event);

    expect(scrubbed.request?.data).toBeUndefined();
  });

  // UT-025 (boundary): request.cookies and request.headers are stripped unconditionally.
  it('strips request.cookies and request.headers from an event carrying both', () => {
    const event = baseEvent({
      cookies: { session: 'abc123' },
      headers: { authorization: 'Bearer secret', 'x-application-secret': 's' },
    });

    const scrubbed = sentryScrub(event);

    expect(scrubbed.request?.cookies).toBeUndefined();
    expect(scrubbed.request?.headers).toBeUndefined();
  });

  // Whole-body stripping, not a selective field-name filter (ADR-006, US-006.EC-1).
  it('drops request.data entirely rather than filtering by field name', () => {
    const event = baseEvent({
      data: { weightKg: 82, note: 'não deveria sobrar nada aqui' },
    });

    const scrubbed = sentryScrub(event);

    expect(scrubbed.request).not.toHaveProperty('data');
  });

  it('leaves an event with no request untouched', () => {
    const event = baseEvent(undefined);

    const scrubbed = sentryScrub(event);

    expect(scrubbed.request).toBeUndefined();
  });
});
