/** Shown instead of any connect control to a gym owner without a paid subscription (ADR-008). */
export function SubscriptionRequiredNotice() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-dashed px-4 py-6 text-center">
      <p className="font-medium">
        A cobrança da academia exige uma assinatura ativa.
      </p>
      <p className="text-muted-foreground text-sm">
        Regularize a assinatura do plano da academia para conectar a conta Asaas
        e cobrar a mensalidade dos alunos. As cobranças já emitidas continuam
        visíveis.
      </p>
    </div>
  );
}
