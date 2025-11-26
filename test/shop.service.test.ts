import { describe, expect, test } from 'bun:test'
import { ShopsService } from '../src/services/shops.service'
import { getApiKey } from './setup'

describe('ShopsService', () => {
	test('should get shops correctly', async () => {
		const shopsService = new ShopsService(getApiKey())
		const shops = await shopsService.getShops()
		expect(shops).toBeDefined()
		expect(shops.length).toBeGreaterThan(0)
		shops.forEach((shop) => {
			expect(shop.id).toBeDefined()
			expect(shop.title).toBeDefined()
			expect(shop.games).toBeDefined()
			expect(shop.deals).toBeDefined()
			expect(shop.update).toBeDefined()
		})
	})
})
