import type { profileFormData } from '@/_schema/profile';

/** The profile fields `FormSettings` renders or edits, and nothing else. */
export type FormSettingsProfile = Omit<profileFormData, 'avatar'> & {
  avatar?: string | null;
};
