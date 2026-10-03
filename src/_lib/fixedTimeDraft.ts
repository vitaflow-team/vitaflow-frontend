import {
  FIXED_DURATION_DEFAULT,
  FIXED_WORKOUT_LETTERS,
} from '@/_constants/educatorScheduleLimits';
import { fixedTimeFormSchema } from '@/_schema/educatorSchedule';
import type { FixedTime, ScheduleSessionType } from '@/_types/educatorSchedule';

/** What the form holds while it is typed: text for the time and the link, a letter or ''. */
export interface FixedTimeDraft {
  weekday: number;
  /** `HH:MM`, as the time input gives it. */
  start: string;
  durationMinutes: number;
  type: ScheduleSessionType;
  onlineLink: string;
  letter: string;
}

export const EMPTY_DRAFT: FixedTimeDraft = {
  weekday: 1,
  start: '07:00',
  durationMinutes: FIXED_DURATION_DEFAULT,
  type: 'PRESENCIAL',
  onlineLink: '',
  letter: '',
};

/** Minutes from midnight for `HH:MM`, or NaN when the text is not a time. */
export function parseStart(value: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return Number.NaN;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function draftOf(fixedTime: FixedTime): FixedTimeDraft {
  return {
    weekday: fixedTime.weekday,
    start: `${String(Math.floor(fixedTime.startMinute / 60)).padStart(2, '0')}:${String(fixedTime.startMinute % 60).padStart(2, '0')}`,
    durationMinutes: fixedTime.durationMinutes,
    type: fixedTime.type,
    onlineLink: fixedTime.onlineLink ?? '',
    letter: fixedTime.workoutLetter ?? '',
  };
}

/** The payload the schema and the API read: the link only for online, the letter or null. */
export function payloadOf(draft: FixedTimeDraft) {
  return {
    weekday: draft.weekday,
    startMinute: parseStart(draft.start),
    durationMinutes: draft.durationMinutes,
    type: draft.type,
    onlineLink: draft.type === 'ONLINE' ? draft.onlineLink.trim() : '',
    workoutLetter: draft.letter === '' ? null : draft.letter,
  };
}

/** The payload with the link as the API takes it: a string or null. */
export type FixedTimePayload = Omit<
  ReturnType<typeof payloadOf>,
  'onlineLink'
> & {
  onlineLink: string | null;
};

export type DraftValidation =
  | { ok: true; payload: FixedTimePayload }
  | { ok: false; errors: Record<string, string> };

/** Field messages keyed by the field, or the payload to send. */
export function validateDraft(draft: FixedTimeDraft): DraftValidation {
  const payload = payloadOf(draft);
  const result = fixedTimeFormSchema.safeParse(payload);
  if (result.success) {
    return {
      ok: true,
      payload: { ...payload, onlineLink: payload.onlineLink || null },
    };
  }
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0]);
    if (!(key in errors)) errors[key] = issue.message;
  }
  if (Number.isNaN(payload.startMinute))
    errors.startMinute = 'Escolha um horário.';
  return { ok: false, errors };
}

export function isLetter(value: string): boolean {
  return (FIXED_WORKOUT_LETTERS as readonly string[]).includes(value);
}
