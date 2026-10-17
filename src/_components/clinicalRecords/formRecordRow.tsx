import { formatFieldValue, formatRecordedAt } from '@/_lib/formRecordDisplay';
import type { Bmi } from '@/_types/clinicalRecords';
import { BmiBadge } from './bmiBadge';

// Only the fields this row actually renders — any richer record shape
// (FormRecord, the mirror's own narrower MirrorAssessment) satisfies this
// structurally, so both the professional's and the patient's views share it.
interface DisplayableRecord {
  recordedAt: string;
  bmi: Bmi | null;
  values: { fieldLabel: string; value: string | number | boolean | null }[];
}

interface FormRecordRowProps {
  record: DisplayableRecord;
  onEdit?: () => void;
}

/**
 * One filled record as-is: its own frozen field values, even when the
 * source template changed since (ADR-010) — never re-rendered against the
 * current template.
 */
export function FormRecordRow({ record, onEdit }: FormRecordRowProps) {
  return (
    <li className="flex flex-col gap-2 border-b border-line py-3 last:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">
          {formatRecordedAt(record.recordedAt)}
        </span>
        <div className="flex items-center gap-2">
          <BmiBadge bmi={record.bmi} />
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Editar
            </button>
          )}
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        {record.values.map(value => (
          <div key={value.fieldLabel}>
            <dt className="text-muted-foreground">{value.fieldLabel}</dt>
            <dd>{formatFieldValue(value.value)}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}
