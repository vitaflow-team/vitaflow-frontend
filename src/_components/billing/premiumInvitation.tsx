/** Shown instead of any connect/create control to a professional who is not Premium (ADR-005). */
export function PremiumInvitation() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-dashed px-4 py-6 text-center">
      <p className="font-medium">A cobrança de alunos é um recurso Premium.</p>
      <p className="text-muted-foreground text-sm">
        Assine o plano Premium para conectar sua conta Asaas e gerar cobranças
        para seus alunos.
      </p>
    </div>
  );
}
