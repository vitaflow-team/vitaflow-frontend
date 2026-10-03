import { HistoryList } from '@/_components/progress/historyList';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/progress/deleteMeasurementRecord', () => ({
  deleteMeasurementRecord: vi.fn(),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));
// The edit modal fetches on open; each row only hands it a trigger and the
// record being edited.
vi.mock('./recordFormModal', () => ({
  RecordFormModal: ({
    trigger,
    existingRecord,
  }: {
    trigger: ReactNode;
    existingRecord?: MeasurementRecordResponseDTO;
  }) => <div data-editing={existingRecord?.id}>{trigger}</div>,
}));

function record(
  id: string,
  overrides: Partial<MeasurementRecordResponseDTO> = {}
): MeasurementRecordResponseDTO {
  return {
    id,
    weightKg: 82.4,
    heightCm: 168,
    waistCm: null,
    hipCm: null,
    recordedAt: '2026-09-15T15:00:00.000Z',
    bmi: 29.2,
    bmiClassification: 'SOBREPESO',
    source: 'SELF',
    readOnly: false,
    educatorName: null,
    ...overrides,
  };
}

const RECORDS = [
  record('rec-1'),
  record('rec-2', {
    weightKg: 70,
    recordedAt: '2026-09-01T15:00:00.000Z',
    bmi: 24.8,
    bmiClassification: 'PESO_NORMAL',
    source: 'SELF',
    readOnly: false,
    educatorName: null,
  }),
];

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

describe('test coverage — progress history list', () => {
  // UT-011
  it('lists each record with its date, weight and BMI classification', () => {
    const html = renderToStaticMarkup(<HistoryList records={RECORDS} />);
    const body = text(html);

    expect(body).toContain('Últimos registros');
    expect(html.match(/<li /g)).toHaveLength(2);
    expect(html).toContain('dateTime="2026-09-15T15:00:00.000Z"');
    expect(html).toContain('dateTime="2026-09-01T15:00:00.000Z"');
    expect(body).toContain('82,4 kg');
    expect(body).toContain('IMC 29,2');
    expect(body).toContain('Sobrepeso');
    expect(body).toContain('70 kg');
    expect(body).toContain('IMC 24,8');
    expect(body).toContain('Peso normal');
  });

  // UT-011
  it('gives every row named edit and delete actions for its own record', () => {
    const html = renderToStaticMarkup(<HistoryList records={RECORDS} />);

    expect(html.match(/aria-label="Editar registro"/g)).toHaveLength(2);
    expect(html.match(/aria-label="Excluir registro"/g)).toHaveLength(2);
    expect(html).toContain('data-editing="rec-1"');
    expect(html).toContain('data-editing="rec-2"');
    // The delete confirmation only exists once opened.
    expect(text(html)).not.toContain('Excluir este registro?');
  });

  // UT-011
  it('renders an empty list without rows', () => {
    const html = renderToStaticMarkup(<HistoryList records={[]} />);

    expect(text(html)).toContain('Últimos registros');
    expect(html).toContain('<ul></ul>');
  });
});
