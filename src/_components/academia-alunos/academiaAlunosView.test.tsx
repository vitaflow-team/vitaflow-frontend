import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { AcademiaEmployment } from '@/_types/academia';
import type { AcademiaAlunosList } from '@/_types/academiaAlunos';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({
    isPending: false,
    isError: false,
    execute: vi.fn(),
  }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), replace: vi.fn() }),
}));
vi.mock('@/_actions/academia/registerAcademiaStudent', () => ({
  registerAcademiaStudent: {},
}));
vi.mock('@/_actions/academia/assignEducator', () => ({ assignEducator: {} }));
vi.mock('@/_actions/academia/getCurrentAccessPlan', () => ({
  getCurrentAccessPlan: {},
}));
vi.mock('@/_actions/academia/assignAccessPlan', () => ({
  assignAccessPlan: {},
}));
vi.mock('@/_actions/academia/listAccessPlansCatalog', () => ({
  listAccessPlansCatalog: {},
}));
vi.mock('@/_components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
}));

import { AcademiaAlunosView } from './academiaAlunosView';

const EMPLOYMENTS: AcademiaEmployment[] = [
  {
    id: 'emp-1',
    educatorId: 'edu-1',
    status: 'ACTIVE',
    startedAt: '2026-01-10T00:00:00.000Z',
    endedAt: null,
    educator: { id: 'edu-1', name: 'Carla Lima', email: 'carla@exemplo.com' },
  },
];

const EMPTY: AcademiaAlunosList = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 50,
};

const POPULATED: AcademiaAlunosList = {
  items: [
    {
      id: 's1',
      name: 'Diego Martins',
      email: 'diego@exemplo.com',
      assignedEducator: { id: 'edu-1', name: 'Carla Lima' },
      nextSession: { startAt: '2026-11-02T13:00:00.000Z', type: 'PRESENCIAL' },
    },
    {
      id: 's2',
      name: 'Fernanda Souza',
      email: 'fernanda@exemplo.com',
      assignedEducator: null,
      nextSession: null,
    },
  ],
  total: 2,
  page: 1,
  pageSize: 50,
};

describe('AcademiaAlunosView — gym-students US-001, US-002, US-003, US-008, US-010', () => {
  it('shows the empty state with a direct-registration CTA for a fresh academia', () => {
    const html = renderToStaticMarkup(
      <AcademiaAlunosView
        list={EMPTY}
        employments={EMPLOYMENTS}
        horario={undefined}
      />
    );

    expect(html).toContain('Você ainda não tem alunos');
    expect(html).toContain('Novo aluno');
  });

  it('shows the distinct no-results state for a non-matching search, never the empty state', () => {
    const html = renderToStaticMarkup(
      <AcademiaAlunosView
        list={EMPTY}
        employments={EMPLOYMENTS}
        search="zzz"
        horario={undefined}
      />
    );

    expect(html).toContain('Nenhum aluno encontrado');
    expect(html).not.toContain('Você ainda não tem alunos');
  });

  it('renders assigned and unassigned rows with the right horário and educator indicators', () => {
    const html = renderToStaticMarkup(
      <AcademiaAlunosView
        list={POPULATED}
        employments={EMPLOYMENTS}
        horario={undefined}
      />
    );

    expect(html).toContain('Diego Martins');
    expect(html).toContain('Educador: Carla Lima');
    expect(html).toContain('Com horário');

    expect(html).toContain('Fernanda Souza');
    expect(html).toContain('Sem educador');
    expect(html).toContain('Sem horário');
  });

  it('renders the horário filter tabs with the selected one marked', () => {
    const html = renderToStaticMarkup(
      <AcademiaAlunosView
        list={POPULATED}
        employments={EMPLOYMENTS}
        horario="COM"
      />
    );

    expect(html).toContain('Todos');
    expect(html).toContain('Com horário');
    expect(html).toContain('Sem horário');
    expect(html).toContain('aria-selected="true"');
  });
});
