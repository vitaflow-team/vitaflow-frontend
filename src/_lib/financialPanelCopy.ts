import { PAGE_TITLES } from '@/_constants/pageTitles';
import type { FinancialPanelCopy } from '@/_types/financialPanelCopy';
import type { FinancialPanelProfile } from '@/_types/financialPanelProfile';

const COPY: Record<FinancialPanelProfile, FinancialPanelCopy> = {
  PHYSICAL_EDUCATOR: {
    title: PAGE_TITLES.financial,
    intro:
      'Previsto, recebido e em atraso das cobranças que você emite. Os valores seguem o vencimento e a data do pagamento, não o mês de competência.',
    people: 'alunos',
    overdueColumn: 'Cobranças em atraso',
    noOverdue: 'Nenhuma cobrança em atraso. Está tudo em dia.',
    emptyDelinquents: 'Nenhum aluno inadimplente. Está tudo em dia.',
    zeroHint:
      'Ainda não há cobranças emitidas. Os valores aparecem assim que você gerar cobranças para seus alunos.',
    connectHint:
      'Conecte sua conta Asaas para ver o previsto, o recebido e quem está em atraso.',
    lockedHint:
      'A cobrança de alunos é um recurso Premium. Assine o Premium para conectar sua conta Asaas e emitir novas cobranças.',
  },
  NUTRITIONIST: {
    title: PAGE_TITLES.financial,
    intro:
      'Previsto, recebido e em atraso das cobranças que você emite. Os valores seguem o vencimento e a data do pagamento, não o mês de competência.',
    people: 'pacientes',
    overdueColumn: 'Cobranças em atraso',
    noOverdue: 'Nenhuma cobrança em atraso. Está tudo em dia.',
    emptyDelinquents: 'Nenhum paciente inadimplente. Está tudo em dia.',
    zeroHint:
      'Ainda não há cobranças emitidas. Os valores aparecem assim que você gerar cobranças para seus pacientes.',
    connectHint:
      'Conecte sua conta Asaas para ver o previsto, o recebido e quem está em atraso.',
    lockedHint:
      'A cobrança de pacientes é um recurso Premium. Assine o Premium para conectar sua conta Asaas e emitir novas cobranças.',
  },
  ACADEMIA: {
    title: PAGE_TITLES.academiaFinancial,
    intro:
      'Previsto, recebido e em atraso das mensalidades da academia. Os valores seguem o vencimento e a data do pagamento.',
    people: 'alunos',
    overdueColumn: 'Mensalidades em atraso',
    noOverdue: 'Nenhuma mensalidade em atraso. Está tudo em dia.',
    emptyDelinquents: 'Nenhum aluno inadimplente. Está tudo em dia.',
    zeroHint:
      'Ainda não há mensalidades emitidas. Vincule alunos a planos com mensalidade para ver os valores aqui.',
    connectHint:
      'Conecte a conta Asaas da academia para cobrar as mensalidades e acompanhar o financeiro.',
    lockedHint: 'Conectar a cobrança exige uma assinatura ativa da academia.',
  },
};

export function panelCopy(profile: FinancialPanelProfile): FinancialPanelCopy {
  return COPY[profile];
}

/** The profile of a professional page: nutritionists say "pacientes". */
export function professionalProfileOf(
  productType?: string | null
): FinancialPanelProfile {
  return productType === 'NUTRITIONIST' ? 'NUTRITIONIST' : 'PHYSICAL_EDUCATOR';
}

/** Where a delinquent row leads: that person's existing billing area. */
export function personBillingHref(
  profile: FinancialPanelProfile,
  clientId: string
): string {
  const id = encodeURIComponent(clientId);
  if (profile === 'NUTRITIONIST') return `/restrict/patients/${id}/cobranca`;
  if (profile === 'ACADEMIA') return `/restrict/academia-alunos/${id}`;
  return `/restrict/students/${id}/billing`;
}
