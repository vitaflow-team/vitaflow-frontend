import type { FormFieldType } from '@/_types/clinicalRecords';

/** A field being authored in the template editor; no server id until saved. */
export interface TemplateFieldDraft {
  key: string;
  label: string;
  fieldType: FormFieldType;
  options: string[];
  required: boolean;
  weightRole: boolean;
  heightRole: boolean;
}
