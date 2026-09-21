'use client';

import { Button } from '@/_components/ui/button';
import { RecordFormModal } from './recordFormModal';

/**
 * Atalho do cartão de altura: abre o mesmo registro rápido já com o foco no
 * campo de altura. Fica em um componente de cliente próprio para que o cartão
 * de resumo continue sendo renderizado no servidor.
 */
export function UpdateHeightButton() {
  return (
    <RecordFormModal
      focusField="heightCm"
      trigger={
        <Button
          variant="link"
          className="mt-0.5 h-auto justify-start px-0 py-2 text-[0.6875rem] md:text-sm"
        >
          Atualizar
        </Button>
      }
    />
  );
}
