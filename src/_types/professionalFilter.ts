export interface ProfessionalFilter {
  type?: 'NUTRITIONIST' | 'PHYSICAL_EDUCATOR';
  specialty?: string;
  priceMax?: number;
  online?: boolean;
}

/** Filters the user can change in one call. */
export type ProfessionalFilterChange = Partial<ProfessionalFilter>;
