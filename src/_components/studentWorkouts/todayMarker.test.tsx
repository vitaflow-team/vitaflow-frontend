import type { StudentEducatorWorkout } from '@/_types/educatorWorkouts';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EducatorWorkoutView } from './educatorWorkoutView';

function item(todaySessionId: string | null): StudentEducatorWorkout {
  return {
    educator: { id: 'e1', name: 'Thiago' },
    todaySessionId,
    workout: {
      id: 'w1',
      title: 'Hipertrofia',
      weeklyFrequency: 3,
      updatedAt: '2026-10-01T10:00:00.000Z',
      sessions: [
        { id: 's1', label: 'A', name: 'Peito', exercises: [] },
        { id: 's2', label: 'B', name: 'Costas', exercises: [] },
      ],
    },
  } as StudentEducatorWorkout;
}

describe('educator workout today marker (UT-120)', () => {
  it('marks today’s session with the text "Hoje"', () => {
    const html = renderToStaticMarkup(
      <EducatorWorkoutView item={item('s2')} />
    );

    expect(html.match(/>Hoje</g)).toHaveLength(1);
    expect(html.indexOf('Costas')).toBeLessThan(html.indexOf('>Hoje<'));
  });

  it('marks none when today’s session is null', () => {
    const html = renderToStaticMarkup(
      <EducatorWorkoutView item={item(null)} />
    );

    expect(html).not.toContain('>Hoje<');
  });
});
