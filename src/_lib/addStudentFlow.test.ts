import { describe, expect, it } from 'vitest';
import {
  addStudentReducer,
  eventForLookup,
  INITIAL_ADD_STUDENT_STATE,
  reactionToCreate,
  type AddStudentState,
} from './addStudentFlow';

const CONFIRMING: AddStudentState = {
  step: 'confirm',
  email: 'diego@exemplo.com',
  accountName: 'Diego Martins',
  error: null,
};

describe('add student flow', () => {
  it('UT-114 goes to the confirmation with the holder name when an account is found', () => {
    const event = eventForLookup('diego@exemplo.com', {
      found: true,
      name: 'Diego Martins',
    });

    expect(addStudentReducer(INITIAL_ADD_STUDENT_STATE, event)).toEqual(
      CONFIRMING
    );
  });

  it('UT-115 goes to registering without an account when nothing is found', () => {
    const event = eventForLookup('novo@exemplo.com', {
      found: false,
      name: null,
    });

    expect(addStudentReducer(INITIAL_ADD_STUDENT_STATE, event)).toEqual({
      step: 'register',
      email: 'novo@exemplo.com',
      accountName: null,
      error: null,
    });
  });

  it('UT-116 editing the e-mail clears the account and the confirmation', () => {
    expect(addStudentReducer(CONFIRMING, { type: 'email-edited' })).toEqual({
      step: 'email',
      email: 'diego@exemplo.com',
      accountName: null,
      error: null,
    });
  });

  it('UT-118 a failure keeps the step and what was typed, and shows the error', () => {
    const next = addStudentReducer(CONFIRMING, {
      type: 'failed',
      message: 'Falhou.',
    });

    expect(next).toEqual({ ...CONFIRMING, error: 'Falhou.' });
  });

  it('UT-119 a 409 account_exists outcome switches to the confirmation with the name', () => {
    const registering: AddStudentState = {
      step: 'register',
      email: 'diego@exemplo.com',
      accountName: null,
      error: null,
    };
    const reaction = reactionToCreate({
      outcome: 'account_exists',
      accountName: 'Diego Martins',
    });

    expect(addStudentReducer(registering, reaction as never)).toEqual(
      CONFIRMING
    );
  });

  it('UT-122 an already registered outcome says so', () => {
    expect(reactionToCreate({ outcome: 'already_registered' })).toEqual({
      type: 'failed',
      message: 'Você já cadastrou um aluno com este e-mail.',
    });
  });

  it('reports a created student so the panel can close', () => {
    expect(reactionToCreate({ outcome: 'created', id: 'x' })).toEqual({
      type: 'created',
    });
  });

  it('UT-123 cancelling the confirmation creates nothing and returns to the e-mail', () => {
    const next = addStudentReducer(CONFIRMING, { type: 'cancel-confirm' });

    expect(next.step).toBe('email');
    expect(next.email).toBe('diego@exemplo.com');
    expect(next.accountName).toBeNull();
  });

  it('lets the educator register without an account from the confirmation', () => {
    expect(
      addStudentReducer(CONFIRMING, { type: 'register-without-account' }).step
    ).toBe('register');
  });

  it('starts over on reset', () => {
    expect(addStudentReducer(CONFIRMING, { type: 'reset' })).toEqual(
      INITIAL_ADD_STUDENT_STATE
    );
  });
});
