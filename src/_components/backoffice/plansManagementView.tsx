'use client';

import { createProduct } from '@/_actions/backoffice/plans/createProduct';
import { deactivateProduct } from '@/_actions/backoffice/plans/deactivateProduct';
import { repriceProduct } from '@/_actions/backoffice/plans/repriceProduct';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/_components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { FormError } from '@/_components/students/formError';
import {
  createProductSchema,
  repriceProductSchema,
} from '@/_schema/backoffice';
import type {
  ProductCatalogEntry,
  ProductTierName,
  ProductTypeName,
} from '@/_types/backofficePlans';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { useServerAction } from 'zsa-react';

const ROLE_ORDER: ProductTypeName[] = [
  'USER',
  'NUTRITIONIST',
  'PHYSICAL_EDUCATOR',
  'ACADEMIA',
];

const ROLE_LABEL: Record<ProductTypeName, string> = {
  USER: 'Usuário',
  NUTRITIONIST: 'Nutricionista',
  PHYSICAL_EDUCATOR: 'Educador físico',
  ACADEMIA: 'Academia',
};

const TIER_LABEL: Record<ProductTierName, string> = {
  FREE: 'Free',
  STANDARD: 'Standard',
  PREMIUM: 'Premium',
};

function formatPrice(value: string | number): string {
  const number = typeof value === 'string' ? Number(value) : value;
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

interface GroupOption {
  groupId: string;
  groupName: string;
}

/**
 * Groups the catalog never carried a "create a new group" route in the
 * TechSpec's API Endpoints table — `CreateProductInput.groupId` always
 * targets a group that already has at least one product, so the create
 * form offers only the groups already visible in the loaded catalog.
 */
function uniqueGroupOptions(catalog: ProductCatalogEntry[]): GroupOption[] {
  const seen = new Map<string, string>();
  for (const entry of catalog) {
    if (!seen.has(entry.groupId)) seen.set(entry.groupId, entry.groupName);
  }
  return Array.from(seen, ([groupId, groupName]) => ({ groupId, groupName }));
}

function groupEntriesByRole(
  catalog: ProductCatalogEntry[]
): Record<ProductTypeName, ProductCatalogEntry[]> {
  const grouped: Record<ProductTypeName, ProductCatalogEntry[]> = {
    USER: [],
    NUTRITIONIST: [],
    PHYSICAL_EDUCATOR: [],
    ACADEMIA: [],
  };
  for (const entry of catalog) {
    grouped[entry.type].push(entry);
  }
  return grouped;
}

type CreateProductFormData = z.output<typeof createProductSchema>;
type CreateProductFormInput = z.input<typeof createProductSchema>;

function emptyCreateForm(groupOptions: GroupOption[]): CreateProductFormInput {
  return {
    groupId: groupOptions[0]?.groupId ?? '',
    name: '',
    price: 0,
    type: 'USER',
    tier: 'STANDARD',
  };
}

type CreateProductMethods = UseFormReturn<
  CreateProductFormInput,
  unknown,
  CreateProductFormData
>;

function ProductNameAndPriceFields({
  methods,
  disabled,
}: {
  methods: CreateProductMethods;
  disabled: boolean;
}) {
  return (
    <>
      <FormField
        control={methods.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do produto</FormLabel>
            <FormControl>
              <Input {...field} disabled={disabled} placeholder="Mensal" />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={methods.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preço</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                min={0.01}
                step="0.01"
                disabled={disabled}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}

function ProductClassificationFields({
  methods,
  disabled,
  groupOptions,
}: {
  methods: CreateProductMethods;
  disabled: boolean;
  groupOptions: GroupOption[];
}) {
  return (
    <>
      <FormField
        control={methods.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Função</FormLabel>
            <FormControl>
              <select
                {...field}
                disabled={disabled}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {ROLE_ORDER.map(role => (
                  <option key={role} value={role}>
                    {ROLE_LABEL[role]}
                  </option>
                ))}
              </select>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={methods.control}
        name="tier"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tier</FormLabel>
            <FormControl>
              <select
                {...field}
                disabled={disabled}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {(Object.keys(TIER_LABEL) as ProductTierName[]).map(tier => (
                  <option key={tier} value={tier}>
                    {TIER_LABEL[tier]}
                  </option>
                ))}
              </select>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={methods.control}
        name="groupId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grupo</FormLabel>
            <FormControl>
              <select
                {...field}
                disabled={disabled || groupOptions.length === 0}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {groupOptions.length === 0 && (
                  <option value="">Nenhum grupo disponível</option>
                )}
                {groupOptions.map(group => (
                  <option key={group.groupId} value={group.groupId}>
                    {group.groupName}
                  </option>
                ))}
              </select>
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}

function CreateProductFields({
  methods,
  disabled,
  groupOptions,
}: {
  methods: CreateProductMethods;
  disabled: boolean;
  groupOptions: GroupOption[];
}) {
  return (
    <>
      <ProductNameAndPriceFields methods={methods} disabled={disabled} />
      <ProductClassificationFields
        methods={methods}
        disabled={disabled}
        groupOptions={groupOptions}
      />
    </>
  );
}

function CreateProductForm({ groupOptions }: { groupOptions: GroupOption[] }) {
  const router = useRouter();
  const action = useServerAction(createProduct);
  const methods = useForm<
    CreateProductFormInput,
    unknown,
    CreateProductFormData
  >({
    resolver: zodResolver(createProductSchema),
    defaultValues: emptyCreateForm(groupOptions),
  });

  async function submit(values: CreateProductFormData) {
    const [, error] = await action.execute(values);
    if (!error) {
      methods.reset(emptyCreateForm(groupOptions));
      router.refresh();
    }
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(submit)}
        className="bg-card flex flex-col gap-3 rounded-xl border p-4"
        noValidate
      >
        <CreateProductFields
          methods={methods}
          disabled={action.isPending}
          groupOptions={groupOptions}
        />
        <FormError message={action.isError ? action.error.message : null} />
        <Button
          type="submit"
          disabled={action.isPending}
          className="self-start"
        >
          {action.isPending ? 'Criando...' : 'Criar produto'}
        </Button>
      </form>
    </Form>
  );
}

type RepriceFormData = z.output<typeof repriceProductSchema>;
type RepriceFormInput = z.input<typeof repriceProductSchema>;

function RepriceForm({
  product,
  onDone,
}: {
  product: ProductCatalogEntry;
  onDone: () => void;
}) {
  const router = useRouter();
  const action = useServerAction(repriceProduct);
  const methods = useForm<RepriceFormInput, unknown, RepriceFormData>({
    resolver: zodResolver(repriceProductSchema),
    defaultValues: { productId: product.id, price: product.price },
  });

  async function submit(values: RepriceFormData) {
    const [, error] = await action.execute(values);
    if (!error) {
      onDone();
      router.refresh();
    }
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(submit)}
        className="flex flex-col gap-3"
        noValidate
      >
        <p className="text-muted-foreground text-sm">
          Um novo preço cria uma nova versão ativa deste produto; quem já assina
          continua com o preço atual.
        </p>
        <FormField
          control={methods.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Novo preço</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={0.01}
                  step="0.01"
                  disabled={action.isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormError message={action.isError ? action.error.message : null} />
        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={action.isPending}>
            {action.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function RepriceDialog({ product }: { product: ProductCatalogEntry }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Pencil aria-hidden="true" />
        Reprecificar
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reprecificar {product.name}</DialogTitle>
        </DialogHeader>
        <RepriceForm product={product} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function DeactivateButton({ product }: { product: ProductCatalogEntry }) {
  const router = useRouter();
  const action = useServerAction(deactivateProduct);

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={action.isPending}
      onClick={async () => {
        await action.execute({ productId: product.id });
        router.refresh();
      }}
    >
      Desativar
    </Button>
  );
}

function ProductRow({
  product,
  canMutate,
}: {
  product: ProductCatalogEntry;
  canMutate: boolean;
}) {
  return (
    <li className="bg-card flex items-center justify-between rounded-lg border px-4 py-3">
      <div>
        <p className="font-medium">
          {product.name}
          <span className="text-muted-foreground ml-2 text-xs">
            {TIER_LABEL[product.tier]}
          </span>
          {!product.active && (
            <span className="text-muted-foreground ml-2 text-xs">
              (desativado)
            </span>
          )}
        </p>
        <p className="text-muted-foreground text-sm">
          {formatPrice(product.price)}
        </p>
      </div>
      {canMutate && (
        <div className="flex gap-2">
          <RepriceDialog product={product} />
          {product.active && <DeactivateButton product={product} />}
        </div>
      )}
    </li>
  );
}

function RoleGroup({
  role,
  entries,
  canMutate,
}: {
  role: ProductTypeName;
  entries: ProductCatalogEntry[];
  canMutate: boolean;
}) {
  const hasActive = entries.some(entry => entry.active);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">{ROLE_LABEL[role]}</h2>
      {!hasActive && (
        <p className="text-muted-foreground text-sm">
          Nenhum produto ativo para {ROLE_LABEL[role]}.
        </p>
      )}
      {entries.length > 0 && (
        <ul className="flex flex-col gap-2">
          {entries.map(entry => (
            <ProductRow key={entry.id} product={entry} canMutate={canMutate} />
          ))}
        </ul>
      )}
    </section>
  );
}

interface PlansManagementViewProps {
  catalog: ProductCatalogEntry[];
  canMutate: boolean;
}

/**
 * Backoffice catalog screen (PRD US-001 through US-005, ADR-010): `EQUIPE`
 * sees the full catalog read-only; `ADMIN` also sees create/reprice/
 * deactivate controls. The backend's `AdminTierGuard` is the real
 * enforcement — `canMutate` only controls what renders here.
 */
export function PlansManagementView({
  catalog,
  canMutate,
}: PlansManagementViewProps) {
  const grouped = groupEntriesByRole(catalog);
  const groupOptions = uniqueGroupOptions(catalog);

  return (
    <div className="flex flex-col gap-6">
      {canMutate && <CreateProductForm groupOptions={groupOptions} />}
      {ROLE_ORDER.map(role => (
        <RoleGroup
          key={role}
          role={role}
          entries={grouped[role]}
          canMutate={canMutate}
        />
      ))}
    </div>
  );
}
