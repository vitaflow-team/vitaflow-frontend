import type { CheckinNotice } from '@/_types/checkinNotice';

// Deliberately neutral (ADR-005): it names no amount, no number of days and no
// reason, only where to send the student.
const MESSAGES: Record<CheckinNotice, string> = {
  SEE_ADMINISTRATION: 'Oriente o aluno a passar pela administração.',
};

/** The words shown to the receptionist for a notice. */
export function checkinNoticeMessage(notice: CheckinNotice): string {
  return MESSAGES[notice];
}
