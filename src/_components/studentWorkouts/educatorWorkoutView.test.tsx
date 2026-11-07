import type { StudentEducatorWorkout } from '@/_types/educatorWorkouts';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EducatorWorkoutView } from './educatorWorkoutView';

const ITEM: StudentEducatorWorkout = {
  educator: { id: 'ed1', name: 'Marcos Educador' },
  todaySessionId: null,
  workout: {
    id: 'w1',
    title: 'Treino de força',
    weeklyFrequency: 3,
    updatedAt: '2026-10-01T12:00:00.000Z',
    sessions: [
      {
        id: 's1',
        label: 'A',
        name: 'Superior',
        exercises: [
          {
            name: 'Supino',
            muscleGroup: 'Peito',
            sets: 3,
            reps: '10',
            load: '20kg',
            videoUrl: null,
          },
        ],
      },
    ],
  },
};

describe('EducatorWorkoutView — pdf-export US-008', () => {
  it('UT-039 renders an Exportar PDF link when an EducatorWorkout is linked', () => {
    const html = renderToStaticMarkup(<EducatorWorkoutView item={ITEM} />);

    expect(html).toContain('href="/api/me/educator-workouts/pdf"');
    expect(html).toContain('Exportar PDF');
  });
});

// UT-040 (boundary): there is no distinct "academia-only unsupported"
// rendering branch in this codebase today (confirmed by survey) — that
// backend failure collapses into the generic "no EducatorWorkout" case,
// which renders `GeneratedWorkoutView`/`ConversationChat` instead of this
// component (see `generatedWorkoutView.test.tsx`'s "never links to the
// EducatorWorkout export route" case and `conversationChat.test.tsx`'s
// UT-037 case) — `EducatorWorkoutView` itself requires a present `item`,
// so this link can never render without one.
