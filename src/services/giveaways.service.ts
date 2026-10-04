import type { ApiKeyTransport } from '../client.types'
import type { Giveaway } from '../schemas/responses/giveaways.schema'
import { BaseService } from './_base.service'

export interface GiveawayListOptions {
	offset?: number
	limit?: number
	mature?: boolean
	expired?: boolean
	sort?: string
}

export interface GiveawaysForGameOptions {
	expired?: boolean
}

export class GiveawaysService extends BaseService {
	constructor(apiKey: string, apiKeyTransport: ApiKeyTransport = 'header') {
		super(apiKey, '', apiKeyTransport)
	}

	/**
	 * Gets the current giveaway list.
	 */
	async getGiveaways(options: GiveawayListOptions = {}): Promise<Giveaway[]> {
		const url = this.generateUrl('giveaways/v1', {
			offset: options.offset,
			limit: options.limit,
			mature: options.mature,
			expired: options.expired,
			sort: options.sort,
		})
		return this.sendGETRequest<Giveaway[]>(url)
	}

	/**
	 * Gets giveaways that include a game.
	 */
	async getGiveawaysForGame(
		gameId: string,
		options: GiveawaysForGameOptions = {},
	): Promise<Giveaway[]> {
		const url = this.generateUrl('games/giveaways/v1', {
			id: gameId,
			expired: false,
			...options,
		})
		return this.sendGETRequest<Giveaway[]>(url)
	}
}
