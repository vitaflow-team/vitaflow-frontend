import type { ErrorMapping } from '@/_types/errorMapping';

export const INVITATION_PENDING: ErrorMapping = {
  status: 409,
  code: 'invitation_pending',
  message: 'Já existe um convite pendente para este e-mail.',
};

export const NOT_PHYSICAL_EDUCATOR: ErrorMapping = {
  status: 400,
  code: 'not_physical_educator',
  message: 'Só é possível convidar um educador físico para este vínculo.',
};

export const ALREADY_EMPLOYED: ErrorMapping = {
  status: 409,
  code: 'already_employed',
  message: 'Este educador já está empregado por esta academia.',
};

export const INVITATION_NOT_FOUND: ErrorMapping = {
  status: 404,
  code: 'invitation_not_found',
  message: 'Convite não encontrado ou já respondido.',
};

export const EMPLOYMENT_NOT_FOUND: ErrorMapping = {
  status: 404,
  code: 'employment_not_found',
  message: 'Vínculo não encontrado ou já encerrado.',
};

export const STAFF_NOT_FOUND: ErrorMapping = {
  status: 404,
  code: 'staff_not_found',
  message: 'Recepcionista não encontrada.',
};

export const NOT_EMPLOYED_HERE: ErrorMapping = {
  status: 400,
  code: 'not_employed_here',
  message: 'Este educador não está mais empregado por esta academia.',
};

export const STUDENT_NOT_FOUND: ErrorMapping = {
  status: 404,
  code: 'student_not_found',
  message: 'Aluno não encontrado nesta academia.',
};

export const STUDENT_ALREADY_REGISTERED_ACADEMIA: ErrorMapping = {
  status: 409,
  code: 'student_already_registered',
  message: 'Já existe um aluno cadastrado nesta academia com este e-mail.',
};

export const ACCOUNT_EXISTS: ErrorMapping = {
  status: 409,
  code: 'account_exists',
  message:
    'Já existe uma conta Vita Flow confirmada com este e-mail. Peça para o aluno criar o vínculo por conta própria.',
};

export const STUDENT_INVALID: ErrorMapping = {
  status: 400,
  code: 'student_invalid',
  message: 'Informe o nome do aluno.',
};

export const TURMA_NOT_FOUND: ErrorMapping = {
  status: 404,
  code: 'turma_not_found',
  message: 'Turma não encontrada nesta academia.',
};

export const TURMA_INVALID_SCHEDULE: ErrorMapping = {
  status: 400,
  code: 'turma_invalid_schedule',
  message: 'Verifique o horário e a duração informados.',
};

export const TURMA_INVALID_CAPACITY: ErrorMapping = {
  status: 400,
  code: 'turma_invalid_capacity',
  message: 'A capacidade deve ser um número inteiro maior que zero.',
};

export const TURMA_FULL: ErrorMapping = {
  status: 409,
  code: 'turma_full',
  message: 'Turma cheia.',
};

export const NOT_ELIGIBLE: ErrorMapping = {
  status: 403,
  code: 'not_eligible',
  message: 'Este aluno não pode se inscrever nesta turma.',
};

export const ACCESS_PLAN_INVALID: ErrorMapping = {
  status: 400,
  code: 'access_plan_invalid',
  message: 'Verifique os dados do plano: nome, validade e valor de referência.',
};

export const ACCESS_PLAN_NOT_FOUND: ErrorMapping = {
  status: 404,
  code: 'access_plan_not_found',
  message: 'Plano de acesso não encontrado.',
};

export const INVITE_ERRORS: ErrorMapping[] = [
  INVITATION_PENDING,
  NOT_PHYSICAL_EDUCATOR,
  ALREADY_EMPLOYED,
];

export const CANCEL_INVITATION_ERRORS: ErrorMapping[] = [INVITATION_NOT_FOUND];

export const END_EMPLOYMENT_ERRORS: ErrorMapping[] = [EMPLOYMENT_NOT_FOUND];

export const REMOVE_STAFF_ERRORS: ErrorMapping[] = [STAFF_NOT_FOUND];

export const ASSIGN_EDUCATOR_ERRORS: ErrorMapping[] = [
  NOT_EMPLOYED_HERE,
  STUDENT_NOT_FOUND,
];

export const REGISTER_ACADEMIA_STUDENT_ERRORS: ErrorMapping[] = [
  NOT_EMPLOYED_HERE,
  STUDENT_ALREADY_REGISTERED_ACADEMIA,
  ACCOUNT_EXISTS,
  STUDENT_INVALID,
];

export const ACCESS_PLAN_WRITE_ERRORS: ErrorMapping[] = [
  ACCESS_PLAN_INVALID,
  ACCESS_PLAN_NOT_FOUND,
];

export const TURMA_WRITE_ERRORS: ErrorMapping[] = [
  NOT_EMPLOYED_HERE,
  TURMA_INVALID_SCHEDULE,
  TURMA_INVALID_CAPACITY,
  TURMA_NOT_FOUND,
];

export const TURMA_ASSIGN_EDUCATOR_ERRORS: ErrorMapping[] = [
  NOT_EMPLOYED_HERE,
  TURMA_NOT_FOUND,
];

export const TURMA_REMOVE_ERRORS: ErrorMapping[] = [TURMA_NOT_FOUND];

export const TURMA_ENROLL_ERRORS: ErrorMapping[] = [
  TURMA_NOT_FOUND,
  TURMA_FULL,
  NOT_ELIGIBLE,
];
