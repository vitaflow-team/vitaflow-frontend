import { FieldError } from './fieldError';

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
}

const SELECT_CLASS =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm';

/** A labeled native select with its message next to it. */
export function SelectField({
  id,
  label,
  value,
  placeholder,
  options,
  error,
  required,
  onChange,
}: SelectFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        className={SELECT_CLASS}
        value={value}
        aria-required={required ? 'true' : undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={event => onChange(event.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
