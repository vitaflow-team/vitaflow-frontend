import { RecordFormSkeleton } from '@/_components/progress/recordFormSkeleton';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

describe('prefill last weight — record form skeleton', () => {
  // UT-015
  it('announces the loading state and blocks saving', () => {
    const markup = renderToStaticMarkup(<RecordFormSkeleton layout="sheet" />);

    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('Carregando último registro');
    expect(markup).toContain('Peso (kg)');
    expect(markup).toContain('Altura (cm)');
    expect(
      markup.match(/data-slot="skeleton"/g)?.length
    ).toBeGreaterThanOrEqual(2);
    expect(markup).toMatch(
      /<button[^>]*disabled[^>]*>Salvar registro<\/button>/
    );
  });

  // UT-015 — a mesma marcação essencial no diálogo
  it('keeps the same accessible loading markup on the dialog layout', () => {
    const markup = renderToStaticMarkup(<RecordFormSkeleton layout="dialog" />);

    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('Carregando último registro');
    expect(markup).toMatch(
      /<button[^>]*disabled[^>]*>Salvar registro<\/button>/
    );
  });
});
