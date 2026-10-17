import type { Template, TemplateField } from '@/_types/clinicalRecords';
import type { TemplateFieldDraft } from '@/_types/templateFieldDraft';

export function blankField(): TemplateFieldDraft {
  return {
    key: crypto.randomUUID(),
    label: '',
    fieldType: 'SHORT_TEXT',
    options: [],
    required: false,
    weightRole: false,
    heightRole: false,
  };
}

export function fromTemplateField(field: TemplateField): TemplateFieldDraft {
  return {
    key: crypto.randomUUID(),
    label: field.label,
    fieldType: field.fieldType,
    options: field.options,
    required: field.required,
    weightRole: field.weightRole,
    heightRole: field.heightRole,
  };
}

export function draftsFromTemplate(template: Template): TemplateFieldDraft[] {
  return template.fields.map(fromTemplateField);
}

export function toFieldInput(draft: TemplateFieldDraft) {
  return {
    label: draft.label,
    fieldType: draft.fieldType,
    options: draft.fieldType === 'MULTIPLE_CHOICE' ? draft.options : [],
    required: draft.required,
    weightRole: draft.weightRole,
    heightRole: draft.heightRole,
  };
}
