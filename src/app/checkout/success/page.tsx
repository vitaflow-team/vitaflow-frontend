import { ButtonLink } from '@/_components/ui/buttonLink';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md bg-secondary text-primary border-green-500 border-2">
        <CardHeader className="flex flex-col items-center gap-2">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <CardTitle className="text-2xl font-bold text-center">
            Sucesso!
          </CardTitle>
          <CardDescription className="text-center text-primary/80">
            Sua assinatura foi realizada com sucesso.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-primary/70">
          Obrigado por assinar. Seu plano já deve estar ativo.
        </CardContent>
        <CardFooter className="flex justify-center">
          <ButtonLink
            url="/restrict/settings"
            label="Voltar para Configurações"
            className="w-full"
          />
        </CardFooter>
      </Card>
    </div>
  );
}
