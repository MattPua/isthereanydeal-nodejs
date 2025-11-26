import { z } from 'zod'

const LookupGamesByTitlesResponseSchema: z.ZodRecord<
	z.ZodString,
	z.ZodNullable<z.ZodString>
> = z.record(z.string(), z.string().nullable())

const LookupGamesByShopIdsResponseSchema: z.ZodRecord<
	z.ZodString,
	z.ZodNullable<z.ZodString>
> = z.record(z.string(), z.string().nullable())

export type LookupGamesByTitlesResponse = z.infer<
	typeof LookupGamesByTitlesResponseSchema
>

export type LookupGamesByShopIdsResponse = z.infer<
	typeof LookupGamesByShopIdsResponseSchema
>
