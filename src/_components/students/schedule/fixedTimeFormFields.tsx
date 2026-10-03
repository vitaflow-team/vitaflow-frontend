'use client';

import { Input } from '@/_components/ui/input';
import {
  FIXED_DURATION_MAX,
  FIXED_DURATION_MIN,
  FIXED_ONLINE_LINK_MAX,
  FIXED_START_STEP,
  FIXED_WORKOUT_LETTERS,
  WEEKDAY_NAMES,
} from '@/_constants/educatorScheduleLimits';
import type { FixedTimeDraft } from '@/_lib/fixedTimeDraft';
import { FieldError } from '../workouts/fieldError';
import { SelectField } from '../workouts/selectField';

interface FixedTimeFormFieldsProps {
  draft: FixedTimeDraft;
  errors: Record<string, string>;
  sessionNames: string[];
  onChange: (next: Partial<FixedTimeDraft>) => void;
}

const WEEKDAY_OPTIONS = Object.entries(WEEKDAY_NAMES).map(([value, label]) => ({
  value,
  label,
}));
const TYPE_OPTIONS = [
  { value: 'PRESENCIAL', label: 'Presencial' },
  { value: 'ONLINE', label: 'Online' },
];

function durationOptions() {
  const options: Array<{ value: string; label: string }> = [];
  for (
    let minutes = FIXED_DURATION_MIN;
    minutes <= FIXED_DURATION_MAX;
    minutes += FIXED_START_STEP
  ) {
    options.push({ value: String(minutes), label: `${minutes} min` });
  }
  return options;
}

/** The letter choices name the session of the active workout they point to. */
export function letterOptions(sessionNames: string[]) {
  return [
    { value: '', label: 'Sem treino vinculado' },
    ...FIXED_WORKOUT_LETTERS.map((letter, index) => ({
      value: letter,
      label:
        sessionNames[index] !== undefined
          ? `${letter} — ${sessionNames[index]}`
          : `${letter} (sem sessão no treino ativo)`,
    })),
  ];
}

/** The inputs of one fixed time. Labels and messages sit next to each field. */
export function FixedTimeFormFields({
  draft,
  errors,
  sessionNames,
  onChange,
}: FixedTimeFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <SelectField
        id="fixed-weekday"
        label="Dia da semana"
        value={String(draft.weekday)}
        placeholder="Escolha…"
        options={WEEKDAY_OPTIONS}
        error={errors.weekday}
        required
        onChange={value => onChange({ weekday: Number(value) })}
      />
      <div className="flex flex-col gap-1">
        <label htmlFor="fixed-start" className="text-sm font-medium">
          Horário de início
        </label>
        <Input
          id="fixed-start"
          type="time"
          step={FIXED_START_STEP * 60}
          value={draft.start}
          aria-required="true"
          aria-invalid={errors.startMinute ? 'true' : undefined}
          onChange={event => onChange({ start: event.target.value })}
        />
        <FieldError id="fixed-start-error" message={errors.startMinute} />
      </div>
      <SelectField
        id="fixed-duration"
        label="Duração"
        value={String(draft.durationMinutes)}
        placeholder="Escolha…"
        options={durationOptions()}
        error={errors.durationMinutes}
        onChange={value => onChange({ durationMinutes: Number(value) })}
      />
      <SelectField
        id="fixed-type"
        label="Tipo"
        value={draft.type}
        placeholder="Escolha…"
        options={TYPE_OPTIONS}
        error={errors.type}
        required
        onChange={value => onChange({ type: value as FixedTimeDraft['type'] })}
      />
      {draft.type === 'ONLINE' && (
        <div className="flex flex-col gap-1">
          <label htmlFor="fixed-link" className="text-sm font-medium">
            Link da chamada (opcional)
          </label>
          <Input
            id="fixed-link"
            type="url"
            inputMode="url"
            maxLength={FIXED_ONLINE_LINK_MAX}
            value={draft.onlineLink}
            aria-invalid={errors.onlineLink ? 'true' : undefined}
            onChange={event => onChange({ onlineLink: event.target.value })}
          />
          <FieldError id="fixed-link-error" message={errors.onlineLink} />
        </div>
      )}
      <SelectField
        id="fixed-letter"
        label="Treino vinculado"
        value={draft.letter}
        placeholder="Sem treino vinculado"
        options={letterOptions(sessionNames).slice(1)}
        error={errors.workoutLetter}
        onChange={value => onChange({ letter: value })}
      />
    </div>
  );
}
