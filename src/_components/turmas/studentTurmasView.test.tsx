import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { StudentTurmaItem } from '@/_types/studentTurmas';

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
vi.mock('@/_actions/turmas/enrollTurma', () => ({ enrollTurma: {} }));
vi.mock('@/_actions/turmas/cancelTurmaEnrollment', () => ({
  cancelTurmaEnrollment: {},
}));

import { StudentTurmasView } from './studentTurmasView';

function item(overrides: Partial<StudentTurmaItem> = {}): StudentTurmaItem {
  return {
    id: 't1',
    academiaId: 'academia-1',
    academiaName: 'Academia Vida Ativa',
    name: 'Spinning',
    weekday: 2,
    startMinute: 600,
    durationMinutes: 60,
    capacity: 10,
    enrolledCount: 3,
    responsibleEducator: { id: 'edu-1', name: 'Carla Lima' },
    enrolled: false,
    ...overrides,
  };
}

describe('StudentTurmasView — gym-classes US-006, US-007, US-008, US-011', () => {
  it('E2E-004 shows nothing (the empty state) for a student with no eligible turma at all', () => {
    const html = renderToStaticMarkup(<StudentTurmasView items={[]} />);

    expect(html).toContain('Nenhuma turma disponível');
    expect(html).not.toContain('Inscrever-se');
  });

  it('shows an available turma with an enroll action', () => {
    const html = renderToStaticMarkup(
      <StudentTurmasView
        items={[item({ enrolled: false, enrolledCount: 3 })]}
      />
    );

    expect(html).toContain('Spinning');
    expect(html).toContain('Academia Vida Ativa');
    expect(html).toContain('Inscrever-se');
    expect(html).not.toContain('Já inscrito');
  });

  it('E2E-002 marks an already-enrolled turma as "já inscrito", with a cancel action instead of enroll', () => {
    const html = renderToStaticMarkup(
      <StudentTurmasView items={[item({ enrolled: true })]} />
    );

    expect(html).toContain('Já inscrito');
    expect(html).toContain('Cancelar inscrição');
    expect(html).not.toContain('>Inscrever-se<');
  });

  it('shows "turma cheia" and disables enrollment when at capacity and not already enrolled', () => {
    const html = renderToStaticMarkup(
      <StudentTurmasView
        items={[item({ enrolled: false, enrolledCount: 10, capacity: 10 })]}
      />
    );

    expect(html).toContain('Turma cheia');
    expect(html).not.toContain('>Inscrever-se<');
  });
});
