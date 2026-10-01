import type { ConnectionRequest } from '@/_types/professionalDiscovery';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MyRequestsList } from './myRequestsList';

function request(
  overrides: Partial<ConnectionRequest> = {}
): ConnectionRequest {
  return {
    id: 'req-1',
    userId: 'user-1',
    userName: 'Usuária',
    professionalId: 'prof-1',
    professionalName: 'Dra. Ana',
    status: 'PENDING',
    createdAt: '2026-10-01T10:00:00.000Z',
    decidedAt: null,
    ...overrides,
  };
}

describe('MyRequestsList', () => {
  // US-005.AC-1
  it('shows each request with the professional name and its status', () => {
    const html = renderToStaticMarkup(
      <MyRequestsList requests={[request()]} />
    );

    expect(html).toContain('Dra. Ana');
    expect(html).toContain('Pendente');
  });

  // US-005.AC-2
  it('links a declined request back to search', () => {
    const html = renderToStaticMarkup(
      <MyRequestsList requests={[request({ status: 'DECLINED' })]} />
    );

    expect(html).toContain('Recusada');
    expect(html).toContain('Buscar outro profissional');
  });

  it('does not link a pending or accepted request back to search', () => {
    const pending = renderToStaticMarkup(
      <MyRequestsList requests={[request({ status: 'PENDING' })]} />
    );
    expect(pending).not.toContain('Buscar outro profissional');

    const accepted = renderToStaticMarkup(
      <MyRequestsList requests={[request({ status: 'ACCEPTED' })]} />
    );
    expect(accepted).not.toContain('Buscar outro profissional');
  });

  // US-005.EC-1
  it('invites a first search when there are zero requests', () => {
    const html = renderToStaticMarkup(<MyRequestsList requests={[]} />);

    expect(html).toContain('Você ainda não solicitou nenhum profissional.');
    expect(html).toContain('Buscar um profissional');
  });
});
