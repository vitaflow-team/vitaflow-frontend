import { apiClient } from '@/_lib/apiClient';
import { getFirstName } from '@/_lib/navigation';
import type { ProfileShell, ShellData } from '@/_types/shell';
import type { Session } from 'next-auth';

interface ProfileShellResponse {
  name?: string | null;
  avatar?: string | null;
  productName?: string | null;
  subscriptionStatus?: string | null;
  subscriptionCancelAt?: string | Date | null;
  subscriptionCurrentPeriodEnd?: string | Date | null;
}

function toIso(value?: string | Date | null): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function fromSession(session: Session | null): ShellData {
  return {
    firstName: getFirstName(session?.user?.name),
    avatar: session?.user?.avatar ?? null,
    productName: null,
    subscriptionStatus: null,
    subscriptionCancelAt: null,
    subscriptionCurrentPeriodEnd: null,
    profileLoaded: false,
  };
}

/**
 * Identidade e plano do usuário para o layout do app, lidos do perfil a cada
 * renderização do servidor — a sessão congela plano e tipo no login e não
 * carrega nome do plano nem datas (ADR-006).
 *
 * Nunca lança: se o perfil falhar, o shell continua de pé com o que a sessão
 * sabe e o bloco de plano mostra um rótulo neutro.
 */
export async function getShellData(
  session: Session | null
): Promise<ShellData> {
  try {
    const profile = await apiClient<ProfileShellResponse>('/profile', {
      method: 'GET',
    });

    const shell: ProfileShell = {
      firstName: getFirstName(profile.name),
      avatar: profile.avatar ?? null,
      productName: profile.productName ?? null,
      subscriptionStatus: profile.subscriptionStatus ?? null,
      subscriptionCancelAt: toIso(profile.subscriptionCancelAt),
      subscriptionCurrentPeriodEnd: toIso(profile.subscriptionCurrentPeriodEnd),
    };

    return { ...shell, profileLoaded: true };
  } catch {
    // Sem dado pessoal na mensagem: o log serve para saber que o shell está
    // degradado, não para identificar quem sofreu a falha.
    console.warn(
      'Shell: perfil indisponível, usando os dados da sessão como alternativa.'
    );
    return fromSession(session);
  }
}
