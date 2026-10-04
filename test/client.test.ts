import { describe, expect, test } from 'bun:test'
import { IsThereAnyDealClient } from '../src/client'
import { API_KEY, withMockFetch } from './setup'

describe('IsThereAnyDealClient authentication', () => {
	test('keeps the single-argument constructor and defaults to the auth header', async () => {
		await withMockFetch([], async (calls) => {
			const client = new IsThereAnyDealClient(API_KEY)
			await client.gamesService.searchForGame({ title: 'Test', results: 1 })

			expect(calls[0].url.searchParams.has('key')).toBe(false)
			expect(calls[0].init.headers).toMatchObject({ 'ITAD-API-Key': API_KEY })
		})
	})

	test('supports query-string auth when explicitly configured', async () => {
		await withMockFetch({}, async (calls) => {
			const client = new IsThereAnyDealClient(API_KEY, {
				apiKeyTransport: 'query',
			})
			await client.lookupService.lookupGamesByTitles(['Test'])

			expect(calls[0].url.searchParams.get('key')).toBe(API_KEY)
			expect(calls[0].init.headers).not.toHaveProperty('ITAD-API-Key')
		})
	})
})
