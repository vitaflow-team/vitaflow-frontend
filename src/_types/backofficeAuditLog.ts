export interface AuditLogEntry {
  id: string;
  staffName: string;
  staffEmail: string;
  targetName: string | null;
  targetEmail: string | null;
  reason: string;
  startedAt: string;
  endedAt: string | null;
}

export interface AuditLogListResult {
  items: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
}
