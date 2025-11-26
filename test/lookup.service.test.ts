import { describe, expect, test } from 'bun:test'
import { LookupService } from '../src/services/lookup.service'
import { getApiKey, getTestGameId, getTestGameTitle } from './setup'

describe('LookupService', () => {
	describe('lookupGamesByTitles', () => {
		test('should lookup games by titles correctly', async () => {
			const lookupService = new LookupService(getApiKey())
			const response = await lookupService.lookupGamesByTitles([
				getTestGameTitle(),
			])
			expect(response).toBeDefined()
			expect(response[getTestGameTitle()]).toBe(getTestGameId())
		})

		test('should fail to lookup games by non existing titles', async () => {
			const lookupService = new LookupService(getApiKey())
			const response = await lookupService.lookupGamesByTitles([
				'Non Existing Title',
			])
			expect(response).toBeDefined()
			expect(response['Non Existing Title']).toBeNull()
		})

		test('it should lookup multiple games by titles correctly', async () => {
			const lookupService = new LookupService(getApiKey())
			const titles = [
				getTestGameTitle(),
				'Cyberpunk 2077',
				'Elden Ring',
				"Assassin's Creed Odyssey",
			]
			const response = await lookupService.lookupGamesByTitles(titles)
			expect(response).toBeDefined()
			titles.forEach((title) => {
				expect(response[title]).toBeDefined()
				expect(response[title]).not.toBeNull()
			})
		})

		test('it should fail to lookup games by an empty array', async () => {
			const lookupService = new LookupService(getApiKey())
			await expect(lookupService.lookupGamesByTitles([])).rejects.toThrow()
		})
	})
})
