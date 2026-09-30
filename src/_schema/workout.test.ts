import { describe, expect, it } from 'vitest';
import { conversationAnswerSchema } from './workout';

describe('conversationAnswerSchema', () => {
  it('accepts an empty body (starts a new conversation)', () => {
    expect(conversationAnswerSchema.safeParse({}).success).toBe(true);
  });

  it('accepts a conversationId + answer pair', () => {
    const result = conversationAnswerSchema.safeParse({
      conversationId: '0190aaaa-bbbb-7ccc-8ddd-eeeeffff0000',
      answer: 'masculino',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a non-UUID conversationId', () => {
    const result = conversationAnswerSchema.safeParse({
      conversationId: 'not-a-uuid',
      answer: 'masculino',
    });
    expect(result.success).toBe(false);
  });
});
