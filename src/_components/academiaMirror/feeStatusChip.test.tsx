import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FeeStatusChip } from './feeStatusChip';

describe('FeeStatusChip', () => {
  it.each([
    ['PENDING', 'Pendente'],
    ['OVERDUE', 'Em atraso'],
    ['PAID', 'Pago'],
  ] as const)('says %s in words', (status, label) => {
    expect(renderToStaticMarkup(<FeeStatusChip status={status} />)).toContain(
      label
    );
  });
});
