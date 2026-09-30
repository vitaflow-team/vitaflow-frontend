import { Label } from '@/_components/ui/label';

interface FilterSelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  allLabel: string;
  options: FilterSelectOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
}

/** A labelled native select whose empty option means "no filter". */
export function FilterSelect({
  id,
  label,
  value,
  allLabel,
  options,
  disabled,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={event => onChange(event.target.value)}
        className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-base focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60 md:text-sm"
      >
        <option value="">{allLabel}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
