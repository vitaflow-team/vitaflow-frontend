import { DUE_DAYS } from '@/_lib/gymBillingForm';

interface DueDaySelectProps {
  id: string;
  label: string;
  /** `null` is "no choice yet", only possible when `emptyLabel` is given. */
  value: number | null;
  onChange: (value: number | null) => void;
  /** When set, a first option with this text means "leave it as it is". */
  emptyLabel?: string;
  disabled?: boolean;
}

/** The due day: a native select with the days 1 to 28, so every month has the chosen day. */
export function DueDaySelect({
  id,
  label,
  value,
  onChange,
  emptyLabel,
  disabled = false,
}: DueDaySelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value ?? ''}
        disabled={disabled}
        onChange={event =>
          onChange(
            event.target.value === '' ? null : Number(event.target.value)
          )
        }
        className="border-input bg-background h-9 rounded-md border px-3 text-sm"
      >
        {emptyLabel && <option value="">{emptyLabel}</option>}
        {DUE_DAYS.map(day => (
          <option key={day} value={day}>
            Dia {day}
          </option>
        ))}
      </select>
    </div>
  );
}
