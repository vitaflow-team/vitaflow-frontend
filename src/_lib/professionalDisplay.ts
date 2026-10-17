const TYPE_LABELS: Record<string, string> = {
  NUTRITIONIST: 'Nutricionista',
  PHYSICAL_EDUCATOR: 'Educador físico',
};

export function professionalTypeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type;
}

/** CRN for a nutritionist, CREF for a physical educator (PRD ADR-009). */
export function registrationLabelFor(type: string): 'CRN' | 'CREF' | null {
  if (type === 'NUTRITIONIST') return 'CRN';
  if (type === 'PHYSICAL_EDUCATOR') return 'CREF';
  return null;
}

export function formatPrice(priceFrom: number | null): string {
  if (priceFrom === null) return 'Preço não informado';
  return `A partir de ${priceFrom.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })}`;
}
