import { createFormRecord } from '@/_actions/clinicalRecords/academia/createFormRecord';
import { createTemplate } from '@/_actions/clinicalRecords/academia/createTemplate';
import { discontinueTemplate } from '@/_actions/clinicalRecords/academia/discontinueTemplate';
import { updateTemplate } from '@/_actions/clinicalRecords/academia/updateTemplate';
import type { ClinicalRecordsActions } from '@/_types/clinicalRecordsActions';

/**
 * The academia owner/manager's own catalog and direct-assessment actions
 * (ADR-004/ADR-005). No `formRecord.update`: an avaliação is always a fresh
 * record here too (US-009), never revised in place.
 */
export const ACADEMIA_CLINICAL_RECORDS_ACTIONS: ClinicalRecordsActions = {
  formRecord: { create: createFormRecord },
  template: {
    create: createTemplate,
    update: updateTemplate,
    discontinue: discontinueTemplate,
  },
};
