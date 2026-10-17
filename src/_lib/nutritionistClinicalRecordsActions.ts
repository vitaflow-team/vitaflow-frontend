import { createFormRecord } from '@/_actions/clinicalRecords/createFormRecord';
import { createTemplate } from '@/_actions/clinicalRecords/createTemplate';
import { discontinueTemplate } from '@/_actions/clinicalRecords/discontinueTemplate';
import { updateFormRecord } from '@/_actions/clinicalRecords/updateFormRecord';
import { updateTemplate } from '@/_actions/clinicalRecords/updateTemplate';
import type { ClinicalRecordsActions } from '@/_types/clinicalRecordsActions';

export const NUTRITIONIST_CLINICAL_RECORDS_ACTIONS: ClinicalRecordsActions = {
  formRecord: { create: createFormRecord, update: updateFormRecord },
  template: {
    create: createTemplate,
    update: updateTemplate,
    discontinue: discontinueTemplate,
  },
};
