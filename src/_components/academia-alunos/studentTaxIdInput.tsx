import { Input } from '@/_components/ui/input';
import { formatTaxId } from '@/_lib/taxId';

interface StudentTaxIdInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/** Asked only when the student has no CPF or CNPJ on file: a fee cannot be issued without one. */
export function StudentTaxIdInput({
  value,
  onChange,
  disabled = false,
}: StudentTaxIdInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="plan-tax-id" className="text-sm font-medium">
        CPF ou CNPJ do aluno
      </label>
      <Input
        id="plan-tax-id"
        value={value}
        inputMode="numeric"
        placeholder="000.000.000-00"
        disabled={disabled}
        required
        aria-required="true"
        onChange={event => onChange(formatTaxId(event.target.value))}
      />
      <p className="text-muted-foreground text-xs">
        O aluno ainda não tem CPF ou CNPJ salvo; sem ele a mensalidade não pode
        ser emitida.
      </p>
    </div>
  );
}
