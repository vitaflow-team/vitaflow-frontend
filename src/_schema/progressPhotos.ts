import { z } from 'zod';

export const photoAngleSchema = z.enum(['FRONT', 'SIDE', 'BACK']);

export const uploadPhotoSchema = z.object({
  angle: photoAngleSchema,
  file: z
    .instanceof(File)
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'O arquivo deve ser uma imagem JPG, PNG ou WEBP.'
    )
    .refine(file => file.size <= 8 * 1024 * 1024, 'Máximo 8MB.'),
});

export const deletePhotoSchema = z.object({
  photoId: z.uuid(),
});

export type uploadPhotoFormData = z.infer<typeof uploadPhotoSchema>;
