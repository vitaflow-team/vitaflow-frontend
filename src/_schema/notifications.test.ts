import { describe, expect, it } from 'vitest';
import { markReadSchema, setPreferenceSchema } from './notifications';

describe('markReadSchema', () => {
  it('accepts a valid uuid', () => {
    expect(
      markReadSchema.safeParse({
        notificationId: '019bba14-b92d-7361-83d5-ba328169c414',
      }).success
    ).toBe(true);
  });

  it('rejects a non-uuid value', () => {
    expect(
      markReadSchema.safeParse({ notificationId: 'not-a-uuid' }).success
    ).toBe(false);
  });
});

describe('setPreferenceSchema', () => {
  it('accepts every valid category with a boolean enabled flag', () => {
    expect(
      setPreferenceSchema.safeParse({ category: 'BILLING', enabled: true })
        .success
    ).toBe(true);
    expect(
      setPreferenceSchema.safeParse({
        category: 'PRODUCT_NEWS',
        enabled: false,
      }).success
    ).toBe(true);
  });

  it('rejects an unknown category', () => {
    expect(
      setPreferenceSchema.safeParse({ category: 'SPAM', enabled: true }).success
    ).toBe(false);
  });

  it('rejects a non-boolean enabled value', () => {
    expect(
      setPreferenceSchema.safeParse({ category: 'BILLING', enabled: 'yes' })
        .success
    ).toBe(false);
  });
});
