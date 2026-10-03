import { SummaryCards } from '@/_components/progress/summaryCards';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import type { ComponentProps, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The height shortcut opens the record modal, which fetches on open; only the
// trigger it hands over matters to the card.
vi.mock('./recordFormModal', () => ({
  RecordFormModal: ({ trigger }: { trigger: ReactNode }) => (
    <div>{trigger}</div>
  ),
}));

const NOW = new Date('2026-09-28T12:00:00Z');

const LATEST: MeasurementRecordResponseDTO = {
  id: 'rec-1',
  weightKg: 82.4,
  heightCm: 168,
  waistCm: null,
  hipCm: null,
  recordedAt: NOW.toISOString(),
  bmi: 29.2,
  bmiClassification: 'SOBREPESO',
  source: 'SELF',
  readOnly: false,
  educatorName: null,
};

const SERIES = [
  { recordedAt: '2026-09-01T12:00:00Z', weightKg: 84 },
  { recordedAt: '2026-09-28T12:00:00Z', weightKg: 82.4 },
];

function render(props: Partial<ComponentProps<typeof SummaryCards>> = {}) {
  return renderToStaticMarkup(
    <SummaryCards
      latest={LATEST}
      weightVariationKg={-1.6}
      weightSeries={SERIES}
      {...props}
    />
  );
}

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

function daysAgo(days: number): string {
  return new Date(NOW.getTime() - days * 86_400_000).toISOString();
}

describe('test coverage — progress summary cards', () => {
  // UT-011
  it('shows the current weight, BMI and height with the height shortcut', () => {
    const html = render();
    const body = text(html);

    expect(html).toContain('aria-label="Resumo atual"');
    expect(body).toContain('Peso atual');
    expect(body).toContain('82,4 kg');
    expect(body).toContain('IMC atual');
    expect(body).toContain('29,2');
    expect(body).toContain('Sobrepeso');
    expect(body).toContain('Altura atual');
    expect(body).toContain('168 cm');
    expect(body).toContain('Atualizar');
  });

  // UT-011
  it('draws the weight trend and the variation since the previous record', () => {
    const html = render();

    expect(html).toContain('<svg aria-hidden="true"');
    expect(html).toContain('<path d="M');
    expect(text(html)).toContain('↓ 1,6 kg desde o registro anterior');
  });

  // UT-011
  it('draws no trend with a single point and no variation without one', () => {
    const html = render({
      weightVariationKg: null,
      weightSeries: [SERIES[1]],
    });

    expect(html).not.toContain('<svg aria-hidden="true"');
    expect(text(html)).not.toContain('desde o registro anterior');
  });
});

describe('test coverage — progress summary cards confirmation date', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // UT-011
  it.each([
    [0, 'Confirmada hoje'],
    [1, 'Confirmada ontem'],
    [5, 'Confirmada há 5 dias'],
    [30, 'Confirmada há 1 mês'],
    [90, 'Confirmada há 3 meses'],
    [365, 'Confirmada há 1 ano'],
    [800, 'Confirmada há 2 anos'],
  ])('dates a record %i days old as "%s"', (days, label) => {
    const body = text(
      render({ latest: { ...LATEST, recordedAt: daysAgo(days) } })
    );

    expect(body).toContain(label);
  });
});
