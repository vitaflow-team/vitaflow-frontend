/**
 * Dados de identidade e plano que o layout do app lê uma vez por renderização e
 * repassa como props simples. Datas viajam como ISO para atravessarem a
 * fronteira servidor/cliente sem serialização especial.
 */
export interface ProfileShell {
  firstName: string;
  avatar: string | null;
  productName: string | null;
  subscriptionStatus: string | null;
  /** Data em que o plano acaba ou se renova, já derivada pelo backend (ADR-004). */
  expiresAt: string | null;
  /** `true` quando a assinatura se renova sozinha na data acima. */
  autoRenew: boolean;
}

/**
 * `profileLoaded: false` significa que o perfil não pôde ser lido e os campos
 * vieram da sessão. Quem mostra o plano precisa dessa distinção: sem perfil o
 * bloco mostra "Seu plano", e não o plano gratuito.
 */
export interface ShellData extends ProfileShell {
  profileLoaded: boolean;
}
