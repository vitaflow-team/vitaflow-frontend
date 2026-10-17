import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { FormRecord } from '@/_types/clinicalRecords';
import { FormRecordRow } from './formRecordRow';

function record(overrides: Partial<FormRecord> = {}): FormRecord {
  return {
    id: 'record-1',
    recordedAt: '2026-10-01T12:00:00.000Z',
    recordedByUserId: 'nutri-1',
    values: [
      {
        fieldLabel: 'Peso (kg)',
        fieldType: 'NUMBER',
        value: 70,
        weightRole: true,
        heightRole: false,
      },
    ],
    bmi: null,
    ...overrides,
  };
}

describe('FormRecordRow', () => {
  it('shows each field label and its own frozen value (ADR-010)', () => {
    const html = renderToStaticMarkup(<FormRecordRow record={record()} />);
    expect(html).toContain('Peso (kg)');
    expect(html).toContain('70');
  });

  it('shows the BMI badge only when the record has one', () => {
    const withBmi = record({
      bmi: { value: 25.5, classification: 'SOBREPESO' },
    });
    expect(renderToStaticMarkup(<FormRecordRow record={withBmi} />)).toContain(
      'Sobrepeso'
    );
    expect(
      renderToStaticMarkup(<FormRecordRow record={record()} />)
    ).not.toContain('IMC');
  });

  it('renders an "Editar" action only when one is offered', () => {
    const withEdit = renderToStaticMarkup(
      <FormRecordRow record={record()} onEdit={() => {}} />
    );
    expect(withEdit).toContain('Editar');
    expect(
      renderToStaticMarkup(<FormRecordRow record={record()} />)
    ).not.toContain('Editar');
  });

  it('renders a boolean answer as Sim/Não, not true/false', () => {
    const yesNo = record({
      values: [
        {
          fieldLabel: 'Fuma?',
          fieldType: 'YES_NO',
          value: true,
          weightRole: false,
          heightRole: false,
        },
      ],
    });
    expect(renderToStaticMarkup(<FormRecordRow record={yesNo} />)).toContain(
      'Sim'
    );
  });
});
