import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { TemplateField } from '@/_types/clinicalRecords';
import { DynamicFieldInput } from './dynamicFieldInput';

function field(overrides: Partial<TemplateField> = {}): TemplateField {
  return {
    id: 'field-1',
    position: 0,
    label: 'Peso',
    fieldType: 'SHORT_TEXT',
    options: [],
    required: true,
    weightRole: false,
    heightRole: false,
    ...overrides,
  };
}

describe('DynamicFieldInput', () => {
  it('renders a text input for SHORT_TEXT', () => {
    const html = renderToStaticMarkup(
      <DynamicFieldInput
        field={field()}
        value={undefined}
        onChange={vi.fn()}
        disabled={false}
      />
    );
    expect(html).toContain('type="text"');
  });

  it('renders a number input for NUMBER, with the weight-role hint', () => {
    const html = renderToStaticMarkup(
      <DynamicFieldInput
        field={field({ fieldType: 'NUMBER', weightRole: true })}
        value={80}
        onChange={vi.fn()}
        disabled={false}
      />
    );
    expect(html).toContain('type="number"');
    expect(html).toContain('(peso)');
  });

  it('renders a checkbox for YES_NO', () => {
    const html = renderToStaticMarkup(
      <DynamicFieldInput
        field={field({ fieldType: 'YES_NO' })}
        value={undefined}
        onChange={vi.fn()}
        disabled={false}
      />
    );
    expect(html).toContain('role="checkbox"');
  });

  it('renders one radio option per choice for MULTIPLE_CHOICE', () => {
    const html = renderToStaticMarkup(
      <DynamicFieldInput
        field={field({
          fieldType: 'MULTIPLE_CHOICE',
          options: ['Emagrecer', 'Ganhar massa'],
        })}
        value={undefined}
        onChange={vi.fn()}
        disabled={false}
      />
    );
    expect(html).toContain('Emagrecer');
    expect(html).toContain('Ganhar massa');
  });

  it('marks an optional field in its label', () => {
    const html = renderToStaticMarkup(
      <DynamicFieldInput
        field={field({ required: false })}
        value={undefined}
        onChange={vi.fn()}
        disabled={false}
      />
    );
    expect(html).toContain('(opcional)');
  });
});
