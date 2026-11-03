import { describe, expect, it } from 'vitest';
import { billingWarningsMessage } from './billingWarnings';

describe('billingWarningsMessage', () => {
  it('UT-131 returns null when nothing failed to cancel', () => {
    expect(billingWarningsMessage([])).toBeNull();
  });

  it('UT-131 names a single competence', () => {
    const message = billingWarningsMessage([
      { competenceYear: 2026, competenceMonth: 11 },
    ]);

    expect(message).toContain('Novembro de 2026');
    expect(message).not.toContain('cobranças');
  });

  it('UT-131 names several competences, pluralized', () => {
    const message = billingWarningsMessage([
      { competenceYear: 2026, competenceMonth: 11 },
      { competenceYear: 2026, competenceMonth: 12 },
    ]);

    expect(message).toContain('Novembro de 2026, Dezembro de 2026');
    expect(message).toContain('cobranças');
  });
});
