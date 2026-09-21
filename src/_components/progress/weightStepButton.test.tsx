import { WeightStepButton } from '@/_components/progress/weightStepButton';
import { canStepWeight } from '@/_lib/weightStepper';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

function render(direction: 1 | -1, currentKg: number | undefined) {
  return renderToStaticMarkup(
    <WeightStepButton
      direction={direction}
      disabled={!canStepWeight(currentKg, direction)}
      onStep={() => {}}
      canStep={() => canStepWeight(currentKg, direction)}
    />
  );
}

describe('prefill last weight — weight step button', () => {
  // UT-020
  it('names both directions and keeps a 44 px target', () => {
    const decrease = render(-1, 82.4);
    const increase = render(1, 82.4);

    expect(decrease).toContain('aria-label="Diminuir peso"');
    expect(increase).toContain('aria-label="Aumentar peso"');
    // `size-11` é 2.75rem = 44 px, o alvo mínimo pedido (ADR-003).
    expect(decrease).toContain('size-11');
    expect(increase).toContain('size-11');
    // `disabled` também aparece em classes utilitárias; só o atributo conta.
    expect(decrease).not.toContain('disabled=""');
    expect(increase).not.toContain('disabled=""');
  });

  // UT-020 — limites
  it('is disabled at each limit and only at that limit', () => {
    expect(render(1, 300)).toContain('disabled=""');
    expect(render(-1, 300)).not.toContain('disabled=""');
    expect(render(-1, 20)).toContain('disabled=""');
    expect(render(1, 20)).not.toContain('disabled=""');
    // Campo vazio: o passo parte da regra padrão, então nada fica desabilitado.
    expect(render(1, undefined)).not.toContain('disabled=""');
    expect(render(-1, undefined)).not.toContain('disabled=""');
  });
});
