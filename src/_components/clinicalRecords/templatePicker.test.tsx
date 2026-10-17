import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { Template } from '@/_types/clinicalRecords';
import { TemplatePicker } from './templatePicker';

function template(overrides: Partial<Template> = {}): Template {
  return {
    id: 'template-1',
    name: 'Anamnese padrão',
    purpose: 'ANAMNESE',
    active: true,
    fields: [],
    ...overrides,
  };
}

describe('TemplatePicker', () => {
  it('shows nothing when there is only one template to choose from (US-005)', () => {
    const html = renderToStaticMarkup(
      <TemplatePicker
        templates={[template()]}
        value="template-1"
        onChange={vi.fn()}
        disabled={false}
      />
    );
    expect(html).toBe('');
  });

  it('lists every template by name when there is more than one (US-003.AC-3)', () => {
    const html = renderToStaticMarkup(
      <TemplatePicker
        templates={[
          template(),
          template({ id: 'template-2', name: 'Anamnese esportiva' }),
        ]}
        value="template-1"
        onChange={vi.fn()}
        disabled={false}
      />
    );
    expect(html).toContain('Anamnese padrão');
    expect(html).toContain('Anamnese esportiva');
  });
});
