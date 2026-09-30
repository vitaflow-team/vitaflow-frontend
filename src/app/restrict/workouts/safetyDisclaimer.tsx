import { ShieldAlert } from 'lucide-react';

/** Required on every generated/edited workout view, without exception
 * (PRD Business Rules) — an AI-generated plan never replaces a physical
 * educator's evaluation. */
export function SafetyDisclaimer() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-dashed border-line bg-secondary/40 p-4 text-sm text-muted-foreground">
      <ShieldAlert
        className="size-5 shrink-0 text-icon-accent"
        aria-hidden="true"
      />
      <p>
        Este treino foi gerado automaticamente e não substitui a avaliação de um
        educador físico. Interrompa e procure orientação profissional se sentir
        dor ou desconforto.
      </p>
    </div>
  );
}
