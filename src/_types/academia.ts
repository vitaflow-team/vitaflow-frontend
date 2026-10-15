export type AcademiaInvitationKind = 'EMPLOYMENT' | 'RECEPTIONIST';
export type AcademiaInvitationStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'CANCELLED';

export interface AcademiaInvitation {
  id: string;
  kind: AcademiaInvitationKind;
  email: string;
  status: AcademiaInvitationStatus;
  createdAt: string;
  academia?: { id: string; name: string };
}

export interface AcademiaEmployment {
  id: string;
  educatorId: string;
  status: 'ACTIVE' | 'ENDED';
  startedAt: string;
  endedAt: string | null;
  educator: { id: string; name: string; email: string };
}

export interface AcademiaStaffMember {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export type AccessPlanValidityType = 'DAYS' | 'VISITS';

export interface AcademiaAccessPlan {
  id: string;
  name: string;
  validityType: AccessPlanValidityType;
  validityValue: number;
  referencePrice: string | number;
  active: boolean;
}

export interface AcademiaStudent {
  id: string;
  name: string;
  email: string;
  professionalId: string | null;
}
