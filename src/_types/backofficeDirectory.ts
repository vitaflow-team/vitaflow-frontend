export type DirectoryKind =
  | 'USER'
  | 'NUTRITIONIST'
  | 'PHYSICAL_EDUCATOR'
  | 'ACADEMIA_OWNER'
  | 'ACADEMIA_RECEPTIONIST';

export type DirectoryTypeFilter =
  | 'USER'
  | 'NUTRITIONIST'
  | 'PHYSICAL_EDUCATOR'
  | 'ACADEMIA';

export interface DirectoryResultItem {
  kind: DirectoryKind;
  id: string;
  name: string;
  email: string;
}

export interface DirectoryListResult {
  items: DirectoryResultItem[];
  total: number;
  page: number;
  pageSize: number;
}
