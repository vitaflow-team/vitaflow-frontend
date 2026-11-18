import type { CheckinNotice } from './checkinNotice';

/** `POST /academia/staff/students/:clientId/checkin`. */
export interface ReceptionistCheckInResult {
  id: string;
  createdAt: string;
  notice: CheckinNotice | null;
}
