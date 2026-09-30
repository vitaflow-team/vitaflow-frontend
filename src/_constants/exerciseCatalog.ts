import type { ExerciseContraindication } from '@/_types/exerciseContraindication';
import type { ExerciseEquipment } from '@/_types/exerciseEquipment';
import type { ExerciseStatus } from '@/_types/exerciseStatus';

/** Backend page size for `GET /exercises`. */
export const EXERCISE_PAGE_SIZE = 50;

/** The muscle groups the imported catalog is tagged with (task_03). */
export const MUSCLE_GROUPS = [
  'Abdômen',
  'Braços',
  'Costas',
  'Ombros',
  'Panturrilhas',
  'Peito',
  'Pernas',
] as const;

export const EQUIPMENT_LABELS: Record<ExerciseEquipment, string> = {
  GYM: 'Academia',
  HOME_BASIC: 'Casa com equipamento básico',
  BODYWEIGHT: 'Só peso corporal',
};

export const CONTRAINDICATION_LABELS: Record<ExerciseContraindication, string> =
  {
    SHOULDER: 'Ombro',
    KNEE: 'Joelho',
    SPINE: 'Coluna',
    WRIST: 'Punho',
    HIP: 'Quadril',
    ANKLE: 'Tornozelo',
    CARDIAC: 'Cardíaca',
  };

export const EXERCISE_STATUS_LABELS: Record<ExerciseStatus, string> = {
  PENDING: 'Em revisão',
  APPROVED: 'Aprovado',
  REJECTED: 'Recusado',
};

/** Addresses of the exercise screens. */
export const EXERCISE_ROUTES = {
  LIBRARY: '/restrict/exercises',
  SUBMISSIONS: '/restrict/exercises/submissions',
  BACKOFFICE: '/restrict/backoffice/exercises',
  BACKOFFICE_NEW: '/restrict/backoffice/exercises/new',
} as const;

/** Page titles of the exercise screens. */
export const EXERCISE_PAGE_TITLES = {
  library: 'Exercícios',
  exercise: 'Exercício',
  submissions: 'Minhas sugestões',
  backoffice: 'Catálogo de exercícios',
  backofficeForm: 'Cadastro de exercício',
} as const;
