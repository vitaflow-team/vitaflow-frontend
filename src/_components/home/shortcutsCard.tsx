import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { cn } from '@/_lib/utils';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

const SHORTCUT_CLASS =
  'flex w-full items-center gap-3 rounded-lg border border-line px-3 py-3 text-left text-sm hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden';

interface ShortcutsCardProps {
  children: ReactNode;
}

export function ShortcutsCard({ children }: ShortcutsCardProps) {
  return (
    <Card className="gap-3 border-line">
      <CardHeader>
        <CardTitle>Atalhos</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">{children}</CardContent>
    </Card>
  );
}

interface ShortcutContentProps {
  icon: LucideIcon;
  label: string;
}

function ShortcutContent({ icon: Icon, label }: ShortcutContentProps) {
  return (
    <>
      <Icon className="size-5 shrink-0 text-icon-accent" aria-hidden="true" />
      <span className="flex-1">{label}</span>
      <ChevronRight
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
    </>
  );
}

interface ShortcutLinkProps extends ShortcutContentProps {
  href: string;
}

export function ShortcutLink({ href, icon, label }: ShortcutLinkProps) {
  return (
    <Link href={href} className={SHORTCUT_CLASS}>
      <ShortcutContent icon={icon} label={label} />
    </Link>
  );
}

/**
 * Mesmo desenho do atalho em link, mas como botão — serve de gatilho para o
 * modal de registro, que precisa de um controle clicável e não de navegação.
 * Repassa as props porque o `DialogTrigger asChild` injeta handlers e ref aqui.
 */
export function ShortcutButton({
  icon,
  label,
  className,
  ...props
}: ShortcutContentProps & ComponentProps<'button'>) {
  return (
    <button type="button" className={cn(SHORTCUT_CLASS, className)} {...props}>
      <ShortcutContent icon={icon} label={label} />
    </button>
  );
}
