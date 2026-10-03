'use client';

import { Button } from '@/_components/ui/button';
import { FREE_EXERCISE_NAME_MAX } from '@/_constants/educatorWorkoutLimits';
import { EQUIPMENT_LABELS, MUSCLE_GROUPS } from '@/_constants/exerciseCatalog';
import {
  parseFreeExercise,
  type FreeExerciseValues,
} from '@/_lib/freeExercise';
import { useState, type FormEvent } from 'react';
import { SelectField } from './selectField';
import { TextField } from './textField';

export type { FreeExerciseValues };

interface FreeExerciseFormProps {
  name: string;
  onNameChange: (name: string) => void;
  onSubmit: (values: FreeExerciseValues) => void;
}

const MUSCLE_OPTIONS = MUSCLE_GROUPS.map(group => ({
  value: group,
  label: group,
}));
const EQUIPMENT_OPTIONS = Object.entries(EQUIPMENT_LABELS).map(
  ([value, label]) => ({ value, label })
);

/** Adds an exercise by name: muscle group required, equipment optional. */
export function FreeExerciseForm({
  name,
  onNameChange,
  onSubmit,
}: FreeExerciseFormProps) {
  const [muscleGroup, setMuscleGroup] = useState('');
  const [equipment, setEquipment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(event: FormEvent) {
    event.preventDefault();
    const result = parseFreeExercise({ name, muscleGroup, equipment });
    setErrors(result.ok ? {} : result.errors);
    if (result.ok) onSubmit(result.values);
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={submit} noValidate>
      <TextField
        id="free-exercise-name"
        label="Nome do exercício"
        value={name}
        error={errors.name}
        maxLength={FREE_EXERCISE_NAME_MAX}
        required
        onChange={onNameChange}
      />
      <SelectField
        id="free-exercise-group"
        label="Grupo muscular"
        value={muscleGroup}
        placeholder="Escolha…"
        options={MUSCLE_OPTIONS}
        error={errors.muscleGroup}
        required
        onChange={setMuscleGroup}
      />
      <SelectField
        id="free-exercise-equipment"
        label="Equipamento (opcional)"
        value={equipment}
        placeholder="Não informar"
        options={EQUIPMENT_OPTIONS}
        onChange={setEquipment}
      />
      <Button type="submit">Adicionar pelo nome</Button>
    </form>
  );
}
