import {
  RecordForm,
  type RecordFormLayout,
} from '@/_components/progress/recordForm';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// As ações tocam cookies e a API na importação; a marcação inicial não depende
// do que elas fazem, só de quais campos e textos aparecem.
vi.mock('@/_actions/progress/createMeasurementRecord', () => ({
  createMeasurementRecord: vi.fn(),
}));
vi.mock('@/_actions/progress/updateMeasurementRecord', () => ({
  updateMeasurementRecord: vi.fn(),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

const LATEST: MeasurementRecordResponseDTO = {
  id: 'rec-1',
  weightKg: 82.4,
  heightCm: 168,
  waistCm: null,
  hipCm: null,
  recordedAt: '2026-09-15T15:00:00Z',
  bmi: 29.2,
  bmiClassification: 'SOBREPESO',
};

function renderForm(
  layout: RecordFormLayout,
  props: Partial<React.ComponentProps<typeof RecordForm>> = {}
) {
  return renderToStaticMarkup(
    <RecordForm
      layout={layout}
      onCancel={() => {}}
      onSaved={() => {}}
      {...props}
    />
  );
}

describe('prefill last weight — record form markup', () => {
  // UT-016
  it('prefills the sheet with the latest record and shows the reference', () => {
    const markup = renderForm('sheet', { latest: LATEST });

    expect(markup).toContain('value="82,4"');
    expect(markup).toContain('aria-label="Diminuir peso"');
    expect(markup).toContain('aria-label="Aumentar peso"');
    expect(markup).toContain('Último: 82,4 kg em 15/09/2026');
    expect(markup).toContain('sem alteração');
    expect(markup).toContain('Altura · 168,0 cm (última)');
    expect(markup).toContain('Prévia do IMC');
    expect(markup).toContain('29,2');
    expect(markup).not.toContain('Preencha peso e altura para calcular.');
  });

  // UT-017
  it('gives the dialog the same stepper, reference and difference', () => {
    const markup = renderForm('dialog', { latest: LATEST });

    expect(markup).toContain('aria-label="Diminuir peso"');
    expect(markup).toContain('aria-label="Aumentar peso"');
    expect(markup).toContain('Último: 82,4 kg em 15/09/2026');
    expect(markup).toContain('sem alteração');
    // No diálogo a altura é um campo, não a linha resumida da folha.
    expect(markup).toContain('Altura (cm)');
    expect(markup).toContain('value="168,0"');
    expect(markup).not.toContain('(última)');
  });

  // UT-018
  it('opens empty and without a reference when there is no history', () => {
    const markup = renderForm('sheet', { latest: null });

    expect(markup).toContain('value=""');
    expect(markup).not.toContain('Último:');
    expect(markup).not.toContain('sem alteração');
    expect(markup).not.toMatch(/[+−]\d/);
    expect(markup).toContain('Altura (cm)');
    // `Input` consome `required` para desenhar a marca de campo obrigatório
    // em vez de repassá-la ao `<input>`; é essa marca que fica visível.
    expect(markup).toMatch(/name="heightCm"/);
    expect(markup).toContain('border-l-4 border-l-primary');
    expect(markup).toContain('Preencha peso e altura para calcular.');
  });

  // UT-019
  it('edits an existing record with its own values and no reference', () => {
    const existingRecord: MeasurementRecordResponseDTO = {
      ...LATEST,
      id: 'rec-9',
      weightKg: 79.5,
      heightCm: 171,
    };
    const markup = renderForm('dialog', { existingRecord, latest: LATEST });

    expect(markup).toContain('value="79,5"');
    expect(markup).toContain('value="171,0"');
    expect(markup).not.toContain('Último:');
    expect(markup).not.toContain('Carregando último registro');
    expect(markup).not.toContain('role="status"');
    expect(markup).toContain('Salvar registro');
    expect(markup).toContain('Cancelar');
  });

  // UT-021
  it('announces the weight in its own polite live region', () => {
    const markup = renderForm('sheet', { latest: LATEST });

    expect(markup).toContain(
      '<p aria-live="polite" class="sr-only">Peso: 82,4 kg</p>'
    );
    // A faixa do IMC tem a sua própria região viva; são duas, não uma.
    expect(markup.match(/aria-live="polite"/g)).toHaveLength(2);
    expect(markup).not.toContain(
      '<p aria-live="polite" class="sr-only">Prévia do IMC'
    );
  });

  // UT-021 — sem peso não há o que anunciar
  it('keeps the weight live region empty without a value', () => {
    const markup = renderForm('sheet', { latest: null });

    expect(markup).toContain('<p aria-live="polite" class="sr-only"></p>');
  });
});
