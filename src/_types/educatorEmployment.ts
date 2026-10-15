export interface EducatorAcademiaInvitation {
  id: string;
  createdAt: string;
  academia: { id: string; name: string };
}

export interface EducatorEmployment {
  id: string;
  academiaId: string;
  startedAt: string;
  academia: { id: string; name: string };
}
