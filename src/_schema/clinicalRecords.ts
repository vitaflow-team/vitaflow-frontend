import { z } from 'zod';

export const FIELD_TYPES = [
  'SHORT_TEXT',
  'LONG_TEXT',
  'NUMBER',
  'YES_NO',
  'MULTIPLE_CHOICE',
] as const;

const templateFieldSchema = z
  .object({
    label: z.string().trim().min(1, 'O rótulo do campo é obrigatório.'),
    fieldType: z.enum(FIELD_TYPES),
    options: z.array(z.string().trim().min(1)).default([]),
    required: z.boolean().default(false),
    weightRole: z.boolean().default(false),
    heightRole: z.boolean().default(false),
  })
  .refine(
    field => field.fieldType !== 'MULTIPLE_CHOICE' || field.options.length > 0,
    {
      message: 'Um campo de múltipla escolha precisa de pelo menos uma opção.',
      path: ['options'],
    }
  );

export const createTemplateSchema = z.object({
  name: z.string().trim().min(1, 'O nome do modelo é obrigatório.'),
  purpose: z.enum(['ANAMNESE', 'ASSESSMENT']),
  fields: z
    .array(templateFieldSchema)
    .min(1, 'Adicione pelo menos um campo ao modelo.'),
});

export const updateTemplateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  fields: z.array(templateFieldSchema).min(1).optional(),
});

export type CreateTemplateData = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateData = z.infer<typeof updateTemplateSchema>;
export type TemplateFieldData = z.infer<typeof templateFieldSchema>;

export const discontinueTemplateSchema = z.object({ id: z.uuid() });

export const formRecordValueInputSchema = z.object({
  templateFieldId: z.uuid(),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

export const createFormRecordSchema = z.object({
  clientId: z.uuid(),
  templateId: z.uuid(),
  values: z.array(formRecordValueInputSchema),
  acceptDeclaration: z.boolean().optional(),
});

export const updateFormRecordSchema = z.object({
  clientId: z.uuid(),
  recordId: z.uuid(),
  values: z.array(formRecordValueInputSchema).min(1),
});
