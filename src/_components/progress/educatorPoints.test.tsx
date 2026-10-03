import { toChartPoints } from '@/_lib/chartSummary';
import { TREND_METRICS } from '@/_lib/trendMetrics';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import type { ComponentProps, ReactNode } from 'react';
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
vi.mock('./recordFormModal', () => ({
  RecordFormModal: ({
    trigger,
    existingRecord,
  }: {
    trigger: ReactNode;
    existingRecord?: MeasurementRecordResponseDTO;
  }) => <div data-editing={existingRecord?.id}>{trigger}</div>,
}));

import { HistoryList } from './historyList';
import { SummaryCards } from './summaryCards';
import { TrendChartTable } from './trendChartDetails';
import { TrendTooltip } from './trendChartTooltip';

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

const EDUCATOR_RECORD = record('edu-1', {
  weightKg: 78.2,
  source: 'EDUCATOR',
  readOnly: true,
  educatorName: 'Thiago Ramos',
});

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

describe('evolution history with educator points', () => {
  it('UT-159 hides edit and delete for a read-only point and says who measured it', () => {
    const html = renderToStaticMarkup(
      <HistoryList records={[EDUCATOR_RECORD, record('own-1')]} />
    );

    expect(text(html)).toContain('Medido por Thiago Ramos');
    expect(html.match(/aria-label="Editar registro"/g)).toHaveLength(1);
    expect(html.match(/aria-label="Excluir registro"/g)).toHaveLength(1);
    expect(html).toContain('data-editing="own-1"');
    expect(html).not.toContain('data-editing="edu-1"');
  });

  it('UT-159 shows an educator point as a date, not a moment', () => {
    const html = renderToStaticMarkup(
      <HistoryList records={[EDUCATOR_RECORD]} />
    );

    expect(text(html)).toContain('15/09/2026');
    expect(text(html)).not.toMatch(/15\/09\/2026,? \d{2}:\d{2}/);
  });

  it('UT-163 renders exactly as before when every point is the user own', () => {
    const html = renderToStaticMarkup(
      <HistoryList records={[record('own-1'), record('own-2')]} />
    );

    expect(text(html)).not.toContain('Medido por');
    expect(html.match(/aria-label="Editar registro"/g)).toHaveLength(2);
    expect(html.match(/aria-label="Excluir registro"/g)).toHaveLength(2);
  });
});

describe('chart with educator points', () => {
  const OWN_POINT = {
    t: Date.parse('2026-09-15T15:00:00-03:00'),
    value: 82.4,
  };

  it('UT-160 names the educator in the tooltip of their point', () => {
    const html = renderToStaticMarkup(
      <TrendTooltip
        active
        payload={[{ payload: { ...OWN_POINT, educatorName: 'Thiago Ramos' } }]}
        config={TREND_METRICS.weight}
      />
    );

    expect(html).toContain('Medido por Thiago Ramos');
    expect(html).toContain('82,4 kg');
    expect(html).toContain('15/09/2026');
    expect(html).not.toMatch(/15\/09\/2026,? \d{2}:\d{2}/);
  });

  it('UT-162 adds the source to the text alternative table for educator points', () => {
    const html = renderToStaticMarkup(
      <TrendChartTable
        title="Evolução do peso"
        weeks={8}
        config={TREND_METRICS.weight}
        chartPoints={[
          OWN_POINT,
          {
            ...OWN_POINT,
            t: OWN_POINT.t + 86_400_000,
            educatorName: 'Thiago Ramos',
          },
        ]}
      />
    );

    expect(html).toContain('<th scope="col">Origem</th>');
    expect(text(html)).toContain('Medido por Thiago Ramos');
    expect(text(html)).toContain('Registro próprio');
  });

  it('UT-163 leaves the tooltip and the table as before for own-only points', () => {
    const tooltip = renderToStaticMarkup(
      <TrendTooltip
        active
        payload={[{ payload: OWN_POINT }]}
        config={TREND_METRICS.weight}
      />
    );
    const table = renderToStaticMarkup(
      <TrendChartTable
        title="Evolução do peso"
        weeks={8}
        config={TREND_METRICS.weight}
        chartPoints={[OWN_POINT]}
      />
    );

    expect(tooltip).not.toContain('Medido por');
    expect(table).not.toContain('Origem');
    expect(table.match(/<th /g)).toHaveLength(2);
  });

  it('carries the educator name into the plotted points, and only there', () => {
    const points = toChartPoints([
      { recordedAt: '2026-09-01T12:00:00.000Z', value: 83 },
      {
        recordedAt: '2026-09-15T15:00:00.000Z',
        value: 78.2,
        educatorName: 'Thiago Ramos',
      },
    ]);

    expect(points[0]).toEqual({
      t: Date.parse('2026-09-01T12:00:00.000Z'),
      value: 83,
    });
    expect(points[1].educatorName).toBe('Thiago Ramos');
  });
});

describe('summary cards with an educator latest point', () => {
  function render(props: Partial<ComponentProps<typeof SummaryCards>> = {}) {
    return renderToStaticMarkup(
      <SummaryCards
        latest={EDUCATOR_RECORD}
        weightVariationKg={-0.8}
        weightSeries={[
          { recordedAt: '2026-09-01T12:00:00Z', weightKg: 79 },
          { recordedAt: '2026-09-15T15:00:00Z', weightKg: 78.2 },
        ]}
        {...props}
      />
    );
  }

  it('UT-161 shows the value and who measured it', () => {
    const body = text(render());

    expect(body).toContain('78,2 kg');
    expect(body).toContain('Medido por Thiago Ramos');
  });

  it('UT-163 shows no source label when the latest point is the user own', () => {
    expect(text(render({ latest: record('own-1') }))).not.toContain(
      'Medido por'
    );
  });
});
