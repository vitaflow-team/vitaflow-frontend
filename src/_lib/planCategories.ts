import type { Product } from '@/_actions/products/getPlans';
import type { PlanType } from '@/_lib/planSelection';

/** Chaves das sub-abas da aba Plano, na ordem em que aparecem (ADR-001). */
export const PLAN_CATEGORY_KEYS = [
  'usuario',
  'nutricionista',
  'educador-fisico',
] as const;

export type PlanCategoryKey = (typeof PLAN_CATEGORY_KEYS)[number];

export const PLAN_CATEGORY_LABELS: Record<PlanCategoryKey, string> = {
  usuario: 'Usuário',
  nutricionista: 'Nutricionista',
  'educador-fisico': 'Educador físico',
};

/** Conta sem produto (ou com um produto fora do catálogo) vale como comum. */
const DEFAULT_TYPE: PlanType = 'USER';
const DEFAULT_CATEGORY: PlanCategoryKey = 'usuario';

/**
 * O enum de tipo do backend continua sendo a verdade; a categoria é só o
 * vocabulário da interface (ADR-002).
 */
const CATEGORY_OF_TYPE: Record<PlanType, PlanCategoryKey> = {
  USER: 'usuario',
  NUTRITIONIST: 'nutricionista',
  PHYSICAL_EDUCATOR: 'educador-fisico',
};

export function categoryOfType(type: PlanType): PlanCategoryKey {
  return CATEGORY_OF_TYPE[type];
}

/**
 * Sub-aba aberta ao entrar: a do próprio usuário. Tipo ausente, nulo ou fora do
 * enum não é erro — o catálogo comum é o palpite mais útil (US-006.EC-1).
 */
export function initialCategory(
  type: PlanType | string | null | undefined
): PlanCategoryKey {
  if (typeof type !== 'string') return DEFAULT_CATEGORY;

  return CATEGORY_OF_TYPE[type as PlanType] ?? DEFAULT_CATEGORY;
}

/**
 * Os planos de uma categoria, do mais barato ao mais caro e, no empate, em
 * ordem alfabética (US-009.EC-2). A lista recebida não é tocada: ela é a mesma
 * referência que o componente guarda para as outras categorias (ADR-003).
 */
export function filterPlansByCategory(
  plans: Product[],
  key: PlanCategoryKey
): Product[] {
  return plans
    .filter(plan => categoryOfType(plan.type) === key)
    .sort(
      (left, right) =>
        left.price - right.price || left.name.localeCompare(right.name, 'pt-BR')
    );
}

/**
 * O plano vigente é resolvido sobre a lista inteira, independente da categoria
 * visível — quem paga um plano profissional continua vendo "Seu plano atual"
 * ao abrir a aba dele (ADR-003). Sem produto conhecido, o plano de preço zero
 * responde pela conta.
 */
export function resolveCurrentPlan(
  plans: Product[],
  productId?: string | null
): { id: string | null; type: PlanType } {
  const current = productId
    ? plans.find(plan => plan.id === productId)
    : undefined;

  if (current) return { id: current.id, type: current.type };

  const free =
    plans.find(plan => plan.price === 0 && plan.type === DEFAULT_TYPE) ??
    plans.find(plan => plan.price === 0);

  return { id: free?.id ?? null, type: free?.type ?? DEFAULT_TYPE };
}

/**
 * Navegação por teclado do tablist: setas circulam, Home e End vão às pontas e
 * qualquer outra tecla não mexe na seleção (US-008).
 */
export function moveCategory(
  current: PlanCategoryKey,
  key: string
): PlanCategoryKey {
  const last = PLAN_CATEGORY_KEYS.length - 1;
  const index = PLAN_CATEGORY_KEYS.indexOf(current);

  switch (key) {
    case 'ArrowRight':
      return PLAN_CATEGORY_KEYS[index === last ? 0 : index + 1];
    case 'ArrowLeft':
      return PLAN_CATEGORY_KEYS[index === 0 ? last : index - 1];
    case 'Home':
      return PLAN_CATEGORY_KEYS[0];
    case 'End':
      return PLAN_CATEGORY_KEYS[last];
    default:
      return current;
  }
}
