export const ACCESS_NOTICE_PARAM = 'aviso';
export const ACCESS_DENIED_CODE = 'sem-permissao';
export const ACCOUNT_DELETED_CODE = 'conta-excluida';

export type AccessNoticeType = 'error' | 'success' | 'warning' | 'info';

export interface AccessNotice {
  title: string;
  message: string;
  /** Ícone e cor do alerta; `info` mantém o comportamento original. */
  type?: AccessNoticeType;
}

const ACCESS_DENIED_NOTICE: AccessNotice = {
  title: 'Área indisponível',
  message:
    'Esta área não está disponível para o seu tipo de conta. Você voltou para uma página que pode acessar.',
};

// A exclusão termina na home pública, fora da área logada, então este é o
// único lugar onde o usuário fica sabendo que deu certo (ADR-007, ADR-010).
const ACCOUNT_DELETED_NOTICE: AccessNotice = {
  title: 'Conta excluída',
  message:
    'Sua conta foi excluída e seus dados foram apagados. Se quiser voltar, é só criar uma conta nova.',
  type: 'success',
};

const NOTICES: Record<string, AccessNotice> = {
  [ACCESS_DENIED_CODE]: ACCESS_DENIED_NOTICE,
  [ACCOUNT_DELETED_CODE]: ACCOUNT_DELETED_NOTICE,
};

export function getAccessNotice(code: string | null): AccessNotice | null {
  // Acesso por índice direto aceitaria `constructor`/`__proto__` vindos da
  // query string como se fossem códigos conhecidos.
  return code !== null && Object.hasOwn(NOTICES, code) ? NOTICES[code] : null;
}

export function stripNoticeParam(search: string): string {
  const params = new URLSearchParams(search);
  params.delete(ACCESS_NOTICE_PARAM);
  const remaining = params.toString();

  return remaining ? `?${remaining}` : '';
}
