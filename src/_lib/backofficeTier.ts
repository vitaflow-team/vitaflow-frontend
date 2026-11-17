import type { BackofficeTier } from '@/_types/backofficeStaff';

const TIER_LABELS: Record<BackofficeTier, string> = {
  EQUIPE: 'Equipe',
  ADMIN: 'Admin interno',
};

/** The tier as the staff screens name it; a missing tier reads as Equipe. */
export function backofficeTierLabel(tier: BackofficeTier | null): string {
  return TIER_LABELS[tier ?? 'EQUIPE'];
}
