export interface ClickInfo {
  href: string | null;
  target: string | null;
  download: boolean;
  button: number;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  defaultPrevented: boolean;
}

/**
 * Decide se um clique em link é uma navegação interna que vale interromper para
 * avisar sobre edições não salvas (ADR-009).
 *
 * Fica de fora tudo que não troca a página nesta aba: clique já cancelado,
 * botão que não é o principal, atalhos que abrem em nova aba ou baixam o
 * arquivo, `target`/`download` próprios do link, outro domínio, o mesmo
 * endereço e mudança só de âncora.
 */
export function shouldInterceptClick(
  click: ClickInfo,
  currentUrl: string,
  origin: string
): boolean {
  if (click.defaultPrevented) return false;
  if (click.button !== 0) return false;
  if (click.metaKey || click.ctrlKey || click.shiftKey || click.altKey) {
    return false;
  }
  if (click.download) return false;
  if (click.target && click.target !== '_self') return false;
  if (!click.href) return false;

  let target: URL;
  let current: URL;
  try {
    target = new URL(click.href, currentUrl);
    current = new URL(currentUrl, origin);
  } catch {
    // Endereço que o navegador nem consegue resolver não navega para lugar
    // nenhum — não há edição a proteger.
    return false;
  }

  if (target.origin !== origin) return false;
  if (target.href === current.href) return false;

  const hashOnly =
    target.pathname === current.pathname && target.search === current.search;
  if (hashOnly) return false;

  return true;
}
