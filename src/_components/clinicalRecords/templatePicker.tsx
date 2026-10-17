'use client';

import { Label } from '@/_components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/_components/ui/radio-group';
import type { Template } from '@/_types/clinicalRecords';

interface TemplatePickerProps {
  templates: Template[];
  value: string;
  onChange: (templateId: string) => void;
  disabled: boolean;
}

/**
 * Which of the caller's own active templates to use for this fill
 * (US-003.AC-3) — hidden when there is only one, the common starter-template
 * case (US-005), since there is nothing to choose.
 */
export function TemplatePicker({
  templates,
  value,
  onChange,
  disabled,
}: TemplatePickerProps) {
  if (templates.length <= 1) return null;

  return (
    <div className="flex flex-col gap-2">
      <Label>Modelo</Label>
      <RadioGroup value={value} onValueChange={onChange} disabled={disabled}>
        {templates.map(template => (
          <div key={template.id} className="flex items-center gap-2">
            <RadioGroupItem
              value={template.id}
              id={`template-${template.id}`}
            />
            <Label htmlFor={`template-${template.id}`}>{template.name}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
