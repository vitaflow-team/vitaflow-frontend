import type { UpcomingSlot } from '@/_types/scheduling';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('@/_actions/scheduling/cancelFixedSession', () => ({
  actionCancelFixedSession: vi.fn(),
}));
vi.mock('@/_actions/scheduling/cancelSlot', () => ({
  actionCancelSlot: vi.fn(),
}));
vi.mock('@/_actions/scheduling/setFixedSessionLink', () => ({
  actionSetFixedSessionLink: vi.fn(),
}));
vi.mock('@/_actions/scheduling/setOnlineLink', () => ({
  actionSetOnlineLink: vi.fn(),
}));

import { UpcomingSlotCard } from './upcomingSlotCard';

function fixed(overrides: Partial<UpcomingSlot> = {}): UpcomingSlot {
  return {
    id: 'fs1',
    professionalId: 'educator-1',
    availabilityWindowId: null,
    startAt: '2026-10-14T10:00:00.000Z',
    endAt: '2026-10-14T11:00:00.000Z',
    status: 'BOOKED',
    type: 'ONLINE',
    onlineLink: null,
    userId: 'student-user',
    reminderSentAt: null,
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
    counterpart: { id: 'educator-1', name: 'Thiago' },
    source: 'FIXED',
    workoutLetter: 'A',
    workoutSessionName: 'Peito',
    ...overrides,
  } as unknown as UpcomingSlot;
}

describe('upcoming card for a fixed session (UT-115)', () => {
  it('shows "Entrar na chamada" only when a link exists, and offers cancel of one date with no link editing', () => {
    const withLink = renderToStaticMarkup(
      <UpcomingSlotCard
        slot={fixed({ onlineLink: 'https://meet.test/a' })}
        viewerIsProfessional={false}
      />
    );
    const withoutLink = renderToStaticMarkup(
      <UpcomingSlotCard slot={fixed()} viewerIsProfessional={false} />
    );

    expect(withLink).toContain('Entrar na chamada');
    expect(withoutLink).not.toContain('Entrar na chamada');
    expect(withLink).toContain('Cancelar');
    expect(withLink).not.toContain('Salvar link');
  });
});
