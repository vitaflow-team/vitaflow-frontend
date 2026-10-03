import { Input } from '@/_components/ui/input';
import { FieldError } from './fieldError';

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  error: string | undefined;
  onChange: (value: string) => void;
  maxLength?: number;
  inputMode?: 'numeric' | 'text' | 'url';
  required?: boolean;
  hint?: string;
}

/** A labeled text input with its message (and optional hint) next to it. */
export function TextField({
  id,
  label,
  value,
  error,
  onChange,
  maxLength,
  inputMode,
  required,
  hint,
}: TextFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        value={value}
        maxLength={maxLength}
        inputMode={inputMode}
        autoComplete="off"
        required={required}
        aria-required={required ? 'true' : undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={
          [error ? errorId : null, hint ? hintId : null]
            .filter(Boolean)
            .join(' ') || undefined
        }
        onChange={event => onChange(event.target.value)}
      />
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      <FieldError id={errorId} message={error} />
    </div>
  );
}
