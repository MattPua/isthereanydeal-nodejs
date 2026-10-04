import { describe, expect, test } from 'bun:test'
import { LookupService } from '../src/services/lookup.service'
import { API_KEY, expectApiKeyHeader, withMockFetch } from './setup'

describe('LookupService', () => {
	test('POSTs title lookup requests and returns the title mapping', async () => {
		const title = 'The Witcher 3'
		const gameId = '018d937f-3a29-72b9-888f-ecbf55a28e80'
		await withMockFetch({ [title]: gameId }, async (calls) => {
			const result = await new LookupService(API_KEY).lookupGamesByTitles([
				title,
			])

			expect(result[title]).toBe(gameId)
			expect(calls[0].url.pathname).toBe('/lookup/id/title/v1')
			expect(calls[0].init.method).toBe('POST')
			expect(JSON.parse(String(calls[0].init.body))).toEqual([title])
			expectApiKeyHeader(calls[0])
		})
	})

	test('POSTs shop ids using the documented shop lookup route', async () => {
		const gameId = '018d937f-3a29-72b9-888f-ecbf55a28e80'
		await withMockFetch({ '292030': gameId }, async (calls) => {
			const result = await new LookupService(API_KEY).lookupGamesByShopIds(61, [
				'292030',
			])

			expect(result['292030']).toBe(gameId)
			expect(calls[0].url.pathname).toBe('/lookup/id/shop/61/v1')
			expect(calls[0].init.method).toBe('POST')
			expect(JSON.parse(String(calls[0].init.body))).toEqual(['292030'])
			expectApiKeyHeader(calls[0])
		})
	})
})
