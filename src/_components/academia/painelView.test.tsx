import type { PainelResponse } from '@/_types/academiaPainel';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PainelView } from './painelView';

const EMPTY: PainelResponse = {
  educatorCount: 0,
  studentCount: 0,
  educators: [],
  activity: [],
};

const POPULATED: PainelResponse = {
  educatorCount: 2,
  studentCount: 5,
  educators: [
    {
      id: 'e1',
      name: 'Ana Souza',
      email: 'ana@exemplo.com',
      startedAt: '2026-01-10T00:00:00.000Z',
    },
  ],
  activity: [
    {
      id: 'a1',
      message: 'Educador convidado: ana@exemplo.com',
      createdAt: '2026-01-10T12:00:00.000Z',
    },
  ],
};

describe('PainelView — gym-foundation US-017', () => {
  it('shows explicit zero/empty markers for a freshly-provisioned academia', () => {
    const html = renderToStaticMarkup(<PainelView painel={EMPTY} />);

    expect(html).toContain('>0<');
    expect(html).toContain('Nenhum educador com vínculo ativo no momento.');
    expect(html).toContain('Nenhuma atividade ainda.');
  });

  it('shows real counts, the educator list and the activity feed when populated', () => {
    const html = renderToStaticMarkup(<PainelView painel={POPULATED} />);

    expect(html).toContain('>2<');
    expect(html).toContain('>5<');
    expect(html).toContain('Ana Souza');
    expect(html).toContain('ana@exemplo.com');
    expect(html).toContain('Educador convidado: ana@exemplo.com');
  });
});
