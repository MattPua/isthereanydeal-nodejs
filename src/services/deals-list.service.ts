import type { ApiKeyTransport } from '../client.types'
import type {
	DealsList,
	DealsListOptions,
	DealsListPostOptions,
} from '../schemas/responses/deals-list.schema'
import { BaseService } from './_base.service'

export class DealsListService extends BaseService {
	constructor(apiKey: string, apiKeyTransport: ApiKeyTransport = 'header') {
		super(apiKey, 'deals', apiKeyTransport)
	}

	/**
	 * Get current deals. Will not get one game more than once in the list. For each game, best price is displayed ,ignoring stores that currently dont have a sale even if they have a better price
	 *
	 * @param options.country Two letter country code (ISO 3166-1 alpha-2)
	 * @param options.offset The offset of the deals list. Min 0
	 * @param options.limit The limit of the deals list. Min 1, default 20, max 200
	 * @param options.sort The sort of the deals list. '-cut' for highest cut, 'price' for lowest price
	 * @param options.nondeals Load non sale prices
	 * @param options.mature Load prices for mature content
	 * @param options.shops The shops to include in the list Comma separated list of shop ids.
	 * @param options.filter JSON filters or a pre-encoded filter string
	 *
	 * @returns The deals list
	 */
	async getDeals(options: DealsListOptions = {}): Promise<DealsList> {
		const request = this.withDefaults(options)
		const { filter, shops, ...params } = request
		const url = new URL(this.generateUrl('/v2', { ...params, shops }))
		if (filter !== undefined) {
			url.searchParams.set(
				'filter',
				typeof filter === 'string' ? filter : JSON.stringify(filter),
			)
		}
		return this.sendGETRequest<DealsList>(url.toString())
	}

	/**
	 * Gets current deals using the API's POST fallback and JSON request body.
	 * @param options Deal list options, including a JSON filter object
	 */
	async getDealsByPost(options: DealsListPostOptions = {}): Promise<DealsList> {
		const request = this.withDefaults(options)
		const body = {
			...request,
			shops:
				typeof request.shops === 'string'
					? request.shops.split(',').map(Number)
					: request.shops,
		}
		const url = this.generateUrl('/v2')
		return this.sendPOSTRequest<DealsList>(url, body)
	}

	private withDefaults(options: DealsListOptions) {
		return {
			country: 'US',
			offset: 0,
			limit: 20,
			sort: '-cut',
			nondeals: false,
			mature: false,
			...options,
		}
	}
}
