import { describe, expect, it } from 'vitest';
import { createTemplateSchema } from './clinicalRecords';

function baseTemplate(
  overrides: Partial<Parameters<typeof createTemplateSchema.parse>[0]> = {}
) {
  return {
    name: 'Anamnese padrão',
    purpose: 'ANAMNESE' as const,
    fields: [{ label: 'Objetivo', fieldType: 'SHORT_TEXT' as const }],
    ...overrides,
  };
}

describe('createTemplateSchema', () => {
  it('accepts a template with at least one field', () => {
    expect(createTemplateSchema.safeParse(baseTemplate()).success).toBe(true);
  });

  it('rejects a template with no fields (US-003.EC-1)', () => {
    const result = createTemplateSchema.safeParse(baseTemplate({ fields: [] }));
    expect(result.success).toBe(false);
  });

  it('rejects a multiple-choice field with no options (US-003.EC-2)', () => {
    const result = createTemplateSchema.safeParse(
      baseTemplate({
        fields: [
          { label: 'Objetivo', fieldType: 'MULTIPLE_CHOICE', options: [] },
        ],
      })
    );
    expect(result.success).toBe(false);
  });

  it('accepts a multiple-choice field once it has an option', () => {
    const result = createTemplateSchema.safeParse(
      baseTemplate({
        fields: [
          {
            label: 'Objetivo',
            fieldType: 'MULTIPLE_CHOICE',
            options: ['Emagrecer'],
          },
        ],
      })
    );
    expect(result.success).toBe(true);
  });

  it('rejects a blank template name', () => {
    const result = createTemplateSchema.safeParse(baseTemplate({ name: '  ' }));
    expect(result.success).toBe(false);
  });
});
