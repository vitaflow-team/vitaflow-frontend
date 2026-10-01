import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { NoProfessionalState } from './noProfessionalState';

describe('NoProfessionalState', () => {
  // US-003.AC-1, US-004.AC-1
  it('shows the given message and a direct link to professional discovery', () => {
    const html = renderToStaticMarkup(
      <NoProfessionalState message="Você ainda não tem uma nutricionista vinculada." />
    );

    expect(html).toContain('Você ainda não tem uma nutricionista vinculada.');
    expect(html).toContain('href="/restrict/professionals?tab=buscar"');
    expect(html).toContain('Buscar profissional');
  });
});
