'use client';

import { cancelInvitation } from '@/_actions/academia/cancelInvitation';
import { endEmployment } from '@/_actions/academia/endEmployment';
import { inviteAcademiaMember } from '@/_actions/academia/inviteAcademiaMember';
import { removeStaff } from '@/_actions/academia/removeStaff';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/_components/ui/alert-dialog';
import { Button } from '@/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { Title } from '@/_components/ui/title';
import { useConfirmedAction } from '@/_hooks/useConfirmedAction';
import {
  inviteAcademiaMemberSchema,
  type InviteAcademiaMemberData,
} from '@/_schema/academia';
import type {
  AcademiaEmployment,
  AcademiaInvitation,
  AcademiaStaffMember,
} from '@/_types/academia';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { FormError } from '@/_components/students/formError';

const STATUS_LABEL: Record<AcademiaInvitation['status'], string> = {
  PENDING: 'Pendente',
  ACCEPTED: 'Aceito',
  DECLINED: 'Recusado',
  CANCELLED: 'Cancelado',
};

interface InviteMemberFormProps {
  kind: 'EMPLOYMENT' | 'RECEPTIONIST';
  label: string;
  placeholder: string;
}

function InviteMemberForm({ kind, label, placeholder }: InviteMemberFormProps) {
  const router = useRouter();
  const action = useServerAction(inviteAcademiaMember);
  const methods = useForm<InviteAcademiaMemberData>({
    resolver: zodResolver(inviteAcademiaMemberSchema),
    defaultValues: { email: '', kind },
  });

  async function submit(values: InviteAcademiaMemberData) {
    const [, error] = await action.execute(values);
    if (!error) {
      methods.reset({ email: '', kind });
      router.refresh();
    }
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(submit)}
        className="flex flex-col gap-2 sm:flex-row sm:items-end"
        noValidate
      >
        <FormField
          control={methods.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  icon={Mail}
                  placeholder={placeholder}
                  disabled={action.isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={action.isPending}>
          {action.isPending ? 'Convidando...' : 'Convidar'}
        </Button>
      </form>
      <FormError message={action.isError ? action.error.message : null} />
    </Form>
  );
}

function PendingInvitations({
  invitations,
}: {
  invitations: AcademiaInvitation[];
}) {
  const router = useRouter();
  const action = useServerAction(cancelInvitation);
  const pending = invitations.filter(item => item.status === 'PENDING');

  if (pending.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2">
      {pending.map(invitation => (
        <li
          key={invitation.id}
          className="bg-card flex items-center justify-between rounded-lg border px-4 py-3"
        >
          <div>
            <p className="font-medium">{invitation.email}</p>
            <p className="text-muted-foreground text-sm">
              {STATUS_LABEL[invitation.status]}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={action.isPending}
            onClick={async () => {
              await action.execute({ id: invitation.id });
              router.refresh();
            }}
          >
            Cancelar convite
          </Button>
        </li>
      ))}
    </ul>
  );
}

function EndEmploymentButton({
  employment,
}: {
  employment: AcademiaEmployment;
}) {
  const router = useRouter();
  const action = useServerAction(endEmployment);
  const confirmed = useConfirmedAction(
    action.execute,
    { id: employment.id },
    () => {
      router.refresh();
    }
  );

  return (
    <AlertDialog onOpenChange={confirmed.clearError}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 aria-hidden="true" />
          Encerrar vínculo
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Encerrar o vínculo com {employment.educator.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Os alunos da academia atendidos por este educador continuam
            existindo, agora sem educador atribuído.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormError message={confirmed.error} />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={action.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmed.run}
            disabled={action.isPending}
          >
            Encerrar vínculo
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RemoveStaffButton({ staff }: { staff: AcademiaStaffMember }) {
  const router = useRouter();
  const action = useServerAction(removeStaff);
  const confirmed = useConfirmedAction(action.execute, { id: staff.id }, () => {
    router.refresh();
  });

  return (
    <AlertDialog onOpenChange={confirmed.clearError}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 aria-hidden="true" />
          Remover
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover {staff.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            O acesso dela à conta da academia é encerrado imediatamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FormError message={confirmed.error} />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={action.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmed.run}
            disabled={action.isPending}
          >
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface TeamSectionProps {
  invitations: AcademiaInvitation[];
  employments: AcademiaEmployment[];
  staff: AcademiaStaffMember[];
}

export function TeamSection({
  invitations,
  employments,
  staff,
}: TeamSectionProps) {
  const employmentInvitations = invitations.filter(
    item => item.kind === 'EMPLOYMENT'
  );
  const staffInvitations = invitations.filter(
    item => item.kind === 'RECEPTIONIST'
  );

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <Title label="Educadores" size="h3" className="text-left" />
        <InviteMemberForm
          kind="EMPLOYMENT"
          label="Convidar educador por e-mail"
          placeholder="E-mail do educador"
        />
        <PendingInvitations invitations={employmentInvitations} />
        {employments.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum educador com vínculo ativo.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {employments.map(employment => (
              <li
                key={employment.id}
                className="bg-card flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <div>
                  <p className="font-medium">{employment.educator.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {employment.educator.email}
                  </p>
                </div>
                <EndEmploymentButton employment={employment} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <Title label="Recepcionistas" size="h3" className="text-left" />
        <InviteMemberForm
          kind="RECEPTIONIST"
          label="Convidar recepcionista por e-mail"
          placeholder="E-mail da recepcionista"
        />
        <PendingInvitations invitations={staffInvitations} />
        {staff.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhuma recepcionista ativa.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {staff
              .filter(member => member.active)
              .map(member => (
                <li
                  key={member.id}
                  className="bg-card flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {member.email}
                    </p>
                  </div>
                  <RemoveStaffButton staff={member} />
                </li>
              ))}
          </ul>
        )}
      </section>
    </div>
  );
}
