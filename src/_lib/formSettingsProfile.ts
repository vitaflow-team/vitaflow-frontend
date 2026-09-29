import { formatDate } from '@/_lib/stringUtils';
import type { profileFormData } from '@/_schema/profile';
import type { FormSettingsProfile } from '@/_types/formSettingsProfile';

/**
 * Copies only what the profile form uses out of the backend's profile
 * response: the form is a Client Component, so everything passed to it ships
 * to the browser (A8).
 */
export function toFormSettingsProfile(
  profile: FormSettingsProfile
): FormSettingsProfile {
  const address = profile.address;
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    birthDate: profile.birthDate,
    avatar: profile.avatar,
    address: address && {
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      district: address.district,
      city: address.city,
      region: address.region,
      postalCode: address.postalCode,
    },
  };
}

/**
 * Initial values of the profile form: every missing field becomes an empty
 * string, the birth date is shown as `YYYY-MM-DD`, and no avatar file is set.
 */
export function toProfileFormValues(
  profile: FormSettingsProfile
): profileFormData {
  return {
    name: profile.name ?? '',
    phone: profile.phone ?? '',
    birthDate: profile.birthDate ? formatDate(profile.birthDate, 'en-CA') : '',
    avatar: undefined,
    email: profile.email ?? '',
    address: {
      addressLine1: profile.address?.addressLine1 ?? '',
      addressLine2: profile.address?.addressLine2 ?? '',
      district: profile.address?.district ?? '',
      city: profile.address?.city ?? '',
      region: profile.address?.region ?? '',
      postalCode: profile.address?.postalCode ?? '',
    },
  };
}
