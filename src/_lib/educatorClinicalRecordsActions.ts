import { createFormRecord } from '@/_actions/clinicalRecords/educator/createFormRecord';
import { createTemplate } from '@/_actions/clinicalRecords/educator/createTemplate';
import { discontinueTemplate } from '@/_actions/clinicalRecords/educator/discontinueTemplate';
import { updateFormRecord } from '@/_actions/clinicalRecords/educator/updateFormRecord';
import { updateTemplate } from '@/_actions/clinicalRecords/educator/updateTemplate';
import type { ClinicalRecordsActions } from '@/_types/clinicalRecordsActions';

/** The physical educator's own private students (US-022/US-023) — never an academia's. */
export const EDUCATOR_CLINICAL_RECORDS_ACTIONS: ClinicalRecordsActions = {
  formRecord: { create: createFormRecord, update: updateFormRecord },
  template: {
    create: createTemplate,
    update: updateTemplate,
    discontinue: discontinueTemplate,
  },
};
