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

// unified-login-account: why a Google attempt was refused, or that Google
// was connected. Reached only through the redirect Auth.js issues after
// Google has verified the email, never typed by the person.
const GOOGLE_NOTICES: Record<string, AccessNotice> = {
  'google-conta-equipe': {
    title: 'Entre com e-mail e senha',
    message:
      'Esta conta tem acesso à equipe Vita Flow. Entre com seu e-mail e senha e conecte o Google em Configurações → Conta.',
    type: 'warning',
  },
  'google-recepcionista': {
    title: 'Entre com e-mail e senha',
    message:
      'Este e-mail é de um acesso de recepção, que não usa o Google. Entre com seu e-mail e senha.',
    type: 'warning',
  },
  'google-email-diferente': {
    title: 'Google não conectado',
    message:
      'A conta Google escolhida tem um e-mail diferente do e-mail desta conta. Escolha a conta Google com o mesmo e-mail.',
    type: 'error',
  },
  'google-ja-vinculado': {
    title: 'Google já conectado',
    message: 'Esta conta já está conectada a uma conta Google.',
    type: 'info',
  },
  'google-em-uso': {
    title: 'Google não conectado',
    message: 'Esta conta Google já está conectada a outra conta Vita Flow.',
    type: 'error',
  },
  'google-nao-conectado': {
    title: 'Google não conectado',
    message:
      'Não foi possível conectar o Google desta vez. Tente de novo em Configurações → Conta.',
    type: 'error',
  },
  'google-conectado': {
    title: 'Google conectado',
    message: 'Agora você também pode entrar com o Google, na mesma conta.',
    type: 'success',
  },
};

const NOTICES: Record<string, AccessNotice> = {
  [ACCESS_DENIED_CODE]: ACCESS_DENIED_NOTICE,
  [ACCOUNT_DELETED_CODE]: ACCOUNT_DELETED_NOTICE,
  ...GOOGLE_NOTICES,
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
