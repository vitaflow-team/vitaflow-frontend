export interface TurmaAgendaItem {
  id: string;
  name: string;
  weekday: number;
  startMinute: number;
  durationMinutes: number;
  capacity: number;
  enrolledCount: number;
  responsibleEducator: { id: string; name: string } | null;
}
