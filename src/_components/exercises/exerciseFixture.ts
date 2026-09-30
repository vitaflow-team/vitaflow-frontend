import type { Exercise } from '@/_types/exercise';

/** A complete approved exercise for component and page tests. */
export function exerciseFixture(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: '0190aaaa-bbbb-7ccc-8ddd-eeeeffff0001',
    name: 'Supino reto',
    description: 'Deitado no banco, empurre a barra.',
    muscleGroup: 'Peito',
    primaryMuscles: ['Peito'],
    secondaryMuscles: ['Tríceps'],
    equipment: 'GYM',
    contraindications: [],
    difficulty: 'Intermediário',
    imageUrl: null,
    videoUrl: null,
    status: 'APPROVED',
    sourceAttribution: null,
    sourceLicense: null,
    submittedById: null,
    rejectionReason: null,
    createdAt: '2026-09-29T12:00:00.000Z',
    updatedAt: '2026-09-29T12:00:00.000Z',
    ...overrides,
  };
}
