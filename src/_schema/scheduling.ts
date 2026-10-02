import { z } from 'zod';

export const publishAvailabilitySchema = z.object({
  dayOfWeek: z.coerce.number().int().min(1).max(7),
  startMinute: z.coerce.number().int().min(0).max(1439),
  endMinute: z.coerce.number().int().min(0).max(1439),
  sessionDurationMinutes: z.coerce.number().int().min(5).max(480),
});

export const bookSlotSchema = z.object({
  slotId: z.uuid(),
  type: z.enum(['PRESENCIAL', 'ONLINE']),
});

export const cancelSlotSchema = z.object({
  slotId: z.uuid(),
});

export const setOnlineLinkSchema = z.object({
  slotId: z.uuid(),
  link: z.string().trim().min(1, 'Informe um link.'),
});

export const listOpenSlotsSchema = z.object({
  professionalId: z.uuid(),
  // { offset: true }: the slot picker sends explicit -03:00 (BRT) instants,
  // not UTC — z.iso.datetime() rejects an offset by default.
  from: z.iso.datetime({ offset: true }),
  to: z.iso.datetime({ offset: true }),
});
