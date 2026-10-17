import type { createFormRecord } from '@/_actions/clinicalRecords/createFormRecord';
import type { createTemplate } from '@/_actions/clinicalRecords/createTemplate';
import type { discontinueTemplate } from '@/_actions/clinicalRecords/discontinueTemplate';
import type { updateFormRecord } from '@/_actions/clinicalRecords/updateFormRecord';
import type { updateTemplate } from '@/_actions/clinicalRecords/updateTemplate';

/**
 * Every clinical-records caller (nutritionist, physical educator, academia
 * owner/manager) renders the exact same template-editor and form-filling
 * components, but each targets a different backend route family and
 * authorization check (ADR-001/ADR-004/ADR-005). Threading the actions in as
 * a prop, rather than importing them inside the shared components, is what
 * keeps the components themselves genuinely shared across all three.
 *
 * `update` is optional: a context that only ever creates fresh records
 * (academia's direct-assessment flow — US-009's "always a new fill, never a
 * revision" applies there too) can omit it.
 */
export interface FormRecordActions {
  create: typeof createFormRecord;
  update?: typeof updateFormRecord;
}

export interface TemplateActions {
  create: typeof createTemplate;
  update: typeof updateTemplate;
  discontinue: typeof discontinueTemplate;
}

export interface ClinicalRecordsActions {
  formRecord: FormRecordActions;
  template: TemplateActions;
}
