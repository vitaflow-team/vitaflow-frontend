export interface NutritionistPatientListItem {
  id: string;
  name: string;
  email: string;
  hasAccount: boolean;
}

export interface NutritionistPatientList {
  items: NutritionistPatientListItem[];
  total: number;
}

export interface NutritionistPatient {
  id: string;
  name: string;
  email: string;
  phone: string;
  hasAccount: boolean;
  userId: string | null;
  createdAt: string;
}
