'use client';

import { FormError } from '@/_components/students/formError';
import { Label } from '@/_components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/_components/ui/radio-group';
import type { MealPlanDay, MealPlanVersion } from '@/_types/mealPlan';
import { SourceDayList } from './sourceDayList';

export type SourceMode = 'draft' | 'version';

interface CloneSourcePickerProps {
  mode: SourceMode;
  onModeChange: (mode: SourceMode) => void;
  draftSourceDays: MealPlanDay[];
  versions: MealPlanVersion[];
  selectedVersion: number | null;
  onSelectVersion: (version: number) => void;
  versionSourceDays: MealPlanDay[];
  disabled: boolean;
  error: string | null;
  onSelectDay: (sourceDayId: string) => void;
}

/** Which day to clone from: another day in the current draft, or a past version's. */
export function CloneSourcePicker({
  mode,
  onModeChange,
  draftSourceDays,
  versions,
  selectedVersion,
  onSelectVersion,
  versionSourceDays,
  disabled,
  error,
  onSelectDay,
}: CloneSourcePickerProps) {
  return (
    <div className="flex flex-col gap-4">
      <RadioGroup
        value={mode}
        onValueChange={value => onModeChange(value as SourceMode)}
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="draft" id="clone-source-draft" />
          <Label htmlFor="clone-source-draft">
            Outro dia do rascunho atual
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="version" id="clone-source-version" />
          <Label htmlFor="clone-source-version">Uma versão publicada</Label>
        </div>
      </RadioGroup>

      {mode === 'draft' && (
        <SourceDayList
          days={draftSourceDays}
          disabled={disabled}
          onSelect={onSelectDay}
        />
      )}

      {mode === 'version' && (
        <div className="flex flex-col gap-3">
          {versions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma versão publicada ainda.
            </p>
          ) : (
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={selectedVersion ?? ''}
              onChange={event => onSelectVersion(Number(event.target.value))}
            >
              <option value="" disabled>
                Escolha uma versão
              </option>
              {versions.map(version => (
                <option key={version.version} value={version.version}>
                  Versão {version.version}
                </option>
              ))}
            </select>
          )}
          {selectedVersion && (
            <SourceDayList
              days={versionSourceDays}
              disabled={disabled}
              onSelect={onSelectDay}
            />
          )}
        </div>
      )}

      <FormError message={error} />
    </div>
  );
}
