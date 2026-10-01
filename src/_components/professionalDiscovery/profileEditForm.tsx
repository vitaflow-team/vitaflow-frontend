'use client';

import { updateMyProfile } from '@/_actions/professionalDiscovery/updateMyProfile';
import { Button } from '@/_components/ui/button';
import { Checkbox } from '@/_components/ui/checkbox';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { Textarea } from '@/_components/ui/textarea';
import { useProfessionalDiscoveryMutation } from '@/_hooks/useProfessionalDiscoveryMutation';
import type { ProfessionalProfile } from '@/_types/professionalDiscovery';
import { type FormEvent, useState } from 'react';

interface ProfileEditFormProps {
  profile: ProfessionalProfile;
}

// A keyword/pattern hint only, the same first-line-of-defense check the
// backend applies — the server is the actual enforcement (ADR-003, TechSpec
// Known Risks).
const CONTENT_RULE_HINT_PATTERN =
  /antes\s*(e|\/)\s*depois|resultado[s]?\s+garantid|garant(e|ia|ido|imos)\s+(o\s+)?resultado|cura\s+garantida/i;

/** The professional edits their own public profile (US-010). */
export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const { run, isPending } = useProfessionalDiscoveryMutation();
  const [bio, setBio] = useState(profile.bio ?? '');
  const [specialty, setSpecialty] = useState(profile.specialty ?? '');
  const [priceFrom, setPriceFrom] = useState(
    profile.priceFrom !== null ? String(profile.priceFrom) : ''
  );
  const [attendsOnline, setAttendsOnline] = useState(profile.attendsOnline);

  const contentHint = CONTENT_RULE_HINT_PATTERN.test(`${bio} ${specialty}`)
    ? 'Evite fotos de antes/depois ou garantias de resultado: o perfil não pode incluir esse tipo de conteúdo.'
    : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run(
      () =>
        updateMyProfile({
          bio: bio.trim() || undefined,
          specialty: specialty.trim() || undefined,
          priceFrom: priceFrom.trim() || undefined,
          attendsOnline,
        }),
      'Perfil atualizado.'
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="profile-specialty">Especialidade</Label>
        <Input
          id="profile-specialty"
          value={specialty}
          maxLength={120}
          onChange={event => setSpecialty(event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="profile-price">Preço inicial (R$)</Label>
        <Input
          id="profile-price"
          type="text"
          inputMode="decimal"
          value={priceFrom}
          onChange={event => setPriceFrom(event.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="profile-online"
          checked={attendsOnline}
          onCheckedChange={checked => setAttendsOnline(checked === true)}
        />
        <Label htmlFor="profile-online">Atendo online</Label>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="profile-bio">Bio</Label>
        <Textarea
          id="profile-bio"
          value={bio}
          maxLength={1000}
          rows={5}
          onChange={event => setBio(event.target.value)}
        />
        {contentHint && (
          <p className="text-destructive text-sm">{contentHint}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-fit">
        Salvar perfil
      </Button>
    </form>
  );
}
