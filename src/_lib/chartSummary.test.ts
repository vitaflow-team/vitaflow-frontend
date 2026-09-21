import { describe, expect, it } from 'vitest';
import { buildTrendSummary, type TrendSummaryPoint } from './chartSummary';

const formatWeight = (value: number) =>
  value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

function weightPoints(...values: number[]): TrendSummaryPoint[] {
  return values.map((value, index) => ({
    t: Date.parse('2026-07-25T12:00:00.000Z') + index * 86_400_000,
    value,
  }));
}

function weightSummary(...values: number[]): string {
  return buildTrendSummary({
    label: 'Peso',
    unit: 'kg',
    weeks: 8,
    points: weightPoints(...values),
    format: formatWeight,
  });
}

describe('progress dashboard refresh — chart text summary', () => {
  it('UT-024 describes a decrease with a real minus sign', () => {
    expect(weightSummary(66.2, 62.9)).toBe(
      'Peso de 66,2 kg para 62,9 kg em 8 semanas, variação de −3,3 kg'
    );
  });

  it('UT-025 describes an increase with a plus sign', () => {
    expect(weightSummary(62.9, 64.1)).toContain('variação de +1,2 kg');
  });

  it('UT-026 reports no change without a signed number', () => {
    const summary = weightSummary(62.9, 63.4, 62.9);

    expect(summary).toContain('sem variação');
    expect(summary).not.toContain('+');
    expect(summary).not.toContain('−');
  });

  it('UT-027 states the single value when there is only one point', () => {
    expect(weightSummary(62.9)).toBe(
      'Peso: um registro em 8 semanas, 62,9 kg.'
    );
  });

  it('UT-028 states that the period has no records', () => {
    expect(weightSummary()).toBe('Peso: sem registros em 8 semanas.');
  });

  it('UT-029 never judges the trend', () => {
    const judgements = ['melhora', 'piora', 'bom', 'ruim', 'bem', 'mal'];
    const summaries = [
      weightSummary(62.9, 64.1),
      weightSummary(66.2, 62.9),
      weightSummary(62.9, 62.9),
      weightSummary(62.9),
      weightSummary(),
      buildTrendSummary({
        label: 'IMC',
        unit: '',
        weeks: 12,
        points: weightPoints(21.3, 22.4),
        format: value =>
          value.toLocaleString('pt-BR', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }),
      }),
    ];

    for (const summary of summaries) {
      for (const judgement of judgements) {
        expect(summary.toLowerCase()).not.toContain(judgement);
      }
    }
  });

  it('formats the BMI summary without a unit and with one decimal', () => {
    expect(
      buildTrendSummary({
        label: 'IMC',
        unit: '',
        weeks: 4,
        points: weightPoints(22, 21.5),
        format: value =>
          value.toLocaleString('pt-BR', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }),
      })
    ).toBe('IMC de 22,0 para 21,5 em 4 semanas, variação de −0,5');
  });
});
