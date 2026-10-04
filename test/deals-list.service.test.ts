import { describe, expect, test } from 'bun:test'
import { DealsListService } from '../src/services/deals-list.service'
import { API_KEY, expectApiKeyHeader, withMockFetch } from './setup'

describe('DealsListService', () => {
	test('GETs deals with pagination and the highest-discount default sort', async () => {
		await withMockFetch(
			{ list: [], nextOffset: 10, hasMore: false },
			async (calls) => {
				const result = await new DealsListService(API_KEY).getDeals({
					limit: 10,
				})

				expect(result.list).toEqual([])
				expect(calls).toHaveLength(1)
				expect(calls[0].url.pathname).toBe('/deals/v2')
				expect(calls[0].url.searchParams.get('limit')).toBe('10')
				expect(calls[0].url.searchParams.get('sort')).toBe('-cut')
				expect(calls[0].init.method).toBe('GET')
				expectApiKeyHeader(calls[0])
			},
		)
	})

	test('supports JSON-object filters in GET query params', async () => {
		const filter = { or: [{ price: { lt: 10 } }] }
		await withMockFetch(
			{ list: [], nextOffset: 0, hasMore: false },
			async (calls) => {
				await new DealsListService(API_KEY).getDeals({ filter })

				expect(calls[0].url.searchParams.get('filter')).toBe(
					JSON.stringify(filter),
				)
			},
		)
	})

	test('POSTs deals options and object filters as JSON', async () => {
		const options = { country: 'GB', limit: 5, filter: { price: { lt: 10 } } }
		await withMockFetch(
			{ list: [], nextOffset: 0, hasMore: false },
			async (calls) => {
				await new DealsListService(API_KEY).getDealsByPost(options)

				expect(calls[0].url.pathname).toBe('/deals/v2')
				expect(calls[0].init.method).toBe('POST')
				expect(JSON.parse(String(calls[0].init.body))).toEqual({
					country: 'GB',
					offset: 0,
					limit: 5,
					sort: '-cut',
					nondeals: false,
					mature: false,
					filter: options.filter,
				})
				expectApiKeyHeader(calls[0])
			},
		)
	})
})
