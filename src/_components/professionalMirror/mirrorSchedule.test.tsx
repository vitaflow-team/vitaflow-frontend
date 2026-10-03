import type {
  EducatorMirror,
  MirrorWorkout,
} from '@/_types/professionalMirror';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EducatorMirrorView } from './educatorMirrorView';
import { MirrorWorkoutCard } from './mirrorWorkoutCard';

const BASE: EducatorMirror = {
  professional: { id: 'p1', name: 'Thiago', specialty: null },
  todayWorkout: null,
  nextSchedule: null,
  physicalAssessment: null,
  billingStatus: null,
};

const WORKOUT: MirrorWorkout = {
  id: 'w1',
  title: 'Hipertrofia',
  weeklyFrequency: 3,
  todaySessionId: 's2',
  sessions: [
    { id: 's1', label: 'A', name: 'Peito', exerciseCount: 4 },
    { id: 's2', label: 'B', name: 'Costas', exerciseCount: 3 },
  ],
};

describe('mirror next time (UT-118)', () => {
  it('shows weekday, time, type and the session name', () => {
    const html = renderToStaticMarkup(
      <EducatorMirrorView
        mirror={{
          ...BASE,
          nextSchedule: {
            startAt: '2026-10-14T10:00:00.000Z',
            endAt: '2026-10-14T11:00:00.000Z',
            type: 'ONLINE',
            onlineLink: null,
            workoutLetter: 'A',
            workoutSessionName: 'Peito',
          },
        }}
      />
    );

    expect(html).toContain('Próximo horário');
    expect(html).toContain('Online');
    expect(html).toContain('Treino A — Peito');
  });

  it('keeps the honest empty state for a null next time', () => {
    const html = renderToStaticMarkup(<EducatorMirrorView mirror={BASE} />);

    expect(html).toContain('Nenhum horário agendado ainda.');
  });
});

describe('mirror workout today marker (UT-119)', () => {
  it('names today’s session in text, and names none when there is none', () => {
    const today = renderToStaticMarkup(<MirrorWorkoutCard workout={WORKOUT} />);
    const none = renderToStaticMarkup(
      <MirrorWorkoutCard workout={{ ...WORKOUT, todaySessionId: null }} />
    );

    expect(today).toContain('Hoje');
    expect(today.match(/>Hoje</g)).toHaveLength(1);
    expect(none).not.toContain('>Hoje<');
  });
});
