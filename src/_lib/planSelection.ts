import type {
  Product,
  ProductsPlan,
  ProductTypeName,
} from '@/_actions/products/getProdductsPlans';

/** Tipo de conta que um plano atende. */
export type PlanType = ProductTypeName;

export interface PlanSections {
  /** Grupos de planos pessoais ("Para você"), produtos ordenados por preço. */
  personal: ProductsPlan[];
  /** Grupos profissionais: Nutricionistas antes de Educadores físicos. */
  professional: ProductsPlan[];
  /** Produto marcado como "Seu plano atual"; `null` quando não dá para dizer. */
  currentProductId: string | null;
  /** Tipo do plano atual; `USER` quando não há produto ou ele é desconhecido. */
  currentType: PlanType;
}

/** Conta sem produto (ou com um produto fora do catálogo) vale como comum. */
const DEFAULT_TYPE: PlanType = 'USER';

/** Ordem das seções profissionais na aba Plano (ADR-001). */
const PROFESSIONAL_ORDER: PlanType[] = ['NUTRITIONIST', 'PHYSICAL_EDUCATOR'];

function findProduct(
  groups: ProductsPlan[],
  productId: string | null | undefined
): Product | null {
  if (!productId) return null;

  for (const group of groups) {
    const product = group.products.find(item => item.id === productId);
    if (product) return product;
  }

  return null;
}

function byPrice(products: Product[]): Product[] {
  return [...products].sort((left, right) => left.price - right.price);
}

/**
 * O vínculo tipo→grupo é implícito na semente (cada grupo guarda um tipo), mas
 * a divisão filtra os produtos em vez de confiar no grupo inteiro: um grupo
 * misto aparece em cada seção só com os planos daquele tipo, e um grupo sem
 * produto do tipo procurado fica de fora.
 */
function groupsOfTypes(
  groups: ProductsPlan[],
  types: PlanType[]
): ProductsPlan[] {
  return types.flatMap(type =>
    groups
      .map(group => ({
        ...group,
        products: byPrice(group.products.filter(item => item.type === type)),
      }))
      .filter(group => group.products.length > 0)
  );
}

/**
 * O catálogo inteiro em duas seções de público, com o plano vigente marcado.
 * Sem produto (ou com um produto que não está mais na lista) a conta vale como
 * `USER` e o plano de preço zero é o atual (ADR-001).
 */
export function groupPlans(
  groups: ProductsPlan[],
  productId: string | null | undefined
): PlanSections | null {
  if (groups.length === 0) return null;

  const current = findProduct(groups, productId);
  const free = groups
    .flatMap(group => group.products)
    .find(product => product.price === 0);

  return {
    personal: groupsOfTypes(groups, [DEFAULT_TYPE]),
    professional: groupsOfTypes(groups, PROFESSIONAL_ORDER),
    currentProductId: current?.id ?? free?.id ?? null,
    currentType: current?.type ?? DEFAULT_TYPE,
  };
}
