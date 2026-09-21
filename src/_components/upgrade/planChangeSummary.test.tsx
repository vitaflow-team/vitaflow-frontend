import {
  audienceLabel,
  chargeLine,
  hiddenClientsLine,
  PlanChangeSummary,
  sectionsLine,
} from '@/_components/upgrade/planChangeSummary';
import { summarizePlanChange } from '@/_lib/planChangeSummary';
import type { PlanType } from '@/_lib/planSelection';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

describe('plan change summary copy', () => {
  it('Should stay silent about clients when none would be hidden', () => {
    expect(hiddenClientsLine(0)).toBeNull();
  });

  it('Should name the number of hidden clients in singular and plural', () => {
    expect(hiddenClientsLine(1)).toContain('1 aluno/paciente ficará oculto');
    expect(hiddenClientsLine(3)).toContain(
      '3 alunos/pacientes ficarão ocultos'
    );
  });

  it('Should never promise a count it does not have', () => {
    const line = hiddenClientsLine('unknown');
    expect(line).toBeTruthy();
    expect(line).not.toMatch(/\d/);
    expect(line).toContain('Nada é apagado');
  });

  it('Should say clients are hidden and not deleted', () => {
    expect(hiddenClientsLine(3)).toContain('não apagados');
    expect(hiddenClientsLine('unknown')).toContain('ocultos');
  });

  it('Should describe the charge without exact amounts', () => {
    expect(chargeLine('checkout')).toContain('Stripe');
    expect(chargeLine('immediate-proration')).toContain('proporcionalmente');
    expect(chargeLine('immediate-proration')).not.toMatch(/R\$/);
  });

  it('Should label every audience', () => {
    expect(audienceLabel('USER')).toBe('uso pessoal');
    expect(audienceLabel('NUTRITIONIST')).toBe('nutricionista');
    expect(audienceLabel('PHYSICAL_EDUCATOR')).toBe('educador físico');
  });

  it('Should list sections as readable text', () => {
    expect(sectionsLine(['Pessoas', 'Treinos'])).toBe('Pessoas, Treinos');
  });
});

interface Case {
  currentId: string | null;
  currentType: PlanType;
  currentName: string;
  targetId: string;
  targetType: PlanType;
  targetName: string;
  hasActiveSubscription: boolean;
  clientsCount: number | null;
}

/** O bloco do diálogo como texto visível, sem marcação. */
function render(input: Case): string {
  const summary = summarizePlanChange({
    current: { id: input.currentId, type: input.currentType },
    target: { id: input.targetId, type: input.targetType },
    hasActiveSubscription: input.hasActiveSubscription,
    clientsCount: input.clientsCount,
  });

  return renderToStaticMarkup(
    <PlanChangeSummary
      summary={summary}
      currentPlanName={input.currentName}
      targetPlanName={input.targetName}
      currentType={input.currentType}
      targetType={input.targetType}
    />
  )
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ');
}

const FREE_TO_NUTRI: Case = {
  currentId: 'free',
  currentType: 'USER',
  currentName: 'Gratuito',
  targetId: 'nutri-pro',
  targetType: 'NUTRITIONIST',
  targetName: 'Profissional',
  hasActiveSubscription: false,
  clientsCount: 0,
};

const PE_TO_PREMIUM: Case = {
  currentId: 'pe-pro',
  currentType: 'PHYSICAL_EDUCATOR',
  currentName: 'Profissional',
  targetId: 'premium',
  targetType: 'USER',
  targetName: 'Premium',
  hasActiveSubscription: true,
  clientsCount: 3,
};

describe('plan change summary dialog block', () => {
  it('Should show current and new plan, the audience change, gained access and the checkout', () => {
    const body = render(FREE_TO_NUTRI);

    expect(body).toContain('Plano atual: Gratuito');
    expect(body).toContain('Novo plano: Profissional');
    expect(body).toContain('A conta passa de uso pessoal para nutricionista');
    expect(body).toContain('Você passa a ter acesso a: Pessoas');
    expect(body).toContain('Seus dados pessoais, medidas e histórico');
    expect(body).toContain('página segura do Stripe');
    expect(body).not.toContain('ficarão ocultos');
  });

  it('Should say what is lost, how many clients are hidden and that the switch is proportional', () => {
    const body = render(PE_TO_PREMIUM);

    expect(body).toContain('A conta passa de educador físico para uso pessoal');
    expect(body).toContain('Você deixa de ter acesso a: Pessoas');
    expect(body).toContain('3 alunos/pacientes ficarão ocultos, não apagados');
    expect(body).toContain('proporcionalmente');
  });

  it('Should keep silent about clients when the professional has none', () => {
    const body = render({ ...PE_TO_PREMIUM, clientsCount: 0 });

    expect(body).toContain('Você deixa de ter acesso a: Pessoas');
    expect(body).not.toContain('ficarão ocultos');
    expect(body).not.toContain('ficará oculto');
  });

  it('Should fall back to a generic sentence when the count is unknown', () => {
    const body = render({ ...PE_TO_PREMIUM, clientsCount: null });

    expect(body).toContain(
      'Seus alunos/pacientes continuam salvos e ficam ocultos'
    );
  });

  it('Should render nothing when the target is already the current plan', () => {
    const body = render({
      ...FREE_TO_NUTRI,
      targetId: 'free',
      targetType: 'USER',
      targetName: 'Gratuito',
    });

    expect(body.trim()).toBe('');
  });

  it('Should not mention access changes when only the profession changes', () => {
    const body = render({
      currentId: 'nutri-pro',
      currentType: 'NUTRITIONIST',
      currentName: 'Profissional',
      targetId: 'pe-pro',
      targetType: 'PHYSICAL_EDUCATOR',
      targetName: 'Profissional',
      hasActiveSubscription: true,
      clientsCount: 3,
    });

    expect(body).toContain(
      'A conta passa de nutricionista para educador físico'
    );
    expect(body).not.toContain('passa a ter acesso');
    expect(body).not.toContain('deixa de ter acesso');
    expect(body).not.toContain('ficarão ocultos');
  });
});
