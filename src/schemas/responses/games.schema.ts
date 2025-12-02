import { z } from 'zod'
import {
	BaseDealSchema,
	BundleSchema,
	GameSchema,
	GameUrlsSchema,
	HistoricLowPriceSchema,
	PlatformsSchema,
	PriceSchema,
	ShopSchema,
} from './common.schema'

const LookupGameResponseSchema: z.ZodObject<{
	found: z.ZodBoolean
	game: z.ZodOptional<
		z.ZodObject<
			{
				id: z.ZodString
				slug: z.ZodString
				title: z.ZodString
				type: z.ZodNullable<
					z.ZodEnum<{
						game: 'game'
						dlc: 'dlc'
						package: 'package'
					}>
				>
				mature: z.ZodBoolean
				assets: z.ZodOptional<
					z.ZodObject<
						{
							boxart: z.ZodOptional<z.ZodURL>
							banner145: z.ZodOptional<z.ZodString>
							banner300: z.ZodOptional<z.ZodURL>
							banner400: z.ZodOptional<z.ZodURL>
							banner600: z.ZodOptional<z.ZodURL>
						},
						z.core.$strip
					>
				>
			},
			z.core.$strip
		>
	>
}> = z.object({
	found: z.boolean(),
	game: GameSchema.optional().describe(
		'The game if found, otherwise undefined',
	),
})

const GameInfoResponseSchema: z.ZodObject<{
	id: z.ZodString
	slug: z.ZodString
	title: z.ZodString
	type: z.ZodNullable<
		z.ZodEnum<{
			game: 'game'
			dlc: 'dlc'
			package: 'package'
		}>
	>
	mature: z.ZodBoolean
	assets: z.ZodOptional<
		z.ZodObject<
			{
				boxart: z.ZodOptional<z.ZodURL>
				banner145: z.ZodOptional<z.ZodString>
				banner300: z.ZodOptional<z.ZodURL>
				banner400: z.ZodOptional<z.ZodURL>
				banner600: z.ZodOptional<z.ZodURL>
			},
			z.core.$strip
		>
	>
	earlyAccess: z.ZodBoolean
	achivements: z.ZodBoolean
	tradingCards: z.ZodBoolean
	appid: z.ZodNullable<z.ZodNumber>
	tags: z.ZodArray<z.ZodString>
	releaseDate: z.ZodString
	stats: z.ZodObject<
		{
			rank: z.ZodNumber
			waitlisted: z.ZodNumber
			collected: z.ZodNumber
		},
		z.core.$strip
	>
	developers: z.ZodArray<
		z.ZodObject<
			{
				id: z.ZodNumber
				name: z.ZodString
			},
			z.core.$strip
		>
	>
	publishers: z.ZodArray<
		z.ZodObject<
			{
				id: z.ZodNumber
				name: z.ZodString
			},
			z.core.$strip
		>
	>
	reviews: z.ZodArray<
		z.ZodObject<
			{
				score: z.ZodNullable<z.ZodNumber>
				count: z.ZodNumber
				source: z.ZodString
				url: z.ZodURL
			},
			z.core.$strip
		>
	>
	players: z.ZodNullable<
		z.ZodObject<
			{
				recent: z.ZodNumber
				day: z.ZodNumber
				weekly: z.ZodNumber
				peak: z.ZodNumber
			},
			z.core.$strip
		>
	>
	urls: z.ZodObject<
		{
			game: z.ZodURL
		},
		z.core.$strip
	>
}> = GameSchema.extend({
	earlyAccess: z.boolean(),
	achivements: z.boolean(),
	tradingCards: z.boolean(),
	appid: z.number().describe('The Steam appid of the game').nullable(),
	tags: z.array(z.string()),
	releaseDate: z.string(),
	stats: z.object({
		rank: z.number(),
		waitlisted: z.number(),
		collected: z.number(),
	}),
	developers: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
		}),
	),
	publishers: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
		}),
	),
	reviews: z.array(
		z.object({
			score: z.number().nullable(),
			count: z.number(),
			source: z.string(),
			url: z.url().describe('The URL of the review'),
		}),
	),

	players: z
		.object({
			recent: z.number(),
			day: z.number(),
			weekly: z.number(),
			peak: z.number(),
		})
		.nullable(),
	urls: GameUrlsSchema,
})

const HistoryLowSchema = z.object({
	all: PriceSchema,
	y1: PriceSchema,
	m3: PriceSchema,
})

const DealSchema = z
	.object({
		shop: ShopSchema,
		voucher: z.string().nullable(),
		storeLow: PriceSchema,
		flag: z.string().nullable(),
		drm: z.array(z.unknown()), // DRM structure unknown, keeping generic
		platforms: z.array(PlatformsSchema),
		timestamp: z.string(),
		expiry: z.string().nullable(),
		url: z.string(),
	})
	.and(BaseDealSchema)

const PriceListingCurrentSchema = z
	.object({
		shop: ShopSchema,
		voucher: z.string().nullable().optional(),
		flag: z.string().nullable().optional(),
		drm: z
			.array(
				z.object({
					id: z.number(),
					name: z.string(),
				}),
			)
			.optional(),
		platforms: z.array(PlatformsSchema),
		timestamp: z.string(),
		expiry: z.string().nullable(),
		url: z.string(),
	})
	.and(BaseDealSchema)

const PriceListingPriceSchema = z.object({
	id: z.string(),
	current: PriceListingCurrentSchema,
	lowest: HistoricLowPriceSchema,
	bundled: z.number(),
	urls: GameUrlsSchema,
})

const PriceListSchema: z.ZodObject<{
	id: z.ZodString
	historyLow: z.ZodObject<
		{
			all: z.ZodObject<
				{
					amount: z.ZodNumber
					amountInt: z.ZodNumber
					currency: z.ZodString
				},
				z.core.$strip
			>
			y1: z.ZodObject<
				{
					amount: z.ZodNumber
					amountInt: z.ZodNumber
					currency: z.ZodString
				},
				z.core.$strip
			>
			m3: z.ZodObject<
				{
					amount: z.ZodNumber
					amountInt: z.ZodNumber
					currency: z.ZodString
				},
				z.core.$strip
			>
		},
		z.core.$strip
	>
	deals: z.ZodArray<
		z.ZodIntersection<
			z.ZodObject<
				{
					shop: z.ZodObject<
						{
							id: z.ZodNumber
							name: z.ZodString
						},
						z.core.$strip
					>
					voucher: z.ZodNullable<z.ZodString>
					storeLow: z.ZodObject<
						{
							amount: z.ZodNumber
							amountInt: z.ZodNumber
							currency: z.ZodString
						},
						z.core.$strip
					>
					flag: z.ZodNullable<z.ZodString>
					drm: z.ZodArray<z.ZodUnknown>
					platforms: z.ZodArray<
						z.ZodObject<
							{
								id: z.ZodNumber
								name: z.ZodString
							},
							z.core.$strip
						>
					>
					timestamp: z.ZodString
					expiry: z.ZodNullable<z.ZodString>
					url: z.ZodString
				},
				z.core.$strip
			>,
			z.ZodObject<
				{
					price: z.ZodObject<
						{
							amount: z.ZodNumber
							amountInt: z.ZodNumber
							currency: z.ZodString
						},
						z.core.$strip
					>
					regular: z.ZodObject<
						{
							amount: z.ZodNumber
							amountInt: z.ZodNumber
							currency: z.ZodString
						},
						z.core.$strip
					>
					cut: z.ZodNumber
				},
				z.core.$strip
			>
		>
	>
}> = z.object({
	id: z.string(),
	historyLow: HistoryLowSchema,
	deals: z.array(DealSchema),
})

export const PricesResponseSchema: z.ZodObject<{
	prices: z.ZodArray<
		z.ZodObject<
			{
				id: z.ZodString
				current: z.ZodIntersection<
					z.ZodObject<
						{
							shop: z.ZodObject<
								{
									id: z.ZodNumber
									name: z.ZodString
								},
								z.core.$strip
							>
							voucher: z.ZodOptional<z.ZodNullable<z.ZodString>>
							flag: z.ZodOptional<z.ZodNullable<z.ZodString>>
							drm: z.ZodOptional<
								z.ZodArray<
									z.ZodObject<
										{
											id: z.ZodNumber
											name: z.ZodString
										},
										z.core.$strip
									>
								>
							>
							platforms: z.ZodArray<
								z.ZodObject<
									{
										id: z.ZodNumber
										name: z.ZodString
									},
									z.core.$strip
								>
							>
							timestamp: z.ZodString
							expiry: z.ZodNullable<z.ZodString>
							url: z.ZodString
						},
						z.core.$strip
					>,
					z.ZodObject<
						{
							price: z.ZodObject<
								{
									amount: z.ZodNumber
									amountInt: z.ZodNumber
									currency: z.ZodString
								},
								z.core.$strip
							>
							regular: z.ZodObject<
								{
									amount: z.ZodNumber
									amountInt: z.ZodNumber
									currency: z.ZodString
								},
								z.core.$strip
							>
							cut: z.ZodNumber
						},
						z.core.$strip
					>
				>
				lowest: z.ZodObject<
					{
						id: z.ZodString
						low: z.ZodObject<
							{
								shop: z.ZodObject<
									{
										id: z.ZodNumber
										name: z.ZodString
									},
									z.core.$strip
								>
								price: z.ZodObject<
									{
										amount: z.ZodNumber
										amountInt: z.ZodNumber
										currency: z.ZodString
									},
									z.core.$strip
								>
								regular: z.ZodObject<
									{
										amount: z.ZodNumber
										amountInt: z.ZodNumber
										currency: z.ZodString
									},
									z.core.$strip
								>
								cut: z.ZodNumber
								timestamp: z.ZodString
							},
							z.core.$strip
						>
					},
					z.core.$strip
				>
				bundled: z.ZodNumber
				urls: z.ZodObject<
					{
						game: z.ZodURL
					},
					z.core.$strip
				>
			},
			z.core.$strip
		>
	>
	bundles: z.ZodArray<
		z.ZodObject<
			{
				id: z.ZodNumber
				title: z.ZodString
				page: z.ZodObject<
					{
						id: z.ZodNumber
						name: z.ZodString
						shopId: z.ZodNumber
					},
					z.core.$strip
				>
				url: z.ZodString
				details: z.ZodString
				isMature: z.ZodBoolean
				publish: z.ZodString
				expiry: z.ZodNullable<z.ZodString>
				counts: z.ZodObject<
					{
						games: z.ZodNumber
						media: z.ZodNumber
					},
					z.core.$strip
				>
				tiers: z.ZodArray<
					z.ZodObject<
						{
							price: z.ZodObject<
								{
									amount: z.ZodNumber
									amountInt: z.ZodNumber
									currency: z.ZodString
								},
								z.core.$strip
							>
							games: z.ZodArray<
								z.ZodObject<
									{
										id: z.ZodString
										slug: z.ZodString
										title: z.ZodString
										type: z.ZodNullable<
											z.ZodEnum<{
												game: 'game'
												dlc: 'dlc'
												package: 'package'
											}>
										>
										mature: z.ZodBoolean
										assets: z.ZodOptional<
											z.ZodObject<
												{
													boxart: z.ZodOptional<z.ZodURL>
													banner145: z.ZodOptional<z.ZodString>
													banner300: z.ZodOptional<z.ZodURL>
													banner400: z.ZodOptional<z.ZodURL>
													banner600: z.ZodOptional<z.ZodURL>
												},
												z.core.$strip
											>
										>
									},
									z.core.$strip
								>
							>
						},
						z.core.$strip
					>
				>
			},
			z.core.$strip
		>
	>
}> = z.object({
	prices: z.array(PriceListingPriceSchema),
	bundles: z.array(BundleSchema),
})

const GameSubscriptionsResponseSchema: z.ZodObject<{
	id: z.ZodString
	subs: z.ZodArray<
		z.ZodObject<
			{
				id: z.ZodString
				name: z.ZodString
				leaving: z.ZodString
			},
			z.core.$strip
		>
	>
}> = z.object({
	id: z.string(),
	subs: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			leaving: z.string(),
		}),
	),
})

const HistoryLogSchema: z.ZodObject<{
	timestamp: z.ZodString
	shop: z.ZodObject<
		{
			id: z.ZodNumber
			name: z.ZodString
		},
		z.core.$strip
	>
	deal: z.ZodObject<
		{
			price: z.ZodObject<
				{
					amount: z.ZodNumber
					amountInt: z.ZodNumber
					currency: z.ZodString
				},
				z.core.$strip
			>
			regular: z.ZodObject<
				{
					amount: z.ZodNumber
					amountInt: z.ZodNumber
					currency: z.ZodString
				},
				z.core.$strip
			>
			cut: z.ZodNumber
		},
		z.core.$strip
	>
}> = z.object({
	timestamp: z.string(),
	shop: ShopSchema,
	deal: BaseDealSchema,
})

export type HistoryLog = z.infer<typeof HistoryLogSchema>

export type GameSubscriptionsResponse = z.infer<
	typeof GameSubscriptionsResponseSchema
>

export type PricesResponse = z.infer<typeof PriceListSchema>
export type PriceOverview = z.infer<typeof PricesResponseSchema>

export type LookupGameResponse = z.infer<typeof LookupGameResponseSchema>
export type GameInfoResponse = z.infer<typeof GameInfoResponseSchema>
