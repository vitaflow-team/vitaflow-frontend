import { Title } from '@/_components/ui/title';
import type { PainelResponse } from '@/_types/academiaPainel';
import { Activity, GraduationCap, Users } from 'lucide-react';

interface PainelViewProps {
  painel: PainelResponse;
}

function CountCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-card flex items-center gap-4 rounded-xl border px-5 py-4">
      <div className="bg-secondary text-icon-accent rounded-full p-3">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <div>
        <p className="text-2xl font-semibold leading-none">{value}</p>
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function PainelView({ painel }: PainelViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <CountCard
          icon={Users}
          label="Educadores ativos"
          value={painel.educatorCount}
        />
        <CountCard
          icon={GraduationCap}
          label="Alunos da academia"
          value={painel.studentCount}
        />
      </div>

      <section className="flex flex-col gap-3">
        <Title label="Professores" size="h2" className="text-left" />
        {painel.educators.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum educador com vínculo ativo no momento.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {painel.educators.map(educator => (
              <li
                key={educator.id}
                className="bg-card flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div>
                  <p className="font-medium">{educator.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {educator.email}
                  </p>
                </div>
                <span className="text-muted-foreground text-sm">
                  Desde {formatDate(educator.startedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <Title label="Atividade recente" size="h2" className="text-left" />
        {painel.activity.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhuma atividade ainda.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {painel.activity.map(item => (
              <li
                key={item.id}
                className="bg-card flex items-start gap-3 rounded-lg border px-4 py-3"
              >
                <Activity
                  className="text-icon-accent mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm">{item.message}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatDateTime(item.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
