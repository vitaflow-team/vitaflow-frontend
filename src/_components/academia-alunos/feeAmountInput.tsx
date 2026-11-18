import { Input } from '@/_components/ui/input';

interface FeeAmountInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/** The monthly fee in reais, typed with a comma or a dot. */
export function FeeAmountInput({
  id,
  label,
  value,
  onChange,
  placeholder = '149,90',
  disabled = false,
}: FeeAmountInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        value={value}
        inputMode="decimal"
        placeholder={placeholder}
        disabled={disabled}
        onChange={event => onChange(event.target.value)}
      />
    </div>
  );
}
