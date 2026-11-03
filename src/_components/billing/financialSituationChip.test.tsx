import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FinancialSituationChip } from './financialSituationChip';

describe('financial situation chip', () => {
  it('UT-132 names every situation in text, never color alone', () => {
    const labels = {
      OVERDUE: 'Em atraso',
      PENDING: 'Pendente',
      UP_TO_DATE: 'Em dia',
      NONE: 'Sem cobrança',
    } as const;

    for (const [situation, label] of Object.entries(labels)) {
      const html = renderToStaticMarkup(
        <FinancialSituationChip situation={situation as keyof typeof labels} />
      );
      expect(html).toContain(label);
    }
  });
});
