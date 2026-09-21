'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/_components/ui/alert-dialog';
import { shouldInterceptClick } from '@/_lib/unsavedGuard';
import { useRouter } from 'next/navigation';
import {
  createContext,
  use,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface UnsavedChangesContextValue {
  /** O formulário de Perfil é o único que escreve aqui (ADR-009). */
  setDirty: (dirty: boolean) => void;
}

const UnsavedChangesContext = createContext<
  UnsavedChangesContextValue | undefined
>(undefined);

export function useUnsavedChanges(): UnsavedChangesContextValue {
  const context = use(UnsavedChangesContext);

  if (!context) {
    throw new Error(
      'useUnsavedChanges precisa estar dentro de UnsavedChangesProvider'
    );
  }

  return context;
}

/**
 * Protege edições não salvas em duas frentes (ADR-003, ADR-009): o aviso do
 * navegador ao fechar ou recarregar a aba, e um diálogo próprio quando o
 * usuário clica num link interno — abas e migalhas são links, e o App Router
 * não oferece nenhum gancho oficial para bloquear navegação.
 *
 * Limites conhecidos e aceitos:
 * - navegação programática (`router.push`/`replace` disparados por outro
 *   componente) não passa por um clique em link, então não é interceptada;
 * - o botão Voltar do navegador também não: ali só vale o aviso do
 *   `beforeunload`, e apenas quando ele sai do documento.
 */
export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [dirty, setDirty] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    if (!dirty) return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    function handleClick(event: MouseEvent) {
      const target = event.target;
      const element =
        target instanceof Element ? target : (target as Node)?.parentElement;
      const anchor = element?.closest?.('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');

      if (
        !shouldInterceptClick(
          {
            href,
            target: anchor.getAttribute('target'),
            download: anchor.hasAttribute('download'),
            button: event.button,
            metaKey: event.metaKey,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
            defaultPrevented: event.defaultPrevented,
          },
          window.location.href,
          window.location.origin
        )
      ) {
        return;
      }

      // Fase de captura e `stopPropagation`: o clique precisa morrer antes de
      // chegar ao Link do Next, senão a navegação já aconteceu.
      event.preventDefault();
      event.stopPropagation();

      const url = new URL(href!, window.location.href);
      setPendingHref(`${url.pathname}${url.search}${url.hash}`);
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick, true);
    };
  }, [dirty]);

  const value = useMemo(() => ({ setDirty }), []);

  function handleDiscard() {
    const href = pendingHref;
    setPendingHref(null);
    setDirty(false);
    if (href) router.push(href);
  }

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}
      <AlertDialog
        open={pendingHref !== null}
        onOpenChange={open => {
          if (!open) setPendingHref(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem alterações não salvas</AlertDialogTitle>
            <AlertDialogDescription>
              Se sair agora, as alterações feitas no seu perfil serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscard}>
              Descartar alterações
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </UnsavedChangesContext.Provider>
  );
}
