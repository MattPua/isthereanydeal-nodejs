import { describe, expect, test } from 'bun:test'
import { DealsListService } from '../src/services/deals-list.service'
import { getApiKey } from './setup'

describe('DealsListService', () => {
	describe('getDeals', () => {
		test('should get deals list correctly', async () => {
			const dealsList = await new DealsListService(getApiKey()).getDeals()
			expect(dealsList).toBeDefined()
			expect(dealsList.nextOffset).toBe(20)
			expect(dealsList.hasMore).toBe(true)
			expect(dealsList.list.length).toBe(20)

			dealsList.list.forEach((app) => {
				expect(app.id).toBeDefined()
				expect(app.slug).toBeDefined()
				expect(app.title).toBeDefined()
				expect(app.type).toBeDefined()
				expect(app.assets).toBeDefined()

				expect(app.deal).toBeDefined()
				expect(app.deal.price).toBeDefined()
				expect(app.deal.regular).toBeDefined()
				expect(app.deal.cut).toBeDefined()
				expect(app.deal.voucher).toBeDefined()
				expect(app.deal.storeLow).toBeDefined()
				expect(app.deal.historyLow).toBeDefined()
				expect(app.deal.historyLow_1y).toBeDefined()
				expect(app.deal.historyLow_3m).toBeDefined()
				expect(app.deal.flag).toBeDefined()
				expect(app.deal.drm).toBeDefined()
				expect(app.deal.platforms).toBeDefined()
				expect(app.deal.timestamp).toBeDefined()
				expect(app.deal.expiry).toBeDefined()

				expect(app.mature).toBe(false)
			})
		})

		test('should use offset correctly', async () => {
			const dealsList = await new DealsListService(getApiKey()).getDeals({
				offset: 10,
			})
			expect(dealsList).toBeDefined()
			expect(dealsList.nextOffset).toBe(30)
			expect(dealsList.hasMore).toBe(true)
			expect(dealsList.list.length).toBe(20)
		})

		test('should use limit correctly', async () => {
			const dealsList = await new DealsListService(getApiKey()).getDeals({
				limit: 10,
			})
			expect(dealsList).toBeDefined()
			expect(dealsList.nextOffset).toBe(10)
			expect(dealsList.hasMore).toBe(true)
			expect(dealsList.list.length).toBe(10)
		})
	})
})
