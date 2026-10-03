'use client';

import { createStudent } from '@/_actions/students/createStudent';
import { lookupStudentAccount } from '@/_actions/students/lookupStudentAccount';
import {
  addStudentReducer,
  eventForLookup,
  INITIAL_ADD_STUDENT_STATE,
  reactionToCreate,
} from '@/_lib/addStudentFlow';
import type { RegisterStudentData } from '@/_schema/students';
import { useRouter } from 'next/navigation';
import { useReducer } from 'react';
import { useServerAction } from 'zsa-react';

interface CreateInput {
  name?: string;
  email: string;
  phone?: string;
  birthDate?: string;
  linkExistingAccount: boolean;
}

/**
 * The state and actions behind the add-student panel. Nothing creates a
 * student except `link` and `register`, and each of them runs only from its
 * own button; every failure keeps what the educator typed.
 */
export function useAddStudent(onDone: () => void) {
  const router = useRouter();
  const [state, dispatch] = useReducer(
    addStudentReducer,
    INITIAL_ADD_STUDENT_STATE
  );
  const lookup = useServerAction(lookupStudentAccount);
  const create = useServerAction(createStudent);

  async function submitEmail(email: string) {
    const [found, error] = await lookup.execute({ email });
    dispatch(
      error
        ? { type: 'failed', message: error.message }
        : eventForLookup(email, found)
    );
  }

  async function run(input: CreateInput) {
    const [result, error] = await create.execute(input);
    const reaction = error
      ? ({ type: 'failed', message: error.message } as const)
      : reactionToCreate(result);

    if (reaction.type !== 'created') return dispatch(reaction);
    router.refresh();
    onDone();
  }

  return {
    state,
    isPending: lookup.isPending || create.isPending,
    submitEmail,
    link: () => run({ email: state.email, linkExistingAccount: true }),
    register: (values: RegisterStudentData) =>
      run({ ...values, email: state.email, linkExistingAccount: false }),
    registerWithoutAccount: () =>
      dispatch({ type: 'register-without-account' }),
    editEmail: () => dispatch({ type: 'email-edited' }),
    cancelConfirm: () => dispatch({ type: 'cancel-confirm' }),
  };
}
