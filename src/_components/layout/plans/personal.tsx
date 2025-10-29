import { CardUpgrade, CardUpgradeItem } from '@/_components/ui/cardUpgrade';

interface PersonalPlansProps {
  information?: boolean;
  plan?: number;
}

export function PersonalPlan({
  information = false,
  plan = 0,
}: PersonalPlansProps) {
  return (
    <>
      <CardUpgrade
        title="Profissional"
        value={59.9}
        information={information}
        active={plan === 2}
      >
        <CardUpgradeItem label="Cadastro ilimitado de alunos" />
        <CardUpgradeItem label="Criação e prescrição de treinos personalizados" />
        <CardUpgradeItem label="Registro e acompanhamento de medidas físicas dos alunos" />
        <CardUpgradeItem label="Agenda para gerenciamento de treinos/sessões" />
        <CardUpgradeItem label="Relatórios automáticos de evolução do aluno" />
        <CardUpgradeItem label="Integração com planilhas ou exportação de dados" />
      </CardUpgrade>
      <CardUpgrade
        title="Premium"
        value={99.9}
        information={information}
        active={plan === 3}
      >
        <CardUpgradeItem label="Todas as funcionalidades do plano anterior" />
        <CardUpgradeItem label="Gestão financeira: contas a receber, histórico de pagamentos dos alunos" />
        <CardUpgradeItem label="Integração com PIX e emissão de recibos" />
        <CardUpgradeItem label="Gráficos financeiros (receita mensal, inadimplência, projeções)" />
        <CardUpgradeItem label="Lembretes automáticos para alunos sobre treinos e pagamentos" />
        <CardUpgradeItem label="Possibilidade de criar pacotes de planos (mensal, trimestral, anual)" />
      </CardUpgrade>{' '}
    </>
  );
}
