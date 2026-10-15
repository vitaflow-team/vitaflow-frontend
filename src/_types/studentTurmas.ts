export interface StudentTurmaItem {
  id: string;
  academiaId: string;
  academiaName: string;
  name: string;
  weekday: number;
  startMinute: number;
  durationMinutes: number;
  capacity: number;
  enrolledCount: number;
  responsibleEducator: { id: string; name: string } | null;
  enrolled: boolean;
}
