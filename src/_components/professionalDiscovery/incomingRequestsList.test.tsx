import type { ConnectionRequest } from '@/_types/professionalDiscovery';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { IncomingRequestsList } from './incomingRequestsList';

vi.mock('@/_actions/professionalDiscovery/acceptRequest', () => ({
  acceptRequest: vi.fn(),
}));
vi.mock('@/_actions/professionalDiscovery/declineRequest', () => ({
  declineRequest: vi.fn(),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

function request(
  overrides: Partial<ConnectionRequest> = {}
): ConnectionRequest {
  return {
    id: 'req-1',
    userId: 'user-1',
    userName: 'João',
    professionalId: 'prof-1',
    professionalName: 'Dra. Ana',
    status: 'PENDING',
    createdAt: '2026-10-01T10:00:00.000Z',
    decidedAt: null,
    ...overrides,
  };
}

describe('IncomingRequestsList', () => {
  // US-007.AC-1
  it('shows each requester name with accept/decline actions', () => {
    const html = renderToStaticMarkup(
      <IncomingRequestsList requests={[request()]} />
    );

    expect(html).toContain('João');
    expect(html).toContain('Aceitar');
    expect(html).toContain('Recusar');
  });

  // US-007.EC-1
  it('shows an empty state, not an error, with zero pending requests', () => {
    const html = renderToStaticMarkup(<IncomingRequestsList requests={[]} />);

    expect(html).toContain('Nenhuma solicitação pendente no momento.');
  });
});
