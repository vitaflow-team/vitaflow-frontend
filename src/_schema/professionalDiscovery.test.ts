import { describe, expect, it } from 'vitest';
import {
  connectionRequestIdSchema,
  requestConnectionSchema,
  updateProfileSchema,
} from './professionalDiscovery';

describe('connectionRequestIdSchema', () => {
  it('accepts a valid uuid', () => {
    expect(
      connectionRequestIdSchema.safeParse({
        id: '019bba14-b92d-7361-83d5-ba328169c414',
      }).success
    ).toBe(true);
  });

  it('rejects a non-uuid value', () => {
    expect(
      connectionRequestIdSchema.safeParse({ id: 'not-a-uuid' }).success
    ).toBe(false);
  });
});

describe('requestConnectionSchema', () => {
  it('accepts a valid professional id', () => {
    expect(
      requestConnectionSchema.safeParse({
        professionalId: '019bba14-b92d-7361-83d5-ba328169c414',
      }).success
    ).toBe(true);
  });

  it('rejects a missing professional id', () => {
    expect(requestConnectionSchema.safeParse({}).success).toBe(false);
  });
});

describe('updateProfileSchema', () => {
  it('accepts every field empty (nothing changes)', () => {
    expect(updateProfileSchema.safeParse({}).success).toBe(true);
  });

  it('accepts a full valid profile edit', () => {
    const result = updateProfileSchema.safeParse({
      bio: 'Nutricionista especializada em emagrecimento saudável.',
      specialty: 'Nutrição esportiva',
      priceFrom: '150,50',
      attendsOnline: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.priceFrom).toBe(150.5);
    }
  });

  it('rejects a negative price', () => {
    expect(updateProfileSchema.safeParse({ priceFrom: -10 }).success).toBe(
      false
    );
  });

  it('rejects a bio longer than 1000 characters', () => {
    expect(
      updateProfileSchema.safeParse({ bio: 'a'.repeat(1001) }).success
    ).toBe(false);
  });

  it('treats an empty price as unset, not invalid', () => {
    const result = updateProfileSchema.safeParse({ priceFrom: '' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.priceFrom).toBeUndefined();
    }
  });
});
