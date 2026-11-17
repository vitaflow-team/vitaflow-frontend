export type BackofficeTier = 'EQUIPE' | 'ADMIN';

export interface StaffListItem {
  id: string;
  name: string;
  email: string;
  /** The tier held, or the one a pending invitation offers. */
  tier: BackofficeTier | null;
  active: boolean;
  /** `true` while the invitation has not been accepted. */
  pending: boolean;
  createdAt: string;
}
