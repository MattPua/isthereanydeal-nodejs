import { describe, expect, test } from 'bun:test'
import { StatsService } from '../src/services/stats.service'
import { API_KEY, expectApiKeyHeader, withMockFetch } from './setup'

const GAME_ID = '018d937f-3a29-72b9-888f-ecbf55a28e80'

describe('StatsService', () => {
	test('loads waitlist stats with custom country and bucket sizes', async () => {
		await withMockFetch({}, async (calls) => {
			await new StatsService(API_KEY).waitlistStats(GAME_ID, {
				country: 'GB',
				bucket_price: 5,
				bucket_cut: 40,
			})

			expect(calls[0].url.pathname).toBe('/stats/waitlist/v1')
			expect(calls[0].url.searchParams.get('id')).toBe(GAME_ID)
			expect(calls[0].url.searchParams.get('country')).toBe('GB')
			expect(calls[0].url.searchParams.get('bucket_price')).toBe('5')
			expect(calls[0].url.searchParams.get('bucket_cut')).toBe('40')
			expectApiKeyHeader(calls[0])
		})
	})

	test('loads most-waitlisted games with pagination', async () => {
		await withMockFetch([], async (calls) => {
			await new StatsService(API_KEY).getMostWaitlistedGames({
				offset: 10,
				limit: 5,
			})

			expect(calls[0].url.pathname).toBe('/stats/most-waitlisted/v1')
			expect(calls[0].url.searchParams.get('offset')).toBe('10')
			expect(calls[0].url.searchParams.get('limit')).toBe('5')
			expectApiKeyHeader(calls[0])
		})
	})

	test('loads most-collected games', async () => {
		await withMockFetch([], async (calls) => {
			await new StatsService(API_KEY).getMostCollectedGames({
				offset: 2,
				limit: 3,
			})

			expect(calls[0].url.pathname).toBe('/stats/most-collected/v1')
			expect(calls[0].url.searchParams.get('offset')).toBe('2')
			expect(calls[0].url.searchParams.get('limit')).toBe('3')
			expectApiKeyHeader(calls[0])
		})
	})

	test('loads most-popular games', async () => {
		await withMockFetch([], async (calls) => {
			await new StatsService(API_KEY).getMostPopularGames({
				offset: 4,
				limit: 6,
			})

			expect(calls[0].url.pathname).toBe('/stats/most-popular/v1')
			expect(calls[0].url.searchParams.get('offset')).toBe('4')
			expect(calls[0].url.searchParams.get('limit')).toBe('6')
			expectApiKeyHeader(calls[0])
		})
	})
})
