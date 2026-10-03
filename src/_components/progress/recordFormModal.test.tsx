import { RecordFormModal } from '@/_components/progress/recordFormModal';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// The actions touch cookies and the API on import; the closed modal never
// runs them, it only renders its trigger.
vi.mock('@/_actions/progress/getLatestRecord', () => ({
  actionGetLatestRecord: vi.fn(),
}));
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

const RECORD: MeasurementRecordResponseDTO = {
  id: 'rec-1',
  weightKg: 82.4,
  heightCm: 168,
  waistCm: null,
  hipCm: null,
  recordedAt: '2026-09-15T15:00:00Z',
  bmi: 29.2,
  bmiClassification: 'SOBREPESO',
  source: 'SELF',
  readOnly: false,
  educatorName: null,
};

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

describe('test coverage — record form modal', () => {
  // UT-011
  it('renders the default desktop trigger and nothing else while closed', () => {
    const html = renderToStaticMarkup(<RecordFormModal />);

    expect(html).toContain('<button');
    expect(html).toContain('hidden md:inline-flex');
    expect(html).toContain('lucide-plus');
    expect(text(html)).toContain('Registrar novo');
    // Neither the sheet nor the dialog exists before the first open.
    expect(html).not.toContain('role="dialog"');
    expect(text(html)).not.toContain('O IMC é calculado automaticamente.');
  });

  // UT-011
  it('renders a custom trigger in place of the default one', () => {
    const html = renderToStaticMarkup(
      <RecordFormModal
        existingRecord={RECORD}
        focusField="heightCm"
        trigger={<button type="button">Editar medida</button>}
      />
    );

    expect(text(html)).toContain('Editar medida');
    expect(html).not.toContain('hidden md:inline-flex');
    expect(text(html)).not.toContain('Editar registro');
    expect(html).not.toContain('role="dialog"');
  });
});
