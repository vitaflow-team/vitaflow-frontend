import type { FixedTimeDraft } from '@/_lib/fixedTimeDraft';

/** A presencial draft at 07:00 for one hour: the form's starting point in tests. */
export const DEFAULT_DRAFT_FOR_TESTS: FixedTimeDraft = {
  weekday: 1,
  start: '07:00',
  durationMinutes: 60,
  type: 'PRESENCIAL',
  onlineLink: '',
  letter: '',
};
