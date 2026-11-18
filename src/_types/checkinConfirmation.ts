import type { CheckinNotice } from './checkinNotice';

/** A registered check-in as the receptionist sees it: the time and the neutral notice, if any. */
export interface CheckinConfirmation {
  createdAt: string;
  notice: CheckinNotice | null;
}
