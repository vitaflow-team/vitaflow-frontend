'use client';

import { Button } from '@/_components/ui/button';

interface SaveBarProps {
  visible: boolean;
  isSaving: boolean;
  onDiscard: () => void;
}

/**
 * Barra fixa de salvar (ADR-003). Só existe no DOM enquanto há alteração
 * pendente — quem usa leitor de tela ouve o aviso no momento em que ela
 * aparece, e o formulário limpo não carrega controles inúteis.
 *
 * No celular ela se apoia acima da barra de navegação inferior e da área segura
 * do aparelho; a partir de md a barra inferior não existe e ela encosta no pé
 * da janela. O espaçador do formulário garante que nada cubra os últimos campos.
 */
export function SaveBar({ visible, isSaving, onDiscard }: SaveBarProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom))] z-40 border-t border-line bg-background/95 px-3 py-3 backdrop-blur md:bottom-0 md:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
        <span role="status" className="text-sm font-medium">
          Não salvo
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={onDiscard}
            disabled={isSaving}
          >
            Descartar
          </Button>
          <Button type="submit" className="min-h-11" disabled={isSaving}>
            {isSaving ? 'Salvando…' : 'Salvar alterações'}
          </Button>
        </div>
      </div>
    </div>
  );
}
