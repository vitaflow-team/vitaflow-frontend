// US-001.EC-1: unlike NoProfessionalState, there is no "search gyms"
// discovery feature to link to — this is a plain message, nothing else.
export function NoAcademiaMembershipState() {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <p className="text-muted-foreground text-sm">
        Você ainda não é aluno de nenhuma academia.
      </p>
    </div>
  );
}
