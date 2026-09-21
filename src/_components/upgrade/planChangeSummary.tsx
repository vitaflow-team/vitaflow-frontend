import type { PlanChangeSummary as PlanChangeResult } from '@/_lib/planChangeSummary';
import type { PlanType } from '@/_lib/planSelection';

/** Como cada público é chamado na frase de mudança de conta (ADR-003). */
const AUDIENCE_LABEL: Record<PlanType, string> = {
  USER: 'uso pessoal',
  NUTRITIONIST: 'nutricionista',
  PHYSICAL_EDUCATOR: 'educador físico',
};

export function audienceLabel(type: PlanType): string {
  return AUDIENCE_LABEL[type] ?? AUDIENCE_LABEL.USER;
}

/**
 * Alunos/pacientes são escondidos, nunca apagados (ADR-005). Zero cala a linha
 * e a contagem ausente vira frase genérica: prometer um número que não veio
 * seria pior do que não citar o número (US-009.EC-1, US-009.EC-2).
 */
export function hiddenClientsLine(
  hiddenClients: PlanChangeResult['hiddenClients']
): string | null {
  if (hiddenClients === 'unknown') {
    return 'Seus alunos/pacientes continuam salvos e ficam ocultos enquanto a conta não estiver em um plano profissional. Nada é apagado.';
  }

  if (hiddenClients <= 0) {
    return null;
  }

  return hiddenClients === 1
    ? '1 aluno/paciente ficará oculto, não apagado. Voltando a um plano profissional, ele reaparece.'
    : `${hiddenClients} alunos/pacientes ficarão ocultos, não apagados. Voltando a um plano profissional, eles reaparecem.`;
}

/**
 * Descreve a cobrança sem valor exato: o preço fechado é o do Stripe, e
 * prometer um número aqui seria inventá-lo (ADR-010).
 */
export function chargeLine(charge: PlanChangeResult['charge']): string {
  return charge === 'checkout'
    ? 'O pagamento é feito na página segura do Stripe, aberta ao confirmar.'
    : 'A troca vale na hora: a diferença é cobrada ou creditada proporcionalmente ao tempo restante do período já pago.';
}

/** Lista de seções em frase, sem depender só de marcador visual. */
export function sectionsLine(sections: string[]): string {
  return sections.join(', ');
}

interface PlanChangeSummaryProps {
  /** `null` quando o alvo já é o plano atual: não há troca a resumir. */
  summary: PlanChangeResult | null;
  currentPlanName: string;
  targetPlanName: string;
  currentType: PlanType;
  targetType: PlanType;
}

/**
 * O que muda ao trocar de plano, em texto, dentro dos dois diálogos que já
 * existem ("Finalizar Assinatura" e "Trocar de plano"). O componente só
 * apresenta: a regra inteira vem de `summarizePlanChange`, que lê as seções da
 * tabela de rotas, então esta cópia não pode divergir do menu (ADR-010).
 */
export function PlanChangeSummary({
  summary,
  currentPlanName,
  targetPlanName,
  currentType,
  targetType,
}: PlanChangeSummaryProps) {
  if (!summary) {
    return null;
  }

  const clients = hiddenClientsLine(summary.hiddenClients);

  return (
    <div className="flex flex-col gap-2 rounded-md bg-secondary/40 p-4 text-left text-sm">
      <p>
        Plano atual: <strong>{currentPlanName}</strong>.
      </p>
      <p>
        Novo plano: <strong>{targetPlanName}</strong>.
      </p>
      {summary.audienceChange && (
        <p>
          A conta passa de <strong>{audienceLabel(currentType)}</strong> para{' '}
          <strong>{audienceLabel(targetType)}</strong>.
        </p>
      )}
      {summary.gainedSections.length > 0 && (
        <p>
          Você passa a ter acesso a:{' '}
          <strong>{sectionsLine(summary.gainedSections)}</strong>.
        </p>
      )}
      {summary.lostSections.length > 0 && (
        <p>
          Você deixa de ter acesso a:{' '}
          <strong>{sectionsLine(summary.lostSections)}</strong>.
        </p>
      )}
      <p>Seus dados pessoais, medidas e histórico de evolução são mantidos.</p>
      {clients && <p>{clients}</p>}
      <p>{chargeLine(summary.charge)}</p>
    </div>
  );
}
