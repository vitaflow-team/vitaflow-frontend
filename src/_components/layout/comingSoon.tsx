import type { LucideIcon } from 'lucide-react';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  message?: string;
  icon?: LucideIcon;
}

export function ComingSoon({
  title,
  message = 'Esta área ainda não está disponível. Ela chega em uma etapa futura.',
  icon: Icon = Construction,
}: ComingSoonProps) {
  return (
    <section className="bg-card flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
      <div className="bg-secondary text-icon-accent rounded-full p-4">
        <Icon className="size-8" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-muted-foreground max-w-md">{message}</p>
    </section>
  );
}
