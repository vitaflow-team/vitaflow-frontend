export type ConnectionRequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

// No rating/review field anywhere on this shape (ADR-001) — the public
// profile and search result never carry one.
export interface ProfessionalSummary {
  id: string;
  name: string;
  type: string;
  specialty: string | null;
  priceFrom: number | null;
  attendsOnline: boolean;
}

export interface ProfessionalProfile extends ProfessionalSummary {
  bio: string | null;
}

export interface ConnectionRequest {
  id: string;
  userId: string;
  userName: string;
  professionalId: string;
  professionalName: string;
  status: ConnectionRequestStatus;
  createdAt: string;
  decidedAt: string | null;
}
