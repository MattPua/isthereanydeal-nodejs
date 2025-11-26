import { z } from 'zod';
import { GameSchema } from './common.schema';

const BucketSchema = z.object({
	price: z.number().min(0),
	count: z.number().min(0),
	percent: z.number().min(0).max(100),
});

const WaitlistGameSchema: z.ZodIntersection<
	z.ZodObject<
		{
			count: z.ZodNumber;
			position: z.ZodNumber;
		},
		z.core.$strip
	>,
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
> = z
	.object({
		count: z.number().min(0),
		position: z.number().min(1),
	})
	.and(GameSchema);

const WaitlistStatsResponseSchema: z.ZodObject<{
	count: z.ZodNumber;
	price: z.ZodObject<
		{
			currency: z.ZodString;
			any: z.ZodNumber;
			average: z.ZodNumber;
			buckets: z.ZodArray<
				z.ZodObject<
					{
						price: z.ZodNumber;
						count: z.ZodNumber;
						percent: z.ZodNumber;
					},
					z.core.$strip
				>
			>;
		},
		z.core.$strip
	>;
	cut: z.ZodObject<
		{
			average: z.ZodNumber;
			buckets: z.ZodArray<
				z.ZodObject<
					{
						price: z.ZodNumber;
						count: z.ZodNumber;
						percent: z.ZodNumber;
					},
					z.core.$strip
				>
			>;
		},
		z.core.$strip
	>;
}> = z.object({
	count: z.number().min(0),
	price: z.object({
		currency: z.string().describe('3 letter currency code'),
		any: z.number().describe('how many users did not set price limit').min(0),
		average: z.number().min(0),
		buckets: z.array(BucketSchema),
	}),
	cut: z.object({
		average: z.number().min(0),
		buckets: z.array(BucketSchema),
	}),
});

export type WaitlistStatsResponse = z.infer<typeof WaitlistStatsResponseSchema>;
export type WaitlistGame = z.infer<typeof WaitlistGameSchema>;
