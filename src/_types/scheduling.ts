export type SessionType = 'PRESENCIAL' | 'ONLINE';
export type SlotStatus = 'OPEN' | 'BOOKED' | 'CANCELED';

export interface AvailabilityWindow {
  id: string;
  professionalId: string;
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
  sessionDurationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Slot {
  id: string;
  professionalId: string;
  startAt: string;
  endAt: string;
  status: SlotStatus;
  type: SessionType | null;
  onlineLink: string | null;
}

export interface SlotCounterpart {
  id: string;
  name: string;
}

export interface UpcomingSlot extends Slot {
  counterpart: SlotCounterpart;
  /** A booking, or a fixed session of a weekly time (cancel and link act on that one). */
  source?: 'BOOKING' | 'FIXED';
  workoutLetter?: string | null;
  workoutSessionName?: string | null;
}
