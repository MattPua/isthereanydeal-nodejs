import { describe, expect, test } from 'bun:test'
import { StatsService } from '../src/services/stats.service'
import { getApiKey, getTestGameId } from './setup'

describe('StatsService', () => {
	describe('waitlistStats', () => {
		test('should get waitlist stats correctly', async () => {
			const statsService = new StatsService(getApiKey())
			const stats = await statsService.waitlistStats(getTestGameId())
			expect(stats).toBeDefined()
			expect(stats.count).toBeGreaterThan(0)
			expect(stats.price).toBeDefined()
			expect(stats.cut).toBeDefined()
		})

		test('should get waitlist stats correctly with custom bucket sizes', async () => {
			const statsService = new StatsService(getApiKey())
			const bucketPrice = 5
			const bucketCut = 40
			const stats = await statsService.waitlistStats(getTestGameId(), {
				bucket_price: bucketPrice,
				bucket_cut: bucketCut,
			})
			expect(stats).toBeDefined()
			stats.price.buckets.forEach((bucket) => {
				if (bucket.price) {
					expect(bucket.price).toBeLessThanOrEqual(bucketPrice)
				}
			})
			stats.cut.buckets.forEach((bucket) => {
				if (bucket.price) {
					expect(bucket.price).toBeLessThanOrEqual(bucketCut)
				}
			})
		})

		test('should get waitlist stats correctly with custom country', async () => {
			const statsService = new StatsService(getApiKey())
			const country = 'GB'
			const stats = await statsService.waitlistStats(getTestGameId(), {
				country: country,
			})
			expect(stats).toBeDefined()
			expect(stats.price.currency).toBe('GBP')
		})
	})

	describe('getMostWaitlistedGames', () => {
		test('should get most waitlisted games correctly', async () => {
			const statsService = new StatsService(getApiKey())
			const games = await statsService.getMostWaitlistedGames()
			expect(games).toBeDefined()
			expect(games.length).toBeGreaterThan(0)
			games.forEach((game, index) => {
				expect(game.position).toBe(index + 1)
			})
		})

		test('should get most waitlisted games correctly with custom offset and limit', async () => {
			const statsService = new StatsService(getApiKey())
			const offset = 10
			const limit = 5
			const games = await statsService.getMostWaitlistedGames({
				offset: offset,
				limit: limit,
			})
			expect(games).toBeDefined()
			expect(games.length).toBe(limit)
			games.forEach((game, index) => {
				expect(game.position).toBe(index + offset + 1)
			})
		})
	})

	describe('getMostCollectedGames', () => {
		test('should get most collected games correctly', async () => {
			const statsService = new StatsService(getApiKey())
			const games = await statsService.getMostCollectedGames()
			expect(games).toBeDefined()
			expect(games.length).toBeGreaterThan(0)
		})

		test('should get most collected games correctly with custom offset and limit', async () => {
			const statsService = new StatsService(getApiKey())
			const offset = 10
			const limit = 5
			const games = await statsService.getMostCollectedGames({
				offset: offset,
				limit: limit,
			})
			expect(games).toBeDefined()
			expect(games.length).toBe(limit)
			games.forEach((game, index) => {
				expect(game.position).toBe(index + offset + 1)
			})
		})
	})

	describe('getMostPopularGames', () => {
		test('should get most popular games correctly', async () => {
			const statsService = new StatsService(getApiKey())
			const games = await statsService.getMostPopularGames()
			expect(games).toBeDefined()
			expect(games.length).toBeGreaterThan(0)
		})
	})

	test('should get most popular games correctly with custom offset and limit', async () => {
		const statsService = new StatsService(getApiKey())
		const offset = 10
		const limit = 5
		const games = await statsService.getMostPopularGames({
			offset: offset,
			limit: limit,
		})
		expect(games).toBeDefined()
		expect(games.length).toBe(limit)
		games.forEach((game, index) => {
			expect(game.position).toBe(index + offset + 1)
		})
	})
})
