import { STUDENT_ALREADY_REGISTERED_MESSAGE } from '@/_constants/studentErrors';
import type { CreateStudentOutcome } from '@/_types/createStudentOutcome';
import type { AccountLookup } from '@/_types/students';

export type AddStudentStep = 'email' | 'confirm' | 'register';
export type StudentOwnership = 'PARTICULAR' | 'ACADEMIA';

export interface AddStudentState {
  step: AddStudentStep;
  email: string;
  /** Holder of the account found for the e-mail, shown for confirmation. */
  accountName: string | null;
  error: string | null;
  ownership: StudentOwnership;
  academiaId: string | null;
}

export type AddStudentEvent =
  | { type: 'lookup-found'; email: string; accountName: string | null }
  | { type: 'lookup-missing'; email: string }
  | { type: 'register-without-account' }
  | { type: 'account-exists'; accountName: string | null }
  | { type: 'email-edited' }
  | { type: 'cancel-confirm' }
  | { type: 'failed'; message: string }
  | { type: 'ownership-changed'; ownership: StudentOwnership }
  | { type: 'academia-changed'; academiaId: string }
  | { type: 'reset' };

export const INITIAL_ADD_STUDENT_STATE: AddStudentState = {
  step: 'email',
  email: '',
  accountName: null,
  error: null,
  ownership: 'PARTICULAR',
  academiaId: null,
};

/**
 * The steps of the add-student panel: e-mail, then either the confirmation of
 * an existing account's holder or the register-without-account form. Nothing
 * here creates a student; only a step's own action does.
 */
export function addStudentReducer(
  state: AddStudentState,
  event: AddStudentEvent
): AddStudentState {
  switch (event.type) {
    case 'lookup-found':
      return {
        ...state,
        step: 'confirm',
        email: event.email,
        accountName: event.accountName,
        error: null,
      };
    case 'lookup-missing':
      return {
        ...state,
        step: 'register',
        email: event.email,
        accountName: null,
        error: null,
      };
    case 'register-without-account':
      return { ...state, step: 'register', error: null };
    case 'account-exists':
      return {
        ...state,
        step: 'confirm',
        accountName: event.accountName,
        error: null,
      };
    case 'email-edited':
      return { ...state, step: 'email', accountName: null, error: null };
    case 'cancel-confirm':
      return { ...state, step: 'email', accountName: null, error: null };
    case 'failed':
      return { ...state, error: event.message };
    case 'ownership-changed':
      return { ...state, ownership: event.ownership, academiaId: null };
    case 'academia-changed':
      return { ...state, academiaId: event.academiaId };
    case 'reset':
      return INITIAL_ADD_STUDENT_STATE;
  }
}

/** What a lookup answer means for the panel: confirm an account, or register without one. */
export function eventForLookup(
  email: string,
  lookup: AccountLookup
): AddStudentEvent {
  return lookup.found
    ? { type: 'lookup-found', email, accountName: lookup.name }
    : { type: 'lookup-missing', email };
}

export type CreateReaction = AddStudentEvent | { type: 'created' };

/** What the register action's outcome means for the panel. */
export function reactionToCreate(
  outcome: CreateStudentOutcome
): CreateReaction {
  switch (outcome.outcome) {
    case 'created':
      return { type: 'created' };
    case 'account_exists':
      return { type: 'account-exists', accountName: outcome.accountName };
    case 'already_registered':
      return { type: 'failed', message: STUDENT_ALREADY_REGISTERED_MESSAGE };
  }
}
