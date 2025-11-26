import { describe, expect, test } from 'bun:test'
import { GamesService } from '../src/services/games.service'
import {
	getApiKey,
	getTestGameId,
	getTestGameId2,
	getTestGameTitle,
	getTestShopId,
} from './setup'

describe('GamesService', () => {
	describe('searchForGame', () => {
		test('should search for game correctly by title', async () => {
			const gamesService = new GamesService(getApiKey())
			const results = await gamesService.searchForGame({
				title: 'The Witcher 3',
				results: 5,
			})
			expect(results).toBeDefined()
			expect(Array.isArray(results)).toBe(true)
			expect(results.length).toBeLessThanOrEqual(5)
			if (results.length > 0) {
				expect(results[0]).toHaveProperty('id')
				expect(results[0]).toHaveProperty('slug')
				expect(results[0]).toHaveProperty('title')
				expect(results[0]).toHaveProperty('type')
				expect(results[0]).toHaveProperty('mature')
				expect(results[0]).toHaveProperty('assets')
			}
		})

		test('should search for game correctly with max results', async () => {
			const gamesService = new GamesService(getApiKey())
			const results = await gamesService.searchForGame({
				title: getTestGameTitle(),
				results: 1,
			})
			expect(results).toBeDefined()
			expect(results.length).toBe(1)
		})

		test('it should call the api correctly with too bigmax results', async () => {
			const gamesService = new GamesService(getApiKey())
			const results = await gamesService.searchForGame({
				title: 'The',
				results: 150,
			})
			expect(results).toBeDefined()
			expect(results.length).toBe(100)
		})

		test('calling with negative number of results should respond as if limit was 1', async () => {
			const gamesService = new GamesService(getApiKey())
			const results = await gamesService.searchForGame({
				title: getTestGameTitle(),
				results: -1,
			})
			expect(results).toBeDefined()
			expect(results.length).toBe(1)
		})

		test('should fail to search for game by a non existing title', async () => {
			const gamesService = new GamesService(getApiKey())
			const badTitle = 'ajdiojaoidjioajoidjaoi'
			const results = await gamesService.searchForGame({
				title: badTitle,
				results: 5,
			})
			expect(results).toBeDefined()
			expect(Array.isArray(results)).toBe(true)
			expect(results.length).toBe(0)
		})
	})

	describe('lookupGame', () => {
		test('should lookup game correctly by appid', async () => {
			const gamesService = new GamesService(getApiKey())
			const result = await gamesService.lookupGame({
				title: getTestGameTitle(),
			})
			expect(result).toBeDefined()
			expect(result.found).toBe(true)
			expect(result.game).toBeDefined()
			expect(result.game?.slug).toBe('the-witcher-3-wild-hunt-complete-edition')
			expect(result.game?.title).toBe(getTestGameTitle())
		})

		test('should fail to lookup game by a non existing title', async () => {
			const gamesService = new GamesService(getApiKey())
			const result = await gamesService.lookupGame({
				title: 'Non Existing Game',
			})
			expect(result).toBeDefined()
			expect(result.found).toBe(false)
			expect(result.game).toBeUndefined()
		})
	})

	describe('getGameInfo', () => {
		test('should get game info correctly by id', async () => {
			const gamesService = new GamesService(getApiKey())
			const result = await gamesService.getGameInfo(getTestGameId())
			expect(result).toBeDefined()
			expect(result.appid).toBeDefined()
			expect(result.title).toBe(getTestGameTitle())
			expect(result.slug).toBeDefined()
			expect(['game', 'dlc', 'package', null]).toContain(result.type)
			expect(result.assets).toBeDefined()
			expect(result.assets).toHaveProperty('boxart')
			expect(Array.isArray(result.tags)).toBe(true)
			expect(result.stats).toBeDefined()
			expect(Array.isArray(result.developers)).toBe(true)
			expect(Array.isArray(result.publishers)).toBe(true)
			expect(Array.isArray(result.reviews)).toBe(true)
			expect(['object', 'null']).toContain(typeof result.players)
			expect(result.urls).toBeDefined()
		})
	})

	describe('getBundlesIncludingGame', () => {
		test('should get bundles including game correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const bundles = await gamesService.getBundlesIncludingGame(
				getTestGameId(),
			)
			expect(bundles).toBeDefined()
		})

		test('should get bundles including game correctly with expired option', async () => {
			const gamesService = new GamesService(getApiKey())
			const bundles = await gamesService.getBundlesIncludingGame(
				getTestGameId(),
				{ expired: true },
			)
			expect(bundles).toBeDefined()
		})
	})

	describe('getStoreLow', () => {
		test('should get store low correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const storeLow = await gamesService.getStoreLow([getTestGameId()])
			expect(storeLow).toBeDefined()
			expect(storeLow.length).toBe(1)
			expect(storeLow[0].id).toBe(getTestGameId())
			expect(storeLow[0].lows.length).toBeGreaterThan(1)
		})

		test('should get store low for specific shops correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const storeLow = await gamesService.getStoreLow([getTestGameId()], {
				shops: [getTestShopId()],
			})
			expect(storeLow).toBeDefined()
			expect(storeLow.length).toBe(1)
			expect(storeLow[0].id).toBe(getTestGameId())
			expect(storeLow[0].lows.length).toBe(1)
		})

		test('should get store lows for mulitple games correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const storeLow = await gamesService.getStoreLow([
				getTestGameId(),
				getTestGameId2(),
			])
			expect(storeLow).toBeDefined()
			expect(storeLow.length).toBe(2)
			expect(storeLow[0].id).toBe(getTestGameId())
			expect(storeLow[0].lows.length).toBeGreaterThan(1)
			expect(storeLow[1].id).toBe(getTestGameId2())
			expect(storeLow[1].lows.length).toBeGreaterThan(1)
		})
	})

	describe('getHistoryLow', () => {
		test('should get history low correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const history = await gamesService.getHistoryLow([getTestGameId()])
			expect(history).toBeDefined()
			expect(history.length).toBe(1)
			expect(history[0].id).toBe(getTestGameId())
			expect(history[0].low).toBeDefined()
			expect(history[0].low.shop).toBeDefined()
			expect(history[0].low.price).toBeDefined()
			expect(history[0].low.regular).toBeDefined()
			expect(history[0].low.cut).toBeDefined()
			expect(history[0].low.timestamp).toBeDefined()
		})

		test('should get history low correctly for multiple games', async () => {
			const gamesService = new GamesService(getApiKey())
			const history = await gamesService.getHistoryLow([
				getTestGameId(),
				getTestGameId2(),
			])
			expect(history).toBeDefined()
			expect(history.length).toBe(2)
			expect(history[0].id).toBe(getTestGameId())
			expect(history[0].low).toBeDefined()
			expect(history[1].id).toBe(getTestGameId2())
			expect(history[1].low).toBeDefined()
		})

		test('should fail to get history low for an empty array', async () => {
			const gamesService = new GamesService(getApiKey())
			await expect(gamesService.getHistoryLow([])).rejects.toThrow()
		})

		test('should fail to get history low for a non existing game', async () => {
			const gamesService = new GamesService(getApiKey())
			await expect(
				gamesService.getHistoryLow(['non-existing-game']),
			).rejects.toThrow()
		})

		test('should get history low in a different country correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const history = await gamesService.getHistoryLow([getTestGameId()], {
				country: 'FR',
			})
			expect(history).toBeDefined()
			expect(history.length).toBe(1)
			expect(history[0].low.price.currency).toBe('EUR')
		})
	})

	describe('getHistoryLog', () => {
		test('should get history log correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const history = await gamesService.getHistoryLog(getTestGameId())
			expect(history).toBeDefined()
			expect(history.length).toBeGreaterThan(1)
			history.forEach((log) => {
				expect(log.deal.price.amount).toBeDefined()
				expect(log.deal.price.currency).toBe('USD')
				expect(log.deal.regular.amount).toBeDefined()
				expect(log.deal.regular.currency).toBe('USD')
				expect(log.deal.cut).toBeDefined()
				expect(log.timestamp).toBeDefined()
				expect(log.shop.id).toBeDefined()
				expect(log.shop.name).toBeDefined()
			})
		})

		test('should get history log in a different country correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const history = await gamesService.getHistoryLog(getTestGameId(), {
				country: 'FR',
			})
			expect(history).toBeDefined()
			expect(history.length).toBeGreaterThan(1)
			history.forEach((log) => {
				expect(log.deal.price.currency).toBe('EUR')
				expect(log.deal.regular.currency).toBe('EUR')
			})
		})

		test('should get history log for a specific shop correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const history = await gamesService.getHistoryLog(getTestGameId(), {
				shops: [getTestShopId()],
			})
			expect(history).toBeDefined()
			expect(history.length).toBeGreaterThan(1)
			history.forEach((log) => {
				expect(log.shop.id).toBe(getTestShopId())
				expect(log.shop.name).toBe('Steam')
			})
		})
		test('should get history for specific date correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const history = await gamesService.getHistoryLog(getTestGameId(), {
				since: new Date('2025-01-01'),
				country: 'US',
			})
			expect(history).toBeDefined()
			expect(history.length).toBeGreaterThan(1)
			history.forEach((log) => {
				expect(new Date(log.timestamp).getTime() * 1000).toBeGreaterThan(
					new Date('2025-01-01').getTime(),
				)
			})
		})
	})

	describe('getPrices', () => {
		test('should get prices correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const prices = await gamesService.getPrices([getTestGameId()])
			expect(prices).toBeDefined()
			expect(Array.isArray(prices)).toBe(true)
			if (prices.length > 0) {
				for (const price of prices) {
					expect(price).toHaveProperty('id')
					expect(price).toHaveProperty('historyLow')
					expect(price.historyLow).toHaveProperty('all')
					expect(price.historyLow.all).toHaveProperty('amount')
					expect(price).toHaveProperty('deals')
					expect(Array.isArray(price.deals)).toBe(true)

					for (const deal of price.deals) {
						expect(deal).toHaveProperty('shop')
						expect(deal.shop).toHaveProperty('id')
						expect(deal.shop).toHaveProperty('name')
						expect(deal).toHaveProperty('price')
						expect(deal.price).toHaveProperty('amount')
						expect(deal.price).toHaveProperty('currency')
						expect(deal).toHaveProperty('regular')
						expect(deal).toHaveProperty('cut')
						expect(deal).toHaveProperty('voucher')
						expect(deal).toHaveProperty('storeLow')
						expect(deal).toHaveProperty('flag')
						expect(deal).toHaveProperty('drm')
						expect(Array.isArray(deal.drm)).toBe(true)
						expect(deal).toHaveProperty('platforms')
						expect(Array.isArray(deal.platforms)).toBe(true)
						expect(deal).toHaveProperty('timestamp')
						expect(deal).toHaveProperty('url')
						expect(deal.price.currency).toBe('USD')
					}
				}
			}
		})

		test('should get prices with vouchers correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const prices = await gamesService.getPrices([getTestGameId()], {
				vouchers: true,
			})
			expect(prices).toBeDefined()
			expect(Array.isArray(prices)).toBe(true)
		})
		test('should get prices with capacity correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const prices = await gamesService.getPrices([getTestGameId()], {
				country: 'US',
				deals: false,
				vouchers: false,
				capacity: 2,
			})
			expect(prices).toBeDefined()
			expect(Array.isArray(prices)).toBe(true)
			expect(prices[0].deals.length).toBe(2)
		})

		test('should get prices with country correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const prices = await gamesService.getPrices([getTestGameId()], {
				country: 'FR',
			})
			expect(prices).toBeDefined()
			prices.forEach((price) => {
				price.deals.forEach((deal) => {
					expect(deal.price.currency).toBe('EUR')
				})
			})
		})

		test('it should return multiple prices correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const prices = await gamesService.getPrices([
				getTestGameId(),
				getTestGameId2(),
			])
			expect(prices).toBeDefined()
			expect(Array.isArray(prices)).toBe(true)
			expect(prices.length).toBe(2)
		})
	})

	describe('getPriceOverview', () => {
		test('should get price overview correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const priceOverview = await gamesService.getPriceOverview([
				getTestGameId(),
			])
			expect(priceOverview).toBeDefined()
			expect(priceOverview.prices.length).toBe(1)

			for (const price of priceOverview.prices) {
				expect(price).toHaveProperty('id')
				expect(price).toHaveProperty('current')
				expect(price).toHaveProperty('lowest')
				expect(price).toHaveProperty('bundled')
				expect(price).toHaveProperty('urls')
			}
		})
		test('should get price overview with country correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const priceOverview = await gamesService.getPriceOverview(
				[getTestGameId()],
				{
					country: 'FR',
				},
			)
			expect(priceOverview).toBeDefined()
			expect(priceOverview.prices.length).toBe(1)
			for (const price of priceOverview.prices) {
				expect(price.current.price.currency).toBe('EUR')
			}
		})
		test('it should get multiple prices correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const priceOverview = await gamesService.getPriceOverview([
				getTestGameId(),
				getTestGameId2(),
			])
			expect(priceOverview).toBeDefined()
			expect(priceOverview.prices.length).toBe(2)
		})
	})

	describe('getGameSubscriptions', () => {
		test('should get game subscriptions correctly', async () => {
			const gamesService = new GamesService(getApiKey())
			const subscriptions = await gamesService.getGameSubscriptions([
				getTestGameId(),
			])
			expect(subscriptions).toBeDefined()
		})
	})
})
