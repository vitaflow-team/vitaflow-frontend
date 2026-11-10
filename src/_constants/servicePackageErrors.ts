import type { ErrorMapping } from '@/_types/errorMapping';

// Codes are provisional pending task_03 (backend `src/service-packages/`):
// chosen to mirror `ACCESS_PLAN_INVALID`/`ACCESS_PLAN_NOT_FOUND`'s own
// status+code shape exactly. A cross-professional mutation attempt is
// expected to surface as this same 404 (task_03's repository scopes every
// query by `{ id, professionalId }`, mirroring `AcademiaAccessPlanRepository`'s
// `updateMany` + `count === 1` idiom), never a distinct "forbidden" shape.
export const SERVICE_PACKAGE_INVALID: ErrorMapping = {
  status: 400,
  code: 'service_package_invalid',
  message:
    'Verifique os dados do pacote: nome, quantidade de sessões e valor de referência.',
};

export const SERVICE_PACKAGE_NOT_FOUND: ErrorMapping = {
  status: 404,
  code: 'service_package_not_found',
  message: 'Pacote não encontrado.',
};

export const SERVICE_PACKAGE_WRITE_ERRORS: ErrorMapping[] = [
  SERVICE_PACKAGE_INVALID,
  SERVICE_PACKAGE_NOT_FOUND,
];
