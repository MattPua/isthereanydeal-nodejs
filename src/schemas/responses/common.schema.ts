import { z } from 'zod';

export const AssetsSchema: z.ZodObject<{
	boxart: z.ZodOptional<z.ZodURL>;
	banner145: z.ZodOptional<z.ZodString>;
	banner300: z.ZodOptional<z.ZodURL>;
	banner400: z.ZodOptional<z.ZodURL>;
	banner600: z.ZodOptional<z.ZodURL>;
}> = z.object({
	boxart: z.url().optional(),
	banner145: z.string().optional(),
	banner300: z.url().optional(),
	banner400: z.url().optional(),
	banner600: z.url().optional(),
});

export const GameSchema: z.ZodObject<{
	id: z.ZodString;
	slug: z.ZodString;
	title: z.ZodString;
	type: z.ZodNullable<
		z.ZodEnum<{
			game: 'game';
			dlc: 'dlc';
			package: 'package';
		}>
	>;
	mature: z.ZodBoolean;
	assets: z.ZodOptional<
		z.ZodObject<
			{
				boxart: z.ZodOptional<z.ZodURL>;
				banner145: z.ZodOptional<z.ZodString>;
				banner300: z.ZodOptional<z.ZodURL>;
				banner400: z.ZodOptional<z.ZodURL>;
				banner600: z.ZodOptional<z.ZodURL>;
			},
			z.core.$strip
		>
	>;
}> = z.object({
	id: z
		.string()
		.describe(
			'The ID of the game on IThereAnyDeal (not to be confused with the Steam appid)'
		),
	slug: z.string(),
	title: z.string(),
	type: z.enum(['game', 'dlc', 'package']).nullable(),
	mature: z.boolean(),
	assets: AssetsSchema.optional(),
});

export const ShopSchema: z.ZodObject<{
	id: z.ZodNumber;
	name: z.ZodString;
}> = z.object({
	id: z.number(),
	name: z.string(),
});

export const GameUrlsSchema: z.ZodObject<{
	game: z.ZodURL;
}> = z.object({
	game: z.url().describe('The URL of the game on IThereAnyDeal'),
});

export const PlatformsSchema: z.ZodObject<{
	id: z.ZodNumber;
	name: z.ZodString;
}> = z.object({
	id: z.number(),
	name: z.string(),
});

export const PriceSchema: z.ZodObject<{
	amount: z.ZodNumber;
	amountInt: z.ZodNumber;
	currency: z.ZodString;
}> = z.object({
	amount: z.number(),
	amountInt: z.number(),
	currency: z.string(),
});

export const HistoricLowPriceSchema: z.ZodObject<{
	id: z.ZodString;
	low: z.ZodObject<
		{
			shop: z.ZodObject<
				{
					id: z.ZodNumber;
					name: z.ZodString;
				},
				z.core.$strip
			>;
			price: z.ZodObject<
				{
					amount: z.ZodNumber;
					amountInt: z.ZodNumber;
					currency: z.ZodString;
				},
				z.core.$strip
			>;
			regular: z.ZodObject<
				{
					amount: z.ZodNumber;
					amountInt: z.ZodNumber;
					currency: z.ZodString;
				},
				z.core.$strip
			>;
			cut: z.ZodNumber;
			timestamp: z.ZodString;
		},
		z.core.$strip
	>;
}> = z.object({
	id: z.string(),
	low: z.object({
		shop: ShopSchema,
		price: PriceSchema,
		regular: PriceSchema,
		cut: z.number().min(0).max(100),
		timestamp: z.string(),
	}),
});

export const HistoricStoreLowPriceSchema: z.ZodObject<{
	id: z.ZodString;
	lows: z.ZodArray<
		z.ZodObject<
			{
				shop: z.ZodObject<
					{
						id: z.ZodNumber;
						name: z.ZodString;
					},
					z.core.$strip
				>;
				price: z.ZodObject<
					{
						amount: z.ZodNumber;
						amountInt: z.ZodNumber;
						currency: z.ZodString;
					},
					z.core.$strip
				>;
				regular: z.ZodObject<
					{
						amount: z.ZodNumber;
						amountInt: z.ZodNumber;
						currency: z.ZodString;
					},
					z.core.$strip
				>;
				cut: z.ZodNumber;
				timestamp: z.ZodString;
			},
			z.core.$strip
		>
	>;
}> = z.object({
	id: z.string(),
	lows: z.array(
		z.object({
			shop: ShopSchema,
			price: PriceSchema,
			regular: PriceSchema,
			cut: z.number().min(0).max(100),
			timestamp: z.string(),
		})
	),
});

export const DRMSchema: z.ZodObject<{
	id: z.ZodNumber;
	name: z.ZodString;
}> = z.object({
	id: z.number(),
	name: z.string(),
});

export const BaseDealSchema: z.ZodObject<{
	price: z.ZodObject<
		{
			amount: z.ZodNumber;
			amountInt: z.ZodNumber;
			currency: z.ZodString;
		},
		z.core.$strip
	>;
	regular: z.ZodObject<
		{
			amount: z.ZodNumber;
			amountInt: z.ZodNumber;
			currency: z.ZodString;
		},
		z.core.$strip
	>;
	cut: z.ZodNumber;
}> = z.object({
	price: PriceSchema,
	regular: PriceSchema,
	cut: z.number().min(0).max(100),
});

export const BundleSchema: z.ZodObject<{
	id: z.ZodNumber;
	title: z.ZodString;
	page: z.ZodObject<
		{
			id: z.ZodNumber;
			name: z.ZodString;
			shopId: z.ZodNumber;
		},
		z.core.$strip
	>;
	url: z.ZodString;
	details: z.ZodString;
	isMature: z.ZodBoolean;
	publish: z.ZodString;
	expiry: z.ZodNullable<z.ZodString>;
	counts: z.ZodObject<
		{
			games: z.ZodNumber;
			media: z.ZodNumber;
		},
		z.core.$strip
	>;
	tiers: z.ZodArray<
		z.ZodObject<
			{
				price: z.ZodObject<
					{
						amount: z.ZodNumber;
						amountInt: z.ZodNumber;
						currency: z.ZodString;
					},
					z.core.$strip
				>;
				games: z.ZodArray<
					z.ZodObject<
						{
							id: z.ZodString;
							slug: z.ZodString;
							title: z.ZodString;
							type: z.ZodNullable<
								z.ZodEnum<{
									game: 'game';
									dlc: 'dlc';
									package: 'package';
								}>
							>;
							mature: z.ZodBoolean;
							assets: z.ZodOptional<
								z.ZodObject<
									{
										boxart: z.ZodOptional<z.ZodURL>;
										banner145: z.ZodOptional<z.ZodString>;
										banner300: z.ZodOptional<z.ZodURL>;
										banner400: z.ZodOptional<z.ZodURL>;
										banner600: z.ZodOptional<z.ZodURL>;
									},
									z.core.$strip
								>
							>;
						},
						z.core.$strip
					>
				>;
			},
			z.core.$strip
		>
	>;
}> = z.object({
	id: z.number(),
	title: z.string(),
	page: z.object({
		id: z.number(),
		name: z.string(),
		shopId: z.number(),
	}),
	url: z.string(),
	details: z.string(),
	isMature: z.boolean(),
	publish: z.string(),
	expiry: z.string().nullable(),
	counts: z.object({
		games: z.number(),
		media: z.number(),
	}),
	tiers: z.array(
		z.object({
			price: PriceSchema,
			games: z.array(GameSchema),
		})
	),
});

export type Assets = z.infer<typeof AssetsSchema>;
export type Game = z.infer<typeof GameSchema>;

export type Shop = z.infer<typeof ShopSchema>;

export type Price = z.infer<typeof PriceSchema>;

export type HistoricLowPrice = z.infer<typeof HistoricLowPriceSchema>;
export type BaseDeal = z.infer<typeof BaseDealSchema>;
export type Bundle = z.infer<typeof BundleSchema>;
export type DRM = z.infer<typeof DRMSchema>;

export type HistoricStoreLowPrice = z.infer<typeof HistoricStoreLowPriceSchema>;
