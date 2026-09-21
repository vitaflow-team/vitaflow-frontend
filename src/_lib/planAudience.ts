import type { PlanType } from '@/_lib/planSelection';

/**
 * A cópia "Para quem é" de cada card. O texto profissional diz, nas duas
 * profissões, que o plano cria uma conta profissional, que inclui o uso pessoal
 * do Premium e que os dados pessoais são mantidos — é o que evita a escolha
 * errada em uma tela que mostra todos os planos (ADR-001, ADR-006).
 */
const AUDIENCE_COPY: Record<PlanType, string> = {
  USER: 'Para quem acompanha a própria saúde: treinos e evolução pessoal.',
  NUTRITIONIST:
    'Para nutricionistas que atendem pacientes. Cria uma conta profissional, inclui o uso pessoal do Premium e mantém seus dados pessoais.',
  PHYSICAL_EDUCATOR:
    'Para educadores físicos que atendem alunos. Cria uma conta profissional, inclui o uso pessoal do Premium e mantém seus dados pessoais.',
};

/** Profissão que o plano atende; planos pessoais não levam sufixo no título. */
const PROFESSION_LABEL: Partial<Record<PlanType, string>> = {
  NUTRITIONIST: 'Nutricionista',
  PHYSICAL_EDUCATOR: 'Educador físico',
};

/**
 * Título do card. "Profissional" e "Premium" existem para mais de um público,
 * então o título dos planos profissionais diz a profissão ("Premium ·
 * Nutricionista") em vez de depender só do subtítulo da seção.
 */
export function planTitle(name: string, type: PlanType): string {
  const profession = PROFESSION_LABEL[type];
  return profession ? `${name} · ${profession}` : name;
}

export function planAudience(type: PlanType): string {
  return AUDIENCE_COPY[type] ?? AUDIENCE_COPY.USER;
}
