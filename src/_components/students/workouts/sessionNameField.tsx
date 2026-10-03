'use client';

import { SESSION_NAME_MAX } from '@/_constants/educatorWorkoutLimits';
import type { EditorAction } from '@/_lib/workoutEditor';
import type { Dispatch } from 'react';
import { TextField } from './textField';

interface SessionNameFieldProps {
  sessionKey: string;
  label: string;
  value: string;
  error: string | undefined;
  dispatch: Dispatch<EditorAction>;
}

/** The required name of a session, with its message beside it. */
export function SessionNameField({
  sessionKey,
  label,
  value,
  error,
  dispatch,
}: SessionNameFieldProps) {
  return (
    <TextField
      id={`${sessionKey}-name`}
      label={`Nome da sessão ${label}`}
      value={value}
      error={error}
      maxLength={SESSION_NAME_MAX}
      required
      onChange={name => dispatch({ type: 'rename-session', sessionKey, name })}
    />
  );
}
