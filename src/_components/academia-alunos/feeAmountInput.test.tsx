import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FeeAmountInput } from './feeAmountInput';

describe('FeeAmountInput', () => {
  it('labels the field and shows the value it was given', () => {
    const html = renderToStaticMarkup(
      <FeeAmountInput
        id="fee"
        label="Valor da mensalidade (R$)"
        value="149,90"
        onChange={() => {}}
      />
    );

    expect(html).toContain('<label for="fee"');
    expect(html).toContain('Valor da mensalidade (R$)');
    expect(html).toContain('value="149,90"');
    expect(html).toContain('inputMode="decimal"');
  });

  it('can be disabled and carry its own placeholder', () => {
    const html = renderToStaticMarkup(
      <FeeAmountInput
        id="fee"
        label="Novo valor"
        value=""
        placeholder="Manter o atual"
        disabled
        onChange={() => {}}
      />
    );

    expect(html).toContain('placeholder="Manter o atual"');
    expect(html).toMatch(/\sdisabled=""/);
  });
});
