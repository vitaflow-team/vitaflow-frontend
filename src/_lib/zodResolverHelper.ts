/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import type { FieldValues, Resolver } from 'react-hook-form';
import { z } from 'zod';

export function zodResolverFixed<
  TSchema extends z.ZodTypeAny,
  TOutput extends FieldValues = Record<string, unknown> & z.infer<TSchema>,
>(schema: TSchema): Resolver<TOutput> {
  return zodResolver(schema as any) as unknown as Resolver<TOutput>;
}
