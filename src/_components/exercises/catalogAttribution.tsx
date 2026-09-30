/**
 * Catalog-wide credit the CC-BY-SA data license requires (ADR-001, US-005).
 * It sits on every exercise screen, next to any per-exercise credit.
 */
export function CatalogAttribution() {
  return (
    <footer className="text-muted-foreground border-t pt-3 text-xs">
      Parte dos exercícios vem do projeto{' '}
      <a
        href="https://wger.de"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        wger
      </a>
      , pela base{' '}
      <a
        href="https://github.com/exercemus/exercises"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        exercemus/exercises
      </a>
      , sob a licença{' '}
      <a
        href="https://creativecommons.org/licenses/by-sa/3.0/deed.pt_BR"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        CC BY-SA 3.0
      </a>
      .
    </footer>
  );
}
