import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./academiaAlunoAssignSelect', () => ({
  AcademiaAlunoAssignSelect: () => <p>seletor de educador</p>,
}));
vi.mock('./studentAccessPlanPanel', () => ({
  StudentAccessPlanPanel: ({
    studentName,
    billing,
  }: {
    studentName: string;
    billing: string;
  }) => (
    <p>
      plano:{studentName}:{billing}
    </p>
  ),
}));
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

import { AcademiaAlunoRow } from './academiaAlunoRow';

const ITEM = {
  id: 's1',
  name: 'Diego Martins',
  email: 'diego@exemplo.com',
  assignedEducator: { id: 'edu-1', name: 'Carla Lima' },
  nextSession: null,
};

describe('AcademiaAlunoRow', () => {
  it('shows the student, the educator, and no schedule', () => {
    const html = renderToStaticMarkup(
      <ul>
        <AcademiaAlunoRow item={ITEM} employments={[]} billing="READY" />
      </ul>
    );

    expect(html).toContain('Diego Martins');
    expect(html).toContain('diego@exemplo.com');
    expect(html).toContain('Educador: Carla Lima');
    expect(html).toContain('Sem horário');
  });

  it('links to the student screen and hands the billing availability to the plan dialog', () => {
    const html = renderToStaticMarkup(
      <ul>
        <AcademiaAlunoRow
          item={{ ...ITEM, assignedEducator: null }}
          employments={[]}
          billing="NOT_CONNECTED"
        />
      </ul>
    );

    expect(html).toContain('href="/restrict/academia-alunos/s1"');
    expect(html).toContain('plano:Diego Martins:NOT_CONNECTED');
    expect(html).toContain('Sem educador');
  });
});
