import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { AcademiaEmployment } from '@/_types/academia';
import type { TurmaAgendaItem } from '@/_types/turmas';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({
    isPending: false,
    isError: false,
    execute: vi.fn(),
  }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_actions/academia/turmas/createTurma', () => ({ createTurma: {} }));
vi.mock('@/_actions/academia/turmas/updateTurma', () => ({ updateTurma: {} }));
vi.mock('@/_actions/academia/turmas/assignTurmaEducator', () => ({
  assignTurmaEducator: {},
}));
vi.mock('@/_actions/academia/turmas/removeTurma', () => ({ removeTurma: {} }));
vi.mock('@/_actions/academia/turmas/manualEnrollTurma', () => ({
  manualEnrollTurma: {},
}));
vi.mock('@/_actions/academia/turmas/searchAcademiaAlunos', () => ({
  searchAcademiaAlunos: {},
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
vi.mock('@/_components/ui/alert-dialog', () => ({
  AlertDialog: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  AlertDialogTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  AlertDialogCancel: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
  AlertDialogAction: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
}));

import { AcademiaTurmasView } from './academiaTurmasView';

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

const TURMAS: TurmaAgendaItem[] = [
  {
    id: 't1',
    name: 'Spinning',
    weekday: 2,
    startMinute: 600,
    durationMinutes: 60,
    capacity: 10,
    enrolledCount: 3,
    responsibleEducator: { id: 'edu-1', name: 'Carla Lima' },
  },
  {
    id: 't2',
    name: 'Yoga',
    weekday: 4,
    startMinute: 480,
    durationMinutes: 45,
    capacity: 8,
    enrolledCount: 8,
    responsibleEducator: null,
  },
];

describe('AcademiaTurmasView — gym-classes US-001, US-002, US-010, US-012', () => {
  it('shows the empty state with a create CTA for a gym with no turmas yet', () => {
    const html = renderToStaticMarkup(
      <AcademiaTurmasView turmas={[]} employments={EMPLOYMENTS} />
    );

    expect(html).toContain('Você ainda não tem turmas');
    expect(html).toContain('Nova turma');
  });

  it('renders every weekday column, marking empty days clearly', () => {
    const html = renderToStaticMarkup(
      <AcademiaTurmasView turmas={TURMAS} employments={EMPLOYMENTS} />
    );

    expect(html).toContain('Terça');
    expect(html).toContain('Quinta');
    expect(html).toContain('Segunda');
    expect(html).toContain('Nenhuma turma');
  });

  it('shows name, time, responsible educator or "sem responsável", and enrolled/capacity', () => {
    const html = renderToStaticMarkup(
      <AcademiaTurmasView turmas={TURMAS} employments={EMPLOYMENTS} />
    );

    expect(html).toContain('Spinning');
    expect(html).toContain('10:00');
    expect(html).toContain('Responsável: Carla Lima');
    expect(html).toContain('3/10 inscritos');

    expect(html).toContain('Yoga');
    expect(html).toContain('Sem responsável');
    expect(html).toContain('8/8 inscritos');
  });
});
