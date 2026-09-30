import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/exercises/approveExercise', () => ({
  approveExercise: vi.fn(),
}));
vi.mock('@/_actions/exercises/rejectExercise', () => ({
  rejectExercise: vi.fn(),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

import { exerciseFixture } from './exerciseFixture';
import { PendingQueue } from './pendingQueue';
import { SubmissionList } from './submissionList';

function text(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ');
}

describe('educator submissions list', () => {
  it('shows each submission with its status (US-007.AC-1)', () => {
    const body = text(
      renderToStaticMarkup(
        <SubmissionList
          submissions={[
            exerciseFixture({ id: 'a', name: 'Remada', status: 'PENDING' }),
            exerciseFixture({ id: 'b', name: 'Crucifixo', status: 'APPROVED' }),
            exerciseFixture({ id: 'c', name: 'Rosca', status: 'REJECTED' }),
          ]}
        />
      )
    );

    expect(body).toContain('Remada Em revisão');
    expect(body).toContain('Crucifixo Aprovado');
    expect(body).toContain('Rosca Recusado');
  });

  it('shows a rejection reason only when one was given (US-007.EC-2)', () => {
    const withReason = text(
      renderToStaticMarkup(
        <SubmissionList
          submissions={[
            exerciseFixture({
              status: 'REJECTED',
              rejectionReason: 'Duplicado de "Supino reto".',
            }),
          ]}
        />
      )
    );
    expect(withReason).toContain('Motivo: Duplicado de "Supino reto".');

    const withoutReason = text(
      renderToStaticMarkup(
        <SubmissionList
          submissions={[exerciseFixture({ status: 'REJECTED' })]}
        />
      )
    );
    expect(withoutReason).toContain('Recusado');
    expect(withoutReason).not.toContain('Motivo');
  });

  it('explains when nothing was submitted yet (US-007.EC-1)', () => {
    expect(
      text(renderToStaticMarkup(<SubmissionList submissions={[]} />))
    ).toContain('Você ainda não enviou nenhuma sugestão de exercício.');
  });
});

describe('backoffice pending queue', () => {
  it('shows the submitted content and who sent it (US-008.AC-1)', () => {
    const html = renderToStaticMarkup(
      <PendingQueue
        submissions={[
          exerciseFixture({
            status: 'PENDING',
            submittedById: '0190bbbb-0000-7000-8000-000000000000',
            contraindications: ['KNEE'],
            videoUrl: 'https://youtu.be/x',
          }),
        ]}
      />
    );
    const body = text(html);

    expect(body).toContain('Supino reto');
    expect(body).toContain('Peito · Academia · Intermediário');
    expect(body).toContain('Educador 0190bbbb');
    expect(body).toContain('Deitado no banco, empurre a barra.');
    expect(body).toContain('Joelho');
    expect(body).toContain('Ver vídeo');
    expect(body).toContain('Aprovar');
    expect(body).toContain('Recusar');
  });

  it('says there is nothing to review (US-008.EC-1)', () => {
    expect(
      text(renderToStaticMarkup(<PendingQueue submissions={[]} />))
    ).toContain('Nenhuma sugestão para revisar.');
  });
});
