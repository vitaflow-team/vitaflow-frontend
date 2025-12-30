import { Loader } from 'lucide-react';

export function Loading() {
  return (
    <span className="flex justify-center w-full gap-3">
      <Loader className="size-6 animate-[spin_4s_linear_infinite]" />
      <span>Carregando...</span>
    </span>
  );
}
