import { describe, expect, it } from 'vitest';
import { registerPatientSchema } from './patients';

describe('registerPatientSchema', () => {
  it('accepts a name with an email only', () => {
    const result = registerPatientSchema.safeParse({
      name: 'Diego Martins',
      email: 'diego@exemplo.com',
      phone: '',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a name with a phone only', () => {
    const result = registerPatientSchema.safeParse({
      name: 'Diego Martins',
      email: '',
      phone: '(11) 98888-7777',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a name with neither email nor phone (US-001.EC-3)', () => {
    const result = registerPatientSchema.safeParse({
      name: 'Diego Martins',
      email: '',
      phone: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a blank name', () => {
    const result = registerPatientSchema.safeParse({
      name: '  ',
      email: 'diego@exemplo.com',
      phone: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid e-mail', () => {
    const result = registerPatientSchema.safeParse({
      name: 'Diego Martins',
      email: 'not-an-email',
      phone: '',
    });
    expect(result.success).toBe(false);
  });
});
