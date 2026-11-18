import type { CheckinConfirmation } from '@/_types/checkinConfirmation';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { flow } = vi.hoisted(() => ({
  flow: {
    query: '',
    results: null as unknown,
    selected: { id: 's1', name: 'Diego Martins' } as unknown,
    confirmation: null as CheckinConfirmation | null,
    searchPending: false,
    searchError: null as string | null,
    checkInPending: false,
    checkInError: null as string | null,
  },
}));

vi.mock('@/_hooks/useReceptionistCheckin', () => ({
  useReceptionistCheckin: () => ({
    ...flow,
    setQuery: vi.fn(),
    setSelected: vi.fn(),
    runSearch: vi.fn(),
    confirm: vi.fn(),
    reset: vi.fn(),
  }),
}));

import { ReceptionistCheckinView } from './receptionistCheckinView';

const CONFIRMED_AT = '2026-11-17T14:30:00.000Z';

function render(confirmation: CheckinConfirmation | null) {
  flow.confirmation = confirmation;
  return renderToStaticMarkup(<ReceptionistCheckinView />);
}

function statusTexts(html: string): string[] {
  return [...html.matchAll(/<p[^>]*role="status"[^>]*>(.*?)<\/p>/g)].map(
    match => match[1]
  );
}

describe('ReceptionistCheckinView notice — financial-health US-019, US-020', () => {
  beforeEach(() => {
    flow.selected = { id: 's1', name: 'Diego Martins' };
    flow.checkInError = null;
  });

  it('UT-138 renders a neutral message in a role="status" element next to "Check-in registrado" when the notice is SEE_ADMINISTRATION', () => {
    const html = render({
      createdAt: CONFIRMED_AT,
      notice: 'SEE_ADMINISTRATION',
    });

    const texts = statusTexts(html);
    expect(texts).toHaveLength(2);
    expect(texts[0]).toContain('Check-in registrado');
    expect(texts[1]).toBe('Oriente o aluno a passar pela administração.');
  });

  it('UT-138 renders no extra message when the notice is null', () => {
    const html = render({ createdAt: CONFIRMED_AT, notice: null });

    const texts = statusTexts(html);
    expect(texts).toHaveLength(1);
    expect(texts[0]).toContain('Check-in registrado');
    expect(html).not.toContain('administração');
  });

  it('UT-138 the notice message contains no digits, amount, days or delinquency wording', () => {
    const html = render({
      createdAt: CONFIRMED_AT,
      notice: 'SEE_ADMINISTRATION',
    });

    const notice = statusTexts(html)[1];
    expect(notice).not.toMatch(/\d/);
    expect(notice).not.toMatch(
      /R\$|dia|atras|inadimpl|devi|débito|dívid|pagament|valor|mensalidade|cobran/i
    );
  });

  it('shows only the confirmation button, with no notice, before the check-in is registered', () => {
    const html = render(null);

    expect(html).toContain('Confirmar check-in');
    expect(html).toContain('Diego Martins');
    expect(html).not.toContain('role="status"');
    expect(html).not.toContain('administração');
  });

  it('keeps the way to the next student after the notice', () => {
    const html = render({
      createdAt: CONFIRMED_AT,
      notice: 'SEE_ADMINISTRATION',
    });

    expect(html).toContain('Buscar outro aluno');
  });

  it('shows the search, never a notice, when no student is chosen', () => {
    flow.selected = null;

    const html = render(null);

    expect(html).toContain('Nome do aluno');
    expect(html).not.toContain('role="status"');
  });
});
