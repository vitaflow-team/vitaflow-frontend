import type { FormRecord } from '@/_types/clinicalRecords';

export type CreateFormRecordOutcome =
  | { outcome: 'created'; record: FormRecord }
  | { outcome: 'declaration_required' };
