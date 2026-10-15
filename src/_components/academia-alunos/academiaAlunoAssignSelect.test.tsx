import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { AcademiaEmployment } from '@/_types/academia';
import type { AcademiaStudentListItem } from '@/_types/academiaAlunos';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({ isPending: false, execute: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_actions/academia/assignEducator', () => ({ assignEducator: {} }));

import { AcademiaAlunoAssignSelect } from './academiaAlunoAssignSelect';

const EMPLOYMENTS: AcademiaEmployment[] = [
  {
    id: 'e1',
    educatorId: 'educator-1',
    status: 'ACTIVE',
    startedAt: '2026-01-01T00:00:00.000Z',
    endedAt: null,
    educator: { id: 'educator-1', name: 'Ana Souza', email: 'ana@exemplo.com' },
  },
  {
    id: 'e2',
    educatorId: 'educator-2',
    status: 'ACTIVE',
    startedAt: '2026-02-01T00:00:00.000Z',
    endedAt: null,
    educator: {
      id: 'educator-2',
      name: 'Bruno Alves',
      email: 'bruno@exemplo.com',
    },
  },
];

function student(
  overrides: Partial<AcademiaStudentListItem>
): AcademiaStudentListItem {
  return {
    id: 's1',
    name: 'Diego Martins',
    email: 'diego@exemplo.com',
    assignedEducator: null,
    nextSession: null,
    ...overrides,
  };
}

describe('AcademiaAlunoAssignSelect — gym-students US-005, US-006, US-007', () => {
  it('IT-003 shows every currently-employed educator as an option, with the assigned one selected', () => {
    const html = renderToStaticMarkup(
      <AcademiaAlunoAssignSelect
        student={student({
          assignedEducator: { id: 'educator-1', name: 'Ana Souza' },
        })}
        employments={EMPLOYMENTS}
      />
    );

    expect(html).toContain('Ana Souza');
    expect(html).toContain('Bruno Alves');
    expect(html).toContain('value="educator-1" selected=""');
  });

  it('IT-003 marks an unassigned student with "Sem educador" selected, never blank or false', () => {
    const html = renderToStaticMarkup(
      <AcademiaAlunoAssignSelect
        student={student({ assignedEducator: null })}
        employments={EMPLOYMENTS}
      />
    );

    expect(html).toContain('Sem educador');
    expect(html).toContain('value="" selected=""');
  });

  it('IT-003 the picker only ever lists educators currently employed by this academia', () => {
    const html = renderToStaticMarkup(
      <AcademiaAlunoAssignSelect
        student={student({
          assignedEducator: { id: 'educator-2', name: 'Bruno Alves' },
        })}
        employments={[EMPLOYMENTS[1]]}
      />
    );

    expect(html).toContain('Bruno Alves');
    expect(html).not.toContain('Ana Souza');
  });
});
