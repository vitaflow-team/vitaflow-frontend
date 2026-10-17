'use client';

import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import type { Template, TemplatePurpose } from '@/_types/clinicalRecords';
import type { TemplateActions } from '@/_types/clinicalRecordsActions';
import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';
import { TemplateEditor } from './templateEditor';

interface TemplatesPanelProps {
  purpose: TemplatePurpose;
  templates: Template[];
  actions: TemplateActions;
}

function TemplateRow({
  template,
  actions,
}: {
  template: Template;
  actions: TemplateActions;
}) {
  const router = useRouter();
  const { execute, isPending } = useServerAction(actions.discontinue);
  const [editing, setEditing] = useState(false);

  return (
    <li className="flex flex-col gap-2 border-b border-line py-3 last:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={template.active ? 'font-medium' : 'text-muted-foreground'}
        >
          {template.name}
          {!template.active && ' (descontinuado)'}
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setEditing(open => !open)}
          >
            {editing ? 'Fechar' : 'Editar'}
          </Button>
          {template.active && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isPending}
              onClick={async () => {
                await execute({ id: template.id });
                router.refresh();
              }}
            >
              Descontinuar
            </Button>
          )}
        </div>
      </div>
      {editing && (
        <TemplateEditor
          purpose={template.purpose}
          existing={template}
          actions={actions}
          onSaved={() => setEditing(false)}
        />
      )}
    </li>
  );
}

/** Create, edit and discontinue templates for one purpose (US-003/US-004). */
export function TemplatesPanel({
  purpose,
  templates,
  actions,
}: TemplatesPanelProps) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={next => {
        setOpen(next);
        if (!next) setCreating(false);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Settings aria-hidden="true" />
          Modelos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Seus modelos</DialogTitle>
        </DialogHeader>
        {creating ? (
          <TemplateEditor
            purpose={purpose}
            actions={actions}
            onSaved={() => setCreating(false)}
          />
        ) : (
          <>
            <ul aria-label="Modelos" className="flex flex-col">
              {templates.map(template => (
                <TemplateRow
                  key={template.id}
                  template={template}
                  actions={actions}
                />
              ))}
            </ul>
            <Button
              type="button"
              onClick={() => setCreating(true)}
              className="w-fit"
            >
              Novo modelo
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
