export interface ProfessorListItem {
  id: string;
  name: string | null;
  email: string;
  status: 'ACTIVE' | 'PENDING';
  startedAt: string | null;
  academiaStudentCount: number;
}

export interface ProfessoresList {
  items: ProfessorListItem[];
  total: number;
  page: number;
  pageSize: number;
}
