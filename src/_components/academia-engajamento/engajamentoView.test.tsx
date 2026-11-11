import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { EngajamentoSummary } from '@/_types/engajamento';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({ isPending: false, execute: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('@/_actions/academia-engajamento/dismissChurnRisk', () => ({
  dismissChurnRisk: vi.fn(),
}));

import { EngajamentoView } from './engajamentoView';

const EMPTY: EngajamentoSummary = {
  todayCheckInCount: 0,
  weeklyFrequencyAverage: 0,
  atRisk: [],
  recentFeed: [],
  checkInHeatmap: [],
  monthOverMonth: {
    currentMonthCount: 0,
    previousMonthCount: null,
    isCurrentMonthPartial: true,
  },
};

const POPULATED: EngajamentoSummary = {
  todayCheckInCount: 3,
  weeklyFrequencyAverage: 2.5,
  atRisk: [
    {
      clientId: 'c1',
      name: 'Diego Martins',
      lastCheckInAt: '2026-11-01T13:00:00.000Z',
    },
    { clientId: 'c2', name: 'Fernanda Souza', lastCheckInAt: null },
  ],
  recentFeed: [
    {
      clientId: 'c3',
      name: 'Carla Lima',
      createdAt: '2026-11-15T13:00:00.000Z',
      source: 'SELF',
      planValidAtCheckIn: true,
    },
    {
      clientId: 'c4',
      name: 'Bruno Alves',
      createdAt: '2026-11-15T12:00:00.000Z',
      source: 'RECEPTIONIST',
      planValidAtCheckIn: false,
    },
  ],
  checkInHeatmap: [{ weekday: 1, hour: 18, count: 4 }],
  monthOverMonth: {
    currentMonthCount: 12,
    previousMonthCount: 10,
    isCurrentMonthPartial: true,
  },
};

describe('EngajamentoView — gym-checkin US-009 through US-012, US-015', () => {
  it('US-015 shows explicit empty states for a freshly-provisioned academia', () => {
    const html = renderToStaticMarkup(<EngajamentoView summary={EMPTY} />);

    expect(html).toContain('>0<');
    expect(html).toContain('Nenhum aluno em risco no momento.');
    expect(html).toContain('Nenhum check-in registrado ainda.');
  });

  it("shows today's count and weekly frequency numbers", () => {
    const html = renderToStaticMarkup(<EngajamentoView summary={POPULATED} />);

    expect(html).toContain('>3<');
    expect(html).toContain('2.5');
  });

  it('US-011 shows at-risk students, including one who never checked in', () => {
    const html = renderToStaticMarkup(<EngajamentoView summary={POPULATED} />);

    expect(html).toContain('Diego Martins');
    expect(html).toContain('Fernanda Souza');
    expect(html).toContain('Nunca fez check-in');
  });

  it('US-012 shows the recent feed with the outside-validity flag where applicable', () => {
    const html = renderToStaticMarkup(<EngajamentoView summary={POPULATED} />);

    expect(html).toContain('Carla Lima');
    expect(html).toContain('Bruno Alves');
    expect(html).toContain('Fora da validade do plano');
  });

  it("UT-027 shows a Dispensar action wired to each at-risk student's clientId", () => {
    const html = renderToStaticMarkup(<EngajamentoView summary={POPULATED} />);

    expect(html.match(/Dispensar/g)).toHaveLength(2);
    expect(html).toContain('data-testid="dismiss-churn-risk-c1"');
    expect(html).toContain('data-testid="dismiss-churn-risk-c2"');
  });
});
