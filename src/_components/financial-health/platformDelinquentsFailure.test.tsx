import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PlatformDelinquentsFailure } from './platformDelinquentsFailure';

const PATH = '/restrict/backoffice/financial-health';
const QUERY = { month: '2026-11', page: 2 };

function render(
  failure: Parameters<typeof PlatformDelinquentsFailure>[0]['failure']
) {
  return renderToStaticMarkup(
    <PlatformDelinquentsFailure failure={failure} path={PATH} query={QUERY} />
  );
}

describe('PlatformDelinquentsFailure — financial-health US-023.EC-3', () => {
  it('has a dedicated state for an access that could not be recorded: an alert, no list, a retry', () => {
    const html = render('access-log-failed');

    expect(html).toContain('role="alert"');
    expect(html).toContain('Não foi possível registrar o seu acesso');
    expect(html).toContain('por isso ela não é exibida');
    expect(html).toContain(`href="${PATH}?month=2026-11&amp;page=2"`);
    expect(html).not.toContain('<ul');
  });

  it('keeps that state apart from the generic failure', () => {
    const generic = render('failed');

    expect(generic).toContain(
      'Não foi possível carregar a lista de inadimplentes'
    );
    expect(generic).not.toContain('registrar o seu acesso');
  });

  it('renders access denied without a retry for a 403 (not_backoffice)', () => {
    const html = render('forbidden');

    expect(html).toContain('Você não tem acesso a esta área.');
    expect(html).not.toContain('Tentar novamente');
  });
});
