import { z } from 'zod'

const ShopListItemSchema: z.ZodObject<
	{
		id: z.ZodNumber
		title: z.ZodString
		games: z.ZodNumber
		deals: z.ZodNumber
		update: z.ZodNullable<z.ZodString>
	},
	z.core.$strip
> = z.object({
	id: z.number(),
	title: z.string(),
	games: z.number().min(0),
	deals: z.number().min(0),
	update: z.string().nullable(),
})

export type ShopListItem = z.infer<typeof ShopListItemSchema>
