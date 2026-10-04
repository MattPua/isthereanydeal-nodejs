import { describe, expect, test } from 'bun:test'
import { GamesService } from '../src/services/games.service'
import { API_KEY, expectApiKeyHeader, withMockFetch } from './setup'

const GAME_ID = '018d937f-3a29-72b9-888f-ecbf55a28e80'

describe('GamesService', () => {
	test('searches by title and includes the requested result count', async () => {
		await withMockFetch([], async (calls) => {
			await new GamesService(API_KEY).searchForGame({
				title: 'Witcher 3',
				results: 5,
			})

			expect(calls[0].url.pathname).toBe('/games/search/v1')
			expect(calls[0].url.searchParams.get('title')).toBe('Witcher 3')
			expect(calls[0].url.searchParams.get('results')).toBe('5')
			expectApiKeyHeader(calls[0])
		})
	})

	test('looks up a game by app id', async () => {
		await withMockFetch({ found: false }, async (calls) => {
			await new GamesService(API_KEY).lookupGame({ appid: 292030 })

			expect(calls[0].url.pathname).toBe('/games/lookup/v1')
			expect(calls[0].url.searchParams.get('appid')).toBe('292030')
			expectApiKeyHeader(calls[0])
		})
	})

	test('loads game info by ITAD id', async () => {
		await withMockFetch({}, async (calls) => {
			await new GamesService(API_KEY).getGameInfo(GAME_ID)

			expect(calls[0].url.pathname).toBe('/games/info/v2')
			expect(calls[0].url.searchParams.get('id')).toBe(GAME_ID)
			expectApiKeyHeader(calls[0])
		})
	})

	test('loads bundles including a game with the expired option', async () => {
		await withMockFetch([], async (calls) => {
			await new GamesService(API_KEY).getBundlesIncludingGame(GAME_ID, {
				expired: true,
			})

			expect(calls[0].url.pathname).toBe('/games/bundles/v2')
			expect(calls[0].url.searchParams.get('id')).toBe(GAME_ID)
			expect(calls[0].url.searchParams.get('expired')).toBe('true')
			expectApiKeyHeader(calls[0])
		})
	})

	test('POSTs game ids to store-low with country and shop filters', async () => {
		await withMockFetch([], async (calls) => {
			await new GamesService(API_KEY).getStoreLow([GAME_ID], {
				country: 'GB',
				shops: [61],
			})

			expect(calls[0].url.pathname).toBe('/games/storelow/v2')
			expect(calls[0].url.searchParams.get('country')).toBe('GB')
			expect(calls[0].url.searchParams.get('shops')).toBe('61')
			expect(calls[0].init.method).toBe('POST')
			expect(JSON.parse(String(calls[0].init.body))).toEqual([GAME_ID])
			expectApiKeyHeader(calls[0])
		})
	})

	test('POSTs game ids to history-low', async () => {
		await withMockFetch([], async (calls) => {
			await new GamesService(API_KEY).getHistoryLow([GAME_ID], {
				country: 'FR',
			})

			expect(calls[0].url.pathname).toBe('/games/historylow/v1')
			expect(calls[0].url.searchParams.get('country')).toBe('FR')
			expect(calls[0].init.method).toBe('POST')
			expect(JSON.parse(String(calls[0].init.body))).toEqual([GAME_ID])
			expectApiKeyHeader(calls[0])
		})
	})

	test('loads price history with shop, country, and since filters', async () => {
		const since = new Date('2025-01-01T00:00:00Z')
		await withMockFetch([], async (calls) => {
			await new GamesService(API_KEY).getHistoryLog(GAME_ID, {
				country: 'US',
				shops: [61],
				since,
			})

			expect(calls[0].url.pathname).toBe('/games/history/v2')
			expect(calls[0].url.searchParams.get('id')).toBe(GAME_ID)
			expect(calls[0].url.searchParams.get('shops')).toBe('61')
			expect(calls[0].url.searchParams.get('since')).toBe(
				'2025-01-01T00:00:00Z',
			)
			expectApiKeyHeader(calls[0])
		})
	})

	test('POSTs ids and pricing options for prices', async () => {
		await withMockFetch([], async (calls) => {
			await new GamesService(API_KEY).getPrices([GAME_ID], {
				country: 'GB',
				deals: true,
				vouchers: false,
				capacity: 2,
				shops: [61],
			})

			expect(calls[0].url.pathname).toBe('/games/prices/v3')
			expect(calls[0].url.searchParams.get('country')).toBe('GB')
			expect(calls[0].url.searchParams.get('deals')).toBe('true')
			expect(calls[0].url.searchParams.get('vouchers')).toBe('false')
			expect(calls[0].url.searchParams.get('capacity')).toBe('2')
			expect(calls[0].url.searchParams.get('shops')).toBe('61')
			expect(calls[0].init.method).toBe('POST')
			expect(JSON.parse(String(calls[0].init.body))).toEqual([GAME_ID])
			expectApiKeyHeader(calls[0])
		})
	})

	test('POSTs ids and country for price overview', async () => {
		await withMockFetch({ prices: [] }, async (calls) => {
			await new GamesService(API_KEY).getPriceOverview([GAME_ID], {
				country: 'FR',
			})

			expect(calls[0].url.pathname).toBe('/games/overview/v2')
			expect(calls[0].url.searchParams.get('country')).toBe('FR')
			expect(calls[0].init.method).toBe('POST')
			expect(JSON.parse(String(calls[0].init.body))).toEqual([GAME_ID])
			expectApiKeyHeader(calls[0])
		})
	})

	test('POSTs game ids to subscriptions', async () => {
		await withMockFetch({}, async (calls) => {
			await new GamesService(API_KEY).getGameSubscriptions([GAME_ID], {
				country: 'CA',
			})

			expect(calls[0].url.pathname).toBe('/games/subs/v1')
			expect(calls[0].url.searchParams.get('country')).toBe('CA')
			expect(calls[0].init.method).toBe('POST')
			expect(JSON.parse(String(calls[0].init.body))).toEqual([GAME_ID])
			expectApiKeyHeader(calls[0])
		})
	})
})
