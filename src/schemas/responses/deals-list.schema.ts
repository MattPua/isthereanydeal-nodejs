import { z } from 'zod'
import {
	BaseDealSchema,
	DRMSchema,
	GameSchema,
	PlatformsSchema,
	PriceSchema,
} from './common.schema'

const DealsListSchema: z.ZodObject<
	{
		nextOffset: z.ZodNumber
		hasMore: z.ZodBoolean
		list: z.ZodArray<
			z.ZodIntersection<
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
				>,
				z.ZodObject<
					{
						deal: z.ZodIntersection<
							z.ZodObject<
								{
									voucher: z.ZodNullable<z.ZodString>
									storeLow: z.ZodNullable<
										z.ZodObject<
											{
												amount: z.ZodNumber
												amountInt: z.ZodNumber
												currency: z.ZodString
											},
											z.core.$strip
										>
									>
									historyLow: z.ZodNullable<
										z.ZodObject<
											{
												amount: z.ZodNumber
												amountInt: z.ZodNumber
												currency: z.ZodString
											},
											z.core.$strip
										>
									>
									historyLow_1y: z.ZodNullable<
										z.ZodObject<
											{
												amount: z.ZodNumber
												amountInt: z.ZodNumber
												currency: z.ZodString
											},
											z.core.$strip
										>
									>
									historyLow_3m: z.ZodNullable<
										z.ZodObject<
											{
												amount: z.ZodNumber
												amountInt: z.ZodNumber
												currency: z.ZodString
											},
											z.core.$strip
										>
									>
									flag: z.ZodNullable<z.ZodString>
									drm: z.ZodArray<
										z.ZodObject<
											{
												id: z.ZodNumber
												name: z.ZodString
											},
											z.core.$strip
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
									url: z.ZodURL
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
					},
					z.core.$strip
				>
			>
		>
	},
	z.core.$strip
> = z.object({
	nextOffset: z.number().min(0),
	hasMore: z.boolean(),
	list: z.array(
		GameSchema.and(
			z.object({
				deal: z
					.object({
						voucher: z.string().nullable(),
						storeLow: PriceSchema.nullable(),
						historyLow: PriceSchema.nullable(),
						historyLow_1y: PriceSchema.nullable(),
						historyLow_3m: PriceSchema.nullable(),
						flag: z.string().nullable(),
						drm: z.array(DRMSchema),
						platforms: z.array(PlatformsSchema),
						timestamp: z.string(),
						expiry: z.string().nullable(),
						url: z.url(),
					})
					.and(BaseDealSchema),
			}),
		),
	),
})

export type DealsList = z.infer<typeof DealsListSchema>

export type DealsFilterRange<T = unknown> = {
	min?: T | null
	max?: T | null
}

export type DealsFilter = Record<string, unknown> & {
	price?: DealsFilterRange
	regular?: DealsFilterRange
	cut?: DealsFilterRange<number>
	flag?: string
	hlprice?: number
	hlperc?: number
	drm?: number[]
	platform?: number[]
	type?: number[]
	typeNot?: number | null
	tradingCards?: boolean
	achievements?: boolean
	mature?: boolean
	earlyAccess?: boolean
	preOrder?: boolean
	notPreOrder?: boolean
	bundled?: boolean
	wasBundled?: boolean
	neverBundled?: boolean
	tags?: string[]
	tagsUnion?: string[]
	inSpotlight?: boolean
	wasSpotlight?: boolean
	inBundle?: number
	steamPerc?: DealsFilterRange<number>
	steamCount?: DealsFilterRange<number>
	metaCritic?: DealsFilterRange<number>
	metauser?: DealsFilterRange<number>
	openCritic?: DealsFilterRange<number>
	shops?: number[]
	added?: number
	expiry?: number
	releaseDays?: number
	releaseYear?: DealsFilterRange<number>
	releaseDate?: DealsFilterRange<string>
}

export interface DealsListOptions {
	country?: string
	offset?: number
	limit?: number
	sort?: string
	nondeals?: boolean
	mature?: boolean
	shops?: number[] | string
	filter?: DealsFilter | string
}

export type DealsListPostOptions = Omit<DealsListOptions, 'filter'> & {
	filter?: DealsFilter
}
