import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({
    isPending: false,
    isError: false,
    execute: vi.fn(),
  }),
}));
vi.mock('@/_actions/academia/changeBillingTerms', () => ({
  changeBillingTerms: {},
}));

import { ChangeTermsForm } from './changeTermsForm';

describe('ChangeTermsForm — financial-health US-014', () => {
  const html = renderToStaticMarkup(
    <ChangeTermsForm clientId="client-1" onChanged={() => {}} />
  );

  it('offers the due days 1 to 28 plus an option that keeps the current one', () => {
    expect([...html.matchAll(/<option /g)]).toHaveLength(29);
    expect(html).toContain('Manter o atual');
    expect(html).toContain('Novo dia de vencimento');
  });

  it('says the change applies only to fees not yet issued', () => {
    expect(html).toContain('ainda não emitidas');
    expect(html).toContain('Salvar condições');
  });

  it('starts empty: nothing is sent unless the owner fills it in', () => {
    expect(html).toContain('placeholder="Manter o atual"');
    expect(html).not.toContain('Condições atualizadas.');
    expect(html).not.toContain('role="alert"');
  });
});
