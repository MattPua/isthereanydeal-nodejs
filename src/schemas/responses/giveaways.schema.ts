import { z } from 'zod'
import { GameSchema, PlatformsSchema, ShopSchema } from './common.schema'

const GiveawayGameSchema: z.ZodType<
	z.infer<typeof GameSchema> & {
		drmFree: boolean
		keys: z.infer<typeof ShopSchema>[]
		platforms: z.infer<typeof PlatformsSchema>[]
	}
> = GameSchema.extend({
	drmFree: z.boolean(),
	keys: z.array(ShopSchema),
	platforms: z.array(PlatformsSchema),
})

const GiveawaySchema: z.ZodType<{
	id: number
	title: string
	shop: z.infer<typeof ShopSchema>
	url: string
	details: string
	isMature: boolean
	publish: string
	expiry: string | null
	note: string | null
	games: z.infer<typeof GiveawayGameSchema>[]
}> = z.object({
	id: z.number(),
	title: z.string(),
	shop: ShopSchema,
	url: z.string(),
	details: z.string(),
	isMature: z.boolean(),
	publish: z.string(),
	expiry: z.string().nullable(),
	note: z.string().nullable(),
	games: z.array(GiveawayGameSchema),
})

export type GiveawayGame = z.infer<typeof GiveawayGameSchema>
export type Giveaway = z.infer<typeof GiveawaySchema>
