import { describe, expect, test } from 'bun:test'
import { IsThereAnyDealClient } from '../src/client'
import { API_KEY, expectApiKeyHeader, withMockFetch } from './setup'

const gameId = '018d937f-3807-7238-b56e-d219b2c2da64'

describe('API 2.11 endpoints', () => {
	test('gets bundle lists with documented options and response fields', async () => {
		const bundles = [
			{
				id: 11631,
				title: 'Example bundle',
				page: { id: 8, name: 'Fanatical', shopId: 6 },
				url: 'https://example.com/bundle',
				details: 'https://isthereanydeal.com/bundles/11631/',
				isMature: false,
				publish: '2026-09-07T19:04:40+02:00',
				expiry: null,
				note: 'Includes expansions',
				counts: { games: 1, media: 0 },
				tiers: [
					{
						price: { amount: 5, amountInt: 500, currency: 'USD' },
						addon: true,
						games: [],
					},
				],
			},
		]
		await withMockFetch(bundles, async (calls) => {
			const client = new IsThereAnyDealClient(API_KEY)
			const result = await client.bundlesService.getBundles({
				country: 'GB',
				offset: 10,
				limit: 5,
				mature: true,
				expired: true,
				sort: '-publish',
			})

			expect(result[0].note).toBe('Includes expansions')
			expect(result[0].tiers[0].addon).toBe(true)
			expect(calls[0].url.pathname).toBe('/bundles/v1')
			expect(calls[0].url.searchParams.get('country')).toBe('GB')
			expect(calls[0].url.searchParams.get('offset')).toBe('10')
			expect(calls[0].url.searchParams.get('limit')).toBe('5')
			expect(calls[0].url.searchParams.get('mature')).toBe('true')
			expect(calls[0].url.searchParams.get('expired')).toBe('true')
			expect(calls[0].url.searchParams.get('sort')).toBe('-publish')
			expectApiKeyHeader(calls[0])
		})
	})

	test('exposes the documented game-info achievements field', async () => {
		await withMockFetch({ achievements: true }, async (calls) => {
			const client = new IsThereAnyDealClient(API_KEY)
			const result = await client.gamesService.getGameInfo(gameId)

			expect(result.achievements).toBe(true)
			expect(calls[0].url.pathname).toBe('/games/info/v2')
		})
	})

	test('gets giveaway lists', async () => {
		await withMockFetch([], async (calls) => {
			const client = new IsThereAnyDealClient(API_KEY)
			await client.giveawaysService.getGiveaways({
				offset: 5,
				limit: 10,
				expired: true,
			})

			expect(calls[0].url.pathname).toBe('/giveaways/v1')
			expect(calls[0].url.searchParams.get('offset')).toBe('5')
			expect(calls[0].url.searchParams.get('limit')).toBe('10')
			expect(calls[0].url.searchParams.get('expired')).toBe('true')
			expectApiKeyHeader(calls[0])
		})
	})

	test('gets giveaways for one game with typed game details', async () => {
		const giveaways = [
			{
				id: 16541,
				title: 'Example giveaway',
				shop: { id: 35, name: 'GOG' },
				url: 'https://example.com/giveaway',
				details: 'https://isthereanydeal.com/giveaways/16541/',
				isMature: false,
				publish: '2026-09-07T19:04:40+02:00',
				expiry: null,
				note: null,
				games: [
					{
						id: gameId,
						slug: 'state-of-mind',
						title: 'State of Mind',
						type: 'game',
						mature: false,
						assets: {},
						drmFree: false,
						keys: [{ id: 35, name: 'GOG' }],
						platforms: [{ id: 1, name: 'Windows' }],
					},
				],
			},
		]
		await withMockFetch(giveaways, async (calls) => {
			const client = new IsThereAnyDealClient(API_KEY)
			const result = await client.giveawaysService.getGiveawaysForGame(gameId, {
				expired: true,
			})

			expect(result[0].games[0].drmFree).toBe(false)
			expect(result[0].games[0].keys[0].id).toBe(35)
			expect(calls[0].url.pathname).toBe('/games/giveaways/v1')
			expect(calls[0].url.searchParams.get('id')).toBe(gameId)
			expect(calls[0].url.searchParams.get('expired')).toBe('true')
			expectApiKeyHeader(calls[0])
		})
	})

	test('looks up shop IDs by ITAD game IDs', async () => {
		const shopIds = { [gameId]: ['app/220', 'bundle/27508'] }
		await withMockFetch(shopIds, async (calls) => {
			const client = new IsThereAnyDealClient(API_KEY)
			const result = await client.lookupService.lookupShopIdsByGameIds(61, [
				gameId,
			])

			expect(result[gameId]).toEqual(['app/220', 'bundle/27508'])
			expect(calls[0].url.pathname).toBe('/lookup/shop/61/id/v1')
			expect(calls[0].init.method).toBe('POST')
			expect(JSON.parse(String(calls[0].init.body))).toEqual([gameId])
			expectApiKeyHeader(calls[0])
		})
	})
})
