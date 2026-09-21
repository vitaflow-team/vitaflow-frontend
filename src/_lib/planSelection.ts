import type { ProductTypeName } from '@/_actions/products/getProdductsPlans';

/**
 * Tipo de conta que um plano atende. O agrupamento em seções de público que
 * morava aqui saiu com as sub-abas de categoria (ADR-001); só o tipo, usado
 * pelos cards, pelo resumo de troca e pelo catálogo, continua.
 */
export type PlanType = ProductTypeName;
