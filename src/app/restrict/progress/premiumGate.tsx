import { Button } from '@/_components/ui/button';
import { Card, CardContent } from '@/_components/ui/card';
import { Title } from '@/_components/ui/title';
import Link from 'next/link';

// Shown before any other part of Progress Photos — consent included — for a
// Free-tier user (US-006, PRD Business Rules: the gate applies before the
// consent step and everything else, not reactively to a failed request).
export function PremiumGate() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <Title label="Fotos de progresso é um recurso Premium" />
        <p className="max-w-md text-muted-foreground">
          Assine o plano Premium para tirar fotos de progresso, acompanhar sua
          evolução visual e comparar fotos ao longo do tempo.
        </p>
        <Button asChild>
          <Link href="/restrict/settings?tab=plano">Ver planos</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
