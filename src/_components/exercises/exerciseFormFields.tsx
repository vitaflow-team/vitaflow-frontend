'use client';

import { EQUIPMENT_LABELS, MUSCLE_GROUPS } from '@/_constants/exerciseCatalog';
import type { ExerciseFormMethods } from '@/_types/exerciseFormMethods';
import { ContraindicationField } from './contraindicationField';
import { ExerciseSelectField } from './exerciseSelectField';
import { ExerciseTextField } from './exerciseTextField';

const GROUP_OPTIONS = MUSCLE_GROUPS.map(group => ({
  value: group,
  label: group,
}));

const EQUIPMENT_OPTIONS = Object.entries(EQUIPMENT_LABELS).map(
  ([value, label]) => ({ value, label })
);

interface ExerciseFormFieldsProps {
  methods: ExerciseFormMethods;
  disabled: boolean;
}

/** The required fields: name, muscle group, equipment and description. */
export function ExerciseRequiredFields({
  methods,
  disabled,
}: ExerciseFormFieldsProps) {
  return (
    <>
      <ExerciseTextField
        methods={methods}
        name="name"
        label="Nome"
        required
        disabled={disabled}
      />
      <div className="grid gap-x-4 md:grid-cols-2">
        <ExerciseSelectField
          methods={methods}
          name="muscleGroup"
          label="Grupo muscular"
          placeholder="Escolha o grupo"
          options={GROUP_OPTIONS}
          disabled={disabled}
        />
        <ExerciseSelectField
          methods={methods}
          name="equipment"
          label="Equipamento"
          placeholder="Escolha o equipamento"
          options={EQUIPMENT_OPTIONS}
          disabled={disabled}
        />
      </div>
      <ExerciseTextField
        methods={methods}
        name="description"
        label="Descrição"
        placeholder="Como executar o exercício, passo a passo"
        required
        multiline
        disabled={disabled}
      />
    </>
  );
}

/** The optional fields: level, media links and contraindications. */
export function ExerciseOptionalFields({
  methods,
  disabled,
}: ExerciseFormFieldsProps) {
  return (
    <>
      <ExerciseTextField
        methods={methods}
        name="difficulty"
        label="Nível"
        placeholder="Ex.: Iniciante"
        disabled={disabled}
      />
      <div className="grid gap-x-4 md:grid-cols-2">
        <ExerciseTextField
          methods={methods}
          name="videoUrl"
          label="Link do vídeo"
          placeholder="https://"
          disabled={disabled}
        />
        <ExerciseTextField
          methods={methods}
          name="imageUrl"
          label="Link da imagem"
          placeholder="https://"
          disabled={disabled}
        />
      </div>
      <ContraindicationField methods={methods} disabled={disabled} />
    </>
  );
}
