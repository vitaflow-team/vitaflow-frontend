export interface AcademiaStudentListItem {
  id: string;
  name: string;
  email: string;
  assignedEducator: { id: string; name: string } | null;
  nextSession: { startAt: string; type: 'PRESENCIAL' | 'ONLINE' } | null;
}

export interface AcademiaAlunosList {
  items: AcademiaStudentListItem[];
  total: number;
  page: number;
  pageSize: number;
}
