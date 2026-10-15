import { Title } from '@/_components/ui/title';
import type { EducatorEmployment } from '@/_types/educatorEmployment';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface EducatorEmploymentPanelProps {
  employments: EducatorEmployment[];
}

export function EducatorEmploymentPanel({
  employments,
}: EducatorEmploymentPanelProps) {
  return (
    <section className="flex flex-col gap-3">
      <Title
        label="Academias que me empregam"
        size="h3"
        className="text-left"
      />
      {employments.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Você não tem nenhum vínculo ativo no momento.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {employments.map(employment => (
            <li
              key={employment.id}
              className="bg-card flex items-center justify-between rounded-lg border px-4 py-3"
            >
              <p className="font-medium">{employment.academia.name}</p>
              <span className="text-muted-foreground text-sm">
                Desde {formatDate(employment.startedAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
