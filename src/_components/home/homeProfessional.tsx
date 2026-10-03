import { Greeting } from '@/_components/home/greeting';
import { ShortcutLink, ShortcutsCard } from '@/_components/home/shortcutsCard';
import { peopleShortcut } from '@/_lib/homeShortcuts';

interface HomeProfessionalProps {
  nowIso: string;
  firstName: string;
  productType?: string | null;
}

/**
 * Início do profissional: saudação, data e o caminho para as pessoas que ele
 * acompanha. Sem peso, IMC ou registro — esses números são do próprio usuário.
 */
export function HomeProfessional({
  nowIso,
  firstName,
  productType,
}: HomeProfessionalProps) {
  const people = peopleShortcut(productType);

  return (
    <div className="flex flex-col gap-6 py-4">
      <Greeting nowIso={nowIso} firstName={firstName} />
      {people && (
        <ShortcutsCard>
          <ShortcutLink
            href={people.URL}
            icon={people.ICON}
            label={people.TITLE}
          />
        </ShortcutsCard>
      )}
    </div>
  );
}
