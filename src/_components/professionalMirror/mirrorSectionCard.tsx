import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface MirrorSectionCardProps {
  title: string;
  icon: LucideIcon;
  emptyMessage: string;
}

// US-002: every contract section not yet backed by real data (every section
// at this PRD's launch) renders this honest, explicit empty state — never a
// blank area, never fabricated content. A future PRD populating one of
// these sections replaces this card's body with the real value; the card
// itself is the fixed slot that stays stable either way.
export function MirrorSectionCard({
  title,
  icon: Icon,
  emptyMessage,
}: MirrorSectionCardProps) {
  return (
    <Card className="gap-3 border-line">
      <CardHeader className="grid-cols-[1fr_auto]">
        <CardTitle>{title}</CardTitle>
        <Icon className="size-5 text-icon-accent" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </CardContent>
    </Card>
  );
}
