import type { WaitlistGame, WaitlistStatsResponse } from '../schemas'
import { BaseService } from './_base.service'

export class StatsService extends BaseService {
	constructor(apiKey: string) {
		super(apiKey, 'stats')
	}

	/**
	 * Gets waitlist statitics for a game
	 * @param gameId
	 * @param options
	 * @returns
	 */
	async waitlistStats(
		gameId: string,
		options: {
			country?: string
			bucket_price?: number
			bucket_cut?: number
		} = { country: 'US', bucket_price: 5, bucket_cut: 5 },
	): Promise<WaitlistStatsResponse> {
		const url = this.generateUrl(`/waitlist/v1`, { id: gameId, ...options })
		const response = await this.sendGETRequest<WaitlistStatsResponse>(url)
		return response
	}

	async getMostWaitlistedGames(
		options: { offset?: number; limit?: number } = { offset: 0, limit: 20 },
	): Promise<WaitlistGame[]> {
		const url = this.generateUrl(`/most-waitlisted/v1`, options)
		const response = await this.sendGETRequest<WaitlistGame[]>(url)
		return response
	}

	async getMostCollectedGames(
		options: { offset?: number; limit?: number } = { offset: 0, limit: 20 },
	): Promise<WaitlistGame[]> {
		const url = this.generateUrl(`/most-collected/v1`, options)
		const response = await this.sendGETRequest<WaitlistGame[]>(url)
		return response
	}

	async getMostPopularGames(
		options: { offset?: number; limit?: number } = { offset: 0, limit: 20 },
	): Promise<WaitlistGame[]> {
		const url = this.generateUrl(`/most-popular/v1`, options)
		const response = await this.sendGETRequest<WaitlistGame[]>(url)
		return response
	}
}
