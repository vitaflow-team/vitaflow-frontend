'use client';

import { Button } from '@/_components/ui/button';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { Textarea } from '@/_components/ui/textarea';
import {
  MEAL_LABEL_MAX_LENGTH,
  MEAL_TEXT_MAX_LENGTH,
} from '@/_schema/mealPlan';
import type { MealDraft } from '@/_types/mealDraft';
import { X } from 'lucide-react';

interface MealEditorRowProps {
  meal: MealDraft;
  disabled: boolean;
  onChange: (next: MealDraft) => void;
  onRemove: () => void;
}

export function MealEditorRow({
  meal,
  disabled,
  onChange,
  onRemove,
}: MealEditorRowProps) {
  const id = `meal-draft-${meal.key}`;

  return (
    <div className="flex flex-col gap-2 rounded-md border border-line p-3">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <Label htmlFor={`${id}-label`}>Refeição</Label>
          <Input
            id={`${id}-label`}
            value={meal.label}
            maxLength={MEAL_LABEL_MAX_LENGTH}
            placeholder="Café da manhã"
            disabled={disabled}
            onChange={event => onChange({ ...meal, label: event.target.value })}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Remover refeição"
          disabled={disabled}
          onClick={onRemove}
          className="mt-6"
        >
          <X aria-hidden="true" />
        </Button>
      </div>
      <div>
        <Label htmlFor={`${id}-text`}>Descrição</Label>
        <Textarea
          id={`${id}-text`}
          rows={2}
          value={meal.text}
          maxLength={MEAL_TEXT_MAX_LENGTH}
          placeholder="2 ovos mexidos, 1 fatia de pão integral, café sem açúcar"
          disabled={disabled}
          onChange={event => onChange({ ...meal, text: event.target.value })}
        />
      </div>
    </div>
  );
}
