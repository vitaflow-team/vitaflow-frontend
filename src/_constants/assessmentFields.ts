export type AssessmentFieldName =
  | 'weightKg'
  | 'heightCm'
  | 'bodyFatPercent'
  | 'restingHeartRate'
  | 'flexibilityCm'
  | 'armCm'
  | 'chestCm'
  | 'waistCm'
  | 'abdomenCm'
  | 'hipCm'
  | 'thighCm'
  | 'calfCm';

export interface AssessmentFieldDef {
  name: AssessmentFieldName;
  label: string;
  unit: string;
  /** Inclusive limits; the same as the backend's (educator-students limits). */
  min: number;
  max: number;
  /** Whole numbers only (resting heart rate); every other field takes one decimal. */
  integer?: boolean;
  required?: boolean;
  /** Grammatical gender of the label, for "obrigatório" / "obrigatória". */
  feminine?: boolean;
}

export const ASSESSMENT_REQUIRED_FIELDS: AssessmentFieldDef[] = [
  {
    name: 'weightKg',
    label: 'Peso',
    unit: 'kg',
    min: 20,
    max: 300,
    required: true,
  },
  {
    name: 'heightCm',
    label: 'Altura',
    unit: 'cm',
    min: 50,
    max: 250,
    required: true,
    feminine: true,
  },
];

export const ASSESSMENT_COMPOSITION_FIELDS: AssessmentFieldDef[] = [
  {
    name: 'bodyFatPercent',
    label: 'Gordura corporal',
    unit: '%',
    min: 1,
    max: 70,
  },
  {
    name: 'restingHeartRate',
    label: 'Frequência cardíaca de repouso',
    unit: 'bpm',
    min: 30,
    max: 150,
    integer: true,
  },
  {
    name: 'flexibilityCm',
    label: 'Flexibilidade',
    unit: 'cm',
    min: -50,
    max: 80,
  },
];

export const ASSESSMENT_CIRCUMFERENCE_FIELDS: AssessmentFieldDef[] = [
  { name: 'armCm', label: 'Braço', unit: 'cm', min: 10, max: 200 },
  { name: 'chestCm', label: 'Peitoral', unit: 'cm', min: 10, max: 200 },
  { name: 'waistCm', label: 'Cintura', unit: 'cm', min: 30, max: 200 },
  { name: 'abdomenCm', label: 'Abdômen', unit: 'cm', min: 10, max: 200 },
  { name: 'hipCm', label: 'Quadril', unit: 'cm', min: 30, max: 200 },
  { name: 'thighCm', label: 'Coxa', unit: 'cm', min: 10, max: 200 },
  { name: 'calfCm', label: 'Panturrilha', unit: 'cm', min: 10, max: 200 },
];

export const ASSESSMENT_FIELDS: AssessmentFieldDef[] = [
  ...ASSESSMENT_REQUIRED_FIELDS,
  ...ASSESSMENT_COMPOSITION_FIELDS,
  ...ASSESSMENT_CIRCUMFERENCE_FIELDS,
];

/** Student limits, the same as the backend's. */
export const STUDENT_NAME_MAX_LENGTH = 120;
export const STUDENT_MIN_AGE_YEARS = 5;
export const STUDENT_MAX_AGE_YEARS = 120;
