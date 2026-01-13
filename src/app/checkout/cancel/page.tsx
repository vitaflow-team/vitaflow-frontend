import { ButtonLink } from '@/_components/ui/buttonLink';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { XCircle } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md bg-secondary text-primary border-primary">
        <CardHeader className="flex flex-col items-center gap-2">
          <XCircle className="h-16 w-16 text-primary/50" />
          <CardTitle className="text-2xl font-bold text-center">
            Cancelado
          </CardTitle>
          <CardDescription className="text-center text-primary/80">
            O processo de assinatura foi cancelado.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-primary/70">
          Nenhuma cobrança foi efetuada. Você pode tentar novamente a qualquer
          momento.
        </CardContent>
        <CardFooter className="flex justify-center">
          <ButtonLink
            url="/restrict/settings"
            label="Voltar"
            variant="outline"
            className="w-full"
          />
        </CardFooter>
      </Card>
    </div>
  );
}
