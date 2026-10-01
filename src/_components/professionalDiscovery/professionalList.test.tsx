import type { ProfessionalSummary } from '@/_types/professionalDiscovery';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ProfessionalList } from './professionalList';

function professional(
  overrides: Partial<ProfessionalSummary> = {}
): ProfessionalSummary {
  return {
    id: 'prof-1',
    name: 'Dra. Ana',
    type: 'NUTRITIONIST',
    specialty: 'Nutrição esportiva',
    priceFrom: 150,
    attendsOnline: true,
    ...overrides,
  };
}

describe('ProfessionalList', () => {
  // US-001.AC-1, US-001.AC-2
  it('lists each professional with type, specialty and price', () => {
    const html = renderToStaticMarkup(
      <ProfessionalList
        professionals={[professional()]}
        filtered={false}
        pendingProfessionalIds={new Set()}
      />
    );

    expect(html).toContain('Dra. Ana');
    expect(html).toContain('Nutricionista');
    expect(html).toContain('Nutrição esportiva');
    expect(html).toContain('Atende online');
  });

  it('shows a professional with no profile row with null-field fallbacks (US-001.EC-2)', () => {
    const html = renderToStaticMarkup(
      <ProfessionalList
        professionals={[
          professional({
            specialty: null,
            priceFrom: null,
            attendsOnline: false,
          }),
        ]}
        filtered={false}
        pendingProfessionalIds={new Set()}
      />
    );

    expect(html).toContain('Especialidade não informada');
    expect(html).toContain('Preço não informado');
  });

  it('marks a professional the viewer already has a pending request to', () => {
    const html = renderToStaticMarkup(
      <ProfessionalList
        professionals={[professional({ id: 'prof-1' })]}
        filtered={false}
        pendingProfessionalIds={new Set(['prof-1'])}
      />
    );

    expect(html).toContain('Solicitação pendente');
  });

  // US-001.EC-1
  it('shows an explicit empty-filtered message, not a blank area', () => {
    const html = renderToStaticMarkup(
      <ProfessionalList
        professionals={[]}
        filtered
        pendingProfessionalIds={new Set()}
      />
    );

    expect(html).toContain(
      'Nenhum profissional encontrado para esses filtros.'
    );
  });

  it('shows a different message for an unfiltered empty catalog', () => {
    const html = renderToStaticMarkup(
      <ProfessionalList
        professionals={[]}
        filtered={false}
        pendingProfessionalIds={new Set()}
      />
    );

    expect(html).toContain('Nenhum profissional disponível no momento.');
  });
});
