import type { SignInResponse } from './signInResponse';

export type AuthenticatedUser = Omit<SignInResponse, 'accessToken'>;
