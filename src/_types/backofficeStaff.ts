export type BackofficeTier = 'EQUIPE' | 'ADMIN';

export interface StaffListItem {
  id: string;
  name: string;
  email: string;
  tier: BackofficeTier | null;
  active: boolean;
  createdAt: string;
}
