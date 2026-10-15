export interface PainelEducator {
  id: string;
  name: string;
  email: string;
  startedAt: string;
}

export interface PainelActivityItem {
  id: string;
  message: string;
  createdAt: string;
}

export interface PainelResponse {
  educatorCount: number;
  studentCount: number;
  educators: PainelEducator[];
  activity: PainelActivityItem[];
}
