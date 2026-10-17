import type { FormRecord } from '@/_types/clinicalRecords';
import { FormRecordRow } from './formRecordRow';

interface FormRecordHistoryProps {
  records: FormRecord[];
  emptyMessage: string;
  onEditRecord?: (record: FormRecord) => void;
}

/**
 * Every record ever filled, newest first — the full, unbounded history
 * (never capped), per US-011/US-019.
 */
export function FormRecordHistory({
  records,
  emptyMessage,
  onEditRecord,
}: FormRecordHistoryProps) {
  if (records.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <ul aria-label="Histórico" className="flex flex-col">
      {records.map(record => (
        <FormRecordRow
          key={record.id}
          record={record}
          onEdit={onEditRecord ? () => onEditRecord(record) : undefined}
        />
      ))}
    </ul>
  );
}
