import { CardUpgrade, CardUpgradeItem } from '@/_components/ui/cardUpgrade';

interface NutritionistPlansProps {
  information?: boolean;
  plan?: number;
}

export function NutritionistPlan({
  information = false,
  plan = 0,
}: NutritionistPlansProps) {
  return (
    <>
      <CardUpgrade
        title="Profissional"
        value={79.9}
        information={information}
        active={plan === 4}
      >
        <CardUpgradeItem label="Cadastro ilimitado de pacientes" />
        <CardUpgradeItem label="Prescrição de cardápios e planos alimentares personalizados" />
        <CardUpgradeItem label="Registro e acompanhamento de medidas nutricionais (peso, circunferências, dobras cutâneas)" />
        <CardUpgradeItem label="Agenda para consultas presenciais ou online" />
        <CardUpgradeItem label="Relatórios de evolução nutricional para pacientes" />
      </CardUpgrade>

      <CardUpgrade
        title="Premium"
        value={129.9}
        information={information}
        active={plan === 5}
      >
        <CardUpgradeItem label="Todas as funcionalidades do plano anterior" />
        <CardUpgradeItem label="Gestão financeira: contas a receber, histórico de pagamentos dos alunos" />
        <CardUpgradeItem label="Integração com PIX e emissão de recibos" />
        <CardUpgradeItem label="Lembretes automáticos de consulta e pagamento para pacientes" />
        <CardUpgradeItem label="Criação de grupos de acompanhamento (ex: desafio de emagrecimento)" />
        <CardUpgradeItem label="Gráficos comparativos de evolução de grupos" />
      </CardUpgrade>
    </>
  );
}
