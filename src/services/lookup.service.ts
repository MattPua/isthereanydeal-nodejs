import type { ApiKeyTransport } from '../client.types'
import type {
	LookupGamesByShopIdsResponse,
	LookupGamesByTitlesResponse,
	LookupShopIdsByGameIdsResponse,
} from '../schemas/responses/lookup.schema'
import { BaseService } from './_base.service'

export class LookupService extends BaseService {
	constructor(apiKey: string, apiKeyTransport: ApiKeyTransport = 'header') {
		super(apiKey, 'lookup', apiKeyTransport)
	}

	/**
	 * Not a full search service, does lookup by matching the title, typos are variations may not give expected results.
	 * @param titles - The titles of the games to lookup. At minimum 1 title is required.
	 * @returns a mapping of title to game id
	 */
	async lookupGamesByTitles(
		titles: string[],
	): Promise<LookupGamesByTitlesResponse> {
		const url = this.generateUrl('/id/title/v1')
		const response = await this.sendPOSTRequest<
			LookupGamesByTitlesResponse,
			string[]
		>(url, titles)
		return response
	}

	/**
	 * Searches game ids by shop game id
	 * @param shopId
	 * @param shopGameIds
	 */
	async lookupGamesByShopIds(
		shopId: string | number,
		shopGameIds: string[],
	): Promise<LookupGamesByShopIdsResponse> {
		const url = this.generateUrl(`/id/shop/${shopId}/v1`)
		const response = await this.sendPOSTRequest<
			LookupGamesByShopIdsResponse,
			string[]
		>(url, shopGameIds)
		return response
	}

	/**
	 * Looks up shop product IDs for IsThereAnyDeal game IDs.
	 */
	async lookupShopIdsByGameIds(
		shopId: number,
		gameIds: string[],
	): Promise<LookupShopIdsByGameIdsResponse> {
		const url = this.generateUrl(`/shop/${shopId}/id/v1`)
		return this.sendPOSTRequest<LookupShopIdsByGameIdsResponse, string[]>(
			url,
			gameIds,
		)
	}
}
