import { z } from 'zod';

/** Body for `POST /workouts/conversation`: empty to start, otherwise the
 * free-text reply to the previous question. */
export const conversationAnswerSchema = z.object({
  conversationId: z.uuid().optional(),
  answer: z.string().optional(),
});

export type conversationAnswerFormData = z.infer<
  typeof conversationAnswerSchema
>;
