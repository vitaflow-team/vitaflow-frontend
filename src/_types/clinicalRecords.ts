export type TemplatePurpose = 'ANAMNESE' | 'ASSESSMENT';

export type FormFieldType =
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'NUMBER'
  | 'YES_NO'
  | 'MULTIPLE_CHOICE';

export interface TemplateField {
  id: string;
  position: number;
  label: string;
  fieldType: FormFieldType;
  options: string[];
  required: boolean;
  weightRole: boolean;
  heightRole: boolean;
}

export interface Template {
  id: string;
  name: string;
  purpose: TemplatePurpose;
  active: boolean;
  fields: TemplateField[];
}

export interface FormRecordValue {
  fieldLabel: string;
  fieldType: FormFieldType;
  value: string | number | boolean | null;
  weightRole: boolean;
  heightRole: boolean;
}

export interface Bmi {
  value: number;
  classification:
    | 'ABAIXO_DO_PESO'
    | 'PESO_NORMAL'
    | 'SOBREPESO'
    | 'OBESIDADE_GRAU_I'
    | 'OBESIDADE_GRAU_II'
    | 'OBESIDADE_GRAU_III';
}

export interface FormRecord {
  id: string;
  recordedAt: string;
  recordedByUserId: string;
  values: FormRecordValue[];
  bmi: Bmi | null;
}
