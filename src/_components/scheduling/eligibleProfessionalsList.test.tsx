import type { EligibleCounterpart } from '@/_types/messages';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EligibleProfessionalsList } from './eligibleProfessionalsList';

describe('EligibleProfessionalsList', () => {
  // US-006.EC-2
  it('invites the user to search when there is no eligible professional', () => {
    const html = renderToStaticMarkup(
      <EligibleProfessionalsList professionals={[]} />
    );
    expect(html).toContain('nenhum profissional vinculado');
    expect(html).toContain('/restrict/professionals');
  });

  it('links each eligible professional to their slot picker', () => {
    const professionals: EligibleCounterpart[] = [
      { id: 'professional-1', name: 'Dra. Ana' },
    ];
    const html = renderToStaticMarkup(
      <EligibleProfessionalsList professionals={professionals} />
    );
    expect(html).toContain('Dra. Ana');
    expect(html).toContain('/restrict/scheduling/book/professional-1');
  });
});
