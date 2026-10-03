import { todayInBrazil } from '@/_lib/studentsDates';
import { describe, expect, it } from 'vitest';
import {
  editStudentSchema,
  registerStudentSchema,
  studentEmailSchema,
} from './students';

function messagesFor(
  schema: typeof registerStudentSchema | typeof editStudentSchema,
  input: Record<string, unknown>,
  field: string
): string[] {
  const result = schema.safeParse(input);
  if (result.success) return [];

  return result.error.issues
    .filter(issue => issue.path[0] === field)
    .map(issue => issue.message);
}

const VALID = { name: 'Diego Martins', email: 'Diego@Exemplo.com' };

describe('student schemas', () => {
  it('lower-cases and trims the e-mail', () => {
    expect(studentEmailSchema.parse('  Diego@Exemplo.com ')).toBe(
      'diego@exemplo.com'
    );
  });

  it('UT-120 rejects a malformed e-mail with a message', () => {
    for (const email of ['', 'sem-arroba', 'a@', '@b.com']) {
      expect(studentEmailSchema.safeParse(email).success).toBe(false);
    }
    expect(studentEmailSchema.safeParse('').error?.issues[0].message).toBe(
      'Informe o e-mail.'
    );
    expect(
      studentEmailSchema.safeParse('sem-arroba').error?.issues[0].message
    ).toBe('E-mail inválido.');
  });

  it('UT-106 requires a student name', () => {
    expect(
      messagesFor(registerStudentSchema, { ...VALID, name: '  ' }, 'name')
    ).toEqual(['O nome é obrigatório.']);
  });

  it('UT-154 requires a name when editing', () => {
    expect(messagesFor(editStudentSchema, { name: '' }, 'name')).toEqual([
      'O nome é obrigatório.',
    ]);
  });

  it('leaves phone and birth date out when blank', () => {
    const parsed = registerStudentSchema.parse({
      ...VALID,
      phone: '  ',
      birthDate: '',
    });

    expect(parsed.phone).toBeUndefined();
    expect(parsed.birthDate).toBeUndefined();
  });

  it('accepts masked and unmasked Brazilian phones and rejects others', () => {
    for (const phone of ['(11) 98888-7777', '11988887777', '(11) 8888-7777']) {
      expect(
        messagesFor(registerStudentSchema, { ...VALID, phone }, 'phone')
      ).toEqual([]);
    }
    expect(
      messagesFor(registerStudentSchema, { ...VALID, phone: '123' }, 'phone')
    ).toEqual(['Telefone inválido. Use DDD e número.']);
  });

  it('UT-108 rejects a birth date of today as under the minimum age and a future one', () => {
    const today = todayInBrazil();
    expect(
      messagesFor(
        registerStudentSchema,
        { ...VALID, birthDate: today },
        'birthDate'
      )
    ).toContain('O aluno deve ter pelo menos 5 anos.');
    expect(
      messagesFor(
        registerStudentSchema,
        { ...VALID, birthDate: '2999-01-01' },
        'birthDate'
      )
    ).toContain('A data não pode ser futura.');
    expect(
      messagesFor(
        registerStudentSchema,
        { ...VALID, birthDate: '1990-05-20' },
        'birthDate'
      )
    ).toEqual([]);
  });

  it('rejects a birth date that makes the student older than 120', () => {
    expect(
      messagesFor(
        registerStudentSchema,
        { ...VALID, birthDate: '1850-01-01' },
        'birthDate'
      )
    ).toContain('Data de nascimento inválida.');
  });
});
