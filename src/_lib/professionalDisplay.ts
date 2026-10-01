const TYPE_LABELS: Record<string, string> = {
  NUTRITIONIST: 'Nutricionista',
  PHYSICAL_EDUCATOR: 'Educador físico',
};

export function professionalTypeLabel(type: string): string {
  return TYPE_LABELS[type] ?? type;
}

export function formatPrice(priceFrom: number | null): string {
  if (priceFrom === null) return 'Preço não informado';
  return `A partir de ${priceFrom.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })}`;
}
