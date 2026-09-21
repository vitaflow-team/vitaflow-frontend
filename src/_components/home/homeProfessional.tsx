import { Greeting } from '@/_components/home/greeting';
import { ShortcutLink, ShortcutsCard } from '@/_components/home/shortcutsCard';
import { User2 } from 'lucide-react';

interface HomeProfessionalProps {
  nowIso: string;
  firstName: string;
}

/**
 * Início do profissional: saudação, data e o caminho para as pessoas que ele
 * acompanha. Sem peso, IMC ou registro — esses números são do próprio usuário.
 */
export function HomeProfessional({ nowIso, firstName }: HomeProfessionalProps) {
  return (
    <div className="flex flex-col gap-6 py-4">
      <Greeting nowIso={nowIso} firstName={firstName} />
      <ShortcutsCard>
        <ShortcutLink href="/restrict/clients" icon={User2} label="Pessoas" />
      </ShortcutsCard>
    </div>
  );
}
