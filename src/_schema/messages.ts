import { z } from 'zod';

// Mirrors the backend's MAX_MESSAGE_LENGTH (messages.constants.ts).
const MAX_MESSAGE_LENGTH = 2000;

export const sendMessageSchema = z.object({
  counterpartId: z.uuid(),
  content: z
    .string()
    .trim()
    .min(1, 'A mensagem não pode estar vazia.')
    .max(
      MAX_MESSAGE_LENGTH,
      `A mensagem pode ter no máximo ${MAX_MESSAGE_LENGTH} caracteres.`
    ),
});

export const conversationIdSchema = z.object({
  id: z.uuid(),
});

export const pollMessagesSchema = z.object({
  conversationId: z.uuid(),
  after: z.uuid().optional(),
});
