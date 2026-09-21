import { sectionsForType } from '@/_lib/navigation';
import type { PlanType } from '@/_lib/planSelection';

/** Tipos de plano que atendem clientes; os demais escondem a seção Pessoas. */
const PROFESSIONAL_TYPES: PlanType[] = ['NUTRITIONIST', 'PHYSICAL_EDUCATOR'];

export interface PlanChangeSummary {
  /** O público do plano muda (pessoal ↔ profissional ou entre profissões). */
  audienceChange: boolean;
  /** Seções que passam a aparecer, pela mesma regra do menu. */
  gainedSections: string[];
  /** Seções que deixam de aparecer. */
  lostSections: string[];
  /**
   * Quantos alunos ficam escondidos (nunca apagados, ADR-005). `'unknown'` só
   * quando o número não veio e a troca realmente esconde a seção.
   */
  hiddenClients: number | 'unknown' | 0;
  /** Como a troca é cobrada; sem valores exatos, de propósito (ADR-010). */
  charge: 'checkout' | 'immediate-proration';
}

interface PlanChangeInput {
  current: { id: string | null; type: PlanType };
  target: { id: string; type: PlanType };
  hasActiveSubscription: boolean;
  clientsCount: number | null;
}

function isProfessional(type: PlanType): boolean {
  return PROFESSIONAL_TYPES.includes(type);
}

function difference(left: string[], right: string[]): string[] {
  return left.filter(section => !right.includes(section));
}

/**
 * O que muda ao sair do plano atual para o alvo. As seções vêm da tabela de
 * rotas, então a cópia do diálogo não pode divergir do menu (ADR-010). Devolve
 * `null` quando o alvo já é o plano vigente — não há o que confirmar.
 */
export function summarizePlanChange({
  current,
  target,
  hasActiveSubscription,
  clientsCount,
}: PlanChangeInput): PlanChangeSummary | null {
  if (current.id && current.id === target.id) return null;

  const currentSections = sectionsForType(current.type);
  const targetSections = sectionsForType(target.type);

  const losesClients =
    isProfessional(current.type) && !isProfessional(target.type);

  return {
    audienceChange: current.type !== target.type,
    gainedSections: difference(targetSections, currentSections),
    lostSections: difference(currentSections, targetSections),
    hiddenClients: losesClients ? (clientsCount ?? 'unknown') : 0,
    charge: hasActiveSubscription ? 'immediate-proration' : 'checkout',
  };
}
