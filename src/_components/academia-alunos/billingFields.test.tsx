import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BillingFields } from './billingFields';

const VALUES = { dueDay: 17, amountText: '149,90', cpfCnpj: '' };

function render(needsTaxId: boolean) {
  return renderToStaticMarkup(
    <BillingFields
      values={VALUES}
      onChange={() => {}}
      needsTaxId={needsTaxId}
      disabled={false}
    />
  );
}

describe('BillingFields', () => {
  it('UT-141 offers the due days 1 to 28 and prefills the amount with the plan price', () => {
    const html = render(false);

    expect([...html.matchAll(/<option /g)]).toHaveLength(28);
    expect(html).toContain('value="149,90"');
    expect(html).toContain('Valor da mensalidade (R$)');
  });

  it('asks for the tax ID only when it is missing', () => {
    expect(render(false)).not.toContain('CPF ou CNPJ do aluno');

    const html = render(true);
    expect(html).toContain('CPF ou CNPJ do aluno');
    expect(html).toContain('sem ele a mensalidade não pode');
  });
});
