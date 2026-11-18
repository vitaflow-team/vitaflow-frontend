import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PlatformAccountBreakdown } from './platformAccountBreakdown';

const ZERO = { expectedCents: 0, receivedCents: 0, stillOwedCents: 0 };
const NO_OVERDUE = {
  totalCents: 0,
  delinquentCount: 0,
  bands: { d1to7Cents: 0, d8to30Cents: 0, d31PlusCents: 0 },
};

describe('PlatformAccountBreakdown — financial-health US-021', () => {
  it('lists the four account types in order, each with its own figures', () => {
    const html = renderToStaticMarkup(
      <PlatformAccountBreakdown
        byAccountType={{
          USER: { ...ZERO, expectedCents: 14990 },
          NUTRITIONIST: ZERO,
          PHYSICAL_EDUCATOR: ZERO,
          ACADEMIA: ZERO,
        }}
        overdue={{
          ...NO_OVERDUE,
          byAccountType: {
            USER: NO_OVERDUE,
            NUTRITIONIST: NO_OVERDUE,
            PHYSICAL_EDUCATOR: NO_OVERDUE,
            ACADEMIA: NO_OVERDUE,
          },
        }}
      />
    );

    const labels = ['Usuário', 'Nutricionista', 'Educador físico', 'Academia'];
    const positions = labels.map(label => html.indexOf(`>${label}</h3>`));
    expect(positions.every(position => position > 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    expect(html).toMatch(/R\$\s149,90/);
    expect(html.match(/<li /g)).toHaveLength(4);
  });
});
