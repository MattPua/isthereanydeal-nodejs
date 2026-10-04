import { describe, expect, test } from 'bun:test'
import { ShopsService } from '../src/services/shops.service'
import { API_KEY, expectApiKeyHeader, withMockFetch } from './setup'

describe('ShopsService', () => {
	test('loads shops for the requested country', async () => {
		await withMockFetch([], async (calls) => {
			await new ShopsService(API_KEY).getShops({ country: 'GB' })

			expect(calls[0].url.pathname).toBe('/service/shops/v1')
			expect(calls[0].url.searchParams.get('country')).toBe('GB')
			expect(calls[0].init.method).toBe('GET')
			expectApiKeyHeader(calls[0])
		})
	})

	test('loads the complete shop map', async () => {
		await withMockFetch({}, async (calls) => {
			await new ShopsService(API_KEY).getShopMap()

			expect(calls[0].url.pathname).toBe('/service/shops/map/v1')
			expect(calls[0].init.method).toBe('GET')
			expectApiKeyHeader(calls[0])
		})
	})
})
