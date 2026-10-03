import type {
  FixedTime,
  StudentSchedule,
  UpcomingSession,
} from '@/_types/educatorSchedule';
import type { ScheduleConflict } from '@/_types/scheduleOutcomes';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('zsa-react', () => ({
  useServerAction: () => ({ isPending: false, execute: vi.fn() }),
}));
vi.mock('@/_actions/students/schedule/createFixedTime', () => ({
  createFixedTime: {},
}));
vi.mock('@/_actions/students/schedule/updateFixedTime', () => ({
  updateFixedTime: {},
}));
vi.mock('@/_actions/students/schedule/removeFixedTime', () => ({
  removeFixedTime: {},
}));

import { ScheduleConflictNotice } from './scheduleConflictNotice';
import { ScheduleTab } from './scheduleTab';
import { FixedTimeFormFields, letterOptions } from './fixedTimeFormFields';
import { DEFAULT_DRAFT_FOR_TESTS } from './testDraft';
import { NextSessionCard } from './nextSessionCard';
import { FIXED_TIME_LIMIT } from '@/_constants/educatorScheduleLimits';

const ID = '01890a5d-ac96-774b-bcce-b302099a8057';

function fixed(overrides: Partial<FixedTime> = {}): FixedTime {
  return {
    id: `f-${Math.random()}`,
    weekday: 1,
    startMinute: 420,
    durationMinutes: 60,
    type: 'PRESENCIAL',
    onlineLink: null,
    workoutLetter: 'A',
    workoutSessionName: 'Peito',
    workoutMissing: false,
    ...overrides,
  };
}

function schedule(
  fixedTimes: FixedTime[],
  upcoming: UpcomingSession[] = []
): StudentSchedule {
  return { fixedTimes, upcoming };
}

function render(value: StudentSchedule, sessionNames = ['Peito']): string {
  return renderToStaticMarkup(
    <ScheduleTab studentId={ID} schedule={value} sessionNames={sessionNames} />
  );
}

describe('schedule tab (UT-101 to UT-106)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('UT-101 shows the seven days, the time with type and letter name, the coming sessions and the reminder note', () => {
    const html = render(
      schedule(
        [fixed({ weekday: 3, startMinute: 420 })],
        [
          {
            id: 'u1',
            source: 'FIXED',
            startAt: '2026-10-14T10:00:00.000Z',
            endAt: '2026-10-14T11:00:00.000Z',
            type: 'PRESENCIAL',
            onlineLink: null,
            status: 'CANCELED',
            workoutLetter: 'A',
            workoutSessionName: 'Peito',
          },
        ]
      )
    );

    for (const day of [
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Domingo',
    ]) {
      expect(html).toContain(day);
    }
    expect(html).toContain('07:00 às 08:00');
    expect(html).toContain('Treino A — Peito');
    expect(html).toContain('Cancelada: esta data não ocupa o horário');
    expect(html).toContain('Você e o aluno recebem um aviso uma hora antes');
  });

  it('UT-102 shows the empty state with "Adicionar horário" when there are no fixed times', () => {
    const html = render(schedule([]));

    expect(html).toContain('ainda não tem horário fixo');
    expect(html).toContain('Adicionar horário');
  });

  it('UT-103 lists several times on one day in time order', () => {
    const html = render(
      schedule([
        fixed({
          weekday: 1,
          startMinute: 18 * 60,
          workoutLetter: null,
          workoutSessionName: null,
        }),
        fixed({
          weekday: 1,
          startMinute: 7 * 60,
          workoutLetter: null,
          workoutSessionName: null,
        }),
      ])
    );

    expect(html.indexOf('07:00 às 08:00')).toBeLessThan(
      html.indexOf('18:00 às 19:00')
    );
  });

  it('UT-104 shows the missing-workout notice as text, and a letter without an active workout shows without a name', () => {
    const missing = render(
      schedule([
        fixed({
          workoutLetter: 'C',
          workoutSessionName: null,
          workoutMissing: true,
        }),
      ]),
      ['Peito', 'Costas']
    );
    expect(missing).toContain('O treino vinculado não existe mais');

    const noWorkout = render(
      schedule([
        fixed({
          workoutLetter: 'A',
          workoutSessionName: null,
          workoutMissing: false,
        }),
      ]),
      []
    );
    expect(noWorkout).toContain('Treino A');
    expect(noWorkout).not.toContain('não existe mais');
  });

  it('UT-106 renders the same for a student without an account', () => {
    const html = render(schedule([fixed()]));

    expect(html).toContain('Horários');
    expect(html).not.toContain('conta');
  });

  it('UT-109 disables "Adicionar horário" at fourteen fixed times, with an explanation', () => {
    const fourteen = Array.from({ length: FIXED_TIME_LIMIT }, (_, index) =>
      fixed({
        weekday: (index % 7) + 1,
        startMinute: 6 * 60 + Math.floor(index / 7) * 180,
      })
    );

    const html = render(schedule(fourteen));

    expect(html).toContain('Um aluno pode ter no máximo 14 horários fixos.');
    expect(html).toMatch(/disabled=""[^>]*>[\s\S]*?Adicionar horário/);
  });
});

describe('fixed time form (UT-107, UT-108)', () => {
  it('UT-108 shows the link field only for online times', () => {
    const presencial = renderToStaticMarkup(
      <FixedTimeFormFields
        draft={{ ...DEFAULT_DRAFT_FOR_TESTS, type: 'PRESENCIAL' }}
        errors={{}}
        sessionNames={[]}
        onChange={() => {}}
      />
    );
    const online = renderToStaticMarkup(
      <FixedTimeFormFields
        draft={{ ...DEFAULT_DRAFT_FOR_TESTS, type: 'ONLINE' }}
        errors={{}}
        sessionNames={[]}
        onChange={() => {}}
      />
    );

    expect(presencial).not.toContain('Link da chamada');
    expect(online).toContain('Link da chamada (opcional)');
  });

  it('UT-108 names the session each letter points to in the active workout', () => {
    const options = letterOptions(['Peito', 'Costas']);

    expect(options.find(option => option.value === 'B')?.label).toBe(
      'B — Costas'
    );
    expect(options.find(option => option.value === 'C')?.label).toBe(
      'C (sem sessão no treino ativo)'
    );
  });

  it('UT-107 opens with the default duration of sixty minutes', () => {
    const html = renderToStaticMarkup(
      <FixedTimeFormFields
        draft={DEFAULT_DRAFT_FOR_TESTS}
        errors={{}}
        sessionNames={[]}
        onChange={() => {}}
      />
    );

    expect(html).toMatch(/<option value="60" selected="">60 min<\/option>/);
  });

  it('UT-111 names the conflicting student and time, and says nothing was saved', () => {
    const conflict: ScheduleConflict = {
      studentName: 'Bruna',
      startAt: '2026-10-14T10:00:00.000Z',
      endAt: '2026-10-14T11:00:00.000Z',
    };

    const html = renderToStaticMarkup(
      <ScheduleConflictNotice conflict={conflict} />
    );

    expect(html).toContain('conflita com Bruna');
    expect(html).toContain('Nada foi salvo');
    expect(html).toContain('role="alert"');
  });
});

describe('overview next time (UT-116)', () => {
  it('shows weekday time, type and "Ver agenda"; an empty state otherwise', () => {
    const filled = renderToStaticMarkup(
      <NextSessionCard
        studentId={ID}
        nextSession={{ startAt: '2026-10-14T10:00:00.000Z', type: 'ONLINE' }}
      />
    );
    const empty = renderToStaticMarkup(
      <NextSessionCard studentId={ID} nextSession={null} />
    );

    expect(filled).toContain('Online');
    expect(filled).toContain('Ver agenda');
    expect(empty).toContain('Nenhum horário definido para este aluno.');
    expect(empty).toContain('Adicionar horário');
  });
});
