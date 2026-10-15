import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { AcademiaEmployment, AcademiaStudent } from '@/_types/academia';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({ isPending: false, execute: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_actions/academia/assignEducator', () => ({ assignEducator: {} }));

import { StudentsAssignSection } from './studentsAssignSection';

const EMPLOYMENTS: AcademiaEmployment[] = [
  {
    id: 'e1',
    educatorId: 'educator-1',
    status: 'ACTIVE',
    startedAt: '2026-01-01T00:00:00.000Z',
    endedAt: null,
    educator: { id: 'educator-1', name: 'Ana Souza', email: 'ana@exemplo.com' },
  },
];

const ASSIGNED: AcademiaStudent = {
  id: 's1',
  name: 'Diego Martins',
  email: 'diego@exemplo.com',
  professionalId: 'educator-1',
};

const UNASSIGNED: AcademiaStudent = {
  id: 's2',
  name: 'Carla Nunes',
  email: 'carla@exemplo.com',
  professionalId: null,
};

describe('StudentsAssignSection — gym-foundation US-014, US-015', () => {
  it('shows the roster of active employments as options, with the assigned one selected', () => {
    const html = renderToStaticMarkup(
      <StudentsAssignSection students={[ASSIGNED]} employments={EMPLOYMENTS} />
    );

    expect(html).toContain('Diego Martins');
    expect(html).toContain('Ana Souza');
    expect(html).toContain('value="educator-1" selected=""');
  });

  it('marks a student with no educator clearly, never a blank or false name (US-015.AC-1)', () => {
    const html = renderToStaticMarkup(
      <StudentsAssignSection
        students={[UNASSIGNED]}
        employments={EMPLOYMENTS}
      />
    );

    expect(html).toContain('Sem educador atribuído');
    expect(html).toContain('value="" selected=""');
  });

  it('shows an explicit empty state with no academia students yet', () => {
    const html = renderToStaticMarkup(
      <StudentsAssignSection students={[]} employments={[]} />
    );

    expect(html).toContain('Nenhum aluno da academia cadastrado ainda.');
  });
});
