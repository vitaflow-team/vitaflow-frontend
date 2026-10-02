import { describe, expect, it } from 'vitest';
import { listOpenSlotsSchema, publishAvailabilitySchema } from './scheduling';

describe('listOpenSlotsSchema', () => {
  // The slot picker sends explicit BRT-offset instants (slotPicker.tsx's
  // brtDayRange), never bare UTC 'Z' timestamps — z.iso.datetime() rejects
  // an offset unless { offset: true } is set.
  it('accepts an explicit -03:00 (BRT) offset timestamp', () => {
    const result = listOpenSlotsSchema.safeParse({
      professionalId: '01a0f940-0e62-7a52-9a95-3f5a0b8bc909',
      from: '2026-10-05T00:00:00-03:00',
      to: '2026-10-05T23:59:59-03:00',
    });
    expect(result.success).toBe(true);
  });

  it('still accepts a plain UTC timestamp', () => {
    const result = listOpenSlotsSchema.safeParse({
      professionalId: '01a0f940-0e62-7a52-9a95-3f5a0b8bc909',
      from: '2026-10-05T00:00:00Z',
      to: '2026-10-05T23:59:59Z',
    });
    expect(result.success).toBe(true);
  });
});

describe('publishAvailabilitySchema', () => {
  it('coerces numeric form-field strings', () => {
    const result = publishAvailabilitySchema.safeParse({
      dayOfWeek: '1',
      startMinute: '540',
      endMinute: '720',
      sessionDurationMinutes: '45',
    });
    expect(result.success).toBe(true);
  });
});
