import type { ErrorMapping } from '@/_types/errorMapping';

export const CONSENT_REQUIRED: ErrorMapping = {
  status: 403,
  message: 'É necessário aceitar o uso de fotos de progresso primeiro.',
};

export const ANGLE_MISMATCH: ErrorMapping = {
  status: 400,
  message: 'Só é possível comparar fotos do mesmo ângulo.',
};

export const PHOTO_NOT_FOUND: ErrorMapping = {
  status: 404,
  message: 'Foto não encontrada. Atualize a página.',
};

export const PREMIUM_REQUIRED: ErrorMapping = {
  status: 402,
  message: 'Este recurso requer o plano Premium.',
};

export const INVALID_IMAGE: ErrorMapping = {
  status: 400,
  message: 'Formato de imagem inválido. Use JPEG, PNG ou WEBP.',
};

export const IMAGE_TOO_LARGE: ErrorMapping = {
  status: 413,
  message: 'A imagem deve ter no máximo 8 MB.',
};
