import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { AuditLogListResult } from '@/_types/backofficeAuditLog';
import { AuditLogView } from './auditLogView';

const EMPTY: AuditLogListResult = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 50,
};

const POPULATED: AuditLogListResult = {
  items: [
    {
      id: 'session-1',
      staffName: 'Ana Suporte',
      staffEmail: 'ana@vitaflow.com',
      targetName: 'Carlos Aluno',
      targetEmail: 'carlos@example.com',
      reason: 'Investigando chamado #42',
      startedAt: '2026-10-15T13:00:00.000Z',
      endedAt: '2026-10-15T13:20:00.000Z',
    },
    {
      id: 'session-2',
      staffName: 'Ana Suporte',
      staffEmail: 'ana@vitaflow.com',
      targetName: 'Recepção Academia X',
      targetEmail: 'recepcao@x.test',
      reason: 'Expirou sozinha',
      startedAt: '2026-10-15T14:00:00.000Z',
      endedAt: null,
    },
  ],
  total: 2,
  page: 1,
  pageSize: 50,
};

describe('AuditLogView — platform-admin-access US-011, US-011.EC-1', () => {
  it('shows an explicit empty state for a fresh audit log', () => {
    const html = renderToStaticMarkup(<AuditLogView result={EMPTY} />);

    expect(html).toContain('Nenhuma sessão');
  });

  it('shows a completed session with staff, target, reason, start, and end', () => {
    const html = renderToStaticMarkup(<AuditLogView result={POPULATED} />);

    expect(html).toContain('Ana Suporte');
    expect(html).toContain('Carlos Aluno');
    expect(html).toContain('Investigando chamado #42');
  });

  it('US-011.EC-1 shows a session still in progress distinctly, not a blank end time', () => {
    const html = renderToStaticMarkup(<AuditLogView result={POPULATED} />);

    expect(html).toContain('em andamento');
  });
});
