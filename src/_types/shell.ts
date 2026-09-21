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
  subscriptionCancelAt: string | null;
  subscriptionCurrentPeriodEnd: string | null;
}

/**
 * `profileLoaded: false` significa que o perfil não pôde ser lido e os campos
 * vieram da sessão. Quem mostra o plano precisa dessa distinção: sem perfil o
 * bloco mostra "Seu plano", e não o plano gratuito.
 */
export interface ShellData extends ProfileShell {
  profileLoaded: boolean;
}
