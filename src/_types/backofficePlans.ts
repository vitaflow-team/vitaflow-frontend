/** Account type a product serves — mirrors the backend `ProductType` enum. */
export type ProductTypeName =
  | 'USER'
  | 'NUTRITIONIST'
  | 'PHYSICAL_EDUCATOR'
  | 'ACADEMIA';

/** Pricing tier a product sits in — mirrors the backend `ProductTier` enum. */
export type ProductTierName = 'FREE' | 'STANDARD' | 'PREMIUM';

/**
 * One row of the platform catalog, as `GET backoffice/plans` returns it
 * (TechSpec: Core Interfaces, `PlansService.listCatalog`). Inactive rows are
 * historical, versioned-away prices (ADR-004) — they keep appearing here so
 * admin staff can review them, unlike the public `/products`/`/plans`
 * endpoints (ADR-008).
 */
export interface ProductCatalogEntry {
  id: string;
  name: string;
  price: number;
  type: ProductTypeName;
  tier: ProductTierName;
  active: boolean;
  groupId: string;
  groupName: string;
}

/** Payload for `POST backoffice/plans` (TechSpec: Core Interfaces). */
export interface CreateProductInput {
  groupId: string;
  name: string;
  price: number;
  type: ProductTypeName;
  tier: ProductTierName;
}
