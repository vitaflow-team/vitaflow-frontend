import { CardUpgrade, CardUpgradeItem } from '@/_components/ui/cardUpgrade';

interface UserPlansProps {
  information?: boolean;
  plan?: number;
}

export function UserPlan({ information = false, plan = 0 }: UserPlansProps) {
  return (
    <>
      <CardUpgrade
        title="Gratuito"
        information={information}
        active={plan === 0}
      >
        <CardUpgradeItem label="Visualização de treinos e cardápios enviados pelos profissionais" />
        <CardUpgradeItem label="Registro de medidas básicas (peso, altura, IMC)" />
        <CardUpgradeItem label="Gráficos simples de evolução" />
        <CardUpgradeItem label="Notificações sobre treinos e dieta" />
      </CardUpgrade>

      <CardUpgrade
        title="Premium"
        value={19.9}
        information={information}
        active={plan === 1}
      >
        <CardUpgradeItem label="Todas as funcionalidades do plano gratuito" />
        <CardUpgradeItem label="Acesso a gráficos detalhados de evolução (antropometria, performance, nutrição)" />
        <CardUpgradeItem label="Integração com smartwatches e apps de saúde (Google Fit, Apple Health)" />
        <CardUpgradeItem label="Histórico completo de treinos e cardápios" />
        <CardUpgradeItem label="Chat ilimitado com profissionais (dentro da plataforma)" />
        <CardUpgradeItem label="Relatórios PDF para compartilhar com médico/nutricionista" />
      </CardUpgrade>
    </>
  );
}
