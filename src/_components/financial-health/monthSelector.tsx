import { Button } from '@/_components/ui/button';
import type { MonthOption } from '@/_types/monthOption';

interface MonthSelectorProps {
  path: string;
  selected: string;
  options: MonthOption[];
}

/**
 * A plain GET form: choosing a month reloads the panel on that month with no
 * client script, and it works with the keyboard and a screen reader as any
 * native select does. Changing the month always returns to the first page.
 */
export function MonthSelector({ path, selected, options }: MonthSelectorProps) {
  return (
    <form method="get" action={path} className="flex flex-wrap items-end gap-2">
      <div className="flex flex-col gap-1">
        <label htmlFor="financial-month" className="text-sm font-medium">
          Mês
        </label>
        <select
          id="financial-month"
          name="month"
          defaultValue={selected}
          className="border-input bg-background h-9 rounded-md border px-3 text-sm"
        >
          {options.map((option, index) => (
            <option key={option.value} value={option.value}>
              {index === 0 ? `${option.label} (atual)` : option.label}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" variant="outline" size="sm">
        Ver mês
      </Button>
    </form>
  );
}
